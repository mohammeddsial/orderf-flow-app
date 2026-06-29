// apps/mobile/src/components/home/cards/PlainGridCard.tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { engineCard, Favorite, RatingRow, imageRadiusFor } from './shared';
import { EngineId } from '../engineStyle';

interface CardProps {
  item: any;
  onPress: (id: string) => void;
}

export const PlainGridCard: React.FC<CardProps> = ({ item, onPress }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);
  const imgR = imageRadiusFor(engine, tokens);

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ width: 160, padding: tokens.spacing.sm, ...engineCard(tokens, engine) }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{ height: 110, width: '100%', borderRadius: imgR, backgroundColor: tokens.colors.surfaceInverse }}
        />
        <Favorite engine={engine} t={tokens} />
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
