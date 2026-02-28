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
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const all = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return new Response(JSON.stringify(all), {
    headers: { 'Content-Type': 'application/json' },
  });
};
