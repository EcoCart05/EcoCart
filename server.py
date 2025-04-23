from flask import Flask, request, jsonify
import cv2
import numpy as np
from pyzbar.pyzbar import decode
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/barcode', methods=['POST'])
def barcode_api():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    file = request.files['image']
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    barcodes = decode(img)
    if not barcodes:
        return jsonify({"barcode": None, "product": None, "message": "No barcode detected."}), 200
    barcode_number = barcodes[0].data.decode('utf-8')
    # Query Open Food Facts API
    import requests
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode_number}.json"
    resp = requests.get(url)
    if resp.status_code != 200:
        return jsonify({"barcode": barcode_number, "product": None, "message": "Failed to fetch product info."}), 200
    data = resp.json()
    if data.get("status") != 1:
        return jsonify({"barcode": barcode_number, "product": None, "message": "Product not found in Open Food Facts."}), 200
    product = data["product"]
    product_info = {
        "name": product.get("product_name"),
        "ingredients": product.get("ingredients_text"),
        "packaging": product.get("packaging"),
        "brands": product.get("brands"),
        "categories": product.get("categories"),
        "image_url": product.get("image_url"),
    }
    return jsonify({"barcode": barcode_number, "product": product_info, "message": "Product found."}), 200

from flask import send_from_directory

@app.route('/')
def home():
    return send_from_directory('.', 'barcode_api_tester.html')

if __name__ == '__main__':
    app.run(port=5000, debug=True)
