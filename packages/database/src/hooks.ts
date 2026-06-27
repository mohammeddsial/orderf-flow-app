import { useState, useCallback, useEffect } from 'react';
import { store } from './store';
import {
  Cart,
  CartItemModifierSelection,
  MenuItem,
  Order,
  OrderReview,
  RestaurantTenant,
  User,
  UIStyleEngine,
  FulfillmentMode,
  OrderStatus,
  MenuCategory,
  Notification,
} from './types';

export const useTenant = (): RestaurantTenant => {
  const [tenant, setTenant] = useState<RestaurantTenant>(store.getCurrentTenant());

  const updateTenantStyle = useCallback((style: UIStyleEngine) => {
    store.updateTenantStyle(style);
    setTenant(store.getCurrentTenant());
  }, []);

  const updateTenantColors = useCallback(
    (primary: string, secondary: string, background: string, accent: string) => {
      store.updateTenantColors(primary, secondary, background, accent);
      setTenant(store.getCurrentTenant());
    },
    []
  );

  return tenant;
};

export const useCurrentUser = (): User | null => {
  const [user, setUser] = useState<User | null>(store.getCurrentUser());

  const updateUser = useCallback((newUser: User) => {
    store.setUser(newUser);
    setUser(newUser);
  }, []);

  const addLoyaltyPoints = useCallback((points: number) => {
    store.addLoyaltyPoints(points);
    setUser(store.getCurrentUser());
  }, []);

  const redeemLoyaltyPoints = useCallback((points: number) => {
    const success = store.redeemLoyaltyPoints(points);
    if (success) {
      setUser(store.getCurrentUser());
    }
    return success;
  }, []);

  return user;
};

export const useMenuItems = (): MenuItem[] => {
  const [items, setItems] = useState<MenuItem[]>(store.getMenuItems());

  useEffect(() => {
    setItems(store.getMenuItems());
  }, []);

  return items;
};

export const useMenuItemsByCategory = (category: MenuCategory): MenuItem[] => {
  const [items, setItems] = useState<MenuItem[]>(store.getMenuItemsByCategory(category));

  useEffect(() => {
    setItems(store.getMenuItemsByCategory(category));
  }, [category]);

  return items;
};

export const useMenuItemById = (id: string): MenuItem | undefined => {
  const [item, setItem] = useState<MenuItem | undefined>(store.getMenuItemById(id));

  useEffect(() => {
    setItem(store.getMenuItemById(id));
  }, [id]);

  return item;
};

export const useCart = (): Cart | null => {
  const [cart, setCart] = useState<Cart | null>(store.getCart());

  const addToCart = useCallback(
    (
      menuItemId: string,
      quantity: number,
      modifierSelections?: CartItemModifierSelection[],
      specialInstructions?: string
    ) => {
      try {
        const updatedCart = store.addToCart(menuItemId, quantity, modifierSelections, specialInstructions);
        setCart(updatedCart);
        return updatedCart;
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
    },
    []
  );

  const removeFromCart = useCallback((cartItemId: string) => {
    try {
      const updatedCart = store.removeFromCart(cartItemId);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }, []);

  const updateCartItemQuantity = useCallback((cartItemId: string, newQuantity: number) => {
    try {
      const updatedCart = store.updateCartItemQuantity(cartItemId, newQuantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  }, []);

  const clearCart = useCallback(() => {
    store.clearCart();
    setCart(null);
  }, []);

  return cart;
};

export const useCartState = () => {
  const cart = useCart();
  const [cartState, setCartState] = useState<Cart | null>(cart);

  useEffect(() => {
    setCartState(cart);
  }, [cart]);

  return {
    cart: cartState,
    itemCount: cartState?.itemCount ?? 0,
    subtotal: cartState?.subtotal ?? 0,
    isEmpty: !cartState || cartState.items.length === 0,
  };
};

export const useOrders = (): Order[] => {
  const [orders, setOrders] = useState<Order[]>(store.getOrders());

  useEffect(() => {
    setOrders(store.getOrders());
  }, []);

  return orders;
};

export const useOrderById = (id: string): Order | undefined => {
  const [order, setOrder] = useState<Order | undefined>(store.getOrderById(id));

  useEffect(() => {
    setOrder(store.getOrderById(id));
  }, [id]);

  return order;
};

export const useCreateOrder = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(
    async (
      fulfillmentMode: FulfillmentMode,
      deliveryAddress?: string,
      pickupTime?: string,
      specialInstructions?: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        const newOrder = store.createOrder(fulfillmentMode, deliveryAddress, pickupTime, specialInstructions);
        setOrder(newOrder);
        return newOrder;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { order, loading, error, createOrder };
};

export const useUpdateOrderStatus = () => {
  const updateStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = store.updateOrderStatus(orderId, newStatus);
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }, []);

  return updateStatus;
};

export const useReviews = (): OrderReview[] => {
  const [reviews, setReviews] = useState<OrderReview[]>(store.getReviews());

  useEffect(() => {
    setReviews(store.getReviews());
  }, []);

  return reviews;
};

export const useSubmitReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = useCallback(async (review: Omit<OrderReview, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const submittedReview = store.submitOrderReview(review);
      return submittedReview;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit review';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, submitReview };
};

export const useNotifications = (): Notification[] => {
  const [notifications, setNotifications] = useState<Notification[]>(store.getNotifications());

  useEffect(() => {
    setNotifications(store.getNotifications());
  }, []);

  return notifications;
};

export const useNotificationActions = () => {
  const markAsRead = useCallback((notificationId: string) => {
    try {
      store.markNotificationAsRead(notificationId);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }, []);

  const clearAll = useCallback(() => {
    store.clearNotifications();
  }, []);

  return { markAsRead, clearAll };
};

export const useThemeTokens = () => {
  const tenant = useTenant();

  const tokens = {
    primary: tenant.primaryColor,
    secondary: tenant.secondaryColor,
    background: tenant.backgroundColor,
    accent: tenant.accentColor,
    borderRadiusType: tenant.borderRadiusType,
    style: tenant.activeUiStyle,
  };

  return tokens;
};

export const useSwitchUIStyle = () => {
  const [style, setStyle] = useState<UIStyleEngine>(store.getCurrentTenant().activeUiStyle);

  const switchStyle = useCallback((newStyle: UIStyleEngine) => {
    const updated = store.updateTenantStyle(newStyle);
    setStyle(updated.activeUiStyle);
  }, []);

  return { currentStyle: style, switchStyle };
};
