"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

type ProductMediaProps = {
  product: Product
}

export function ProductMedia({ product }: ProductMediaProps) {
  const allImages = product.images.length > 0 ? product.images : [product.image]
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="space-y-3">
      <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-xl overflow-hidden bg-muted">
        <div className="absolute inset-0 flex items-center justify-center text-7xl">
          🍔
        </div>
        {product.isNew && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            New
          </span>
        )}
        {product.isChefRecommended && (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white">
            Chef&apos;s Pick
          </span>
        )}
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "h-14 w-14 shrink-0 rounded-lg border-2 bg-muted transition-colors flex items-center justify-center text-xl",
                activeIndex === idx ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              🍔
            </button>
          ))}
        </div>
      )}
    </div>
  )
}