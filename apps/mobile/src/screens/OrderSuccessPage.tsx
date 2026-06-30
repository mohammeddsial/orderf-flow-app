import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useOrderById, useUpdateOrderStatus } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout, Card, Heading, BodyText, Button } from '../components/Layout';
import { Icon } from '../components/shared/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RootLevelHeader: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as any;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: tokens.colors.surface,
        borderBottomColor: tokens.colors.border,
        borderBottomWidth: tokens.borders.widthThin,
        paddingTop: insets.top + tokens.spacing.md,
        paddingBottom: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View />
      <Heading level={2} marginBottom={0}>
        Order Confirmed
      </Heading>
      <Pressable onPress={onDone}>
        <Text
          style={{
            fontSize: tokens.typography.fontSizeMd,
            fontWeight: '600',
            color: tokens.colors.primary,
          }}
        >
          Done
        </Text>
      </Pressable>
    </View>
  );
};

type OrderPhase = 'KITCHEN_ASSEMBLY' | 'COURIER_OUT_FOR_DELIVERY' | 'ARRIVED';

const getPhaseForTime = (etaMinutes: number, totalMinutes: number): OrderPhase => {
  const percentRemaining = (etaMinutes / totalMinutes) * 100;
  if (percentRemaining > 66) return 'KITCHEN_ASSEMBLY';
  if (percentRemaining > 33) return 'COURIER_OUT_FOR_DELIVERY';
  return 'ARRIVED';
};

const getPhaseLabel = (phase: OrderPhase): string => {
  switch (phase) {
    case 'KITCHEN_ASSEMBLY':
      return 'Kitchen Assembly';
    case 'COURIER_OUT_FOR_DELIVERY':
      return 'Courier Out for Delivery';
    case 'ARRIVED':
      return 'Arrived';
  }
};

export const OrderSuccessPage: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as any;
  const { orderId } = route.params;
  const order = useOrderById(orderId);
  const [expandedSummary, setExpandedSummary] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(order?.estimatedDeliveryTime || 35);
  const initialEtaRef = useRef(order?.estimatedDeliveryTime || 35);
  const [currentPhase, setCurrentPhase] = useState<OrderPhase>('KITCHEN_ASSEMBLY');

  useEffect(() => {
    initialEtaRef.current = order?.estimatedDeliveryTime || 35;
    setEtaMinutes(initialEtaRef.current);
    setCurrentPhase(getPhaseForTime(initialEtaRef.current, initialEtaRef.current));
  }, [order?.estimatedDeliveryTime, orderId]);

  useEffect(() => {
    setCurrentPhase(getPhaseForTime(etaMinutes, initialEtaRef.current));
  }, [etaMinutes]);

  useEffect(() => {
    const timer = setInterval(() => {
      setEtaMinutes(prev => Math.max(0, prev - 1));
    }, 60000);
    return () => clearInterval(timer);
  }, [orderId]);

  if (!order) {
    return <View style={{ flex: 1 }} />;
  }

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <>
      <RootLevelHeader onDone={handleDone} />
      <ScreenLayout scrollable paddingHorizontal={tokens.spacing.lg}>
        <View
          style={{
            backgroundColor: tokens.colors.success,
            borderRadius: tokens.borders.radiusLg,
            padding: tokens.spacing.xl,
            marginBottom: tokens.spacing.lg,
            alignItems: 'center',
          }}
        >
          <Icon name="celebration" size={60} color={tokens.colors.textInverse} />
          <Heading level={1} color={tokens.colors.textInverse} marginBottom={tokens.spacing.sm}>
            Order Confirmed!
          </Heading>
          <BodyText
            size="sm"
            color={tokens.colors.textInverse}
            marginBottom={tokens.spacing.md}
          >
            Order #{order.id.slice(-4)} • {order.status}
          </BodyText>
          <BodyText size="sm" color={tokens.colors.textInverse}>
            Thank you for your order
          </BodyText>
        </View>

        <View
          style={{
            height: 240,
            backgroundColor: tokens.colors.surfaceInverse,
            borderRadius: tokens.borders.radiusMd,
            marginBottom: tokens.spacing.lg,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 40, marginBottom: tokens.spacing.md }}>🗺️</Text>
          <BodyText color={tokens.colors.textInverse}>
            Live tracking will appear here
          </BodyText>
        </View>

        <Button
          label="Track Order"
          onPress={() => navigation.navigate('OrderTracking', { orderId })}
          size="lg"
        />

        <Card marginBottom={tokens.spacing.lg} shadow>
          <View style={{ alignItems: 'center', marginBottom: tokens.spacing.lg }}>
            <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.xs}>
              {getPhaseLabel(currentPhase)}
            </BodyText>
            <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.md}>
              Estimated Arrival
            </BodyText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: tokens.spacing.md,
              }}
            >
              <Text style={{ fontSize: 48, fontWeight: '700', color: tokens.colors.primary }}>
                {etaMinutes}
              </Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: tokens.colors.text }}>
                min
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 4,
              backgroundColor: tokens.colors.borderLight,
              borderRadius: tokens.borders.radiusPill,
              overflow: 'hidden',
              marginBottom: tokens.spacing.lg,
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${Math.max(10, (etaMinutes / initialEtaRef.current) * 100)}%`,
                backgroundColor: tokens.colors.success,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.xs}>
                Driver
              </BodyText>
              <Heading level={4}>{order.driverName || 'En route'}</Heading>
            </View>
            <Icon name="truck" size={32} color={tokens.colors.text} />
          </View>
        </Card>

        <Card marginBottom={tokens.spacing.lg}>
          <Pressable
            onPress={() => setExpandedSummary(!expandedSummary)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: expandedSummary ? tokens.spacing.md : 0,
              borderBottomColor: expandedSummary ? tokens.colors.border : 'transparent',
              borderBottomWidth: expandedSummary ? tokens.borders.widthThin: 0,
            }}
          >
            <Heading level={4}>Order Summary</Heading>
            <Text style={{ fontSize: 20, fontWeight: '700', color: tokens.colors.text }}>
              ▼
            </Text>
          </Pressable>

          {expandedSummary && (
            <View style={{ marginTop: tokens.spacing.md }}>
              {order.items.map((item) => (
                <View
                  key={`${item.menuItemId}-${item.quantity}`}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: tokens.spacing.sm,
                  }}
                >
                  <BodyText>
                    {item.quantity}x {item.title}
                  </BodyText>
                  <BodyText>${item.itemTotal.toFixed(2)}</BodyText>
                </View>
              ))}

              <View
                style={{
                  borderTopColor: tokens.colors.border,
                  borderTopWidth: tokens.borders.widthThin,
                  paddingTop: tokens.spacing.md,
                  marginTop: tokens.spacing.md,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: tokens.spacing.xs,
                  }}
                >
                  <BodyText size="sm">Subtotal</BodyText>
                  <BodyText size="sm">${order.subtotal.toFixed(2)}</BodyText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Heading level={4}>Total</Heading>
                  <Heading level={4}>${order.total.toFixed(2)}</Heading>
                </View>
              </View>
            </View>
          )}
        </Card>
      </ScreenLayout>
    </>
  );
};

export default OrderSuccessPage;
