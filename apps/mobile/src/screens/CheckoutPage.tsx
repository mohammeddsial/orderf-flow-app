import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, TextInput } from 'react-native';
import { useCart, useCreateOrder, useTenant } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { useCartPersistence } from '../hooks/useCartPersistence';
import {
  ScreenLayout,
  Card,
  Heading,
  BodyText,
  Button,
} from '../components/Layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SecureCheckoutHeaderProps {
  onBackPress: () => void;
}

const SecureCheckoutHeader: React.FC<SecureCheckoutHeaderProps> = ({ onBackPress }) => {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: tokens.colors.surface,
        borderBottomColor: tokens.colors.border,
        borderBottomWidth: tokens.borders.thin,
        paddingTop: insets.top + tokens.spacing.md,
        paddingBottom: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Pressable
        onPress={onBackPress}
        style={{
          paddingHorizontal: tokens.spacing.sm,
          paddingVertical: tokens.spacing.sm,
        }}
      >
        <Text
          style={{
            fontSize: tokens.typography.fontSizeLg,
            fontWeight: '600',
            color: tokens.colors.text,
          }}
        >
          ←
        </Text>
      </Pressable>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, marginRight: tokens.spacing.sm }}>🔒</Text>
        <Heading level={3} marginBottom={0}>
          Secure Checkout
        </Heading>
      </View>

      <View style={{ width: 40 }} />
    </View>
  );
};

