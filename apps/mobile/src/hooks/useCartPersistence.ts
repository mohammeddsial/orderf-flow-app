import { useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart as useCartState, store } from '@multi-restaurant/database';
import type { Cart } from '@multi-restaurant/database';

const CART_STORAGE_KEY = '@order_flow_app:cart';

function validateCartItem(item: unknown): boolean {
  if (!item || typeof item !== 'object') return false;

  const obj = item as Record<string, unknown>;
  const hasRequiredFields =
    typeof obj.menuItemId === 'string' &&
    typeof obj.quantity === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.itemTotal === 'number';

  const quantityValid = (obj.quantity as number) > 0 && (obj.quantity as number) <= 999;
  const totalValid = (obj.itemTotal as number) >= 0;

  return hasRequiredFields && quantityValid && totalValid;
}

function validateCart(cart: unknown): boolean {
  if (!cart || typeof cart !== 'object') return false;

  const obj = cart as Record<string, unknown>;
  const hasRequiredFields =
    typeof obj.subtotal === 'number' &&
    typeof obj.itemCount === 'number' &&
    Array.isArray(obj.items);

  const subtotalValid = (obj.subtotal as number) >= 0;
  const itemCountValid = (obj.itemCount as number) >= 0;
  const itemsValid = Array.isArray(obj.items) &&
    (obj.items as unknown[]).length <= 500 &&
    obj.items.every(validateCartItem);

  return hasRequiredFields && subtotalValid && itemCountValid && itemsValid;
}

export function useCartPersistence() {
  const cart = useCartState();
  const isInitializedRef = useRef(false);

  const loadCartFromStorage = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (!validateCart(parsedCart)) {
          console.warn('Stored cart failed validation, discarding');
          isInitializedRef.current = true;
          return;
        }

        const validatedCart = parsedCart as Cart;
        if (validatedCart.items && validatedCart.items.length > 0) {
          for (const item of validatedCart.items) {
            const modifiers = item.modifierSelections || undefined;
            const instructions = item.specialInstructions || undefined;
            store.addToCart(
              item.menuItemId,
              item.quantity,
              modifiers,
              instructions
            );
          }
        }
      }
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to load cart from AsyncStorage:', error);
      isInitializedRef.current = true;
    }
  }, []);

  const persistCartToStorage = useCallback(async () => {
    if (!cart || !isInitializedRef.current) return;

    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to persist cart to AsyncStorage:', error);
    }
  }, [cart]);

  useEffect(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);

  useEffect(() => {
    persistCartToStorage();
  }, [cart, persistCartToStorage]);

  const clearPersistedCart = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear persisted cart:', error);
    }
  }, []);

  return {
    cart,
    clearPersistedCart,
  };
}
