// Utility for looking up product info by barcode using Open Food Facts
// Docs: https://world.openfoodfacts.org/data
// Also exports universal lookupBarcodeUniversal for non-food via UPCitemdb
// Set your UPCitemdb API key in barcodeApi.js

export async function lookupBarcode(barcode: string) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Barcode lookup failed');
  const data = await response.json();
  if (data.status !== 1) throw new Error('Product not found');
  return data.product;
}

// TODO: Import lookupBarcodeUniversal from the correct file if needed.
// export { lookupBarcodeUniversal } from './barcodeApiUniversal';
