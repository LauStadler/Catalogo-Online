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
  
  const allProducts = await db.select().from(schema.products);
  console.log(`Total products in database: ${allProducts.length}`);
  if (allProducts.length > 0) {
    console.log('First 5 products:');
    for (let i = 0; i < Math.min(5, allProducts.length); i++) {
      console.log(`- ID: ${allProducts[i].id}\n  Name: "${allProducts[i].name}"\n  Desc: "${allProducts[i].description}"\n  Pres: ${JSON.stringify(allProducts[i].presentations)}`);
    }
  }
  await client.end();
}

run().catch(console.error);
