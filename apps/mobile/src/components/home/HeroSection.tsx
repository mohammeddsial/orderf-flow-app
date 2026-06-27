import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet, Image } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { EngineId } from './engineStyle';
import { CardVariant } from './cardVariants';
import { resolveMedia } from '../../api/client';


const { height: SCREEN_H } = Dimensions.get('window');

// Royalty-free, muted-friendly looping food b-roll. Swap for a branded asset.
const HERO_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

type Props = {
  brandName: string;
  onExplore: () => void;
  // 'video' (default) plays the looping hero video; 'slides' shows a
  // 3-image auto-rotating slideshow instead.
  variant?: CardVariant;
  // Admin-uploaded hero media (video URL and/or slide image URLs).
  media?: { videoUrl?: string; slides?: string[] };
};

export const HeroSection: React.FC<Props> = ({ brandName, onExplore, variant, media }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const insets = useSafeAreaInsets();

  const isSlides = variant === 'slides';

  // Use the admin-uploaded video if present, otherwise the default b-roll.
  const videoUri = (media?.videoUrl && resolveMedia(media.videoUrl)) || HERO_VIDEO;
  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  // Slideshow: admin-uploaded images if provided, else generated placeholders.
  const uploadedSlides = (media?.slides || []).map((u) => resolveMedia(u)!).filter(Boolean);
  const slides = uploadedSlides.length
    ? uploadedSlides
    : [
        `https://picsum.photos/seed/${encodeURIComponent(brandName)}-hero1/900/1300`,
        `https://picsum.photos/seed/${encodeURIComponent(brandName)}-hero2/900/1300`,
        `https://picsum.photos/seed/${encodeURIComponent(brandName)}-hero3/900/1300`,
      ];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (!isSlides) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [isSlides, slides.length]);

  const heroHeight = Math.round(SCREEN_H * 0.78);

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
        {isSlides ? (
          <Image source={{ uri: slides[slide] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            nativeControls={false}
          />
        )}
      </View>

      {isSlides ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: insets.top + 12,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === slide ? 18 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === slide ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </View>
      ) : null}

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
