"use client"

import { products } from "@/lib/mock"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCartStore } from "@/stores"

export function CrossSellInjector() {
  const addItem = useCartStore((s) => s.addItem)
  const dips = products.filter((p) => p.basePrice < 2).slice(0, 3)

  if (dips.length === 0) return null

  const handleAdd = (product: (typeof products)[0]) => {
    addItem({
      id: `cart-${Date.now()}-${product.id}`,
      product,
      quantity: 1,
      selectedModifiers: {},
      selectedPortionSize: product.portionSizes[0] ?? null,
      mealDealUpgrade: null,
      specialInstructions: "",
    })
  }

  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <h3 className="text-sm font-semibold mb-3">Complete Your Meal</h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {dips.map((dip) => (
          <Card key={dip.id} className="flex items-center gap-3 p-3 shrink-0 min-w-[200px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">
              🍯
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{dip.name}</p>
              <p className="text-xs text-muted-foreground">${dip.basePrice.toFixed(2)}</p>
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full shrink-0"
              onClick={() => handleAdd(dip)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
