// Récupération de la clé API depuis les variables d'environnement
const PAYPLUG_API_KEY = process.env.NEXT_PUBLIC_PAYPLUG_SECRET_KEY || 'sk_test_yugCPCAfcjcBYWEX2UlQw';
const PAYPLUG_API_URL = 'https://api.payplug.com/v1';

interface PaymentData {
  amount: number;
  email: string;
  first_name: string;
  last_name: string;
  shipping_address: {
    street_address: string;
    postcode: string;
    city: string;
    country: string;
  };
}

interface PaymentResponse {
  hosted_payment: {
    payment_url: string;
  };
  [key: string]: any;
}

export async function createPayment(orderData: PaymentData) {
  try {
    console.log('Envoi de la demande de paiement:', orderData);
    
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur réponse API:', errorData);
      throw new Error(errorData.error || 'Erreur lors de la création du paiement');
    }

    const payment = await response.json() as PaymentResponse;
    console.log('Réponse de paiement reçue:', payment);
    
    if (!payment.hosted_payment?.payment_url) {
      throw new Error('URL de paiement non disponible');
    }

    return payment;
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    throw error;
  }
}
