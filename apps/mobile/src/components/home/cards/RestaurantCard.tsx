// apps/mobile/src/components/home/cards/RestaurantCard.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { cardChrome, EngineId, imageRadiusFor } from '../engineStyle';
import { Icon } from '../../shared/Icon';

interface Restaurant {
  id: string;
  name: string;
  imageUrl?: string;
  rating?: number;
  etaText?: string;
  tags?: string[];
  freeDelivery?: boolean;
}

interface CardProps {
  restaurant: Restaurant;
  onPress: (id: string) => void;
}

export const RestaurantCard: React.FC<CardProps> = ({ restaurant, onPress }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const [saved, setSaved] = useState(false);
  const imageUrl = restaurant.imageUrl || getPlaceholderImage(restaurant.name);
  const rating = restaurant.rating ?? 4.8;
  const eta = restaurant.etaText ?? '20–25 Min';
  const tags = restaurant.tags ?? ['Burgers', 'Fast Food'];
  const freeDelivery = restaurant.freeDelivery !== false;

  const badgeR = engine === 'BRUTALIST_MODERNIST' ? 0 : 999;
  const saveR = engine === 'BRUTALIST_MODERNIST' ? 0 : 16;

  return (
    <Pressable
      onPress={() => onPress(restaurant.id)}
      style={{ overflow: 'hidden', ...cardChrome(tokens, engine) }}
    >
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: imageUrl }} resizeMode="cover" style={{ width: '100%', height: 150, backgroundColor: tokens.colors.surfaceInverse }} />
        {freeDelivery ? (
          <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: tokens.colors.primary, borderRadius: badgeR, paddingVertical: 5, paddingHorizontal: 12 }}>
            <Text style={{ color: tokens.colors.textInverse, fontWeight: '800', fontSize: tokens.typography.fontSizeXs }}>Free Delivery</Text>
          </View>
        ) : null}
        <Pressable
          onPress={() => setSaved((s) => !s)}
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: saveR, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="rewards" size={16} color={saved ? tokens.colors.primary : '#9aa0a6'} />
        </Pressable>
      </View>
      <View style={{ padding: tokens.spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text numberOfLines={1} style={{ flex: 1, fontWeight: '800', fontSize: tokens.typography.fontSizeLg, color: tokens.colors.text }}>{restaurant.name}</Text>
          <Text style={{ fontWeight: '700', fontSize: tokens.typography.fontSizeSm, color: tokens.colors.text }}>{rating.toFixed(1)}</Text>
        </View>
        <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeXs, marginTop: 2 }}>
          ⏰ {eta}{freeDelivery ? ' • Free Delivery' : ''}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: tokens.spacing.sm }}>
          {tags.map((tag) => (
            <View key={tag} style={{ backgroundColor: tokens.colors.borderLight, borderRadius: badgeR, paddingVertical: 4, paddingHorizontal: 10 }}>
              <Text style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.text }}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};
