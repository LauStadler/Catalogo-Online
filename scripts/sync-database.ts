import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

// Helper to load env variables from .env.local or .env file
function loadEnv() {
  let envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    envPath = path.resolve(process.cwd(), '.env');
  }
  if (!fs.existsSync(envPath)) {
    console.log('ℹ️ Archivo .env.local o .env no encontrado. Se usarán las variables del sistema.');
    return;
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
  console.log(`✅ Variables de entorno cargadas desde ${path.basename(envPath)}`);
}

// Simple slugify helper
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

interface JsonItem {
  name: string;
  category: string;
  presentations: string[];
  description: string;
}

async function run() {
  loadEnv();

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ Error: DATABASE_URL no está configurada en .env.local');
    process.exit(1);
  }

  // Connect to Database
  const client = postgres(dbUrl, { prepare: false });
  const db = drizzle(client, { schema });

  const jsonPath = path.resolve(process.cwd(), 'import-data.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Error: No se encontró el archivo "${jsonPath}". Corre primero scripts/excel_to_json.py.`);
    process.exit(1);
  }

  const rawJson = fs.readFileSync(jsonPath, 'utf8');
  const items: JsonItem[] = JSON.parse(rawJson);
  console.log(`📦 Se cargaron ${items.length} productos del archivo JSON.`);

  // Load existing categories and products from DB for lookup/caching
  const dbCategories = await db.select().from(schema.categories);
  const categoryCache = new Map<string, string>(); // Slug -> ID
  for (const cat of dbCategories) {
    categoryCache.set(cat.slug, cat.id);
  }

  const dbProducts = await db.select().from(schema.products);
  const productCache = new Map<string, any>(); // Clean Name -> Product
  for (const prod of dbProducts) {
    productCache.set(prod.name.trim().toUpperCase(), prod);
  }

  let createdCategoriesCount = 0;
  let createdProductsCount = 0;
  let updatedProductsCount = 0;

  for (const item of items) {
    const rawProdName = item.name.trim();
    if (!rawProdName) continue;

    // Standardize product name to uppercase
    const prodName = rawProdName.toUpperCase();

    // 1. Resolve Category
    const rawCatName = item.category.trim();
    const catName = rawCatName || 'General';
    const catSlug = slugify(catName);

    let categoryId = categoryCache.get(catSlug);
    if (!categoryId) {
      // Create new category in DB
      console.log(`📁 Creando nueva categoría: "${catName}" (slug: ${catSlug})...`);
      const newCat = await db
        .insert(schema.categories)
        .values({
          name: catName,
          slug: catSlug,
          description: `Categoría para ${catName}`,
        })
        .returning();
      
      categoryId = newCat[0].id;
      categoryCache.set(catSlug, categoryId);
      createdCategoriesCount++;
    }

    // 2. Resolve Product
    const dbProduct = productCache.get(prodName);
    const presentationsArray = item.presentations && item.presentations.length > 0 ? item.presentations : null;
    const itemDescription = item.description ? item.description.trim() : '';

    if (dbProduct) {
      // Product exists, check if any field has changed and needs update
      let needsUpdate = false;
      const updates: any = {};

      if (dbProduct.categoryId !== categoryId) {
        updates.categoryId = categoryId;
        needsUpdate = true;
        console.log(`   - Categoría cambió para "${prodName}"`);
      }

      if (dbProduct.description !== itemDescription) {
        updates.description = itemDescription;
        needsUpdate = true;
        console.log(`   - Descripción cambió para "${prodName}"`);
      }

      // Deep compare presentations arrays
      const currentPresStr = JSON.stringify(dbProduct.presentations || []);
      const newPresStr = JSON.stringify(presentationsArray || []);
      if (currentPresStr !== newPresStr) {
        updates.presentations = presentationsArray;
        needsUpdate = true;
        console.log(`   - Presentaciones cambiaron para "${prodName}"`);
      }

      if (needsUpdate) {
        console.log(`📝 Actualizando producto "${prodName}"...`);
        await db
          .update(schema.products)
          .set(updates)
          .where(eq(schema.products.id, dbProduct.id));
        updatedProductsCount++;
      }
    } else {
      // Product does NOT exist, insert it!
      const prodSlug = `${slugify(prodName)}-${Math.random().toString(36).substring(2, 7)}`;
      console.log(`✨ Insertando nuevo producto: "${prodName}" (slug: ${prodSlug}) en categoría ID ${categoryId}...`);
      
      await db.insert(schema.products).values({
        name: prodName,
        slug: prodSlug,
        description: itemDescription,
        presentations: presentationsArray,
        categoryId: categoryId,
        active: true,
      });

      createdProductsCount++;
    }
  }

  console.log(`\n========================================`);
  console.log('🏁 Proceso de sincronización finalizado.');
  console.log(`- Nuevas categorías creadas: ${createdCategoriesCount}`);
  console.log(`- Nuevos productos insertados: ${createdProductsCount}`);
  console.log(`- Productos existentes actualizados: ${updatedProductsCount}`);

  await client.end();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error fatal durante la sincronización:', err);
  process.exit(1);
});
