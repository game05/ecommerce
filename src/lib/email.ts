import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    postcode: string;
  };
}

export async function sendOrderConfirmationEmail({
  orderNumber,
  customerName,
  customerEmail,
  items,
  total,
  shippingAddress
}: OrderConfirmationEmailProps) {
  try {
    // Si Resend n'est pas configuré, on log juste l'email
    if (!resend) {
      console.log('Email qui aurait été envoyé:', {
        to: customerEmail,
        subject: `Confirmation de votre commande #${orderNumber}`,
        orderDetails: { items, total, shippingAddress }
      });
      return { success: true, data: null };
    }

    const response = await resend.emails.send({
      from: 'La Chabroderie <commandes@lachabroderie.fr>',
      to: customerEmail,
      subject: `Confirmation de votre commande #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Confirmation de commande</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .order-details {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 5px;
                margin-bottom: 20px;
              }
              .item {
                border-bottom: 1px solid #eee;
                padding: 10px 0;
              }
              .total {
                font-weight: bold;
                margin-top: 20px;
                text-align: right;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 14px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Merci pour votre commande !</h1>
              <p>Bonjour ${customerName},</p>
              <p>Nous avons bien reçu votre commande #${orderNumber}.</p>
            </div>

            <div class="order-details">
              <h2>Détails de la commande</h2>
              ${items.map(item => `
                <div class="item">
                  <p>
                    ${item.name} x ${item.quantity}<br>
                    <span style="color: #666;">${(item.price * item.quantity).toFixed(2)}€</span>
                  </p>
                </div>
              `).join('')}
              
              <div class="total">
                Total : ${total.toFixed(2)}€
              </div>
            </div>

            <div class="order-details">
              <h2>Adresse de livraison</h2>
              <p>
                ${customerName}<br>
                ${shippingAddress.street}<br>
                ${shippingAddress.postcode} ${shippingAddress.city}
              </p>
            </div>

            <div class="footer">
              <p>
                Si vous avez des questions concernant votre commande,<br>
                n'hésitez pas à nous contacter à contact@lachabroderie.fr
              </p>
              <p>
                La Chabroderie<br>
                Fait avec ❤️ en France
              </p>
            </div>
          </body>
        </html>
      `
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
}
