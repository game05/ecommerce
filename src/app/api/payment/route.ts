import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    console.log('Création du paiement avec les données:', orderData);

    // Vérifier la clé API PayPlug
    const PAYPLUG_API_KEY = process.env.NEXT_PUBLIC_PAYPLUG_SECRET_KEY;
    if (!PAYPLUG_API_KEY) {
      throw new Error('Clé API PayPlug non configurée');
    }

    // Construire les URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!baseUrl) {
      throw new Error('URL du site non configurée');
    }

    const paymentData = {
      amount: Math.round(orderData.amount * 100),
      currency: 'EUR',
      notification_url: `${baseUrl}/api/webhooks/payplug`,
      hosted_payment: {
        return_url: `${baseUrl}/commande/confirmation`,
        cancel_url: `${baseUrl}/commande/annulation`
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

    const response = await fetch('https://api.payplug.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYPLUG_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const paymentResponse = await response.json();
    console.log('Réponse PayPlug:', paymentResponse);

    if (!response.ok) {
      return NextResponse.json(
        { error: paymentResponse.message || 'Erreur lors de la création du paiement' },
        { status: response.status }
      );
    }

    if (!paymentResponse.hosted_payment?.payment_url || !paymentResponse.id) {
      return NextResponse.json(
        { error: 'Réponse PayPlug invalide' },
        { status: 500 }
      );
    }

    // Construire l'URL de retour avec l'ID de paiement
    const returnUrl = new URL(paymentData.hosted_payment.return_url);
    returnUrl.searchParams.set('payment_id', paymentResponse.id);

    return NextResponse.json({
      payment_url: paymentResponse.hosted_payment.payment_url,
      payment_id: paymentResponse.id
    });
  } catch (error) {
    console.error('Erreur serveur PayPlug:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
