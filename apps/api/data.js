// Seed data for the dummy backend. Mirrors the shape of @multi-restaurant/database
// so the web-admin and mobile app can consume it without transformation.

const ts = '2024-01-01T00:00:00Z';

export const restaurants = [
  {
    id: 'tenant-burgerbliss',
    name: 'BurgerBliss',
    logoUrl: 'https://picsum.photos/seed/burgerbliss-logo/150',
    activeUiStyle: 'BRUTALIST_MODERNIST',
    primaryColor: '#df6a00',
    secondaryColor: '#ac5200',
    backgroundColor: '#ffffff',
    accentColor: '#ff8313',
    surfaceColor: '#e6e6e6',
    accentLightColor: '#ff9e46',
    borderRadiusType: 'SHARP',
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: 'tenant-greengarden',
    name: 'Green Garden',
    logoUrl: 'https://picsum.photos/seed/greengarden-logo/150',
    activeUiStyle: 'MINIMALIST_CLEAN',
    primaryColor: '#2e7d32',
    secondaryColor: '#1b5e20',
    backgroundColor: '#ffffff',
    accentColor: '#66bb6a',
    surfaceColor: '#e8f5e9',
    accentLightColor: '#a5d6a7',
    borderRadiusType: 'ROUNDED_SM',
    createdAt: ts,
    updatedAt: ts,
  },
];

const PATTY = {
  id: 'mod-patty-size',
  name: 'Patty Size',
  maxSelection: 1,
  options: [
    { id: 'opt-single', name: 'Single Patty', price: 0 },
    { id: 'opt-double', name: 'Double Patty', price: 2.5 },
    { id: 'opt-triple', name: 'Triple Patty', price: 5.0 },
  ],
};

const CHEESE = {
  id: 'mod-cheese',
  name: 'Cheese',
  maxSelection: 3,
  options: [
    { id: 'opt-cheddar', name: 'Cheddar', price: 0.75 },
    { id: 'opt-swiss', name: 'Swiss', price: 1.0 },
    { id: 'opt-blue', name: 'Blue Cheese', price: 1.5 },
  ],
};

const item = (restaurantId, id, title, description, basePrice, calories, category, modifiers = []) => ({
  id,
  restaurantId,
  title,
  description,
  basePrice,
  imageUrl: `https://picsum.photos/seed/${id}/400/300`,
  calories,
  category,
  modifiers,
  isAvailable: true,
  createdAt: ts,
  updatedAt: ts,
});

const BB = 'tenant-burgerbliss';
const GG = 'tenant-greengarden';

export const menuItems = [
  // BurgerBliss
  item(BB, 'item-classic-burger', 'Classic Burger', 'Flame-grilled patty, lettuce, tomato, house sauce', 9.99, 540, 'Burgers', [PATTY, CHEESE]),
  item(BB, 'item-deluxe-burger', 'Deluxe Burger', 'Wagyu beef, caramelized onions, aged cheddar, truffle aioli', 14.99, 680, 'Burgers', [PATTY, CHEESE]),
  item(BB, 'item-spicy-burger', 'Spicy Inferno Burger', 'Ghost pepper aioli, jalapenos, crispy onions, hot sauce', 11.99, 620, 'Burgers', [PATTY, CHEESE]),
  item(BB, 'item-fries', 'Hand-Cut Fries', 'Crispy hand-cut fries with sea salt', 4.99, 380, 'Sides'),
  item(BB, 'item-onion-rings', 'Golden Onion Rings', 'Crispy beer-battered onion rings', 5.99, 420, 'Sides'),
  item(BB, 'item-cola', 'Cold Cola', 'Refreshing cola drink', 2.49, 140, 'Drinks'),
  item(BB, 'item-milkshake', 'Vanilla Milkshake', 'Creamy vanilla milkshake made with real ice cream', 5.99, 450, 'Drinks'),
  item(BB, 'item-brownie', 'Fudge Brownie', 'Rich, fudgy brownie with dark chocolate', 4.99, 380, 'Desserts'),
  // Green Garden
  item(GG, 'gg-garden-burger', 'Garden Burger', 'House black-bean patty, avocado, sprouts, vegan mayo', 10.99, 410, 'Burgers'),
  item(GG, 'gg-quinoa-bowl', 'Quinoa Power Bowl', 'Quinoa, roasted veg, chickpeas, tahini drizzle', 11.49, 480, 'Burgers'),
  item(GG, 'gg-side-salad', 'Side Garden Salad', 'Mixed greens, cherry tomato, cucumber, vinaigrette', 4.49, 120, 'Sides'),
  item(GG, 'gg-sweet-fries', 'Sweet Potato Fries', 'Baked sweet potato fries with rosemary salt', 5.49, 300, 'Sides'),
  item(GG, 'gg-green-smoothie', 'Green Detox Smoothie', 'Spinach, banana, mango, coconut water', 6.49, 210, 'Drinks'),
  item(GG, 'gg-fruit-bowl', 'Seasonal Fruit Bowl', 'Fresh seasonal fruit with mint and lime', 5.99, 160, 'Desserts'),
];

