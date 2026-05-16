/**
 * Scent-family visual tokens — used everywhere a scent family is rendered
 * (product cards, PDP eyebrow, filter sidebar, quick-view modal). Each entry
 * gives the brand-safe hex pair: a soft tint for backgrounds and a saturated
 * accent for the dot/border so the chip reads in both light & dark surfaces.
 */

export type ScentFamilyKey =
  | 'Floral'
  | 'Woody'
  | 'Oriental'
  | 'Fresh'
  | 'Gourmand'
  | 'Oud'
  | 'Citrus'
  | 'Aquatic';

export interface FamilyTheme {
  tint: string;
  accent: string;
  text: string;
}

export const SCENT_FAMILY_THEMES: Record<ScentFamilyKey, FamilyTheme> = {
  Floral:   { tint: '#FBE6EC', accent: '#E8A5B4', text: '#8E3A4E' },
  Woody:    { tint: '#EFE6DC', accent: '#A0785A', text: '#5E4732' },
  Oriental: { tint: '#FBE9D6', accent: '#C4763A', text: '#7A4318' },
  Fresh:    { tint: '#E0F2F4', accent: '#7AC5CD', text: '#225C63' },
  Gourmand: { tint: '#FBF1D8', accent: '#D4A843', text: '#6F5318' },
  Oud:      { tint: '#EBE0D7', accent: '#5C3317', text: '#3D2010' },
  Citrus:   { tint: '#FDF6D6', accent: '#E0B520', text: '#6B5410' },
  Aquatic:  { tint: '#DCEDF7', accent: '#4A9ECC', text: '#1F4F6F' },
};

const FALLBACK: FamilyTheme = { tint: '#F0EBE5', accent: '#9A9590', text: '#4A4A4A' };

/** Returns a theme even when the input is unknown — never undefined. */
export function themeFor(family: string | undefined | null): FamilyTheme {
  if (!family) return FALLBACK;
  const key = family as ScentFamilyKey;
  return SCENT_FAMILY_THEMES[key] ?? FALLBACK;
}
