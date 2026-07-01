import React, { createContext, useContext, useMemo, ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import { useTenant, UIStyleEngine } from '@multi-restaurant/database';
import { getEngineTokens, ThemeTokens } from './engines';
import { API_BASE } from '../api/client';

interface ThemeContextValue {
  tokens: ThemeTokens;
  engineStyle: string;
  forceRefresh: () => void;
  setEngine: (style: UIStyleEngine) => void;
  lastSyncedAt: number | null;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

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

const POLL_INTERVAL = 5000;

type LiveTenantColors = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  accentLightColor: string;
  surfaceColor: string;
  activeUiStyle: UIStyleEngine;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tenant = useTenant();

  const [engineOverride, setEngineOverride] = useState<UIStyleEngine | null>(null);
  const [liveColors, setLiveColors] = useState<LiveTenantColors | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const tenantIdRef = useRef(tenant.id);

  tenantIdRef.current = tenant.id;

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const id = tenantIdRef.current;
      if (!id) return;
      try {
        const res = await fetch(`${API_BASE}/restaurants/${id}?_t=${Date.now()}`, {
          cache: 'no-cache',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data) return;

        const incoming: LiveTenantColors = {
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          backgroundColor: data.backgroundColor,
          accentColor: data.accentColor,
          accentLightColor: data.accentLightColor,
          surfaceColor: data.surfaceColor,
          activeUiStyle: data.activeUiStyle,
        };

        setLiveColors((prev) => {
          if (
            prev &&
            prev.primaryColor === incoming.primaryColor &&
            prev.secondaryColor === incoming.secondaryColor &&
            prev.backgroundColor === incoming.backgroundColor &&
            prev.accentColor === incoming.accentColor &&
            prev.accentLightColor === incoming.accentLightColor &&
            prev.surfaceColor === incoming.surfaceColor &&
            prev.activeUiStyle === incoming.activeUiStyle
          ) {
            return prev;
          }
          return incoming;
        });
        setLastSyncedAt(Date.now());
      } catch {
        // network error — keep current theme
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const activeStyle = engineOverride ?? liveColors?.activeUiStyle ?? tenant.activeUiStyle;

  const effective = liveColors ?? tenant;

  const tokens = useMemo<ThemeTokens>(() => {
    const base = getEngineTokens(activeStyle);
    const primary = effective.primaryColor || base.colors.primary;
    const accent = effective.accentColor || base.colors.accent;
    const background = effective.backgroundColor || base.colors.background;
    const foreground = effective.secondaryColor || base.colors.text;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary,
        secondary: effective.secondaryColor || base.colors.secondary,
        accent,
        accentLight: effective.accentLightColor || base.colors.accentLight,
        background,
        surface: effective.surfaceColor || base.colors.surface,
        surfaceInverse: primary,
        text: foreground,
        textInverse: contrastOn(primary),
      },
    };
  }, [
    activeStyle,
    effective.primaryColor,
    effective.secondaryColor,
    effective.accentColor,
    effective.accentLightColor,
    effective.backgroundColor,
    effective.surfaceColor,
  ]);

  const forceRefresh = useCallback(() => {
    setLiveColors(null);
  }, []);

  const contextValue: ThemeContextValue = useMemo(
    () => ({
      tokens,
      engineStyle: activeStyle,
      forceRefresh,
      setEngine: setEngineOverride,
      lastSyncedAt,
    }),
    [tokens, activeStyle, forceRefresh, lastSyncedAt]
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
