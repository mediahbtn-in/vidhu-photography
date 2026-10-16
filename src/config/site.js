/**
 * Business details for Vidhu Photography.
 *
 * Every value here must come from the existing website
 * (https://vidhuphotography.framer.website/) or from Vidhu directly.
 * Anything left as `null` is simply not rendered — nothing is invented.
 * See README.md → "Before launch".
 */
export const site = {
  name: 'Vidhu Photography',
  wordmark: 'VIDHU',
  tagline: 'Every moment has a story.',
  url: 'https://vidhuphotography.framer.website/', // TODO: replace with the final production domain

  /**
   * Shows the "Available for bookings" indicator in the header.
   * Leave `false` until Vidhu confirms they are currently accepting bookings.
   */
  acceptingBookings: false,

  contact: {
    email: null, // e.g. 'hello@example.com' — copy from the existing site
    phone: null, // display format, e.g. '+91 98765 43210'
    whatsapp: null, // any format; it is normalised to digits with the country code, e.g. '+91 98765 43210'
    location: null, // service area, only if confirmed, e.g. 'Based in Kochi, Kerala'
  },

  social: {
    instagram: null, // full URL of the verified profile
    facebook: null, // full URL of the verified page
  },

  whatsappMessage:
    "Hi Vidhu, I'm interested in booking a photography session. I'd love to discuss the details.",

  /**
   * Enquiry form endpoint. The form POSTs JSON and expects a 2xx response.
   * Works out of the box with Formspree (https://formspree.io/f/<id>), Web3Forms,
   * Basin, Getform or your own handler. Can also be set at build time with
   * VITE_FORM_ENDPOINT. While empty, the form refuses to pretend it sent anything
   * and points visitors to the other contact options instead.
   */
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || '',
};

/** International-format digits only, as wa.me requires (no +, spaces or punctuation). */
export function whatsappUrl(number = site.contact.whatsapp, message = site.whatsappMessage) {
  if (!number) return null;
  const digits = String(number).replace(/\D/g, '').replace(/^00/, '');
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
