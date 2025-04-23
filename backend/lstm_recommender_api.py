from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from product_details_fetcher import fetch_product_image_and_details

app = Flask(__name__)
CORS(app)

# Dummy LSTM model for demonstration (replace with a real trained model for production)
class DummyModel:
    def predict(self, user_sequence):
        # Return random scores for 5 products
        return np.random.rand(1, 5)

# Uncomment and use a real model in production
# model = tf.keras.models.load_model('lstm_recommender_model.h5')
model = DummyModel()

PRODUCTS = [
    {"id": 1, "name": "Eco-Friendly Toothbrush", "category": "Personal Care"},
    {"id": 2, "name": "Reusable Shopping Bag", "category": "Groceries"},
    {"id": 3, "name": "Bamboo Cutlery Set", "category": "Kitchen"},
    {"id": 4, "name": "Solar Powered Charger", "category": "Electronics"},
    {"id": 5, "name": "Compostable Trash Bags", "category": "Home"}
]

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    user_sequence = np.array(data["user_sequence"]).reshape(1, -1, 1)
    preds = model.predict(user_sequence)
    recommended_indices = np.argsort(preds[0])[::-1][:5]
    recommendations = []
    for i in recommended_indices:
        prod = PRODUCTS[i]
        details = fetch_product_image_and_details(prod["name"])
        prod_full = {
            "id": prod["id"],
            "name": prod["name"],
            "category": prod["category"],
            "image": details["image"],
            "ecoScore": details["ecoScore"],
            "description": details["description"]
        }
        recommendations.append(prod_full)
    return jsonify({"recommendations": recommendations})

if __name__ == "__main__":
    app.run(port=5000)
