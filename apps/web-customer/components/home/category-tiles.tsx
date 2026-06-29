"use client"

import { categories } from "@/lib/mock"
import { Card } from "@/components/ui/card"
import { Sandwich, Croissant, CupSoda, IceCream, UtensilsCrossed, Coffee, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  Sandwich, Croissant, CupSoda, IceCream, UtensilsCrossed, Coffee,
}

const gradientMap: Record<string, string> = {
  "cat-burgers": "from-orange-500/20 to-amber-500/5",
  "cat-sides": "from-green-500/20 to-emerald-500/5",
  "cat-drinks": "from-blue-500/20 to-cyan-500/5",
  "cat-desserts": "from-pink-500/20 to-rose-500/5",
  "cat-combos": "from-purple-500/20 to-violet-500/5",
  "cat-breakfast": "from-yellow-500/20 to-amber-500/5",
}

export function CategoryTiles() {
  const handleClick = (slug: string) => {
    const el = document.getElementById(`cat-${slug}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Browse Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Find exactly what you&apos;re craving
          </p>
        </div>
        <Link
          href="/menu"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Sandwich
          const gradient = gradientMap[cat.id] || "from-muted to-muted/50"
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.slug)}
              className="group"
            >
              <Card className={cn(
                "flex flex-col items-center gap-3 p-5 border-2 transition-all cursor-pointer overflow-hidden relative",
                "hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5",
                "bg-gradient-to-br",
                gradient
              )}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/80 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-sm font-semibold text-center leading-tight">
                  {cat.name}
                </span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight hidden sm:block">
                  {cat.description}
                </span>
              </Card>
            </button>
          )
        })}
      </div>
    </section>
  )
}