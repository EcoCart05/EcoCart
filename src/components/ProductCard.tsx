
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, Info } from "lucide-react";
import EcoBadge from "@/components/EcoBadge";

import type { Product } from "@/data/products";
import { calculateEcoScore } from "@/utils/ecoScoreModel";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useWishlist } from "@/context/WishlistContext";

const ImageWithFallback: React.FC<{ src: string; alt: string; url?: string }> = ({ src, alt, url }) => {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  // Special case: Eco-Friendly Phone Case image
  if (alt === 'Eco-Friendly Phone Case') {
    return (
      <div className="relative w-full aspect-[4/3] rounded overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <img src="https://www.evecork.com/cdn/shop/articles/Pela-case-biodegradable_eb181663-3b16-468d-bad0-490f9bfe9478_1024x.jpg?v=1563394699" alt={alt} className="absolute inset-0 w-full h-full object-cover rounded" style={{background:'#e0f2f1'}} />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-100 bg-black/40 px-2 py-0.5 rounded">Eco Phone Case</span>
      </div>
    );
  }
  if (error || !src) {
    return (
      <div className="relative w-full aspect-[4/3] rounded overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        {/* Eco-Friendly Yoga Mat Image Fallback */}
        <img src="https://www.kheoni.com/cdn/shop/files/IMG_7005_1800x1800.jpg?v=1718962260" alt="Eco-Friendly Yoga Mat" className="absolute inset-0 w-full h-full object-cover rounded" style={{background:'#e0f2f1'}} />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-100 bg-black/40 px-2 py-0.5 rounded">Eco Yoga Mat</span>
      </div>
    );
  }
  return (
    <div className="relative w-full h-full">
      {/* Blurred placeholder and spinner while loading */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 animate-pulse z-10">
          <div className="w-16 h-16 rounded-full border-4 border-green-300 border-t-transparent animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`object-cover w-full h-full rounded-t-lg transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        style={{ display: 'block', margin: 0, border: 0, maxHeight: '100%', maxWidth: '100%' }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      {/* Clickable overlay for external link */}
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`View ${alt} details`} className="absolute inset-0 z-20"></a>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onSave?: () => void;
  onShowAlternative?: (product: Product) => void;
  onAddToCart?: () => void;
  showRemoveFromWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSave, onShowAlternative, onAddToCart, showRemoveFromWishlist }) => {
  const ecoScore = calculateEcoScore(product);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = wishlist?.some((item) => item.product.id === product.id);

  // Fallback avatar initials: use product.brand or product.name
  const getInitials = () => {
    if (product.brand) return product.brand.slice(0, 2).toUpperCase();
    if (product.name) return product.name.slice(0, 2).toUpperCase();
    return "?";
  };

  if (!product || !product.name || typeof product.price !== "number") {
    return (
      <div style={{ color: 'red', padding: 16, border: '1px solid red', margin: 8 }}>
        Error rendering product card. Check console for details.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="h-full"
    >
      <Card className="relative flex flex-col h-full shadow-xl border-green-200 hover:shadow-2xl transition-shadow duration-300 bg-white/60 backdrop-blur-lg">
        {/* Avatar/profile placeholder */}
        {/* Avatar/profile placeholder */}
        {/* Eco badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.badges.map((badge, idx) => (
              <EcoBadge key={idx} type={badge} />
            ))}
          </div>
        )}
        {/* Product image */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center rounded-t-lg overflow-hidden min-h-[180px]">
          {product.image ? (
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              url={product.url}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-green-500 bg-gradient-to-br from-green-50 to-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m10-10H2" />
              </svg>
              <span className="text-xs text-gray-400">No Image</span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 z-30 pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!user) {
                  import("@/components/ui/use-toast").then(({ toast }) => toast({ title: "Login required", description: "Please login to use the wishlist.", variant: "destructive" }));
                  return;
                }
                if (!isWishlisted) {
                  await addToWishlist(product);
                  import("@/components/ui/use-toast").then(({ toast }) => toast({ title: "Added to Wishlist", description: `${product.name} added to your wishlist!`, variant: "default" }));
                } else {
                  await removeFromWishlist(product.id);
                  import("@/components/ui/use-toast").then(({ toast }) => toast({ title: "Removed from Wishlist", description: `${product.name} removed from your wishlist!`, variant: "default" }));
                }
              }}
              className={`p-1 rounded-full border shadow transition ${isWishlisted ? 'bg-pink-100 border-pink-300' : 'bg-white/70 border-pink-200'} hover:bg-pink-200`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              disabled={!user}
            >
              <Heart
                className={`w-6 h-6 transition-colors ${isWishlisted ? 'text-pink-600 fill-pink-400' : 'text-gray-400'}`}
                fill={isWishlisted ? '#ec4899' : 'none'}
                stroke="#ec4899"
              />
            </motion.button>
          </div>
        </div>
        <div className="h-[1px] bg-gray-200 w-full mb-2" />
        <div className="flex flex-col flex-1">
          <div className="px-4 pt-2 pb-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-green-600 drop-shadow-md leading-tight text-left">{product.name}</h2>
                {typeof product.ecoScore === 'number' && (
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold border-2 shadow-sm transition-colors duration-200
                      ${product.ecoScore > 75
                        ? 'bg-green-100 text-green-800 border-green-500'
                        : product.ecoScore >= 40
                          ? 'bg-orange-100 text-orange-700 border-orange-400'
                          : 'bg-red-100 text-red-700 border-red-500'}
                    `}
                    title={
                      product.ecoScore > 75
                        ? 'Highly eco-friendly product'
                        : product.ecoScore >= 40
                          ? 'Moderately eco-friendly'
                          : 'Not eco-friendly'
                    }
                    aria-label={`EcoScore: ${product.ecoScore}`}
                  >
                    EcoScore: {product.ecoScore}
                  </span>
                )}
            </div>
            <span className="text-sm font-medium text-gray-500 text-left">{product.brand}</span>
          </div>
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {(product.materials ?? []).map((mat, i) => (
              <EcoBadge key={"mat-"+i} type={mat} />
            ))}
            {(product.certifications ?? []).map((cert, i) => (
              <EcoBadge key={"cert-"+i} type={cert} />
            ))}
            {(product.badges ?? []).map((badge, i) => (
              <EcoBadge key={"badge-"+i} type={badge} />
            ))}
            {(product.sustainabilityTags ?? []).map((tag, i) => (
              <EcoBadge key={"tag-"+i} type={tag} />
            ))}
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <CardFooter className="flex flex-col gap-2 px-4 py-2">
  <div className="flex justify-between w-full items-center">
    <div className="flex items-center gap-2">
      {/* Greener Alternative Button */}
      {onShowAlternative && (
        <Button
          variant="outline"
          size="sm"
          className="text-green-700 border-green-400 hover:bg-green-50"
          onClick={() => onShowAlternative(product)}
          title="Find a greener alternative"
        >
          🌱 Greener Alternative
        </Button>
      )}
    </div>
    <span className="text-lg font-bold text-green-500 drop-shadow-md">₹{product.price}</span>
  </div>
  <a
    href={product.url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition whitespace-nowrap max-w-full overflow-hidden text-ellipsis w-full text-center"
    style={{ boxSizing: 'border-box', minWidth: 0 }}
  >
    View Product
  </a>
</CardFooter>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
