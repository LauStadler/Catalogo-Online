import fs from 'fs';
import path from 'path';

const csvPath = path.resolve(process.cwd(), 'Lista productos resumida completa.csv');
const rawDataLatin1 = fs.readFileSync(csvPath, 'latin1');
const lines = rawDataLatin1.split(/\r?\n/);
for (let i = 0; i < Math.min(10, lines.length); i++) {
  console.log(`Line ${i}:`, lines[i]);
}
