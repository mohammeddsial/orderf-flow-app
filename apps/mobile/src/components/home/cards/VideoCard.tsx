import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';
import { engineCard, PricePill, ActionButton, imageRadiusFor } from './shared';
import { EngineId } from '../engineStyle';

interface CardProps {
  item: any;
  onPress: (id: string) => void;
  onAdd?: (id: string) => void;
}

export const VideoCard: React.FC<CardProps> = ({ item, onPress, onAdd }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const imgR = imageRadiusFor(engine, tokens);
  const imageUrl = item.imageUrl || getPlaceholderImage(item.title);
  const [playing, setPlaying] = useState(false);

  return (
    <Pressable onPress={() => onPress(item.id)} style={{ ...engineCard(tokens, engine) }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{
            height: 200,
            width: '100%',
            borderRadius: imgR,
            backgroundColor: tokens.colors.surfaceInverse,
          }}
        />
        <Pressable
          onPress={() => setPlaying((p) => !p)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 28,
              backgroundColor: 'rgba(0,0,0,0.55)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 24, marginLeft: 3 }}>
              {playing ? '⏸' : '▶'}
            </Text>
          </View>
        </Pressable>

        <View
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>0:30</Text>
        </View>
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
