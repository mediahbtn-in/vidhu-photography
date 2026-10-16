/**
 * Portfolio content. One entry per photograph.
 *
 *   image    path under /public/images (the original file, kept untouched)
 *   alt      describe what is actually in the photograph — update after sorting the real assets
 *   category key from categories.js
 *   title    project title shown in captions and the lightbox
 *   caption  optional short line under the title
 *   focus    optional object-position for cropping, e.g. '50% 30%' to keep faces in frame
 *   featured optional — included in the "All stories" exhibition (default true)
 *   order    optional display order (lower first)
 *
 * The filenames below are the expected names after running `npm run assets:fetch`
 * and sorting the downloaded files (see README). If a file is missing the site
 * renders a clearly labelled "photograph pending" frame instead of a substitute.
 * Not every category needs the same number of images — add or remove entries freely.
 */
export const portfolio = [
  { image: 'weddings/wedding-01.jpg', category: 'wedding', title: 'Traditional Wedding', alt: 'Traditional wedding photograph', focus: '50% 35%', order: 1 },
  { image: 'maternity/maternity-01.jpg', category: 'maternity', title: 'Maternity Stories', alt: 'Maternity portrait', focus: '50% 30%', order: 2 },
  { image: 'baby/baby-01.jpg', category: 'baby', title: 'Little Beginnings', alt: 'Baby photograph', order: 3 },
  { image: 'pre-wedding/pre-wedding-01.jpg', category: 'pre-wedding', title: 'Before the Forever', alt: 'Pre-wedding couple portrait', order: 4 },
  { image: 'weddings/wedding-02.jpg', category: 'wedding', title: 'Traditional Wedding', alt: 'Wedding ceremony moment', order: 5 },
  { image: 'baby-shower/baby-shower-01.jpg', category: 'baby-shower', title: 'Celebrating New Life', alt: 'Baby shower celebration', order: 6 },
  { image: 'birthday/birthday-01.jpg', category: 'birthday', title: 'Birthday Memories', alt: 'Birthday celebration', order: 7 },
  { image: 'pre-wedding/pre-wedding-02.jpg', category: 'pre-wedding', title: 'Before the Forever', alt: 'Pre-wedding portrait', order: 8 },
  { image: 'maternity/maternity-02.jpg', category: 'maternity', title: 'Maternity Stories', alt: 'Maternity photograph', order: 9 },
  { image: 'baby/baby-02.jpg', category: 'baby', title: 'Little Beginnings', alt: 'Baby portrait detail', order: 10 },
  { image: 'weddings/wedding-03.jpg', category: 'wedding', title: 'Traditional Wedding', alt: 'Wedding portrait', order: 11 },
  { image: 'birthday/birthday-02.jpg', category: 'birthday', title: 'Birthday Memories', alt: 'Birthday moment', order: 12 },
];

/** Fixed art-directed slots outside the gallery. */
export const slots = {
  heroMain: { image: 'hero/hero-main.jpg', alt: 'Featured photograph from the Vidhu Photography portfolio', focus: '50% 35%' },
  heroSecondary: { image: 'hero/hero-secondary.jpg', alt: 'Second photograph from the Vidhu Photography portfolio', focus: '50% 40%' },
  featured: { image: 'weddings/wedding-feature.jpg', alt: 'A full-width moment from the portfolio', focus: '50% 45%' },
  /**
   * Only use a genuine portrait of Vidhu here. If none exists, point this at a
   * relevant portfolio image and set `isPortrait: false` (changes the caption).
   */
  about: { image: 'about/vidhu.jpg', alt: 'Vidhu, photographer', focus: '50% 30%', isPortrait: true },
  /** Optional: Vidhu at work. Leave `image: null` if no genuine photo exists. */
  aboutSecondary: { image: null, alt: 'Vidhu photographing a session' },
};
