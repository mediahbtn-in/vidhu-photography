import { site } from '../config/site.js';

export function initHeader() {
  const header = document.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  document.querySelectorAll('[data-status]').forEach((el) => (el.hidden = !site.acceptingBookings));

  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  const label = toggle.querySelector('.menu-toggle__label');
  let open = false;

  function setOpen(next) {
    if (next === open) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close' : 'Menu';
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      menu.querySelector('a')?.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      const done = () => { if (!open) menu.hidden = true; };
      menu.addEventListener('transitionend', done, { once: true });
      setTimeout(done, 450); // fallback when transitions are disabled
    }
  }

  toggle.addEventListener('click', () => setOpen(!open));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); toggle.focus(); }
    if (e.key === 'Tab') {
      // keep focus within the toggle + overlay while the menu is open
      const items = [toggle, ...menu.querySelectorAll('a, button')];
      const i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items.at(-1).focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && setOpen(false));
}
