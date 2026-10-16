import { categories, filters } from '../data/categories.js';
import { createImage, imageInfo } from './image.js';
import { reducedMotion } from './motion.js';

const pad = (n) => String(n).padStart(2, '0');

function orientation(item, i) {
  const info = imageInfo(item.image);
  if (info) return info.width >= info.height ? 'L' : 'P';
  return item.orientation || (i % 2 ? 'P' : 'L'); // placeholder hint
}

/** Originals narrower than this are only ever given a narrow column, so they're never blown up soft. */
const SMALL = 800;
const isSmall = (item) => (imageInfo(item.image)?.width ?? Infinity) < SMALL;

/**
 * Art-directed layout on a 12-column grid. Rows are composed from the actual
 * orientations so portraits are never forced into wide crops:
 *   L+P → 7/5 or 8/4 · P+L → 5/7 or 4/8 · L+L → 6/6 · P+P+P → 4/4/4
 * Mobile uses a 2-column grid: landscapes full width, portraits paired.
 * Small originals are composed as narrow (P) slots but keep a landscape crop.
 */
function compose(items) {
  const real = items.map(orientation);
  const o = items.map((it, i) => (isSmall(it) ? 'P' : real[i]));
  const out = items.map(() => ({}));
  let i = 0, variant = 0;
  while (i < items.length) {
    const a = o[i], b = o[i + 1], c = o[i + 2];
    const alt = variant++ % 2;
    if (b === undefined) {
      out[i] = a === 'L' ? { span: 8, ratio: '3 / 2', start: 3 } : { span: 6, ratio: '4 / 5', start: 4 };
      i += 1;
    } else if (a === 'P' && b === 'P' && c === 'P') {
      [0, 1, 2].forEach((k) => (out[i + k] = { span: 4, ratio: '4 / 5', lift: k === 1 }));
      i += 3;
    } else if (a === 'L' && b === 'L') {
      out[i] = { span: 6, ratio: '4 / 3' }; out[i + 1] = { span: 6, ratio: '4 / 3', lift: true };
      i += 2;
    } else if (a === 'P' && b === 'P') {
      out[i] = { span: 5, ratio: '4 / 5' }; out[i + 1] = { span: 5, ratio: '3 / 4', start: 8, lift: true };
      i += 2;
    } else {
      const wide = alt ? 8 : 7;
      const L = { span: wide, ratio: alt ? '16 / 10' : '3 / 2' };
      const P = { span: 12 - wide, ratio: alt ? '3 / 4' : '4 / 5', lift: true };
      if (a === 'L') { out[i] = L; out[i + 1] = P; } else { out[i] = P; out[i + 1] = L; }
      i += 2;
    }
  }
  items.forEach((it, j) => {
    if (isSmall(it) && real[j] === 'L') out[j].ratio = '4 / 3';
  });
  // mobile pass
  for (let j = 0; j < items.length; j++) {
    if (o[j] === 'P' && o[j + 1] === 'P') { out[j].m = 1; out[j + 1].m = 1; j++; }
    else out[j].m = 2;
  }
  return out;
}

export function initGallery(portfolio, { onOpen }) {
  const list = document.querySelector('[data-gallery]');
  const bar = document.querySelector('[data-filters]');
  const status = document.querySelector('[data-filter-status]');
  const items = [...portfolio].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  let current = 'all';
  let visible = [];

  const available = filters.filter((f) => f.id === 'all' || items.some((it) => categories[it.category]?.filter === f.id));
  bar.innerHTML = available
    .map((f) => `<button type="button" class="filter" data-filter="${f.id}" aria-pressed="${f.id === current}">${f.label}<sup>${f.id === 'all' ? items.filter((it) => it.featured !== false).length : items.filter((it) => categories[it.category]?.filter === f.id).length}</sup></button>`)
    .join('');

  function render() {
    visible = current === 'all' ? items.filter((it) => it.featured !== false) : items.filter((it) => categories[it.category]?.filter === current);
    const layout = compose(visible);
    list.replaceChildren(
      ...visible.map((item, i) => {
        const cat = categories[item.category];
        const L = layout[i];
        const li = document.createElement('li');
        li.className = 'gallery__item';
        li.style.cssText = `--span:${L.span};--ratio:${L.ratio};--m:${L.m};--i:${i}${L.start ? `;--start:${L.start}` : ''}`;
        li.dataset.m = L.m;
        li.dataset.shape = orientation(item, i);
        if (L.lift) li.classList.add('is-lift');
        if (L.start) li.classList.add('has-start');
        li.innerHTML = `
          <button type="button" class="tile" data-cursor="View" aria-label="Open ${item.title} — photograph ${i + 1} of ${visible.length}">
            <span class="tile__media"></span>
            <span class="tile__hover" aria-hidden="true"><span>${cat.label}</span><span class="tile__arrow">↗</span></span>
          </button>
          <p class="tile__caption"><span>${pad(i + 1)}</span> / ${(item.caption || cat.caption).toUpperCase()}</p>`;
        li.querySelector('.tile__media').append(createImage(item, { sizes: `(min-width: 1024px) ${Math.round((L.span / 12) * 88)}vw, (min-width: 700px) ${Math.round((L.span / 12) * 94)}vw, ${L.m === 1 ? 46 : 92}vw` }));
        li.querySelector('.tile').addEventListener('click', () => onOpen(visible, i));
        return li;
      }),
    );
    status.textContent = `Showing ${visible.length} photograph${visible.length === 1 ? '' : 's'}: ${available.find((f) => f.id === current).label}`;
  }

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn || btn.dataset.filter === current) return;
    current = btn.dataset.filter;
    bar.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    if (reducedMotion()) return render();
    // keep height stable during the swap to avoid layout jumps
    list.style.minHeight = `${list.offsetHeight}px`;
    list.classList.add('is-leaving');
    setTimeout(() => {
      render();
      list.classList.remove('is-leaving');
      list.classList.add('is-entering');
      requestAnimationFrame(() => requestAnimationFrame(() => list.classList.remove('is-entering')));
      setTimeout(() => (list.style.minHeight = ''), 500);
    }, 200);
  });

  render();
}
