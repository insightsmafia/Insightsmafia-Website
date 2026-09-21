// The fixed list of industries case studies can be tagged with, used both
// by the admin "Industry" field and the "What are you looking for?" filter
// on each work category page. Kept as a flat list (not a DB table) since
// it's a small, deliberately fixed taxonomy rather than something editors
// add to.
export const INDUSTRIES = [
  'Jewellery',
  'Fashion & Apparel',
  'Beauty & Personal Care',
  'Automotive',
  'Real Estate & Construction',
  'Food & Beverage',
  'Healthcare',
  'Pharmaceuticals',
  'Education',
  'Hospitality & Travel',
  'FMCG',
  'E-commerce',
] as const;
