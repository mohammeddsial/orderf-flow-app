"use client"

import { cn } from "@/lib/utils"
import type { ModifierGroup } from "@/types"

type ModifierMatrixProps = {
  groups: ModifierGroup[]
  selectedModifiers: Record<string, string[]>
  onToggle: (groupId: string, optionId: string, type: "radio" | "checkbox") => void
}

export function ModifierMatrix({ groups, selectedModifiers, onToggle }: ModifierMatrixProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const current = selectedModifiers[group.id] || []
        const atMax = current.length >= group.maxSelections

        return (
          <div key={group.id}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold">{group.name}</h3>
              {group.required && (
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  Required
                </span>
              )}
              {group.maxSelections > 1 && group.type === "checkbox" && (
                <span className="text-xs text-muted-foreground">
                  Choose up to {group.maxSelections}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {group.options.map((opt) => {
                const isSelected = current.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (!isSelected && atMax) return
                      onToggle(group.id, opt.id, group.type)
                    }}
                    disabled={!isSelected && atMax}
                    className={cn(
                      "flex items-center justify-between w-full rounded-lg border px-4 py-3 text-sm transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground"
                        : "text-muted-foreground hover:border-muted-foreground/30",
                      !isSelected && atMax && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <span>{opt.name}</span>
                    {opt.priceAdjustment !== 0 && (
                      <span className="text-xs font-medium tabular-nums">
                        {opt.priceAdjustment > 0 ? "+" : ""}${opt.priceAdjustment.toFixed(2)}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}