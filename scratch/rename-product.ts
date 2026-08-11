import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

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

  const productId = '3873c99a-1420-45ba-aae3-0fd7e08f0f51';
  const newName = 'ESPESANTE PARA SUAVIZANTE (SULFATO DE SODIO)';
  const newSlug = 'espesante-para-suavizante-sulfato-de-sodio-1qkwn';

  console.log(`Updating product ID: ${productId}`);
  console.log(`New Name: "${newName}"`);
  console.log(`New Slug: "${newSlug}"`);

  await db
    .update(schema.products)
    .set({
      name: newName,
      slug: newSlug,
    })
    .where(eq(schema.products.id, productId));

  console.log('Update completed successfully!');

  await client.end();
}

run().catch(console.error);
