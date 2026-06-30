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
    { key: 'featured', label: 'Featured', enabled: true },
    { key: 'stories', label: 'Stories', enabled: true },
    { key: 'popular', label: 'Popular', enabled: true },
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
