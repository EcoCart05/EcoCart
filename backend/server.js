// server.js
// backend/server.js
import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());

const PORT = 5000;

import * as SerpApi from 'serpapi'; // npm install serpapi

// Helper to fetch products from a specific site using SerpApi Google Shopping
async function fetchProductsFromSerpApi(siteDomain, query = '') {
  return new Promise((resolve, reject) => {
    const serpApiKey = process.env.SERPAPI_KEY || 'YOUR_SERPAPI_KEY'; // Set your SERPAPI_KEY in .env or as env var
    const search = new SerpApi.GoogleSearch(serpApiKey);
    search.json({
      q: query || 'eco product',
      engine: 'google_shopping',
      gl: 'in',
      hl: 'en',
      api_key: serpApiKey,
      as_sitesearch: siteDomain,
    }, (data) => {
      if (data && data.shopping_results) {
        const products = data.shopping_results.map((item, i) => ({
          id: `${siteDomain}_${i+1}`,
          name: item.title,
          image: item.thumbnail,
          price: item.extracted_price || 0,
          url: item.link,
          source: siteDomain
        }));
        resolve(products);
      } else {
        resolve([]);
      }
    });
  });
}

// /api/products endpoint using SerpApi for real-time results from both sites
// Local development: serve static products if no SERPAPI_KEY


app.get('/api/products', async (req, res) => {
  const serpApiKey = process.env.SERPAPI_KEY || 'YOUR_SERPAPI_KEY';
  if (!serpApiKey || serpApiKey === 'YOUR_SERPAPI_KEY') {
    // Serve static products from src/data/products.ts
    try {
      // Dynamically import the products file (must be CommonJS or export default)
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const productsPath = path.join(__dirname, '../src/data/products.ts');
      let products = [];
      try {
        // Read and parse the TS file as plain text
        const fs = await import('fs/promises');
        const raw = await fs.readFile(productsPath, 'utf8');
        // Extract the array from the export
        const match = raw.match(/export const products\s*=\s*(\[.*?\]);/s);
        if (match) {
          // Try to parse the array using eval in a safe context
          // Remove comments and trailing commas for JSON compatibility
          let arrString = match[1]
            .replace(/\/(\/|\*)[\s\S]*?(\*\/|$)/g, '')
            .replace(/,\s*([\]\}])/g, '$1');
          products = JSON.parse(arrString);
        } else {
          products = [];
        }
      } catch (e) {
        products = [];
      }
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load local products', details: err.message });
    }
    return;
  }
  try {
    // Fetch from both target sites in parallel
    const [myEcoKartProducts, ecoviansProducts] = await Promise.all([
      fetchProductsFromSerpApi('myecokart.com'),
      fetchProductsFromSerpApi('ecovians.com')
    ]);
    const products = [...myEcoKartProducts, ...ecoviansProducts];
    res.json(products);
  } catch (err) {
    console.error('SerpApi error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

async function handleImageUpload(e) {
  if (e.target.files && e.target.files[0]) {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    const response = await fetch('/api/eco-score', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    // Use data.eco_score in your UI
  }
}

// Weighted eco score calculation with percentage
function calculateEcoScoreWithPercent(ingredientDict) {
  let score = 100;
  const entries = Object.entries(ingredientDict).map(([name, percent]) => [name.toLowerCase(), Number(percent)]);
  entries.forEach(([name, percent]) => {
    if (name.includes('palm oil')) score -= 30 * (percent / 100);
    if (name.includes('artificial flavor') || name.includes('artificial flavours')) score -= 20 * (percent / 100);
    if (name.includes('sugar') || name.includes('glucose')) score -= 10 * (percent / 100);
    if (name.includes('emulsifier')) score -= 10 * (percent / 100);
    if (name.includes('preservative')) score -= 15 * (percent / 100);
    if (name.includes('colorant') || name.includes('colour')) score -= 10 * (percent / 100);
    if (name.includes('paraben')) score -= 20 * (percent / 100);
    if (name.includes('sls') || name.includes('sles')) score -= 15 * (percent / 100);
    if (name.includes('microplastic') || name.includes('polyethylene')) score -= 25 * (percent / 100);
    if (name.includes('petroleum') || name.includes('mineral oil')) score -= 20 * (percent / 100);
    if (name.includes('fragrance')) score -= 10 * (percent / 100);
    if (name.includes('bht') || name.includes('bha')) score -= 10 * (percent / 100);
    // Eco-friendly/positive
    if (name.includes('organic')) score += 10 * (percent / 100);
    if (name.includes('biodegradable')) score += 10 * (percent / 100);
    if (name.includes('plant-based')) score += 10 * (percent / 100);
    if (name.includes('recycled')) score += 10 * (percent / 100);
    if (name.includes('natural')) score += 5 * (percent / 100);
    if (name.includes('eco-cert') || name.includes('ecocert')) score += 10 * (percent / 100);
    if (name.includes('vegan')) score += 5 * (percent / 100);
    if (name.includes('cruelty-free')) score += 5 * (percent / 100);
  });
  score = Math.max(0, Math.min(100, score));
  return score;
}

// Rule-based eco score calculation (enhanced)
function calculateEcoScore(ingredients) {
  let score = 100;
  const lower = ingredients.map(i => i.toLowerCase());

  // Harmful/unsustainable ingredients
  if (lower.some(i => i.includes('palm oil'))) score -= 30;
  if (lower.some(i => i.includes('artificial flavor') || i.includes('artificial flavours'))) score -= 20;
  if (lower.some(i => i.includes('sugar') || i.includes('glucose'))) score -= 10;
  if (lower.some(i => i.includes('emulsifier'))) score -= 10;
  if (lower.some(i => i.includes('preservative'))) score -= 15;
  if (lower.some(i => i.includes('colorant') || i.includes('colour'))) score -= 10;
  if (lower.some(i => i.includes('paraben'))) score -= 20;
  if (lower.some(i => i.includes('sls') || i.includes('sles'))) score -= 15;
  if (lower.some(i => i.includes('microplastic') || i.includes('polyethylene'))) score -= 25;
  if (lower.some(i => i.includes('petroleum') || i.includes('mineral oil'))) score -= 20;
  if (lower.some(i => i.includes('fragrance'))) score -= 10;
  if (lower.some(i => i.includes('bht') || i.includes('bha'))) score -= 10;
  
  // Eco-friendly/positive ingredients
  if (lower.some(i => i.includes('organic'))) score += 10;
  if (lower.some(i => i.includes('biodegradable'))) score += 10;
  if (lower.some(i => i.includes('plant-based'))) score += 10;
  if (lower.some(i => i.includes('recycled'))) score += 10;
  if (lower.some(i => i.includes('natural'))) score += 5;
  if (lower.some(i => i.includes('eco-cert') || i.includes('ecocert'))) score += 10;
  if (lower.some(i => i.includes('vegan'))) score += 5;
  if (lower.some(i => i.includes('cruelty-free'))) score += 5;

  // Clamp between 0 and 100
  score = Math.max(0, Math.min(100, score));
  return score;
}

// Rule-based eco score API endpoint
app.post('/api/eco-score', express.json(), (req, res) => {
  const { ingredients } = req.body;
  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Ingredients must be an array of strings.' });
  }
  const ecoScore = calculateEcoScore(ingredients);
  res.json({ eco_score: ecoScore });
});

// Weighted eco score API endpoint
app.post('/api/eco-score-percent', express.json(), (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || typeof ingredients !== 'object' || Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Ingredients must be an object with { ingredient: percent }.' });
  }
  const total = Object.values(ingredients).reduce((sum, v) => sum + Number(v), 0);
  if (total !== 100) {
    return res.status(400).json({ error: 'Total percentage must be exactly 100.' });
  }
  const ecoScore = calculateEcoScoreWithPercent(ingredients);
  res.json({ eco_score: ecoScore });
});

// --- OCR Integration for Image Uploads (using tesseract.js) ---
// Requires: npm install tesseract.js multer
import multer from 'multer';
import { createWorker } from 'tesseract.js';
import fetch from 'node-fetch'; // For fetching images from URLs
import fs from 'fs';
const upload = multer({ dest: 'uploads/' });

// OCR + eco score endpoint
app.post('/api/eco-score-image', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }
  const worker = await createWorker('eng');
  try {
    const { data: { text } } = await worker.recognize(req.file.path);
    await worker.terminate();
    // Basic ingredient extraction: split by comma/newline, trim, filter
    const rawList = text.split(/,|\n/).map(i => i.trim()).filter(i => i.length > 0);
    const ecoScore = calculateEcoScore(rawList);
    res.json({ eco_score: ecoScore, extracted_ingredients: rawList });
  } catch (err) {
    await worker.terminate();
    res.status(500).json({ error: 'OCR or eco score failed.' });
  }
});

