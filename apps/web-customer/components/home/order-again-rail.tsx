"use client"

import { useUserStore } from "@/stores"
import { ProductCard } from "@/components/shared/product-card"
import { products } from "@/lib/mock"
import { RotateCcw } from "lucide-react"

export function OrderAgainRail() {
  const user = useUserStore((s) => s.user)
  const pastProductIds = user.pastOrders
    .flatMap((o) => o.items.map((i) => i.productId))
    .filter((id, i, arr) => arr.indexOf(id) === i)
    .slice(0, 4)

  const pastProducts = pastProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products

  if (pastProducts.length === 0) return null

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Order It Again</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Your favorites, one tap away</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {pastProducts.map((product) => (
          <ProductCard key={product.id} product={product} variant="compact" />
        ))}
      </div>
    </section>
  )
}