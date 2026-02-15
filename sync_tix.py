import os, requests, json
from datetime import datetime

PHQ_TOKEN = os.getenv('PREDICTHQ_TOKEN')
# THE TARGET: This is where leads wait for your approval
PENDING_FILE = "pending_events.json"

def run_sync():
    print("📡 Admin Queue: Fetching Lagos leads...")
    
    if not PHQ_TOKEN:
        print("❌ Error: PREDICTHQ_TOKEN missing.")
        return

    url = "https://api.predicthq.com/v1/events/"
    headers = {"Authorization": f"Bearer {PHQ_TOKEN}", "Accept": "application/json"}
    params = {
        "place.scope": "2332459", # Lagos
        "active.gte": datetime.now().strftime('%Y-%m-%d'),
        "category": "concerts,festivals,performing-arts",
        "limit": 30
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        results = response.json().get('results', [])
        
        leads = []
        for ev in results:
            leads.append({
                "id": ev.get('id'),
                "title": ev.get('title'),
                "thumbnail": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
                "date": {"start_date": ev.get('start')},
                "address": ["Lagos, Nigeria"],
                "category": ev.get('category'),
                "source": "PredictHQ Intelligence"
            })
        
        with open(PENDING_FILE, 'w') as f:
            json.dump(leads, f, indent=4)
        
        print(f"📥 Success! {len(leads)} leads moved to the Admin Queue.")

    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    run_sync()