export const CheckoutPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens } = useTheme();
  const tenant = useTenant();
  const { cart, clearPersistedCart } = useCartPersistence();
  const { createOrder, loading } = useCreateOrder();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [orderError, setOrderError] = useState<string | null>(null);

  if (!cart) {
    return (
      <>
        <SecureCheckoutHeader onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Heading level={2}>No cart available</Heading>
        </View>
      </>
    );
  }

  const calculateRegionalTax = (subtotal: number): number => {
    const region = tenant.region || 'US';
    const taxRate = region === 'CA' ? 0.13 : region === 'UK' ? 0.20 : 0.08;
    return Math.floor(subtotal * taxRate * 100) / 100;
  };

  const handlePlaceOrder = async () => {
    if (!cart) return;

    try {
      const taxes = calculateRegionalTax(cart.subtotal);
      const deliveryFee = 4.99;
      const orderTotal = cart.subtotal + taxes + deliveryFee + tipAmount;

      if (!paymentToken && paymentMethod === 'card') {
        throw new Error('Payment token required for card transactions');
      }

      const orderPayload = {
        items: cart.items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          title: item.title,
          itemTotal: item.itemTotal,
          modifierSelections: item.modifierSelections || [],
          specialInstructions: item.specialInstructions,
        })),
        subtotal: cart.subtotal,
        tax: taxes,
        deliveryFee,
        tip: tipAmount,
        tenantId: tenant.id,
        tenantName: tenant.name,
        paymentMethod,
        paymentToken,
        cardholderName,
        estimatedDeliveryTime: 35,
      };

      setOrderError(null);
      const order = await createOrder('DELIVERY', undefined, undefined, JSON.stringify(orderPayload));
      if (order) {
        await clearPersistedCart();
        navigation.navigate('OrderSuccess', { orderId: order.id });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Order failed. Please try again.';
      setOrderError(message);
      console.error('Checkout error:', error);
    }
  };

  const taxes = calculateRegionalTax(cart.subtotal);
  const deliveryFee = 4.99;
  const total = cart.subtotal + taxes + deliveryFee + tipAmount;
  const region = tenant.region || 'US';
  const taxRate = region === 'CA' ? 13 : region === 'UK' ? 20 : 8;

  const paymentMethods = [
    { id: 'apple-pay', label: 'Apple Pay', icon: '🍎' },
    { id: 'google-pay', label: 'Google Pay', icon: '🔵' },
    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'interac', label: 'Interac', icon: '🏦' },
  ];

  return (
    <>
      <SecureCheckoutHeader onBackPress={() => navigation.goBack()} />
      <ScreenLayout scrollable paddingHorizontal={tokens.spacing.md}>
        <Card
          backgroundColor={tokens.colors.success}
          marginBottom={tokens.spacing.lg}
          padding={tokens.spacing.md}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginRight: tokens.spacing.sm }}>✓</Text>
            <View>
              <BodyText size="sm" color={tokens.colors.textInverse} marginBottom={tokens.spacing.xs}>
                SSL Encrypted Connection
              </BodyText>
              <BodyText size="sm" color={tokens.colors.textInverse}>
                Your payment information is secure
              </BodyText>
            </View>
          </View>
        </Card>

        <View style={{ marginBottom: tokens.spacing.lg }}>
          <Heading level={3} marginBottom={tokens.spacing.md}>
            Payment Method
          </Heading>
          <View style={{ gap: tokens.spacing.sm }}>
            {paymentMethods.map(method => (
              <Pressable
                key={method.id}
                onPress={() => setPaymentMethod(method.id)}
                accessibilityLabel={method.label}
                style={{
                  padding: tokens.spacing.md,
                  borderColor:
                    paymentMethod === method.id
                      ? tokens.colors.primary
                      : tokens.colors.border,
                  borderWidth: tokens.borders.thin,
                  borderRadius: tokens.borders.radiusMd,
                  backgroundColor:
                    paymentMethod === method.id
                      ? tokens.colors.accentLight
                      : tokens.colors.surface,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 20, marginRight: tokens.spacing.md }}>
                  {method.icon}
                </Text>
                <BodyText
                  color={
                    paymentMethod === method.id
                      ? tokens.colors.primary
                      : tokens.colors.text
                  }
                >
                  {method.label}
                </BodyText>
              </Pressable>
            ))}
          </View>
        </View>

        {paymentMethod === 'card' && (
          <View style={{ marginBottom: tokens.spacing.lg }}>
            <Heading level={3} marginBottom={tokens.spacing.md}>
              Card Details
            </Heading>

            <TextInput
              placeholder="Cardholder Name"
              placeholderTextColor={tokens.colors.textDisabled}
              value={cardholderName}
              onChangeText={setCardholderName}
              style={{
                borderColor: tokens.colors.border,
                borderWidth: tokens.borders.thin,
                borderRadius: tokens.borders.radiusMd,
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.md,
                fontSize: tokens.typography.fontSizeMd,
                color: tokens.colors.text,
                marginBottom: tokens.spacing.md,
              }}
            />

            <Card backgroundColor={tokens.colors.accentLight} marginBottom={tokens.spacing.md}>
              <BodyText size="sm" color={tokens.colors.text}>
                Card tokenization via Stripe/Apple Pay/Google Pay SDK would be integrated here. Token is sent to backend, never raw card data.
              </BodyText>
            </Card>
          </View>
        )}

        <View style={{ marginBottom: tokens.spacing.lg }}>
          <Heading level={3} marginBottom={tokens.spacing.md}>
            Tip Your Driver
          </Heading>
          <View style={{ flexDirection: 'row', gap: tokens.spacing.sm }}>
            {[0, 2, 5, 10].map(amount => (
              <Pressable
                key={amount}
                onPress={() => setTipAmount(amount)}
                style={{
                  flex: 1,
                  paddingVertical: tokens.spacing.md,
                  backgroundColor:
                    tipAmount === amount
                      ? tokens.colors.primary
                      : tokens.colors.surface,
                  borderColor: tokens.colors.border,
                  borderWidth: tokens.borders.thin,
                  borderRadius: tokens.borders.radiusMd,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: tokens.typography.fontSizeMd,
                    fontWeight: '600',
                    color:
                      tipAmount === amount
                        ? tokens.colors.textInverse
                        : tokens.colors.text,
                  }}
                >
                  {amount === 0 ? 'No tip' : `$${amount}`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Card marginBottom={tokens.spacing.lg}>
          <View
            style={{
              borderBottomColor: tokens.colors.border,
              borderBottomWidth: tokens.borders.thin,
              paddingBottom: tokens.spacing.md,
              marginBottom: tokens.spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: tokens.spacing.sm,
              }}
            >
              <BodyText>Subtotal</BodyText>
              <BodyText>${cart.subtotal.toFixed(2)}</BodyText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: tokens.spacing.sm,
              }}
            >
              <BodyText>Tax ({taxRate}%)</BodyText>
              <BodyText>${taxes.toFixed(2)}</BodyText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: tokens.spacing.sm,
              }}
            >
              <BodyText>Delivery</BodyText>
              <BodyText>$4.99</BodyText>
            </View>
            {tipAmount > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: tokens.spacing.sm,
                }}
              >
                <BodyText>Tip</BodyText>
                <BodyText>${tipAmount.toFixed(2)}</BodyText>
              </View>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Heading level={2}>Total</Heading>
            <Heading level={2}>${total.toFixed(2)}</Heading>
          </View>
        </Card>

        {orderError && (
          <Card
            backgroundColor={tokens.colors.errorLight}
            marginBottom={tokens.spacing.md}
            padding={tokens.spacing.md}
          >
            <BodyText size="sm" color={tokens.colors.error}>
              {orderError}
            </BodyText>
          </Card>
        )}

        <Button
          label={`🔒 Place Order • $${total.toFixed(2)}`}
          onPress={handlePlaceOrder}
          disabled={loading}
          size="lg"
        />

        <BodyText
          size="sm"
          color={tokens.colors.textDisabled}
          marginBottom={tokens.spacing.lg}
        >
          By placing this order, you agree to our Terms of Service. Your payment is processed securely.
        </BodyText>
      </ScreenLayout>
    </>
  );
};

export default CheckoutPage;
