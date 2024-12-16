'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

interface OrderDetails {
  id: string;
  amount: number;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  status: string;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentId = searchParams.get('id');
    
    if (!paymentId) {
      // Si pas d'ID de paiement, rediriger vers la page d'accueil
      router.push('/');
      return;
    }

    // Vérifier le statut du paiement
    const checkPayment = async () => {
      try {
        const response = await fetch(`/api/payment/verify?id=${paymentId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la vérification du paiement');
        }

        const data = await response.json();
        if (data.status === 'paid') {
          setOrderDetails(data);
          // Vider le panier uniquement si le paiement est confirmé
          clearCart();
        } else {
          // Si le paiement n'est pas confirmé, rediriger vers la page d'accueil
          router.push('/');
        }
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, [router, searchParams, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center mb-8">
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
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                Merci pour votre commande !
              </h2>
              <p className="mt-2 text-gray-600">
                Votre commande a été confirmée et sera bientôt traitée.
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Numéro de commande
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {orderDetails.id}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Date de commande
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(orderDetails.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Montant</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {(orderDetails.amount / 100).toFixed(2)} €
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Client</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {orderDetails.customer.first_name} {orderDetails.customer.last_name}
                    <br />
                    {orderDetails.customer.email}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
