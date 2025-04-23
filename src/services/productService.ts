export async function fetchEcoProducts() {
  // Fetch from backend which scrapes theaffordableorganicstore.com
  const response = await fetch("http://localhost:5000/api/products");
  if (!response.ok) throw new Error("Failed to fetch eco products");
  return response.json();
}
