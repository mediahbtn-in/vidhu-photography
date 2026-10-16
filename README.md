# Vidhu Photography — editorial portfolio

A one-page, editorial-style portfolio and booking site for Vidhu Photography,
built around the idea of **"the art of holding onto a moment."**

It's plain HTML, CSS and JavaScript modules, bundled with [Vite](https://vitejs.dev). There's no
framework and no runtime dependencies. [`sharp`](https://sharp.pixelplumbing.com) is used at build
time only, to produce responsive AVIF/WebP variants of the original photographs.

```bash
npm install
npm run dev            # local development
npm run build          # builds responsive images, then the production site → dist/
npm run preview        # serve the production build
```

---

## ⚠️ Status: real photographs and business details still needed

The brief requires the redesign to reuse the photographs and business information from the
existing site, <https://vidhuphotography.framer.website/>. **The build environment could not reach that
site:** the hostname did not resolve, and requests to `framerusercontent.com` (Framer's image CDN) were blocked
by the network policy. So:

- **No photographs are included yet.** Nothing has been replaced with stock or AI imagery. Every
  image position shows a labelled **"Photograph pending"** frame naming the exact file it expects.
  When the file exists, the real photograph appears automatically.
- **No contact details are included yet.** Email, phone, WhatsApp, Instagram, Facebook and
  location are all `null` in `src/config/site.js`. Anything left `null` isn't shown at all.
- **The FAQ answers are cautious drafts.** The questions match the existing site, but its answers
  could not be read (see [FAQ](#faq)).

Complete the steps below from a computer with normal internet access.

### 1. Download the original photographs

```bash
npm run assets:fetch
# or, if the site has moved:  npm run assets:fetch -- https://your-framer-url/
```

The script crawls the home page and the pages it links to, and collects every Framer-hosted image.
It strips Framer's resize parameters, so you get the **full-resolution originals**, not screenshots
or thumbnails. Files are saved to `assets/inbox/`. `assets/inbox/index.json` records where each
image appeared: the page, its alt text and the nearest heading. Use that to sort them.

### 2. Sort them into categories

Move each file into `public/images/<group>/` and rename it to match `src/data/portfolio.js`, or
edit the data file to use your filenames. Not every category needs the same number of images.

| Folder                     | Used for                                                                |
| -------------------------- | ----------------------------------------------------------------------- |
| `hero/hero-main.jpg`       | The main hero photograph. Choose the strongest, most emotive portrait-orientation image. |
| `hero/hero-secondary.jpg`  | The smaller overlapping hero image.                                     |
| `weddings/`                | Traditional wedding. `wedding-feature.jpg` is the full-width "A moment in time" image, so landscape works best. |
| `pre-wedding/`             | Pre-wedding shoots                                                      |
| `maternity/`               | Maternity                                                               |
| `baby/`                    | Baby shoots                                                             |
| `baby-shower/`             | Baby showers                                                            |
| `birthday/`                | Birthdays                                                               |
| `about/vidhu.jpg`          | About section. See the note below.                                      |

**About-section image:** use it only if the existing About image is a genuine portrait of Vidhu.
If it isn't, point `slots.about` in `src/data/portfolio.js` at a relevant portfolio photograph and set
`isPortrait: false`. The caption then reads "From the portfolio" instead of "Vidhu, behind the
lens". Never use a stock or generated portrait. `slots.aboutSecondary` (Vidhu at work) is optional
and stays hidden unless a genuine photo is set.

Then update each entry's **`alt`** text to describe what is actually in the photo. Use **`focus`**
(CSS `object-position`, e.g. `'50% 25%'`) to keep faces inside the crop.

### 3. Build responsive images

```bash
npm run assets:build
```

For every original in `public/images/`, this generates AVIF and WebP variants (480–2400 px, never
upscaled) in `_r/` sub-folders. It writes `src/data/image-manifest.json` with each image's
intrinsic size, which the page uses for `width`/`height` so there is no layout shift. It also makes
`public/images/og.jpg` (1200×630) from the hero image for social sharing. **Originals are never
modified**, and they're still served as the fallback `<img src>`.

`npm run build` runs this step automatically and skips variants that are already up to date. The
generated `_r/` folders and `og.jpg` are git-ignored. Any host that runs `npm run build`
(Netlify, Vercel, Cloudflare Pages, …) regenerates them. Commit only the originals.

The gallery reads each image's real orientation from the manifest. Portraits are never forced into
wide crops.

---

## Before launch: checklist

**Content (`src/config/site.js`)**

- [ ] `contact.email`, `contact.phone`, `contact.whatsapp`: copy them exactly from the existing site.
      WhatsApp numbers are normalised to the `wa.me/<country code + number>` format automatically,
      so include the country code.
- [ ] `social.instagram`, `social.facebook`: the verified profile URLs.
- [ ] `contact.location`: only if Vidhu confirms the service area.
- [ ] `acceptingBookings: true` **only** if Vidhu is currently taking bookings. This shows the
      "Available for bookings" indicator in the header.
- [ ] `url` and the `canonical` / `og:url` tags in `index.html`: set them to the production domain.

**Enquiry form**

The form validates every field. It blocks duplicate submissions while sending, then POSTs JSON to
`formEndpoint`. **It is not connected yet.** Until it is, submitting shows an honest "not connected
yet" message. It never shows a fake success, and it points visitors to WhatsApp or email if those
are configured.

To connect it, create a form with any JSON-capable service, e.g. [Formspree](https://formspree.io),
and either:

```bash
# .env.production
VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
```

or set `formEndpoint` in `src/config/site.js`. Submit a test enquiry and confirm it arrives. The
payload contains `name, email, phone, type, date, location, message, _subject`. It also has a
honeypot field (`_gotcha`) for spam.

**Copy marked as draft**

- [ ] **FAQ** (`src/data/faq.js`): replace the drafts with the answers from the existing site. In
      `npm run dev`, unconfirmed answers show a "Draft — confirm" badge. The badge never appears
      in production builds. Don't add prices, turnaround times, or weather or cancellation policies
      unless Vidhu confirms them.
- [ ] **About** copy (`index.html`, `#about`): reconcile it with the existing About text.
- [ ] **Services** (`src/data/services.js`): confirm that each service is currently offered.
- [ ] **Process step 04** (`index.html`): replace it with Vidhu's real delivery process. Add no
      turnaround time unless confirmed.
- [ ] **Testimonials** are intentionally omitted. Add a section only with real, approved client
      words.

---

## Structure

```
index.html                    semantic page markup, SEO/Open Graph meta
src/
  main.js                     wires everything together
  config/site.js              business details, form endpoint, booking status
  data/
    portfolio.js              every photograph + fixed slots (hero, feature, about)
    categories.js             categories and gallery filters
    services.js  faq.js       draft copy
    image-manifest.json       generated by `npm run assets:build`
  components/
    image.js                  <picture> with AVIF/WebP srcset, or a "pending" frame
    header.js                 sticky header, mobile overlay menu (focus-trapped, Esc closes)
    motion.js                 intro sequence, scroll reveals, restrained parallax
    gallery.js                filterable, orientation-aware 12-column exhibition grid
    lightbox.js               <dialog> viewer: keys, swipe, counter, focus return
    contact-sheet.js          horizontally scrollable film strip (drag with a mouse)
    services.js               hover/tap service previews
    faq.js                    accessible accordion
    form.js                   validation + submission
    contact.js                renders only confirmed contact/social details
    cursor.js                 "View" cursor label (fine pointers only; native cursor kept)
  styles/main.css             design tokens, layout, motion, reduced-motion rules
scripts/
  fetch-framer-assets.mjs     downloads original images from the Framer site
  build-images.mjs            responsive variants + manifest + og.jpg
public/images/<group>/        original photographs (add them here)
```

## Design notes

- **Palette:** warm ivory `#F6F3ED`, soft cream `#EAE4DA`, charcoal `#22211F`, warm grey (darkened
  slightly to `#6F6962` to pass WCAG AA on cream), terracotta `#B96E52` used sparingly, and
  near-black `#171715` for the dark sections (contact sheet, featured moment, booking, lightbox).
- **Type:** Instrument Serif for display, DM Sans for everything else.
- **Grain** is in the page background only. It is never laid over the photographs.
- **Motion:** 150–250 ms for UI, 350–650 ms for reveals, about 950 ms for the hero mask. Everything respects
  `prefers-reduced-motion`: parallax, translations and masks are switched off, and all content and
  controls stay available.
- **Accessibility:** a skip link, landmarks and a logical heading order. Every control is a real
  button or link, focus is visible, and form errors are linked to fields with `aria-describedby`.
  Filter changes are announced through a live region. The lightbox is a modal `<dialog>` that
  returns focus when closed.
