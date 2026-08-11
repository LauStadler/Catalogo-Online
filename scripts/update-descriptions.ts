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

// Simple CSV parser helper that respects quotes and supports semicolon separator
function parseCSV(content: string) {
  const lines = content.split(/\r?\n/);
  if (lines.length <= 1) return [];

  // Parse header
  const headers = lines[0].split(/[;]/).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  
  const items: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ';' && !inQuotes) {
        cols.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    cols.push(current.trim().replace(/^["']|["']$/g, ''));

    items.push({
      name: cols[0] || '',
      category: cols[1] || '',
      presentation: cols[2] || '',
      description: cols[3] || '',
    });
  }

  return items;
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

  const csvPath = path.resolve(process.cwd(), 'Lista productos resumida completa.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Error: No se encontró el archivo "${csvPath}"`);
    process.exit(1);
  }

  console.log('📖 Leyendo datos desde Lista productos resumida completa.csv...');
  const csvContent = fs.readFileSync(csvPath, 'latin1');
  const csvItems = parseCSV(csvContent);

  console.log(`📦 Se encontraron ${csvItems.length} productos en el archivo CSV.`);

  // Load all products from DB for lookup
  const dbProducts = await db.select().from(schema.products);
  const dbProductsMap = new Map<string, any>();
  for (const p of dbProducts) {
    const key = p.name.trim().toLowerCase();
    dbProductsMap.set(key, p);
  }

  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  for (const item of csvItems) {
    const cleanName = item.name.trim();
    if (!cleanName) continue;

    const lookupKey = cleanName.toLowerCase();
    const dbProduct = dbProductsMap.get(lookupKey);

    if (!dbProduct) {
      console.log(`⚠️ Producto no encontrado en la base de datos: "${cleanName}"`);
      notFoundCount++;
      continue;
    }

    const newDescription = item.description ? item.description.trim() : '';

    // If description is empty or hasn't changed, skip
    if (!newDescription) {
      skippedCount++;
      continue;
    }

    if (dbProduct.description === newDescription) {
      console.log(`ℹ️ La descripción del producto "${dbProduct.name}" ya está actualizada.`);
      skippedCount++;
      continue;
    }

    console.log(`📝 Actualizando descripción para "${dbProduct.name}":`);
    console.log(`   De: "${dbProduct.description}"`);
    console.log(`   A:  "${newDescription}"`);

    await db
      .update(schema.products)
      .set({ description: newDescription })
      .where(eq(schema.products.id, dbProduct.id));

    updatedCount++;
  }

  console.log(`\n========================================`);
  console.log(`🏁 Proceso de actualización finalizado.`);
  console.log(`- Total productos actualizados con descripción: ${updatedCount}`);
  console.log(`- Productos omitidos (sin descripción o sin cambios): ${skippedCount}`);
  console.log(`- Productos no encontrados en BD: ${notFoundCount}`);
  
  await client.end();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error fatal durante la actualización:', err);
  process.exit(1);
});
