export type CardVariant =
  | 'listRow'
  | 'overlayPrice'
  | 'qtyRow'
  | 'plainGrid'
  | 'feature'
  | 'restaurantCard'
  | 'video'
  | 'slides';

export const VARIANTS_BY_SECTION: Record<string, CardVariant[]> = {
  hero: ['video', 'slides'],
  recommendations: ['listRow', 'qtyRow', 'overlayPrice', 'feature'],
  popular: ['overlayPrice', 'listRow', 'plainGrid'],
  featured: ['feature', 'overlayPrice', 'listRow'],
  grid: ['listRow', 'overlayPrice', 'plainGrid', 'feature'],
  browser: ['restaurantCard'],
};