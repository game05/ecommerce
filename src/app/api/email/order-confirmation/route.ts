import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderNumber,
      customerName,
      customerEmail,
      items,
      total,
      shippingAddress
    } = body;

    // Vérification des données requises
    if (!orderNumber || !customerName || !customerEmail || !items || !total || !shippingAddress) {
      return NextResponse.json(
        { error: 'Données manquantes pour l\'envoi de l\'email' },
        { status: 400 }
      );
    }

    const result = await sendOrderConfirmationEmail({
      orderNumber,
      customerName,
      customerEmail,
      items,
      total,
      shippingAddress
    });

    if (!result.success) {
      console.error('Erreur lors de l\'envoi de l\'email:', result.error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
