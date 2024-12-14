'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Heart, Box, Truck, RefreshCw, ShoppingCart } from 'lucide-react';
import CartFlyAnimation from '@/components/animations/CartFlyAnimation';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  details: string[];
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [skipCustomization, setSkipCustomization] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFlyAnimation, setShowFlyAnimation] = useState(false);
  const [cartIconPosition, setCartIconPosition] = useState({ x: 0, y: 0 });
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    const updateCartIconPosition = () => {
      const cartIcon = document.querySelector('.cart-icon');
      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect();
        setCartIconPosition({
          x: rect.right - 20,
          y: rect.top + rect.height / 2
        });
      }
    };

    updateCartIconPosition();
    window.addEventListener('resize', updateCartIconPosition);
    const interval = setInterval(updateCartIconPosition, 1000);

    return () => {
      window.removeEventListener('resize', updateCartIconPosition);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    async function getProduct() {
      try {
        const decodedSlug = decodeURIComponent(params.slug);
        const productName = decodedSlug.replace(/-/g, ' ');
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('name', productName)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
      } finally {
        setLoading(false);
      }
    }

    getProduct();
  }, [params.slug]);

  const handleAddToCart = () => {
    if (product) {
      setShowFlyAnimation(true);
      // On ajoute le produit au panier immédiatement
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
        customization: null
      });
    }
  };

  const handleAnimationComplete = () => {
    setShowFlyAnimation(false);
    openCart(); // On utilise openCart au lieu de toggleCart
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleSkipCustomization = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkipCustomization(e.target.checked);
  };

  return (
    <>
      {showFlyAnimation && (
        <CartFlyAnimation
          productImage={product.image_url}
          targetX={cartIconPosition.x}
          targetY={cartIconPosition.y}
          onComplete={handleAnimationComplete}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Colonne gauche - Image */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-lg">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Colonne droite - Informations */}
          <div className="space-y-8">
            {/* En-tête */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-2xl font-semibold text-pink-500">
                {product.price.toFixed(2)}€
              </p>
            </div>

            {/* Avantages */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg">
                <Truck className="h-5 w-5 text-pink-500" />
                <span className="text-sm">Livraison rapide</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg">
                <RefreshCw className="h-5 w-5 text-pink-500" />
                <span className="text-sm">Retours gratuits</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg">
                <Heart className="h-5 w-5 text-pink-500" />
                <span className="text-sm">Fait main</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg">
                <Box className="h-5 w-5 text-pink-500" />
                <span className="text-sm">Qualité premium</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Stock */}
            <div>
              {product.stock > 0 ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">En stock ({product.stock} disponibles)</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-600">Rupture de stock</span>
                </div>
              )}
            </div>

            {/* Options d'achat */}
            <div className="space-y-6 pt-4">
              {/* Toggle personnalisation */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipCustomization}
                  onChange={handleSkipCustomization}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-600">Commander sans personnalisation</span>
              </label>

              {/* Bouton d'action */}
              {product.stock > 0 && (
                <div className="transition-all duration-300">
                  {skipCustomization ? (
                    <motion.button
                      id="add-to-cart-button"
                      onClick={handleAddToCart}
                      className="w-full py-4 px-6 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-600 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Ajouter au panier</span>
                    </motion.button>
                  ) : (
                    <Link
                      href={`/personnalisation/${encodeURIComponent(product.name.toLowerCase().replace(/ /g, '-'))}`}
                      className="w-full py-4 px-6 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-600 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="animate-pulse"
                      >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                      <span>Commencer la personnalisation</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div className="border-t border-gray-200 pt-8 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Livraison</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Livraison gratuite à partir de 49€ d'achat. Livraison en 2-4 jours ouvrés.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Retours</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Retours gratuits sous 30 jours. Nous prenons en charge les frais de retour.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
