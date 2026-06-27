// apps/mobile/src/components/home/cards/PlainGridCard.tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { softCard, Favorite, RatingRow } from './shared';

interface CardProps {
  item: any;
  onPress: (id: string) => void;
}

// Reference design: vertical grid card, image top (with favorite heart),
// title, plain bold price, rating/time row. Rounded white card, soft shadow.
export const PlainGridCard: React.FC<CardProps> = ({ item, onPress }) => {
  const { tokens } = useTheme();
  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ width: 160, padding: tokens.spacing.sm, ...softCard(tokens) }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{ height: 110, width: '100%', borderRadius: 14, backgroundColor: tokens.colors.surfaceInverse }}
        />
        <Favorite />
      </View>
      <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeMd, color: tokens.colors.text, marginTop: tokens.spacing.sm }}>
        {item.title}
      </Text>
      <Text style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeMd, color: tokens.colors.primary, marginTop: 2 }}>
        ${item.basePrice.toFixed(2)}
      </Text>
      <RatingRow t={tokens} />
    </Pressable>
  );
};
