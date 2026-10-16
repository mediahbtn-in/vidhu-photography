#!/usr/bin/env node
/**
 * Downloads the original photographs from the existing Framer site.
 *
 *   npm run assets:fetch [-- https://vidhuphotography.framer.website/]
 *
 * - Crawls the home page and same-origin pages linked from it (one level deep).
 * - Collects every framerusercontent.com image reference (img src/srcset, CSS,
 *   preload links, inline JSON) and strips Framer's resize parameters so the
 *   full-resolution original is downloaded, never a screenshot or thumbnail.
 * - Saves files to assets/inbox/ and writes assets/inbox/index.json describing
 *   where each image appeared (page, alt text, nearby heading) to make sorting
 *   them into public/images/<category>/ straightforward.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const START = process.argv[2] || 'https://vidhuphotography.framer.website/';
const OUT = path.resolve('assets/inbox');
const origin = new URL(START).origin;

const IMG_RE = /https:\/\/framerusercontent\.com\/images\/[A-Za-z0-9_-]+\.(?:jpe?g|png|webp|avif|gif)(?:\?[^"'\s)\\,]*)?/gi;

async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (asset-migration)' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res;
}

function contextFor(html, index) {
  const before = html.slice(Math.max(0, index - 1500), index);
  const after = html.slice(index, index + 400);
  const alt = /alt="([^"]*)"/i.exec(after)?.[1] || /alt="([^"]*)"[^>]*$/i.exec(before)?.[1] || '';
  const heading = [...before.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)].pop()?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
  return { alt, nearestHeading: heading };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const pages = new Set([START]);
  const home = await (await get(START)).text();
  for (const m of home.matchAll(/href="([^"#?]+)"/g)) {
    try {
      const u = new URL(m[1], START);
      if (u.origin === origin && !/\.(css|js|xml|ico|png|jpe?g|svg)$/i.test(u.pathname)) pages.add(u.href);
    } catch {}
  }

  const found = new Map(); // original URL -> info
  for (const page of pages) {
    let html;
    try { html = page === START ? home : await (await get(page)).text(); } catch (e) { console.warn('skip', e.message); continue; }
    for (const m of html.matchAll(IMG_RE)) {
      const original = m[0].split('?')[0];
      if (!found.has(original)) found.set(original, { url: original, pages: [], ...contextFor(html, m.index) });
      const entry = found.get(original);
      if (!entry.pages.includes(page)) entry.pages.push(page);
    }
  }

  console.log(`Found ${found.size} unique images across ${pages.size} page(s).`);
  const index = [];
  let n = 0;
  for (const info of found.values()) {
    n += 1;
    const ext = path.extname(new URL(info.url).pathname) || '.jpg';
    const file = `${String(n).padStart(3, '0')}-${path.basename(new URL(info.url).pathname, ext).slice(0, 12)}${ext}`;
    try {
      const buf = Buffer.from(await (await get(info.url)).arrayBuffer());
      await writeFile(path.join(OUT, file), buf);
      index.push({ file, bytes: buf.length, ...info });
      console.log(`  ✓ ${file}  ${(buf.length / 1024).toFixed(0)} KB  ${info.nearestHeading ? `— near “${info.nearestHeading}”` : ''}`);
    } catch (e) {
      index.push({ file: null, error: e.message, ...info });
      console.warn(`  ✗ could not download ${info.url}: ${e.message}`);
    }
  }
  await writeFile(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2));
  console.log(`\nSaved to ${path.relative(process.cwd(), OUT)}/. Next: sort into public/images/<category>/, then run npm run assets:build.`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
