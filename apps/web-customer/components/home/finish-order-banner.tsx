"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/stores"

export function FinishOrderBanner() {
  const items = useCartStore((s) => s.items)
  const hasSavedCart = items.length > 0

  if (!hasSavedCart) return null

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + i.product.basePrice * i.quantity, 0).toFixed(2)

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20 p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Finish your order?</p>
              <p className="text-sm text-muted-foreground">
                {itemCount} item{itemCount !== 1 ? "s" : ""} · ${total} — waiting in your cart
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/cart">
              Complete Order
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </Card>
    </section>
  )
}