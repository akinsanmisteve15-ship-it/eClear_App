import requests
from bs4 import BeautifulSoup
import json
import os
import hashlib
import time
from datetime import datetime
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

TARGET_URLS = [
    {"name": "Obi's House", "url": "https://afropass.io/organizer/obis-house", "type": "culture"},
    {"name": "Soakers Escapade", "url": "https://www.jetronticket.com/hosts/8pzTLExI", "type": "rave"},
    {"name": "Bature Brew House", "url": "https://www.baturebrewery.com/events", "type": "lifestyle"},
    {"name": "Lagos Polo Club", "url": "https://www.lagospolong.com/events/tournament-calendar", "type": "society"},
    {"name": "Terra Kulture", "url": "https://terrakulture.com/category/events-at-terra/", "type": "arts"}
]

def deep_extract_events(soup, site_name):
    """Attempt to find actual event titles and dates instead of just venue info"""
    events = []
    
    # Logic for Afropass / Jetron style lists
    # They usually store event names in h2, h3 or specific classes
    containers = soup.find_all(['h2', 'h3', 'h4', 'div'], class_=True)
    
    for item in containers:
        text = item.get_text().strip()
        # Filter for 2026 events specifically
        if any(month in text.lower() for month in ["feb", "mar", "apr", "2026"]):
            events.append(text)
            
    return list(set(events))[:3] # Return top 3 unique detections

def run_intelligent_scraper():
    print(f"📡 [DEEP INTEL] Extracting Actual Events: {datetime.now().strftime('%H:%M:%S')}")
    
    PENDING_FILE = "pending_events.json"
    new_leads = []
    headers = {'User-Agent': 'Mozilla/5.0'}

    for target in TARGET_URLS:
        try:
            print(f"🔍 Deep Scanning {target['name']}...")
            res = requests.get(target['url'], headers=headers, timeout=20, verify=False)
            
            if res.status_code == 200:
                soup = BeautifulSoup(res.text, 'html.parser')
                
                # NEW: Find actual event names on the page
                detected_events = deep_extract_events(soup, target['name'])
                
                if detected_events:
                    for event_name in detected_events:
                        new_leads.append({
                            "id": f"evt_{int(time.time())}",
                            "title": event_name, # THE ACTUAL EVENT NAME
                            "venue": target['name'],
                            "source": target['url'],
                            "category": target['type'],
                            "scraped_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
                            "snippet": soup.get_text()[:300].strip() # Still keeping context
                        })
                        print(f"  ✨ CONFIRMED: Found '{event_name}'")
                else:
                    print(f"  ⏭️ No specific 2026 events named on {target['name']} landing page.")
        except Exception as e:
            continue
        def categorize_lead(text, price_found):
    text = text.lower()
    # TIER 1: RESERVATION / INVITE
    if any(word in text for word in ["table", "reservation", "inquiry", "dm for", "rsvp", "invite only", "booking"]):
        return "Reservation/Invite"
    # TIER 2: PAID
    if price_found or any(word in text for word in ["ticket", "buy", "₦", "$", "price"]):
        return "Paid"
    # TIER 3: FREE
    return "Free"

    if new_leads:
        with open(PENDING_FILE, 'w') as f:
            json.dump(new_leads, f, indent=4)
        print(f"\n🚀 {len(new_leads)} Actual Events confirmed and sent to Dashboard.")
    else:
        print("\n😴 Scraper ran but found no specific event titles.")

if __name__ == "__main__":
    run_intelligent_scraper()