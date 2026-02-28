import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = import.meta.env.DATABASE_URL;
if (!connectionString) {
  console.warn(
    'DATABASE_URL not set. Database operations will fail. Set DATABASE_URL for Supabase/Postgres connection.'
  );
}

const client = postgres(connectionString || 'postgres://localhost:5432/placeholder');
export const db = drizzle(client, { schema });
export * from './schema';
