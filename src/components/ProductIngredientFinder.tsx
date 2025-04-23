import React, { useState } from "react";
import VisionDemo from "./VisionDemo";

interface ProductIngredientFinderProps {
  barcode: string;
  onClose: () => void;
}

const ProductIngredientFinder: React.FC<ProductIngredientFinderProps> = ({ barcode, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ingredients, setIngredients] = useState<string | null>(null);
  const [source, setSource] = useState<"barcode" | "ocr" | null>(null);
  const [showOCR, setShowOCR] = useState(false);

  const fetchIngredients = async () => {
    setLoading(true);
    setError("");
    setIngredients(null);
    setSource(null);
    try {
      const { lookupBarcode } = await import("@/utils/barcodeApi");
      const data = await lookupBarcode(barcode);
      if (data.ingredients_text) {
        setIngredients(data.ingredients_text);
        setSource("barcode");
      } else {
        setShowOCR(true);
      }
    } catch (err) {
      setShowOCR(true);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIngredients();
    // eslint-disable-next-line
  }, [barcode]);

  if (showOCR) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-4 border rounded shadow bg-white dark:bg-gray-900">
        <h3 className="font-semibold mb-2">Could not find ingredients via barcode database.</h3>
        <p className="mb-2">Please upload a clear image of the product label to extract ingredients using OCR:</p>
        <VisionDemo />
        <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 border rounded shadow bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4">Ingredient Finder</h2>
      {loading && <div>Looking up ingredients...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {ingredients && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Extracted Ingredients ({source === "barcode" ? "from barcode database" : "from OCR"}):</h3>
          <ul className="list-disc ml-6">
            {ingredients.split(/,|;|\n/).map((item, idx) => (
              <li key={idx}>{item.trim()}</li>
            ))}
          </ul>
        </div>
      )}
      {!ingredients && !loading && !showOCR && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">No ingredients found.</h3>
          <button className="mt-2 px-4 py-2 bg-gray-200 rounded" onClick={() => setShowOCR(true)}>
            Try OCR from Label Image
          </button>
        </div>
      )}
      <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
    </div>
  );
};

export default ProductIngredientFinder;
