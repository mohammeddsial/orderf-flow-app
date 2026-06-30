"use client"

import { Product } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Star } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/stores"
import { ProductImage } from "@/components/shared/product-image"
import { getProductImages } from "@/lib/images"
import { useGsapHover } from "@/hooks/use-gsap"

type ProductCardVariant = "default" | "compact" | "featured" | "listRow" | "overlayPrice"

type ProductCardProps = {
  product: Product
  variant?: ProductCardVariant
  className?: string
}

export function ProductCard({ product, variant = "default", className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const imgs = getProductImages(product.id)
  const cardRef = useRef<HTMLDivElement>(null!)
  useGsapHover(cardRef)

  const handleQuickAdd = (e: React.MouseEvent) => {
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
  }

  if (variant === "compact") {
    return (
      <Link href={`/menu/${product.id}`} className={cn("shrink-0 w-[160px]", className)}>
        <Card ref={cardRef} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group pt-0 pb-0 gap-0">
          <ProductImage
            src={imgs.main}
            alt={product.name}
            aspectRatio="aspect-square"
          />
          <div className="p-3">
            <div className="flex items-center gap-1 mb-0.5">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="text-[10px] text-muted-foreground">{product.rating}</span>
            </div>
            <p className="font-medium text-sm truncate">{product.name}</p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-sm font-bold">${product.basePrice.toFixed(2)}</span>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleQuickAdd}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  if (variant === "listRow") {
    return (
      <Link href={`/menu/${product.id}`} className={cn("block", className)}>
        <Card ref={cardRef} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group flex flex-row items-center gap-0 h-[110px]">
          <div className="w-[110px] h-full shrink-0">
            <ProductImage src={imgs.main} alt={product.name} aspectRatio="h-full" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 p-3 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="text-[10px] text-muted-foreground">{product.rating}</span>
            </div>
            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{product.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold">${product.basePrice.toFixed(2)}</span>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleQuickAdd}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  if (variant === "overlayPrice") {
    return (
      <Link href={`/menu/${product.id}`} className={cn("block", className)}>
        <Card ref={cardRef} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group h-full pt-0 pb-0 gap-0 relative">
          <ProductImage src={imgs.main} alt={product.name} aspectRatio="aspect-square" />
          <div className="absolute bottom-2 right-2">
            <span className="rounded-full bg-primary text-primary-foreground text-sm font-bold px-3 py-1 shadow-md">
              ${product.basePrice.toFixed(2)}
            </span>
          </div>
          <div className="absolute top-2 left-2 flex gap-1">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground border-0 text-[10px] h-5">New</Badge>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="text-[10px] text-muted-foreground">{product.rating}</span>
              <span className="text-[10px] text-muted-foreground ml-1">{product.calories} cal</span>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  if (variant === "featured") {
    return (
      <Link href={`/menu/${product.id}`} className={cn("block", className)}>
        <Card ref={cardRef} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl group h-full pt-0 pb-0 gap-0">
          <div className="relative">
            <ProductImage src={imgs.main} alt={product.name} aspectRatio="aspect-[4/3]" />
            <div className="absolute top-2 left-2 flex gap-1">
              {product.isChefRecommended && (
                <Badge className="bg-amber-500/90 text-white border-0 text-[10px] h-5">
                  <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                  Chef's Pick
                </Badge>
              )}
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="text-xl font-bold">${product.basePrice.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground ml-1">{product.calories} cal</span>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleQuickAdd}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/menu/${product.id}`} className={cn("block", className)}>
      <Card ref={cardRef} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group h-full pt-0 pb-0 gap-0">
        <div className="relative">
          <ProductImage src={imgs.main} alt={product.name} />
          <div className="absolute top-2 left-2 flex gap-1">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground border-0 text-[10px] h-5">New</Badge>
            )}
            {product.isChefRecommended && (
              <Badge className="bg-amber-500/90 text-white border-0 text-[10px] h-5">
                <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                Chef
              </Badge>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{product.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {product.description}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold">${product.basePrice.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground ml-1">{product.calories} cal</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground flex items-center">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-0.5" />
                {product.rating}
              </span>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleQuickAdd}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
