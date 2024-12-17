'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        
        // Rediriger vers la page d'accueil si pas de payment_id
        if (!paymentId) {
          router.push('/');
          return;
        }

        const response = await fetch(`/api/payment/verify?payment_id=${paymentId}`);
        const data = await response.json();

        if (!response.ok || data.status !== 'paid') {
          // Si le paiement n'est pas confirmé, rediriger vers le panier
          router.push('/commande');
          return;
        }

        // Si le paiement est confirmé
        clearCart();
        setIsVerified(true);
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/commande');
      }
    };

    verifyPayment();
  }, [searchParams, clearCart, router]);

  // Afficher rien pendant la vérification
  if (!isVerified) {
    return null;
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
              Merci pour votre achat !
            </h1>
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
