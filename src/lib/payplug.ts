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

export async function createPayment(orderData: PaymentData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${PAYPLUG_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYPLUG_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(orderData.amount * 100), // Conversion en centimes
        currency: 'EUR',
        notification_url: `${siteUrl}/api/webhooks/payplug`,
        hosted_payment: {
          return_url: `${siteUrl}/commande/confirmation`,
          cancel_url: `${siteUrl}/commande`
        },
        billing: {
          email: orderData.email,
          first_name: orderData.first_name,
          last_name: orderData.last_name
        },
        shipping: {
          delivery_type: 'BILLING',
          address: {
            ...orderData.shipping_address,
            country: 'FR'
          }
        },
        metadata: {
          customer_id: orderData.email
        },
        force_3ds: true, // Activer systématiquement le 3D Secure pour plus de sécurité
        save_card: false, // Ne pas sauvegarder la carte
        allow_save_card: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création du paiement');
    }

    const payment = await response.json();
    return payment;
  } catch (error) {
    console.error('Erreur PayPlug:', error);
    throw error;
  }
}
