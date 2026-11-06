import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://placeholder-url';

const client = postgres(databaseUrl, {
  prepare: false,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  connect_timeout: 30,
});
export const db = drizzle({ client, schema });
export * from '@/db/schema';
