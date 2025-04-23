import type { Product } from "@/data/products";

export const sampleProducts: Product[] = [
  {
    id: "7",
    name: "Eco-Friendly Yoga Mat",
    brand: "ZenEarth",
    price: 3500,
    ecoScore: 88,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500&q=80", // Yoga mat
    materials: ["natural rubber", "jute"],
    certifications: ["Vegan", "Non-Toxic"],
    url: "#",
  },
  {
    id: "8",
    name: "Solar Powered Charger",
    brand: "SunCharge",
    price: 4999,
    ecoScore: 93,
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=500&q=80", // Solar charger
    materials: ["recycled plastic", "solar cells"],
    certifications: ["Energy Star"],
    url: "#",
  },
  {
    id: "9",
    name: "Biodegradable Phone Case",
    brand: "EcoShell",
    price: 1200,
    ecoScore: 85,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", // Phone case
    materials: ["biodegradable bioplastic"],
    certifications: ["Compostable"],
    url: "#",
  },
  {
    id: "10",
    name: "Bamboo Toothbrush",
    brand: "NatureBrush",
    price: 199,
    ecoScore: 91,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=500&q=80", // Bamboo toothbrush
    materials: ["bamboo", "castor bean oil bristles"],
    certifications: ["FSC Certified"],
    url: "#",
  },
  {
    id: "11",
    name: "Compostable Trash Bags",
    brand: "GreenCycle",
    price: 499,
    ecoScore: 78,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&q=80", // Compostable bags
    materials: ["corn starch", "PLA"],
    certifications: ["BPI Certified"],
    url: "#",
  },
  {
    id: "12",
    name: "Reusable Beeswax Food Wraps",
    brand: "BeeGreen",
    price: 899,
    ecoScore: 84,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80", // Beeswax wraps
    materials: ["organic cotton", "beeswax", "jojoba oil", "tree resin"],
    certifications: ["Zero Waste"],
    url: "#",
  },
  {
    id: "1",
    name: "Organic Cotton T-Shirt",
    brand: "EcoWear",
    price: 2499,
    ecoScore: 90,
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80", // Organic cotton t-shirt
    materials: ["100% organic cotton", "water-based dyes"],
    certifications: ["Fair Trade"],
    url: "#",
  },
  {
    id: "2",
    name: "Reusable Glass Water Bottle",
    brand: "GreenHydro",
    price: 2850,
    ecoScore: 86,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&q=80", // Glass water bottle
    materials: ["Sustainable glass", "silicone grip"],
    certifications: ["Carbon Neutral"],
    url: "#",
  },
  {
    id: "3",
    name: "Bamboo Kitchen Utensil Set",
    brand: "NatureCook",
    price: 3295,
    ecoScore: 97,
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=500&q=80", // Bamboo kitchen utensil set
    materials: ["100% sustainable bamboo", "natural oils"],
    certifications: ["Sustainable"],
    url: "#",
  },
  {
    id: "4",
    name: "Merino Wool Sweater",
    brand: "PureComfort",
    price: 8900,
    ecoScore: 71,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&q=80", // Merino wool sweater
    materials: ["100% Merino wool", "free-range sheep"],
    certifications: ["Ethical Wool"],
    url: "#",
  },
  {
    id: "5",
    name: "Reusable Produce Bags Set",
    brand: "ZeroWaste",
    price: 1699,
    ecoScore: 80,
    image: "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?w=500&q=80", // Reusable produce bags
    materials: ["Organic cotton mesh"],
    certifications: ["Zero Waste"],
    url: "#",
  },
  {
    id: "6",
    name: "Biodegradable Phone Case",
    brand: "EcoTech",
    price: 2750,
    ecoScore: 90,
    image: "https://images.unsplash.com/photo-1609252924198-30b8cb324d2f?w=500&q=80",
    materials: ["Biodegradable bioplastic", "plant fibers"],
    certifications: ["Plastic Free"],
    url: "#",
  }
];

export const sampleAlternatives = [
  {
    id: "7",
    name: "Hemp Blend T-Shirt",
    brand: "GreenThreads",
    price: 29.99,
    ecoScore: 10,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    materials: ["55% hemp", "45% organic cotton"],
    certifications: [],
    url: "#",
  },
  {
    id: "8",
    name: "Stainless Steel Water Bottle",
    brand: "EverGreen",
    price: 24.95,
    ecoScore: 10,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    materials: ["100% recycled stainless steel"],
    certifications: [],
    url: "#",
  },
  {
    id: "9",
    name: "Reclaimed Wood Cutting Board",
    brand: "OliveEco",
    price: 42.0,
    ecoScore: 9,
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&q=80",
    materials: ["Reclaimed olivewood"],
    certifications: [],
    url: "#",
  }
];

export const ecoImpact = {
  carbon_saved: "27.4 kg CO2",
  plastic_avoided: "2.3 kg",
  water_conserved: "1,240 liters",
  trees_planted: "5",
  sustainable_purchases: "14"
};
