// apps/mobile/src/components/home/PromoBanners.tsx
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../theme';
import { EngineId, cardChrome } from './engineStyle';
import { Icon } from '../shared/Icon';

interface PromoBanner {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
}

const DEMO_PROMOS: PromoBanner[] = [
  { id: 'p1', title: 'Free delivery on first order', icon: 'gift-outline' },
  { id: 'p2', title: '20% off weekend orders', icon: 'gift-outline' },
  { id: 'p3', title: 'Buy 2 get 1 free', icon: 'gift-outline' },
];

export const PromoBanners: React.FC = () => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  return (
    <View style={{ marginBottom: tokens.spacing.lg }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: tokens.spacing.md, gap: tokens.spacing.sm }}
      >
        {DEMO_PROMOS.map((promo) => (
          <Pressable
            key={promo.id}
            style={{
              minWidth: 220,
              padding: tokens.spacing.md,
              backgroundColor: tokens.colors.surface,
              borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusMd,
              borderWidth: 1,
              borderColor: tokens.colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: tokens.spacing.sm,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 20,
                backgroundColor: tokens.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="gift-outline" size={20} color={tokens.colors.textInverse} />
            </View>
            <Text
              numberOfLines={2}
              style={{
                flex: 1,
                color: tokens.colors.text,
                fontSize: tokens.typography.fontSizeSm,
                fontWeight: '600',
              }}
            >
              {promo.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
