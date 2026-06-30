import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { CheckoutPage } from './CheckoutPage';

jest.mock('../hooks/useCartPersistence', () => ({
  useCartPersistence: () => ({
    cart: {
      items: [
        {
          menuItemId: 'item-1',
          quantity: 1,
          title: 'Burger',
          itemTotal: 12.99,
          modifierSelections: [],
          specialInstructions: '',
        },
      ],
      subtotal: 12.99,
      itemCount: 1,
    },
    clearPersistedCart: jest.fn(),
  }),
}));

jest.mock('@multi-restaurant/database', () => ({
  useCart: jest.fn(() => null),
  useCreateOrder: jest.fn(() => ({
    createOrder: jest.fn(async () => ({ id: 'order-123' })),
    loading: false,
  })),
  useTenant: jest.fn(() => ({
    id: 'tenant-1',
    name: 'Test Restaurant',
    region: 'US',
    primaryColor: '#000000',
    secondaryColor: '#FF6B35',
    backgroundColor: '#FAFAFA',
    accentColor: '#FF6B35',
  })),
}));

jest.mock('../theme', () => ({
  useTheme: () => ({
    tokens: {
      colors: {
        primary: '#000000',
        surface: '#FFFFFF',
        text: '#000000',
        textDisabled: '#999999',
        border: '#CCCCCC',
        accentLight: '#FFB3A1',
        success: '#4CAF50',
        textInverse: '#FFFFFF',
        errorLight: '#EF5350',
        error: '#D32F2F',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 40,
        '3xl': 48,
        '4xl': 56,
      },
      typography: {
        fontSizeLg: 18,
        fontSizeMd: 16,
      },
      borders: { thin: 1, radiusMd: 8 },
    },
  }),
}));

describe('CheckoutPage', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  it('calculates US tax at 8%', async () => {
    const { getByText } = await render(
      <CheckoutPage navigation={mockNavigation} />
    );

    expect(getByText(/Tax \(8%\)/)).toBeTruthy();
  });

  it('calculates Canada tax at 13%', async () => {
    jest.clearAllMocks();
    const mockTenant = {
      id: 'tenant-1',
      name: 'Test Restaurant',
      region: 'CA',
      primaryColor: '#000000',
    };

    jest.mocked(require('@multi-restaurant/database').useTenant).mockReturnValue(mockTenant);

    const { getByText } = await render(
      <CheckoutPage navigation={mockNavigation} />
    );

    expect(getByText(/Tax \(13%\)/)).toBeTruthy();
  });

  it('shows order error on failure', async () => {
    const mockCreateOrder = jest.fn().mockRejectedValue(new Error('Payment failed'));

    jest.mocked(require('@multi-restaurant/database').useCreateOrder).mockReturnValue({
      createOrder: mockCreateOrder,
      loading: false,
    });

    const { findByText, findByLabelText } = await render(
      <CheckoutPage navigation={mockNavigation} />
    );

    const interacOption = await findByLabelText('Interac');
    fireEvent.press(interacOption);

    const placeOrderButton = await findByText(/Place Order/);
    fireEvent.press(placeOrderButton);

    const errorElement = await findByText('Payment failed');
    expect(errorElement).toBeTruthy();
  });

  it('throws error if card method selected without token', async () => {
    const mockCreateOrder = jest.fn();
    jest.mocked(require('@multi-restaurant/database').useCreateOrder).mockReturnValue({
      createOrder: mockCreateOrder,
      loading: false,
    });

    const { findByText } = await render(
      <CheckoutPage navigation={mockNavigation} />
    );

    const placeOrderButton = await findByText(/Place Order/);
    fireEvent.press(placeOrderButton);

    const errorElement = await findByText(/Payment token required/);
    expect(errorElement).toBeTruthy();
  });
});
