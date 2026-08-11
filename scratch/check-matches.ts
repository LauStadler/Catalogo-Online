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

// Simple CSV parser helper that respects quotes and supports semicolon separator
function parseCSV(content: string) {
  const lines = content.split(/\r?\n/);
  if (lines.length <= 1) return [];

  // Parse header: PRODUCTO;CLASIFICACIÓN;PRESENTACIÓN;DESCRIPCIÓN P/WEB
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
    console.error('No DATABASE_URL found');
    process.exit(1);
  }
  const client = postgres(dbUrl, { prepare: false });
  const db = drizzle(client, { schema });
  
  const dbProducts = await db.select().from(schema.products);
  const dbProductsMap = new Map<string, any>();
  for (const p of dbProducts) {
    const key = p.name.trim().toLowerCase();
    dbProductsMap.set(key, p);
  }

  const csvPath = path.resolve(process.cwd(), 'Lista productos resumida completa.csv');
  const csvContent = fs.readFileSync(csvPath, 'latin1');
  const csvItems = parseCSV(csvContent);

  console.log(`CSV Items count: ${csvItems.length}`);
  console.log(`DB Products count: ${dbProducts.length}`);

  let matched = 0;
  let unmatched = 0;
  const unmatchedList: string[] = [];
  let descriptionUpdated = 0;

  for (const item of csvItems) {
    const cleanName = item.name.trim().toLowerCase();
    if (!cleanName) continue;
    const dbProd = dbProductsMap.get(cleanName);
    if (dbProd) {
      matched++;
      if (item.description) {
        descriptionUpdated++;
      }
    } else {
      unmatched++;
      unmatchedList.push(item.name);
    }
  }

  console.log(`Matched: ${matched}`);
  console.log(`Unmatched: ${unmatched}`);
  console.log(`Items with description in CSV: ${csvItems.filter(item => item.description.trim()).length}`);
  console.log(`Matched items with description in CSV: ${descriptionUpdated}`);
  
  if (unmatchedList.length > 0) {
    console.log('\nFirst 10 unmatched items:');
    unmatchedList.slice(0, 10).forEach(name => console.log(`- "${name}"`));
  }

  await client.end();
}

run().catch(console.error);
