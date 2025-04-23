import React, { useEffect, useState } from "react";
import LanguageSelector from '@/components/LanguageSelector';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { motion } from "framer-motion";

const Wishlist: React.FC = () => {
  const { user } = useAuth();
  const { wishlist, clearWishlist } = useWishlist();

  // Wishlist is WishlistItem[]; extract product
  const products = wishlist.map((item) => item.product);

  const wishlistData = {
    name: 'Your Wishlist',
    description: 'Your wishlist is empty',
    materials: ['Clear Wishlist'],
    certifications: ['Click the heart on any product to add it here.'],
  };

  return (
    <div className="container mx-auto py-8">
      <LanguageSelector
        name={wishlistData.name}
        description={wishlistData.description}
        materials={wishlistData.materials}
        certifications={wishlistData.certifications}
      />
      <div className="flex items-center gap-3 mb-8 justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center bg-pink-100 rounded-full w-10 h-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#ec4899" viewBox="0 0 24 24" width="24" height="24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </span>
          <h2 className="text-2xl font-bold">{wishlistData.name}</h2>
          {products.length > 0 && (
            <span className="ml-2 bg-pink-100 text-pink-700 rounded-full px-3 py-1 text-sm font-semibold">{products.length} item{products.length > 1 ? 's' : ''}</span>
          )}
        </div>
        {products.length > 0 && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition-colors"
            onClick={async () => {
              await clearWishlist();
              import("@/components/ui/use-toast").then(({ toast }) => toast({ title: "Wishlist Cleared", description: "All items removed from your wishlist.", variant: "default" }));
            }}
          >
            {wishlistData.materials[0]}
          </button>
        )}
      </div>
      {products.length === 0 ? (
        <motion.div 
          className="flex flex-col items-center justify-center py-20"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="#fbcfe8" viewBox="0 0 24 24" width="64" height="64" className="mb-4"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <div className="text-gray-400 text-xl font-semibold">{wishlistData.description}</div>
          <div className="text-gray-500 mt-2">{wishlistData.certifications[0]}</div>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="hover:shadow-2xl transition-shadow rounded-lg border border-pink-100 bg-white p-2">
                <ProductCard product={product} showRemoveFromWishlist />
                <div className="px-2 pt-2 pb-1">
                  <div className="text-sm text-gray-700 font-semibold">{product.brand}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(product.badges ?? []).map((badge, i) => (
                      <span key={badge + i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{badge}</span>
                    ))}
                  </div>
                  <div className="text-lg font-bold text-pink-600 mt-2">₹{product.price}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;
