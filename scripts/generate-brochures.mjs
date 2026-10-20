/**
 * Generates the per-course FGIIT course brochures into `public/images/brochure/`.
 *
 *   node scripts/generate-brochures.mjs          # only creates files that are missing
 *   node scripts/generate-brochures.mjs --force  # regenerates/overwrites existing files
 *
 * Existing files are never overwritten without --force, so an official brochure
 * placed there by hand is safe.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { BROCHURE_FILES } from '../src/data/fgiitData.js';
import { generateCourseBrochurePDF } from '../src/utils/brochureGenerator.js';

const force = process.argv.includes('--force');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '..', 'public', 'images', 'brochure');

fs.mkdirSync(outDir, { recursive: true });

let written = 0;
let skipped = 0;

for (const [courseId, fileName] of Object.entries(BROCHURE_FILES)) {
  const target = path.join(outDir, fileName);

  if (fs.existsSync(target) && !force) {
    skipped += 1;
    console.log(`• ${fileName} — already exists, skipped (use --force to overwrite)`);
    continue;
  }

  const doc = generateCourseBrochurePDF(courseId);
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(target, buffer);
  written += 1;
  console.log(`✓ ${fileName} (${Math.round(buffer.length / 1024)} KB)`);
}

console.log(`\n${written} written, ${skipped} skipped → public/images/brochure/`);
