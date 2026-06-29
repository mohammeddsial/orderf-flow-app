"use client"

import { cn } from "@/lib/utils"
import type { PortionOption } from "@/types"

type PortionToggleProps = {
  options: PortionOption[]
  selected: PortionOption | null
  onSelect: (option: PortionOption) => void
}

export function PortionToggle({ options, selected, onSelect }: PortionToggleProps) {
  if (options.length <= 1) return null

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Size</h3>
      <div className="flex rounded-lg border p-0.5 bg-muted/30">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              selected?.id === opt.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.sizeLabel}
            {opt.priceMultiplier > 1 && (
              <span className="block text-xs text-muted-foreground">
                +{Math.round((opt.priceMultiplier - 1) * 100)}%
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}