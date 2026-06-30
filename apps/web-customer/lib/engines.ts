import type { RestaurantConfig } from "@/lib/api/adapter"

export type UiEngine = "BRUTALIST_MODERNIST" | "MINIMALIST_CLEAN" | "VIBRANT_STREET_TECH"

export type EngineTokens = {
  radius: number
  radiusSm: number
  radiusMd: number
  radiusLg: number
  radiusXl: number
  radiusPill: number
  fontWeightBold: number
  fontWeightSemibold: number
  fontWeightMedium: number
  shadowSm: string
  shadowMd: string
  shadowLg: string
  shadowXl: string
}

export const ENGINE_TOKENS: Record<UiEngine, EngineTokens> = {
  BRUTALIST_MODERNIST: {
    radius: 0,
    radiusSm: 0,
    radiusMd: 0,
    radiusLg: 0,
    radiusXl: 0,
    radiusPill: 0,
    fontWeightBold: 900,
    fontWeightSemibold: 700,
    fontWeightMedium: 500,
    shadowSm: "0 1px 3px rgba(0,0,0,0.3)",
    shadowMd: "0 4px 6px rgba(0,0,0,0.3)",
    shadowLg: "0 10px 15px rgba(0,0,0,0.3)",
    shadowXl: "0 20px 25px rgba(0,0,0,0.3)",
  },
  MINIMALIST_CLEAN: {
    radius: 0.5,
    radiusSm: 0.125,
    radiusMd: 0.375,
    radiusLg: 0.5,
    radiusXl: 0.75,
    radiusPill: 1.5,
    fontWeightBold: 700,
    fontWeightSemibold: 600,
    fontWeightMedium: 500,
    shadowSm: "0 2px 4px rgba(0,0,0,0.08)",
    shadowMd: "0 4px 8px rgba(0,0,0,0.1)",
    shadowLg: "0 8px 16px rgba(0,0,0,0.12)",
    shadowXl: "0 12px 24px rgba(0,0,0,0.15)",
  },
  VIBRANT_STREET_TECH: {
    radius: 0.75,
    radiusSm: 0.25,
    radiusMd: 0.5,
    radiusLg: 0.75,
    radiusXl: 1,
    radiusPill: 2,
    fontWeightBold: 700,
    fontWeightSemibold: 600,
    fontWeightMedium: 500,
    shadowSm: "0 0 8px rgba(0,217,255,0.3)",
    shadowMd: "0 0 16px rgba(0,217,255,0.5)",
    shadowLg: "0 0 24px rgba(255,0,110,0.4)",
    shadowXl: "0 0 32px rgba(0,217,255,0.6)",
  },
}

function isUiEngine(value: string | undefined): value is UiEngine {
  return (
    value === "BRUTALIST_MODERNIST" ||
    value === "MINIMALIST_CLEAN" ||
    value === "VIBRANT_STREET_TECH"
  )
}

function contrastForeground(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? "#0a0a0a" : "#fafafa"
}

export function buildCssVariables(config: RestaurantConfig): Record<string, string> {
  const engine: UiEngine = isUiEngine(config.activeUiStyle)
    ? config.activeUiStyle
    : "MINIMALIST_CLEAN"

  const tokens = ENGINE_TOKENS[engine]
  const primary = config.primaryColor || "#1a1a1a"
  const accent = config.accentColor || "#2563eb"
  const background = config.backgroundColor || "#ffffff"
  const surface = config.surfaceColor || "#f5f5f5"
  const secondary = config.secondaryColor || "#6b7280"
  const accentLight = config.accentLightColor || accent
  const primaryForeground = contrastForeground(primary)
  const accentForeground = contrastForeground(accent)

  return {
    "--primary": primary,
    "--primary-foreground": primaryForeground,
    "--accent": accent,
    "--accent-foreground": accentForeground,
    "--secondary": secondary,
    "--secondary-foreground": contrastForeground(secondary),
    "--background": background,
    "--foreground": contrastForeground(background),
    "--card": surface,
    "--card-foreground": contrastForeground(surface),
    "--muted": surface,
    "--muted-foreground": "#6b7280",
    "--radius": `${tokens.radius}rem`,
    "--radius-sm": `${tokens.radiusSm}rem`,
    "--radius-md": `${tokens.radiusMd}rem`,
    "--radius-lg": `${tokens.radiusLg}rem`,
    "--radius-xl": `${tokens.radiusXl}rem`,
    "--radius-2xl": `${tokens.radiusXl * 1.3}rem`,
    "--radius-3xl": `${tokens.radiusXl * 1.6}rem`,
    "--radius-4xl": `${tokens.radiusPill}rem`,
    "--font-weight-medium": String(tokens.fontWeightMedium),
    "--font-weight-semibold": String(tokens.fontWeightSemibold),
    "--font-weight-bold": String(tokens.fontWeightBold),
    "--shadow-sm": tokens.shadowSm,
    "--shadow-md": tokens.shadowMd,
    "--shadow-lg": tokens.shadowLg,
    "--shadow-xl": tokens.shadowXl,
    "--ring": accent,
    "--border": engine === "BRUTALIST_MODERNIST" ? "#000000" : "#e5e5e5",
    "--input": engine === "BRUTALIST_MODERNIST" ? "#000000" : "#e5e5e5",
  }
}

export { isUiEngine, contrastForeground }
