import { ViewStyle, TextStyle } from 'react-native';
import { ThemeTokens } from '../../theme/engines';

// The three design engines. Kept as a local literal union so the home modules
// don't take a hard dependency on the database package's type surface.
export type EngineId =
  | 'BRUTALIST_MODERNIST'
  | 'MINIMALIST_CLEAN'
  | 'VIBRANT_STREET_TECH';

export const isDarkEngine = (engine: EngineId): boolean =>
  engine === 'VIBRANT_STREET_TECH';

// Per-engine "chrome" for a content card. This is what makes the three UIs
// feel structurally different rather than merely recolored:
//  - Brutalist: square, thick hard border, no shadow.
//  - Minimalist: soft radius, gentle drop shadow, no border.
//  - Vibrant: neon border + colored glow (faux-glassmorphism on dark surface).
export const cardChrome = (t: ThemeTokens, engine: EngineId): ViewStyle => {
  if (engine === 'BRUTALIST_MODERNIST') {
    return {
      backgroundColor: t.colors.surface,
      borderRadius: 0,
      borderWidth: t.borders.widthThick,
      borderColor: t.colors.border,
    };
  }
  if (engine === 'VIBRANT_STREET_TECH') {
    return {
      backgroundColor: t.colors.surface,
      borderRadius: t.borders.radiusMd,
      borderWidth: t.borders.widthThin,
      borderColor: t.colors.border,
      shadowColor: t.colors.accent,
      shadowOpacity: 0.5,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    };
  }
  // MINIMALIST_CLEAN
  return {
    backgroundColor: t.colors.surface,
    borderRadius: t.borders.radiusLg,
    borderWidth: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  };
};

// Per-engine section title treatment.
export const sectionTitleStyle = (t: ThemeTokens, engine: EngineId): TextStyle => {
  const base: TextStyle = {
    fontSize: t.typography.fontSizeXl,
    color: t.colors.text,
  };
  if (engine === 'BRUTALIST_MODERNIST') {
    return { ...base, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 };
  }
  if (engine === 'VIBRANT_STREET_TECH') {
    return {
      ...base,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      color: t.colors.secondary,
      textShadowColor: t.colors.secondary,
      textShadowRadius: 12,
      textShadowOffset: { width: 0, height: 0 },
    };
  }
  return { ...base, fontWeight: '700', letterSpacing: -0.4 };
};

// Per-engine pill/chip (toggles, tags, CTAs).
export const pillChrome = (
  t: ThemeTokens,
  engine: EngineId,
  active: boolean
): ViewStyle => {
  if (engine === 'BRUTALIST_MODERNIST') {
    return {
      borderRadius: 0,
      borderWidth: t.borders.widthMedium,
      borderColor: t.colors.border,
      backgroundColor: active ? t.colors.primary : t.colors.surface,
    };
  }
  if (engine === 'VIBRANT_STREET_TECH') {
    return {
      borderRadius: t.borders.radiusPill,
      borderWidth: t.borders.widthThin,
      borderColor: active ? t.colors.secondary : t.colors.border,
      backgroundColor: active ? 'rgba(0,217,255,0.15)' : 'transparent',
    };
  }
  return {
    borderRadius: t.borders.radiusPill,
    borderWidth: active ? 0 : t.borders.widthThin,
    borderColor: t.colors.borderLight,
    backgroundColor: active ? t.colors.primary : t.colors.surface,
  };
};

// Per-engine round quick-add ("+") button chrome.
export const quickAddChrome = (t: ThemeTokens, engine: EngineId): ViewStyle => {
  if (engine === 'BRUTALIST_MODERNIST') {
    return {
      borderRadius: 0,
      backgroundColor: t.colors.primary,
      borderWidth: t.borders.widthThin,
      borderColor: t.colors.border,
    };
  }
  if (engine === 'VIBRANT_STREET_TECH') {
    return {
      borderRadius: 999,
      backgroundColor: t.colors.accent,
      shadowColor: t.colors.accent,
      shadowOpacity: 0.8,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      elevation: 8,
    };
  }
  return {
    borderRadius: 999,
    backgroundColor: t.colors.primary,
  };
};
