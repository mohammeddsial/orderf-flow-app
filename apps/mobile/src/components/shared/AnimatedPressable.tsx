import React, { useRef } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { EngineId } from '../home/engineStyle';
import { getAnimationConfig } from '../../theme/animations';

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({ children, style, onPressIn, onPressOut, ...props }) => {
  const { engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const config = getAnimationConfig(engine);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    if (engine === 'VIBRANT_STREET_TECH' && config.springConfig) {
      scale.value = withSpring(config.pressScale, config.springConfig);
    } else {
      scale.value = withTiming(config.pressScale, {
        duration: config.enterDuration,
        easing: config.enterEasing,
      });
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    if (engine === 'VIBRANT_STREET_TECH' && config.springConfig) {
      scale.value = withSpring(1, config.springConfig);
    } else {
      scale.value = withTiming(1, {
        duration: config.enterDuration,
        easing: config.enterEasing,
      });
    }
    onPressOut?.(e);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={style} {...props}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
};
