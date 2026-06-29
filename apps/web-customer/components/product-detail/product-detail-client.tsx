"use client"

import { useState, useMemo } from "react"
import { getProductById } from "@/lib/mock"
import { useCartStore } from "@/stores"
import { ProductBreadcrumb } from "@/components/product-detail/product-breadcrumb"
import { ProductImage } from "@/components/shared/product-image"
import { ProductInfo } from "@/components/product-detail/product-info"
import { ModifierMatrix } from "@/components/product-detail/modifier-matrix"
import { PortionToggle } from "@/components/product-detail/portion-toggle"
import { MealDealCard } from "@/components/product-detail/meal-deal-card"
import { StickyCTA } from "@/components/product-detail/sticky-cta"
import { PairedRail } from "@/components/product-detail/paired-rail"
import { NutritionPanel } from "@/components/product-detail/nutrition-panel"
import { getProductImages } from "@/lib/images"
import { cn } from "@/lib/utils"
import type { Product, PortionOption, MealDealUpgrade } from "@/types"

type ProductDetailClientProps = {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({})
  const [portionSize, setPortionSize] = useState<PortionOption | null>(
    product.portionSizes[0] ?? null
  )
  const [mealDeal, setMealDeal] = useState<MealDealUpgrade | null>(null)
  const [instructions, setInstructions] = useState("")
  const [activeImage, setActiveImage] = useState(0)

  const imgs = getProductImages(product.id)

  const handleModifierToggle = (groupId: string, optionId: string, type: "radio" | "checkbox") => {
    setSelectedModifiers((prev) => {
      const current = prev[groupId] || []
      const group = product.modifiers.find((mg) => mg.id === groupId)
      const max = group?.maxSelections ?? 1
      if (type === "radio") return { ...prev, [groupId]: [optionId] }
      if (current.includes(optionId)) return { ...prev, [groupId]: current.filter((id) => id !== optionId) }
      if (current.length >= max) return prev
      return { ...prev, [groupId]: [...current, optionId] }
    })
  }

  const unitPrice = useMemo(() => {
    let price = product.basePrice
    if (portionSize) price *= portionSize.priceMultiplier
    Object.entries(selectedModifiers).forEach(([, optionIds]) => {
      optionIds.forEach((oid) => {
        for (const mg of product.modifiers) {
          const opt = mg.options.find((o) => o.id === oid)
          if (opt) { price += opt.priceAdjustment; break }
        }
      })
    })
    if (mealDeal) price += mealDeal.price
    return price
  }, [product, portionSize, selectedModifiers, mealDeal])

  const handleAddToCart = () => {
    addItem({
      id: `cart-${Date.now()}-${product.id}`,
      product,
      quantity,
      selectedModifiers,
      selectedPortionSize: portionSize || product.portionSizes[0] || null,
      mealDealUpgrade: mealDeal,
      specialInstructions: instructions,
    })
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      {/* CORE 1: Breadcrumb */}
      <div className="px-4 lg:px-6 pt-4 max-w-[1400px] mx-auto">
        <ProductBreadcrumb productName={product.name} />
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-10 px-4 lg:px-6 py-6 max-w-[1400px] mx-auto">
        {/* Left: Media */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <ProductImage
                src={imgs.gallery[activeImage] || imgs.main}
                alt={product.name}
                aspectRatio="aspect-square lg:aspect-[4/3]"
                priority
              />
            </div>
            {imgs.gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imgs.gallery.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                      activeImage === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-border"
                    )}
                  >
                    <ProductImage src={src} alt={`${product.name} ${idx + 1}`} aspectRatio="aspect-square" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block mt-8 space-y-6">
            <PairedRail product={product} />
            <NutritionPanel facts={product.nutritionFacts} />
          </div>
        </div>

        {/* Right: Info & Customization */}
        <div className="mt-6 lg:mt-0 space-y-8">
          <ProductInfo product={product} />

          <PortionToggle
            options={product.portionSizes}
            selected={portionSize}
            onSelect={setPortionSize}
          />

          {product.modifiers.length > 0 && (
            <ModifierMatrix
              groups={product.modifiers}
              selectedModifiers={selectedModifiers}
              onToggle={handleModifierToggle}
            />
          )}

          {product.mealDealUpgrade && (
            <MealDealCard
              mealDeal={product.mealDealUpgrade}
              selected={mealDeal !== null}
              onToggle={() => setMealDeal(mealDeal ? null : product.mealDealUpgrade!)}
            />
          )}

          <div>
            <h3 className="text-sm font-semibold mb-3">Special Instructions</h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any allergies, preferences, or special requests?"
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="lg:hidden space-y-6">
            <PairedRail product={product} />
            <NutritionPanel facts={product.nutritionFacts} />
          </div>
        </div>
      </div>

      <StickyCTA
        unitPrice={unitPrice}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
