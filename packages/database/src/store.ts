import {
  RestaurantTenant,
  MenuItem,
  Modifier,
  ModifierOption,
  Cart,
  CartItem,
  CartItemModifierSelection,
  Order,
  OrderItem,
  User,
  Address,
  LoyaltyProfile,
  OrderReview,
  Notification,
  StoreState,
  UIStyleEngine,
  FulfillmentMode,
  OrderStatus,
  MenuCategory,
} from './types';

// ============================================================================
// MOCK DATA
// ============================================================================

// TENANT: BurgerBliss - Brutalist Modern Style
const BURGERBLISS_TENANT: RestaurantTenant = {
  id: 'tenant-burgerbliss',
  name: 'BurgerBliss',
  logoUrl: 'https://via.placeholder.com/150?text=BurgerBliss',
  activeUiStyle: 'BRUTALIST_MODERNIST',
  primaryColor: '#df6a00',
  secondaryColor: '#ac5200',
  backgroundColor: '#ffffff',
  accentColor: '#ff8313',
  surfaceColor: '#e6e6e6',
  accentLightColor: '#ff9e46',
  borderRadiusType: 'SHARP',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// MODIFIERS
const MODIFIER_PATTY_SIZE: Modifier = {
  id: 'mod-patty-size',
  name: 'Patty Size',
  maxSelection: 1,
  options: [
    { id: 'opt-single', name: 'Single Patty', price: 0 },
    { id: 'opt-double', name: 'Double Patty', price: 2.5 },
    { id: 'opt-triple', name: 'Triple Patty', price: 5.0 },
  ],
};

const MODIFIER_CHEESE: Modifier = {
  id: 'mod-cheese',
  name: 'Cheese',
  maxSelection: 3,
  options: [
    { id: 'opt-cheddar', name: 'Cheddar', price: 0.75 },
    { id: 'opt-swiss', name: 'Swiss', price: 1.0 },
    { id: 'opt-blue', name: 'Blue Cheese', price: 1.5 },
    { id: 'opt-none', name: 'No Cheese', price: 0 },
  ],
};

const MODIFIER_TOPPINGS: Modifier = {
  id: 'mod-toppings',
  name: 'Toppings',
  maxSelection: 10,
  options: [
    { id: 'opt-lettuce', name: 'Lettuce', price: 0.25 },
    { id: 'opt-tomato', name: 'Tomato', price: 0.25 },
    { id: 'opt-onion', name: 'Onion', price: 0.25 },
    { id: 'opt-pickle', name: 'Pickle', price: 0.25 },
    { id: 'opt-bacon', name: 'Bacon', price: 1.25 },
    { id: 'opt-avocado', name: 'Avocado', price: 1.5 },
    { id: 'opt-jalapeno', name: 'Jalapeño', price: 0.25 },
    { id: 'opt-mushroom', name: 'Mushroom', price: 0.5 },
  ],
};

// MENU ITEMS
const MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-classic-burger',
    restaurantId: 'tenant-burgerbliss',
    title: 'Classic Burger',
    description: 'Timeless American burger with flame-grilled patty, lettuce, tomato, and house sauce',
    basePrice: 9.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Classic+Burger',
    calories: 540,
    category: 'Burgers',
    modifiers: [MODIFIER_PATTY_SIZE, MODIFIER_CHEESE, MODIFIER_TOPPINGS],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-deluxe-burger',
    restaurantId: 'tenant-burgerbliss',
    title: 'Deluxe Burger',
    description: 'Premium burger with wagyu beef, caramelized onions, aged cheddar, and truffle aioli',
    basePrice: 14.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Deluxe+Burger',
    calories: 680,
    category: 'Burgers',
    modifiers: [MODIFIER_PATTY_SIZE, MODIFIER_CHEESE],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-spicy-burger',
    restaurantId: 'tenant-burgerbliss',
    title: 'Spicy Inferno Burger',
    description: 'Fiery burger with ghost pepper aioli, jalapeños, crispy onions, and hot sauce',
    basePrice: 11.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Spicy+Burger',
    calories: 620,
    category: 'Burgers',
    modifiers: [MODIFIER_PATTY_SIZE, MODIFIER_CHEESE],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-fries',
    restaurantId: 'tenant-burgerbliss',
    title: 'Hand-Cut Fries',
    description: 'Crispy hand-cut fries with sea salt',
    basePrice: 4.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Hand-Cut+Fries',
    calories: 380,
    category: 'Sides',
    modifiers: [],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-onion-rings',
    restaurantId: 'tenant-burgerbliss',
    title: 'Golden Onion Rings',
    description: 'Crispy beer-battered onion rings',
    basePrice: 5.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Onion+Rings',
    calories: 420,
    category: 'Sides',
    modifiers: [],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-cola',
    restaurantId: 'tenant-burgerbliss',
    title: 'Cold Cola',
    description: 'Refreshing cola drink',
    basePrice: 2.49,
    imageUrl: 'https://via.placeholder.com/300x200?text=Cola',
    calories: 140,
    category: 'Drinks',
    modifiers: [],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-milkshake',
    restaurantId: 'tenant-burgerbliss',
    title: 'Vanilla Milkshake',
    description: 'Creamy vanilla milkshake made with real ice cream',
    basePrice: 5.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Milkshake',
    calories: 450,
    category: 'Drinks',
    modifiers: [],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-brownie',
    restaurantId: 'tenant-burgerbliss',
    title: 'Fudge Brownie',
    description: 'Rich, fudgy brownie with dark chocolate',
    basePrice: 4.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Brownie',
    calories: 380,
    category: 'Desserts',
    modifiers: [],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// USER
const DEFAULT_USER: User = {
  id: 'user-123',
  email: 'customer@example.com',
  phoneNumber: '+14155555555',
  firstName: 'Alex',
  lastName: 'Johnson',
  profileImageUrl: 'https://via.placeholder.com/150?text=Avatar',
  addresses: [
    {
      id: 'addr-home',
      label: 'Home',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'addr-work',
      label: 'Work',
      street: '456 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'USA',
      latitude: 37.7942,
      longitude: -122.3989,
      isDefault: false,
      createdAt: '2024-01-02T00:00:00Z',
    },
  ],
  defaultAddressId: 'addr-home',
  loyaltyProfile: {
    tier: 'SILVER',
    pointsBalance: 250,
    lifetimePoints: 1250,
    createdAt: '2024-01-01T00:00:00Z',
  },
  preferredFulfillmentMode: 'DELIVERY',
  acceptsMarketing: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

class Store {
  private state: StoreState;

  constructor() {
    this.state = {
      currentTenant: BURGERBLISS_TENANT,
      currentUser: DEFAULT_USER,
      menuItems: MENU_ITEMS,
      cart: null,
      orders: [],
      notifications: [],
      reviews: [],
    };
  }

  // ---------- Getters ----------
  getState(): StoreState { return this.state; }
  getCurrentTenant(): RestaurantTenant { return this.state.currentTenant; }
  getCurrentUser(): User | null { return this.state.currentUser; }
  getMenuItems(): MenuItem[] { return this.state.menuItems; }
  getMenuItemsByCategory(category: MenuCategory): MenuItem[] {
    return this.state.menuItems.filter(item => item.category === category);
  }
  getMenuItemById(id: string): MenuItem | undefined {
    return this.state.menuItems.find(item => item.id === id);
  }
  getCart(): Cart | null { return this.state.cart; }
  getOrders(): Order[] { return this.state.orders; }
  getOrderById(id: string): Order | undefined {
    return this.state.orders.find(order => order.id === id);
  }
  getNotifications(): Notification[] { return this.state.notifications; }
  getReviews(): OrderReview[] { return this.state.reviews; }

  // ---------- Cart ----------
  initializeCart(userId: string, restaurantId: string): Cart {
    const cart: Cart = {
      id: `cart-${Date.now()}`,
      userId,
      restaurantId,
      items: [],
      subtotal: 0,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.cart = cart;
    return cart;
  }

  addToCart(
    menuItemId: string,
    quantity: number,
    modifierSelections: CartItemModifierSelection[] = [],
    specialInstructions: string = ''
  ): Cart {
    if (!this.state.cart) {
      if (this.state.currentUser) {
        this.initializeCart(this.state.currentUser.id, this.state.currentTenant.id);
      } else {
        throw new Error('No user or cart initialized');
      }
    }

    const menuItem = this.getMenuItemById(menuItemId);
    if (!menuItem) throw new Error(`Menu item ${menuItemId} not found`);

    const modifierPrice = modifierSelections.reduce((sum, selection) => {
      return sum + selection.selectedOptions.reduce((optSum, opt) => optSum + opt.price, 0);
    }, 0);

    const itemTotal = (menuItem.basePrice + modifierPrice) * quantity;

    const cartItem: CartItem = {
      id: `cart-item-${Date.now()}`,
      menuItemId,
      restaurantId: menuItem.restaurantId,
      quantity,
      basePrice: menuItem.basePrice,
      modifierSelections,
      specialInstructions,
      itemTotal,
    };

    this.state.cart!.items.push(cartItem);
    this.state.cart!.subtotal += itemTotal;
    this.state.cart!.itemCount += quantity;
    this.state.cart!.updatedAt = new Date().toISOString();

    return this.state.cart!;
  }

  removeFromCart(cartItemId: string): Cart {
    if (!this.state.cart) throw new Error('No cart initialized');
    const index = this.state.cart.items.findIndex(item => item.id === cartItemId);
    if (index === -1) throw new Error(`Cart item ${cartItemId} not found`);
    const removed = this.state.cart.items[index];
    this.state.cart.subtotal -= removed.itemTotal;
    this.state.cart.itemCount -= removed.quantity;
    this.state.cart.items.splice(index, 1);
    this.state.cart.updatedAt = new Date().toISOString();
    return this.state.cart;
  }

  updateCartItemQuantity(cartItemId: string, newQuantity: number): Cart {
    if (!this.state.cart) throw new Error('No cart initialized');
    const item = this.state.cart.items.find(i => i.id === cartItemId);
    if (!item) throw new Error(`Cart item ${cartItemId} not found`);
    const diff = newQuantity - item.quantity;
    item.quantity = newQuantity;
    item.itemTotal = item.basePrice * newQuantity;
    this.state.cart.subtotal += diff * item.basePrice;
    this.state.cart.itemCount += diff;
    this.state.cart.updatedAt = new Date().toISOString();
    return this.state.cart;
  }

  clearCart(): void { this.state.cart = null; }

  // ---------- Orders ----------
  createOrder(
    fulfillmentMode: FulfillmentMode,
    deliveryAddress?: string,
    pickupTime?: string,
    specialInstructions?: string
  ): Order {
    if (!this.state.cart || this.state.cart.items.length === 0) throw new Error('Cart is empty');
    if (!this.state.currentUser) throw new Error('No user logged in');

    const orderItems: OrderItem[] = this.state.cart.items.map(cartItem => {
      const menuItem = this.getMenuItemById(cartItem.menuItemId);
      return {
        id: `order-item-${Date.now()}`,
        menuItemId: cartItem.menuItemId,
        title: menuItem?.title || 'Unknown Item',
        quantity: cartItem.quantity,
        basePrice: cartItem.basePrice,
        modifierSelections: cartItem.modifierSelections,
        specialInstructions: cartItem.specialInstructions,
        itemTotal: cartItem.itemTotal,
      };
    });

    const subtotal = this.state.cart.subtotal;
    const taxes = parseFloat((subtotal * 0.08).toFixed(2));
    const deliveryFee = fulfillmentMode === 'DELIVERY' ? 4.99 : 0;
    const total = parseFloat((subtotal + taxes + deliveryFee).toFixed(2));

    const order: Order = {
      id: `order-${Date.now()}`,
      userId: this.state.currentUser.id,
      restaurantId: this.state.currentTenant.id,
      items: orderItems,
      fulfillmentMode,
      status: 'CONFIRMED',
      subtotal,
      taxes,
      deliveryFee,
      discountAmount: 0,
      total,
      estimatedDeliveryTime: fulfillmentMode === 'DELIVERY' ? 35 : 15,
      deliveryAddress,
      pickupTime,
      specialInstructions: specialInstructions || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.orders.push(order);
    this.clearCart();
    return order;
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus): Order {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    if (newStatus === 'DELIVERED' || newStatus === 'CANCELLED') {
      order.completedAt = new Date().toISOString();
    }
    return order;
  }

  // ---------- Tenant ----------
  setTenant(tenant: RestaurantTenant): void {
    this.state.currentTenant = tenant;
  }

  updateTenantStyle(uiStyle: UIStyleEngine): RestaurantTenant {
    this.state.currentTenant.activeUiStyle = uiStyle;
    this.state.currentTenant.updatedAt = new Date().toISOString();
    return this.state.currentTenant;
  }

  updateTenantColors(primary: string, secondary: string, background: string, accent: string): RestaurantTenant {
    this.state.currentTenant.primaryColor = primary;
    this.state.currentTenant.secondaryColor = secondary;
    this.state.currentTenant.backgroundColor = background;
    this.state.currentTenant.accentColor = accent;
    this.state.currentTenant.updatedAt = new Date().toISOString();
    return this.state.currentTenant;
  }

  // ========== NEW METHODS (for admin) ==========
  updateTenantLogo(logoUrl: string): RestaurantTenant {
    this.state.currentTenant.logoUrl = logoUrl;
    this.state.currentTenant.updatedAt = new Date().toISOString();
    return this.state.currentTenant;
  }

  updateTenantInfo(
    updates: Partial<Omit<RestaurantTenant, 'id' | 'createdAt' | 'updatedAt'>>
  ): RestaurantTenant {
    Object.assign(this.state.currentTenant, updates);
    this.state.currentTenant.updatedAt = new Date().toISOString();
    return this.state.currentTenant;
  }

  addMenuItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.menuItems.push(newItem);
    return newItem;
  }

  updateMenuItem(
    id: string,
    updates: Partial<Omit<MenuItem, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>>
  ): MenuItem {
    const item = this.state.menuItems.find(i => i.id === id);
    if (!item) throw new Error(`MenuItem ${id} not found`);
    Object.assign(item, updates);
    item.updatedAt = new Date().toISOString();
    return item;
  }

  deleteMenuItem(id: string): void {
    const index = this.state.menuItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`MenuItem ${id} not found`);
    this.state.menuItems.splice(index, 1);
  }

  importMenuItems(items: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[]): MenuItem[] {
    const newItems = items.map(item => ({
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    this.state.menuItems.push(...newItems);
    return newItems;
  }

  exportMenuItems() {
    return this.state.menuItems.map(item => {
      const { modifiers, ...rest } = item;
      return { ...rest, modifiers: JSON.stringify(modifiers) };
    });
  }

  // ---------- User & Loyalty ----------
  setUser(user: User): void { this.state.currentUser = user; }

  addLoyaltyPoints(points: number): void {
    if (this.state.currentUser) {
      this.state.currentUser.loyaltyProfile.pointsBalance += points;
      this.state.currentUser.loyaltyProfile.lifetimePoints += points;
      this.state.currentUser.updatedAt = new Date().toISOString();
    }
  }

  redeemLoyaltyPoints(points: number): boolean {
    if (!this.state.currentUser) return false;
    if (this.state.currentUser.loyaltyProfile.pointsBalance < points) return false;
    this.state.currentUser.loyaltyProfile.pointsBalance -= points;
    this.state.currentUser.loyaltyProfile.lastRewardRedeemedAt = new Date().toISOString();
    this.state.currentUser.updatedAt = new Date().toISOString();
    return true;
  }

  // ---------- Reviews & Notifications ----------
  submitOrderReview(review: Omit<OrderReview, 'id' | 'createdAt'>): OrderReview {
    const full: OrderReview = { ...review, id: `review-${Date.now()}`, createdAt: new Date().toISOString() };
    this.state.reviews.push(full);
    return full;
  }

  addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const full: Notification = { ...notification, id: `notif-${Date.now()}`, createdAt: new Date().toISOString() };
    this.state.notifications.push(full);
    return full;
  }

  markNotificationAsRead(notificationId: string): Notification {
    const n = this.state.notifications.find(n => n.id === notificationId);
    if (!n) throw new Error(`Notification ${notificationId} not found`);
    n.isRead = true;
    return n;
  }

  clearNotifications(): void { this.state.notifications = []; }
}

export const store = new Store();