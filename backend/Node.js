const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const response = await fetch('/api/products');
const products = await response.json();
// Display products as before
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

let model;
// Load the model only once
async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel('file://' + path.join(__dirname, '../tfjs_model/model.json'));
  }
}
loadModel();



router.post('/api/eco-score', upload.single('file'), async (req, res) => {
  try {
    await loadModel();
    const imagePath = req.file.path;

    // Read and preprocess image
    const imageBuffer = fs.readFileSync(imagePath);
    let tensor = tf.node.decodeImage(imageBuffer, 3)
      .resizeBilinear([380, 380]) // EfficientNetB4 expects 380x380
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255)); // Normalize to [0,1]

    // Predict
    const prediction = model.predict(tensor);
    const ecoScore = prediction[0].dataSync()[0]; // If first output is eco_score

    // Clean up
    fs.unlinkSync(imagePath);

    res.json({ eco_score: ecoScore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eco score prediction failed.' });
  }
});

module.exports = router;