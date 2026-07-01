import React, { useEffect, ReactNode } from 'react';
import { useRestaurant } from './RestaurantContext';
import { useAuth } from './AuthContext';

function hexToHsl(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  let sat = 0;
  const light = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = light > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hue = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: hue = ((b - r) / d + 2) * 60; break;
      case b: hue = ((r - g) / d + 4) * 60; break;
    }
  }
  return `${Math.round(hue)} ${Math.round(sat * 100)}% ${Math.round(light * 100)}%`;
}

function applyTenantColors(colors: {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  accentLightColor: string;
  surfaceColor: string;
}) {
  const root = document.documentElement;
  root.style.setProperty('--primary', hexToHsl(colors.primaryColor));
  root.style.setProperty('--secondary', hexToHsl(colors.secondaryColor));
  root.style.setProperty('--accent', hexToHsl(colors.accentColor));
  root.style.setProperty('--ring', hexToHsl(colors.primaryColor));
}

function resetTenantColors() {
  const root = document.documentElement;
  root.style.removeProperty('--primary');
  root.style.removeProperty('--secondary');
  root.style.removeProperty('--accent');
  root.style.removeProperty('--ring');
}

export const TenantThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { current } = useRestaurant();
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    if (isSuperAdmin || !current) {
      resetTenantColors();
      return;
    }
    applyTenantColors({
      primaryColor: current.primaryColor,
      secondaryColor: current.secondaryColor,
      backgroundColor: current.backgroundColor,
      accentColor: current.accentColor,
      accentLightColor: current.accentLightColor,
      surfaceColor: current.surfaceColor,
    });
  }, [current, isSuperAdmin]);

  return <>{children}</>;
};
