// apps/mobile/src/components/home/cards/OverlayPriceCard.tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { softCard, Favorite, RatingRow } from './shared';

interface CardProps {
  item: any;
  onPress: (id: string) => void;
  onAdd?: (id: string) => void;
}

// Reference design: vertical card, image with favorite heart and an orange
// price pill overlapping the bottom of the image, then title + rating row.
export const OverlayPriceCard: React.FC<CardProps> = ({ item, onPress }) => {
  const { tokens } = useTheme();
  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ width: 180, padding: tokens.spacing.sm, ...softCard(tokens) }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{ height: 124, width: '100%', borderRadius: 14, backgroundColor: tokens.colors.surfaceInverse }}
        />
        <Favorite />
        <View style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: tokens.colors.primary, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 }}>
          <Text style={{ color: tokens.colors.textInverse, fontWeight: '800', fontSize: tokens.typography.fontSizeSm }}>
            ${item.basePrice.toFixed(2)}
          </Text>
        </View>
      </View>
      <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeMd, color: tokens.colors.text, marginTop: tokens.spacing.sm }}>
        {item.title}
      </Text>
      <RatingRow t={tokens} />
    </Pressable>
  );
};
