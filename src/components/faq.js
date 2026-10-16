export function initFaq(faq) {
  const root = document.querySelector('[data-faq]');
  root.innerHTML = faq
    .map(
      (item, i) => `
    <div class="acc"${item.review && import.meta.env.DEV ? ' data-review' : ''}>
      <h3 class="acc__head">
        <button type="button" class="acc__btn" aria-expanded="false" aria-controls="faq-${i}" id="faq-q-${i}">
          <span class="acc__num">${String(i + 1).padStart(2, '0')}</span>
          <span class="acc__q">${item.q}</span>
          <span class="acc__icon" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="acc__panel" id="faq-${i}" role="region" aria-labelledby="faq-q-${i}">
        <div class="acc__inner"><p>${item.a}</p></div>
      </div>
    </div>`,
    )
    .join('');

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.acc__btn');
    if (!btn) return;
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    btn.closest('.acc').classList.toggle('is-open', open);
  });

  // Up/Down/Home/End move between questions
  root.addEventListener('keydown', (e) => {
    const btns = [...root.querySelectorAll('.acc__btn')];
    const i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    const map = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: btns.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    btns[(map[e.key] + btns.length) % btns.length].focus();
  });
}
