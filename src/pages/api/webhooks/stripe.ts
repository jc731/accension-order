import type { APIRoute } from 'astro';
import { stripe } from '../../../lib/stripe';
import { db, orders } from '../../../lib/db';
import { sendOrderConfirmation, sendAdminNotification } from '../../../lib/email';
import { eq } from 'drizzle-orm';
import { formatPrice } from '../../../lib/pricing';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set');
    return new Response('Webhook secret missing', { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret) as typeof event;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      id: string;
      metadata?: Record<string, string>;
      customer_email?: string;
      payment_status?: string;
    };
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error('No orderId in session metadata');
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      console.error('Order not found:', orderId);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db
      .update(orders)
      .set({
        paymentStatus: 'paid',
        stripeSessionId: session.id,
      })
      .where(eq(orders.id, orderId));

    const amountFormatted = formatPrice(order.amountPaidCents);
    const email = session.customer_email || order.email;

    await sendOrderConfirmation({
      to: email,
      orderId: order.id,
      fullName: order.fullName,
      designName: order.designName,
      size: order.size,
      amountFormatted,
    });

    await sendAdminNotification({
      orderId: order.id,
      fullName: order.fullName,
      email,
      designName: order.designName,
      size: order.size,
      amountFormatted,
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
