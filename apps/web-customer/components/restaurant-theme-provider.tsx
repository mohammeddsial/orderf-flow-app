"use client"

import { useEffect } from "react"
import { useRestaurantConfig } from "@/lib/api/hooks"
import { buildCssVariables, isUiEngine, type UiEngine } from "@/lib/engines"

export function RestaurantThemeProvider() {
  const { config } = useRestaurantConfig()

  useEffect(() => {
    if (!config) return

    const root = document.documentElement
    const vars = buildCssVariables(config)

    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value)
    }

    const engine: UiEngine = isUiEngine(config.activeUiStyle)
      ? config.activeUiStyle
      : "MINIMALIST_CLEAN"

    root.setAttribute("data-engine", engine)
    root.style.setProperty("--brand-color", config.primaryColor || "")

    return () => {
      for (const key of Object.keys(vars)) {
        root.style.removeProperty(key)
      }
      root.removeAttribute("data-engine")
    }
  }, [config])

  return null
}