export const orders = [
  {
    id: 'ORD-2847',
    restaurantId: BB,
    customer: 'David Chen',
    status: 'OUT_FOR_DELIVERY',
    eta: '8:05 PM',
    driver: 'Sarah Johnson',
    rating: 4.9,
    total: 24.97,
    items: ['Classic Burger', 'Hand-Cut Fries'],
  },
  {
    id: 'ORD-2848',
    restaurantId: BB,
    customer: 'Emily Davis',
    status: 'PREPARING',
    eta: '8:20 PM',
    driver: 'Mike Wilson',
    rating: 4.8,
    total: 14.99,
    items: ['Deluxe Burger'],
  },
];

// Default per-page mobile section layouts. Each restaurant gets its own copy,
// edited from the web-admin "Mobile Pages" screen and read by the mobile app.
export const defaultPages = {
  home: [
    { key: 'hero', label: 'Hero Video', enabled: true },
    { key: 'cartRecovery', label: 'Cart Recovery', enabled: true },
    { key: 'loyalty', label: 'Loyalty Dashboard', enabled: true },
    { key: 'orderAgain', label: 'Order Again', enabled: true },
    { key: 'recommendations', label: 'Recommendations', enabled: true },
    { key: 'flashDeal', label: 'Flash Deal', enabled: true },
    { key: 'categories', label: 'Category Tiles', enabled: true },
    { key: 'mealDeal', label: 'Meal Deal Combo', enabled: true },
    { key: 'featured', label: 'Featured', enabled: true },
    { key: 'stories', label: 'Stories', enabled: true },
    { key: 'popular', label: 'Popular', enabled: true },
    { key: 'videoSection', label: 'Video Section', enabled: true, cardVariant: 'video' },
    { key: 'announcement', label: 'Announcement Strip', enabled: true },
    { key: 'imageMosaic', label: 'Image Mosaic', enabled: true },
  ],
  menu: [
    { key: 'search', label: 'Search & Filters', enabled: true },
    { key: 'categories', label: 'Category Nav', enabled: true },
    { key: 'grid', label: 'Product Grid', enabled: true },
  ],
};

// Page metadata for the admin UI (label + which keys belong to each page).
export const pageMeta = [
  { key: 'home', label: 'Home' },
  { key: 'menu', label: 'Menu' },
];

// ---- Deals -----------------------------------------------------------------

export const deals = [
  {
    id: 'deal-welcome',
    title: 'Welcome! 20% Off Your First Order',
    description: 'New here? Enjoy 20% off your first order with us.',
    image: 'https://picsum.photos/seed/deal-welcome/600/400',
    discountType: 'percentage',
    discountValue: 20,
    code: 'WELCOME20',
    minOrder: 10,
    expiryDate: '2026-12-31',
    isLimited: false,
    remainingCount: null,
    applicableProducts: [],
  },
  {
    id: 'deal-burger-bundle',
    title: 'Burger Bundle: 2 for $18',
    description: 'Any two classic burgers for just $18. Perfect for sharing.',
    image: 'https://picsum.photos/seed/deal-burger-bundle/600/400',
    discountType: 'fixed',
    discountValue: 5,
    code: 'BURGER2',
    minOrder: 0,
    expiryDate: '2026-07-15',
    isLimited: true,
    remainingCount: 342,
    applicableProducts: ['item-classic-burger', 'item-spicy-burger'],
  },
  {
    id: 'deal-free-delivery',
    title: 'Free Delivery on $25+',
    description: 'Spend $25 or more and get free delivery.',
    image: 'https://picsum.photos/seed/deal-free-delivery/600/400',
    discountType: 'fixed',
    discountValue: 3.99,
    code: 'FREESHIP',
    minOrder: 25,
    expiryDate: '2026-07-31',
    isLimited: false,
    remainingCount: null,
    applicableProducts: [],
  },
  {
    id: 'deal-milkshake-half',
    title: '50% Off Milkshakes After 8PM',
    description: 'Late night cravings? Half-price milkshakes after 8 PM.',
    image: 'https://picsum.photos/seed/deal-milkshake/600/400',
    discountType: 'percentage',
    discountValue: 50,
    code: 'SHAKE50',
    minOrder: 0,
    expiryDate: '2026-07-07',
    isLimited: true,
    remainingCount: 156,
    applicableProducts: ['item-milkshake'],
  },
  {
    id: 'deal-combo-save',
    title: 'Combo Meal: Save $3',
    description: 'Get any burger + fries + drink combo and save $3 instantly.',
    image: 'https://picsum.photos/seed/deal-combo/600/400',
    discountType: 'fixed',
    discountValue: 3,
    code: 'COMBO3',
    minOrder: 0,
    expiryDate: '2026-07-14',
    isLimited: false,
    remainingCount: null,
    applicableProducts: [],
  },
];

export const limitedTimeOffer = {
  id: 'lto-summer-bbq',
  title: 'Summer BBQ Bash!',
  description: 'Limited-time BBQ Bacon Burger with smoky chipotle glaze',
  image: 'https://picsum.photos/seed/lto-bbq/600/400',
  originalPrice: 14.99,
  discountedPrice: 10.99,
  expiryDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
};

