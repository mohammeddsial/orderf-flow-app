"use client"

import { products } from "@/lib/mock"
import { HorizontalRail } from "@/components/shared/horizontal-rail"
import { ProductCard } from "@/components/shared/product-card"
import type { Product } from "@/types"

type PairedRailProps = {
  product: Product
}

export function PairedRail({ product }: PairedRailProps) {
  const pairedIds = product.frequentlyPairedWith
  if (pairedIds.length === 0) return null

  const pairedProducts = pairedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products

  if (pairedProducts.length === 0) return null

  return (
    <HorizontalRail title="Frequently Paired With" subtitle="Customers also bought">
      {pairedProducts.map((p) => (
        <ProductCard key={p.id} product={p} variant="compact" />
      ))}
    </HorizontalRail>
  )
}