"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useCartStore, useUserStore, useFulfillmentStore } from "@/stores"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ProductImage } from "@/components/shared/product-image"
import { getProductImages } from "@/lib/images"
import {
  ArrowLeft, Minus, Plus, Trash2, ShoppingBag, MapPin, Gift, Ticket, ChevronRight, RotateCcw
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CartPage() {
  const { items, couponCode, removeItem, updateQuantity, updateItemSpecialInstructions, setCouponCode, getCartTotal, clearCart } = useCartStore()
  const user = useUserStore((s) => s.user)
  const fulfillment = useFulfillmentStore((s) => s.fulfillment)
  const totals = useMemo(() => getCartTotal(), [getCartTotal, items])
  const [couponInput, setCouponInput] = useState(couponCode ?? "")
  const [couponApplied, setCouponApplied] = useState(!!couponCode)

  const isEmpty = items.length === 0
  const tierProgress = user.tierPointsCurrent / user.tierPointsNeeded
  const pointsToNextTier = user.tierPointsNeeded - user.tierPointsCurrent
  const missingForFreeDelivery = Math.max(0, 25 - totals.subtotal)

  const handleApplyCoupon = () => {
    if (couponInput.trim()) { setCouponCode(couponInput.trim()); setCouponApplied(true) }
  }

  const handleRemoveCoupon = () => {
    setCouponCode(null); setCouponInput(""); setCouponApplied(false)
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      {/* CORE 1: Header */}
      <div className="border-b">
        <div className="flex items-center gap-3 px-4 lg:px-6 py-4 max-w-[1400px] mx-auto">
          <Button variant="ghost" size="sm" asChild className="-ml-2 h-8">
            <Link href="/menu"><ArrowLeft className="h-4 w-4 mr-1" />Back to Menu</Link>
          </Button>
          <h1 className="text-lg font-bold">Your Cart</h1>
          {!isEmpty && <Badge variant="secondary" className="ml-auto text-xs">{items.reduce((s, i) => s + i.quantity, 0)} items</Badge>}
        </div>
      </div>

      {/* CORE 2: Fulfillment Ribbon */}
      <div className={cn("px-4 lg:px-6 py-3 border-b", fulfillment.mode === "delivery" ? "bg-muted/30" : "bg-primary/5")}>
        <div className="flex items-center gap-2 text-sm max-w-[1400px] mx-auto">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          {fulfillment.mode === "delivery" ? (
            fulfillment.address ? (
              <span className="text-muted-foreground">Delivering to <span className="font-medium text-foreground">{fulfillment.address.formatted}</span></span>
            ) : <span className="text-amber-500 font-medium">No delivery address set</span>
          ) : (
            <span className="text-muted-foreground">Pickup at <span className="font-medium text-foreground">Downtown Flagship</span></span>
          )}
          <Button variant="ghost" size="sm" asChild className="ml-auto h-7 text-xs"><Link href="/checkout/fulfillment">Change <ChevronRight className="h-3 w-3 ml-0.5" /></Link></Button>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <ShoppingBag className="h-16 w-16 opacity-20 mb-4" />
          <p className="text-lg font-medium">Your cart is empty</p>
          <p className="text-sm mt-1 mb-6">Add some delicious items to get started</p>
          <Button asChild><Link href="/menu">Browse Menu</Link></Button>
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 px-4 lg:px-6 py-6">
          <div className="space-y-6">
            {/* OPTIONAL 9: Recovery Banner */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="flex items-center gap-3 p-4">
                <RotateCcw className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Session saved</p>
                  <p className="text-xs text-muted-foreground">Your cart items are safe. Don&apos;t lose your selections!</p>
                </div>
              </CardContent>
            </Card>

            {/* CORE 3: Itemized Manifest */}
            <div className="space-y-3">
              {items.map((item) => {
                const imgs = getProductImages(item.product.id)
                return (
                  <div key={item.id} className="flex gap-4 rounded-xl border p-4 bg-card hover:border-primary/20 transition-colors">
                    <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden">
                      <ProductImage src={imgs.main} alt={item.product.name} aspectRatio="aspect-square" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{item.product.name}</p>
                          {item.selectedPortionSize && <p className="text-xs text-muted-foreground">{item.selectedPortionSize.label} ({item.selectedPortionSize.sizeLabel})</p>}
                          {item.mealDealUpgrade && <p className="text-xs text-primary font-medium">+ {item.mealDealUpgrade.name}</p>}
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <textarea
                        value={item.specialInstructions}
                        onChange={(e) => updateItemSpecialInstructions(item.id, e.target.value)}
                        placeholder="Special instructions..."
                        className="w-full text-xs bg-muted/50 rounded-md px-2 py-1.5 resize-none h-7 focus:h-14 transition-all focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
                      />
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                          <span className="w-8 text-center text-sm tabular-nums font-medium">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                        <span className="text-sm font-bold tabular-nums">${((item.product.basePrice * (item.selectedPortionSize?.priceMultiplier ?? 1) + (item.mealDealUpgrade?.price ?? 0)) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* OPTIONAL 8: Rewards Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Rewards Progress</p>
                    <p className="text-xs text-muted-foreground">{user.points.toLocaleString()} pts &middot; {tierProgress < 1 ? `${pointsToNextTier.toLocaleString()} pts to next tier` : "Tier complete!"}</p>
                    <Progress value={tierProgress * 100} className="h-1.5 mt-1.5" />
                  </div>
                  <Button variant="outline" size="sm" asChild className="shrink-0 text-xs"><Link href="/rewards">View Rewards</Link></Button>
                </div>
              </CardContent>
            </Card>

            {missingForFreeDelivery > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Add ${missingForFreeDelivery.toFixed(2)} more for free delivery</span>
                <Progress value={(totals.subtotal / 25) * 100} className="h-1 flex-1" />
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-4 mt-8 lg:mt-0">
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Ticket className="h-4 w-4" /> Promo Code</h3>
                {couponApplied ? (
                  <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                    <div><p className="text-sm font-medium text-green-600">{couponInput}</p><p className="text-xs text-muted-foreground">Discount applied</p></div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleRemoveCoupon}>Remove</Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="Enter code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="h-9 text-sm" />
                    <Button variant="secondary" size="sm" className="h-9 shrink-0" onClick={handleApplyCoupon} disabled={!couponInput.trim()}>Apply</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2.5">
                <h3 className="text-sm font-semibold">Order Summary</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">${totals.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="tabular-nums">${totals.deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Service Fee</span><span className="tabular-nums">${totals.serviceFee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax (HST)</span><span className="tabular-nums">${totals.tax.toFixed(2)}</span></div>
                  {totals.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="tabular-nums">-${totals.discount.toFixed(2)}</span></div>}
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span className="tabular-nums">${totals.total.toFixed(2)}</span></div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full gap-2 text-base shadow-lg" asChild>
              <Link href="/checkout/upsell">Proceed to Checkout <ChevronRight className="h-4 w-4" /></Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">By proceeding, you agree to our Terms &amp; Privacy Policy</p>
          </div>
        </div>
      )}
    </div>
  )
}
