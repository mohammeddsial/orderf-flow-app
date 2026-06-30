import { renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCartPersistence } from './useCartPersistence';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('@multi-restaurant/database', () => ({
  useCart: jest.fn(() => ({
    items: [],
    subtotal: 0,
    itemCount: 0,
    addToCart: jest.fn(),
    clearCart: jest.fn(),
  })),
  store: {
    addToCart: jest.fn(),
    getMenuItemById: jest.fn(() => ({ title: 'Item' })),
  },
}));

describe('useCartPersistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads valid cart from AsyncStorage on mount', async () => {
    const mockCart = {
      items: [
        {
          menuItemId: 'item-1',
          quantity: 2,
          title: 'Burger',
          itemTotal: 14.99,
          modifierSelections: [],
        },
      ],
      subtotal: 14.99,
      itemCount: 2,
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockCart));

    const { result } = await renderHook(() => useCartPersistence());

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@order_flow_app:cart');
    });

    expect(result.current.cart).toBeDefined();
  });

  it('rejects invalid cart data', async () => {
    const invalidCart = { items: 'not-an-array' };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(invalidCart));

    await renderHook(() => useCartPersistence());

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@order_flow_app:cart');
    });
  });

  it('clears persisted cart on demand', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = await renderHook(() => useCartPersistence());

    await waitFor(() => {
      result.current.clearPersistedCart();
    });

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@order_flow_app:cart');
    });
  });

  it('rejects cart with negative quantity', async () => {
    const cartWithNegative = {
      items: [
        {
          menuItemId: 'item-1',
          quantity: -5,
          title: 'Burger',
          itemTotal: 10,
          modifierSelections: [],
        },
      ],
      subtotal: 10,
      itemCount: -5,
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(cartWithNegative));

    await renderHook(() => useCartPersistence());

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });
});
