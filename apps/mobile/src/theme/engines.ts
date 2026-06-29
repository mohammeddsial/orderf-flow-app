import { UIStyleEngine } from '@multi-restaurant/database';

export interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceInverse: string;
    text: string;
    textInverse: string;
    textDisabled: string;
    border: string;
    borderLight: string;
    borderHeavy: string;
    accent: string;
    accentLight: string;
    error: string;
    errorLight: string;
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    overlay: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  typography: {
    fontSizeXs: number;
    fontSizeSm: number;
    fontSizeMd: number;
    fontSizeLg: number;
    fontSizeXl: number;
    lineHeightXs: number;
    lineHeightSm: number;
    lineHeightMd: number;
    lineHeightLg: number;
    lineHeightXl: number;
    fontWeightLight: 300;
    fontWeightRegular: 400;
    fontWeightMedium: 500;
    fontWeightSemibold: 600;
    fontWeightBold: 700;
    fontFamily?: string;
    fontFamilyBold?: string;
  };
  borders: {
    radiusSharp: number;
    radiusSm: number;
    radiusMd: number;
    radiusLg: number;
    radiusXl: number;
    radiusPill: number;
    widthHairline: number;
    widthThin: number;
    widthMedium: number;
    widthThick: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    none: string;
  };
  opacity: {
    0: number;
    5: number;
    10: number;
    20: number;
    30: number;
    50: number;
    75: number;
    100: number;
  };
}

export const BRUTALIST_MODERNIST: ThemeTokens = {
  colors: {
    primary: '#000000',
    secondary: '#FF6B35',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceInverse: '#000000',
    text: '#000000',
    textInverse: '#FFFFFF',
    textDisabled: '#999999',
    border: '#000000',
    borderLight: '#CCCCCC',
    borderHeavy: '#000000',
    accent: '#FF6B35',
    accentLight: '#FFB3A1',
    error: '#D32F2F',
    errorLight: '#FFEBEE',
    success: '#388E3C',
    successLight: '#E8F5E9',
    warning: '#F57C00',
    warningLight: '#FFF3E0',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 80,
  },
  typography: {
    fontSizeXs: 10,
    fontSizeSm: 12,
    fontSizeMd: 14,
    fontSizeLg: 16,
    fontSizeXl: 20,
    lineHeightXs: 14,
    lineHeightSm: 16,
    lineHeightMd: 20,
    lineHeightLg: 24,
    lineHeightXl: 28,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700,
    fontFamily: 'Poppins_400Regular',
    fontFamilyBold: 'Poppins_600SemiBold',
  },
  borders: {
    radiusSharp: 0,
    radiusSm: 0,
    radiusMd: 0,
    radiusLg: 0,
    radiusXl: 0,
    radiusPill: 0,
    widthHairline: 0.5,
    widthThin: 1,
    widthMedium: 2,
    widthThick: 3,
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.3)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.3)',
    none: 'none',
  },
  opacity: {
    0: 0,
    5: 0.05,
    10: 0.1,
    20: 0.2,
    30: 0.3,
    50: 0.5,
    75: 0.75,
    100: 1,
  },
};

export const MINIMALIST_CLEAN: ThemeTokens = {
  colors: {
    primary: '#1A1A1A',
    secondary: '#888888',
    background: '#FEFEFE',
    surface: '#FFFFFF',
    surfaceInverse: '#F5F5F5',
    text: '#333333',
    textInverse: '#F5F5F5',
    textDisabled: '#AAAAAA',
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    borderHeavy: '#CCCCCC',
    accent: '#5C6AC4',
    accentLight: '#E8EEFF',
    error: '#C5192D',
    errorLight: '#FDF0F4',
    success: '#008060',
    successLight: '#F0F9F5',
    warning: '#E0BC00',
    warningLight: '#FFFBF0',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  spacing: {
    xs: 6,
    sm: 12,
    md: 20,
    lg: 32,
    xl: 48,
    '2xl': 64,
    '3xl': 80,
    '4xl': 96,
  },
  typography: {
    fontSizeXs: 11,
    fontSizeSm: 13,
    fontSizeMd: 15,
    fontSizeLg: 17,
    fontSizeXl: 21,
    lineHeightXs: 16,
    lineHeightSm: 18,
    lineHeightMd: 22,
    lineHeightLg: 26,
    lineHeightXl: 30,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700,
  },
  borders: {
    radiusSharp: 0,
    radiusSm: 4,
    radiusMd: 8,
    radiusLg: 12,
    radiusXl: 16,
    radiusPill: 24,
    widthHairline: 0.5,
    widthThin: 1,
    widthMedium: 2,
    widthThick: 3,
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.08)',
    md: '0 4px 8px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.12)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.15)',
    '2xl': '0 20px 40px rgba(0, 0, 0, 0.16)',
    none: 'none',
  },
  opacity: {
    0: 0,
    5: 0.05,
    10: 0.1,
    20: 0.2,
    30: 0.3,
    50: 0.5,
    75: 0.75,
    100: 1,
  },
};

