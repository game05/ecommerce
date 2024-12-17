'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const { clearCart, items } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Récupérer l'ID de paiement des paramètres d'URL
        const paymentId = searchParams.get('payment_id');
        
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
          // Envoyer l'email de confirmation
          const emailResponse = await fetch('/api/email/order-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderNumber: paymentId,
              customerName: `${data.customer.first_name} ${data.customer.last_name}`,
              customerEmail: data.customer.email,
              items: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              total: data.amount / 100,
              shippingAddress: {
                street: data.shipping_address.street_address,
                city: data.shipping_address.city,
                postcode: data.shipping_address.postcode
              }
            })
          });

          if (!emailResponse.ok) {
            const emailError = await emailResponse.json();
            console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
          }

          // Vider le panier si le paiement est confirmé
          clearCart();
        }

        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Une erreur est survenue lors de la vérification du paiement');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [clearCart, items, searchParams]);

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
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Commande confirmée !
            </h1>
            <p className="text-gray-600 mb-8">
              Merci pour votre commande. Vous recevrez un email de confirmation dans quelques instants.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
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
