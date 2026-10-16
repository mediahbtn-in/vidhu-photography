import { reducedMotion } from './motion.js';

/**
 * A small circular label that follows the pointer over [data-cursor] elements.
 * Desktop with a fine pointer only; the native cursor is never hidden, and the
 * label ignores pointer events so it can't block clicks, selection or scrolling.
 */
export function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const el = document.querySelector('[data-cursor-el]');
  const text = el.querySelector('span');
  let x = 0, y = 0, cx = 0, cy = 0, raf = 0, active = null;

  function loop() {
    const k = reducedMotion() ? 1 : 0.22;
    cx += (x - cx) * k;
    cy += (y - cy) * k;
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
  }

  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    const target = e.target.closest?.('[data-cursor]');
    if (target !== active) {
      active = target;
      if (target) {
        if (!el.classList.contains('is-visible')) { cx = x; cy = y; }
        text.textContent = target.dataset.cursor || 'View';
      }
      el.classList.toggle('is-visible', !!target);
    }
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { active = null; el.classList.remove('is-visible'); });
}
