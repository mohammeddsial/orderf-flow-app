// Mirror of the mobile engine token values (apps/mobile/src/theme/engines.ts).
// Used by the admin to auto-render every Border / Shadow / Typography property
// for the selected engine and let the user override them per restaurant.

// Brutalist engine retired — two engines supported.
export type EngineId = 'MINIMALIST_CLEAN' | 'VIBRANT_STREET_TECH';

export interface EngineTokenGroups {
  borders: Record<string, number>;
  shadows: Record<string, string>;
  typography: Record<string, number | string>;
}

export interface TokenOverrides {
  borders?: Record<string, number>;
  shadows?: Record<string, string>;
  typography?: Record<string, number | string>;
}

export const ENGINE_TOKENS: Record<EngineId, EngineTokenGroups> = {
  MINIMALIST_CLEAN: {
    borders: { radiusSharp: 0, radiusSm: 4, radiusMd: 8, radiusLg: 12, radiusXl: 16, radiusPill: 24, widthHairline: 0.5, widthThin: 1, widthMedium: 2, widthThick: 3 },
    shadows: { sm: '0 2px 4px rgba(0,0,0,0.08)', md: '0 4px 8px rgba(0,0,0,0.1)', lg: '0 8px 16px rgba(0,0,0,0.12)', xl: '0 12px 24px rgba(0,0,0,0.15)', '2xl': '0 20px 40px rgba(0,0,0,0.16)', none: 'none' },
    typography: { fontSizeXs: 11, fontSizeSm: 13, fontSizeMd: 15, fontSizeLg: 17, fontSizeXl: 21, lineHeightXs: 16, lineHeightSm: 18, lineHeightMd: 22, lineHeightLg: 26, lineHeightXl: 30, fontWeightLight: 300, fontWeightRegular: 400, fontWeightMedium: 500, fontWeightSemibold: 600, fontWeightBold: 700 },
  },
  VIBRANT_STREET_TECH: {
    borders: { radiusSharp: 0, radiusSm: 6, radiusMd: 12, radiusLg: 16, radiusXl: 20, radiusPill: 32, widthHairline: 0.5, widthThin: 1, widthMedium: 2, widthThick: 3 },
    shadows: { sm: '0 0 8px rgba(0,217,255,0.3)', md: '0 0 16px rgba(0,217,255,0.5)', lg: '0 0 24px rgba(255,0,110,0.4)', xl: '0 0 32px rgba(0,217,255,0.6)', '2xl': '0 0 48px rgba(255,0,110,0.5)', none: 'none' },
    typography: { fontSizeXs: 11, fontSizeSm: 13, fontSizeMd: 15, fontSizeLg: 17, fontSizeXl: 21, lineHeightXs: 16, lineHeightSm: 18, lineHeightMd: 22, lineHeightLg: 26, lineHeightXl: 30, fontWeightLight: 300, fontWeightRegular: 400, fontWeightMedium: 500, fontWeightSemibold: 600, fontWeightBold: 700 },
  },
};

export const TOKEN_GROUPS: { key: keyof EngineTokenGroups; label: string }[] = [
  { key: 'borders', label: 'Borders' },
  { key: 'shadows', label: 'Shadows' },
  { key: 'typography', label: 'Typography' },
];
