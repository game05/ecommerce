import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const paymentData = await request.json();

    // Vérification du statut du paiement
    if (paymentData.status === 'paid') {
      // TODO: Mettre à jour le statut de la commande dans votre base de données
      console.log('Paiement réussi:', paymentData);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur webhook PayPlug:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
