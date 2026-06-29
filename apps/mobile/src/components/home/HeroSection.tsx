import React from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { EngineId, layoutConfig } from './engineStyle';


const { height: SCREEN_H } = Dimensions.get('window');

// Royalty-free, muted-friendly looping food b-roll. Swap for a branded asset.
const HERO_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

type Props = {
  brandName: string;
  onExplore: () => void;
};

export const HeroSection: React.FC<Props> = ({ brandName, onExplore }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const insets = useSafeAreaInsets();
  const layout = layoutConfig(engine);

  const player = useVideoPlayer(HERO_VIDEO, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const heroHeight = Math.round(SCREEN_H * layout.heroHeightRatio);

  const titleStyle =
    engine === 'VIBRANT_STREET_TECH'
      ? {
          textShadowColor: tokens.colors.secondary,
          textShadowRadius: 16,
          textShadowOffset: { width: 0, height: 0 },
        }
      : null;

  const ctaChrome =
    engine === 'BRUTALIST_MODERNIST'
      ? { borderRadius: 0, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#000000' }
      : engine === 'VIBRANT_STREET_TECH'
      ? {
          borderRadius: tokens.borders.radiusPill,
          backgroundColor: 'rgba(0,217,255,0.18)',
          borderWidth: 1,
          borderColor: tokens.colors.secondary,
        }
      : { borderRadius: tokens.borders.radiusPill, backgroundColor: 'rgba(255,255,255,0.92)' };

  const ctaTextColor =
    engine === 'VIBRANT_STREET_TECH' ? tokens.colors.secondary : '#111111';

  return (
    <View style={{ height: heroHeight, backgroundColor: tokens.colors.surfaceInverse }}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
        />
      </View>

      {/* Cinematic bottom-up scrim for text legibility. */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'transparent' },
        ]}
      >
        <View style={{ flex: 1 }} />
        <View style={{ height: '55%', backgroundColor: 'rgba(0,0,0,0.45)' }} />
      </View>

      <View
        style={{
          position: 'absolute',
          left: tokens.spacing.lg,
          right: tokens.spacing.lg,
          bottom: insets.bottom + tokens.spacing.xl,
        }}
      >
        <Text
          style={[
            {
              color: '#FFFFFF',
              fontSize: 40,
              lineHeight: 44,
              fontWeight: engine === 'MINIMALIST_CLEAN' ? '700' : '900',
              textTransform: engine === 'MINIMALIST_CLEAN' ? 'none' : 'uppercase',
              letterSpacing: engine === 'MINIMALIST_CLEAN' ? -1 : 1,
              marginBottom: tokens.spacing.sm,
            },
            titleStyle,
          ]}
        >
          {brandName}
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: tokens.typography.fontSizeLg,
            marginBottom: tokens.spacing.lg,
          }}
        >
          Crafted fast. Delivered hot.
        </Text>
        <Pressable
          onPress={onExplore}
          style={{
            alignSelf: 'flex-start',
            paddingVertical: tokens.spacing.md,
            paddingHorizontal: tokens.spacing.xl,
            ...ctaChrome,
          }}
        >
          <Text style={{ color: ctaTextColor, fontWeight: '700', fontSize: tokens.typography.fontSizeMd }}>
            Explore the menu
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HeroSection;
