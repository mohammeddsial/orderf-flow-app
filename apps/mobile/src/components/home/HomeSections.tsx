import React, { ReactNode, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MenuItem } from '@multi-restaurant/database';
import { store } from '@multi-restaurant/database';
import { useTheme } from '../../theme';
import {
  EngineId,
  cardChrome,
  sectionTitleStyle,
  pillChrome,
  quickAddChrome,
  layoutConfig,
  sectionGap,
  type CategoryLayout,
} from './engineStyle';
import { Story, ReorderCard } from './mockData';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { ItemCard } from './cards';

const { width: SCREEN_W } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export const Gutter: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { tokens } = useTheme();
  return <View style={{ paddingHorizontal: tokens.spacing.md }}>{children}</View>;
};

export const SectionHeader: React.FC<{
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, actionLabel, onAction }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: tokens.spacing.md,
      }}
    >
      <Text style={sectionTitleStyle(tokens, engine)}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction}>
          <Text style={{ color: tokens.colors.accent, fontWeight: '600', fontSize: tokens.typography.fontSizeSm }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

// ---------------------------------------------------------------------------
// 1. Fixed translucent header overlay
// ---------------------------------------------------------------------------

export const HomeHeader: React.FC<{
  brandName: string;
  location: string;
  onToggleLocation: () => void;
  fulfillment: 'DELIVERY' | 'PICKUP';
  onFulfillment: (m: 'DELIVERY' | 'PICKUP') => void;
  onMenu?: () => void;
}> = ({ brandName, location, onToggleLocation, fulfillment, onFulfillment, onMenu }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const insets = useSafeAreaInsets();

  const bg =
    engine === 'MINIMALIST_CLEAN'
      ? 'rgba(255,255,255,0.78)'
      : engine === 'VIBRANT_STREET_TECH'
      ? 'rgba(10,14,19,0.6)'
      : 'rgba(0,0,0,0.55)';
  const fg = engine === 'MINIMALIST_CLEAN' ? '#1A1A1A' : '#FFFFFF';

  const Toggle = (mode: 'DELIVERY' | 'PICKUP', label: string) => {
    const active = fulfillment === mode;
    return (
      <Pressable
        onPress={() => onFulfillment(mode)}
        style={{
          paddingVertical: 4,
          paddingHorizontal: tokens.spacing.sm,
          ...pillChrome(tokens, engine, active),
        }}
      >
        <Text
          style={{
            fontSize: tokens.typography.fontSizeXs,
            fontWeight: '700',
            color: active ? tokens.colors.textInverse : fg,
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        paddingTop: insets.top + 6,
        paddingBottom: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
        backgroundColor: bg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {onMenu ? (
          <Pressable onPress={onMenu} hitSlop={12} style={{ marginRight: tokens.spacing.sm }}>
            <Text style={{ color: fg, fontSize: 22, fontWeight: '900' }}>☰</Text>
          </Pressable>
        ) : null}
        <View>
          <Text style={{ color: fg, fontSize: tokens.typography.fontSizeLg, fontWeight: '800' }}>
            {brandName}
          </Text>
          <Pressable onPress={onToggleLocation} hitSlop={8}>
            <Text style={{ color: fg, opacity: 0.85, fontSize: tokens.typography.fontSizeXs }}>
              {location} • 12 min ▾
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {Toggle('DELIVERY', 'Delivery')}
        {Toggle('PICKUP', 'Pickup')}
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// 3. Loyalty dashboard (frosted card + goal-gradient progress)
// ---------------------------------------------------------------------------

export const LoyaltyCard: React.FC<{
  isGuest: boolean;
  points: number;
  tier: string;
  progress: number; // 0..1
  onPress: () => void;
}> = ({ isGuest, points, tier, progress, onPress }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  if (isGuest) {
    return (
      <Pressable onPress={onPress} style={{ padding: tokens.spacing.lg, marginBottom: tokens.spacing.lg, ...cardChrome(tokens, engine) }}>
        <Text style={{ color: tokens.colors.text, fontSize: tokens.typography.fontSizeLg, fontWeight: '800', marginBottom: 4 }}>
          Join {''}— earn on every order
        </Text>
        <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm }}>
          Create an account to unlock rewards & free delivery.
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={{ padding: tokens.spacing.lg, marginBottom: tokens.spacing.lg, ...cardChrome(tokens, engine) }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacing.md }}>
        <Text style={{ color: tokens.colors.text, fontSize: tokens.typography.fontSizeLg, fontWeight: '800' }}>
          {tier} • {points} pts
        </Text>
        <Text style={{ color: tokens.colors.accent, fontWeight: '700', fontSize: tokens.typography.fontSizeSm }}>
          Rewards →
        </Text>
      </View>
      <View
        style={{
          height: 8,
          backgroundColor: tokens.colors.borderLight,
          borderRadius: tokens.borders.radiusPill,
          overflow: 'hidden',
          marginBottom: tokens.spacing.sm,
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${Math.round(progress * 100)}%`,
            backgroundColor: tokens.colors.accent,
            borderRadius: tokens.borders.radiusPill,
          }}
        />
      </View>
      <Text style={{ color: tokens.colors.text, fontSize: tokens.typography.fontSizeSm }}>
        {Math.max(0, Math.round((1 - progress) * 1000))} pts to Gold — unlock free delivery
      </Text>
    </Pressable>
  );
};

// ---------------------------------------------------------------------------
// 4. Order Again rail
// ---------------------------------------------------------------------------

export const OrderAgainRail: React.FC<{
  orders: ReorderCard[];
  onReorder: (id: string) => void;
  cardVariant?: string;
}> = ({ orders, onReorder, cardVariant }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  if (orders.length === 0) return null;

  // cardVariant override: plainGrid renders a 2-column grid instead of horizontal rail
  if (cardVariant === 'plainGrid') {
    return (
      <View style={{ marginBottom: tokens.spacing.lg, paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Order Again" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm }}>
          {orders.map((o) => (
            <View key={o.id} style={{ width: '48%', padding: tokens.spacing.sm, ...cardChrome(tokens, engine) }}>
              <Text style={{ color: tokens.colors.text, fontWeight: '700', fontSize: tokens.typography.fontSizeSm, marginBottom: 2 }} numberOfLines={1}>{o.title}</Text>
              <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeXs, marginBottom: tokens.spacing.xs }}>{o.itemCount} items • ${o.total.toFixed(2)}</Text>
              <Pressable
                onPress={() => onReorder(o.id)}
                style={{ alignItems: 'center', paddingVertical: tokens.spacing.xs, backgroundColor: tokens.colors.primary, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusPill }}
              >
                <Text style={{ color: tokens.colors.textInverse, fontWeight: '700', fontSize: tokens.typography.fontSizeXs }}>Reorder</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // cardVariant override: overlayPrice renders image with price overlay
  if (cardVariant === 'overlayPrice') {
    return (
      <View style={{ marginBottom: tokens.spacing.lg }}>
        <View style={{ paddingHorizontal: tokens.spacing.md }}>
          <SectionHeader title="Order Again" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: tokens.spacing.md, gap: tokens.spacing.md }}
        >
          {orders.map((o) => (
            <View key={o.id} style={{ width: SCREEN_W * 0.55, overflow: 'hidden', ...cardChrome(tokens, engine) }}>
              <View style={{ height: 80, backgroundColor: tokens.colors.surfaceInverse, justifyContent: 'flex-end', padding: tokens.spacing.sm }}>
                <View style={{ position: 'absolute', top: tokens.spacing.xs, right: tokens.spacing.xs, backgroundColor: tokens.colors.primary, paddingHorizontal: tokens.spacing.sm, paddingVertical: 2, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusPill }}>
                  <Text style={{ color: tokens.colors.textInverse, fontWeight: '900', fontSize: tokens.typography.fontSizeXs }}>${o.total.toFixed(2)}</Text>
                </View>
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: tokens.typography.fontSizeSm }} numberOfLines={1}>{o.title}</Text>
              </View>
              <View style={{ padding: tokens.spacing.sm }}>
                <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeXs, marginBottom: tokens.spacing.xs }}>{o.itemCount} items</Text>
                <Pressable
                  onPress={() => onReorder(o.id)}
                  style={{ alignItems: 'center', paddingVertical: tokens.spacing.xs, backgroundColor: tokens.colors.primary, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusPill }}
                >
                  <Text style={{ color: tokens.colors.textInverse, fontWeight: '700', fontSize: tokens.typography.fontSizeXs }}>Reorder</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Default: horizontal rail of order cards
  return (
    <View style={{ marginBottom: tokens.spacing.lg }}>
      <View style={{ paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Order Again" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: tokens.spacing.md, gap: tokens.spacing.md }}
      >
        {orders.map((o) => (
          <View key={o.id} style={{ width: SCREEN_W * 0.62, padding: tokens.spacing.md, ...cardChrome(tokens, engine) }}>
            <Text style={{ color: tokens.colors.text, fontWeight: '700', fontSize: tokens.typography.fontSizeMd, marginBottom: 2 }}>
              {o.title}
            </Text>
            <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm, marginBottom: tokens.spacing.sm }}>
              {o.itemCount} items • ${o.total.toFixed(2)}
            </Text>
            <Pressable
              onPress={() => onReorder(o.id)}
              style={{ alignItems: 'center', paddingVertical: tokens.spacing.sm, backgroundColor: tokens.colors.primary, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusPill }}
            >
              <Text style={{ color: tokens.colors.textInverse, fontWeight: '700', fontSize: tokens.typography.fontSizeSm }}>
                Reorder
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Quick-add "+" with cart-fly micro-interaction
// ---------------------------------------------------------------------------

export const QuickAddButton: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const scale = useRef(new Animated.Value(1)).current;
  const flyY = useRef(new Animated.Value(0)).current;
  const flyOpacity = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    onAdd();
    flyY.setValue(0);
    flyOpacity.setValue(1);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.8, duration: 90, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]),
      Animated.timing(flyY, { toValue: -42, duration: 520, useNativeDriver: true }),
      Animated.timing(flyOpacity, { toValue: 0, duration: 520, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View>
      <Animated.Text
        style={{
          position: 'absolute',
          right: 2,
          top: -4,
          color: tokens.colors.accent,
          fontWeight: '900',
          fontSize: tokens.typography.fontSizeMd,
          opacity: flyOpacity,
          transform: [{ translateY: flyY }],
        }}
      >
        +1
      </Animated.Text>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={handlePress}
          hitSlop={8}
          style={{
            width: 34,
            height: 34,
            alignItems: 'center',
            justifyContent: 'center',
            ...quickAddChrome(tokens, engine),
          }}
        >
          <Text style={{ color: tokens.colors.textInverse, fontWeight: '900', fontSize: 20, lineHeight: 22 }}>+</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// 5. Personalized recommendations ("For You")
// ---------------------------------------------------------------------------

export const Recommendations: React.FC<{
  items: MenuItem[];
  onSelect: (id: string) => void;
  cardVariant?: string;
}> = ({ items, onSelect, cardVariant }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  if (items.length === 0) return null;

  const hour = new Date().getHours();
  const label = hour < 11 ? 'Morning picks for you' : hour < 17 ? 'For You' : "Tonight's cravings";

  if (cardVariant) {
    return (
      <View style={{ marginBottom: tokens.spacing.lg, paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title={label} actionLabel="See all" onAction={() => onSelect(items[0].id)} />
        <View style={{ gap: tokens.spacing.md }}>
          {items.map((item) => (
            <ItemCard key={item.id} variant={cardVariant} item={item} onPress={onSelect} onAdd={() => safeAdd(item.id)} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: tokens.spacing.lg, paddingHorizontal: tokens.spacing.md }}>
      <SectionHeader title={label} actionLabel="See all" onAction={() => onSelect(items[0].id)} />
      {items.map((item) => {
        const imageUrl = item.imageUrl || getPlaceholderImage(item.title);
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={{ flexDirection: 'row', alignItems: 'center', padding: tokens.spacing.md, marginBottom: tokens.spacing.md, ...cardChrome(tokens, engine) }}
          >
            <Image source={{ uri: imageUrl }} resizeMode="cover" style={{ width: 64, height: 64, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusMd, backgroundColor: tokens.colors.surfaceInverse, marginRight: tokens.spacing.md }} />

            <View style={{ flex: 1 }}>
              <Text style={{ color: tokens.colors.text, fontWeight: '700', fontSize: tokens.typography.fontSizeMd }}>{item.title}</Text>
              <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm }}>{item.calories} cal</Text>
              <Text style={{ color: tokens.colors.text, fontWeight: '800', marginTop: 2 }}>${item.basePrice.toFixed(2)}</Text>
            </View>
            <QuickAddButton onAdd={() => safeAdd(item.id)} />
          </Pressable>
        );
      })}
    </View>
  );
};

// ---------------------------------------------------------------------------
// 6. Category tiles (2x2 macro nav, deep-link to Menu anchor)
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'Burgers', label: 'Burgers', emoji: '🍔', tint: '#FF6B35' },
  { id: 'Sides', label: 'Sides', emoji: '🍟', tint: '#F5A623' },
  { id: 'Drinks', label: 'Drinks', emoji: '🥤', tint: '#00D9FF' },
  { id: 'Desserts', label: 'Desserts', emoji: '🍰', tint: '#FF006E' },
];

export const CategoryTiles: React.FC<{ onCategory: (cat: string) => void }> = ({ onCategory }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const layout = layoutConfig(engine);

  const tileBg = (c: typeof CATEGORIES[number]) =>
    engine === 'VIBRANT_STREET_TECH'
      ? tokens.colors.surface
      : c.tint + (engine === 'BRUTALIST_MODERNIST' ? '' : '22');

  const Tile = (c: typeof CATEGORIES[number]) => (
    <Pressable
      key={c.id}
      onPress={() => onCategory(c.id)}
      style={{
        justifyContent: 'flex-end',
        padding: tokens.spacing.md,
        overflow: 'hidden',
        ...cardChrome(tokens, engine),
        backgroundColor: tileBg(c),
      }}
    >
      <Text style={{ position: 'absolute', top: 8, right: 10, fontSize: 40 }}>{c.emoji}</Text>
      <Text style={{ color: tokens.colors.text, fontWeight: '800', fontSize: tokens.typography.fontSizeLg }}>{c.label}</Text>
    </Pressable>
  );

  // List layout (Brutalist) — full-width vertical rows
  if (layout.categoryLayout === 'list') {
    return (
      <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing), paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Browse" />
        <View style={{ gap: tokens.spacing.sm }}>
          {CATEGORIES.map((c) => (
            <View key={c.id} style={{ height: 64 }}>
              {Tile(c)}
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Carousel layout (Vibrant) — horizontal scrolling pills
  if (layout.categoryLayout === 'carousel') {
    return (
      <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing) }}>
        <View style={{ paddingHorizontal: tokens.spacing.md }}>
          <SectionHeader title="Browse" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: tokens.spacing.md, gap: tokens.spacing.md }}
        >
          {CATEGORIES.map((c) => (
            <View key={c.id} style={{ width: 120, height: 120 }}>
              {Tile(c)}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Grid 2x2 (Minimalist) — default
  return (
    <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing), paddingHorizontal: tokens.spacing.md }}>
      <SectionHeader title="Browse" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {CATEGORIES.map((c) => (
          <View key={c.id} style={{ width: '48%', height: 110, marginBottom: tokens.spacing.md }}>
            {Tile(c)}
          </View>
        ))}
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// 7. Featured / seasonal tier (large card)
// ---------------------------------------------------------------------------

export const FeaturedTier: React.FC<{ item?: MenuItem; onSelect: (id: string) => void; cardVariant?: string }> = ({ item, onSelect, cardVariant }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const layout = layoutConfig(engine);
  if (!item) return null;

  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);
  const imgRadius = engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusMd;

  // cardVariant override: listRow renders a compact horizontal row
  if (cardVariant === 'listRow') {
    return (
      <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing), paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Chef's Featured" />
        <Pressable onPress={() => onSelect(item.id)} style={{ flexDirection: 'row', overflow: 'hidden', ...cardChrome(tokens, engine) }}>
          <Image source={{ uri: imageUrl }} resizeMode="cover" style={{ width: 100, height: 100, backgroundColor: tokens.colors.surfaceInverse }} />
          <View style={{ flex: 1, padding: tokens.spacing.md, justifyContent: 'center' }}>
            <Text style={{ color: tokens.colors.text, fontWeight: '700', fontSize: tokens.typography.fontSizeMd, marginBottom: 2 }}>{item.title}</Text>
            <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm, marginBottom: tokens.spacing.xs }} numberOfLines={1}>{item.description}</Text>
            <Text style={{ color: tokens.colors.accent, fontWeight: '700' }}>${item.basePrice.toFixed(2)}</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  // cardVariant override: overlayPrice renders price pill on the image
  if (cardVariant === 'overlayPrice') {
    return (
      <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing), paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Chef's Featured" />
        <Pressable onPress={() => onSelect(item.id)} style={{ overflow: 'hidden', ...cardChrome(tokens, engine) }}>
          <ImageBackground source={{ uri: imageUrl }} resizeMode="cover" style={{ height: 180, justifyContent: 'flex-end' }}>
            <View style={{ position: 'absolute', top: tokens.spacing.sm, right: tokens.spacing.sm, backgroundColor: tokens.colors.primary, paddingHorizontal: tokens.spacing.sm, paddingVertical: 2, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusPill }}>
              <Text style={{ color: tokens.colors.textInverse, fontWeight: '900', fontSize: tokens.typography.fontSizeSm }}>${item.basePrice.toFixed(2)}</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: tokens.spacing.md }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: tokens.typography.fontSizeLg }}>{item.title}</Text>
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    );
  }

  // Overlay (Vibrant) — text overlaid on the image with a dark scrim
  if (layout.featuredCardStyle === 'overlay') {
    return (
      <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing), paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Chef's Featured" />
        <Pressable onPress={() => onSelect(item.id)} style={{ overflow: 'hidden', ...cardChrome(tokens, engine) }}>
          <ImageBackground source={{ uri: imageUrl }} resizeMode="cover" style={{ height: 220, justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.55)', padding: tokens.spacing.lg }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: tokens.typography.fontSizeXl, marginBottom: 4 }}>{item.title}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: tokens.typography.fontSizeSm, marginBottom: tokens.spacing.sm }} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={{ color: tokens.colors.accent, fontWeight: '900' }}>${item.basePrice.toFixed(2)}</Text>
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    );
  }

  // Editorial (Minimalist) — side-by-side image + text
  if (layout.featuredCardStyle === 'editorial') {
    return (
      <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing), paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Chef's Featured" />
        <Pressable onPress={() => onSelect(item.id)} style={{ flexDirection: 'row', overflow: 'hidden', ...cardChrome(tokens, engine) }}>
          <Image source={{ uri: imageUrl }} resizeMode="cover" style={{ width: '45%', backgroundColor: tokens.colors.surfaceInverse }} />
          <View style={{ flex: 1, padding: tokens.spacing.lg, justifyContent: 'center' }}>
            <Text style={{ color: tokens.colors.text, fontWeight: '700', fontSize: tokens.typography.fontSizeLg, marginBottom: 4 }}>{item.title}</Text>
            <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm, marginBottom: tokens.spacing.sm }} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={{ color: tokens.colors.accent, fontWeight: '700' }}>${item.basePrice.toFixed(2)}</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  // Stacked (Brutalist) — image on top, text below, sharp edges
  return (
    <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing), paddingHorizontal: tokens.spacing.md }}>
      <SectionHeader title="Chef's Featured" />
      <Pressable onPress={() => onSelect(item.id)} style={{ overflow: 'hidden', ...cardChrome(tokens, engine) }}>
        <Image source={{ uri: imageUrl }} resizeMode="cover" style={{ height: 170, width: '100%', backgroundColor: tokens.colors.surfaceInverse }} />
        <View style={{ padding: tokens.spacing.lg }}>
          <Text style={{ color: tokens.colors.text, fontWeight: '900', fontSize: tokens.typography.fontSizeXl, marginBottom: 4 }}>{item.title}</Text>
          <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm, marginBottom: tokens.spacing.sm }} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={{ color: tokens.colors.accent, fontWeight: '900' }}>${item.basePrice.toFixed(2)}</Text>
        </View>
      </Pressable>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Engagement layer: Stories rail
// ---------------------------------------------------------------------------

export const StoriesRail: React.FC<{ stories: Story[] }> = ({ stories }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  if (stories.length === 0) return null;
  return (
    <View style={{ marginBottom: tokens.spacing.lg }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: tokens.spacing.md, gap: tokens.spacing.md }}>
        {stories.map((s) => (
          <View key={s.id} style={{ alignItems: 'center', width: 68 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 32,
                borderWidth: 2.5,
                borderColor: s.seen ? tokens.colors.borderLight : s.color,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={{ width: 52, height: 52, borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 26, backgroundColor: s.color + '33' }} />
            </View>
            <Text numberOfLines={1} style={{ marginTop: 4, fontSize: tokens.typography.fontSizeXs, color: tokens.colors.text }}>{s.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ---------------------------------------------------------------------------
// 8. Popular rail with quick-add
// ---------------------------------------------------------------------------

export const PopularRail: React.FC<{ items: MenuItem[]; onSelect: (id: string) => void; cardVariant?: string }> = ({ items, onSelect, cardVariant }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const layout = layoutConfig(engine);
  if (items.length === 0) return null;

  if (cardVariant) {
    return (
      <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing), paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Popular Right Now" />
        <View style={{ gap: tokens.spacing.md }}>
          {items.map((item) => (
            <ItemCard key={item.id} variant={cardVariant} item={item} onPress={onSelect} onAdd={() => safeAdd(item.id)} />
          ))}
        </View>
      </View>
    );
  }

  const PopularCard = ({ item }: { item: MenuItem }) => {
    const imageUrl = item.imageUrl || getPlaceholderImage(item.title);
    const imgR = engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusMd;
    return (
      <View style={{ padding: tokens.spacing.md, ...cardChrome(tokens, engine) }}>
        <Pressable onPress={() => onSelect(item.id)}>
          <Image source={{ uri: imageUrl }} resizeMode="cover" style={{ height: 80, borderRadius: imgR, backgroundColor: tokens.colors.surfaceInverse, marginBottom: tokens.spacing.sm }} />
          <Text numberOfLines={1} style={{ color: tokens.colors.text, fontWeight: '700', fontSize: tokens.typography.fontSizeSm }}>{item.title}</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: tokens.spacing.sm }}>
          <Text style={{ color: tokens.colors.text, fontWeight: '800' }}>${item.basePrice.toFixed(2)}</Text>
          <QuickAddButton onAdd={() => safeAdd(item.id)} />
        </View>
      </View>
    );
  };

  // List layout (Brutalist) — full-width vertical rows
  if (layout.popularLayout === 'list') {
    return (
      <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing), paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Popular Right Now" />
        <View style={{ gap: tokens.spacing.md }}>
          {items.map((item) => (
            <View key={item.id}>
              <PopularCard item={item} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Grid layout (Minimalist / default) — 2-column wrap
  if (layout.popularLayout === 'grid') {
    return (
      <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing), paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Popular Right Now" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.md }}>
          {items.map((item) => (
            <View key={item.id} style={{ width: '48%' }}>
              <PopularCard item={item} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Horizontal carousel (Vibrant) — default
  return (
    <View style={{ marginBottom: sectionGap(tokens, layout.sectionSpacing) }}>
      <View style={{ paddingHorizontal: tokens.spacing.md }}>
        <SectionHeader title="Popular Right Now" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: tokens.spacing.md, gap: tokens.spacing.md }}>
        {items.map((item) => (
          <View key={item.id} style={{ width: SCREEN_W * 0.4 }}>
            <PopularCard item={item} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Fire-and-forget add to the mock store; failures are non-fatal for the demo.
function safeAdd(menuItemId: string): void {
  try {
    store.addToCart(menuItemId, 1);
  } catch {
    // ignore (e.g., no user/cart in some states)
  }
}