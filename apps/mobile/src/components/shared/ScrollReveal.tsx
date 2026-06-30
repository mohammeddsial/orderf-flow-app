import React, { useMemo } from 'react';
import Animated, { FadeInDown, FadeIn, SlideInDown, EasingFunction } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { EngineId } from '../home/engineStyle';
import { getAnimationConfig } from '../../theme/animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  index?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, index = 0 }) => {
  const { engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const config = getAnimationConfig(engine);

  const entering = useMemo(() => {
    if (config.enterDuration === 0) return undefined;
    const delay = index * 60;
    return FadeInDown
      .duration(config.enterDuration)
      .delay(delay)
      .easing(config.enterEasing as EasingFunction)
      .withInitialValues({
        opacity: 0,
        transform: [{ translateY: config.scrollRevealOffset }],
      } as any);
  }, [config, index]);

  if (!entering) {
    return <>{children}</>;
  }

  return <Animated.View entering={entering}>{children}</Animated.View>;
};
