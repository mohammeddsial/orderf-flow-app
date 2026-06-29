import React, { useState } from 'react';
import { View, Text, Pressable, Image, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { engineCard, PricePill, ActionButton, imageRadiusFor } from './shared';
import { EngineId } from '../engineStyle';

const SCREEN_W = Dimensions.get('window').width;

interface CardProps {
  item: any;
  onPress: (id: string) => void;
  onAdd?: (id: string) => void;
}

export const SlidesCard: React.FC<CardProps> = ({ item, onPress, onAdd }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const imgR = imageRadiusFor(engine, tokens);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    item.imageUrl || getPlaceholderImage(item.title),
    getPlaceholderImage(`${item.title}-2`),
    getPlaceholderImage(`${item.title}-3`),
  ];

  const slideW = SCREEN_W - tokens.spacing.md * 4;

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ ...engineCard(tokens, engine) }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / slideW);
          setActiveSlide(idx);
        }}
        style={{ borderRadius: imgR, overflow: 'hidden' }}
      >
        {slides.map((uri, i) => (
          <Image
            key={i}
            source={{ uri }}
            resizeMode="cover"
            style={{
              width: slideW,
              height: 180,
              backgroundColor: tokens.colors.surfaceInverse,
            }}
          />
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: tokens.spacing.sm }}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={{
              width: activeSlide === i ? 16 : 6,
              height: 6,
              borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 3,
              backgroundColor: activeSlide === i ? tokens.colors.primary : tokens.colors.surfaceInverse,
            }}
          />
        ))}
      </View>

      <View style={{ padding: tokens.spacing.sm }}>
        <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeLg, color: tokens.colors.text }}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm, marginTop: 2 }}>
          {item.description}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: tokens.spacing.sm }}>
          <PricePill t={tokens} engine={engine}>${item.basePrice.toFixed(2)}</PricePill>
          <ActionButton t={tokens} engine={engine} label="Add" onPress={() => onAdd?.(item.id)} />
        </View>
      </View>
    </Pressable>
  );
};
