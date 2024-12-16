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

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Récupérer l'ID de paiement du localStorage
        const paymentId = localStorage.getItem('current_payment_id');
        
        if (!paymentId) {
          setError('ID de paiement non trouvé');
          setLoading(false);
          return;
        }

        // Vérifier le statut du paiement
        const response = await fetch(`/api/payment/verify?payment_id=${paymentId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la vérification du paiement');
        }

        if (data.status === 'paid') {
          // Vider le panier si le paiement est confirmé
          clearCart();
          // Supprimer l'ID de paiement du localStorage
          localStorage.removeItem('current_payment_id');
        }

        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Une erreur est survenue lors de la vérification du paiement');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [clearCart]);

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
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/commande" 
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80 transition-colors"
                >
                  Réessayer le paiement
                </Link>
                <Link 
                  href="/" 
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
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
            
            <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-4">
              Merci pour votre commande !
            </h1>
            <p className="text-gray-600 mb-8">
              Votre commande a été confirmée et sera bientôt traitée.
              <br />
              Un email de confirmation vous sera envoyé prochainement.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/" 
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80 transition-colors"
              >
                Continuer mes achats
              </Link>
              <Link 
                href="/mon-compte" 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Voir mes commandes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
