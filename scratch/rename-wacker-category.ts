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

  const catId = '477cf451-95e4-4808-92e5-193f9839db17';
  const oldName = 'SILICONAS WACKER';
  const newName = 'SILICONAS Y ANTIESPUMANTES WACKER';
  const newSlug = 'siliconas-y-antiespumantes-wacker';

  console.log(`Updating category ID: ${catId}`);
  console.log(`From: "${oldName}"`);
  console.log(`To: "${newName}" (${newSlug})`);

  // Update in DB
  const updateResult = await db
    .update(schema.categories)
    .set({
      name: newName,
      slug: newSlug,
    })
    .where(eq(schema.categories.id, catId))
    .returning();

  console.log('Database updated result:', updateResult);

  // Update in import-data.json
  const jsonPath = path.resolve(process.cwd(), 'import-data.json');
  if (fs.existsSync(jsonPath)) {
    console.log('Updating import-data.json...');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    // Global replace for "SILICONAS WACKER" to "SILICONAS Y ANTIESPUMANTES WACKER"
    // (Also match lowercase or different casings just in case, but using regex with 'g')
    const updatedData = rawData.replace(/"category":\s*"SILICONAS WACKER"/g, `"category": "${newName}"`);
    fs.writeFileSync(jsonPath, updatedData, 'utf8');
    console.log('import-data.json updated successfully!');
  } else {
    console.log('import-data.json not found in root.');
  }

  await client.end();
  process.exit(0);
}

run().catch(console.error);
