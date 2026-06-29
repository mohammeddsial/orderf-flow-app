"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, AlertTriangle } from "lucide-react"
import { products } from "@/lib/mock"
import type { Allergen } from "@/types"

const allergenLabels: Allergen[] = [
  "Gluten", "Dairy", "Eggs", "Nuts", "Soy", "Shellfish", "Fish", "Sesame", "Sulphites",
]

export function AllergenMatrix() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t mt-12">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-4 lg:px-6 py-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <AlertTriangle className="h-4 w-4" />
        <span>Allergen & Nutrition Information</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 ml-auto transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-4 lg:px-6 pb-6 overflow-x-auto">
          <p className="text-xs text-muted-foreground mb-4">
            Please note that our recipes may contain or come into contact with allergens. 
            Values are indicative only and may vary. If you have specific dietary requirements, 
            please speak to a team member before ordering.
          </p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium">Item</th>
                {allergenLabels.map((a) => (
                  <th key={a} className="text-center py-2 px-1.5 font-medium whitespace-nowrap">
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-muted/50">
                  <td className="py-2 pr-4 font-medium whitespace-nowrap">{p.name}</td>
                  {allergenLabels.map((a) => (
                    <td key={a} className="text-center py-2 px-1.5">
                      <span
                        className={cn(
                          "inline-block h-3.5 w-3.5 rounded-full",
                          p.allergens.includes(a)
                            ? "bg-destructive/30"
                            : "bg-green-500/20"
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