// OCR endpoint: accepts both file upload and image URL
app.post('/api/ocr', upload.single('file'), express.json(), async (req, res) => {
  try {
    let imagePath = null;
    let tempFile = false;
    if (req.file) {
      // Image uploaded via multipart/form-data
      imagePath = req.file.path;
    } else if (req.body && req.body.imageUrl) {
      // Image provided as URL
      const response = await fetch(req.body.imageUrl);
      if (!response.ok) {
        return res.status(400).json({ error: 'Failed to fetch image from URL.' });
      }
      const buffer = await response.buffer();
      // Save to temp file
      const tempName = `uploads/url_${Date.now()}_${Math.floor(Math.random()*10000)}.jpg`;
      fs.writeFileSync(tempName, buffer);
      imagePath = tempName;
      tempFile = true;
    } else {
      return res.status(400).json({ error: 'No image file or imageUrl provided.' });
    }

    const worker = await createWorker('eng');
    let text = '';
    try {
      const { data: { text: ocrText } } = await worker.recognize(imagePath);
      text = ocrText;
      await worker.terminate();
    } catch (err) {
      await worker.terminate();
      if (tempFile && imagePath) fs.unlinkSync(imagePath);
      return res.status(500).json({ error: 'OCR failed.' });
    }
    if (tempFile && imagePath) fs.unlinkSync(imagePath);
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: 'OCR processing error.', details: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));