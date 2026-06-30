// apps/mobile/src/components/home/cardVariants.ts
export type CardVariant =
  | 'listRow'        // image left · title · rating · time · price pill
  | 'overlayPrice'   // vertical card · price pill ON the image · title below
  | 'qtyRow'         // image · title · price · −qty+ stepper
  | 'plainGrid'      // simple square card
  | 'feature'        // large full-width card · big image · title · rating · price
  | 'restaurantCard' // card-7 · restaurant banner · Free Delivery badge · tags
  | 'video'          // hero · looping background video
  | 'slides';        // hero · 3-image auto-rotating slideshow

// Which variants each module is allowed to use
export const VARIANTS_BY_SECTION: Record<string, CardVariant[]> = {
  hero: ['video', 'slides'],
  recommendations: ['listRow', 'qtyRow', 'overlayPrice', 'feature'],
  popular: ['overlayPrice', 'listRow', 'plainGrid'],
  featured: ['feature', 'overlayPrice', 'listRow'],
  orderAgain: ['listRow', 'overlayPrice', 'plainGrid'],
  flashDeal: ['feature', 'listRow'],
  grid: ['listRow', 'overlayPrice', 'plainGrid', 'feature'],
  browser: ['restaurantCard'],
  // Add more as needed
};