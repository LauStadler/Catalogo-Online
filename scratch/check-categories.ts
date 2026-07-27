import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';
import * as fs from 'fs';
import * as path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
let databaseUrl = '';

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DATABASE_URL=')) {
    // Get value and strip optional quotes
    let val = trimmed.substring('DATABASE_URL='.length);
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    databaseUrl = val;
    break;
  }
}

if (!databaseUrl) {
  console.error("DATABASE_URL is not defined in .env.local");
  process.exit(1);
}

const client = postgres(databaseUrl, { prepare: false });
const db = drizzle(client, { schema });

async function run() {
  try {
    const list = await db.select().from(schema.categories);
    console.log("--- DATABASE CATEGORIES ---");
    console.log(JSON.stringify(list, null, 2));
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    await client.end();
  }
}

run();
