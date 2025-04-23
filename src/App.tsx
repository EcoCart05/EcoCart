import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AIFeatures from "./pages/AIFeatures";
import EcoScoreTool from "./pages/EcoScoreTool";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProductList from "./pages/ProductList";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ErrorBoundary from "@/components/ErrorBoundary";

import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";

import OrderSuccessPage from "@/pages/OrderSuccessPage";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import ShopLocator from "@/pages/ShopLocator";
import UserProfile from "@/pages/UserProfile";
import ProductReviews from "@/pages/ProductReviews";
import CommunityForum from "@/pages/CommunityForum";
import Wishlist from "@/pages/Wishlist";
import Article from "@/pages/Article";
import Footer from "@/components/Footer";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Define the App component as a proper function component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ErrorBoundary>
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ConditionalNavbar />
                  <style>{`
                    .nav-link {
                      font-size: 1.08rem;
                      font-weight: 500;
                      padding: 0.5rem 1rem;
                      border-radius: 0.5rem;
                      transition: background 0.2s, color 0.2s;
                      color: #fff;
                    }
                    .nav-link:hover, .nav-link.active {
                      background: rgba(255,255,255,0.10);
                      color: #fff59d;
                    }
                  `}</style>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    {/* App layout: flex column, footer always at bottom */}
                    <div className="min-h-screen flex flex-col justify-between">
                      <div className="flex-1 flex flex-col">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/ecoscore-tool" element={<EcoScoreTool />} />
                          <Route path="/ai-features" element={<AIFeatures />} />
                          <Route path="/product-list" element={<ProductList />} />
                          <Route path="/order-success" element={<OrderSuccessPage />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/order-history" element={<OrderHistoryPage />} />
                          <Route path="/admin-orders" element={<AdminOrdersPage />} />
                          <Route path="/auth/login" element={<Login redirectTo="/" />} />
                          <Route path="/auth/signup" element={<Signup redirectTo="/" />} />
                          <Route path="/shop-locator" element={<ShopLocator />} />
                          <Route path="/profile" element={<UserProfile />} />
                          <Route path="/reviews" element={<ProductReviews />} />
                          <Route path="/community" element={<CommunityForum />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/articles" element={<Article />} />
                          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                      <Footer />
                    </div>
                  </TooltipProvider>
                </Router>
              </ErrorBoundary>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Navigation bar with auth-aware buttons
const NavbarWithAuth: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  return (
    <nav className="navbar sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-gradient-to-r from-green-700 via-green-500 to-green-700 text-white shadow-lg rounded-b-xl border-b border-green-200 w-full">
      {/* Brand */}
      <div className="navbar__brand flex gap-4 items-center flex-shrink-0 mb-2 md:mb-0">
        <img src="/ecocart-logo.png" alt="EcoCart Logo" className="w-10 h-10 rounded-full shadow border-2 border-green-200 bg-white" />
        <NavLink to="/" className={({ isActive }) => `navbar__title font-bold text-2xl transition-colors duration-200 ${isActive ? 'text-yellow-200' : 'hover:text-yellow-200'}`}>EcoCart</NavLink>
      </div>
      {/* Navigation Links */}
      <ul className="navbar__links flex flex-wrap gap-3 md:gap-6 items-center justify-center flex-1 md:justify-start list-none m-0 p-0 ml-8">
        <li><NavLink to="/product-list" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Products</NavLink></li>
        <li><NavLink to="/reviews" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Reviews</NavLink></li>
        <li><NavLink to="/community" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Community Forum</NavLink></li>
        <li><NavLink to="/articles" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Articles</NavLink></li>
      </ul>
      {/* Auth/Profile Actions */}
      <div className="navbar__actions flex gap-3 items-center flex-shrink-0 mt-2 md:mt-0">
        {user ? (
          <ProfileDropdown user={user} onLogout={handleLogout} />
        ) : (
          <>
            <NavLink to="/auth/login" className="navbar__login ml-3 bg-white text-green-700 px-4 py-2 rounded font-bold hover:bg-green-100 transition">Login</NavLink>
            <NavLink to="/auth/signup" className="navbar__register ml-2 bg-yellow-100 text-green-900 px-4 py-2 rounded font-bold hover:bg-yellow-200 transition">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

// Only show navbar if not on login or register page
const ConditionalNavbar: React.FC = () => {
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/auth/login") || location.pathname.startsWith("/auth/signup");
  return hideNav ? null : <NavbarWithAuth />;
};

// ProfileDropdown component for Navbar
import { useState, useEffect } from "react"; 
import WishlistDrawer from "@/components/WishlistDrawer";



import type { User } from "firebase/auth";
import { User as UserIcon, ChevronDown } from "lucide-react";

const ProfileDropdown: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      const dropdown = document.getElementById('profile-dropdown-menu');
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-10 h-10 bg-white text-green-700 rounded-full shadow hover:bg-green-100 transition"
        onClick={() => setDropdownOpen((v) => !v)}
        aria-label="Open profile menu"
      >
        <UserIcon className="w-6 h-6" />
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      {dropdownOpen && (
        <div id="profile-dropdown-menu" className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 flex flex-col">
  <button className="px-4 py-2 text-left text-gray-800 font-medium text-base hover:bg-green-50 hover:text-green-900 transition-colors" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>👤 Account Settings</button>
  <button className="px-4 py-2 text-left text-gray-800 font-medium text-base hover:bg-green-50 hover:text-green-900 transition-colors" onClick={() => { setDropdownOpen(false); setWishlistOpen(true); }}>💚 Wishlist</button>
  <div className="border-t my-1" />
  <button className="px-4 py-2 text-left text-red-600 font-medium text-base hover:bg-red-50 hover:text-red-700 transition-colors" onClick={() => { setDropdownOpen(false); onLogout(); }}>Logout</button>
</div>
      )}
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      
    </div>
  );
};

export default App;

