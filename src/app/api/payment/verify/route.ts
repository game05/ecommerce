import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID de paiement manquant' },
        { status: 400 }
      );
    }

    // Récupérer la clé API PayPlug
    const apiKey = process.env.NEXT_PUBLIC_PAYPLUG_SECRET_KEY;
    if (!apiKey) {
      throw new Error('Clé API PayPlug non configurée');
    }

    // Vérifier le paiement avec PayPlug
    const response = await fetch(`https://api.payplug.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur PayPlug: ${response.statusText}`);
    }

    const payment = await response.json();

    return NextResponse.json({
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
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    );
  }
}
