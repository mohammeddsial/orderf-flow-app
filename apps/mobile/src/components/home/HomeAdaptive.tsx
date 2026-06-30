import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { EngineId, cardChrome, pillChrome } from './engineStyle';
import { Icon } from '../shared/Icon';
import { FlashDeal, ActiveOrderInfo, AbandonedCart } from './mockData';

const fmt = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

// ---------------------------------------------------------------------------
// Adaptive: Urgency / Flash deal with ticking countdown
// ---------------------------------------------------------------------------

export const FlashCountdown: React.FC<{ deal: FlashDeal; onClaim: () => void; cardVariant?: string }> = ({ deal, onClaim, cardVariant }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const [remaining, setRemaining] = useState(deal.durationSec);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // cardVariant: listRow — compact inline row
  if (cardVariant === 'listRow') {
    return (
      <Pressable
        onPress={onClaim}
        style={{
          marginBottom: tokens.spacing.lg,
          padding: tokens.spacing.sm,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...cardChrome(tokens, engine),
          backgroundColor: tokens.colors.accent,
          borderColor: tokens.colors.accent,
        }}
      >
        <Text style={{ color: tokens.colors.textInverse, fontWeight: '700', fontSize: tokens.typography.fontSizeSm, flex: 1 }} numberOfLines={1}>
          {deal.title}
        </Text>
        <View style={{ paddingHorizontal: tokens.spacing.sm, paddingVertical: 2, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusSm, backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: tokens.typography.fontSizeXs, fontVariant: ['tabular-nums'] }}> {fmt(remaining)}</Text>
        </View>
      </Pressable>
    );
  }

  // Default: feature — full-width banner
  return (
    <Pressable
      onPress={onClaim}
      style={{
        marginBottom: tokens.spacing.lg,
        padding: tokens.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...cardChrome(tokens, engine),
        backgroundColor: tokens.colors.accent,
        borderColor: tokens.colors.accent,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: tokens.colors.textInverse, fontWeight: '900', fontSize: tokens.typography.fontSizeMd }}>
          {deal.title}
        </Text>
        <Text style={{ color: tokens.colors.textInverse, opacity: 0.85, fontSize: tokens.typography.fontSizeXs }}>
          {deal.subtitle}
        </Text>
      </View>
      <View
        style={{
          paddingVertical: 4,
          paddingHorizontal: tokens.spacing.sm,
          borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusSm,
          backgroundColor: 'rgba(0,0,0,0.35)',
        }}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: '900', fontVariant: ['tabular-nums'] }}> {fmt(remaining)}</Text>
      </View>
    </Pressable>
  );
};

// ---------------------------------------------------------------------------
// Adaptive: Cart recovery ("Finish your order")
// ---------------------------------------------------------------------------

export const CartRecovery: React.FC<{ cart: AbandonedCart; onResume: () => void }> = ({ cart, onResume }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  return (
    <View
      style={{
        marginBottom: tokens.spacing.lg,
        padding: tokens.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...cardChrome(tokens, engine),
        borderColor: tokens.colors.accent,
        borderWidth: engine === 'MINIMALIST_CLEAN' ? 1 : tokens.borders.widthMedium,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: tokens.colors.text, fontWeight: '800', fontSize: tokens.typography.fontSizeMd }}>Finish your order</Text>
        <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm }}>
          {cart.title} • {cart.itemCount} items • ${cart.total.toFixed(2)}
        </Text>
      </View>
      <Pressable
        onPress={onResume}
        style={{
          paddingVertical: tokens.spacing.sm,
          paddingHorizontal: tokens.spacing.md,
          backgroundColor: tokens.colors.primary,
          borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusPill,
        }}
      >
        <Text style={{ color: tokens.colors.textInverse, fontWeight: '700', fontSize: tokens.typography.fontSizeSm }}>Resume</Text>
      </Pressable>
    </View>
  );
};

// ---------------------------------------------------------------------------
// 9. Floating active-order tracker (always-on-top while an order is live)
// ---------------------------------------------------------------------------

