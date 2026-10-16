import { site, whatsappUrl } from '../config/site.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const rules = {
  name: (v) => (v.trim().length >= 2 ? '' : 'Please tell me your name.'),
  email: (v) => (!v.trim() ? 'Please add your email address.' : EMAIL_RE.test(v.trim()) ? '' : 'That email address doesn’t look quite right — please check it.'),
  phone: (v) => (!v.trim() ? 'Please add a phone number.' : v.replace(/\D/g, '').length >= 7 ? '' : 'Please enter a valid phone number, including your country code.'),
  type: (v) => (v ? '' : 'Please choose the type of photography.'),
  date: (v) => (!v || v >= today() ? '' : 'Please choose a date in the future.'),
  message: (v) => (v.trim().length >= 10 ? '' : 'Please share a few words about the shoot.'),
};

function today() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function initForm() {
  const form = document.querySelector('[data-form]');
  const submit = form.querySelector('[data-submit]');
  const status = form.querySelector('[data-form-status]');
  form.elements.date.min = today();
  let sending = false;

  function check(field) {
    const rule = rules[field.name];
    if (!rule) return true;
    const msg = rule(field.value);
    const err = form.querySelector(`#${field.id}-err`);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    field.closest('.field').classList.toggle('has-error', !!msg);
    if (err) err.textContent = msg;
    return !msg;
  }

  // validate a field once the visitor leaves it, then live while they fix it
  form.addEventListener('focusout', (e) => { if (e.target.name in rules && e.target.value) check(e.target); });
  form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') check(e.target); });
  form.addEventListener('change', (e) => { if (e.target.tagName === 'SELECT') check(e.target); });

  function setStatus(kind, html) {
    status.className = `form__status is-${kind}`;
    status.innerHTML = html;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    const fields = Object.keys(rules).map((n) => form.elements[n]);
    const invalid = fields.filter((f) => !check(f));
    if (invalid.length) {
      invalid[0].focus();
      setStatus('error', `Please check the ${invalid.length === 1 ? 'highlighted field' : `${invalid.length} highlighted fields`}.`);
      return;
    }
    if (form.elements._gotcha.value) return; // bot

    const fallback = whatsappUrl()
      ? ` You can also <a href="${whatsappUrl()}" target="_blank" rel="noopener">message on WhatsApp</a>.`
      : site.contact.email ? ` You can also email <a href="mailto:${site.contact.email}">${site.contact.email}</a>.` : '';

    if (!site.formEndpoint) {
      // Not connected yet: be honest rather than showing a fake success.
      console.warn('[enquiry form] No endpoint configured. Set VITE_FORM_ENDPOINT or site.formEndpoint (see README).');
      setStatus('error', `Online enquiries aren’t connected yet, so this message couldn’t be sent.${fallback}`);
      return;
    }

    sending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submit.classList.add('is-loading');
    setStatus('pending', 'Sending your enquiry…');

    const data = Object.fromEntries(new FormData(form));
    delete data._gotcha;
    data._subject = `New ${data.type} enquiry from ${data.name}`;

    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      form.querySelectorAll('[aria-invalid]').forEach((f) => f.removeAttribute('aria-invalid'));
      setStatus('success', `<strong>Thank you, ${escapeHtml(data.name.split(' ')[0])}.</strong> Your enquiry has been sent — I’ll be in touch soon to talk about your shoot.`);
      status.focus?.();
    } catch (err) {
      console.error('[enquiry form]', err);
      setStatus('error', `Sorry — something went wrong and your enquiry wasn’t sent. Please try again in a moment.${fallback}`);
    } finally {
      sending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      submit.classList.remove('is-loading');
    }
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
