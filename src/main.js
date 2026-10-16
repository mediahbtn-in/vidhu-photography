import './styles/main.css';
import { portfolio, slots } from './data/portfolio.js';
import { services } from './data/services.js';
import { faq } from './data/faq.js';
import { hydrateSlots, imageInfo } from './components/image.js';
import { initHeader } from './components/header.js';
import { initIntro, initReveals, initParallax } from './components/motion.js';
import { initGallery } from './components/gallery.js';
import { initLightbox } from './components/lightbox.js';
import { initContactSheet } from './components/contact-sheet.js';
import { initServices } from './components/services.js';
import { initFaq } from './components/faq.js';
import { initForm } from './components/form.js';
import { initContact } from './components/contact.js';
import { initCursor } from './components/cursor.js';

hydrateSlots(slots);

// About: caption honestly reflects whether the photo is Vidhu or a portfolio image
const aboutCaption = document.querySelector('[data-about-caption]');
if (slots.about.caption) aboutCaption.textContent = slots.about.caption;
const aboutInfo = imageInfo(slots.about.image);
if (slots.about.arch === false) {
  const frame = document.querySelector('.about__portrait');
  frame.classList.add('about__portrait--rect');
  if (aboutInfo) frame.style.aspectRatio = `${aboutInfo.width} / ${aboutInfo.height}`;
}
if (slots.aboutSecondary.image && imageInfo(slots.aboutSecondary.image)) {
  document.querySelector('[data-about-secondary]').hidden = false;
}

initIntro();
initHeader();
const lightbox = initLightbox();
initGallery(portfolio, { onOpen: lightbox.open });
initContactSheet(portfolio, { onOpen: lightbox.open });
initServices(services);
initFaq(faq);
initContact();
initForm();
initReveals();
initParallax();
initCursor();

if (import.meta.env.DEV) {
  const missing = [...new Set([...portfolio, ...Object.values(slots), ...services].map((i) => i.image).filter((p) => p && !imageInfo(p)))];
  if (missing.length) console.info(`[assets] ${missing.length} photograph(s) still pending:\n  ${missing.join('\n  ')}\nSee README → Assets.`);
}
