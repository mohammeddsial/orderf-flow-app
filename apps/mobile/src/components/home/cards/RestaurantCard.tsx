// apps/mobile/src/components/home/cards/RestaurantCard.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';

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

// Card-7 (reference: the "Burger King" restaurant card). Banner image with a
// "Free Delivery" badge and a save/bookmark, then name + rating, eta, and
// cuisine tag chips. White card with a visible border and a soft shadow.
export const RestaurantCard: React.FC<CardProps> = ({ restaurant, onPress }) => {
  const { tokens } = useTheme();
  const [saved, setSaved] = useState(false);
  const imageUrl = restaurant.imageUrl || getPlaceholderImage(restaurant.name);
  const rating = restaurant.rating ?? 4.8;
  const eta = restaurant.etaText ?? '20–25 Min';
  const tags = restaurant.tags ?? ['Burgers', 'Fast Food'];
  const freeDelivery = restaurant.freeDelivery !== false;

  return (
    <Pressable
      onPress={() => onPress(restaurant.id)}
      style={{
        backgroundColor: tokens.colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: tokens.colors.borderLight,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
        overflow: 'hidden',
      }}
    >
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: imageUrl }} resizeMode="cover" style={{ width: '100%', height: 150, backgroundColor: tokens.colors.surfaceInverse }} />
        {freeDelivery ? (
          <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: tokens.colors.primary, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12 }}>
            <Text style={{ color: tokens.colors.textInverse, fontWeight: '800', fontSize: tokens.typography.fontSizeXs }}>Free Delivery</Text>
          </View>
        ) : null}
        <Pressable
          onPress={() => setSaved((s) => !s)}
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 16, color: saved ? tokens.colors.primary : '#9aa0a6' }}>{saved ? '♥' : '♡'}</Text>
        </Pressable>
      </View>
      <View style={{ padding: tokens.spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text numberOfLines={1} style={{ flex: 1, fontWeight: '800', fontSize: tokens.typography.fontSizeLg, color: tokens.colors.text }}>{restaurant.name}</Text>
          <Text style={{ fontWeight: '700', fontSize: tokens.typography.fontSizeSm, color: tokens.colors.text }}>⭐ {rating.toFixed(1)}</Text>
        </View>
        <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeXs, marginTop: 2 }}>
          ⏰ {eta}{freeDelivery ? ' • Free Delivery' : ''}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: tokens.spacing.sm }}>
          {tags.map((tag) => (
            <View key={tag} style={{ backgroundColor: tokens.colors.borderLight, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 }}>
              <Text style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.text }}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};
