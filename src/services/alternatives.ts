// Service for green alternatives (stub)

// Simulate a backend call to fetch greener alternatives
export async function getAlternatives(productName: string, userId: string): Promise<string[]> {
  // TODO: Replace with real backend/API call
  if (!productName) return [];
  // Dummy data for demo
  const demoAlts: Record<string, string[]> = {
    "plastic bottle": ["Glass bottle", "Steel flask", "Copper bottle"],
    "cotton bag": ["Jute bag", "Bamboo basket"],
    "shampoo": ["Solid shampoo bar", "Refillable shampoo"],
  };
  return demoAlts[productName.toLowerCase()] || [
    `No greener alternatives found for "${productName}". Try searching for another product.`
  ];
}

// Simulate a backend call to vote for an alternative
export async function voteAlternative(productName: string, alternative: string, value: number, userId: string): Promise<void> {
  // TODO: Replace with real backend/API call
  // For now, just resolve
  return;
}
