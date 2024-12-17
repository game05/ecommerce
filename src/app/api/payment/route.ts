import { NextResponse } from 'next/server';

const PAYPLUG_API_KEY = process.env.NEXT_PUBLIC_PAYPLUG_SECRET_KEY;
const PAYPLUG_API_URL = 'https://api.payplug.com/v1';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    console.log('Création du paiement avec les données:', orderData);

    const paymentData = {
      amount: Math.round(orderData.amount * 100),
      currency: 'EUR',
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/payplug`,
      hosted_payment: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/commande/confirmation`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/commande/annulation`
      },
      customer: {
        email: orderData.email,
        first_name: orderData.first_name,
        last_name: orderData.last_name,
        address1: orderData.shipping_address.street_address,
        postcode: orderData.shipping_address.postcode,
        city: orderData.shipping_address.city,
        country: orderData.shipping_address.country
      },
      force_3ds: true,
      metadata: {
        customer_id: orderData.email
      }
    };

    console.log('Envoi des données à PayPlug:', paymentData);

    const response = await fetch(`${PAYPLUG_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYPLUG_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
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

    // Ajouter l'ID de paiement à l'URL de retour
    const return_url = new URL(paymentData.hosted_payment.return_url);
    return_url.searchParams.set('payment_id', payment.id);

    // On renvoie l'URL de paiement modifiée et l'ID
    return NextResponse.json({
      payment_url: payment.hosted_payment.payment_url,
      payment_id: payment.id,
      return_url: return_url.toString()
    });
  } catch (error) {
    console.error('Erreur serveur PayPlug:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
