from flask import Flask, jsonify, request
from flask_cors import CORS
from scraper import scrape_earthhero
import tempfile
import os
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from barcode_scanner import scan_barcode, fetch_product_info

app = Flask(__name__)
CORS(app)

@app.route("/api/products")
def get_products():
    products = scrape_earthhero()
    return jsonify(products)

@app.route("/api/barcode", methods=["POST"])
def api_barcode():
    if 'file' not in request.files:
        return jsonify({"barcode": None, "product": None, "message": "No file uploaded."}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"barcode": None, "product": None, "message": "No file selected."}), 400
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name
        barcode_number = scan_barcode(tmp_path)
        os.unlink(tmp_path)
        if not barcode_number:
            return jsonify({"barcode": None, "product": None, "message": "No barcode detected."}), 200
        product_info = fetch_product_info(barcode_number)
        if not product_info:
            return jsonify({"barcode": barcode_number, "product": None, "message": "Product not found in Open Food Facts."}), 200
        return jsonify({"barcode": barcode_number, "product": product_info, "message": None}), 200
    except Exception as e:
        return jsonify({"barcode": None, "product": None, "message": f"Error processing image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
