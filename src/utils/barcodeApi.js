// Universal barcode lookup using UPCitemdb (supports food and non-food)
// Docs: https://www.upcitemdb.com/api/explorer#!/lookup/get_lookup
// You need to get a free API key from upcitemdb.com and set it below:

// Set your UPCitemdb API key here
const UPCITEMDB_API_KEY = "YOUR_UPCITEMDB_API_KEY"; // Replace with your real API key
const UPCITEMDB_KEY_TYPE = "3scale"; // or "trial" if using trial

/**
 * Looks up a barcode using UPCitemdb official API (supports non-food products)
 * @param {string} barcode
 * @returns {Promise<Object>} Product info
 */
export async function lookupBarcodeUniversal(barcode) {
  const url = 'https://api.upcitemdb.com/prod/v1/lookup';
  const headers = {
    "Content-Type": "application/json",
    "user_key": UPCITEMDB_API_KEY,
    "key_type": UPCITEMDB_KEY_TYPE
  };
  const body = JSON.stringify({ upc: barcode });
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });
  if (!response.ok) throw new Error('Barcode lookup failed');
  const data = await response.json();
  if (!data.items || data.items.length === 0) throw new Error('Product not found');
  return data.items[0];
}
