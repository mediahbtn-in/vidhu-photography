import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

/** Preloads the hero photograph (largest above-the-fold image) for a fast first paint. */
function heroPreload() {
  return {
    name: 'hero-preload',
    transformIndexHtml(html) {
      const manifest = JSON.parse(readFileSync(new URL('./src/data/image-manifest.json', import.meta.url), 'utf8'));
      const key = Object.keys(manifest).find((k) => k.startsWith('hero/hero-main'));
      if (!key) return html;
      const { widths } = manifest[key];
      const name = key.slice(key.indexOf('/') + 1).replace(/\.[^.]+$/, '');
      const set = widths.map((w) => `/images/hero/_r/${name}-${w}.avif ${w}w`).join(', ');
      const tag = `<link rel="preload" as="image" type="image/avif" imagesrcset="${set}" imagesizes="(min-width: 1024px) 52vw, 92vw" fetchpriority="high" />`;
      return html.replace('<!--%HERO_PRELOAD%-->', tag);
    },
  };
}

export default defineConfig({
  plugins: [heroPreload()],
  build: { target: 'es2020', assetsInlineLimit: 0 },
});
