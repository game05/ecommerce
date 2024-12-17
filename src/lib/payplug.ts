// Récupération de la clé API depuis les variables d'environnement
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
  payment_url: string;
  payment_id: string;
}

export async function createPayment(orderData: PaymentData): Promise<PaymentResponse> {
  try {
    console.log('Envoi de la demande de paiement:', orderData);
    
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const payment = await response.json();
    console.log('Réponse de paiement reçue:', payment);

    if (!response.ok) {
      throw new Error(payment.error || 'Erreur lors de la création du paiement');
    }

    if (!payment.payment_url) {
      throw new Error('URL de paiement manquante dans la réponse');
    }

    return {
      payment_url: payment.payment_url,
      payment_id: payment.payment_id
    };
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    throw error;
  }
}
