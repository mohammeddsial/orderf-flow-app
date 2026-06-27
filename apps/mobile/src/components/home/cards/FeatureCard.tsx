// apps/mobile/src/components/home/cards/FeatureCard.tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { softCard, Favorite, RatingRow, PricePill, ActionButton } from './shared';

interface CardProps {
  item: any;
  onPress: (id: string) => void;
  onAdd?: (id: string) => void;
}

// Reference design: large full-width card. Big image (with favorite heart),
// title + description, rating/time row and an orange price button.
export const FeatureCard: React.FC<CardProps> = ({ item, onPress, onAdd }) => {
  const { tokens } = useTheme();
  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ padding: tokens.spacing.sm, ...softCard(tokens) }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{ height: 180, width: '100%', borderRadius: 14, backgroundColor: tokens.colors.surfaceInverse }}
        />
        <Favorite />
      </View>
      <View style={{ paddingHorizontal: tokens.spacing.sm, paddingTop: tokens.spacing.sm }}>
        <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeLg, color: tokens.colors.text }}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm, marginTop: 2 }}>
          {item.description}
        </Text>
        <RatingRow t={tokens} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: tokens.spacing.sm }}>
          <PricePill t={tokens}>${item.basePrice.toFixed(2)}</PricePill>
          <ActionButton t={tokens} label="Add" onPress={() => onAdd?.(item.id)} />
        </View>
      </View>
    </Pressable>
  );
};
