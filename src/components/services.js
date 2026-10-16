import { createImage, imageInfo } from './image.js';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Editorial service list. Desktop: hovering or focusing a service swaps the
 * photograph in the preview frame. Touch / narrow screens: tapping a service
 * expands it to reveal its photograph and description.
 */
export function initServices(services) {
  const list = document.querySelector('[data-services]');
  const preview = document.querySelector('[data-service-preview]');
  const label = document.querySelector('[data-service-preview-label]');
  const select = document.querySelector('[data-service-select]');
  const wide = window.matchMedia('(min-width: 900px)');

  services.forEach((s) => select.add(new Option(s.name, s.name)));

  const frames = services.map((s, i) => {
    const f = document.createElement('div');
    f.className = 'services__preview-img';
    f.append(createImage(s, { sizes: '34vw' }));
    if (i === 0) f.classList.add('is-active');
    preview.prepend(f);
    return f;
  });
  label.textContent = `${pad(1)} — ${services[0].name}`;

  list.innerHTML = services
    .map(
      (s, i) => `
    <li class="service${i === 0 ? ' is-active' : ''}" data-i="${i}">
      <h3 class="service__head">
        <button type="button" class="service__btn" aria-expanded="false" aria-controls="svc-${s.id}">
          <span class="service__num">${pad(i + 1)}</span>
          <span class="service__name">${s.name}</span>
          <span class="service__arrow" aria-hidden="true">↗</span>
        </button>
      </h3>
      <div class="service__panel" id="svc-${s.id}">
        <div class="service__panel-inner">
          <div class="service__photo frame${imageInfo(s.image) ? '' : ' is-missing'}"></div>
          <p class="service__desc">${s.description}</p>
          <a href="#contact" class="link-arrow service__cta" data-service="${s.name}">Enquire about ${s.name.replace(' Photography', '').toLowerCase()} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </li>`,
    )
    .join('');

  list.querySelectorAll('.service').forEach((li) => {
    const s = services[+li.dataset.i];
    li.querySelector('.service__photo').append(createImage(s, { sizes: '92vw' }));
  });

  function activate(i) {
    list.querySelectorAll('.service').forEach((li) => li.classList.toggle('is-active', +li.dataset.i === i));
    frames.forEach((f, k) => f.classList.toggle('is-active', k === i));
    label.textContent = `${pad(i + 1)} — ${services[i].name}`;
  }

  list.addEventListener('pointerover', (e) => {
    const li = e.target.closest('.service');
    if (li && wide.matches) activate(+li.dataset.i);
  });
  list.addEventListener('focusin', (e) => {
    const li = e.target.closest('.service');
    if (li && wide.matches) activate(+li.dataset.i);
  });
  list.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-service]');
    if (cta) { select.value = cta.dataset.service; return; }
    const btn = e.target.closest('.service__btn');
    if (!btn) return;
    const li = btn.closest('.service');
    if (wide.matches) { activate(+li.dataset.i); return; }
    const open = btn.getAttribute('aria-expanded') !== 'true';
    list.querySelectorAll('.service__btn').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    btn.setAttribute('aria-expanded', String(open));
    if (open) activate(+li.dataset.i);
  });
}
