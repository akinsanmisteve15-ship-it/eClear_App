import os
import requests
import json
import sys

print("--- DEBUG START ---")

# 1. Check Key
SERP_KEY = os.environ.get("SERPAPI_KEY")
print(f"Key Found: {'Yes' if SERP_KEY else 'No'}")

# 2. Data Container
all_events = [{"title": "System Check", "status": "Script Ran Successfully"}]

# 3. Targeted Fetch
try:
    print("Attempting SerpApi Fetch for Lagos...")
    url = f"https://serpapi.com/search?engine=google_events&q=Events+in+Lagos+2026&api_key={SERP_KEY}"
    r = requests.get(url, timeout=15)
    print(f"HTTP Status: {r.status_code}")
    
    data = r.json()
    results = data.get('events_results', [])
    print(f"Events Found: {len(results)}")
    
    for e in results:
        all_events.append({"title": e.get('title'), "city": "Lagos", "source": "SerpApi"})
except Exception as e:
    print(f"❌ FETCH ERROR: {e}")

# 4. FORCE SAVE (The "Fix")
try:
    file_path = "global_leads.json"
    with open(file_path, 'w') as f:
        json.dump(all_events, f, indent=4)
    print(f"✅ FILE CREATED AT: {os.path.abspath(file_path)}")
    print(f"File Size: {os.path.getsize(file_path)} bytes")
except Exception as e:
    print(f"❌ SAVE ERROR: {e}")

print("--- DEBUG END ---")