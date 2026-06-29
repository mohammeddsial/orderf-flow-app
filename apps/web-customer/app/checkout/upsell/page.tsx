"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/stores"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductImage } from "@/components/shared/product-image"
import { getProductImages } from "@/lib/images"
import { useProducts, useRestaurantConfig } from "@/lib/mock"
import { Clock, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

export default function UpsellPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const [timeLeft, setTimeLeft] = useState("")
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    if (items.length === 0 && !redirected) {
      setRedirected(true)
      router.replace("/menu")
    }
  }, [items.length, router, redirected])

  const { restaurantId } = useRestaurantConfig()
  const { data: allProducts = [] } = useProducts(restaurantId)

  const cartProductIds = items.map((i) => i.product.id)
  const suggestions = allProducts
    .filter((p) => !cartProductIds.includes(p.id) && p.basePrice < 8)
    .slice(0, 6)

  useEffect(() => {
    const end = Date.now() + 5 * 60 * 1000
    const update = () => {
      const diff = end - Date.now()
      if (diff <= 0) return setTimeLeft("Expired")
      setTimeLeft(`${Math.floor(diff / 60000)}:${String(Math.floor((diff % 60000) / 1000)).padStart(2, "0")}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleAdd = (product: Product) => {
    addItem({
      id: `cart-${Date.now()}-${product.id}`,
      product, quantity: 1, selectedModifiers: {},
      selectedPortionSize: product.portionSizes[0] ?? null,
      mealDealUpgrade: null, specialInstructions: "",
    })
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div />
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
            <Link href="/checkout"><X className="h-4 w-4 mr-1" />Skip</Link>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Complete Your Meal</h1>
          <p className="text-sm text-muted-foreground mt-1">Add a few extras before you checkout</p>
        </div>

        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className="gap-1.5 text-xs py-1.5 px-3">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span className={cn(timeLeft === "Expired" && "text-destructive")}>
              {timeLeft === "Expired" ? "Offer expired" : `Flash deal ends in ${timeLeft}`}
            </span>
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {suggestions.map((product) => {
            const imgs = getProductImages(product.id)
            return (
              <Card key={product.id} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group">
                <ProductImage src={imgs.main} alt={product.name} aspectRatio="aspect-square" />
                <CardContent className="p-3">
                  <p className="text-xs font-medium truncate">{product.name}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm font-bold">${product.basePrice.toFixed(2)}</span>
                    <Button variant="secondary" size="icon" className="h-7 w-7 rounded-full" onClick={() => handleAdd(product)}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center space-y-4">
          <Button size="lg" className="w-full sm:w-auto px-10 shadow-lg" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <div>
            <Button variant="link" size="sm" asChild className="text-muted-foreground">
              <Link href="/checkout">Skip &amp; Proceed</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}