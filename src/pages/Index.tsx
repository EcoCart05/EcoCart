
import React, { useState, useEffect, Suspense } from 'react';

// Lazy load the BarcodeScanner component
const BarcodeScanner = React.lazy(() => import('@/components/BarcodeScanner'));
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Leaf, ArrowRight, Info, TrendingUp, User, Star, BookOpen, Sun, Moon, Sparkles, Brain } from "lucide-react";
import type { Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";
import EcoBadge from "@/components/EcoBadge";
import FeatureSection from "@/components/FeatureSection";
import ProductComparison from "@/components/ProductComparison";
import { useIsMobile } from "@/hooks/use-mobile";
import { sampleProducts, sampleAlternatives, ecoImpact } from "@/utils/sampleData";
import { fetchEcoProducts } from "@/services/productService";
import { Link } from "react-router-dom";
import EcoGuideChat from "@/components/EcoGuideChat";
import AIRecommendations from "@/components/AIRecommendations";
import { useAuth } from "@/components/ProtectedRoute";
import { useDarkMode } from "@/hooks/useDarkMode";
import UserProfileMenu from "@/components/UserProfileMenu";
import Footer from "@/components/Footer";
import EcoVoicyAssistant from '@/components/EcoVoicyAssistant';

const indexData = {
  name: 'EcoCart – Sustainable Shopping',
  description: 'Find eco-friendly products, compare alternatives, and make greener choices with EcoCart.',
  materials: ['Search for products', 'Compare Alternatives'],
  certifications: [],
};

const Index = () => {
  // Barcode scanner modal state
  const [showScanner, setShowScanner] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [scannedError, setScannedError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [alternatives, setAlternatives] = useState(sampleAlternatives);
  const [activeTab, setActiveTab] = useState("search");
  // For voice assistant form fill (Contact Us)
  const [voiceForm, setVoiceForm] = useState<{ name?: string; email?: string; message?: string }>({});
  const [darkMode, handleDarkModeToggle] = useDarkMode();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    fetchEcoProducts()
      .then((apiProducts) => {
        if (Array.isArray(apiProducts) && apiProducts.length > 0 && apiProducts[0].title) {
          const mappedProducts = apiProducts.map((p, idx) => ({
            id: p.id?.toString() || `api-${idx}`,
            name: p.title || p.name || 'Eco Product',
            image: p.image || '',
            price: typeof p.price === 'number' ? p.price : 0,
            materials: Array.isArray(p.materials) ? p.materials : [],
            brand: p.brand || '',
            certifications: Array.isArray(p.certifications) ? p.certifications : [],
            ecoScore: typeof p.ecoScore === 'number' ? p.ecoScore : 50,
            url: p.url || '#',
            badges: Array.isArray(p.badges) ? p.badges : [],
            sustainabilityTags: Array.isArray(p.sustainabilityTags) ? p.sustainabilityTags : [],
          }));
          setAllProducts([...mappedProducts, ...sampleProducts]);
          setProducts([...mappedProducts, ...sampleProducts]);
        } else {
          setAllProducts(sampleProducts);
          setProducts(sampleProducts);
        }
      })
      .catch((err) => {
        // console.error("Failed to fetch live products, falling back to sampleProducts", err);
        setAllProducts(sampleProducts);
        setProducts(sampleProducts);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Empty Search",
        description: "Please enter a product to search for.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Searching Products",
      description: `Finding sustainable options for "${searchTerm}"...`,
    });
    
    // Always search over the full product list
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = allProducts.filter(product => {
      // Search in multiple fields for best match
      return (
        product.name?.toLowerCase().includes(lowerSearch) ||
        product.brand?.toLowerCase().includes(lowerSearch) ||
        (product.materials && product.materials.join(' ').toLowerCase().includes(lowerSearch)) ||
        (product.certifications && product.certifications.join(' ').toLowerCase().includes(lowerSearch)) ||
        (product.sustainabilityTags && product.sustainabilityTags.join(' ').toLowerCase().includes(lowerSearch)) ||
        (product.badges && product.badges.join(' ').toLowerCase().includes(lowerSearch))
      );
    });
    setProducts(filtered);
    setAlternatives(sampleAlternatives);
    if (filtered.length === 0) {
      toast({
        title: "No products found",
        description: `No sustainable products match "${searchTerm}".`,
        variant: "destructive",
      });
    }
  };

  const saveProduct = (product: Product) => {
    toast({
      title: "Product Saved",
      description: `${product.name} has been added to your favorites.`,
    });
  };

  return (
    <div className="min-h-screen transition-colors bg-background relative">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 px-4 md:pt-24 md:pb-20" style={{background: 'linear-gradient(135deg,#A7F3D0 0%, #38BDF8 100%)'}}>
  {/* SVG Hero Background */}
  <img src="/hero-eco-bg.svg" alt="EcoCart Hero Background" className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0" style={{opacity: 0.8}} />
  <div className="max-w-6xl mx-auto relative z-10">
    {/* Animated EcoCart Logo and Tagline */}
    <div className="text-center mb-12 animate-fade-in-up">
      <div className="flex items-center justify-center mb-4">
        <Leaf className="h-12 w-12 text-green-500 mr-2 animate-spin-slow" />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg">
          Eco<span className="text-green-500 animate-gradient-x">Cart</span>
        </h1>
      </div>
      <p className="text-2xl md:text-3xl text-blue-900 dark:text-green-100 mt-4 max-w-3xl mx-auto font-semibold animate-fade-in">
        India’s #1 Eco-Friendly Shopping Platform
      </p>
      <p className="text-lg md:text-xl text-muted-foreground mt-2 max-w-2xl mx-auto animate-fade-in delay-100">
        Shop sustainably. Discover eco-friendly products, compare alternatives, and make a real impact with every purchase.
      </p>
      <div className="flex justify-center mt-8 gap-4 animate-fade-in delay-200">
        <Button asChild className="bg-green-500 hover:bg-green-600 text-lg px-8 py-4 shadow-xl rounded-full animate-bounce">
          <Link to="/ai-features" className="flex items-center font-bold">
            <Sparkles className="mr-2 h-5 w-5 animate-pulse" /> Explore AI Features
          </Link>
        </Button>

      </div>
    </div>
    {/* Animated Eco Highlights Row */}
    <div className="flex flex-wrap items-center justify-center gap-6 mt-8 animate-fade-in-up delay-200">
      <div className="flex items-center gap-2 bg-white/80 dark:bg-green-900/60 px-4 py-2 rounded-full shadow-md">
        <Sun className="h-5 w-5 text-yellow-400 animate-pulse" />
        <span className="font-semibold text-green-700 dark:text-green-200">Ai Powered</span>
      </div>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-green-900/60 px-4 py-2 rounded-full shadow-md">
        <TrendingUp className="h-5 w-5 text-blue-500 animate-bounce" />
        <span className="font-semibold text-green-700 dark:text-green-200">AI Eco-Analysis</span>
      </div>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-green-900/60 px-4 py-2 rounded-full shadow-md">
        <Star className="h-5 w-5 text-green-500 animate-spin-slow" />
        <span className="font-semibold text-green-700 dark:text-green-200">Top Rated by Users</span>
      </div>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-green-900/60 px-4 py-2 rounded-full shadow-md">
        <BookOpen className="h-5 w-5 text-emerald-600 animate-fade-in" />
        <span className="font-semibold text-green-700 dark:text-green-200">Eco Shopping Hub</span>
      </div>
    </div>
    {/* Search Bar */}
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-12 animate-fade-in-up delay-300">
      <div className="flex w-full items-center space-x-2 mb-8">

      </div>
    </form>
    {/* Barcode Scanner Modal */}
    {showScanner && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full relative animate-fade-in-up">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl" onClick={() => setShowScanner(false)}>&times;</button>
          <Suspense fallback={<div className="text-center p-8">Loading scanner...</div>}>
            <BarcodeScanner
              onDetected={(result: string) => {
  // Try to find a product by barcode or name from allProducts
  const found = allProducts.find(p => p.name.toLowerCase() === result.toLowerCase() || p.id === result);
  if (found) {
    setScannedProduct(found);
  } else {
    setScannedError('No matching product found for scanned code.');
  }
  setShowScanner(false);
}}
              onClose={() => setShowScanner(false)}
            />
          </Suspense>
        </div>
      </div>
    )}
    {/* Scanned Product Modal */}
    {scannedProduct && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full relative animate-fade-in-up">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl" onClick={() => setScannedProduct(null)}>&times;</button>
          <h3 className="text-xl font-bold mb-2 text-green-700">Product Details</h3>
          {scannedProduct.image ? (
            <img src={scannedProduct.image} alt="Product" className="w-32 h-32 object-contain mx-auto mb-2" />
          ) : null}
          <div className="text-lg font-semibold mb-1">{scannedProduct.name || 'Product'}</div>
          {scannedProduct.brand ? <div><b>Brand:</b> {scannedProduct.brand}</div> : null}
          
          
          <Button className="mt-4 w-full" onClick={() => setScannedProduct(null)}>Close</Button>
        </div>
      </div>
    )}
    {scannedError && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full relative animate-fade-in-up">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl" onClick={() => setScannedError(null)}>&times;</button>
          <div className="text-red-600 font-bold text-center">{scannedError}</div>
          <Button className="mt-4 w-full" onClick={() => setScannedError(null)}>Close</Button>
        </div>
      </div>
    )}

    {/* Testimonials Carousel */}
    <div className="mt-10 animate-fade-in-up delay-500">
      <h3 className="text-xl md:text-2xl font-bold text-center mb-4 text-green-700">What Our Users Say</h3>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        <div className="bg-white/90 dark:bg-green-900/60 rounded-xl shadow-lg p-6 flex-1 min-w-[220px] max-w-xs">
          <p className="text-green-800 dark:text-green-100 italic mb-2">“EcoCart made it so easy to shop green. I love the alternatives suggestions!”</p>
          <div className="flex items-center gap-2">
            <img src="/ecocart-logo.png" alt="User" className="w-8 h-8 rounded-full" />
            <span className="font-semibold text-green-700 dark:text-green-200">Aarav S.</span>
            <span className="text-xs text-muted-foreground">Delhi</span>
          </div>
        </div>
        <div className="bg-white/90 dark:bg-green-900/60 rounded-xl shadow-lg p-6 flex-1 min-w-[220px] max-w-xs">
          <p className="text-green-800 dark:text-green-100 italic mb-2">“The AI features are next-level. I trust EcoCart for every purchase now.”</p>
          <div className="flex items-center gap-2">
            <img src="/ecocart-logo.png" alt="User" className="w-8 h-8 rounded-full" />
            <span className="font-semibold text-green-700 dark:text-green-200">Priya M.</span>
            <span className="text-xs text-muted-foreground">Mumbai</span>
          </div>
        </div>
        <div className="bg-white/90 dark:bg-green-900/60 rounded-xl shadow-lg p-6 flex-1 min-w-[220px] max-w-xs">
          <p className="text-green-800 dark:text-green-100 italic mb-2">“Best eco-friendly shopping experience in India. Highly recommended!”</p>
          <div className="flex items-center gap-2">
            <img src="/ecocart-logo.png" alt="User" className="w-8 h-8 rounded-full" />
            <span className="font-semibold text-green-700 dark:text-green-200">Rohan K.</span>
            <span className="text-xs text-muted-foreground">Bangalore</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Eco Shop Locator Section */}
      {/* Removed duplicate upper Footer/navigation bar for cleaner layout */}
      <section className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white py-16 px-4 rounded-2xl shadow-lg mb-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Find Eco Shops Near You</h2>
        <p className="mb-10 text-lg text-center max-w-2xl mx-auto text-white/90">Explore local eco-friendly stores and sustainable businesses on the map below.</p>
        <div className="w-full max-w-3xl flex flex-col items-center justify-center">
          <Link to="/shop-locator">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-12 rounded-2xl shadow-lg text-2xl transition-all duration-200">
              Find Eco Shops Near You
            </button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="search">Search Results</TabsTrigger>
            <TabsTrigger value="alternatives">Greener Alternatives</TabsTrigger>
            <TabsTrigger value="impact">My Eco-Impact</TabsTrigger>
            <TabsTrigger value="learn">Learn</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Sustainable Products</h2>
              <Button variant="outline" asChild>
                <Link to="/ai-features" className="flex items-center">
                  <Brain className="mr-2 h-4 w-4" /> AI Tools
                </Link>
              </Button>
            </div>
            
            {/* Motivational Eco Callout */}
            <div className="mb-6 flex items-center justify-center">
              <div className="bg-gradient-to-r from-green-400/80 to-blue-400/80 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in">
                <Sparkles className="h-6 w-6 animate-bounce" />
                <span className="font-semibold text-lg md:text-xl">Every purchase is a vote for the planet. Shop greener, live better!</span>
              </div>
            </div>

            {/* Section Title and Sort Dropdown */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-500" />
                <h3 className="text-2xl font-bold tracking-tight">Discover Sustainable Products</h3>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Curated for You</span>
              </div>
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="text-sm font-medium text-muted-foreground">Sort by:</label>
                <select
                  id="sort-by"
                  className="rounded-md border px-3 py-1 focus:ring-green-500 focus:border-green-500 text-sm"
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'eco') setProducts([...products].sort((a, b) => b.ecoScore - a.ecoScore));
                    else if (val === 'price') setProducts([...products].sort((a, b) => a.price - b.price));
                    else setProducts([...products]);
                  }}
                  defaultValue="eco"
                >
                  <option value="eco">EcoScore (Best First)</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="default">Default</option>
                </select>
              </div>
            </div>

            {/* AI Recommendations Section (with fade-in) */}
            <div className="animate-fade-in">
              <AIRecommendations products={products.length ? products : sampleProducts} />
            </div>

            {/* Product Grid Section Removed as per user request */}
            {products.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-green-600 via-blue-400 to-green-700 bg-clip-text text-transparent drop-shadow-lg animate-pulse mt-6 mb-4">
                    Sustainability takes forever, and that's the point.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-green-600 via-blue-400 to-green-700 bg-clip-text text-transparent drop-shadow-lg animate-pulse mt-6 mb-4">
                    Sustainability takes forever, and that's the point.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="alternatives">
            <h2 className="text-2xl font-bold mb-6">Greener Alternatives</h2>
            
            <ProductComparison 
              originalProduct={products[0]} 
              alternatives={alternatives} 
            />
          </TabsContent>
          
          <TabsContent value="impact">
            <h2 className="text-2xl font-bold mb-6">Your Eco-Impact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Impact Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 text-green-500" /> Your Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(ecoImpact).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                        <span className="text-green-500 font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    You're in the top 15% of eco-conscious shoppers!
                  </p>
                </CardFooter>
              </Card>

              {/* Saved Favorites */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 text-green-500" /> Saved Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleProducts.slice(0, 3).map(product => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md mr-3 flex-shrink-0 overflow-hidden">
                            <img src={product.id === sampleProducts[0].id ? "https://m.media-amazon.com/images/I/81TM9IG+noL._SL1500_.jpg" : product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="h-3 w-3 mr-1 text-green-500" /> 
                              {product.ecoScore}/10
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Saved Products
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="learn">
            <h2 className="text-2xl font-bold mb-6">Learn About Sustainable Shopping</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
  {
    title: 'Fast Fashion vs Sustainable Brands',
    image: 'https://rishihood.edu.in/wp-content/uploads/2021/02/Youth-Fast-Fashion.jpg',
    link: 'https://rishihood.edu.in/wp-content/uploads/2021/02/Youth-Fast-Fashion.jpg',
    description: 'Discover the impact of fast fashion and why supporting sustainable brands matters for people and planet.'
  },
  {
    title: 'Understanding Eco Labels',
    image: 'https://theinvestorsbook.com/wp-content/uploads/2023/08/Eco-labelling.jpg',
    link: 'https://www.ecolabel.com/en/eco-label-institute/eco-label-principleshttps://www.ecolabel.com/en/eco-label-institute/eco-label-principleshttps://www.ecolabel.com/en/eco-label-institute/eco-label-principles',
    description: 'Decode common eco labels and certifications to make informed, planet-friendly shopping decisions.'
  },
  {
    title: 'Reducing Your Carbon Footprint',
    image: 'https://media.licdn.com/dms/image/v2/D4D12AQFiCRFf7Eh6RQ/article-inline_image-shrink_1500_2232/article-inline_image-shrink_1500_2232/0/1701591304798?e=1748476800&v=beta&t=89oXAhd-dqB3JgRvQDlHewRBXJFBClPXvoto3gYJfRk',
    link: 'https://youth.europa.eu/get-involved/sustainable-development/how-reduce-my-carbon-footprint_en',
    description: 'Learn practical ways to minimize your personal and household carbon emissions.'
  }
].map((item, index) => (
  <Card key={index} className="hover:shadow-md transition-all">
    <CardHeader>
      <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-md mb-4 flex items-center justify-center overflow-hidden">
        <img src={item.image} alt={item.title} className="h-full object-contain" />
      </div>
      <CardTitle>{item.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{item.description}</p>
    </CardContent>
    <CardFooter>
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-full">
        <Button variant="outline" className="w-full">
          Read More
        </Button>
      </a>
    </CardFooter>
  </Card>
))}
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4">Common Eco-Friendly Certifications</h3>
              <div className="flex flex-wrap gap-3">
                {['Fair Trade Certified', 'USDA Organic', 'Energy Star', 'Forest Stewardship Council', 'Rainforest Alliance', 'GOTS Certified'].map((cert, i) => (
                  <div key={i} className="flex items-center bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-full">
                    <Leaf className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12 px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How EcoCart Helps You Shop Sustainably</h2>
          <p className="text-center text-muted-foreground mb-8">Using AI and data-driven insights to power your sustainable shopping journey</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<FeatureSection 
              icon={<Leaf className="h-8 w-8 text-green-500" />}
              title="Eco-Friendly Ratings"
              description="Each product is rated based on materials, brand ethics, and supply chain transparency."
            />
            
            <FeatureSection 
              icon={<ArrowRight className="h-8 w-8 text-green-500" />}
              title="Find Alternatives"
              description="Discover greener alternatives to your favorite products with detailed comparisons."
            />
            
            <FeatureSection 
              icon={<Brain className="h-8 w-8 text-green-500" />}
              title="AI-Powered Tools"
              description="Use our machine learning tools to detect greenwashing and calculate carbon footprints."
            />
          </div>
        </div>
      </section>

      {/* Chat component */}
      {/* Eco Guide AI Chatbot - always on landing page */}
      <EcoGuideChat />
      {/* Eco Voicy Voice Assistant */}
      <EcoVoicyAssistant
        onTabSelect={setActiveTab}
        onFillForm={setVoiceForm}
      />

    </div>
  );
};

export default Index;
