import requests
import json
import os
from datetime import datetime

# --- CONFIGURATION ---
EVENTBRITE_TOKEN = "AH4U5YRD7FQPIJDXVWPL"
SERPAPI_KEY = "787b3c08404a98e0d76ffb514ea83ede5c05872877dff2b9810cb3e22461bbbe"
OUTPUT_FILE = "tix-events-cache.json"

# Locations to sync
CITIES = ["Lagos", "London", "New York", "Abuja"]

def get_eventbrite_events(city):
    """Pulls niche events from Eventbrite using OAuth2."""
    print(f"📡 Eventbrite: Fetching events for {city}...")
    url = f"https://www.eventbriteapi.com/v3/events/search/"
    headers = {"Authorization": f"Bearer {EVENTBRITE_TOKEN}"}
    params = {
        "location.address": city,
        "expand": "venue,ticket_availability",
        "q": "house music, mask party, tech mixer" # Your specific niche
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        data = response.json()
        
        refined_events = []
        for ev in data.get('events', []):
            # INTELLIGENCE: Labeling based on ticket status
            is_free = ev.get('is_free', False)
            access_label = "Open Access" if is_free else "Paid Entry"
            
            # Logic for "Guestlist" (often niche house parties)
            if "guestlist" in ev.get('description', {}).get('text', '').lower():
                access_label = "Guestlist Only"

            refined_events.append({
                "id": f"eb_{ev['id']}",
                "title": ev['name']['text'],
                "description": ev['description']['text'],
                "thumbnail": ev.get('logo', {}).get('url', 'assets/default_event.jpg'),
                "date": {"start_date": ev['start']['local']},
                "address": [ev.get('venue', {}).get('address', {}).get('localized_address_display', city)],
                "access_type": access_label,
                "source": "Eventbrite",
                "needs_upscale": True # Flag for the Image Engine
            })
        return refined_events
    except Exception as e:
        print(f"❌ Eventbrite Error: {e}")
        return []

def get_google_events(city):
    """Pulls mainstream events via SerpApi."""
    print(f"📡 Google: Fetching events for {city}...")
    url = "https://serpapi.com/search"
    params = {
        "engine": "google_events",
        "q": f"Events in {city}",
        "api_key": SERPAPI_KEY
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        refined_events = []
        for ev in data.get('events_results', []):
            refined_events.append({
                "id": f"gg_{ev.get('title', '')[:5]}_{ev.get('date', {}).get('start_time', '')}",
                "title": ev.get('title'),
                "thumbnail": ev.get('thumbnail'),
                "date": {"start_date": ev.get('date', {}).get('start_time', 'Upcoming')},
                "address": [ev.get('address', [city])[0]],
                "access_type": "Verified Tix", # Default for Google verified listings
                "source": "Google",
                "needs_upscale": True
            })
        return refined_events
    except Exception as e:
        print(f"❌ Google Error: {e}")
        return []

def trigger_image_upscale(event_list):
    """
    Placeholder for the AI Image Engine.
    In the next step, we will connect this to an Image API to replace 
    'needs_upscale' thumbnails with 4K renders.
    """
    print(f"🎨 Visualizer: Refining {len(event_list)} event posters...")
    # Logic to generate and save local 4K posters goes here
    return event_list

def main():
    master_feed = []
    
    for city in CITIES:
        # PULL & MERGE
        eb_data = get_eventbrite_events(city)
        gg_data = get_google_events(city)
        
        master_feed.extend(eb_data)
        master_feed.extend(gg_data)

    # REFINED IMAGE SYNC
    master_feed = trigger_image_upscale(master_feed)

    # SAVE TO CACHE
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(master_feed, f, indent=4)
    
    print(f"✅ Sync Complete. {len(master_feed)} events refined and saved to {OUTPUT_FILE}.")

if __name__ == "__main__":
    main()