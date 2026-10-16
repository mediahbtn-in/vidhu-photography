/**
 * Photography categories offered on the existing website.
 * `filter` groups categories into the gallery's filter tabs.
 */
export const categories = {
  wedding: { label: 'Traditional Wedding', caption: 'Traditional Wedding', filter: 'weddings' },
  'pre-wedding': { label: 'Pre-Wedding', caption: 'Before the Forever', filter: 'pre-wedding' },
  maternity: { label: 'Maternity', caption: 'Maternity Stories', filter: 'maternity' },
  baby: { label: 'Baby', caption: 'Little Beginnings', filter: 'baby' },
  'baby-shower': { label: 'Baby Shower', caption: 'Celebrating New Life', filter: 'celebrations' },
  birthday: { label: 'Birthday', caption: 'Birthday Memories', filter: 'celebrations' },
};

export const filters = [
  { id: 'all', label: 'All Stories' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'pre-wedding', label: 'Pre-Wedding' },
  { id: 'maternity', label: 'Maternity' },
  { id: 'baby', label: 'Baby' },
  { id: 'celebrations', label: 'Celebrations' },
];
