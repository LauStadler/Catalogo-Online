import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';

function loadEnv() {
  let envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    envPath = path.resolve(process.cwd(), '.env');
  }
  if (!fs.existsSync(envPath)) return;
  const fileContent = fs.readFileSync(envPath, 'utf8');
  fileContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const equalsIdx = trimmed.indexOf('=');
    if (equalsIdx === -1) return;
    const key = trimmed.substring(0, equalsIdx).trim();
    let val = trimmed.substring(equalsIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    process.env[key] = val;
  });
}

async function run() {
  loadEnv();
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('No DATABASE_URL found');
    process.exit(1);
  }
  const client = postgres(dbUrl, { prepare: false });
  const db = drizzle(client, { schema });
  
  const allProds = await db.select().from(schema.products);
  const nameCounts = new Map<string, number>();
  for (const p of allProds) {
    const name = p.name.trim().toUpperCase();
    nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
  }

  console.log('Duplicate products in database:');
  for (const [name, count] of nameCounts.entries()) {
    if (count > 1) {
      console.log(`- "${name}": ${count} times`);
      const matches = allProds.filter(p => p.name.trim().toUpperCase() === name);
      matches.forEach(m => console.log(`  ID: ${m.id}, Slug: ${m.slug}, CategoryId: ${m.categoryId}`));
    }
  }

  await client.end();
}

run().catch(console.error);
