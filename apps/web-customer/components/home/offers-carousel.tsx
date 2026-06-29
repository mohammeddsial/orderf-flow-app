"use client"

import { activeDeals } from "@/lib/mock"
import { HorizontalRail } from "@/components/shared/horizontal-rail"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { images } from "@/lib/images"

const dealImages: Record<string, string> = {
  "deal-welcome": images.dealWelcome,
  "deal-burger-bundle": images.dealBurgerBundle,
  "deal-free-delivery": images.dealFreeDelivery,
  "deal-milkshake-half": images.dealMilkshake,
  "deal-combo-save": images.dealCombo,
}

export function OffersCarousel() {
  return (
    <HorizontalRail title="More Offers" subtitle="Don't miss these savings">
      {activeDeals.map((deal) => (
        <OfferCard key={deal.id} deal={deal} />
      ))}
    </HorizontalRail>
  )
}

function OfferCard({ deal }: { deal: (typeof activeDeals)[0] }) {
  const [copied, setCopied] = useState(false)

  return (
    <Card className="shrink-0 w-[220px] overflow-hidden hover:border-primary/50 transition-colors pt-0 pb-0 gap-0">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={dealImages[deal.id] || images.dealCombo}
          alt={deal.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <CardContent className="p-3">
        <p className="text-sm font-semibold line-clamp-2">{deal.title}</p>
        <p className="text-xs text-muted-foreground mt-1 mb-2 line-clamp-2">{deal.description}</p>
        <div className="flex items-center gap-1">
          <code className="bg-muted px-2 py-1 rounded text-[10px] font-mono flex-1 truncate">{deal.code}</code>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => {
            navigator.clipboard.writeText(deal.code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}>
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}