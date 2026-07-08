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

interface ImportItem {
  name: string;
  description?: string;
  category?: string;
  presentations?: string | string[];
}

// Parse Excel exported CSV files (supports both comma and semicolon, and English/Spanish headers)
function parseCSV(content: string): ImportItem[] {
  const lines = content.split(/\r?\n/);
  if (lines.length <= 1) return [];

  // Parse header
  const headers = lines[0].split(/[;,]/).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  
  // Map headers to column indices (supports both English and Spanish terms)
  const nameIdx = headers.indexOf('name') !== -1 ? headers.indexOf('name') : headers.indexOf('nombre');
  const descIdx = headers.indexOf('description') !== -1 ? headers.indexOf('description') : headers.indexOf('descripcion');
  const catIdx = headers.indexOf('category') !== -1 ? headers.indexOf('category') : headers.indexOf('categoria');
  const presIdx = headers.indexOf('presentations') !== -1 ? headers.indexOf('presentations') : headers.indexOf('presentaciones');

  if (nameIdx === -1) {
    throw new Error(
      'El CSV debe contener al menos la columna "name" (o "nombre").'
    );
  }

  const items: ImportItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser helper that respects quotes
    const cols: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if ((char === ',' || char === ';') && !inQuotes) {
        cols.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    cols.push(current.trim().replace(/^["']|["']$/g, ''));

    if (cols.length <= nameIdx) continue;

    items.push({
      name: cols[nameIdx] || '',
      description: descIdx !== -1 ? cols[descIdx] : '',
      category: catIdx !== -1 ? cols[catIdx] : 'General',
      presentations: presIdx !== -1 ? cols[presIdx] : '',
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

  const jsonPath = path.resolve(process.cwd(), 'import-data.json');
  const csvPath = path.resolve(process.cwd(), 'import-data.csv');
  let productsToImport: ImportItem[] = [];

  if (fs.existsSync(jsonPath)) {
    console.log('📖 Leyendo datos desde import-data.json...');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    try {
      productsToImport = JSON.parse(rawData);
    } catch {
      console.error('❌ Error: El archivo import-data.json no tiene un formato JSON válido.');
      process.exit(1);
    }
  } else if (fs.existsSync(csvPath)) {
    console.log('📖 Leyendo datos desde import-data.csv (Excel)...');
    const rawData = fs.readFileSync(csvPath, 'utf8');
    try {
      productsToImport = parseCSV(rawData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error al parsear el archivo CSV:', message);
      process.exit(1);
    }
  } else {
    console.error('❌ Error: No se encontró import-data.json ni import-data.csv en la raíz del proyecto.');
    console.log('👉 Si usas Excel, guarda tu listado como "import-data.csv" (delimitado por comas o punto y coma) en la raíz.');
    process.exit(1);
  }

  console.log(`📦 Se encontraron ${productsToImport.length} productos para importar.`);

  // Cache to store category mappings (Name -> ID)
  const categoryCache: Record<string, string> = {};

  for (let i = 0; i < productsToImport.length; i++) {
    const item = productsToImport[i];
    console.log(`\n========================================`);
    console.log(`[${i + 1}/${productsToImport.length}] Procesando: "${item.name}"`);

    try {
      // 1. Manage Category
      const catName = (item.category || 'General').trim();
      let categoryId = categoryCache[catName];

      if (!categoryId) {
        // Check if category already exists in database
        const catSlug = slugify(catName);
        const existingCat = await db
          .select()
          .from(schema.categories)
          .where(eq(schema.categories.slug, catSlug))
          .limit(1);

        if (existingCat.length > 0) {
          categoryId = existingCat[0].id;
          categoryCache[catName] = categoryId;
          console.log(`📁 Categoría existente encontrada: "${catName}" (ID: ${categoryId})`);
        } else {
          // Create new category
          const newCat = await db
            .insert(schema.categories)
            .values({
              name: catName,
              slug: catSlug,
              description: `Categoría para ${catName}`,
            })
            .returning();
          
          categoryId = newCat[0].id;
          categoryCache[catName] = categoryId;
          console.log(`📁 Nueva categoría creada: "${catName}" (ID: ${categoryId})`);
        }
      }

      // 2. Create Product
      const prodSlug = `${slugify(item.name)}-${Math.random().toString(36).substring(2, 7)}`;
      console.log(`📝 Insertando producto en la base de datos...`);

      let presentationsArray: string[] | null = null;
      if (item.presentations) {
        if (Array.isArray(item.presentations)) {
          presentationsArray = item.presentations.map(p => p.trim()).filter(Boolean);
        } else if (typeof item.presentations === 'string') {
          presentationsArray = item.presentations.split(',').map(p => p.trim()).filter(Boolean);
        }
      }
      
      await db.insert(schema.products).values({
        name: item.name,
        slug: prodSlug,
        description: item.description || '',
        presentations: presentationsArray,
        categoryId: categoryId,
        active: true,
      });

      console.log(`🎉 ¡Producto "${item.name}" importado con éxito!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      console.error(`❌ Error al importar "${item.name}":`, message);
    }
  }

  console.log(`\n========================================`);
  console.log('🏁 Proceso de importación finalizado.');
  await client.end();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error fatal durante la importación:', err);
  process.exit(1);
});
