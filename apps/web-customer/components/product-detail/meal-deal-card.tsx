"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import type { MealDealUpgrade } from "@/types"

type MealDealCardProps = {
  mealDeal: MealDealUpgrade
  selected: boolean
  onToggle: () => void
}

export function MealDealCard({ mealDeal, selected, onToggle }: MealDealCardProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Make it a Meal</h3>
      <button
        onClick={onToggle}
        className={cn(
          "w-full rounded-xl border p-4 text-left transition-colors",
          selected
            ? "border-primary bg-primary/5"
            : "hover:border-muted-foreground/30"
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors mt-0.5",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30"
            )}
          >
            {selected && <Check className="h-3.5 w-3.5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-sm">{mealDeal.name}</span>
              <span className="text-sm font-bold shrink-0">+${mealDeal.price.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{mealDeal.description}</p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {mealDeal.includes.map((item) => (
                <Badge key={item} variant="secondary" className="text-[10px]">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}