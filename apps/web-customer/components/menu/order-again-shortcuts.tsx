"use client"

import { useUserStore } from "@/stores"
import { HorizontalRail } from "@/components/shared/horizontal-rail"
import { ProductCard } from "@/components/shared/product-card"
import { products } from "@/lib/mock"

export function OrderAgainShortcuts() {
  const user = useUserStore((s) => s.user)
  const pastProductIds = user.pastOrders
    .flatMap((o) => o.items.map((i) => i.productId))
    .filter((id, i, arr) => arr.indexOf(id) === i)
    .slice(0, 6)

  const pastProducts = pastProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products

  if (pastProducts.length === 0) return null

  return (
    <HorizontalRail title="Order It Again" subtitle="Your favorites from past orders">
      {pastProducts.map((product) => (
        <ProductCard key={product.id} product={product} variant="compact" />
      ))}
    </HorizontalRail>
  )
}
