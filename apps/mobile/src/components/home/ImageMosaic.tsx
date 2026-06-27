// apps/mobile/src/components/home/ImageMosaic.tsx
import React from 'react';
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import { useTheme } from '../../theme';
import { EngineId, cardChrome, sectionTitleStyle } from './engineStyle';
import { getPlaceholderImage } from '@multi-restaurant/database';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MosaicTile {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
}

const MOSAIC_DATA: MosaicTile[] = [
  {
    id: 'm1',
    imageUrl: 'https://via.placeholder.com/400x300?text=Seasonal+Special',
    title: 'Seasonal Special',
    subtitle: 'Try our summer menu',
  },
  {
    id: 'm2',
    imageUrl: 'https://via.placeholder.com/400x300?text=Chef+Pick',
    title: 'Chef’s Pick',
    subtitle: 'Wagyu beef & truffle',
  },
  {
    id: 'm3',
    imageUrl: 'https://via.placeholder.com/400x300?text=Happy+Hour',
    title: 'Happy Hour',
    subtitle: '4–7 PM daily',
  },
];

export const ImageMosaic: React.FC<{ onTilePress: (tile: MosaicTile) => void; heading?: string }> = ({ onTilePress, heading }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  const tileWidth = (SCREEN_WIDTH - tokens.spacing.md * 3) / 2;

  return (
    <View style={{ marginBottom: tokens.spacing.lg, paddingHorizontal: tokens.spacing.md }}>
      <Text style={sectionTitleStyle(tokens, engine)}>{heading ?? 'Seasonal Highlights'}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.md }}>
        {MOSAIC_DATA.map((tile, index) => {
          const fullWidth = index === 0;
          const imageUrl = tile.imageUrl || getPlaceholderImage(tile.title);
          return (
            <Pressable
              key={tile.id}
              onPress={() => onTilePress(tile)}
              style={{
                width: fullWidth ? '100%' : tileWidth,
                height: fullWidth ? 160 : 120,
                overflow: 'hidden',
                ...cardChrome(tokens, engine),
                padding: 0,
              }}
            >
             
              <Image
                source={{ uri: imageUrl }}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: tokens.spacing.sm,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: tokens.typography.fontSizeMd }}>
                  {tile.title}
                </Text>
                {tile.subtitle ? (
                  <Text style={{ color: '#FFFFFF', opacity: 0.8, fontSize: tokens.typography.fontSizeXs }}>
                    {tile.subtitle}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};