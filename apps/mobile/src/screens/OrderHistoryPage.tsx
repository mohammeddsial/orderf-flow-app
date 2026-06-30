import React from 'react';
import { View, Pressable } from 'react-native';
import { useOrders } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout, Card, Heading, BodyText, SolidHeader } from '../components/Layout';
import { Icon } from '../components/shared/Icon';
import { type EngineId } from '../components/home/engineStyle';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending', CONFIRMED: 'Confirmed', PREPARING: 'Preparing',
  READY: 'Ready', OUT_FOR_DELIVERY: 'Out for Delivery', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
};

const OrderHistoryPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens, engineStyle } = useTheme();
  const orders = useOrders();

  return (
    <>
      <SolidHeader title="Order History" onBackPress={() => navigation.goBack()} />
      <ScreenLayout scrollable>
        {orders.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: tokens.spacing.xl }}>
            <Icon name="orders" size={48} color={tokens.colors.textDisabled} />
            <Heading level={3} marginBottom={tokens.spacing.xs}>No orders yet</Heading>
            <BodyText color={tokens.colors.textDisabled}>Your order history will appear here</BodyText>
          </View>
        ) : (
          <View style={{ gap: tokens.spacing.sm }}>
            {orders.map((order) => (
              <Pressable
                key={order.id}
                onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
                style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.surface, borderRadius: tokens.borders.radiusMd, borderWidth: tokens.borders.widthThin, borderColor: tokens.colors.borderLight }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: tokens.spacing.xs }}>
                  <Heading level={4}>#{order.id.slice(-6)}</Heading>
                  <BodyText size="sm" color={order.status === 'DELIVERED' ? tokens.colors.success : tokens.colors.accent}>{STATUS_LABELS[order.status] || order.status}</BodyText>
                </View>
                <BodyText size="sm" color={tokens.colors.textDisabled} numberOfLines={1}>
                  {order.items.map((i) => i.title).join(', ')}
                </BodyText>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: tokens.spacing.xs }}>
                  <BodyText size="sm" color={tokens.colors.textDisabled}>{order.items.length} items</BodyText>
                  <BodyText size="sm">${order.total.toFixed(2)}</BodyText>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScreenLayout>
    </>
  );
};

export default OrderHistoryPage;
