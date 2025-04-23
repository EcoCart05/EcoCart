import React, { useState } from "react";
import { products, Product } from "@/data/products";
import BarcodeScanner from "@/components/BarcodeScanner";
import ProductCard from "@/components/ProductCard";
import { askGemini } from "@/services/gemini";
import LanguageSelector from "@/components/LanguageSelector";
import { translateText } from "@/services/translate";
import WishlistDrawer from "@/components/WishlistDrawer";
import EcoGuideChat from "@/components/EcoGuideChat";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

const ProductList: React.FC = () => {
  const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false);
  const [barcodeError, setBarcodeError] = useState("");
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [alternative, setAlternative] = useState<Product | null>(null);
  const [aiReason, setAiReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [, setCartOpen] = useState(false);
  const { user } = useAuth();
  const userId = user?.uid || "guest";
  const { wishlist, addToWishlist } = useWishlist();
  const [purchased, setPurchased] = useState<{ [id: string]: boolean }>({});
  // Translation state
  const [selectedLang, setSelectedLang] = useState('en');
  const [translatedProducts, setTranslatedProducts] = useState<Product[] | null>(null);
  const [translating, setTranslating] = useState(false);

  // Filter products by search
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const [sortOption, setSortOption] = useState<'default' | 'price' | 'ecoScore'>('default');

  const filtered = products.filter((p) => {
    // Text search
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      (p.materials && p.materials.join(", ").toLowerCase().includes(search.toLowerCase()));
    // Attribute filters
    if (activeFilters.length === 0) return matchesSearch;
    const allTags = [
      ...(p.badges || []),
      ...(p.sustainabilityTags || []),
      ...(p.certifications || []),
    ].map((tag) => tag.toLowerCase());
    return (
      matchesSearch &&
      activeFilters.every((f) =>
        allTags.some((tag) => tag.includes(f.toLowerCase()))
      )
    );
  });

  // Sort filtered products
  const sortedProducts = [...filtered];
  if (sortOption === 'price') {
    sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === 'ecoScore') {
    sortedProducts.sort((a, b) => (b.ecoScore || 0) - (a.ecoScore || 0));
  }

  // Use translated products if available
  const displayProducts = translatedProducts || sortedProducts;


  // Find greener alternative (highest ecoScore, not the same product)
  const findGreenerAlternative = (product: Product) => {
    return products
      .filter((p) => p.id !== product.id && p.ecoScore > product.ecoScore)
      .sort((a, b) => b.ecoScore - a.ecoScore)[0] || null;
  };

  const handleShowAlternative = async (product: Product) => {
    setSelectedProduct(product);
    const alt = findGreenerAlternative(product);
    setAlternative(alt);
    setAiReason("");
    if (alt) {
      setLoading(true);
      // Ask Gemini why the alternative is greener
      const prompt = `Compare these two products for eco-friendliness and explain why the second is a greener choice.\nProduct 1: ${product.name}, Materials: ${product.materials.join(", ")}, Certifications: ${product.certifications.join(", ")}, EcoScore: ${product.ecoScore}.\nProduct 2: ${alt.name}, Materials: ${alt.materials.join(", ")}, Certifications: ${alt.certifications.join(", ")}, EcoScore: ${alt.ecoScore}.`;
      const reason = await askGemini(prompt);
      setAiReason(reason);
      setLoading(false);
    }
  };

  // Barcode search handler (now a no-op, handled by BarcodeScanner/ProductIngredientFinder)
  const handleBarcodeDetected = (barcode: string) => {
    // No-op: ingredient lookup handled in BarcodeScanner
  };

  return (
    <div className="container mx-auto py-8 relative">
      <h1 className="text-3xl font-bold mb-6">EcoCart Product Catalog</h1>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <input
          type="text"
          className="form-control w-full max-w-lg border border-gray-300 rounded px-3 py-2"
          placeholder="Search products, brands, or materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
          type="button"
          onClick={() => setBarcodeScannerOpen(true)}
        >
          Scan Barcode
        </button>
        <select
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          value={sortOption}
          onChange={e => setSortOption(e.target.value as 'default' | 'price' | 'ecoScore')}
          style={{ minWidth: 160 }}
        >
          <option value="default">Sort: Default</option>
          <option value="price">Sort by Price (Low to High)</option>
          <option value="ecoScore">Sort by EcoScore (High to Low)</option>
        </select>
      </div>
      {barcodeError && <div className="text-red-600 mb-2">{barcodeError}</div>}
      {barcodeScannerOpen && (
        <BarcodeScanner
          onDetected={handleBarcodeDetected}
          onClose={() => setBarcodeScannerOpen(false)}
        />
      )}
      {/* Search input moved above with barcode scanner button */}
      {/* Eco Attribute Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "Recyclable",
          "Organic",
          "Biodegradable",
          "Reusable",
          "Handmade",
          "Plantable",
          "Natural",
        ].map((attr) => (
          <button
            key={attr}
            className={`px-3 py-1 rounded-full border text-sm font-semibold transition-colors duration-150 ${activeFilters.includes(attr) ? 'bg-green-600 text-white border-green-700' : 'bg-white text-green-700 border-green-400 hover:bg-green-50'}`}
            onClick={() => {
              setActiveFilters((prev) =>
                prev.includes(attr)
                  ? prev.filter((f) => f !== attr)
                  : [...prev, attr]
              );
            }}
            type="button"
          >
            {attr}
          </button>
        ))}
      </div>
      {displayProducts.length === 0 ? (
        <div className="text-gray-500 text-center mt-20">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <div key={product.id} className="flex flex-col">
              <ProductCard
                product={product}
                onShowAlternative={handleShowAlternative}
                onSave={() => addToWishlist(product)}
                onAddToCart={() => setCartOpen(true)}
                showRemoveFromWishlist={wishlist?.some((item) => item.product.id === product.id)}
              />

            </div>
          ))}
        </div>
      )}

      {/* Google Translate below products */}
      <div className="flex flex-col items-center mt-8 gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="product-lang-select" className="font-medium">Translate products to:</label>
          <select
            id="product-lang-select"
            value={selectedLang}
            onChange={e => {
              setSelectedLang(e.target.value);
              setTranslatedProducts(null); // Reset translation when language changes
            }}
            className="border rounded px-2 py-1 bg-white text-gray-900"
            style={{ minWidth: 90 }}
            disabled={translating}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="ar">Arabic</option>
            <option value="ru">Russian</option>
            <option value="bn">Bengali</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            {/* Add more as needed */}
          </select>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold ml-2"
            onClick={async () => {
              if (selectedLang === 'en') {
                setTranslatedProducts(null);
                return;
              }
              setTranslating(true);
              try {
                const translated = await Promise.all(sortedProducts.map(async (product) => {
                  let name = product.name;
                  try {
                    name = await translateText(product.name, selectedLang, 'en');
                  } catch { /* ignore */ }
                  return { ...product, name };
                }));
                setTranslatedProducts(translated);
              } catch {
                setTranslatedProducts(null);
              }
              setTranslating(false);
            }}
            disabled={translating || sortedProducts.length === 0}
          >
            {translating ? 'Translating...' : 'Translate Products'}
          </button>
        </div>
        {translatedProducts && selectedLang !== 'en' && (
          <div className="text-green-700 text-xs mt-1">Showing translated names. <button className="underline ml-1" onClick={() => setTranslatedProducts(null)}>Reset</button></div>
        )}
      </div>
      {/* Greener Alternative Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 max-w-md w-full relative animate-fade-in-up flex flex-col items-center">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl" onClick={() => { setSelectedProduct(null); setAlternative(null); setAiReason(""); }}>&times;</button>
            <h2 className="text-lg font-bold mb-2">Greener Alternatives</h2>
            {loading ? (
              <div className="text-center p-6">Finding greener alternatives...</div>
            ) : (
              (() => {
                // Find up to 5 greener alternatives
                const alternatives = products
                  .filter((p) => p.id !== selectedProduct.id && p.ecoScore > selectedProduct.ecoScore)
                  .sort((a, b) => b.ecoScore - a.ecoScore)
                  .slice(0, 5);
                if (alternatives.length === 0) {
                  return <div className="text-red-600">No greener alternatives found.</div>;
                }
                // Summarize Gemini's explanation into 2-3 bullet points
                let summaryBullets: string[] = [];
                if (aiReason) {
                  summaryBullets = aiReason
                    .split(/[\n\r\u2022-]/)
                    .map(s => s.trim())
                    .filter(Boolean)
                    .slice(0, 3);
                }
                return (
                  <div className="w-full">
                    {summaryBullets.length > 0 && (
                      <div className="mb-3 bg-green-50 rounded p-2 text-green-900 text-xs">
                        <b>Why these are greener:</b>
                        <ul className="list-disc pl-5 mt-1">
                          {summaryBullets.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <ul className="list-disc pl-5 space-y-2">
                      {alternatives.map((alt) => (
                        <li key={alt.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-green-100 rounded px-2 py-1">
                          <span className="font-semibold">{alt.name}</span>
                          <span className="text-green-700 font-bold text-xs">EcoScore: {alt.ecoScore}</span>
                          <a href={alt.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs ml-2">Buy</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
      {/* Floating AI Chatbot Button */}
      <EcoGuideChat />
      {/* Google Pay Button at the bottom, only if cart is not empty */}
      {wishlist && wishlist.length > 0 && (
        <div className="mt-8 flex justify-center">
          {/* Google Pay Button placeholder */}
        </div>
      )}
    </div>
  );
};

export default ProductList;
