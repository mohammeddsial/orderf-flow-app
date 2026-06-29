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

// ---------------------------------------------------------------------------
// Per-engine LAYOUT config — structural decisions (not just chrome).
// This is what makes each engine render a *different* JSX tree, not just a
// re-skinned version of the same layout.
// ---------------------------------------------------------------------------

export type HeroStyle = 'full-bleed' | 'split' | 'compact';
export type CategoryLayout = 'grid-2x2' | 'list' | 'carousel';
export type CardImagePosition = 'left' | 'top' | 'background';
export type SectionSpacing = 'tight' | 'normal' | 'airy';
export type FeaturedCardStyle = 'stacked' | 'overlay' | 'editorial';
export type PopularLayout = 'horizontal' | 'grid' | 'list';

export interface LayoutConfig {
  heroStyle: HeroStyle;
  heroHeightRatio: number;
  categoryLayout: CategoryLayout;
  cardImagePosition: CardImagePosition;
  sectionSpacing: SectionSpacing;
  featuredCardStyle: FeaturedCardStyle;
  popularLayout: PopularLayout;
  gridColumns: number;
}

export const layoutConfig = (engine: EngineId): LayoutConfig => {
  if (engine === 'BRUTALIST_MODERNIST') {
    return {
      heroStyle: 'full-bleed',
      heroHeightRatio: 0.85,
      categoryLayout: 'list',
      cardImagePosition: 'left',
      sectionSpacing: 'tight',
      featuredCardStyle: 'stacked',
      popularLayout: 'list',
      gridColumns: 1,
    };
  }
  if (engine === 'VIBRANT_STREET_TECH') {
    return {
      heroStyle: 'split',
      heroHeightRatio: 0.6,
      categoryLayout: 'carousel',
      cardImagePosition: 'background',
      sectionSpacing: 'airy',
      featuredCardStyle: 'overlay',
      popularLayout: 'horizontal',
      gridColumns: 2,
    };
  }
  // MINIMALIST_CLEAN
  return {
    heroStyle: 'compact',
    heroHeightRatio: 0.5,
    categoryLayout: 'grid-2x2',
    cardImagePosition: 'top',
    sectionSpacing: 'normal',
    featuredCardStyle: 'editorial',
    popularLayout: 'horizontal',
    gridColumns: 2,
  };
};

// Helper to convert section spacing token to actual pixel value.
export const sectionGap = (t: ThemeTokens, spacing: SectionSpacing): number => {
  if (spacing === 'tight') return t.spacing.md;
  if (spacing === 'airy') return t.spacing['2xl'];
  return t.spacing.lg;
};

// Helper to pick image radius per engine (brutalist = sharp, others = rounded).
export const imageRadiusFor = (engine: EngineId, t: ThemeTokens): number => {
  if (engine === 'BRUTALIST_MODERNIST') return 0;
  if (engine === 'VIBRANT_STREET_TECH') return t.borders.radiusMd;
  return t.borders.radiusMd;
};
