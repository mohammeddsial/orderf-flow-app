import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { type EngineId } from '../home/engineStyle';
import { getAnimationConfig } from '../../theme/animations';

const { width: SCREEN_W } = Dimensions.get('window');

interface TabBarIndicatorProps {
  activeIndex: number;
  tabCount: number;
  engine: EngineId;
  indicatorColor: string;
  indicatorHeight?: number;
}

export const TabBarIndicator: React.FC<TabBarIndicatorProps> = ({
  activeIndex,
  tabCount,
  engine,
  indicatorColor,
  indicatorHeight = 3,
}) => {
  const { tokens } = useTheme();
  const translateX = useSharedValue(0);
  const config = getAnimationConfig(engine);

  const tabWidth = SCREEN_W / tabCount;

  useEffect(() => {
    const target = activeIndex * tabWidth;
    if (engine === 'VIBRANT_STREET_TECH' && config.springConfig) {
      translateX.value = withSpring(target, config.springConfig);
    } else {
      translateX.value = withTiming(target, {
        duration: config.tabSwitchDuration,
        easing: config.tabSwitchEasing,
      });
    }
  }, [activeIndex, tabWidth, engine, config, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: interpolate(
        translateX.value,
        [0, (tabCount - 1) * tabWidth],
        [1, 1],
      ),
    };
  });

  return (
    <Animated.View
      style={[
        styles.indicator,
        animatedStyle,
        {
          width: tabWidth * 0.4,
          height: indicatorHeight,
          backgroundColor: indicatorColor,
          borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : indicatorHeight,
          alignSelf: 'center',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    bottom: 2,
    left: 0,
  },
});

export default TabBarIndicator;
