"use client"

import { useRef, useCallback, ReactNode } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type HorizontalRailProps = {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function HorizontalRail({ title, subtitle, children, className }: HorizontalRailProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 2,
    dragFree: true,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className={cn("py-10 px-4 lg:px-6 max-w-[1400px] mx-auto", className)}>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight lg:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={scrollPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={scrollNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">{children}</div>
      </div>
    </section>
  )
}