"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Flame, ArrowRight } from "lucide-react"
import { limitedTimeOffer } from "@/lib/mock"

export function LimitedTimeDeal() {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const end = new Date(limitedTimeOffer.expiryDate).getTime()
      const diff = Math.max(0, end - now)

      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)

      setTimeLeft(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const discount = Math.round(
    ((limitedTimeOffer.originalPrice - limitedTimeOffer.discountedPrice) / limitedTimeOffer.originalPrice) * 100
  )

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <Card className="overflow-hidden border-red-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-red-900/60 to-orange-900/40 flex items-center justify-center relative">
            <Flame className="h-20 w-20 text-white/20" />
            <Badge className="absolute top-4 left-4 bg-red-500/90 text-white border-0 text-sm px-3 py-1">
              Limited Time!
            </Badge>
          </div>
          <CardContent className="p-6 lg:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-red-500">Flash Deal</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">{limitedTimeOffer.title}</h2>
            <p className="text-muted-foreground mt-2">{limitedTimeOffer.description}</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-extrabold text-primary">
                ${limitedTimeOffer.discountedPrice.toFixed(2)}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                ${limitedTimeOffer.originalPrice.toFixed(2)}
              </span>
              <Badge variant="secondary" className="ml-2 bg-red-500/10 text-red-500">
                {discount}% OFF
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg font-bold text-foreground">{timeLeft}</span>
              <span>remaining</span>
            </div>
            <Button className="mt-6" size="lg">
              Grab This Deal
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </div>
      </Card>
    </section>
  )
}