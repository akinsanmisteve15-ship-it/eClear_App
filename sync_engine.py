import requests
import json
import os
from datetime import datetime

# --- CREDENTIALS (Loaded from Environment for Security) ---
EB_TOKEN = os.environ.get("EVENTBRITE_TOKEN")
SERP_KEY = os.environ.get("SERPAPI_KEY")
OUTPUT_FILE = "tix-events-cache.json"

# --- TARGETS ---
CITIES = ["Lagos", "London", "New York", "Abuja"]
KEYWORDS = ["house music", "mask party", "techno", "rave", "rooftop mixer"]

def get_eventbrite_niche(city):
    """Pulls niche, guestlist-style events using OAuth2."""
    if not EB_TOKEN:
        print("⚠️ Eventbrite Token missing. Skipping...")
        return []

    print(f"📡 Eventbrite [IRT]: Scanning {city} for {', '.join(KEYWORDS[:2])}...")
    url = "https://www.eventbriteapi.com/v3/events/search/"
    headers = {"Authorization": f"Bearer {EB_TOKEN}"}
    
    refined = []
    # Note: Eventbrite search requires specific parameters. 
    # This searches by city name and keywords.
    for query in KEYWORDS:
        params = {
            "q": query,
            "location.address": city,
            "expand": "venue,ticket_availability"
        }
        try:
            res = requests.get(url, headers=headers, params=params)
            data = res.json()
            
            for ev in data.get('events', []):
                # INTELLIGENCE: Access Labeling
                is_free = ev.get('is_free', False)
                description = ev.get('description', {}).get('text', '').lower()
                
                access = "Paid Entry"
                if is_free: access = "Open Access"
                if "guestlist" in description or "invite only" in description:
                    access = "Guestlist Only"

                refined.append({
                    "id": f"eb_{ev['id']}",
                    "title": ev['name']['text'],
                    "thumbnail": ev.get('logo', {}).get('url', ''),
                    "date": {"start_date": ev['start']['local']},
                    "address": [ev.get('venue', {}).get('address', {}).get('localized_address_display', city)],
                    "access_type": access,
                    "source": "Eventbrite",
                    "needs_upscale": True # Trigger for the 4K Image Engine
                })
        except: continue
    return refined

def get_google_mainstream(city):
    """Pulls verified mainstream events via SerpApi."""
    if not SERP_KEY:
        print("⚠️ SerpApi Key missing. Skipping...")
        return []

    print(f"📡 Google Events: Syncing verified feed for {city}...")
    url = "https://serpapi.com/search"
    params = {
        "engine": "google_events",
        "q": f"events in {city}",
        "api_key": SERP_KEY
    }
    
    refined = []
    try:
        res = requests.get(url, params=params)
        data = res.json()
        for ev in data.get('events_results', []):
            refined.append({
                "id": f"gg_{ev.get('title', '')[:5]}_{ev.get('date', {}).get('start_time', '')}",
                "title": ev.get('title'),
                "thumbnail": ev.get('thumbnail'),
                "date": {"start_date": ev.get('date', {}).get('start_time', 'Upcoming')},
                "address": [ev.get('address', [city])[0]],
                "access_type": "Verified Tix", 
                "source": "Google",
                "needs_upscale": True
            })
    except: pass
    return refined

def main():
    print(f"🚀 eClear Intelligence Engine Start: {datetime.now()}")
    master_feed = []

    for city in CITIES:
        # Pull from both sources
        eb_events = get_eventbrite_niche(city)
        gg_events = get_google_mainstream(city)
        
        # Merge
        master_feed.extend(eb_events)
        master_feed.extend(gg_events)

    # De-duplicate by title (Simple approach)
    seen = set()
    unique_feed = []
    for ev in master_feed:
        if ev['title'] not in seen:
            unique_feed.append(ev)
            seen.add(ev['title'])

    # Write to the cache file
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(unique_feed, f, indent=4)
    
    print(f"✅ Sync Finished. {len(unique_feed)} unique events cached for eClear.")

if __name__ == "__main__":
    main()