"use client"

import { limitedTimeOffer } from "@/lib/mock"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Tag } from "lucide-react"
import { useState, useEffect } from "react"
import { images } from "@/lib/images"
import { ProductImage } from "@/components/shared/product-image"

export function LTOBanner() {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const update = () => {
      const diff = new Date(limitedTimeOffer.expiryDate).getTime() - Date.now()
      if (diff <= 0) return setTimeLeft("Expired")
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${h}h ${m}m`)
    }
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        <img src={images.ltoSummerBBQ} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60" />
      </div>
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm shrink-0">
          <Tag className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-red-500 text-white text-[10px] border-0">Limited Time</Badge>
            {timeLeft && (
              <Badge variant="secondary" className="gap-1 text-[10px] bg-white/10 text-white border-white/20">
                <Clock className="h-3 w-3" />
                {timeLeft}
              </Badge>
            )}
          </div>
          <h3 className="font-bold text-lg text-white">{limitedTimeOffer.title}</h3>
          <p className="text-sm text-white/70">{limitedTimeOffer.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-white">${limitedTimeOffer.discountedPrice.toFixed(2)}</span>
            <span className="text-sm text-white/50 line-through">${limitedTimeOffer.originalPrice.toFixed(2)}</span>
          </div>
        </div>
        <Button size="lg" className="shrink-0 w-full sm:w-auto shadow-lg">
          Order Now
        </Button>
      </div>
    </div>
  )
}