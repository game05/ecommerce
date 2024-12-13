'use client';

import { Menu, X, Bath } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-700 hover:text-primary transition p-2 -m-2"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity
            ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Content */}
        <div className="relative w-4/5 max-w-sm h-full bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-bold text-primary">La Chabroderie</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="block text-lg text-gray-700 hover:text-primary transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="block text-lg text-gray-700 hover:text-primary transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Produits
                  </Link>
                </li>
                <li>
                  <Link
                    href="/serviettes"
                    className="flex items-center text-lg text-gray-700 hover:text-primary transition space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Bath className="h-5 w-5" />
                    <span>Serviettes</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="block text-lg text-gray-700 hover:text-primary transition"
                    onClick={() => setIsOpen(false)}
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block text-lg text-gray-700 hover:text-primary transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Footer */}
            <div className="border-t p-4">
              <div className="text-sm text-gray-500">
                2024 La Chabroderie. Tous droits réservés.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
