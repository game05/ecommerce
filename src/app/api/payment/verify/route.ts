import { NextResponse } from 'next/server';

const PAYPLUG_API_KEY = process.env.NEXT_PUBLIC_PAYPLUG_SECRET_KEY;
const PAYPLUG_API_URL = 'https://api.payplug.com/v1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID de paiement manquant' },
        { status: 400 }
      );
    }

    const response = await fetch(`${PAYPLUG_API_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${PAYPLUG_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Erreur PayPlug:', await response.text());
      return NextResponse.json(
        { error: 'Erreur lors de la vérification du paiement' },
        { status: response.status }
      );
    }

    const payment = await response.json();
    console.log('Détails du paiement:', payment);

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    );
  }
}
