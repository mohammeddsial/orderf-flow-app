"use client"

import { activeDeals } from "@/lib/mock"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check, Zap, Percent } from "lucide-react"
import { useState } from "react"
import { ProductImage } from "@/components/shared/product-image"
import { images } from "@/lib/images"

const dealImages: Record<string, string> = {
  "deal-welcome": images.dealWelcome,
  "deal-burger-bundle": images.dealBurgerBundle,
  "deal-free-delivery": images.dealFreeDelivery,
  "deal-milkshake-half": images.dealMilkshake,
  "deal-combo-save": images.dealCombo,
}

export function DealsGrid() {
  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Hot Deals & Promos</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Limited-time savings on your favorites
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeDeals.slice(0, 4).map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  )
}

function DealCard({ deal }: { deal: (typeof activeDeals)[0] }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(deal.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group relative pt-0 pb-0 gap-0">
      {deal.isLimited && (
        <Badge className="absolute top-3 right-3 z-10 bg-red-500/90 text-white border-0 text-[10px]">
          {deal.remainingCount} left
        </Badge>
      )}
      <div className="flex">
        <div className="w-28 shrink-0 relative overflow-hidden">
          <ProductImage
            src={dealImages[deal.id] || images.dealCombo}
            alt={deal.title}
            aspectRatio="aspect-square"
            className="h-full"
          />
        </div>
        <div className="flex-1 p-4">
          <h3 className="font-semibold text-sm">{deal.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{deal.description}</p>
          <div className="flex items-center gap-2 mt-3">
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono text-primary">
              {deal.code}
            </code>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <span className="text-[10px] flex items-center gap-0.5 text-muted-foreground ml-auto">
              <Percent className="h-3 w-3" />
              {deal.discountType === "percentage"
                ? `${deal.discountValue}% OFF`
                : `$${deal.discountValue} OFF`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
