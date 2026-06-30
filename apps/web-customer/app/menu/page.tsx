"use client"

import { useState, useCallback } from "react"
import { MenuHeader } from "@/components/menu/menu-header"
import { SearchFilterBar } from "@/components/menu/search-filter-bar"
import { CategoryNav } from "@/components/menu/category-nav"
import { MenuGrid } from "@/components/menu/menu-grid"
import { ProductCustomizer } from "@/components/menu/product-customizer"
import { LTOBanner } from "@/components/menu/lto-banner"
import { OrderAgainShortcuts } from "@/components/menu/order-again-shortcuts"
import { CrossSellInjector } from "@/components/menu/cross-sell-injector"
import { AllergenMatrix } from "@/components/menu/allergen-matrix"
import { DaypartNotice } from "@/components/menu/daypart-notice"
import { useProducts, useRestaurantConfig, usePageLayouts } from "@/lib/mock"
import type { DietaryTag } from "@/types"

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<DietaryTag[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const { restaurantId } = useRestaurantConfig()
  const { data: products = [] } = useProducts(restaurantId)
  const { data: pageLayouts } = usePageLayouts(restaurantId)

  const gridVariant = pageLayouts?.menu?.find((s) => s.key === "grid")?.cardVariant

  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId) ?? null
    : null

  const handleSelectProduct = useCallback((productId: string) => {
    setSelectedProductId(productId)
  }, [])

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* CORE 1: Localized Menu Header */}
      <MenuHeader />

      {/* OPTIONAL 12: Daypart Transition Notice */}
      <div className="px-4 lg:px-6 py-2 border-b bg-muted/20 max-w-[1400px] mx-auto">
        <DaypartNotice />
      </div>

      {/* CORE 2: Search & Dietary Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        activeFilters={activeFilters}
        onDietaryFilter={setActiveFilters}
      />

      <div className="flex gap-6 px-4 lg:px-6 py-6 max-w-[1400px] mx-auto">
        {/* CORE 3: Sticky Category Navigation */}
        <CategoryNav />

        <div className="flex-1 min-w-0 space-y-6">
          {/* OPTIONAL 8: LTO Menu Hero Banner */}
          <LTOBanner />

          {/* OPTIONAL 9: Order It Again Shortcuts */}
          <OrderAgainShortcuts />

          {/* CORE 4: Menu Feed & Product Grid */}
          <MenuGrid
            searchQuery={searchQuery}
            activeFilters={activeFilters}
            onSelectProduct={handleSelectProduct}
            cardVariant={gridVariant}
          />

          {/* OPTIONAL 10: Smart Cross-Sell Injector */}
          <CrossSellInjector />

          {/* OPTIONAL 11: Allergen & Nutrition Matrix Portal */}
          <AllergenMatrix />
        </div>
      </div>

      {/* CORE 5: Item Customizer Drawer/Modal */}
      <ProductCustomizer
        product={selectedProduct}
        open={selectedProductId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProductId(null)
        }}
      />
    </div>
  )
}