export const ActiveTracker: React.FC<{ order: ActiveOrderInfo; onTrack: () => void }> = ({ order, onTrack }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const insets = useSafeAreaInsets();
  return (
    <View style={{ position: 'absolute', left: tokens.spacing.md, right: tokens.spacing.md, bottom: insets.bottom + tokens.spacing.md, zIndex: 30 }}>
      <Pressable
        onPress={onTrack}
        style={{
          padding: tokens.spacing.md,
          ...cardChrome(tokens, engine),
          backgroundColor: engine === 'MINIMALIST_CLEAN' ? tokens.colors.text : tokens.colors.surface,
          shadowColor: '#000000',
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.spacing.sm }}>
          <Text style={{ color: engine === 'MINIMALIST_CLEAN' ? tokens.colors.textInverse : tokens.colors.text, fontWeight: '800' }}>
            ● {order.statusLabel}
          </Text>
          <Text style={{ color: tokens.colors.accent, fontWeight: '800' }}>{order.etaMin} min</Text>
        </View>
        <View style={{ height: 5, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 3, backgroundColor: tokens.colors.borderLight, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${Math.round(order.progress * 100)}%`, backgroundColor: tokens.colors.success }} />
        </View>
      </Pressable>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Demo controls: engine switcher + adaptive-module toggles
// ---------------------------------------------------------------------------

type DemoState = {
  isGuest: boolean;
  setIsGuest: (v: boolean) => void;
  flashOn: boolean;
  setFlashOn: (v: boolean) => void;
  cartOn: boolean;
  setCartOn: (v: boolean) => void;
  liveOn: boolean;
  setLiveOn: (v: boolean) => void;
};

const ENGINES: { id: EngineId; short: string }[] = [
  { id: 'BRUTALIST_MODERNIST', short: 'Brut' },
  { id: 'MINIMALIST_CLEAN', short: 'Min' },
  { id: 'VIBRANT_STREET_TECH', short: 'Vibe' },
];

export const DemoControls: React.FC<DemoState> = (s) => {
  const { tokens, engineStyle, setEngine } = useTheme();
  const engine = engineStyle as EngineId;
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const Row = (label: string, value: boolean, onChange: (v: boolean) => void) => (
    <Pressable
      onPress={() => onChange(!value)}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 }}
    >
      <Text style={{ color: tokens.colors.text, fontSize: tokens.typography.fontSizeSm }}>{label}</Text>
      <View style={{ paddingVertical: 2, paddingHorizontal: 10, ...pillChrome(tokens, engine, value) }}>
        <Text style={{ color: value ? tokens.colors.textInverse : tokens.colors.text, fontSize: tokens.typography.fontSizeXs, fontWeight: '700' }}>
          {value ? 'ON' : 'OFF'}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={{ position: 'absolute', right: tokens.spacing.md, top: insets.top + 70, zIndex: 40, alignItems: 'flex-end' }}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={{
          width: 44,
          height: 44,
          borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tokens.colors.accent,
          shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 8,
        }}
      >
        <Text style={{ fontSize: 20 }}>🎨</Text>
      </Pressable>

      {open ? (
        <View style={{ marginTop: 8, width: 220, padding: tokens.spacing.md, ...cardChrome(tokens, engine) }}>
          <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeXs, marginBottom: 6, fontWeight: '700' }}>
            DESIGN ENGINE
          </Text>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: tokens.spacing.md }}>
            {ENGINES.map((e) => {
              const active = engine === e.id;
              return (
                <Pressable
                  key={e.id}
                  onPress={() => setEngine(e.id)}
                  style={{ flex: 1, paddingVertical: 6, alignItems: 'center', ...pillChrome(tokens, engine, active) }}
                >
                  <Text style={{ color: active ? tokens.colors.textInverse : tokens.colors.text, fontSize: tokens.typography.fontSizeXs, fontWeight: '700' }}>
                    {e.short}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeXs, marginBottom: 2, fontWeight: '700' }}>
            MODULES
          </Text>
          {Row('Guest mode', s.isGuest, s.setIsGuest)}
          {Row('Flash deal', s.flashOn, s.setFlashOn)}
          {Row('Cart recovery', s.cartOn, s.setCartOn)}
          {Row('Live order', s.liveOn, s.setLiveOn)}
        </View>
      ) : null}
    </View>
  );
};
