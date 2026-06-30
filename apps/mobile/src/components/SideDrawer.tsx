import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Image, Animated, Dimensions, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { pillChrome, type EngineId } from './home/engineStyle';

const { width: SCREEN_W } = Dimensions.get('window');
const PANEL_W = Math.min(320, Math.round(SCREEN_W * 0.82));

type Fulfillment = 'DELIVERY' | 'PICKUP';

interface MenuItem {
  key: string;
  label: string;
  icon: string;
}

const MENU: MenuItem[] = [
  { key: 'settings', label: 'Settings', icon: '⚙️' },
  { key: 'orders', label: 'My Orders', icon: '🧾' },
  { key: 'rewards', label: 'Rewards', icon: '⭐' },
  { key: 'addresses', label: 'Addresses', icon: '📍' },
  { key: 'help', label: 'Help & Support', icon: '❓' },
  { key: 'signout', label: 'Sign out', icon: '↩️' },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  tenantName: string;
  tenantLogo?: string;
  fulfillment: Fulfillment;
  onFulfillment: (m: Fulfillment) => void;
  customerLocation: string; // shown when Delivery
  tenantLocation: string; // shown when Pickup
  onNavigate?: (key: string) => void;
}

export const SideDrawer: React.FC<Props> = ({
  visible,
  onClose,
  tenantName,
  tenantLogo,
  fulfillment,
  onFulfillment,
  customerLocation,
  tenantLocation,
  onNavigate,
}) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(-PANEL_W)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const panelRadius = engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusLg;
  const toggleRadius = engine === 'BRUTALIST_MODERNIST' ? 0 : 999;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, { toValue: visible ? 0 : -PANEL_W, duration: 240, useNativeDriver: true }),
      Animated.timing(fade, { toValue: visible ? 1 : 0, duration: 240, useNativeDriver: true }),
    ]).start();
  }, [visible, slide, fade]);

  const isDelivery = fulfillment === 'DELIVERY';

  const Toggle = (mode: Fulfillment, label: string) => {
    const active = fulfillment === mode;
    return (
      <Pressable
        onPress={() => onFulfillment(mode)}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 8,
          ...pillChrome(tokens, engine, active),
        }}
      >
        <Text style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeSm, color: active ? tokens.colors.textInverse : tokens.colors.text }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', opacity: fade }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: PANEL_W,
          backgroundColor: tokens.colors.surface,
          paddingTop: insets.top + tokens.spacing.lg,
          paddingHorizontal: tokens.spacing.lg,
          transform: [{ translateX: slide }],
          shadowColor: engine === 'VIBRANT_STREET_TECH' ? tokens.colors.secondary : '#000000',
          shadowOpacity: engine === 'VIBRANT_STREET_TECH' ? 0.5 : 0.18,
          shadowRadius: engine === 'VIBRANT_STREET_TECH' ? 16 : 18,
          shadowOffset: { width: 4, height: 0 },
          elevation: 12,
          ...(engine === 'BRUTALIST_MODERNIST' ? { borderRightWidth: tokens.borders.widthThick, borderRightColor: tokens.colors.border } : {}),
        }}
      >
        {/* Tenant header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md }}>
          <Image
            source={{ uri: tenantLogo || `https://picsum.photos/seed/${encodeURIComponent(tenantName)}/80` }}
            style={{ width: 48, height: 48, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 24, backgroundColor: tokens.colors.surfaceInverse }}
          />
          <Text numberOfLines={1} style={{ flex: 1, fontWeight: '800', fontSize: tokens.typography.fontSizeLg, color: tokens.colors.text }}>
            {tenantName}
          </Text>
        </View>

        {/* Delivery / Pickup toggle */}
        <View style={{ flexDirection: 'row', marginTop: tokens.spacing.lg, padding: 4, borderRadius: toggleRadius, backgroundColor: tokens.colors.borderLight }}>
          {Toggle('DELIVERY', 'Delivery')}
          {Toggle('PICKUP', 'Pickup')}
        </View>

        {/* Location — customer when delivery, restaurant when pickup */}
        <View style={{ marginTop: tokens.spacing.md, padding: tokens.spacing.md, borderRadius: panelRadius, backgroundColor: tokens.colors.borderLight }}>
          <Text style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textDisabled }}>
            {isDelivery ? 'Deliver to' : 'Pick up from'}
          </Text>
          <Text numberOfLines={2} style={{ marginTop: 2, fontWeight: '700', fontSize: tokens.typography.fontSizeSm, color: tokens.colors.text }}>
            📍 {isDelivery ? customerLocation : tenantLocation}
          </Text>
        </View>

        {/* Menu */}
        <View style={{ marginTop: tokens.spacing.lg }}>
          {MENU.map((m) => (
            <Pressable
              key={m.key}
              onPress={() => {
                onNavigate?.(m.key);
                onClose();
              }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md, paddingVertical: tokens.spacing.md }}
            >
              <Text style={{ fontSize: 18 }}>{m.icon}</Text>
              <Text style={{ fontSize: tokens.typography.fontSizeMd, color: tokens.colors.text, fontWeight: '600' }}>{m.label}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
};

export default SideDrawer;
