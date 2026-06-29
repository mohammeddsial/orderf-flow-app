"use client"

import { useState } from "react"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCartStore } from "@/stores"
import { ProductImage } from "@/components/shared/product-image"
import { getProductImages } from "@/lib/images"
import type { Product, PortionOption, MealDealUpgrade } from "@/types"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

type ProductCustomizerProps = {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCustomizer({ product, open, onOpenChange }: ProductCustomizerProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({})
  const [portionSize, setPortionSize] = useState<PortionOption | null>(null)
  const [mealDeal, setMealDeal] = useState<MealDealUpgrade | null>(null)
  const [instructions, setInstructions] = useState("")

  const resetState = () => {
    setQuantity(1)
    setSelectedModifiers({})
    setPortionSize(null)
    setMealDeal(null)
    setInstructions("")
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) resetState()
    onOpenChange(open)
  }

  const handleModifierToggle = (groupId: string, optionId: string, type: "radio" | "checkbox") => {
    setSelectedModifiers((prev) => {
      const current = prev[groupId] || []
      if (type === "radio") {
        return { ...prev, [groupId]: [optionId] }
      }
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) }
      }
      return { ...prev, [groupId]: [...current, optionId] }
    })
  }

  const unitPrice = useMemo(() => {
    if (!product) return 0
    let price = product.basePrice
    if (portionSize) {
      price *= portionSize.priceMultiplier
    }
    Object.entries(selectedModifiers).forEach(([, optionIds]) => {
      optionIds.forEach((oid) => {
        for (const mg of product.modifiers) {
          const opt = mg.options.find((o) => o.id === oid)
          if (opt) {
            price += opt.priceAdjustment
            break
          }
        }
      })
    })
    if (mealDeal) {
      price += mealDeal.price
    }
    return price
  }, [product, portionSize, selectedModifiers, mealDeal])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: `cart-${Date.now()}-${product.id}`,
      product,
      quantity,
      selectedModifiers,
      selectedPortionSize: portionSize || product.portionSizes[0] || null,
      mealDealUpgrade: mealDeal,
      specialInstructions: instructions,
    })
    handleOpenChange(false)
  }

  if (!product) return null

  const imgs = getProductImages(product.id)

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] lg:max-w-[520px] flex flex-col p-0"
      >
        <SheetHeader className="flex flex-row items-center justify-between px-6 py-4 border-b shrink-0">
          <SheetTitle className="text-lg">{product.name}</SheetTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          {/* Product Image */}
          <div className="rounded-xl overflow-hidden mb-5">
            <ProductImage src={imgs.main} alt={product.name} aspectRatio="aspect-[16/9]" />
          </div>

          {/* Pricing & Calories */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">${unitPrice.toFixed(2)}</span>
              <Badge variant="secondary" className="text-xs">{product.calories} cal</Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6">{product.description}</p>

          {/* Portion Sizes */}
          {product.portionSizes.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {product.portionSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setPortionSize(size)}
                    className={cn(
                      "rounded-lg border p-3 text-center transition-all",
                      portionSize?.id === size.id
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "hover:border-muted-foreground/30 hover:bg-muted/30"
                    )}
                  >
                    <span className="text-sm font-medium">{size.sizeLabel}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {size.priceMultiplier > 1 ? `+${Math.round((size.priceMultiplier - 1) * 100)}%` : "Standard"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modifier Groups */}
          {product.modifiers.map((group) => (
            <div key={group.id} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold">{group.name}</h3>
                {group.required && (
                  <Badge variant="outline" className="text-[10px] h-4 px-1 text-muted-foreground">
                    Required
                  </Badge>
                )}
                {group.maxSelections > 1 && (
                  <span className="text-xs text-muted-foreground">(max {group.maxSelections})</span>
                )}
              </div>
              <div className="space-y-1.5">
                {group.options.map((opt) => {
                  const isSelected = (selectedModifiers[group.id] || []).includes(opt.id)
                  const atMax = (selectedModifiers[group.id] || []).length >= group.maxSelections
                  return (
                    <button
                      key={opt.id}
                      onClick={() => { if (!isSelected && atMax) return; handleModifierToggle(group.id, opt.id, group.type) }}
                      disabled={!isSelected && atMax}
                      className={cn(
                        "flex items-center justify-between w-full rounded-lg border px-4 py-3 text-sm transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground shadow-sm"
                          : "text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/20",
                        !isSelected && atMax && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <span>{opt.name}</span>
                      {opt.priceAdjustment !== 0 && (
                        <span className="text-xs font-medium tabular-nums">
                          {opt.priceAdjustment > 0 ? "+" : ""}${opt.priceAdjustment.toFixed(2)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Meal Deal Upgrade */}
          {product.mealDealUpgrade && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Make it a Meal</h3>
              <button
                onClick={() => setMealDeal(mealDeal ? null : product.mealDealUpgrade!)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all",
                  mealDeal ? "border-primary bg-primary/5 shadow-sm" : "hover:border-muted-foreground/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{product.mealDealUpgrade.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.mealDealUpgrade.description}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {product.mealDealUpgrade.includes.map((item) => (
                        <Badge key={item} variant="secondary" className="text-[10px]">{item}</Badge>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-bold shrink-0 ml-2">+${product.mealDealUpgrade.price.toFixed(2)}</span>
                </div>
              </button>
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Special Instructions</h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any allergies or preferences?"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Dietary & Allergen Info */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.dietaryTags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
            ))}
            {product.allergens.map((a) => (
              <Badge key={a} variant="outline" className="text-[10px] text-destructive border-destructive/30">{a}</Badge>
            ))}
          </div>
        </ScrollArea>

        {/* Sticky Bottom CTA */}
        <div className="border-t p-4 shrink-0 bg-background">
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg bg-muted/20">
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-none" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm font-medium tabular-nums">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-none" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button className="flex-1 gap-2 shadow-lg" size="lg" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4" />
              Add to Cart &middot; ${(unitPrice * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
