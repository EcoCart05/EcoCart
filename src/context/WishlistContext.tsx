import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUserWishlist, setUserWishlist } from "@/services/firestore";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/data/products";

interface WishlistItem {
  id: string;
  product: Product;
}

interface WishlistContextProps {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      getUserWishlist(user.uid)
        .then((data) => {
          // Support both legacy array of products and WishlistItem[]
          if (Array.isArray(data) && data.length > 0 && !data[0].product) {
            setWishlist(data.map((p: Product) => ({ id: p.id, product: p })));
          } else if (Array.isArray(data)) {
            setWishlist(data);
          } else {
            setWishlist([]);
          }
          setLoaded(true); // Mark as loaded!
        })
        .catch(() => {
          setWishlist([]);
          setLoaded(true);
        });
    } else {
      setWishlist([]);
      setLoaded(false);
    }
  }, [user]);

  useEffect(() => {
    // Only sync if loaded from Firestore
    if (user && user.uid && loaded) {
      setUserWishlist(user.uid, wishlist.map(item => item.product));
    }
  }, [wishlist, user, loaded]);

  const addToWishlist = async (product: Product) => {
    if (!user || !user.uid) {
      toast({
        title: "Login required",
        description: "Please login to use the wishlist.",
        variant: "destructive"
      });
      return;
    }
    try {
      const current = await getUserWishlist(user.uid);
      // Normalize to array of products
      const products = Array.isArray(current) && current.length > 0 && !current[0].product ? current : current.map((item: any) => item.product);
      if (products.find((p: Product) => p.id === product.id)) return;
      const updated = [...products, product];
      await setUserWishlist(user.uid, updated);
      setWishlist(updated.map((p: Product) => ({ id: p.id, product: p })));
    } catch (err) {
      toast({ title: "Error", description: "Could not update wishlist.", variant: "destructive" });
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (!user || !user.uid) {
      toast({
        title: "Login required",
        description: "Please login to use the wishlist.",
        variant: "destructive"
      });
      return;
    }
    try {
      const current = await getUserWishlist(user.uid);
      const products = Array.isArray(current) && current.length > 0 && !current[0].product ? current : current.map((item: any) => item.product);
      const updated = products.filter((p: Product) => p.id !== id);
      await setUserWishlist(user.uid, updated);
      setWishlist(updated.map((p: Product) => ({ id: p.id, product: p })));
    } catch (err) {
      toast({ title: "Error", description: "Could not update wishlist.", variant: "destructive" });
    }
  };

  const clearWishlist = async () => {
    if (!user || !user.uid) {
      toast({
        title: "Login required",
        description: "Please login to use the wishlist.",
        variant: "destructive"
      });
      return;
    }
    try {
      await setUserWishlist(user.uid, []);
      setWishlist([]);
    } catch (err) {
      toast({ title: "Error", description: "Could not clear wishlist.", variant: "destructive" });
    }
  };


  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
