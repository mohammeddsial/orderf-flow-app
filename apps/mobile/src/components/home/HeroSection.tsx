import React from 'react';
import { View, Text, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { EngineId, layoutConfig, imageRadiusFor } from './engineStyle';


const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

// Royalty-free, muted-friendly looping food b-roll. Swap for a branded asset.
const HERO_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200';

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

  const titleFontWeight = engine === 'MINIMALIST_CLEAN' ? '700' : '900';
  const titleTransform = engine === 'MINIMALIST_CLEAN' ? 'none' : 'uppercase';
  const titleLetterSpacing = engine === 'MINIMALIST_CLEAN' ? -1 : 1;

  // ── Split hero (Vibrant) — video left, text right ──
  if (layout.heroStyle === 'split') {
    return (
      <View style={{ height: heroHeight, backgroundColor: tokens.colors.surface, flexDirection: 'row' }}>
        <View style={{ flex: 1, overflow: 'hidden' }}>
          <VideoView
            player={player}
            style={{ flex: 1 }}
            contentFit="cover"
            nativeControls={false}
          />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: tokens.spacing.xl, paddingVertical: tokens.spacing.xl, paddingTop: insets.top + tokens.spacing.xl }}>
          <Text
            style={{
              color: tokens.colors.text,
              fontSize: 36,
              lineHeight: 40,
              fontWeight: titleFontWeight,
              textTransform: titleTransform,
              letterSpacing: titleLetterSpacing,
              marginBottom: tokens.spacing.sm,
            }}
          >
            {brandName}
          </Text>
          <Text
            style={{
              color: tokens.colors.textDisabled,
              fontSize: tokens.typography.fontSizeMd,
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
              Explore menu
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Compact hero (Minimalist) — smaller image, no video ──
  if (layout.heroStyle === 'compact') {
    return (
      <View
        style={{
          height: heroHeight,
          backgroundColor: tokens.colors.surface,
          marginBottom: 0,
        }}
      >
        <Image
          source={{ uri: HERO_IMAGE }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          resizeMode="cover"
        />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.25)' }]} />
        <View
          style={{
            position: 'absolute',
            left: tokens.spacing.lg,
            right: tokens.spacing.lg,
            bottom: insets.bottom + tokens.spacing.lg,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 32,
              lineHeight: 36,
              fontWeight: titleFontWeight,
              textTransform: titleTransform,
              letterSpacing: titleLetterSpacing,
              marginBottom: tokens.spacing.xs,
            }}
          >
            {brandName}
          </Text>
          <Pressable
            onPress={onExplore}
            style={{
              alignSelf: 'flex-start',
              paddingVertical: tokens.spacing.sm,
              paddingHorizontal: tokens.spacing.lg,
              ...ctaChrome,
            }}
          >
            <Text style={{ color: ctaTextColor, fontWeight: '700', fontSize: tokens.typography.fontSizeSm }}>
              Explore
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Full-bleed hero (Brutalist / default) — full-screen video, text overlay ──
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

      <View pointerEvents="none" style={[StyleSheet.absoluteFill]}>
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
          style={{
            color: '#FFFFFF',
            fontSize: 40,
            lineHeight: 44,
            fontWeight: titleFontWeight,
            textTransform: titleTransform,
            letterSpacing: titleLetterSpacing,
            marginBottom: tokens.spacing.sm,
          }}
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
