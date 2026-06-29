"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Plus, ArrowRight } from "lucide-react"
import { useCartStore } from "@/stores"
import { products } from "@/lib/mock"
import Link from "next/link"

export function ComboBuilder() {
  const addItem = useCartStore((s) => s.addItem)
  const comboProducts = products.filter((p) => p.mealDealUpgrade).slice(0, 3)

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Meal Deals</h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Sparkles className="h-3 w-3 mr-1" />
            Save big
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Bundle & save — make any item a full meal
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {comboProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:border-primary/50 transition-colors"
          >
            <div className="aspect-[3/2] bg-gradient-to-br from-amber-500/20 to-orange-600/10 flex items-center justify-center text-5xl">
              🍔🍟🥤
            </div>
            <CardContent className="p-4">
              <p className="font-semibold truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {product.mealDealUpgrade?.description}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                {product.mealDealUpgrade?.includes.map((item, i) => (
                  <span key={i} className="bg-muted px-1.5 py-0.5 rounded">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="font-bold text-lg">
                    ${((product.basePrice + (product.mealDealUpgrade?.price ?? 0)).toFixed(2))}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1 line-through">
                    ${(product.basePrice + (product.mealDealUpgrade?.price ?? 0) + 2).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => {
                      const item = {
                        id: `cart-${Date.now()}-${product.id}`,
                        product,
                        quantity: 1,
                        selectedModifiers: {},
                        selectedPortionSize: product.portionSizes[0] ?? null,
                        mealDealUpgrade: product.mealDealUpgrade,
                        specialInstructions: "",
                      }
                      addItem(item)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/menu/${product.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}