// ---- Rewards ---------------------------------------------------------------

export const rewards = [
  { id: 'rew-free-fries', name: 'Free Regular Fries', description: 'Crispy hand-cut fries on us', image: 'https://picsum.photos/seed/rew-fries/200/200', pointsCost: 200, tier: 'all', category: 'food' },
  { id: 'rew-free-drink', name: 'Free Soft Drink', description: 'Any medium soft drink', image: 'https://picsum.photos/seed/rew-drink/200/200', pointsCost: 150, tier: 'all', category: 'drink' },
  { id: 'rew-free-burger', name: 'Free Classic Burger', description: 'Our signature Classic burger', image: 'https://picsum.photos/seed/rew-burger/200/200', pointsCost: 500, tier: 'all', category: 'food' },
  { id: 'rew-free-milkshake', name: 'Free Milkshake', description: 'Any premium milkshake', image: 'https://picsum.photos/seed/rew-milkshake/200/200', pointsCost: 400, tier: 'all', category: 'dessert' },
  { id: 'rew-free-delivery', name: 'Free Delivery', description: 'Waived delivery fee on any order', image: 'https://picsum.photos/seed/rew-delivery/200/200', pointsCost: 350, tier: 'silver', category: 'delivery' },
  { id: 'rew-combo-meal', name: 'Free Combo Meal', description: 'Burger + fries + drink combo', image: 'https://picsum.photos/seed/rew-combo/200/200', pointsCost: 800, tier: 'gold', category: 'food' },
  { id: 'rew-merch-hat', name: 'Branded Cap', description: 'Limited edition snapback cap', image: 'https://picsum.photos/seed/rew-hat/200/200', pointsCost: 1000, tier: 'platinum', category: 'merchandise' },
  { id: 'rew-merch-hoodie', name: 'Branded Hoodie', description: 'Premium embroidered hoodie', image: 'https://picsum.photos/seed/rew-hoodie/200/200', pointsCost: 2000, tier: 'platinum', category: 'merchandise' },
];

// ---- Stores ----------------------------------------------------------------

export const stores = [
  { id: 'store-001', name: 'Downtown Flagship', address: '250 Broadway, New York, NY 10007', distance: 0.4, isOpen: true, hours: '10:00 AM - 11:00 PM', kitchenOpenUntil: '10:30 PM', acceptingOrders: true },
  { id: 'store-002', name: 'Midtown East', address: '450 Lexington Ave, New York, NY 10017', distance: 1.2, isOpen: true, hours: '10:00 AM - 10:00 PM', kitchenOpenUntil: '9:30 PM', acceptingOrders: true },
  { id: 'store-003', name: 'Upper West Side', address: '2150 Broadway, New York, NY 10024', distance: 3.5, isOpen: true, hours: '11:00 AM - 10:00 PM', kitchenOpenUntil: '9:30 PM', acceptingOrders: true },
  { id: 'store-004', name: 'Williamsburg', address: '135 Kent Ave, Brooklyn, NY 11249', distance: 4.8, isOpen: false, hours: '11:00 AM - 9:00 PM', kitchenOpenUntil: '8:30 PM', acceptingOrders: false },
];

// ---- User (single demo user) -----------------------------------------------

export const user = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://picsum.photos/seed/user-avatar/100/100',
  points: 1840,
  tier: 'gold',
  tierPointsNeeded: 2500,
  tierPointsCurrent: 1840,
  birthday: '1992-07-15',
  savedAddresses: [
    { formatted: '123 Main Street, Apt 4B, New York, NY 10001', street: '123 Main Street, Apt 4B', city: 'New York', state: 'NY', postalCode: '10001', country: 'US', lat: 40.7484, lng: -73.9857 },
    { formatted: '456 Park Avenue, Office 12, New York, NY 10022', street: '456 Park Avenue, Office 12', city: 'New York', state: 'NY', postalCode: '10022', country: 'US', lat: 40.7635, lng: -73.9722 },
  ],
  savedPayments: [
    { id: 'pay-001', type: 'visa', lastFour: '4242', expiryDate: '12/27', isDefault: true },
    { id: 'pay-002', type: 'mastercard', lastFour: '8888', expiryDate: '06/26', isDefault: false },
    { id: 'pay-003', type: 'apple-pay', lastFour: '', expiryDate: '', isDefault: false },
  ],
  pastOrders: [
    { orderId: 'ORD-2847', items: [{ productId: 'item-classic-burger', productName: 'Classic Burger', quantity: 2 }, { productId: 'item-fries', productName: 'Hand-Cut Fries', quantity: 2 }, { productId: 'item-cola', productName: 'Cold Cola', quantity: 2 }], total: 35.92, placedAt: '2026-06-28T18:30:00Z', isFavourite: true },
    { orderId: 'ORD-2848', items: [{ productId: 'item-deluxe-burger', productName: 'Deluxe Burger', quantity: 1 }], total: 15.38, placedAt: '2026-06-20T19:45:00Z', isFavourite: false },
  ],
  dietaryPreferences: [],
  allergenAlerts: [],
};
