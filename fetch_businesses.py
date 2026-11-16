import os
import sys
import time
import requests
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
import re
import csv
from urllib.parse import urljoin, urlparse
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Load environment variables
load_dotenv('.env.local')
load_dotenv('.env')

DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in environment (.env.local or .env).")
    exit(1)

MAPS_API_KEY = "AIzaSyCCZwVrSEPX1Sqr2hlEt9jB5Qtht6pZWEo"

BLOB_TOKEN = os.environ.get('BLOB_READ_WRITE_TOKEN')
if not BLOB_TOKEN:
    print("Warning: BLOB_READ_WRITE_TOKEN not found in environment (.env.local). Images will not be uploaded to Vercel Blob.")

CSV_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "businesses.csv")

CSV_FIELDS = [
    "name",
    "slug",
    "category",
    "email",
    "phone",
    "website",
    "address",
    "city",
    "state",
    "zip",
    "formatted_address",
    "google_place_id",
    "google_maps_url",
    "rating",
    "user_rating_count",
    "description",
    "hours",
    "latitude",
    "longitude",
    "cover_image",
    "gallery",
    "status"
]

ALL_CATEGORIES_QUERIES = [
    "grocery in 90255",
    "restaurant in 90255",
    "store in 90255",
    "service in 90255",
    "health in 90255",
    "automotive in 90255",
    "beauty in 90255",
    "education in 90255",
    "entertainment in 90255",
    "real estate in 90255"
]

# Default search queries (can be passed via CLI: python3 fetch_businesses.py --all or specific query)
SEARCH_QUERIES = [
    "grocery in 90255",
    "restaurant in 90255",
    "store in 90255",
    "service in 90255",
    "health in 90255",
    "automotive in 90255",
    "beauty in 90255",
    "education in 90255",
    "entertainment in 90255",
    "real estate in 90255"
]

# Map Google Place primaryType / query to application categories
CATEGORY_MAPPING = {
    "restaurant": "restaurants",
    "mexican_restaurant": "restaurants",
    "bakery": "restaurants",
    "cafe": "restaurants",
    "fast_food_restaurant": "restaurants",
    "meal_takeaway": "restaurants",
    "grocery_store": "grocery",
    "supermarket": "grocery",
    "convenience_store": "grocery",
    "market": "grocery",
    "auto_repair": "auto-repair",
    "car_repair": "auto-repair",
    "car_dealer": "automotive",
    "gas_station": "automotive",
    "beauty_salon": "beauty-barber",
    "hair_salon": "beauty-barber",
    "barber_shop": "beauty-barber",
    "nail_salon": "beauty-barber",
    "spa": "beauty-barber",
    "doctor": "healthcare",
    "hospital": "healthcare",
    "dentist": "healthcare",
    "pharmacy": "healthcare",
    "medical_clinic": "healthcare",
    "lawyer": "legal",
    "legal_services": "legal",
    "real_estate_agency": "real-estate",
    "real_estate": "real-estate",
    "plumber": "home-services",
    "electrician": "home-services",
    "roofing_contractor": "home-services",
    "painter": "home-services",
    "general_contractor": "home-services",
    "clothing_store": "retail",
    "shoe_store": "retail",
    "jewelry_store": "retail",
    "electronics_store": "retail",
    "furniture_store": "retail",
    "department_store": "retail",
    "store": "retail",
    "accountant": "professional-services",
    "tax_preparation": "professional-services",
    "insurance_agency": "professional-services",
    "employment_agency": "professional-services",
    "gym": "fitness",
    "fitness_center": "fitness",
    "school": "education",
    "preschool": "education",
    "primary_school": "education",
    "secondary_school": "education",
    "tutoring_service": "education"
}

EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
IGNORE_EMAIL_EXTS = ('.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.bmp', '.tiff', '.css', '.js', '.ico', '.woff', '.woff2', '.pdf')
IGNORE_EMAIL_DOMAINS = ('example.com', 'domain.com', 'sentry.io', 'wixpress.com', 'wordpress.org', 'schema.org', 'cloudflare.com', 'github.com', 'google.com', 'facebook.com', 'instagram.com', 'twitter.com')
IGNORE_EMAIL_PREFIXES = ('noreply@', 'no-reply@', 'donotreply@', 'test@', 'demo@')

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def determine_category(place_type, query):
    if place_type and place_type.lower() in CATEGORY_MAPPING:
        return CATEGORY_MAPPING[place_type.lower()]
    q = query.lower()
    if "grocery" in q or "market" in q:
        return "grocery"
    if "restaurant" in q or "food" in q:
        return "restaurants"
    if "real estate" in q:
        return "real-estate"
    if "auto" in q or "car" in q:
        return "auto-repair"
    if "beauty" in q or "barber" in q:
        return "beauty-barber"
    if "health" in q or "doctor" in q or "clinic" in q or "dental" in q:
        return "healthcare"
    if "service" in q:
        return "professional-services"
    if "store" in q or "shop" in q:
        return "retail"
    if "education" in q or "school" in q:
        return "education"
    if "entertainment" in q:
        return "other"
    return "other"

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

def extract_emails_from_html(html):
    emails = set()
    # mailto links
    for m in re.findall(r'mailto:([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', html, re.IGNORECASE):
        cleaned = m.strip(".,;:()<>[]\"' ").lower()
        if is_valid_email(cleaned):
            emails.add(cleaned)

    # general regex
    for m in EMAIL_REGEX.findall(html):
        cleaned = m.strip(".,;:()<>[]\"' ").lower()
        if is_valid_email(cleaned):
            emails.add(cleaned)

    return emails

def is_valid_email(email):
    if not email or len(email) > 80:
        return False
    if any(email.endswith(ext) for ext in IGNORE_EMAIL_EXTS):
        return False
    if any(email.startswith(pre) for pre in IGNORE_EMAIL_PREFIXES):
        return False
    parts = email.split('@')
    if len(parts) != 2:
        return False
    user, domain = parts
    if not user or not domain or '.' not in domain or domain.startswith('.'):
        return False
    # TLD must be purely alphabetical (e.g., .com, .org, .net) and at least 2 chars (prevents package versions like core-js-bundle@3.2.1)
    tld = domain.split('.')[-1]
    if not tld.isalpha() or len(tld) < 2:
        return False
    if any(d in domain for d in IGNORE_EMAIL_DOMAINS):
        return False
    return True

def scrape_email_from_website(website_url):
    """
    Fetches the website homepage and contact pages to extract legitimate business emails.
    """
    if not website_url:
        return ""

    if not website_url.startswith(('http://', 'https://')):
        website_url = 'https://' + website_url

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }

    all_emails = set()
    try:
        resp = requests.get(website_url, headers=headers, timeout=4, verify=False, allow_redirects=True)
        if resp.status_code == 200:
            all_emails.update(extract_emails_from_html(resp.text))
            
            # If no email on homepage, search for internal contact/about links
            if not all_emails:
                contact_links = re.findall(r'href=["\']([^"\']*(?:contact|about|reach|connect)[^"\']*)["\']', resp.text, re.IGNORECASE)
                for link in contact_links[:2]:
                    if link.startswith('#') or link.startswith('javascript:'):
                        continue
                    target = urljoin(website_url, link)
                    if urlparse(target).netloc == urlparse(website_url).netloc:
                        try:
                            c_resp = requests.get(target, headers=headers, timeout=3, verify=False)
                            if c_resp.status_code == 200:
                                all_emails.update(extract_emails_from_html(c_resp.text))
                                if all_emails:
                                    break
                        except Exception:
                            pass
    except Exception:
        pass

    if not all_emails:
        return ""

    # Prioritize email matching business domain
    parsed = urlparse(website_url)
    domain_base = parsed.netloc.replace("www.", "").split(".")[0].lower()
    for em in all_emails:
        if domain_base in em:
            return em

    # Then standard business mailboxes
    for em in all_emails:
        if em.startswith(('info@', 'contact@', 'support@', 'sales@', 'office@', 'hello@', 'admin@', 'service@')):
            return em

    return sorted(list(all_emails))[0]

