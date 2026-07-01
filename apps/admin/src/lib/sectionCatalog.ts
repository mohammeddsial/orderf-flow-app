// The full set of sections the MOBILE app can render for each page. The admin
// "Add Section" picker offers these (minus the ones already on the page).
// Keep keys in sync with the mobile renderers:
//   - home  -> HomePage.renderSection switch cases
//   - menu  -> MenuPage showSection keys
export const SECTION_CATALOG: Record<string, { key: string; label: string }[]> = {
  home: [
    { key: 'hero', label: 'Hero Video' },
    { key: 'cartRecovery', label: 'Cart Recovery' },
    { key: 'loyalty', label: 'Loyalty Dashboard' },
    { key: 'orderAgain', label: 'Order Again' },
    { key: 'recommendations', label: 'Recommendations' },
    { key: 'flashDeal', label: 'Flash Deal' },
    { key: 'categories', label: 'Category Tiles' },
    { key: 'mealDeal', label: 'Meal Deal Combo' },
    { key: 'offer', label: 'Discount Offer' },
    { key: 'featured', label: 'Featured' },
    { key: 'imageMosaic', label: 'Image Mosaic' },
    { key: 'stories', label: 'Stories' },
    { key: 'popular', label: 'Popular' },
    { key: 'browser', label: 'Restaurant Browser' },
    { key: 'announcement', label: 'Announcement Strip' },
    { key: 'birthday', label: 'Birthday Banner' },
  ],
  menu: [
    { key: 'search', label: 'Search & Filters' },
    { key: 'categories', label: 'Category Nav' },
    { key: 'grid', label: 'Product Grid' },
  ],
};
