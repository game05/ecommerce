'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

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
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    
    console.log('Paramètres URL:', { success });
    
    if (!success) {
      console.log('Paramètres manquants, redirection vers l\'accueil');
      router.push('/');
      return;
    }

    // Récupérer l'ID du paiement depuis le localStorage
    const paymentId = localStorage.getItem('current_payment_id');
    console.log('ID de paiement récupéré:', paymentId);

    if (!paymentId) {
      console.log('ID de paiement non trouvé, redirection vers l\'accueil');
      router.push('/');
      return;
    }

    // Vider le panier immédiatement
    clearCart();
    console.log('Panier vidé');

    // Supprimer l'ID du paiement du localStorage
    localStorage.removeItem('current_payment_id');

    // Vérifier le statut du paiement
    const checkPayment = async () => {
      try {
        console.log('Vérification du paiement:', paymentId);
        const response = await fetch(`/api/payment/verify?id=${paymentId}`);
        
        if (!response.ok) {
          console.error('Erreur de réponse:', response.status);
          throw new Error('Erreur lors de la vérification du paiement');
        }

        const data = await response.json();
        console.log('Réponse de vérification:', data);
        
        if (data.status !== 'paid') {
          console.error('Statut de paiement invalide:', data.status);
          throw new Error('Paiement non confirmé');
        }

        setOrderDetails(data);
        setPaymentStatus(data.status);
        setPaymentId(paymentId);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        setPaymentStatus('error');
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
            {paymentStatus === 'paid' ? (
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Merci pour votre commande !</h1>
                <p className="mb-4">Votre paiement a été confirmé.</p>
                <p className="mb-4">Numéro de commande : {paymentId}</p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
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
            ) : (
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
                <p className="mb-4">Le paiement n'a pas pu être vérifié.</p>
                <Link 
                  href="/commande" 
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80 transition-colors"
                >
                  Réessayer
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
