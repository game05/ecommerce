'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        console.log('ID de paiement reçu:', paymentId);
        
        if (!paymentId) {
          console.error('Aucun ID de paiement trouvé dans l\'URL');
          setErrorMessage('ID de paiement manquant');
          setPaymentStatus('error');
          return;
        }

        console.log('Envoi de la requête de vérification...');
        const response = await fetch(`/api/payment/verify?payment_id=${paymentId}`);
        const data = await response.json();
        console.log('Réponse de vérification:', data);

        if (!response.ok) {
          console.error('Erreur HTTP:', response.status, data);
          setErrorMessage('Erreur lors de la vérification du paiement');
          setPaymentStatus('error');
          return;
        }

        if (data.error) {
          console.error('Erreur de l\'API:', data.error);
          setErrorMessage(data.error);
          setPaymentStatus('error');
          return;
        }

        if (data.status === 'paid') {
          console.log('Paiement confirmé, vidage du panier');
          clearCart();
          setPaymentStatus('success');
        } else {
          console.error('Statut de paiement invalide:', data.status);
          setErrorMessage('Le paiement n\'a pas été validé');
          setPaymentStatus('error');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        setErrorMessage('Une erreur inattendue est survenue');
        setPaymentStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Vérification du paiement en cours...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                Une erreur est survenue
              </h1>
              <p className="mt-2 text-gray-600">
                {errorMessage || "Le paiement n'a pas pu être vérifié. Veuillez réessayer ou nous contacter si le problème persiste."}
              </p>
              <div className="mt-8">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Merci pour votre commande !
            </h1>
            <p className="mt-2 text-gray-600">
              Votre paiement a été confirmé. Nous vous enverrons un email avec les détails de votre commande.
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
