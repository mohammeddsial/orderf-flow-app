"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { DietaryTag } from "@/types"

const dietaryOptions: { label: string; value: DietaryTag }[] = [
  { label: "Vegan", value: "Vegan" },
  { label: "Gluten-Free", value: "Gluten-Free" },
  { label: "Halal", value: "Halal" },
  { label: "Nut-Free", value: "Nut-Free" },
]

type SearchFilterBarProps = {
  onSearch: (query: string) => void
  onDietaryFilter: (tags: DietaryTag[]) => void
  activeFilters: DietaryTag[]
  searchQuery: string
}

export function SearchFilterBar({
  onSearch,
  onDietaryFilter,
  activeFilters,
  searchQuery,
}: SearchFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const toggleFilter = (tag: DietaryTag) => {
    if (activeFilters.includes(tag)) {
      onDietaryFilter(activeFilters.filter((t) => t !== tag))
    } else {
      onDietaryFilter([...activeFilters, tag])
    }
  }

  return (
    <div className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-4 lg:px-6 py-3 max-w-[1400px] mx-auto">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-9 gap-1.5", showFilters && "border-primary")}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Filters</span>
          {activeFilters.length > 0 && (
            <Badge className="h-4 min-w-4 px-1 text-[10px]">{activeFilters.length}</Badge>
          )}
        </Button>
      </div>
      {showFilters && (
        <div className="flex items-center gap-2 px-4 lg:px-6 pb-3 overflow-x-auto max-w-[1400px] mx-auto">
          {dietaryOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleFilter(opt.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors shrink-0",
                activeFilters.includes(opt.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-muted-foreground/30 text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
              {activeFilters.includes(opt.value) && <X className="h-3 w-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
