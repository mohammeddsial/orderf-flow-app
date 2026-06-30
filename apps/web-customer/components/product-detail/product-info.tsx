"use client"

import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { Product } from "@/types"

type ProductInfoProps = {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="engine-title text-2xl lg:text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-1 text-sm shrink-0">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviewCount})</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl font-bold">${product.basePrice.toFixed(2)}</span>
          <Badge variant="secondary" className="text-xs">
            {product.calories} cal &middot; {product.kilojoules} kJ
          </Badge>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{product.longDescription}</p>

      <div className="flex flex-wrap gap-1.5">
        {product.dietaryTags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {product.allergens.map((a) => (
          <Badge key={a} variant="outline" className="text-xs text-destructive border-destructive/30">
            {a}
          </Badge>
        ))}
      </div>
    </div>
  )
}