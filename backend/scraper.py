import requests
from bs4 import BeautifulSoup
from typing import List, Dict

# Example: Scrape eco-friendly products from EarthHero (adjust selectors as needed)
def scrape_earthhero() -> List[Dict]:
    url = "https://earthhero.com/collections/all"
    print(f"Fetching {url}")
    resp = requests.get(url)
    print("Status code:", resp.status_code)
    print("First 500 chars of HTML:", resp.text[:500])
    soup = BeautifulSoup(resp.text, "html.parser")
    products = []
    for item in soup.select(".boost-pfs-filter-product-item"):
        print("Found a product card")
        try:
            # Try to get the image element by the given class
            img_elem = item.select_one(".boost-pfs-filter-product-item-flip-image")
            img = None
            if img_elem:
                img = img_elem.get('data-src') or img_elem.get('src')
            # Try to use the alt text of the image as the title if product title is missing
            title_elem = item.select_one(".boost-pfs-filter-product-title")
            title = title_elem.text.strip() if title_elem else (img_elem.get('alt').strip() if img_elem and img_elem.get('alt') else "No title")
            # Try to find price
            price_elem = item.select_one(".boost-pfs-filter-product-item-sale-price")
            price = price_elem.text.strip().replace("$", "") if price_elem and price_elem.text else "0"
            # Try to find brand
            brand_elem = item.select_one(".boost-pfs-filter-product-vendor")
            brand = brand_elem.text.strip() if brand_elem else "No brand"
            # Try to find URL
            url_elem = item.select_one("a")
            url = url_elem['href'] if url_elem and url_elem.has_attr('href') else ""
            desc = ""
            materials = []
            badges = []
            print(f"Parsed product: title={title}, price={price}, brand={brand}, img={img}, url={url}")
            products.append({
                "title": title,
                "price": float(price) if price else 0.0,
                "brand": brand,
                "materials": materials,
                "description": desc,
                "url": url,
                "image": img,
                "badges": badges,
                "source": "EarthHero"
            })
        except Exception as e:
            print(f"Error parsing product: {e}")
    print(f"Total products found: {len(products)}")
    return products

if __name__ == "__main__":
    results = scrape_earthhero()
    for product in results:
        print(product)