def upload_photo_to_blob(photo_name, blob_path):
    if not BLOB_TOKEN:
        return None
    url = f"https://places.googleapis.com/v1/{photo_name}/media?maxHeightPx=800&maxWidthPx=800&key={MAPS_API_KEY}"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            vercel_url = f"https://blob.vercel-storage.com/{blob_path}"
            headers = {
                "Authorization": f"Bearer {BLOB_TOKEN}",
                "x-add-random-suffix": "false",
                "Content-Type": "image/jpeg"
            }
            blob_res = requests.put(vercel_url, headers=headers, data=response.content)
            if blob_res.status_code in (200, 201):
                return blob_res.json().get("url")
            else:
                # Try POST fallback
                blob_res = requests.post(vercel_url, headers=headers, data=response.content)
                if blob_res.status_code in (200, 201):
                    return blob_res.json().get("url")
                else:
                    print(f"    Failed to upload to blob: {blob_res.text}")
    except Exception as e:
        print(f"    Failed to fetch/upload photo {photo_name}: {e}")
    return None

def get_category_cover_fallback(category, seed):
    """
    Looks inside public/category/{category} for available image files,
    and selects one deterministically based on seed (slug) to minimize repetition.
    More images in the folder = less repetition.
    """
    public_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")
    candidate_folders = [
        os.path.join(public_dir, "category", category),
        os.path.join(public_dir, "category", category.replace("-", "_")),
        os.path.join(public_dir, "category", "default"),
    ]
    
    image_exts = ('.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif', '.jxl')
    for folder in candidate_folders:
        if os.path.isdir(folder):
            files = sorted([f for f in os.listdir(folder) if not f.startswith('.') and f.lower().endswith(image_exts)])
            if files:
                rel_dir = os.path.relpath(folder, public_dir).replace('\\', '/')
                # Deterministic hash of seed (DJB2)
                h = 5381
                for ch in (seed or "default"):
                    h = ((h * 33) ^ ord(ch)) & 0xFFFFFFFF
                idx = h % len(files)
                return f"/{rel_dir}/{files[idx]}"
    return ""

def load_existing_csv(csv_path):
    records = {}
    if os.path.exists(csv_path):
        try:
            with open(csv_path, mode="r", encoding="utf-8", newline="") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    key = row.get("google_place_id") or row.get("slug") or row.get("name")
                    if key:
                        records[key] = row
            print(f"Loaded {len(records)} existing records from {csv_path}")
        except Exception as e:
            print(f"Warning: Could not read existing CSV: {e}")
    return records

def save_csv(csv_path, records):
    try:
        with open(csv_path, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=CSV_FIELDS, extrasaction="ignore")
            writer.writeheader()
            for row in records.values():
                writer.writerow(row)
    except Exception as e:
        print(f"Error saving CSV {csv_path}: {e}")

def sync_db_to_csv(cursor, records):
    """
    Syncs any existing businesses in PostgreSQL into the CSV in-memory records.
    """
    try:
        cursor.execute("""
            SELECT name, slug, category, email, phone, website, address, city, state, zip,
                   google_place_id, latitude, longitude, cover_image, gallery, status, description, hours
            FROM businesses
        """)
        rows = cursor.fetchall()
        added_count = 0
        for row in rows:
            (name, slug, category, email, phone, website, address, city, state, zip_code,
             place_id, lat, lng, cover, gallery, status, desc, hours) = row
            key = place_id or slug or name
            if key and key not in records:
                h_str = ""
                if hours:
                    if isinstance(hours, dict):
                        h_str = "; ".join(f"{k}: {v}" for k, v in hours.items())
                    else:
                        h_str = str(hours)
                g_str = "; ".join(gallery) if gallery else ""
                records[key] = {
                    "name": name or "",
                    "slug": slug or "",
                    "category": category or "",
                    "email": email or "",
                    "phone": phone or "",
                    "website": website or "",
                    "address": address or "",
                    "city": city or "",
                    "state": state or "",
                    "zip": zip_code or "",
                    "formatted_address": f"{address}, {city}, {state} {zip_code}".strip(", "),
                    "google_place_id": place_id or "",
                    "google_maps_url": f"https://maps.google.com/?q={lat},{lng}" if lat and lng else "",
                    "rating": "",
                    "user_rating_count": "",
                    "description": desc or "",
                    "hours": h_str,
                    "latitude": str(lat) if lat is not None else "",
                    "longitude": str(lng) if lng is not None else "",
                    "cover_image": cover or "",
                    "gallery": g_str,
                    "status": status or "published"
                }
                added_count += 1
        if added_count > 0:
            print(f"Synced {added_count} businesses from DB into CSV records.")
            save_csv(CSV_FILE_PATH, records)
    except Exception as e:
        print(f"Warning: Failed to sync DB to CSV: {e}")

