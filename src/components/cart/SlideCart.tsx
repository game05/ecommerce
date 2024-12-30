'use client';

import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface SlideCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlideCart = ({ isOpen, onClose }: SlideCartProps) => {
  const { items, removeFromCart, updateQuantity, closeCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  const handleCheckout = () => {
    closeCart();
    router.push('/commande');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 transition-opacity z-40
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[28rem] max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Mon Panier</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4 space-y-4">
              <div className="relative w-36 h-36 md:w-48 md:h-48">
                <Image
                  src="/images/empty-cart-cat.png"
                  alt="Panier vide"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-gray-500">Votre panier est vide</p>
              <button 
                onClick={onClose}
                className="text-pink-500 hover:text-pink-600 font-medium"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${JSON.stringify(item.customization)}`} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.customization && (
                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                          <p>
                            <span className="font-medium">Prénom :</span> {item.customization.prenom}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Motif{item.customization.motif ? ' (+3€)' : ''} :</span>
                            {item.customization.motif ? (
                              <div className="relative w-6 h-6">
                                <Image
                                  src={item.customization.motif}
                                  alt="Motif personnalisé"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <span>Sans motif</span>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center mt-2">
                        <button
                          className="w-8 h-8 flex items-center justify-center border rounded-l"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          -
                        </button>
                        <span className="w-12 h-8 flex items-center justify-center border-t border-b">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 flex items-center justify-center border rounded-r"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-pink-500 font-medium mt-2">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.customization)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-none border-t p-4 bg-white">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-medium">{total.toFixed(2)} €</span>
          </div>
          <div className="mt-4">
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              Commander ({total.toFixed(2)} €)
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
