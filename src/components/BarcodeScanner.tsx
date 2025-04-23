import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface BarcodeScannerProps {
  onDetected: (result: string) => void;
  onClose: () => void;
}

import ProductIngredientFinder from "./ProductIngredientFinder";

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected, onClose }) => {
  const [error, setError] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [apiError, setApiError] = useState("");
  const [productName, setProductName] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrcodeScanner = useRef<Html5Qrcode | null>(null);
  const [showIngredientFinder, setShowIngredientFinder] = useState<null | string>(null);
  const [lastBarcode, setLastBarcode] = useState<string | null>(null);

  useEffect(() => {
    const config = { fps: 10, qrbox: 250 };
    const verbose = false;
    const scannerId = "html5qr-code-full-region";

    if (scannerRef.current) {
      html5QrcodeScanner.current = new Html5Qrcode(scannerId);
      html5QrcodeScanner.current
        .start(
          { facingMode: "environment" },
          config,
          async (decodedText) => {
            if (decodedText) {
              setLoadingProduct(true);
              setApiError("");
              setProductName(null);
              setProductDetails(null);
              setLastBarcode(decodedText);
              setShowIngredientFinder(decodedText);
              setLoadingProduct(false);
              html5QrcodeScanner.current?.stop().catch(() => {});
            }
          },
          (err) => {
            // Optionally handle scan errors
          }
        )
        .catch((err) => {
          setError("Camera error: " + err);
        });
    }
    return () => {
      if (html5QrcodeScanner.current) {
  html5QrcodeScanner.current.stop?.().catch?.(() => {});
  html5QrcodeScanner.current.clear?.().catch?.(() => {});
}
    };
    // eslint-disable-next-line
  }, []);

  if (showIngredientFinder && lastBarcode) {
    return (
      <ProductIngredientFinder
        barcode={lastBarcode}
        onClose={() => {
          setShowIngredientFinder(null);
          setTimeout(() => {
            // Resume scanning
            window.location.reload(); // Quick hack: reload to re-init scanner
          }, 100);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col items-center relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-green-700">Scan Product Barcode</h2>
        <div id="html5qr-code-full-region" ref={scannerRef} style={{ width: 320, height: 320 }} />
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {loadingProduct && <div className="text-green-600 mt-2">Looking up product...</div>}
        <p className="text-gray-500 text-sm mt-4">Point your camera at the barcode.</p>
        <div className="text-xs text-gray-400 mt-2">Note: For non-food products, you must set your UPCitemdb API key in <code>src/utils/barcodeApi.js</code>.</div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
