#!/usr/bin/env node
/**
 * Generates responsive AVIF + WebP variants for every original photograph in
 * public/images/<group>/ and writes src/data/image-manifest.json with each
 * image's intrinsic size (used for width/height attributes → no layout shift).
 *
 *   npm run assets:build
 *
 * Originals are never modified. Variants go to public/images/<group>/_r/ and
 * are never upscaled beyond the original's width. Also produces
 * public/images/og.jpg (1200×630) from the hero photograph (slots.heroMain in
 * src/data/portfolio.js) for social sharing.
 */
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { slots } from '../src/data/portfolio.js';

const ROOT = path.resolve('public/images');
const WIDTHS = [480, 800, 1200, 1600, 2400];
const EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (EXT.test(entry.name) && entry.name !== 'og.jpg') out.push(full);
  }
  return out;
}

async function newer(src, dest) {
  try { return (await stat(dest)).mtimeMs >= (await stat(src)).mtimeMs; } catch { return false; }
}

const manifest = {};
for (const file of await walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const img = sharp(file).rotate(); // respect EXIF orientation
  const meta = await img.metadata();
  const swap = (meta.orientation || 1) >= 5;
  const width = swap ? meta.height : meta.width;
  const height = swap ? meta.width : meta.height;
  const outDir = path.join(path.dirname(file), '_r');
  await mkdir(outDir, { recursive: true });
  const base = path.basename(file, path.extname(file));
  const widths = WIDTHS.filter((w) => w < width).concat(width).filter((w, i, a) => a.indexOf(w) === i);

  for (const w of widths) {
    for (const [fmt, opts] of [['avif', { quality: 62, effort: 5 }], ['webp', { quality: 84 }]]) {
      const dest = path.join(outDir, `${base}-${w}.${fmt}`);
      if (await newer(file, dest)) continue;
      await sharp(file).rotate().resize({ width: w, withoutEnlargement: true })[fmt](opts).toFile(dest);
    }
  }
  manifest[rel] = { width, height, widths };
  console.log(`✓ ${rel}  ${width}×${height}  → ${widths.join(', ')}`);
}

const hero = slots.heroMain?.image;
if (hero && manifest[hero]) {
  await sharp(path.join(ROOT, hero)).rotate().resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 86 }).toFile(path.join(ROOT, 'og.jpg'));
  console.log('✓ og.jpg (social sharing image)');
}

await writeFile(path.resolve('src/data/image-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nManifest: ${Object.keys(manifest).length} image(s).`);
