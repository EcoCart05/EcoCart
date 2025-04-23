import React from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Footer: React.FC = () => (
  <footer className="w-full bg-gradient-to-r from-green-900 via-green-700 to-green-900 text-white py-10 px-4 mt-12 shadow-inner border-t border-green-400">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <Leaf className="h-8 w-8 text-green-300 mr-2" />
        <span className="font-extrabold text-xl tracking-tight">EcoCart</span>
      </div>
      {/* Navigation Links */}
      <nav className="flex flex-wrap gap-7 justify-center text-base font-semibold py-2 w-full mx-auto ml-28">
        <Link to="/about" className="hover:text-yellow-200 transition">About</Link>
        <Link to="/blog" className="hover:text-yellow-200 transition">Blog</Link>

        <Link to="/contact" className="hover:text-yellow-200 transition">Contact</Link>
        
      </nav>
      {/* Mission Statement */}
      <div className="text-sm text-green-100 max-w-xs mx-auto md:mx-0">
        Helping you make sustainable shopping choices for a greener tomorrow.
      </div>
    </div>
    <div className="mt-8 text-center text-xs text-green-200 opacity-80">
      &copy; {new Date().getFullYear()} EcoCart. All rights reserved.
    </div>
  </footer>
);

export default Footer;
