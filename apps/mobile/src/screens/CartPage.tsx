import React, { useReducer, useState } from 'react';
import { View, ScrollView, Text, Pressable, TextInput } from 'react-native';
import { store } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout, SolidHeader, Heading, BodyText, Button } from '../components/Layout';
import { EngineId, cardChrome, sectionTitleStyle, pillChrome } from '../components/home';
import { Icon } from '../components/shared/Icon';

export const CartPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  const [, bump] = useReducer((n: number) => n + 1, 0);
  const [fulfillment, setFulfillment] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [specialRequests, setSpecialRequests] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const cart = store.getCart();
  const user = store.getCurrentUser();
  const radius = engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusMd;

  const titleFor = (menuItemId: string) => store.getMenuItemById(menuItemId)?.title ?? menuItemId;

  const setQty = (id: string, qty: number) => {
    try {
      if (qty <= 0) store.removeFromCart(id);
      else store.updateCartItemQuantity(id, qty);
    } catch {
      /* no-op */
    }
    bump();
  };

  const removeItem = (id: string) => {
    try {
      store.removeFromCart(id);
    } catch {
      /* no-op */
    }
    bump();
  };

  const applyCoupon = () => {
    if (cart && couponCode.trim().toUpperCase() === 'SAVE20') {
      setAppliedDiscount(Math.round(cart.subtotal * 0.2 * 100) / 100);
    }
  };

  // ---- Empty state -------------------------------------------------------
  if (!cart || cart.items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.colors.background }}>
        <SolidHeader title="Your Cart" onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: tokens.spacing.xl }}>
          <Icon name="cart" size={56} color={tokens.colors.textDisabled} />
          <Heading level={2} marginBottom={tokens.spacing.sm}>
            Your cart is empty
          </Heading>
          <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.lg}>
            Add something delicious to get started.
          </BodyText>
          <Button label="Browse the menu" onPress={() => navigation.navigate('Menu')} />
        </View>
      </View>
    );
  }

  const subtotal = cart.subtotal;
  const discounted = Math.max(0, subtotal - appliedDiscount);
  const taxes = Math.round(discounted * 0.08 * 100) / 100;
  const deliveryFee = fulfillment === 'DELIVERY' ? 4.99 : 0;
  const total = Math.round((discounted + taxes + deliveryFee) * 100) / 100;
  const pointsToEarn = Math.floor(discounted);
  const points = user?.loyaltyProfile.pointsBalance ?? 0;
  const progress = Math.min(1, points / 1000);

  const SectionTitle = ({ children }: { children: string }) => (
    <Text style={[sectionTitleStyle(tokens, engine), { fontSize: tokens.typography.fontSizeLg, marginBottom: tokens.spacing.md }]}>
      {children}
    </Text>
  );

  const Fulfillment = (mode: 'DELIVERY' | 'PICKUP', label: string) => {
    const active = fulfillment === mode;
    return (
      <Pressable
        onPress={() => setFulfillment(mode)}
        style={{ flex: 1, alignItems: 'center', paddingVertical: tokens.spacing.sm, ...pillChrome(tokens, engine, active) }}
      >
        <Text style={{ fontWeight: '700', color: active ? tokens.colors.textInverse : tokens.colors.text }}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <SolidHeader title="Your Cart" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: tokens.spacing.md, paddingBottom: 150 }}
      >
        {/* Fulfillment validation ribbon */}
        <View style={{ flexDirection: 'row', gap: tokens.spacing.sm, marginBottom: tokens.spacing.lg }}>
          {Fulfillment('DELIVERY', 'Delivery')}
          {Fulfillment('PICKUP', 'Pickup')}
        </View>

        {/* Itemized manifest */}
        <SectionTitle>Your items</SectionTitle>
        {cart.items.map((item) => (
          <View key={item.id} style={{ padding: tokens.spacing.md, marginBottom: tokens.spacing.md, ...cardChrome(tokens, engine) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, paddingRight: tokens.spacing.sm }}>
                <Heading level={4}>{titleFor(item.menuItemId)}</Heading>
                {item.specialInstructions ? (
                  <BodyText size="sm" color={tokens.colors.accent}>Note: {item.specialInstructions}</BodyText>
                ) : null}
              </View>
              <Heading level={4}>${item.itemTotal.toFixed(2)}</Heading>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: tokens.spacing.md }}>
              {/* Qty stepper */}
              <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: tokens.borders.widthThin, borderColor: tokens.colors.border, borderRadius: radius }}>
                <Pressable onPress={() => setQty(item.id, item.quantity - 1)} style={{ paddingVertical: 6, paddingHorizontal: tokens.spacing.md }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: tokens.colors.text }}>−</Text>
                </Pressable>
                <Text style={{ minWidth: 24, textAlign: 'center', fontWeight: '700', color: tokens.colors.text }}>{item.quantity}</Text>
                <Pressable onPress={() => setQty(item.id, item.quantity + 1)} style={{ paddingVertical: 6, paddingHorizontal: tokens.spacing.md }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: tokens.colors.text }}>+</Text>
                </Pressable>
              </View>
              <Pressable onPress={() => removeItem(item.id)} hitSlop={8}>
                <Text style={{ color: tokens.colors.error, fontWeight: '700', fontSize: tokens.typography.fontSizeSm }}>Remove</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {/* Kitchen special request */}
        <SectionTitle>Special requests</SectionTitle>
        <TextInput
          placeholder="Tell the kitchen anything (allergies, no onions…)"
          placeholderTextColor={tokens.colors.textDisabled}
          value={specialRequests}
          onChangeText={setSpecialRequests}
          multiline
          style={{
            minHeight: 80,
            textAlignVertical: 'top',
            padding: tokens.spacing.md,
            marginBottom: tokens.spacing.lg,
            color: tokens.colors.text,
            ...cardChrome(tokens, engine),
          }}
        />

        {/* Coupon & rewards input */}
        <SectionTitle>Coupon &amp; rewards</SectionTitle>
        <View style={{ flexDirection: 'row', gap: tokens.spacing.sm, marginBottom: appliedDiscount > 0 ? tokens.spacing.sm : tokens.spacing.lg }}>
          <TextInput
            placeholder="Promo code (try SAVE20)"
            placeholderTextColor={tokens.colors.textDisabled}
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
            style={{ flex: 1, padding: tokens.spacing.md, color: tokens.colors.text, ...cardChrome(tokens, engine) }}
          />
          <Button label="Apply" onPress={applyCoupon} />
        </View>
        {appliedDiscount > 0 ? (
          <BodyText size="sm" color={tokens.colors.success} marginBottom={tokens.spacing.lg}>
            ✓ Coupon applied — you saved ${appliedDiscount.toFixed(2)}
          </BodyText>
        ) : null}

        {/* Rewards progress tracker (optional) */}
        <View style={{ padding: tokens.spacing.md, marginBottom: tokens.spacing.lg, ...cardChrome(tokens, engine) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: tokens.spacing.sm }}>
            <BodyText size="sm" color={tokens.colors.text}>Rewards • {points} pts</BodyText>
            <BodyText size="sm" color={tokens.colors.accent}>+{pointsToEarn} pts this order</BodyText>
          </View>
          <View style={{ height: 7, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 4, backgroundColor: tokens.colors.borderLight, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${Math.round(progress * 100)}%`, backgroundColor: tokens.colors.accent }} />
          </View>
        </View>

        {/* Financial ledger */}
        <View style={{ padding: tokens.spacing.lg, ...cardChrome(tokens, engine) }}>
          {[
            ['Subtotal', `$${subtotal.toFixed(2)}`, false],
            ...(appliedDiscount > 0 ? [['Discount', `-$${appliedDiscount.toFixed(2)}`, true] as const] : []),
            ['Tax (8%)', `$${taxes.toFixed(2)}`, false],
            [fulfillment === 'DELIVERY' ? 'Delivery fee' : 'Pickup', fulfillment === 'DELIVERY' ? `$${deliveryFee.toFixed(2)}` : 'Free', false],
          ].map(([label, value, isDiscount]) => (
            <View key={label as string} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: tokens.spacing.sm }}>
              <BodyText size="sm" color={isDiscount ? tokens.colors.success : tokens.colors.textDisabled}>{label as string}</BodyText>
              <BodyText size="sm" color={isDiscount ? tokens.colors.success : tokens.colors.text}>{value as string}</BodyText>
            </View>
          ))}
          <View style={{ height: tokens.borders.widthThin, backgroundColor: tokens.colors.border, marginVertical: tokens.spacing.sm }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Heading level={3}>Total</Heading>
            <Heading level={3}>${total.toFixed(2)}</Heading>
          </View>
        </View>
      </ScrollView>

      {/* Proceed to checkout tray */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: tokens.spacing.md,
          paddingBottom: tokens.spacing.lg,
          backgroundColor: tokens.colors.surface,
          borderTopColor: tokens.colors.border,
          borderTopWidth: tokens.borders.widthThin,
        }}
      >
        <Pressable
          onPress={() => navigation.navigate('DeliveryConfig', { fulfillment })}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: tokens.spacing.md,
            paddingHorizontal: tokens.spacing.lg,
            backgroundColor: tokens.colors.primary,
            borderRadius: radius,
          }}
        >
          <Text style={{ color: tokens.colors.textInverse, fontWeight: '800', fontSize: tokens.typography.fontSizeMd }}>
            Proceed to Checkout
          </Text>
          <Text style={{ color: tokens.colors.textInverse, fontWeight: '800', fontSize: tokens.typography.fontSizeMd }}>
            ${total.toFixed(2)} →
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CartPage;
