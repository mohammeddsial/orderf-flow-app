"use client"

import { products, categories } from "@/lib/mock"
import { ProductCard } from "@/components/shared/product-card"
import { EmptyState } from "@/components/shared/empty-state"
import type { DietaryTag } from "@/types"
import { useMemo } from "react"

type MenuGridProps = {
  searchQuery: string
  activeFilters: DietaryTag[]
  onSelectProduct: (productId: string) => void
}

export function MenuGrid({ searchQuery, activeFilters, onSelectProduct }: MenuGridProps) {
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.dietaryTags.some((t) => t.toLowerCase().includes(q))
        if (!matchesSearch) return false
      }
      if (activeFilters.length > 0) {
        const hasAll = activeFilters.every((tag) => p.dietaryTags.includes(tag))
        if (!hasAll) return false
      }
      return true
    })
  }, [searchQuery, activeFilters])

  const groupedCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        items: filteredProducts.filter((p) => p.categoryId === cat.id),
      }))
      .filter((g) => g.items.length > 0)
  }, [filteredProducts])

  if (filteredProducts.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No items found"
        description="Try adjusting your search or filters"
        action={{ label: "Clear Filters", href: "/menu" }}
      />
    )
  }

  return (
    <div className="flex-1 space-y-10 pb-20 lg:pb-0">
      {groupedCategories.map((group) => (
        <section key={group.id} id={`cat-${group.slug}`}>
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight">{group.name}</h2>
            <p className="text-sm text-muted-foreground">{group.description}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {group.items.map((product) => (
              <div key={product.id} onClick={() => onSelectProduct(product.id)}>
                <ProductCard product={product} variant="default" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
