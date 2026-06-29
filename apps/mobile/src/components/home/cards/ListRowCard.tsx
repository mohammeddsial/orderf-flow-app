// apps/mobile/src/components/home/cards/ListRowCard.tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { engineCard, Favorite, RatingRow, PricePill, imageRadiusFor } from './shared';
import { EngineId } from '../engineStyle';

interface CardProps {
  item: any;
  onPress: (id: string) => void;
  onAdd?: (id: string) => void;
}

export const ListRowCard: React.FC<CardProps> = ({ item, onPress }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);
  const imgR = imageRadiusFor(engine, tokens);

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ flexDirection: 'row', padding: tokens.spacing.sm, ...engineCard(tokens, engine) }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{ width: 104, height: 104, borderRadius: imgR, backgroundColor: tokens.colors.surfaceInverse }}
        />
        <Favorite engine={engine} t={tokens} />
      </View>
      <View style={{ flex: 1, paddingHorizontal: tokens.spacing.md, justifyContent: 'center' }}>
        <Text numberOfLines={2} style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeLg, color: tokens.colors.text }}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm, marginTop: 2 }}>
          {item.description}
        </Text>
        <RatingRow t={tokens} />
        <PricePill t={tokens} engine={engine} style={{ marginTop: tokens.spacing.sm }}>${item.basePrice.toFixed(2)}</PricePill>
      </View>
    </Pressable>
  );
};
