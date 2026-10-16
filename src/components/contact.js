import { site, whatsappUrl } from '../config/site.js';

const ICON = {
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8.8 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.3.6 1.4 1.9 2.8 2.4.2.1.4 0 .5-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.2.4.4 0 .6-.2 1.3-.9 1.6-.6.3-1.6.5-3.4-.3-1.9-.8-3.3-2.7-3.7-3.3-.5-.6-.9-1.5-.9-2.4 0-.8.4-1.3.7-1.5Z" fill="currentColor"/></svg>',
};

/** Renders only the contact details that have been confirmed in config/site.js. */
export function initContact() {
  const wa = whatsappUrl();
  const { email, phone, location } = site.contact;

  const alt = document.querySelector('[data-contact-alt]');
  const altItems = [];
  if (wa) altItems.push(`<li><a class="btn btn--ghost-light" href="${wa}" target="_blank" rel="noopener">${ICON.whatsapp} Enquire on WhatsApp</a></li>`);
  if (email) altItems.push(`<li><span class="booking__alt-label">Email</span><a href="mailto:${email}">${email}</a></li>`);
  if (phone) altItems.push(`<li><span class="booking__alt-label">Phone</span><a href="tel:${phone.replace(/[^\d+]/g, '')}">${phone}</a></li>`);
  if (location) altItems.push(`<li><span class="booking__alt-label">Based in</span><span>${location}</span></li>`);
  alt.innerHTML = altItems.join('');
  alt.hidden = !altItems.length;

  const fc = document.querySelector('[data-footer-contact]');
  const contactLines = [
    email && `<li><a href="mailto:${email}">${email}</a></li>`,
    phone && `<li><a href="tel:${phone.replace(/[^\d+]/g, '')}">${phone}</a></li>`,
    location && `<li>${location}</li>`,
  ].filter(Boolean);
  fc.innerHTML = contactLines.length
    ? `<p class="footer__label">Contact</p><ul>${contactLines.join('')}</ul>`
    : `<p class="footer__label">Contact</p><ul><li><a href="#contact">Send an enquiry</a></li></ul>`;

  const fs = document.querySelector('[data-footer-social]');
  const social = [
    site.social.instagram && `<li><a href="${site.social.instagram}" target="_blank" rel="noopener">Instagram ↗</a></li>`,
    site.social.facebook && `<li><a href="${site.social.facebook}" target="_blank" rel="noopener">Facebook ↗</a></li>`,
    wa && `<li><a href="${wa}" target="_blank" rel="noopener">WhatsApp ↗</a></li>`,
  ].filter(Boolean);
  fs.innerHTML = social.length ? `<p class="footer__label">Follow</p><ul>${social.join('')}</ul>` : '';
  fs.hidden = !social.length;

  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}