def main():
    # Allow CLI arguments
    queries_to_run = SEARCH_QUERIES
    if len(sys.argv) > 1:
        if sys.argv[1] == "--all":
            queries_to_run = ALL_CATEGORIES_QUERIES
        else:
            queries_to_run = sys.argv[1:]

    print(f"Connecting to database: {DATABASE_URL}")
    try:
        conn = psycopg2.connect(DATABASE_URL)
    except Exception as e:
        print(f"Failed to connect to DB: {e}")
        return
        
    cursor = conn.cursor()

    # Ensure email column exists in businesses table
    cursor.execute("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS email text;")
    conn.commit()

    # Load existing CSV records
    csv_records = load_existing_csv(CSV_FILE_PATH)

    # Sync pre-existing businesses from DB into CSV
    sync_db_to_csv(cursor, csv_records)

    processed_place_ids = set()

    for query in queries_to_run:
        print(f"\n==========================================")
        print(f"Searching for: {query}")
        print(f"==========================================")
        
        page_token = None
        while True:
            url = "https://places.googleapis.com/v1/places:searchText"
            headers = {
                "X-Goog-Api-Key": MAPS_API_KEY,
                "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.addressComponents,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.location,places.primaryType,places.editorialSummary,places.rating,places.userRatingCount,places.googleMapsUri,places.photos,nextPageToken",
                "Content-Type": "application/json"
            }
            payload = {
                "textQuery": query,
                "pageSize": 20
            }
            if page_token:
                payload["pageToken"] = page_token
                
            try:
                response = requests.post(url, headers=headers, json=payload, timeout=15)
                data = response.json()
            except Exception as e:
                print(f"  Request failed: {e}")
                break
            
            if 'error' in data:
                print(f"  API Error: {data['error'].get('message', data['error'])}")
                break
                
            places = data.get('places', [])
            if not places:
                print(f"  No more results for query '{query}'.")
                break
                
            for place in places:
                place_id = place.get('id')
                name = place.get('displayName', {}).get('text', '')
                if not name:
                    continue
                    
                if place_id in processed_place_ids:
                    continue
                processed_place_ids.add(place_id)
                
                print(f"\nProcessing '{name}'...")
                
                # Check DB for existing business
                cursor.execute("SELECT id, cover_image, email, slug, description FROM businesses WHERE google_place_id = %s", (place_id,))
                existing = cursor.fetchone()
                
                if not existing:
                    cursor.execute("SELECT id, cover_image, email, slug, description FROM businesses WHERE name = %s", (name,))
                    existing = cursor.fetchone()
                
                formatted_address = place.get('formattedAddress', '')
                addr_components = place.get('addressComponents', [])
                address, city, state, zip_code = extract_address_components(addr_components, formatted_address)
                
                phone = place.get('nationalPhoneNumber', '')
                website = place.get('websiteUri', '')
                google_maps_url = place.get('googleMapsUri', '')
                rating = place.get('rating')
                user_rating_count = place.get('userRatingCount')
                description = place.get('editorialSummary', {}).get('text', '')
                
                lat = None
                lng = None
                if 'location' in place:
                    lat = place['location'].get('latitude')
                    lng = place['location'].get('longitude')
                
                hours_dict = None
                hours_str = ""
                if 'regularOpeningHours' in place and 'weekdayDescriptions' in place['regularOpeningHours']:
                    hours_list = place['regularOpeningHours']['weekdayDescriptions']
                    hours_dict = {}
                    for h in hours_list:
                        parts = h.split(':', 1)
                        if len(parts) == 2:
                            hours_dict[parts[0].strip()] = parts[1].strip()
                    hours_str = "; ".join(hours_list)

                primary_type = place.get('primaryType', '')
                category = determine_category(primary_type, query)

                # Determine Email
                email = ""
                if existing and existing[2]:
                    email = existing[2]
                    print(f"    Existing email: {email}")
                elif website:
                    print(f"    Scraping email from website: {website} ...")
                    email = scrape_email_from_website(website)
                    if email:
                        print(f"    ==> Found email: {email}")
                    else:
                        print("    ==> No email found on website.")
                else:
                    print("    No website available for email scraping.")

                # Slug calculation
                if existing and existing[3]:
                    slug = existing[3]
                else:
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

                # Description fallback
                if not description and existing and existing[4]:
                    description = existing[4]

                # Process Photos
                photos = place.get('photos', [])
                cover_image_path = existing[1] if existing and existing[1] else None
                gallery_paths = []
                
                if photos and not cover_image_path and BLOB_TOKEN:
                    print(f"    Uploading {min(len(photos), 5)} photos to Vercel Blob...")
                    folder = "real-estate" if category == "real-estate" else "businesses"
                    
                    # Cover photo
                    cover_blob_path = f"{folder}/{slug}/cover.jpg"
                    uploaded_cover = upload_photo_to_blob(photos[0]['name'], cover_blob_path)
                    if uploaded_cover:
                        cover_image_path = uploaded_cover
                        
                    # Gallery photos (next 4)
                    for i, photo in enumerate(photos[1:5]):
                        gallery_blob_path = f"{folder}/{slug}/gallery_{i+1}.jpg"
                        uploaded_gallery = upload_photo_to_blob(photo['name'], gallery_blob_path)
                        if uploaded_gallery:
                            gallery_paths.append(uploaded_gallery)

                # Fallback to local hardcoded category cover image from public/category/ if no cover image
                if not cover_image_path:
                    cover_image_path = get_category_cover_fallback(category, slug)
                    if cover_image_path:
                        print(f"    Assigned category cover fallback: {cover_image_path}")

                try:
                    if existing:
                        cursor.execute("""
                            UPDATE businesses 
                            SET email = COALESCE(NULLIF(%s, ''), email),
                                description = COALESCE(NULLIF(%s, ''), description),
                                category = %s,
                                google_place_id = COALESCE(google_place_id, %s),
                                cover_image = COALESCE(%s, cover_image),
                                gallery = CASE WHEN %s != ARRAY[]::text[] THEN %s ELSE gallery END
                            WHERE id = %s
                        """, (
                            email,
                            description,
                            category,
                            place_id,
                            cover_image_path,
                            gallery_paths,
                            gallery_paths,
                            existing[0]
                        ))
                        print(f"  Updated existing DB record '{name}'.")
                    else:
                        cursor.execute("""
                            INSERT INTO businesses (
                                name, slug, category, email, description, address, city, state, zip,
                                phone, website, hours, latitude, longitude, google_place_id,
                                cover_image, gallery, status
                            )
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'published')
                        """, (
                            name,
                            slug,
                            category,
                            email or None,
                            description or None,
                            address,
                            city,
                            state,
                            zip_code,
                            phone or None,
                            website or None,
                            Json(hours_dict) if hours_dict else None,
                            lat,
                            lng,
                            place_id,
                            cover_image_path,
                            gallery_paths,
                        ))
                        print(f"  Inserted new DB record '{name}'.")
                    
                    conn.commit()
                except Exception as e:
                    conn.rollback()
                    print(f"  Error DB operation for '{name}': {e}")

                # Save / Update in CSV
                csv_key = place_id or slug or name
                csv_records[csv_key] = {
                    "name": name,
                    "slug": slug,
                    "category": category,
                    "email": email or "",
                    "phone": phone or "",
                    "website": website or "",
                    "address": address or "",
                    "city": city or "",
                    "state": state or "",
                    "zip": zip_code or "",
                    "formatted_address": formatted_address or "",
                    "google_place_id": place_id or "",
                    "google_maps_url": google_maps_url or "",
                    "rating": rating if rating is not None else "",
                    "user_rating_count": user_rating_count if user_rating_count is not None else "",
                    "description": description or "",
                    "hours": hours_str or "",
                    "latitude": str(lat) if lat is not None else "",
                    "longitude": str(lng) if lng is not None else "",
                    "cover_image": cover_image_path or "",
                    "gallery": "; ".join(gallery_paths) if gallery_paths else "",
                    "status": "published"
                }

                # Flush to CSV immediately
                save_csv(CSV_FILE_PATH, csv_records)

            page_token = data.get('nextPageToken')
            if not page_token:
                break
            else:
                print("Fetching next page of results...")
                time.sleep(2)

    cursor.close()
    conn.close()
    print(f"\nDone syncing businesses! Saved {len(csv_records)} total records to {CSV_FILE_PATH}")

if __name__ == "__main__":
    main()
