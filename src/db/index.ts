import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL environment variable is missing.');
}

const connectionString = process.env.DATABASE_URL || '';

// For serverless environments like Vercel, disable prefetch to avoid issues with connection poolers
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
export * from './schema';
