import type { APIRoute } from 'astro';
import { db, orders } from '../../../lib/db';
import { desc } from 'drizzle-orm';

export const prerender = false;

function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) return false;
  const adminPassword = import.meta.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const expected = Buffer.from(`admin:${adminPassword}`).toString('base64');
  const provided = authHeader.slice(6);
  return provided === expected;
}

export const GET: APIRoute = async ({ request }) => {
  if (!checkAuth(request)) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin"',
      },
    });
  }

  const all = await db.select().from(orders).orderBy(desc(orders.createdAt));

  const headers = [
    'Order ID',
    'Created',
    'Full Name',
    'Ordering As',
    'Email',
    'Phone',
    'Design ID',
    'Design Name',
    'Size',
    'Amount (cents)',
    'Payment Status',
    'Stripe Session ID',
  ];
  const escape = (v: string | number | null) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const rows = all.map((o) =>
    [
      o.id,
      o.createdAt?.toISOString() ?? '',
      o.fullName,
      o.orderingAs,
      o.email,
      o.phone,
      o.designId,
      o.designName,
      o.size,
      o.amountPaidCents,
      o.paymentStatus,
      o.stripeSessionId ?? '',
    ].map(escape)
  );
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ascension-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
};
