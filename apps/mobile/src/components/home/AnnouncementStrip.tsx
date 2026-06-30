// apps/mobile/src/components/home/AnnouncementStrip.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../theme';
import { EngineId } from './engineStyle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock announcements – can be fetched from backend later
const ANNOUNCEMENTS = [
  '🔥 New Spicy Inferno Burger – try it now!',
  '🍟 Free fries with any combo – limited time!',
  '📍 Now delivering to downtown!',
  '🎉 Download our app for exclusive deals!',
];

export const AnnouncementStrip: React.FC = () => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.timing(scrollX, {
          toValue: -SCREEN_WIDTH * (ANNOUNCEMENTS.length - 1),
          duration: ANNOUNCEMENTS.length * 4000,
          useNativeDriver: true,
        })
      ).start();
    };
    startAnimation();
  }, []);

  const translateX = scrollX.interpolate({
    inputRange: [-SCREEN_WIDTH * (ANNOUNCEMENTS.length - 1), 0],
    outputRange: [-SCREEN_WIDTH * (ANNOUNCEMENTS.length - 1), 0],
  });

  return (
    <View
      style={{
        backgroundColor:
          engine === 'VIBRANT_STREET_TECH'
            ? tokens.colors.surface
            : tokens.colors.accentLight,
        paddingVertical: tokens.spacing.sm,
        overflow: 'hidden',
        borderBottomWidth: tokens.borders.thin,
        borderBottomColor: tokens.colors.border,
      }}
    >
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [{ translateX }],
          width: SCREEN_WIDTH * ANNOUNCEMENTS.length,
        }}
      >
        {ANNOUNCEMENTS.map((msg, index) => (
          <View
            key={index}
            style={{
              width: SCREEN_WIDTH,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: tokens.spacing.md,
            }}
          >
            <Text
              style={{
                color:
                  engine === 'VIBRANT_STREET_TECH'
                    ? tokens.colors.secondary
                    : tokens.colors.text,
                fontSize: tokens.typography.fontSizeSm,
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              {msg}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};