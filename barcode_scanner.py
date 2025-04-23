import cv2
from pyzbar.pyzbar import decode
import requests

def scan_barcode(image_path):
    """Scans barcode from image and returns the barcode number."""
    img = cv2.imread(image_path)
    barcodes = decode(img)
    if not barcodes:
        print("No barcode detected.")
        return None
    barcode_number = barcodes[0].data.decode('utf-8')
    print(f"Barcode: {barcode_number}")
    return barcode_number

def fetch_product_info(barcode_number):
    """Fetches product info from Open Food Facts API."""
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode_number}.json"
    response = requests.get(url)
    if response.status_code != 200:
        print("Failed to fetch product info.")
        return None
    data = response.json()
    if data.get("status") != 1:
        print("Product not found in database.")
        return None
    product = data["product"]
    return {
        "name": product.get("product_name"),
        "ingredients": product.get("ingredients_text"),
        "packaging": product.get("packaging"),
        "brands": product.get("brands"),
        "categories": product.get("categories"),
        "image_url": product.get("image_url"),
    }

def main(image_path):
    barcode_number = scan_barcode(image_path)
    if not barcode_number:
        return
    info = fetch_product_info(barcode_number)
    if not info:
        return
    print("\n--- Product Information ---")
    print(f"Name: {info['name']}")
    print(f"Ingredients: {info['ingredients']}")
    print(f"Packaging: {info['packaging']}")
    print(f"Brands: {info['brands']}")
    print(f"Categories: {info['categories']}")
    print(f"Image: {info['image_url']}")

if __name__ == "__main__":
    image_path = input("Enter the barcode image file path: ").strip()
    main(image_path)
