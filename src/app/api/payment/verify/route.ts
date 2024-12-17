import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');

    console.log('Vérification du paiement ID:', paymentId);

    if (!paymentId) {
      console.error('ID de paiement manquant dans la requête');
      return NextResponse.json(
        { error: 'ID de paiement manquant' },
        { status: 400 }
      );
    }

    // Récupérer la clé API PayPlug
    const apiKey = process.env.NEXT_PUBLIC_PAYPLUG_SECRET_KEY;
    if (!apiKey) {
      console.error('Clé API PayPlug non configurée');
      throw new Error('Clé API PayPlug non configurée');
    }

    console.log('Envoi de la requête à PayPlug...');

    // Vérifier le paiement avec PayPlug
    const response = await fetch(`https://api.payplug.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur PayPlug:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Erreur PayPlug: ${response.status} ${response.statusText}`);
    }

    const payment = await response.json();
    console.log('Réponse PayPlug:', payment);

    // Vérifier si le paiement existe et a un statut
    if (!payment || typeof payment.is_paid === 'undefined') {
      console.error('Réponse PayPlug invalide:', payment);
      throw new Error('Réponse PayPlug invalide');
    }

    const responseData = {
      status: payment.is_paid ? 'paid' : 'pending',
      payment_id: payment.id,
      amount: payment.amount,
      customer: {
        first_name: payment.billing?.first_name || '',
        last_name: payment.billing?.last_name || '',
        email: payment.billing?.email || ''
      },
      shipping_address: {
        street_address: payment.shipping?.street1 || '',
        city: payment.shipping?.city || '',
        postcode: payment.shipping?.postcode || ''
      }
    };

    console.log('Envoi de la réponse:', responseData);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    );
  }
}
