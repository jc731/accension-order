import type { APIRoute } from 'astro';
import { stripe } from '../../lib/stripe';
import { db, orders } from '../../lib/db';
import { getPriceForSize } from '../../lib/pricing';
import designsData from '../../data/designs.json';
import { nanoid } from 'nanoid';

const ORDERING_AS = ['Youth', 'Leader', 'Parent'] as const;
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const;

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.STRIPE_SECRET_KEY) {
    return new Response(
      JSON.stringify({ error: 'Stripe not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const fullName = String(body.fullName ?? '').trim();
  const orderingAs = String(body.orderingAs ?? '');
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const designId = String(body.designId ?? '');
  const size = String(body.size ?? '');

  // Server-side validation
  const errors: string[] = [];
  if (!fullName || fullName.length < 2) errors.push('Full name is required');
  if (!ORDERING_AS.includes(orderingAs as (typeof ORDERING_AS)[number]))
    errors.push('Invalid ordering role');
  if (!validateEmail(email)) errors.push('Valid email is required');
  if (!phone || phone.length < 7) errors.push('Valid phone number is required');
  if (!designId) errors.push('Please select a shirt design');
  if (!SIZES.includes(size as (typeof SIZES)[number])) errors.push('Please select a size');

  const design = (designsData as { id: string; name: string; priceCents?: number }[]).find(
    (d) => d.id === designId
  );
  if (!design) errors.push('Invalid design selected');

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({ error: errors.join('; ') }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Never trust client price – compute server-side
  const amountCents = getPriceForSize(size as (typeof SIZES)[number]);
  const designName = design!.name;

  const orderId = nanoid(10).toUpperCase();
  const siteUrl = import.meta.env.SITE_URL || new URL(request.url).origin;

  // Create order record with pending status
  try {
    await db.insert(orders).values({
      id: orderId,
      fullName,
      orderingAs,
      email,
      phone,
      designId,
      designName,
      size,
      amountPaidCents: amountCents,
      paymentStatus: 'pending',
    });
  } catch (e) {
    console.error('DB insert failed:', e);
    return new Response(
      JSON.stringify({ error: 'Failed to create order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Ascension 2026 Shirt – ${designName}`,
            description: `Size: ${size}`,
            images: design?.imagePath ? [new URL(design.imagePath, siteUrl).href] : undefined,
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    customer_email: email,
    metadata: {
      orderId,
      designId,
      designName,
      size,
      fullName,
    },
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/?cancelled=1`,
  });

  return new Response(
    JSON.stringify({
      url: session.url,
      orderId,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
