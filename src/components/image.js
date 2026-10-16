import manifest from '../data/image-manifest.json';

const BASE = '/images/';

export function imageInfo(path) {
  return path ? manifest[path] || null : null;
}

function srcset(path, widths, fmt) {
  const dir = path.slice(0, path.lastIndexOf('/') + 1);
  const name = path.slice(path.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
  return widths.map((w) => `${BASE}${dir}_r/${name}-${w}.${fmt} ${w}w`).join(', ');
}

/**
 * Returns a <picture> for an image in the manifest, or a clearly labelled
 * placeholder frame if the photograph hasn't been added yet. Never substitutes
 * another image.
 */
export function createImage({ image, alt = '', focus }, { sizes = '100vw', eager = false, className = '' } = {}) {
  const info = imageInfo(image);
  if (!info) return createPlaceholder(image, className);

  const picture = document.createElement('picture');
  for (const fmt of ['avif', 'webp']) {
    const source = document.createElement('source');
    source.type = `image/${fmt}`;
    source.srcset = srcset(image, info.widths, fmt);
    source.sizes = sizes;
    picture.append(source);
  }
  const img = document.createElement('img');
  // Fallback for browsers without srcset/<source> support: the largest WebP variant.
  // The untouched original stays in /public/images alongside it.
  img.src = srcset(image, [info.widths.at(-1)], 'webp').split(' ')[0];
  img.alt = alt;
  img.width = info.width;
  img.height = info.height;
  img.decoding = 'async';
  if (eager) img.fetchPriority = 'high';
  else img.loading = 'lazy';
  if (focus) img.style.objectPosition = focus;
  if (className) img.className = className;
  picture.append(img);
  return picture;
}

export function createPlaceholder(image, className = '') {
  const el = document.createElement('div');
  el.className = `placeholder ${className}`.trim();
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', 'Photograph to be added');
  el.innerHTML = `<span class="placeholder__mark" aria-hidden="true">+</span>
    <span class="placeholder__label">Photograph pending</span>
    ${import.meta.env.DEV ? `<span class="placeholder__file">${image ? `/images/${image}` : 'no image set'}</span>` : ''}`;
  return el;
}

/** Fills every [data-slot] element from the named slot in portfolio.js. */
export function hydrateSlots(slots, root = document) {
  root.querySelectorAll('[data-slot]').forEach((el) => {
    const slot = slots[el.dataset.slot];
    if (!slot) return;
    el.replaceChildren(createImage(slot, { sizes: el.dataset.sizes, eager: 'eager' in el.dataset }));
    el.classList.toggle('is-missing', !imageInfo(slot.image));
  });
}
