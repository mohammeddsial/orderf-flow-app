"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Truck } from "lucide-react"
import { images } from "@/lib/images"

export function HeroVideo() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative aspect-[16/7] sm:aspect-[16/5] max-h-[75vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm gap-1.5">
            <Truck className="h-3 w-3" />
            20-30 min delivery
          </Badge>
          <h1 className="engine-title text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-3xl drop-shadow-lg leading-tight">
            Crave-Worthy,
            <br />
            <span className="text-amber-400">Delivered Fresh</span>
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-white/70 max-w-xl">
            Handcrafted burgers, crispy sides, and indulgent shakes — straight to your door in minutes.
          </p>
          <div className="flex gap-3 mt-8">
            <Button size="lg" className="rounded-full text-base px-8 shadow-lg shadow-primary/30">
              Order Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full text-base px-8 bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
            >
              <Star className="h-4 w-4 mr-2 fill-amber-400 text-amber-400" />
              4.6 Rated
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
