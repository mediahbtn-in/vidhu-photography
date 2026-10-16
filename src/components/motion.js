export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Page-load sequence: wordmark → hero image → headline → actions (timed in CSS). */
export function initIntro() {
  const start = () => requestAnimationFrame(() => document.documentElement.classList.add('is-loaded'));
  // Don't hold the page hostage to font loading: start after fonts or 600ms, whichever comes first.
  Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 600))]).then(start);
}

/** Adds .is-in to elements as they enter the viewport. */
export function initReveals(root = document) {
  const targets = root.querySelectorAll('.reveal, .reveal-image, .timeline__step, .feature');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  targets.forEach((el) => io.observe(el));
}

/**
 * Restrained parallax: the photograph drifts a few percent inside its frame.
 * Media inside [data-parallax] is oversized in CSS so edges never show.
 */
export function initParallax() {
  const els = [...document.querySelectorAll('[data-parallax]')];
  if (!els.length) return;
  const fine = window.matchMedia('(min-width: 700px)');
  let ticking = false;
  let visible = new Set();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    schedule();
  });
  els.forEach((el) => io.observe(el));

  function update() {
    ticking = false;
    const off = reducedMotion() || !fine.matches;
    const vh = window.innerHeight;
    visible.forEach((el) => {
      const media = el.querySelector('.frame__media, .feature__media');
      if (!media) return;
      if (off) { media.style.transform = ''; return; }
      const r = el.getBoundingClientRect();
      // -1 when the frame's centre is at the bottom of the viewport, 1 at the top
      const p = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2)));
      const strength = el.dataset.parallax === 'feature' ? 7 : 4; // % of frame height
      media.style.transform = `translate3d(0, ${(p * strength).toFixed(2)}%, 0)`;
    });
  }
  function schedule() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
}
