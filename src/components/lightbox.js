import { categories } from '../data/categories.js';
import { createImage, imageInfo } from './image.js';

const pad = (n) => String(n).padStart(2, '0');

export function initLightbox() {
  const dialog = document.querySelector('[data-lightbox]');
  const stage = dialog.querySelector('[data-lb-stage]');
  const count = dialog.querySelector('[data-lb-count]');
  const title = dialog.querySelector('[data-lb-title]');
  const cat = dialog.querySelector('[data-lb-cat]');
  let items = [];
  let index = 0;
  let opener = null;

  function show(i, dir = 0) {
    index = (i + items.length) % items.length;
    const item = items[index];
    const pic = createImage({ ...item, focus: null }, { sizes: '100vw', eager: true, className: 'lightbox__img' });
    pic.classList.add('lightbox__pic');
    // never blow a small original up more than 1.25× — it would turn soft
    const info = imageInfo(item.image);
    const img = pic.querySelector('img');
    if (info && img) img.style.maxWidth = `min(100%, ${Math.round(info.width * 1.25)}px)`;
    if (dir) pic.style.setProperty('--from', `${dir * 24}px`);
    stage.replaceChildren(pic);
    count.textContent = `${pad(index + 1)} / ${pad(items.length)}`;
    title.textContent = item.title;
    cat.textContent = categories[item.category]?.label || '';
    // warm the next image
    const next = items[(index + 1) % items.length];
    if (next) createImage(next, { sizes: '100vw', eager: true });
  }

  function open(list, i) {
    items = list;
    opener = document.activeElement;
    show(i);
    dialog.showModal();
    document.documentElement.classList.add('lightbox-open');
  }

  function close() {
    dialog.close();
  }
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
    opener?.focus?.({ preventScroll: true });
  });

  dialog.querySelector('[data-lb-close]').addEventListener('click', close);
  dialog.querySelector('[data-lb-prev]').addEventListener('click', () => show(index - 1, -1));
  dialog.querySelector('[data-lb-next]').addEventListener('click', () => show(index + 1, 1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1, 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1, -1); }
  });
  // click on the dark backdrop around the photo closes
  stage.addEventListener('click', (e) => { if (e.target === stage || e.target.classList.contains('lightbox__pic')) close(); });

  // swipe on touch screens
  let sx = 0, sy = 0, tracking = false;
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    tracking = true; sx = e.clientX; sy = e.clientY;
  });
  stage.addEventListener('pointerup', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) close(); // swipe down to dismiss
  });
  stage.addEventListener('pointercancel', () => (tracking = false));

  return { open };
}
