'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Bath } from 'lucide-react';
import { SlideCart } from '../cart/SlideCart';
import { MobileMenu } from './MobileMenu';
import { useCart } from '@/hooks/useCart';

export const Navbar = () => {
  const { items, isOpen, toggleCart } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu */}
            <MobileMenu />

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-xl md:text-2xl font-bold text-primary">La Chabroderie</span>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/serviettes" 
                className="text-gray-700 hover:text-primary transition flex items-center space-x-1"
              >
                <Bath className="h-4 w-4" />
                <span>Serviettes</span>
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-primary transition">
                <Search className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button 
                className="text-gray-700 hover:text-primary transition relative cart-icon"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide Cart */}
      <SlideCart 
        isOpen={isOpen}
        onClose={toggleCart}
      />
    </>
  );
};
