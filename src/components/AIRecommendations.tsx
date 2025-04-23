
import React, { useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp } from "lucide-react";
// Carousel and ProductCard imports removed for API-powered recommendations only.

// Ensure Product type includes category
export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  ecoScore: number;
  description: string;
  url: string; // Add url field for hyperlink
}


interface AIRecommendationsProps {
  userPreferences?: string[];
  previousPurchases?: Product[];
  products: Product[];
  title?: string;
  description?: string;
}

// Simulate user authentication state (replace with real auth logic)
const isLoggedIn = false; // Set to true if user is logged in

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  userPreferences = ["sustainable", "organic"],
  previousPurchases = [],
  products,
  title = "AI-Powered Recommendations",
  description = "Based on your preferences and shopping history"
}) => {
  
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example user sequence (should be replaced with real user interaction data)
  const userSequence = [1, 2, 3];

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/recommend', { user_sequence: userSequence });
      setRecommendations(res.data.recommendations);
    } catch (err: unknown) {
      setError('Failed to fetch recommendations.');
      setRecommendations([]);
    }
    setLoading(false);
  };

  const handleSaveProduct = () => {
    // Handle save product logic
  };

  // Demo: Always show AI recommendations (remove login check for now)
  // Hardcoded AI-style recommendations for demo
  const aiRecommendations = [
    {
      id: 1,
      name: "Solar Powered Charger",
      ecoScore: 92,
      description: "Charge your devices anywhere using clean solar energy. Great for travel, camping, and outdoor adventures.",
    },
    {
      id: 2,
      name: "Bamboo Cutlery Set",
      ecoScore: 88,
      description: "A portable cutlery set crafted from renewable bamboo. Ideal for zero-waste living and eating on the go.",
    },
    {
      id: 3,
      name: "Compostable Trash Bags",
      ecoScore: 95,
      description: "Trash bags that break down in compost, reducing landfill waste and supporting a greener planet.",
    },
    {
      id: 4,
      name: "Reusable Shopping Bag",
      ecoScore: 85,
      description: "A durable, reusable shopping bag made from recycled materials. Perfect for groceries and reducing single-use plastic.",
    },
  ];

  function getProductUrl(prod: { name: string }) {
    const baseLinks = [
      `https://www.ecovians.com/search?q=${encodeURIComponent(prod.name)}`,
      `https://myecokart.com/shop/?s=${encodeURIComponent(prod.name)}&post_type=product`
    ];
    return baseLinks[Math.floor(Math.random() * baseLinks.length)];
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">AI-Powered Recommendations</h2>
      <ul className="space-y-4">
        {aiRecommendations.map((prod) => (
          <li key={prod.id} className="border rounded-lg p-4 flex flex-col bg-white">
            <a
              href={getProductUrl(prod)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-green-900 font-semibold hover:underline mb-1"
            >
              {prod.name}
            </a>
            <span className={`font-bold px-2 py-1 rounded-full w-fit mb-1 ${prod.ecoScore >= 80 ? 'bg-green-200 text-green-900' : prod.ecoScore >= 50 ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>Eco-Score: {prod.ecoScore}</span>
            <span className="text-gray-700 text-sm">{prod.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  if (!isLoggedIn) return null; // Show nothing if not logged in

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4">AI-Powered Recommendations</h2>
      <ul className="space-y-4">
        {recommendations.map((prod) => (
          <li key={prod.id} className="border rounded-lg shadow bg-white p-4 flex flex-col">
            <a
              href={getProductUrl(prod)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-green-900 font-semibold hover:underline mb-1"
            >
              {prod.name}
            </a>
            <span className={`font-bold px-2 py-1 rounded-full w-fit mb-1 ${prod.ecoScore >= 80 ? 'bg-green-200 text-green-900' : prod.ecoScore >= 50 ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>Eco-Score: {prod.ecoScore}</span>
            <span className="text-gray-700 text-sm">{prod.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIRecommendations;
