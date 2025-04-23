const express = require("express");
const vision = require("@google-cloud/vision");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const client = new vision.ImageAnnotatorClient({
  keyFilename: "d:/SGU/SGUHACKOTHON_1/vision-service-account.json" // Secure this file!
});

app.post("/api/vision", async (req, res) => {
  const { imageBase64, features } = req.body;
  const requests = [{
    image: { content: imageBase64 },
    features: features || [
      { type: "TEXT_DETECTION" },
      { type: "LABEL_DETECTION" },
      { type: "LOGO_DETECTION" },
      { type: "BARCODE_DETECTION" }
    ]
  }];
  try {
    const [result] = await client.annotateImage(requests[0]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(5001, () => console.log("Vision proxy running on port 5001"));
