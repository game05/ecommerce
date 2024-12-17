import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, customerName, customerEmail, items, total, shippingAddress } = body;

    // Vérification des données requises
    if (!orderNumber || !customerName || !customerEmail || !items || !total || !shippingAddress) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Envoi de l'email
    const result = await sendOrderConfirmationEmail({
      orderNumber,
      customerName,
      customerEmail,
      items,
      total,
      shippingAddress
    });

    if (!result.success) {
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
