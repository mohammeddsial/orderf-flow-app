import React, { createContext, useContext, useMemo, ReactNode, useState, useCallback } from 'react';
import { useTenant, UIStyleEngine } from '@multi-restaurant/database';
import { getEngineTokens, ThemeTokens } from './engines';

interface ThemeContextValue {
  tokens: ThemeTokens;
  engineStyle: string;
  forceRefresh: () => void;
  setEngine: (style: UIStyleEngine) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Pick readable text color (black/white) for content sitting on top of `hex`.
function contrastOn(hex?: string): string {
  if (!hex || !/^#?[0-9a-fA-F]{3,6}$/.test(hex)) return '#FFFFFF';
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#111111' : '#FFFFFF';
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tenant = useTenant();

  // Optional in-app override so a UI switcher can preview all three engines live.
  const [engineOverride, setEngineOverride] = useState<UIStyleEngine | null>(null);
  const activeStyle = engineOverride ?? tenant.activeUiStyle;

  // Engine controls structure (radius, shadows, spacing, typography, borders);
  // the restaurant's brand colors drive the palette.
  const tokens = useMemo<ThemeTokens>(() => {
    const base = getEngineTokens(activeStyle);
    const primary = tenant.primaryColor || base.colors.primary;
    const accent = tenant.accentColor || base.colors.accent;
    const background = tenant.backgroundColor || base.colors.background;
    const foreground = tenant.secondaryColor || base.colors.text; // "Foreground — text & icons"

    // Per-restaurant overrides for engine tokens, edited in the admin
    // (Restaurant Settings → Style & Typography). Applied on top of the engine.
    const ov = ((tenant as any).tokenOverrides || {}) as {
      borders?: Record<string, number>;
      shadows?: Record<string, string>;
      typography?: Record<string, number | string>;
    };

    return {
      ...base,
      colors: {
        ...base.colors,
        primary,
        secondary: tenant.secondaryColor || base.colors.secondary,
        accent,
        accentLight: tenant.accentLightColor || base.colors.accentLight,
        background,
        surface: tenant.surfaceColor || base.colors.surface,
        surfaceInverse: primary,
        text: foreground,
        textInverse: contrastOn(primary),
      },
      borders: { ...base.borders, ...(ov.borders || {}) },
      shadows: { ...base.shadows, ...(ov.shadows || {}) },
      typography: { ...base.typography, ...(ov.typography || {}) },
    };
  }, [
    activeStyle,
    tenant.primaryColor,
    tenant.secondaryColor,
    tenant.accentColor,
    tenant.accentLightColor,
    tenant.backgroundColor,
    tenant.surfaceColor,
    JSON.stringify((tenant as any).tokenOverrides || {}),
  ]);

  const forceRefresh = useCallback(() => {
    // no-op kept for API compatibility
  }, []);

  const contextValue: ThemeContextValue = useMemo(
    () => ({
      tokens,
      engineStyle: activeStyle,
      forceRefresh,
      setEngine: setEngineOverride,
    }),
    [tokens, activeStyle, forceRefresh]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
