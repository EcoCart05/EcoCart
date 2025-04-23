import React, { useState, useRef } from "react";

const VisionDemo: React.FC = () => {
  const [barcode, setBarcode] = useState<string | null>(null);
  interface ProductInfo {
    name: string;
    ingredients: string;
    image_url?: string | null;
    packaging?: string | null;
    brands?: string | null;
    categories?: string | null;
  }
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset file input after processing
    const resetInput = () => {
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    setError(null);
    setBarcode(null);
    setProduct(null);
    setMessage(null);
    const file = e.target.files?.[0];
    if (!file) { resetInput(); return; }
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/barcode", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to process image.");
      const data = await response.json();
      setBarcode(data.barcode || null);
      setProduct(data.product || null);
      setMessage(data.message || null);
      if (!data.barcode) {
        setError("No barcode detected.");
      } else if (!data.product || data.product === "Unknown Product") {
        setError("Product not found in Open Food Facts.");
      }
    } catch (err) {
      setError("Error processing image. Please try again.");
    } finally {
      setLoading(false);
      resetInput();
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 border rounded shadow bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4">Scan a Barcode from Image</h2>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {loading && <div>Processing image...</div>}
      {barcode && (
        <div className="mt-4 text-green-700 font-semibold">Barcode Detected: {barcode}</div>
      )}
      {product && (
        <div className="mt-4 p-4 border rounded bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-300">Product Details</h3>
          {product.image_url && (
            <img src={product.image_url} alt={product.name} className="mb-2 max-h-40 mx-auto" />
          )}
          <div><span className="font-semibold">Name:</span> {product.name || "N/A"}</div>
          <div><span className="font-semibold">Ingredients:</span> {product.ingredients || "N/A"}</div>
          <div><span className="font-semibold">Packaging:</span> {product.packaging || "N/A"}</div>
          <div><span className="font-semibold">Brands:</span> {product.brands || "N/A"}</div>
          <div><span className="font-semibold">Categories:</span> {product.categories || "N/A"}</div>
        </div>
      )}
      {message && !product && (
        <div className="mt-4 text-yellow-700">{message}</div>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
      <div className="text-sm text-gray-500 mt-2">Upload an image file containing a barcode. The extracted barcode number and product details will be displayed here.</div>
    </div>
  );
};

export default VisionDemo;
