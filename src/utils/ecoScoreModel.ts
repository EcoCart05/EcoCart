// utils/ecoScoreModel.ts
// This file contains a simple ML-inspired model for eco score calculation.
// In production, this could be replaced by a real ML model or API call.

import type { Product } from "@/data/products";

/**
 * Calculate an eco score (0-100) for a product based on its attributes.
 * This is a heuristic model that considers materials, certifications, and other sustainability tags.
 * @param product The product to score
 * @returns ecoScore (0-100)
 */
export function calculateEcoScore(product: Product): number {
  let score = 50; // Start with a neutral score

  // Material impact (prefer sustainable, recycled, natural, etc.)
  if (product.materials) {
    for (const mat of product.materials) {
      if (/organic|bamboo|hemp|recycled|natural|biodegradable|cotton|glass|stainless|wood|plant/i.test(mat)) {
        score += 8;
      } else if (/polyester|plastic|synthetic|nylon|petroleum/i.test(mat)) {
        score -= 10;
      }
    }
  }

  // Certifications
  if (product.certifications) {
    for (const cert of product.certifications) {
      if (/fsc|fair trade|bpi|compostable|carbon neutral|vegan|non-toxic|zero waste|plastic free/i.test(cert)) {
        score += 7;
      }
    }
  }

  // Sustainability tags (badges)
  if (product.sustainabilityTags) {
    for (const tag of product.sustainabilityTags) {
      if (/eco|sustainable|green|renewable|energy/i.test(tag)) {
        score += 5;
      }
    }
  }

  // Penalty for lack of info
  if (!product.materials || product.materials.length === 0) score -= 8;
  if (!product.certifications || product.certifications.length === 0) score -= 5;

  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, score));
  return Math.round(score);
}
