// apps/mobile/src/components/home/cards/FeatureCard.tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { engineCard, Favorite, RatingRow, PricePill, ActionButton, imageRadiusFor } from './shared';
import { EngineId } from '../engineStyle';

interface CardProps {
  item: any;
  onPress: (id: string) => void;
  onAdd?: (id: string) => void;
}

export const FeatureCard: React.FC<CardProps> = ({ item, onPress, onAdd }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);
  const imgR = imageRadiusFor(engine, tokens);

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ padding: tokens.spacing.sm, ...engineCard(tokens, engine) }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{ height: 180, width: '100%', borderRadius: imgR, backgroundColor: tokens.colors.surfaceInverse }}
        />
        <Favorite engine={engine} t={tokens} />
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
          <PricePill t={tokens} engine={engine}>${item.basePrice.toFixed(2)}</PricePill>
          <ActionButton t={tokens} engine={engine} label="Add" onPress={() => onAdd?.(item.id)} />
        </View>
      </View>
    </Pressable>
  );
};
