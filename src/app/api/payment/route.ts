import { NextResponse } from 'next/server';

const PAYPLUG_API_KEY = process.env.NEXT_PUBLIC_PAYPLUG_SECRET_KEY;
const PAYPLUG_API_URL = 'https://api.payplug.com/v1';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    console.log('Création du paiement avec les données:', orderData);

    const response = await fetch(`${PAYPLUG_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYPLUG_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(orderData.amount * 100),
        currency: 'EUR',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/payplug`,
        hosted_payment: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/commande/confirmation`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/commande`
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
        force_3ds: true,
        save_card: false,
        allow_save_card: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur PayPlug:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Erreur lors de la création du paiement' },
        { status: response.status }
      );
    }

    const payment = await response.json();
    console.log('Paiement créé avec succès:', payment);
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Erreur serveur PayPlug:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
