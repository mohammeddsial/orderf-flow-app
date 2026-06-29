"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Info } from "lucide-react"
import type { NutritionFacts } from "@/types"

type NutritionPanelProps = {
  facts: NutritionFacts
}

export function NutritionPanel({ facts }: NutritionPanelProps) {
  const [open, setOpen] = useState(false)

  const rows: { label: string; value: string; bold?: boolean }[] = [
    { label: "Serving Size", value: facts.servingSize, bold: true },
    { label: "Protein", value: facts.protein },
    { label: "Carbohydrates", value: facts.carbs },
    { label: "Fat", value: facts.fat },
    { label: "Saturated Fat", value: facts.saturatedFat },
    { label: "Trans Fat", value: facts.transFat },
    { label: "Cholesterol", value: facts.cholesterol },
    { label: "Sodium", value: facts.sodium },
    { label: "Fiber", value: facts.fiber },
    { label: "Sugar", value: facts.sugar },
    { label: "Vitamin A", value: facts.vitaminA },
    { label: "Vitamin C", value: facts.vitaminC },
    { label: "Calcium", value: facts.calcium },
    { label: "Iron", value: facts.iron },
  ]

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Info className="h-4 w-4" />
        <span>Nutrition Information</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="mt-3 rounded-xl border p-4">
          <h4 className="text-sm font-semibold mb-3">Nutrition Facts</h4>
          <table className="w-full text-xs">
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-muted/50 last:border-0">
                  <td
                    className={cn(
                      "py-1.5 pr-2",
                      row.bold ? "font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {row.label}
                  </td>
                  <td className={cn("py-1.5 text-right", row.bold && "font-semibold")}>
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}