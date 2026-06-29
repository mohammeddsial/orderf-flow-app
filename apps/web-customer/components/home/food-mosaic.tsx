"use client"

import { cn } from "@/lib/utils"
import { images } from "@/lib/images"

const mosaicItems = [
  { label: "Flame-Grilled", desc: "Signature Angus patties", span: "sm:col-span-1 sm:row-span-2", src: images.kitchenPrep, gradient: "from-orange-600/40" },
  { label: "Fresh Produce", desc: "Farm-to-table daily", span: "sm:col-span-1 sm:row-span-1", src: images.freshIngredients, gradient: "from-green-600/40" },
  { label: "Artisan Buns", desc: "Baked in-house", span: "sm:col-span-1 sm:row-span-1", src: images.burgerCloseup, gradient: "from-amber-600/40" },
  { label: "Hand-Breaded", desc: "Crispy perfection", span: "sm:col-span-1 sm:row-span-1", src: images.teamCooking, gradient: "from-red-600/40" },
  { label: "Craft Shakes", desc: "Real ice cream", span: "sm:col-span-2 sm:row-span-1", src: images.milkshake, gradient: "from-pink-600/40" },
  { label: "Chef's Table", desc: "Behind the scenes", span: "sm:col-span-1 sm:row-span-2", src: images.diningExperience, gradient: "from-blue-600/40" },
  { label: "Quality Check", desc: "Every plate inspected", span: "sm:col-span-1 sm:row-span-1", src: images.hero, gradient: "from-teal-600/40" },
]

export function FoodMosaic() {
  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Our Kitchen</h2>
        <p className="text-sm text-muted-foreground mt-1">Fresh ingredients, crafted with passion</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[120px] sm:auto-rows-[160px] gap-3">
        {mosaicItems.map((item, i) => (
          <div
            key={i}
            className={cn("relative overflow-hidden rounded-2xl group cursor-pointer", item.span)}
          >
            <img
              src={item.src}
              alt={item.label}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={cn("absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent", item.gradient)} />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center">
              <span className="text-sm font-bold text-white drop-shadow-lg">{item.label}</span>
              <span className="text-[10px] text-white/70 mt-0.5 hidden sm:block">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}