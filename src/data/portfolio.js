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
 * Images live in public/images/<category>/ (see README). If a file is missing
 * the site renders a clearly labelled "photograph pending" frame instead of a
 * substitute. Not every category needs the same number of images — add or
 * remove entries freely; the gallery layout adapts to each photo's shape.
 */
export const portfolio = [
  {
    image: 'weddings/bride-green-silk.avif',
    category: 'wedding',
    title: 'Traditional Wedding',
    alt: 'A bride in a green silk saree and gold temple jewellery, photographed from above, eyes closed',
    focus: '50% 55%',
    order: 1,
  },
  {
    image: 'maternity/maternity-red-gown.avif',
    category: 'maternity',
    title: 'Maternity Stories',
    alt: 'An expectant mother in a red gown and floral crown cradling her bump beside an ivy-covered pillar',
    focus: '55% 22%',
    order: 2,
  },
  {
    image: 'baby/baby-bunny-beach.avif',
    category: 'baby',
    title: 'Little Beginnings',
    alt: 'A baby wearing fluffy bunny ears, sitting on the grass by the sea',
    focus: '46% 50%',
    order: 3,
  },
  {
    image: 'birthday/cake-smash.avif',
    category: 'birthday',
    title: 'Birthday Memories',
    alt: 'A toddler with frosting on their face looking up at the camera during a birthday cake smash',
    focus: '50% 55%',
    order: 4,
  },
  {
    image: 'pre-wedding/sunset-silhouette.avif',
    category: 'pre-wedding',
    title: 'Before the Forever',
    alt: 'A couple silhouetted against the setting sun, foreheads touching',
    focus: '50% 40%',
    order: 5,
  },
];

/** Fixed art-directed slots outside the gallery. */
export const slots = {
  heroMain: {
    image: 'weddings/bride-green-silk.avif',
    alt: 'A bride in a green silk saree and gold temple jewellery, photographed from above, eyes closed',
    focus: '50% 58%',
  },
  heroSecondary: {
    image: 'birthday/cake-smash.avif',
    alt: 'A toddler with frosting on their face looking up at the camera',
    focus: '45% 55%',
  },
  featured: {
    image: 'pre-wedding/sunset-silhouette.avif',
    alt: 'A couple silhouetted against the setting sun, foreheads touching',
    focus: '50% 12%', // keep both heads in frame in the wide crop
  },
  /**
   * Only use a genuine portrait of Vidhu here with `isPortrait: true`.
   * No portrait of Vidhu has been supplied yet, so this shows a portfolio
   * photograph and the caption reads "From the portfolio".
   */
  about: {
    image: 'maternity/maternity-red-gown.avif',
    alt: 'An expectant mother in a red gown and floral crown beside an ivy-covered pillar',
    focus: '56% 30%',
    isPortrait: false,
  },
  /** Optional: Vidhu at work. Leave `image: null` if no genuine photo exists. */
  aboutSecondary: { image: null, alt: 'Vidhu photographing a session' },
};
