// apps/mobile/src/components/home/cards/QtyRowCard.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { engineCard, imageRadiusFor } from './shared';
import { EngineId } from '../engineStyle';

interface CardProps {
  item: any;
  onPress: (id: string) => void;
  onAdd?: (id: string, qty: number) => void;
}

export const QtyRowCard: React.FC<CardProps> = ({ item, onPress, onAdd }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);
  const [qty, setQty] = useState(1);
  const imgR = imageRadiusFor(engine, tokens);
  const stepR = engine === 'BRUTALIST_MODERNIST' ? 0 : 14;

  const stepBtn = {
    width: 28,
    height: 28,
    borderRadius: stepR,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ flexDirection: 'row', alignItems: 'center', padding: tokens.spacing.sm, ...engineCard(tokens, engine) }}>
      <Image
        source={{ uri: imageUrl }}
        resizeMode="cover"
        style={{ width: 64, height: 64, borderRadius: imgR, backgroundColor: tokens.colors.surfaceInverse, marginRight: tokens.spacing.md }}
      />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeMd, color: tokens.colors.text }}>{item.title}</Text>
        <Text numberOfLines={1} style={{ fontSize: tokens.typography.fontSizeSm, color: tokens.colors.textDisabled, marginTop: 2 }}>{item.description}</Text>
        <Text style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeMd, color: tokens.colors.primary, marginTop: 4 }}>${item.basePrice.toFixed(2)}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable onPress={() => setQty(Math.max(1, qty - 1))} style={{ ...stepBtn, borderWidth: 1.5, borderColor: tokens.colors.accent }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: tokens.colors.accent }}>−</Text>
        </Pressable>
        <Text style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeMd, color: tokens.colors.text, minWidth: 16, textAlign: 'center' }}>{qty}</Text>
        <Pressable onPress={() => { const next = qty + 1; setQty(next); onAdd?.(item.id, next); }} style={{ ...stepBtn, backgroundColor: tokens.colors.accent }}>
          <Text style={{ color: tokens.colors.textInverse, fontSize: 16, fontWeight: '800' }}>+</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
