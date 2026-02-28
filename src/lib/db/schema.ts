import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  orderingAs: text('ordering_as').notNull(), // Youth | Leader | Parent
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  designId: text('design_id').notNull(),
  designName: text('design_name').notNull(),
  size: text('size').notNull(),
  amountPaidCents: integer('amount_paid_cents').notNull(),
  stripeSessionId: text('stripe_session_id'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  paymentStatus: text('payment_status').notNull().default('pending'), // pending | paid | refunded
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
