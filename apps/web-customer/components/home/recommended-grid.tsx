"use client"

import { products } from "@/lib/mock"
import { ProductCard } from "@/components/shared/product-card"

export function RecommendedGrid() {
  const recommended = products.slice(0, 3)

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <div className="mb-5">
        <h2 className="engine-title text-xl font-bold tracking-tight lg:text-2xl">Recommended for You</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your taste and time of day
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recommended.map((product) => (
          <ProductCard key={product.id} product={product} variant="default" />
        ))}
      </div>
    </section>
  )
}