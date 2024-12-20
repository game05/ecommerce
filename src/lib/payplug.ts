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
  confirmation_token: string;
}

interface ApiResponse {
  data?: {
    payment_url: string;
    payment_id: string;
    confirmation_token: string;
  };
  error?: string;
}

export async function createPayment(orderData: PaymentData): Promise<PaymentResponse> {
  try {
    console.log('Envoi de la demande de paiement:', orderData);
    
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: orderData.amount,
        customer: {
          firstName: orderData.first_name,
          lastName: orderData.last_name,
          email: orderData.email,
          address: orderData.shipping_address.street_address,
          postcode: orderData.shipping_address.postcode,
          city: orderData.shipping_address.city
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erreur de réponse:', error);
      throw new Error(error.error || 'Erreur lors de la création du paiement');
    }

    const result: ApiResponse = await response.json();
    console.log('Réponse de paiement reçue:', result);

    if (!result.data?.payment_url || !result.data?.payment_id || !result.data?.confirmation_token) {
      throw new Error('URL de paiement manquante dans la réponse');
    }

    // Stocker le token de confirmation dans le localStorage
    localStorage.setItem('confirmation_token', result.data.confirmation_token);

    return {
      payment_url: result.data.payment_url,
      payment_id: result.data.payment_id,
      confirmation_token: result.data.confirmation_token
    };
  } catch (error: any) {
    console.error('Erreur lors de la création du paiement:', error);
    throw error;
  }
}
