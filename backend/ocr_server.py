from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import io
import logging
import sys

app = Flask(__name__)
CORS(app)

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

@app.route('/api/ocr', methods=['POST'])
def ocr():
    logging.info('Received OCR request')
    if 'file' not in request.files:
        logging.error('No file uploaded in request')
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    img_bytes = file.read()
    try:
        img = Image.open(io.BytesIO(img_bytes))
        logging.info('Image successfully loaded')
        text = pytesseract.image_to_string(img)
        logging.info(f'OCR text extracted: {text[:100]}...')
    except Exception as e:
        logging.error(f'OCR processing failed: {e}')
        return jsonify({'error': f'OCR processing failed: {str(e)}'}), 500
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(port=5000)
