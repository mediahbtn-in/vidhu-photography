import { categories } from '../data/categories.js';
import { createImage } from './image.js';

/**
 * A film-strip "contact sheet": every portfolio frame in sequence. Native
 * horizontal scrolling everywhere (touch, trackpad, keyboard); a mouse can
 * also drag it. Page scrolling is never captured.
 */
export function initContactSheet(portfolio, { onOpen }) {
  const sheet = document.querySelector('[data-sheet]');
  const strip = document.querySelector('[data-sheet-strip]');
  const items = [...portfolio].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  strip.replaceChildren(
    ...items.map((item, i) => {
      const li = document.createElement('li');
      li.className = 'sheet__frame';
      li.innerHTML = `
        <button type="button" class="sheet__btn" data-cursor="View" aria-label="Open ${item.title}, frame ${i + 1}">
          <span class="sheet__media"></span>
        </button>
        <p class="sheet__meta"><span>${String(i + 1).padStart(3, '0')}</span><span>${categories[item.category]?.label || ''}</span></p>`;
      li.querySelector('.sheet__media').append(createImage(item, { sizes: '(min-width: 700px) 300px, 62vw' }));
      li.querySelector('button').addEventListener('click', (e) => {
        if (sheet.dataset.dragged === 'true') { e.preventDefault(); return; }
        onOpen(items, i);
      });
      return li;
    }),
  );

  // mouse drag-to-scroll
  let down = false, startX = 0, startScroll = 0;
  sheet.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; startX = e.clientX; startScroll = sheet.scrollLeft;
    sheet.dataset.dragged = 'false';
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) { sheet.dataset.dragged = 'true'; sheet.classList.add('is-dragging'); }
    sheet.scrollLeft = startScroll - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    sheet.classList.remove('is-dragging');
    setTimeout(() => (sheet.dataset.dragged = 'false'), 0);
  });
  sheet.addEventListener('dragstart', (e) => e.preventDefault());
}
