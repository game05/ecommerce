'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const token = searchParams.get('token');
    
    // Vérifier si le token est présent dans le localStorage
    const storedToken = localStorage.getItem('confirmation_token');
    
    if (!success || !token || !storedToken || token !== storedToken) {
      console.log('Accès non autorisé à la page de confirmation');
      router.push('/');
      return;
    }

    // Token valide, on peut vider le panier et supprimer le token
    clearCart();
    localStorage.removeItem('confirmation_token');
    setIsValid(true);
  }, [searchParams, router, clearCart]);

  if (!isValid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Merci pour votre commande !
        </h1>

        <p className="text-gray-600">
          Votre commande a été confirmée. Vous recevrez bientôt un email avec les détails de votre commande.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition duration-200"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
