"use client"

import { activeDeals } from "@/lib/mock"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check, Clock, Tag, Percent } from "lucide-react"
import { useState } from "react"
import { images } from "@/lib/images"

const dealImages: Record<string, string> = {
  "deal-welcome": images.dealWelcome,
  "deal-burger-bundle": images.dealBurgerBundle,
  "deal-free-delivery": images.dealFreeDelivery,
  "deal-milkshake-half": images.dealMilkshake,
  "deal-combo-save": images.dealCombo,
}

export function OffersFeed() {
  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight lg:text-2xl">More Offers</h2>
        <p className="text-sm text-muted-foreground mt-1">Every ongoing deal and promotion in one place</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeDeals.map((deal) => (
          <OfferFeedCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  )
}

function OfferFeedCard({ deal }: { deal: (typeof activeDeals)[0] }) {
  const [copied, setCopied] = useState(false)
  const daysLeft = Math.ceil((new Date(deal.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-md pt-0 pb-0 gap-0">
      <div className="flex items-center gap-4 p-4">
        <div className="h-16 w-16 shrink-0 rounded-2xl overflow-hidden">
          <img
            src={dealImages[deal.id] || images.dealCombo}
            alt={deal.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm">{deal.title}</h3>
            {deal.isLimited && <Badge variant="secondary" className="text-[10px]">{deal.remainingCount} left</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{deal.description}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="flex items-center gap-1">
              <code className="bg-muted px-2 py-0.5 rounded text-[11px] font-mono text-primary font-medium">{deal.code}</code>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                navigator.clipboard.writeText(deal.code)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}>
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{daysLeft > 0 ? `${daysLeft}d remaining` : "Expires today"}</span>
            </div>
            {deal.minOrder > 0 && (
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Min ${deal.minOrder}</span>
            )}
            <span className="text-[10px] font-medium text-green-600">
              {deal.discountType === "percentage" ? `${deal.discountValue}% OFF` : `$${deal.discountValue} OFF`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}