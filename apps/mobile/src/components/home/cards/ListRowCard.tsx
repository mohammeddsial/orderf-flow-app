// apps/mobile/src/components/home/cards/ListRowCard.tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { softCard, Favorite, RatingRow, PricePill } from './shared';

interface CardProps {
  item: any;
  onPress: (id: string) => void;
  onAdd?: (id: string) => void;
}

// Reference design: image left (with favorite heart), title + subtitle,
// rating/time row, orange price pill. Rounded white card with soft shadow.
export const ListRowCard: React.FC<CardProps> = ({ item, onPress }) => {
  const { tokens } = useTheme();
  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ flexDirection: 'row', padding: tokens.spacing.sm, ...softCard(tokens) }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{ width: 104, height: 104, borderRadius: 14, backgroundColor: tokens.colors.surfaceInverse }}
        />
        <Favorite />
      </View>
      <View style={{ flex: 1, paddingHorizontal: tokens.spacing.md, justifyContent: 'center' }}>
        <Text numberOfLines={2} style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeLg, color: tokens.colors.text }}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm, marginTop: 2 }}>
          {item.description}
        </Text>
        <RatingRow t={tokens} />
        <PricePill t={tokens} style={{ marginTop: tokens.spacing.sm }}>${item.basePrice.toFixed(2)}</PricePill>
      </View>
    </Pressable>
  );
};
