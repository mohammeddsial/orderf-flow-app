import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useOrderById } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout, Card, Heading, BodyText } from '../components/Layout';
import { Icon } from '../components/shared/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: string;
  done: boolean;
  active: boolean;
}

const STATUS_FLOW: OrderStatus[] = ['CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const TIMELINE_CONFIG: Record<string, { label: string; icon: string }> = {
  CONFIRMED: { label: 'Order Confirmed', icon: 'receipt' },
  PREPARING: { label: 'Preparing', icon: 'cook' },
  READY: { label: 'Ready', icon: 'checkmark-circle' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: 'bicycle' },
  DELIVERED: { label: 'Delivered', icon: 'home' },
};

const getStatusIndex = (status: OrderStatus): number => STATUS_FLOW.indexOf(status);

const buildTimeline = (status: OrderStatus): TimelineStep[] =>
  STATUS_FLOW.map((s) => {
    const idx = getStatusIndex(s);
    const currentIdx = getStatusIndex(status);
    return {
      status: s,
      label: TIMELINE_CONFIG[s]?.label ?? s,
      icon: TIMELINE_CONFIG[s]?.icon ?? 'ellipse',
      done: currentIdx > idx,
      active: currentIdx === idx,
    };
  });

const formatPhone = (phone?: string): string =>
  phone ? `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}` : '';

const ETA_PHASES = [
  { label: 'Kitchen Assembly', statuses: ['CONFIRMED', 'PREPARING'] },
  { label: 'Courier Out for Delivery', statuses: ['READY', 'OUT_FOR_DELIVERY'] },
  { label: 'Arrived', statuses: ['DELIVERED'] },
];

const getPhaseLabel = (status: OrderStatus): string => {
  const phase = ETA_PHASES.find((p) => p.statuses.includes(status));
  return phase?.label ?? status;
};

const OrderTrackingPage: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { tokens, engineStyle } = useTheme();
  const insets = useSafeAreaInsets();
  const { orderId } = route.params;
  const order = useOrderById(orderId);
  const [etaMin, setEtaMin] = useState(order?.estimatedDeliveryTime ?? 35);
  const initialEta = useRef(order?.estimatedDeliveryTime ?? 35);
  const status = (order?.status ?? 'CONFIRMED') as OrderStatus;
  const timeline = buildTimeline(status);

  useEffect(() => {
    setEtaMin(order?.estimatedDeliveryTime ?? 35);
    initialEta.current = order?.estimatedDeliveryTime ?? 35;
  }, [order?.estimatedDeliveryTime]);

  useEffect(() => {
    if (status === 'DELIVERED') return;
    const timer = setInterval(() => {
      setEtaMin((prev) => Math.max(0, prev - 1));
    }, 60000);
    return () => clearInterval(timer);
  }, [status]);

  const progressPct = Math.max(5, status === 'DELIVERED' ? 100 : (etaMin / initialEta.current) * 100);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <View
        style={{
          backgroundColor: tokens.colors.surface,
          borderBottomColor: tokens.colors.border,
          borderBottomWidth: tokens.borders.widthThin,
          paddingTop: insets.top + tokens.spacing.md,
          paddingBottom: tokens.spacing.md,
          paddingHorizontal: tokens.spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable onPress={() => navigation.goBack()} style={{ padding: tokens.spacing.sm }}>
          <Icon name="arrow-back" size={24} color={tokens.colors.text} />
        </Pressable>
        <Heading level={2} marginBottom={0}>Order Tracking</Heading>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: tokens.spacing.md }}
      >
        {order && (
          <>
            <Card marginBottom={tokens.spacing.lg} shadow>
              <View style={{ alignItems: 'center', marginBottom: tokens.spacing.lg }}>
                <BodyText size="sm" color={tokens.colors.textDisabled}>
                  {getPhaseLabel(status)}
                </BodyText>
                <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.xs}>
                  Estimated Arrival
                </BodyText>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 48, fontWeight: '700', color: tokens.colors.primary }}>
                    {etaMin}
                  </Text>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: tokens.colors.text, marginLeft: tokens.spacing.xs }}>
                    min
                  </Text>
                </View>
              </View>

              <View
                style={{
                  height: 6,
                  borderRadius: tokens.borders.radiusPill,
                  backgroundColor: tokens.colors.borderLight,
                  overflow: 'hidden',
                  marginBottom: tokens.spacing.lg,
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    backgroundColor: tokens.colors.success,
                    borderRadius: tokens.borders.radiusPill,
                  }}
                />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <BodyText size="sm" color={tokens.colors.textDisabled}>Driver</BodyText>
                  <Heading level={4}>{order.driverName || 'Assigning driver...'}</Heading>
                  {order.driverPhone && (
                    <BodyText size="sm" color={tokens.colors.textDisabled}>
                      {formatPhone(order.driverPhone)}
                    </BodyText>
                  )}
                </View>
                <Icon name="bicycle" size={32} color={tokens.colors.text} />
              </View>
            </Card>

            <Card marginBottom={tokens.spacing.lg}>
              <Heading level={3} marginBottom={tokens.spacing.md}>Order Progress</Heading>
              {timeline.map((step, idx) => (
                <View key={step.status} style={{ flexDirection: 'row', marginBottom: tokens.spacing.md }}>
                  <View style={{ alignItems: 'center', width: 32, marginRight: tokens.spacing.md }}>
                    <Icon
                      name={step.done ? 'checkmark-circle' : step.active ? 'ellipse' : 'ellipse-outline'}
                      size={22}
                      color={step.done ? tokens.colors.success : step.active ? tokens.colors.primary : tokens.colors.textDisabled}
                    />
                    {idx < timeline.length - 1 && (
                      <View
                        style={{
                          width: 2,
                          flex: 1,
                          backgroundColor: step.done ? tokens.colors.success : tokens.colors.borderLight,
                          marginVertical: 2,
                        }}
                      />
                    )}
                  </View>
                  <View style={{ flex: 1, paddingBottom: tokens.spacing.sm }}>
                    <Text
                      style={{
                        fontSize: tokens.typography.fontSizeMd,
                        fontWeight: step.active || step.done ? '600' : '400',
                        color: step.done ? tokens.colors.text : step.active ? tokens.colors.primary : tokens.colors.textDisabled,
                      }}
                    >
                      {step.label}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>

            <Card marginBottom={tokens.spacing.lg}>
              <Heading level={3} marginBottom={tokens.spacing.md}>Order Summary</Heading>
              <Text
                style={{
                  fontSize: tokens.typography.fontSizeSm,
                  color: tokens.colors.textDisabled,
                  marginBottom: tokens.spacing.md,
                }}
              >
                #{order.id}
              </Text>
              {order.items.map((item) => (
                <View
                  key={item.id ?? `${item.menuItemId}-${Math.random()}`}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: tokens.spacing.xs,
                  }}
                >
                  <BodyText>
                    {item.quantity}x {item.title}
                  </BodyText>
                  <BodyText>${(item.itemTotal ?? 0).toFixed(2)}</BodyText>
                </View>
              ))}
              <View
                style={{
                  borderTopColor: tokens.colors.border,
                  borderTopWidth: tokens.borders.widthThin,
                  marginTop: tokens.spacing.md,
                  paddingTop: tokens.spacing.md,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Heading level={4}>Total</Heading>
                  <Heading level={4}>${order.total.toFixed(2)}</Heading>
                </View>
              </View>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderTrackingPage;
