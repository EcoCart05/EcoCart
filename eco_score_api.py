from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io

app = FastAPI()
model = load_model("eco_score_model.h5")  # Place your .h5 file in the project root

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = img_to_array(img)
    img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)
    return np.expand_dims(img_array, axis=0)

@app.post("/predict-eco-score/")
async def predict_eco_score(file: UploadFile = File(...)):
    contents = await file.read()
    img = preprocess_image(contents)
    pred = model.predict(img)[0][0]
    final_score = max(0, min(100, pred))
    return JSONResponse({"eco_score": round(final_score, 1)})
