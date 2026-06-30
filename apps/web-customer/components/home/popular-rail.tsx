"use client"

import { getPopularProducts } from "@/lib/mock"
import { ProductCard } from "@/components/shared/product-card"
import { Flame } from "lucide-react"

export function PopularRail() {
  const popular = getPopularProducts()

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="engine-title text-xl font-bold tracking-tight lg:text-2xl">Most Popular</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Top picks from the community
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {popular.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} variant="compact" />
        ))}
      </div>
    </section>
  )
}