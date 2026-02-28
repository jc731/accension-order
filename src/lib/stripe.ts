import Stripe from 'stripe';

export const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
  typescript: true,
});

export function getStripePublishableKey(): string {
  return import.meta.env.STRIPE_PUBLISHABLE_KEY || '';
}
