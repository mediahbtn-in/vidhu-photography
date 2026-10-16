import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { slots } from './src/data/portfolio.js';

/** Preloads the hero photograph (largest above-the-fold image) for a fast first paint. */
function heroPreload() {
  return {
    name: 'hero-preload',
    transformIndexHtml(html) {
      const manifest = JSON.parse(readFileSync(new URL('./src/data/image-manifest.json', import.meta.url), 'utf8'));
      const key = slots.heroMain?.image;
      if (!key || !manifest[key]) return html;
      const { widths } = manifest[key];
      const dir = key.slice(0, key.lastIndexOf('/'));
      const name = key.slice(key.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
      const set = widths.map((w) => `/images/${dir}/_r/${name}-${w}.avif ${w}w`).join(', ');
      const tag = `<link rel="preload" as="image" type="image/avif" imagesrcset="${set}" imagesizes="(min-width: 1024px) 52vw, 92vw" fetchpriority="high" />`;
      return html.replace('<!--%HERO_PRELOAD%-->', tag);
    },
  };
}

export default defineConfig({
  plugins: [heroPreload()],
  build: { target: 'es2020', assetsInlineLimit: 0 },
});
