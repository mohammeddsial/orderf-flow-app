// ============================================================================
// MULTI-TENANT ACTIVERECORD SCHEMA
// ============================================================================

export type UIStyleEngine = 'BRUTALIST_MODERNIST' | 'MINIMALIST_CLEAN' | 'VIBRANT_STREET_TECH';
export type BorderRadiusType = 'SHARP' | 'ROUNDED_SM' | 'PILL';
export type MenuCategory = 'Burgers' | 'Sides' | 'Drinks' | 'Desserts';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type FulfillmentMode = 'DELIVERY' | 'PICKUP';
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type NotificationType = 'ORDER_UPDATE' | 'DELIVERY_ETA' | 'PROMOTION' | 'LOYALTY_MILESTONE';

// ============================================================================
// RESTAURANT TENANT
// ============================================================================
export interface RestaurantTenant {
  id: string;
  name: string;
  logoUrl: string;
  activeUiStyle: UIStyleEngine;
  primaryColor: string;        // hex: #RRGGBB
  secondaryColor: string;      // hex: #RRGGBB
  backgroundColor: string;     // hex: #RRGGBB
  accentColor: string;         // hex: #RRGGBB
  surfaceColor: string;        // hex: #RRGGBB — borders / surfaces
  accentLightColor: string;    // hex: #RRGGBB — light accent
  borderRadiusType: BorderRadiusType;
  createdAt: string;           // ISO 8601
  updatedAt: string;           // ISO 8601
}

// ============================================================================
// MENU ITEM & MODIFIERS
// ============================================================================
export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface Modifier {
  id: string;
  name: string;
  maxSelection: number;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  calories: number;
  category: MenuCategory;
  modifiers: Modifier[];
  isAvailable: boolean;
  createdAt: string;           // ISO 8601
  updatedAt: string;           // ISO 8601
}

// ============================================================================
// CART & ORDER
// ============================================================================
export interface CartItemModifierSelection {
  modifierId: string;
  selectedOptions: ModifierOption[];
}

export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  quantity: number;
  basePrice: number;
  modifierSelections: CartItemModifierSelection[];
  specialInstructions: string;
  itemTotal: number;           // basePrice * quantity + modifier prices
}

export interface Cart {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  createdAt: string;           // ISO 8601
  updatedAt: string;           // ISO 8601
}

// ============================================================================
// ORDER
// ============================================================================
export interface OrderItem {
  id: string;
  menuItemId: string;
  title: string;
  quantity: number;
  basePrice: number;
  modifierSelections: CartItemModifierSelection[];
  specialInstructions: string;
  itemTotal: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  fulfillmentMode: FulfillmentMode;
  status: OrderStatus;
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  estimatedDeliveryTime: number;  // minutes
  actualDeliveryTime?: number;    // minutes
  deliveryAddress?: string;
  pickupTime?: string;            // ISO 8601
  specialInstructions: string;
  driverName?: string;
  driverPhone?: string;
  createdAt: string;              // ISO 8601
  updatedAt: string;              // ISO 8601
  completedAt?: string;           // ISO 8601
}

// ============================================================================
// USER & ADDRESSES
// ============================================================================
export interface Address {
  id: string;
  label: string;                // "Home", "Work", etc.
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt: string;            // ISO 8601
}

export interface LoyaltyProfile {
  tier: LoyaltyTier;
  pointsBalance: number;
  lifetimePoints: number;
  lastRewardRedeemedAt?: string; // ISO 8601
  createdAt: string;            // ISO 8601
}

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  birthday?: string; // <-- ADD THIS (optional ISO date)
  profileImageUrl?: string;
  addresses: Address[];
  defaultAddressId?: string;
  loyaltyProfile: LoyaltyProfile;
  preferredFulfillmentMode: FulfillmentMode;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// REVIEW & RATING
// ============================================================================
export interface OrderReview {
  id: string;
  orderId: string;
  userId: string;
  restaurantId: string;
  foodRating: number;           // 1-5
  deliveryRating: number;       // 1-5
  foodComments: string;
  deliveryComments: string;
  foodAttributes: string[];     // ["Fresh", "Hot", "Tasty", "Portion Size", etc.]
  deliveryAttributes: string[]; // ["On Time", "Careful", "Friendly", etc.]
  mediaUrls: string[];
  createdAt: string;            // ISO 8601
  publishedAt?: string;         // ISO 8601 - when review goes live
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  orderId?: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;            // ISO 8601
}

// ============================================================================
// STORE STATE CONTAINER
// ============================================================================
export interface StoreState {
  currentTenant: RestaurantTenant;
  currentUser: User | null;
  menuItems: MenuItem[];
  cart: Cart | null;
  orders: Order[];
  notifications: Notification[];
  reviews: OrderReview[];
}