export const VIBRANT_STREET_TECH: ThemeTokens = {
  colors: {
    primary: '#0F1419',
    secondary: '#00D9FF',
    background: '#0A0E13',
    surface: '#1A1F2E',
    surfaceInverse: '#00D9FF',
    text: '#FFFFFF',
    textInverse: '#0A0E13',
    textDisabled: '#666666',
    border: '#00D9FF',
    borderLight: '#00D9FF',
    borderHeavy: '#FF006E',
    accent: '#FF006E',
    accentLight: '#FF4D94',
    error: '#FF3333',
    errorLight: '#3D0000',
    success: '#00FF41',
    successLight: '#001A00',
    warning: '#FFAA00',
    warningLight: '#332200',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  spacing: {
    xs: 6,
    sm: 12,
    md: 20,
    lg: 32,
    xl: 48,
    '2xl': 64,
    '3xl': 80,
    '4xl': 96,
  },
  typography: {
    fontSizeXs: 11,
    fontSizeSm: 13,
    fontSizeMd: 15,
    fontSizeLg: 17,
    fontSizeXl: 21,
    lineHeightXs: 16,
    lineHeightSm: 18,
    lineHeightMd: 22,
    lineHeightLg: 26,
    lineHeightXl: 30,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700,
  },
  borders: {
    radiusSharp: 0,
    radiusSm: 6,
    radiusMd: 12,
    radiusLg: 16,
    radiusXl: 20,
    radiusPill: 32,
    widthHairline: 0.5,
    widthThin: 1,
    widthMedium: 2,
    widthThick: 3,
  },
  shadows: {
    sm: '0 0 8px rgba(0, 217, 255, 0.3)',
    md: '0 0 16px rgba(0, 217, 255, 0.5)',
    lg: '0 0 24px rgba(255, 0, 110, 0.4)',
    xl: '0 0 32px rgba(0, 217, 255, 0.6)',
    '2xl': '0 0 48px rgba(255, 0, 110, 0.5)',
    none: 'none',
  },
  opacity: {
    0: 0,
    5: 0.05,
    10: 0.1,
    20: 0.2,
    30: 0.3,
    50: 0.5,
    75: 0.75,
    100: 1,
  },
};

export const getEngineTokens = (style: UIStyleEngine): ThemeTokens => {
  switch (style) {
    case 'BRUTALIST_MODERNIST':
      return BRUTALIST_MODERNIST;
    case 'MINIMALIST_CLEAN':
      return MINIMALIST_CLEAN;
    case 'VIBRANT_STREET_TECH':
      return VIBRANT_STREET_TECH;
    default:
      return BRUTALIST_MODERNIST;
  }
};

export const buildGluestackThemeConfig = (tokens: ThemeTokens, tenantColors: { primary: string; secondary: string; background: string; accent: string }) => {
  return {
    tokens: {
      colors: {
        primary: tenantColors.primary,
        secondary: tenantColors.secondary,
        background: tenantColors.background,
        accent: tenantColors.accent,
        ...tokens.colors,
      },
      space: tokens.spacing,
      sizes: {
        full: '100%',
        screen: '100vw',
      },
      letterSpacings: {
        xs: -0.5,
        sm: 0,
        md: 0.5,
        lg: 1,
        xl: 2,
      },
      lineHeights: {
        xs: tokens.typography.lineHeightXs,
        sm: tokens.typography.lineHeightSm,
        md: tokens.typography.lineHeightMd,
        lg: tokens.typography.lineHeightLg,
        xl: tokens.typography.lineHeightXl,
      },
      fontSizes: {
        xs: tokens.typography.fontSizeXs,
        sm: tokens.typography.fontSizeSm,
        md: tokens.typography.fontSizeMd,
        lg: tokens.typography.fontSizeLg,
        xl: tokens.typography.fontSizeXl,
      },
      fontWeights: {
        light: tokens.typography.fontWeightLight,
        normal: tokens.typography.fontWeightRegular,
        medium: tokens.typography.fontWeightMedium,
        semibold: tokens.typography.fontWeightSemibold,
        bold: tokens.typography.fontWeightBold,
      },
      radii: {
        none: tokens.borders.radiusSharp,
        sm: tokens.borders.radiusSm,
        md: tokens.borders.radiusMd,
        lg: tokens.borders.radiusLg,
        xl: tokens.borders.radiusXl,
        full: tokens.borders.radiusPill,
      },
      borders: {
        hairline: tokens.borders.widthHairline,
        thin: tokens.borders.widthThin,
        medium: tokens.borders.widthMedium,
        thick: tokens.borders.widthThick,
      },
      shadows: tokens.shadows,
      opacity: tokens.opacity,
    },
  };
};
