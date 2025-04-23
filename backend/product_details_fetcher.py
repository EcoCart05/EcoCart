import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Try Gemini API (google-generativeai)
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# Try SerpApi
try:
    from serpapi import GoogleSearch
    SERPAPI_AVAILABLE = True
except ImportError:
    SERPAPI_AVAILABLE = False

def fetch_product_name_desc_url(product_name: str, user_preferences=None):
    """
    Fetch product name, description, and Ecovians URL, personalized by user preferences.
    Only return if product matches at least one user preference, otherwise return None.
    """
    load_dotenv()
    desc = ''
    if user_preferences is None:
        user_preferences = []
    # Lowercase preferences for comparison
    user_preferences = [p.lower() for p in user_preferences]

    # Try Gemini API first
    if GEMINI_AVAILABLE and os.getenv('GEMINI_API_KEY'):
        try:
            genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
            model = genai.GenerativeModel('gemini-pro')
            prompt = f"Provide a high-quality product image URL and a brief description for the product: {product_name}. Respond as JSON with 'image' and 'description'."
            response = model.generate_content(prompt)
            import json
            # Gemini's response might be a string or already a dict
            if hasattr(response, 'text'):
                gemini_data = json.loads(response.text)
            else:
                gemini_data = response
            image_url = gemini_data.get('image', '')
            desc = gemini_data.get('description', '')
            if image_url and desc:
                gemini_success = True
        except Exception as e:
            gemini_success = False

    # Try SerpApi if Gemini fails
    if not gemini_success and SERPAPI_AVAILABLE and serpapi_key:
        try:
            params = {
                "q": product_name,
                "tbm": "shop",
                "api_key": serpapi_key
            }
            search = GoogleSearch(params)
            results = search.get_dict()
            products = results.get('shopping_results', [])
            if products:
                prod = products[0]
                image_url = prod.get('thumbnail', '') or prod.get('image', '')
                desc = prod.get('title', '') + ". " + prod.get('description', '') if prod.get('description') else prod.get('title', '')
                # Simple eco-score inference: look for keywords
                eco_score = 50
                lower = (desc or '').lower()
                if 'eco' in lower or 'organic' in lower or 'biodegradable' in lower or 'sustainable' in lower:
                    eco_score += 25
                if 'plastic' in lower or 'non-recyclable' in lower:
                    eco_score -= 20
                eco_score = max(0, min(100, eco_score))
                serpapi_success = True
        except Exception as e:
            serpapi_success = False

    # Fallback: Web scraping if both Gemini and SerpApi fail
    if not gemini_success and not serpapi_success:
        # Try scraping EarthHero
        try:
            eh_url = f'https://earthhero.com/search?type=product&q={product_name.replace(" ", "+")}'
            resp = requests.get(eh_url, timeout=7)
            soup = BeautifulSoup(resp.text, 'html.parser')
            product_card = soup.select_one('.boost-pfs-filter-product-item')
            if product_card:
                img_elem = product_card.select_one('img')
                if img_elem and img_elem.get('src'):
                    image_url = img_elem['src']
                title_elem = product_card.select_one('.boost-pfs-filter-product-title')
                desc = title_elem.text.strip() if title_elem else product_name
                # Try to infer eco-score from badges/materials
                badges = [b.text.strip().lower() for b in product_card.select('.boost-pfs-filter-product-item-badge')]
                eco_score = 50
                for badge in badges:
                    if 'organic' in badge or 'eco' in badge or 'biodegradable' in badge or 'sustainable' in badge:
                        eco_score += 20
                    if 'plastic' in badge or 'non-recyclable' in badge:
                        eco_score -= 15
                eco_score = max(0, min(100, eco_score))
            else:
                raise Exception('No product card found on EarthHero')
        except Exception:
            # Try scraping Ecovians for the product image
            try:
                search_url = f'https://www.ecovians.com/search?q={product_name.replace(" ", "+")}'
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
                resp = requests.get(search_url, headers=headers, timeout=7)
                soup = BeautifulSoup(resp.text, 'html.parser')
                cards = soup.select('.product-card')
                found = False
                for card in cards:
                    title = card.select_one('.product-card-title')
                    if title and product_name.lower() in title.text.lower():
                        img_elem = card.select_one('img')
                        if img_elem and img_elem.get('src'):
                            image_url = img_elem['src']
                            # If relative URL, prepend domain
                            if image_url.startswith('/'):
                                image_url = 'https://www.ecovians.com' + image_url
                        desc = title.text.strip()
                        badges = []
                        if 'organic' in desc.lower() or 'eco' in desc.lower() or 'biodegradable' in desc.lower() or 'sustainable' in desc.lower():
                            eco_score = 80
                        elif 'plastic' in desc.lower() or 'non-recyclable' in desc.lower():
                            eco_score = 40
                        else:
                            eco_score = 60
                        found = True
                        break
                if not found:
                    raise Exception('No matching product found on Ecovians')
            except Exception:
                # Fallback to Google Images and Wikipedia as before
                search_url = f'https://www.google.com/search?tbm=isch&q={product_name.replace(" ", "+")}'
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
                try:
                    resp = requests.get(search_url, headers=headers, timeout=5)
                    soup = BeautifulSoup(resp.text, 'html.parser')
                    img_tags = soup.find_all('img')
                    for img_tag in img_tags[1:]:
                        src = img_tag.get('src')
                        if src and not src.startswith('data:') and src.startswith('http'):
                            image_url = src
                            break
                except Exception as e:
                    image_url = ''
                wiki_url = f'https://en.wikipedia.org/wiki/{product_name.replace(" ", "_")}'
                try:
                    resp = requests.get(wiki_url, headers=headers, timeout=5)
                    soup = BeautifulSoup(resp.text, 'html.parser')
                    p_tag = soup.find('p')
                    if p_tag:
                        desc = p_tag.text.strip()
                except Exception:
                    desc = ''
                import random
                eco_score = random.randint(40, 100)

    # Hardcoded fallback images for demo products
    fallback_data = {
        "Eco-Friendly Toothbrush": {
            "image": "https://images.earthhero.com/wp-content/uploads/2022/08/Brush-with-Bamboo-Adult-Toothbrush-1.jpg",
            "ecoScore": 90,
            "description": "A sustainable toothbrush made from bamboo, fully compostable and eco-friendly."
        },
        "Reusable Shopping Bag": {
            "image": "https://images.earthhero.com/wp-content/uploads/2021/05/ChicoBag-Original-Reusable-Shopping-Bag-EarthHero.jpg",
            "ecoScore": 85,
            "description": "Durable, reusable shopping bag made from recycled materials."
        },
        "Bamboo Cutlery Set": {
            "image": "https://images.earthhero.com/wp-content/uploads/2018/11/Bamboo-Travel-Utensil-Set-To-Go-Ware-EarthHero-1.jpg",
            "ecoScore": 88,
            "description": "Portable cutlery set crafted from renewable bamboo. Perfect for zero-waste living."
        },
        "Solar Powered Charger": {
            "image": "https://images.earthhero.com/wp-content/uploads/2019/04/GoSun-Solar-Charger-EarthHero-1.jpg",
            "ecoScore": 92,
            "description": "Charge your devices using clean solar energy. Great for travel and outdoor adventures."
        },
        "Compostable Trash Bags": {
            "image": "https://images.earthhero.com/wp-content/uploads/2018/05/UNNI-Compostable-Bags-EarthHero-1.jpg",
            "ecoScore": 95,
            "description": "Trash bags that break down in compost, reducing landfill waste."
        },
    }
    # Provide richer, human-friendly descriptions for known products
    friendly_descriptions = {
        "Eco-Friendly Toothbrush": "A sustainable toothbrush made from bamboo, fully compostable and eco-friendly. Helps reduce plastic waste in your daily routine.",
        "Reusable Shopping Bag": "A durable, reusable shopping bag made from recycled materials. Perfect for groceries and reducing single-use plastic.",
        "Bamboo Cutlery Set": "A portable cutlery set crafted from renewable bamboo. Ideal for zero-waste living and eating on the go.",
        "Solar Powered Charger": "Charge your devices anywhere using clean solar energy. Great for travel, camping, and outdoor adventures.",
        "Compostable Trash Bags": "Trash bags that break down in compost, reducing landfill waste and supporting a greener planet."
    }
    # Build product URL (prefer Ecovians if possible)
    ecovians_search_url = f'https://www.ecovians.com/search?q={product_name.replace(" ", "+")}'
    product_url = ecovians_search_url
    # Try to find a direct product page on Ecovians
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
        resp = requests.get(ecovians_search_url, headers=headers, timeout=7)
        soup = BeautifulSoup(resp.text, 'html.parser')
        cards = soup.select('.product-card')
        for card in cards:
            title = card.select_one('.product-card-title')
            link = card.select_one('a')
            if title and link and product_name.lower() in title.text.lower():
                href = link.get('href')
                if href:
                    if href.startswith('/'):
                        product_url = 'https://www.ecovians.com' + href
                    else:
                        product_url = href
                # Use the friendly description if available, otherwise Ecovians title
                desc = friendly_descriptions.get(product_name, title.text.strip())
                break
    except Exception:
        pass
    # Use friendly description for known products if not found above
    if not desc:
        desc = friendly_descriptions.get(product_name, 'No description available.')
    # Only return if product matches user preferences, otherwise return None
    match_found = False
    for pref in user_preferences:
        if pref in product_name.lower() or pref in (desc or '').lower():
            match_found = True
            break
    if user_preferences and not match_found:
        return None
    # Assign ecoScore for known products, otherwise infer from description
    eco_scores = {
        "Eco-Friendly Toothbrush": 90,
        "Reusable Shopping Bag": 85,
        "Bamboo Cutlery Set": 88,
        "Solar Powered Charger": 92,
        "Compostable Trash Bags": 95
    }
    eco_score = eco_scores.get(product_name)
    if eco_score is None:
        # Infer ecoScore from description keywords
        lower_desc = desc.lower() if desc else ''
        eco_score = 60
        if any(word in lower_desc for word in ["eco", "organic", "biodegradable", "sustainable"]):
            eco_score = 80
        if any(word in lower_desc for word in ["plastic", "non-recyclable"]):
            eco_score = 40
    return {
        'name': product_name,
        'description': desc,
        'url': product_url,
        'ecoScore': eco_score
    }
