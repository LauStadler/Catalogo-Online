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

  // Cleanup 'vasana' slug (move its products to 'esencias-vasana' and delete it)
  const oldSlug = 'vasana';
  const targetSlug = 'esencias-vasana';

  console.log(`🔍 Finding target category: "${targetSlug}"...`);
  const targetCats = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, targetSlug));

  if (targetCats.length === 0) {
    console.error(`❌ Target category "${targetSlug}" not found in database.`);
    await client.end();
    process.exit(1);
  }
  const targetCat = targetCats[0];
  console.log(`🎯 Target category found: "${targetCat.name}" (ID: ${targetCat.id})`);

  console.log(`🔍 Finding old category: "${oldSlug}"...`);
  const oldCats = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, oldSlug));

  if (oldCats.length === 0) {
    console.log(`ℹ️ Old category "${oldSlug}" not found in DB.`);
  } else {
    const oldCat = oldCats[0];
    console.log(`📌 Old category found: "${oldCat.name}" (ID: ${oldCat.id})`);

    // Move products
    console.log(`🔄 Moving products from "${oldCat.name}" to "${targetCat.name}"...`);
    const moved = await db
      .update(schema.products)
      .set({ categoryId: targetCat.id })
      .where(eq(schema.products.categoryId, oldCat.id))
      .returning();

    console.log(`✅ Moved ${moved.length} products.`);

    // Delete category
    console.log(`🗑️ Deleting category "${oldCat.name}"...`);
    await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, oldCat.id));
  }

  // Also verify and delete 'siliconas-wacker' just in case
  const wackerSlug = 'siliconas-wacker';
  const wackerTargetSlug = 'siliconas-y-antiespumantes-wacker';

  console.log(`🔍 Finding old Wacker category: "${wackerSlug}"...`);
  const wackerOldCats = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, wackerSlug));

  if (wackerOldCats.length > 0) {
    const oldCat = wackerOldCats[0];
    const targetCatsWacker = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, wackerTargetSlug));

    if (targetCatsWacker.length > 0) {
      const targetCatWacker = targetCatsWacker[0];
      console.log(`🔄 Moving products from "${oldCat.name}" to "${targetCatWacker.name}"...`);
      const moved = await db
        .update(schema.products)
        .set({ categoryId: targetCatWacker.id })
        .where(eq(schema.products.categoryId, oldCat.id))
        .returning();
      console.log(`✅ Moved ${moved.length} products.`);
    }

    console.log(`🗑️ Deleting category "${oldCat.name}"...`);
    await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, oldCat.id));
  } else {
    console.log(`ℹ️ Old category "${wackerSlug}" not found in DB.`);
  }

  console.log('🎉 Cleanup completed!');
  await client.end();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error running script:', err);
  process.exit(1);
});
