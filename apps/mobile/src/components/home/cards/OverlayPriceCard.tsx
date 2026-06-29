// apps/mobile/src/components/home/cards/OverlayPriceCard.tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { engineCard, Favorite, RatingRow, imageRadiusFor } from './shared';
import { EngineId } from '../engineStyle';

interface CardProps {
  item: any;
  onPress: (id: string) => void;
  onAdd?: (id: string) => void;
}

export const OverlayPriceCard: React.FC<CardProps> = ({ item, onPress }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);
  const imgR = imageRadiusFor(engine, tokens);
  const pillR = engine === 'BRUTALIST_MODERNIST' ? 0 : 999;

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ width: 180, padding: tokens.spacing.sm, ...engineCard(tokens, engine) }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{ height: 124, width: '100%', borderRadius: imgR, backgroundColor: tokens.colors.surfaceInverse }}
        />
        <Favorite engine={engine} t={tokens} />
        <View style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: tokens.colors.primary, borderRadius: pillR, paddingHorizontal: 14, paddingVertical: 6 }}>
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
