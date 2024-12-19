import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const origin = headersList.get('origin') || '';
    const baseUrl = origin || process.env.NEXT_PUBLIC_BASE_URL || '';
    
    const body = await request.json();
    const { amount, customer } = body;

    console.log('Données reçues:', { amount, customer });

    if (!amount || !customer) {
      return NextResponse.json(
        { error: 'Montant et informations client requis' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_PAYPLUG_SECRET_KEY;
    if (!apiKey) {
      throw new Error('Clé API PayPlug non configurée');
    }

    const paymentData = {
      amount: Math.round(amount * 100),
      currency: 'EUR',
      notification_url: `${baseUrl}/api/payment/webhook`,
      hosted_payment: {
        return_url: `${baseUrl}/commande/confirmation?success=true`,
        cancel_url: `${baseUrl}/commande?canceled=true`,
      },
      customer: {
        email: customer.email,
        first_name: customer.firstName,
        last_name: customer.lastName,
      },
      metadata: {
        customer_id: customer.email,
      },
    };

    console.log('Données envoyées à PayPlug:', paymentData);

    const response = await fetch('https://api.payplug.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
    console.log('Réponse PayPlug:', payment);

    // S'assurer que nous avons l'URL de paiement et l'ID
    if (!payment.hosted_payment?.payment_url || !payment.id) {
      console.error('Réponse PayPlug invalide:', payment);
      throw new Error('Réponse PayPlug invalide');
    }

    return NextResponse.json({
      data: {
        payment_url: payment.hosted_payment.payment_url,
        payment_id: payment.id
      }
    });

  } catch (error: any) {
    console.error('Erreur lors de la création du paiement:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de paiement requis' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_PAYPLUG_SECRET_KEY;
    if (!apiKey) {
      throw new Error('Clé API PayPlug non configurée');
    }

    const response = await fetch(`https://api.payplug.com/v1/payments/${id}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const payment = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payment.message || 'Erreur lors de la récupération du paiement' },
        { status: response.status }
      );
    }

    return NextResponse.json(payment);
  } catch (error: any) {
    console.error('Erreur lors de la récupération du paiement:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération du paiement' },
      { status: 500 }
    );
  }
}
