import os
import time
import requests
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
import re

# Load environment variables from .env.local and .env
load_dotenv('.env.local')
load_dotenv('.env')

DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in environment (.env.local or .env).")
    exit(1)

MAPS_API_KEY = "AIzaSyCCZwVrSEPX1Sqr2hlEt9jB5Qtht6pZWEo"

SEARCH_QUERIES = [
    "restaurant in 90255",
    "store in 90255",
    "service in 90255",
    "health in 90255",
    "automotive in 90255",
    "beauty in 90255",
    "education in 90255",
    "entertainment in 90255",
    "real estate in 90255",
    "grocery in 90255"
]

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def extract_address_components(components, formatted_address):
    street_number = ""
    route = ""
    city = "Huntington Park"
    state = "CA"
    zip_code = "90255"

    for component in components:
        types = component.get("types", [])
        if "street_number" in types:
            street_number = component.get("longText", "")
        elif "route" in types:
            route = component.get("longText", "")
        elif "locality" in types:
            city = component.get("longText", city)
        elif "administrative_area_level_1" in types:
            state = component.get("shortText", state)
        elif "postal_code" in types:
            zip_code = component.get("longText", zip_code)
            
    address = f"{street_number} {route}".strip()
    if not address and formatted_address:
        address = formatted_address.split(',')[0]
        
    return address, city, state, zip_code

def main():
    print(f"Connecting to database: {DATABASE_URL}")
    try:
        conn = psycopg2.connect(DATABASE_URL)
    except Exception as e:
        print(f"Failed to connect to DB: {e}")
        return
        
    cursor = conn.cursor()
    processed_place_ids = set()

    for query in SEARCH_QUERIES:
        print(f"\n--- Searching for: {query} ---")
        
        page_token = None
        while True:
            url = "https://places.googleapis.com/v1/places:searchText"
            headers = {
                "X-Goog-Api-Key": MAPS_API_KEY,
                "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.addressComponents,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.location,places.primaryType,nextPageToken",
                "Content-Type": "application/json"
            }
            payload = {
                "textQuery": query,
                "pageSize": 20
            }
            if page_token:
                payload["pageToken"] = page_token
                
            response = requests.post(url, headers=headers, json=payload)
            data = response.json()
            
            if 'error' in data:
                print(f"  API Error: {data['error'].get('message', data['error'])}")
                break
                
            places = data.get('places', [])
            if not places:
                print(f"  No results found for this query or reached end of results.")
                break
                
            for place in places:
                place_id = place.get('id')
                name = place.get('displayName', {}).get('text', '')
                if not name:
                    continue
                    
                if place_id in processed_place_ids:
                    continue
                processed_place_ids.add(place_id)
                
                cursor.execute("SELECT id FROM businesses WHERE google_place_id = %s", (place_id,))
                if cursor.fetchone():
                    print(f"  Already exists in database (by place_id). Skipping.")
                    continue
                
                cursor.execute("SELECT id FROM businesses WHERE name = %s", (name,))
                if cursor.fetchone():
                    print(f"  '{name}' already exists in database (by name). Skipping.")
                    continue
                
                print(f"Processing '{name}'...")
                
                formatted_address = place.get('formattedAddress', '')
                addr_components = place.get('addressComponents', [])
                address, city, state, zip_code = extract_address_components(addr_components, formatted_address)
                
                phone = place.get('nationalPhoneNumber', '')
                website = place.get('websiteUri', '')
                
                lat = None
                lng = None
                if 'location' in place:
                    lat = place['location'].get('latitude')
                    lng = place['location'].get('longitude')
                
                hours_dict = None
                if 'regularOpeningHours' in place and 'weekdayDescriptions' in place['regularOpeningHours']:
                    hours_list = place['regularOpeningHours']['weekdayDescriptions']
                    hours_dict = {}
                    for h in hours_list:
                        parts = h.split(':', 1)
                        if len(parts) == 2:
                            hours_dict[parts[0].strip()] = parts[1].strip()

                category = place.get('primaryType', 'general')
                
                try:
                    base_slug = slugify(name)
                    slug = base_slug
                    counter = 1
                    while True:
                        cursor.execute("SELECT id FROM businesses WHERE slug = %s", (slug,))
                        if cursor.fetchone():
                            slug = f"{base_slug}-{counter}"
                            counter += 1
                        else:
                            break
                            
                    cursor.execute("""
                        INSERT INTO businesses (name, slug, category, address, city, state, zip, phone, website, hours, latitude, longitude, google_place_id, status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'published')
                    """, (name, slug, category, address, city, state, zip_code, phone, website, Json(hours_dict) if hours_dict else None, lat, lng, place_id))
                    print(f"  Inserted new record.")
                    
                    conn.commit()
                except Exception as e:
                    conn.rollback()
                    print(f"  Error DB operation for '{name}': {e}")
                
            page_token = data.get('nextPageToken')
            if not page_token:
                break
            else:
                print("Fetching next page of results...")
                time.sleep(2)

    cursor.close()
    conn.close()
    print("\nDone syncing businesses!")

if __name__ == "__main__":
    main()
