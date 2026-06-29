"use client"

import { useEffect, useState } from "react"
import { categories } from "@/lib/mock"
import { cn } from "@/lib/utils"
import { Sandwich, Croissant, CupSoda, IceCream, UtensilsCrossed, Coffee } from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  Sandwich, Croissant, CupSoda, IceCream, UtensilsCrossed, Coffee,
}

export function CategoryNav() {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace("cat-", ""))
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    )

    const elements = categories
      .map((c) => document.getElementById(`cat-${c.slug}`))
      .filter(Boolean)

    elements.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleClick = (slug: string) => {
    const el = document.getElementById(`cat-${slug}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col gap-1 w-[200px] shrink-0">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">
          Categories
        </h3>
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Sandwich
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.slug)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
                activeId === cat.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {cat.name}
            </button>
          )
        })}
      </nav>

      {/* Mobile top rail */}
      <nav className="lg:hidden overflow-x-auto -mx-4 px-4 pb-3">
        <div className="flex gap-2">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Sandwich
            return (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.slug)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors",
                  activeId === cat.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.name}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
