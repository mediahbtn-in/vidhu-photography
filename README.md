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

## ⚠️ Status: more photographs and the business details are still needed

The brief requires the redesign to reuse the photographs and business information from the
existing site, <https://vidhuphotography.framer.website/>. **The build environment could not reach that
site:** the hostname did not resolve, and requests to `framerusercontent.com` (Framer's image CDN) were
blocked by the network policy.

**Photographs supplied so far (5):** these were uploaded directly and are used unchanged, as
originals in `public/images/`:

| File | Shows | Used in |
| --- | --- | --- |
| `weddings/bride-green-silk.avif` (820×1024) | Bride in green silk and gold temple jewellery, from above | Hero (main), gallery, wedding service |
| `birthday/cake-smash.avif` (683×1024) | Toddler after a birthday cake smash | Hero (overlap), gallery, birthday service |
| `pre-wedding/sunset-silhouette.avif` (1024×956) | Couple silhouetted at sunset | "A moment in time" feature, gallery, pre-wedding service |
| `maternity/maternity-red-gown.avif` (1024×831) | Expectant mother in a red gown and flower crown | About section, gallery, maternity service |
| `baby/baby-bunny-beach.avif` (512×341) | Baby in bunny ears by the sea | Gallery, baby service |

**Still missing:**

- **A portrait of Vidhu.** None of the five photos is of the photographer, so the About section uses
  a portfolio photo with the caption "From the portfolio", not a claim that it's Vidhu. Add a real
  portrait as `about/vidhu.jpg`, then point `slots.about` at it with `isPortrait: true`.
- **Baby-shower photography.** The service is listed, but its preview shows a "Photograph pending"
  frame until a photo is added (`services.js` → `image`).
- **Higher-resolution originals.** The uploads are Framer's resized copies (1024 px max; the baby
  photo is 512 px). They look fine at normal size but soft on large retina screens, especially the
  hero and the full-width feature. If Vidhu has the camera originals, drop them in with the same
  filenames and rebuild. The gallery never puts an original under 800 px wide into a large frame.
- **More portfolio images.** Any further photos from the existing site (see step 1 below).
- **Contact details.** Email, phone, WhatsApp, Instagram, Facebook and location are all `null` in
  `src/config/site.js`. Anything left `null` isn't shown at all.
- **The FAQ answers are cautious drafts.** The questions match the existing site, but its answers
  could not be read (see the checklist below).

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

| Folder | Used for |
| --- | --- |
| `weddings/` | Traditional wedding |
| `pre-wedding/` | Pre-wedding shoots |
| `maternity/` | Maternity |
| `baby/` | Baby shoots |
| `baby-shower/` | Baby showers |
| `birthday/` | Birthdays |
| `about/` | Photos of Vidhu |

Which photo appears in the hero, the full-width feature and the About section is set by `slots` in
`src/data/portfolio.js`. For the hero, pick the strongest, most emotive portrait-orientation image.
For the feature, use a landscape image. JPEG, PNG, WebP and AVIF originals all work.

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
`public/images/og.jpg` (1200×630) from the hero photo for social sharing. **Originals are never
modified**. Browsers get AVIF or WebP at the right size; the largest WebP is the fallback `<img src>`.

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
