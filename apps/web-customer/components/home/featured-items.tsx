"use client"

import { products, getChefRecommendedProducts } from "@/lib/mock"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/stores"
import { ProductImage } from "@/components/shared/product-image"
import { getProductImages } from "@/lib/images"

export function FeaturedItems() {
  const featured = [...getChefRecommendedProducts(), ...products.filter((p) => p.isNew)].slice(0, 4)

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Featured Items</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Chef-recommended plates &amp; new kitchen profiles
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {featured.slice(0, 4).map((product) => (
          <FeaturedCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function FeaturedCard({ product }: { product: (typeof products)[0] }) {
  const addItem = useCartStore((s) => s.addItem)
  const imgs = getProductImages(product.id)

  return (
    <Link href={`/menu/${product.id}`} className="block group">
      <Card className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl h-full pt-0 pb-0 gap-0">
        <div className="flex flex-col sm:flex-row h-full">
          <div className="sm:w-44 sm:shrink-0 relative">
            <ProductImage
              src={imgs.main}
              alt={product.name}
              aspectRatio="aspect-square sm:aspect-auto"
              className="sm:h-full"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              {product.isChefRecommended && (
                <Badge className="bg-amber-500/90 text-white border-0 text-[10px] h-5">
                  <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                  Chef
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-primary/90 text-primary-foreground border-0 text-[10px] h-5">
                  New
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.longDescription}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">${product.basePrice.toFixed(2)}</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                  {product.calories} cal
                </span>
              </div>
              <Button
                variant="default"
                size="sm"
                className="rounded-full h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-all"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addItem({
                    id: `cart-${Date.now()}-${product.id}`,
                    product,
                    quantity: 1,
                    selectedModifiers: {},
                    selectedPortionSize: product.portionSizes[0] ?? null,
                    mealDealUpgrade: null,
                    specialInstructions: "",
                  })
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
