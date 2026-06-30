import { EngineId } from '../components/home/engineStyle';
import { Easing } from 'react-native-reanimated';

export interface EngineAnimationConfig {
  pressScale: number;
  enterDuration: number;
  enterEasing: any;
  scrollRevealOffset: number;
  tabSwitchDuration: number;
  tabSwitchEasing: any;
  springConfig?: { damping: number; stiffness: number; mass: number };
  labelFadeDuration: number;
  iconScaleActive: number;
  iconScaleInactive: number;
}

export const ANIMATION_CONFIGS: Record<EngineId, EngineAnimationConfig> = {
  BRUTALIST_MODERNIST: {
    pressScale: 0.98,
    enterDuration: 150,
    enterEasing: Easing.linear,
    scrollRevealOffset: 0,
    tabSwitchDuration: 150,
    tabSwitchEasing: Easing.linear,
    labelFadeDuration: 0,
    iconScaleActive: 1.1,
    iconScaleInactive: 1.0,
  },

  MINIMALIST_CLEAN: {
    pressScale: 0.98,
    enterDuration: 300,
    enterEasing: Easing.out(Easing.exp),
    scrollRevealOffset: 20,
    tabSwitchDuration: 300,
    tabSwitchEasing: Easing.out(Easing.exp),
    labelFadeDuration: 200,
    iconScaleActive: 1.15,
    iconScaleInactive: 1.0,
  },

  VIBRANT_STREET_TECH: {
    pressScale: 0.95,
    enterDuration: 400,
    enterEasing: Easing.out(Easing.back(2)),
    scrollRevealOffset: 30,
    tabSwitchDuration: 0,
    tabSwitchEasing: Easing.linear,
    springConfig: { damping: 12, stiffness: 120, mass: 1 },
    labelFadeDuration: 0,
    iconScaleActive: 1.3,
    iconScaleInactive: 1.0,
  },
};

export function getAnimationConfig(engine: EngineId): EngineAnimationConfig {
  return ANIMATION_CONFIGS[engine] ?? ANIMATION_CONFIGS.MINIMALIST_CLEAN;
}
