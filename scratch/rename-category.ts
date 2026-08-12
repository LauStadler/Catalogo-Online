import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

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

  // Find category by slug 'vasana'
  const oldSlug = 'vasana';
  const newName = 'Esencias Vasana';
  const newSlug = 'esencias-vasana';

  console.log(`🔍 Searching for category with slug: "${oldSlug}"...`);
  const cats = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, oldSlug));

  if (cats.length === 0) {
    console.log(`❌ Category with slug "${oldSlug}" not found. Let's search by name...`);
    const catsByName = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.name, 'VASANA'));
      
    if (catsByName.length === 0) {
      console.log('❌ Category "VASANA" not found by name either.');
      await client.end();
      process.exit(0);
    }
    cats.push(...catsByName);
  }

  for (const cat of cats) {
    console.log(`📌 Found category: "${cat.name}" (ID: ${cat.id}, Slug: ${cat.slug})`);
    
    // Update name and slug
    await db
      .update(schema.categories)
      .set({ name: newName, slug: newSlug })
      .where(eq(schema.categories.id, cat.id));
      
    console.log(`✅ Category updated: name = "${newName}", slug = "${newSlug}"`);
  }

  await client.end();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error running script:', err);
  process.exit(1);
});
