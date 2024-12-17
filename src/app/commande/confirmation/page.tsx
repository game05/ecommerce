'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        
        if (!paymentId) {
          setError('ID de paiement non trouvé');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/payment/verify?payment_id=${paymentId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la vérification du paiement');
        }

        if (data.status === 'paid') {
          setIsSuccess(true);
          clearCart();
        } else {
          setError('Le paiement n\'a pas été confirmé');
        }

        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Une erreur est survenue lors de la vérification du paiement');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">Vérification du paiement en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Une erreur est survenue
              </h1>
              <p className="text-gray-600 mb-8">{error}</p>
              <Link 
                href="/commande"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Retourner au panier
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Commande confirmée !
            </h1>
            <p className="mt-2 text-gray-600">
              Merci pour votre commande. Nous vous contacterons bientôt pour la livraison.
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
