import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';
import { eq, ilike } from 'drizzle-orm';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found');
    process.exit(1);
  }
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
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
  }

  const client = postgres(dbUrl, { prepare: false });
  const db = drizzle(client, { schema });

  const targetName = 'TECNI QMO ELE CONCENTRADO';
  console.log(`🔍 Searching for product: "${targetName}"...`);
  
  const productsFound = await db
    .select()
    .from(schema.products)
    .where(ilike(schema.products.name, `%${targetName}%`));

  if (productsFound.length === 0) {
    console.log('❌ Product not found in database.');
    await client.end();
    process.exit(0);
  }

  for (const product of productsFound) {
    console.log(`📌 Found product: "${product.name}" (ID: ${product.id}, Slug: ${product.slug}, Active: ${product.active})`);
    
    // Set active = false
    await db
      .update(schema.products)
      .set({ active: false })
      .where(eq(schema.products.id, product.id));
      
    console.log(`✅ Product "${product.name}" set to inactive (active: false). It will no longer appear in the catalog.`);
  }

  await client.end();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error running script:', err);
  process.exit(1);
});
