from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import uvicorn

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import cv2
import numpy as np
from pyzbar.pyzbar import decode
import requests
from io import BytesIO

@app.post("/api/barcode")
async def barcode_recognition(file: UploadFile = File(...)):
    try:
        # Read image file
        contents = await file.read()
        npimg = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        # Decode barcode
        decoded_objects = decode(img)
        if not decoded_objects:
            return JSONResponse({"barcode": None, "message": "No barcode detected."}, status_code=200)
        barcode = decoded_objects[0].data.decode("utf-8")
        # Query Open Food Facts
        off_url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
        resp = requests.get(off_url)
        if resp.status_code != 200:
            return JSONResponse({"barcode": barcode, "message": "Barcode recognized, but Open Food Facts not reachable."}, status_code=200)
        data = resp.json()
        if data.get("status") != 1:
            return JSONResponse({"barcode": barcode, "message": "Product not found in Open Food Facts."}, status_code=200)
        product = data.get("product", {})
        name = product.get("product_name", "Unknown Product")
        ingredients = product.get("ingredients_text", "Ingredients not available")
        image_url = product.get("image_url", None)
        packaging = product.get("packaging", None)
        brands = product.get("brands", None)
        categories = product.get("categories", None)
        return JSONResponse({
            "barcode": barcode,
            "product": {
                "name": name,
                "ingredients": ingredients,
                "image_url": image_url,
                "packaging": packaging,
                "brands": brands,
                "categories": categories
            },
            "message": "Barcode and product details fetched successfully."
        })
    except Exception as e:
        return JSONResponse({"barcode": None, "message": f"Error: {str(e)}"}, status_code=500)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
