import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useAuth } from "@/components/ProtectedRoute";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Sun, Moon, User, Heart, ShoppingCart, Settings, List } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export default function UserProfileMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, handleDarkModeToggle] = useDarkMode();
  const { wishlist } = useWishlist();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user) return null;

  // Avatar logic
  const initials = user.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.slice(0, 2).toUpperCase() || '';
  const avatarUrl = user.photoURL;

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="w-12 h-12 rounded-full border-2 border-green-400 shadow-md flex items-center justify-center bg-white overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-xl font-bold text-green-600">{initials}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{user.displayName || user.email}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 min-w-[210px] p-4 pt-2 bg-white dark:bg-gray-900 rounded shadow-lg border border-gray-200 dark:border-gray-700">


        {/* Menu Links */}
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
          <Settings className="w-5 h-5" /> Account Settings
        </button>
        
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${wishlist.length > 0 ? 'text-pink-600 font-bold' : 'text-gray-900 dark:text-gray-100'}`}
          onClick={() => navigate('/wishlist')}
        >
          <Heart className="w-5 h-5" fill={wishlist.length > 0 ? '#ec4899' : 'none'} stroke="#ec4899" /> Wishlist
          {wishlist.length > 0 && <span className="ml-1 bg-pink-100 text-pink-700 rounded-full px-2 py-0.5 text-xs">{wishlist.length}</span>}
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
          <ShoppingCart className="w-5 h-5" /> Cart
        </button>

        {/* Divider */}
        <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

        {/* Dark Mode Toggle */}
        <button
          onClick={handleDarkModeToggle}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mb-1"
        >
          {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-400" />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Divider */}
        <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

        <button
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
