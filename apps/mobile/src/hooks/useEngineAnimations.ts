import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInDown,
  SharedValue,
  EasingFunction,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import { EngineId } from '../components/home/engineStyle';
import { getAnimationConfig } from '../theme/animations';

export function useEngineAnimations() {
  const { engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const config = getAnimationConfig(engine);

  const pressScaleIn = useCallback((sv: SharedValue<number>) => {
    if (engine === 'VIBRANT_STREET_TECH' && config.springConfig) {
      sv.value = withSpring(config.pressScale, config.springConfig);
    } else {
      sv.value = withTiming(config.pressScale, {
        duration: config.enterDuration,
        easing: config.enterEasing,
      });
    }
  }, [engine, config]);

  const pressScaleOut = useCallback((sv: SharedValue<number>) => {
    if (engine === 'VIBRANT_STREET_TECH' && config.springConfig) {
      sv.value = withSpring(1, config.springConfig);
    } else {
      sv.value = withTiming(1, {
        duration: config.enterDuration,
        easing: config.enterEasing,
      });
    }
  }, [engine, config]);

  const enteringAnimation = config.enterDuration > 0
    ? FadeInDown.duration(config.enterDuration)
        .easing(config.enterEasing as EasingFunction)
        .withInitialValues({ opacity: 0, transform: [{ translateY: config.scrollRevealOffset }] } as any)
    : undefined;

  return { engine, config, pressScaleIn, pressScaleOut, enteringAnimation };
}

export function useAnimatedPressScale() {
  const scale = useSharedValue(1);
  const { pressScaleIn, pressScaleOut } = useEngineAnimations();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => pressScaleIn(scale), [pressScaleIn, scale]);
  const onPressOut = useCallback(() => pressScaleOut(scale), [pressScaleOut, scale]);

  return { animatedStyle, onPressIn, onPressOut };
}
