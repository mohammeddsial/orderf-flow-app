"use client"

import { Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type StickyCTAProps = {
  unitPrice: number
  quantity: number
  onQuantityChange: (qty: number) => void
  onAddToCart: () => void
}

export function StickyCTA({ unitPrice, quantity, onQuantityChange, onAddToCart }: StickyCTAProps) {
  return (
    <div className="sticky bottom-0 z-30 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3 px-4 lg:px-6 py-4 max-w-[1400px] mx-auto">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-sm font-medium tabular-nums">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={() => onQuantityChange(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button className="engine-pill flex-1 gap-2" size="lg" onClick={onAddToCart}>
          <ShoppingBag className="h-4 w-4" />
          Add to Cart &middot; ${(unitPrice * quantity).toFixed(2)}
        </Button>
      </div>
    </div>
  )
}