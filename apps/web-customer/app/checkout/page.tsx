"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCartStore, useUserStore, useFulfillmentStore, useOrderStore } from "@/stores"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Lock,
  ChevronRight,
  Check,
  ShieldCheck,
  Apple,
  CreditCard,
  Building,
  Calendar,
} from "lucide-react"

const paymentMethods = [
  { id: "apple-pay", label: "Apple Pay", icon: Apple, description: "Pay with Touch ID" },
  { id: "google-pay", label: "Google Pay", icon: CreditCard, description: "Fast & secure" },
  { id: "card", label: "Credit Card", icon: CreditCard, description: "Visa, MC, Amex" },
  { id: "interac", label: "Interac", icon: Building, description: "Canadian banking" },
]

const tipPresets = [0, 10, 15, 18, 20]

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const getCartTotal = useCartStore((s) => s.getCartTotal)
  const clearCart = useCartStore((s) => s.clearCart)
  const user = useUserStore((s) => s.user)
  const fulfillment = useFulfillmentStore((s) => s.fulfillment)
  const setActiveOrder = useOrderStore((s) => s.setActiveOrder)

  const totals = useMemo(() => getCartTotal(), [getCartTotal, items])
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [tipPercentage, setTipPercentage] = useState<number>(15)
  const [customTip, setCustomTip] = useState("")
  const [carbonOffset, setCarbonOffset] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")

  const tipAmount = useMemo(() => {
    if (customTip) return parseFloat(customTip) || 0
    return Math.round(totals.subtotal * (tipPercentage / 100) * 100) / 100
  }, [totals.subtotal, tipPercentage, customTip])

  const grandTotal = totals.total + tipAmount

  const steps = [
    { label: "Cart", href: "/cart" },
    { label: "Details", href: "/checkout/fulfillment" },
    { label: "Payment", href: "/checkout" },
  ]

  const handlePlaceOrder = () => {
    if (processing) return
    setProcessing(true)
    setTimeout(() => {
      const orderId = `ord-${Date.now()}`
      setActiveOrder({
        id: orderId,
        status: "preparing",
        items: items.map((i) => ({ ...i })),
        subtotal: totals.subtotal,
        deliveryFee: totals.deliveryFee,
        serviceFee: totals.serviceFee,
        tax: totals.tax,
        tip: tipAmount,
        tipPercentage,
        discount: totals.discount,
        total: grandTotal,
        fulfillment: { ...fulfillment },
        couponCode: null,
        rewardsApplied: 0,
        carbonOffset,
        placedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(),
        driver: null,
        tracking: [],
      })
      clearCart()
      setProcessing(false)
      router.push(`/order/success/${orderId}`)
    }, 1500)
  }

  useEffect(() => {
    if (items.length === 0) router.replace("/cart")
  }, [items.length, router])

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-muted/30">
      {/* CORE 1: Enclosed Security Header */}
      <div className="bg-background border-b">
        <div className="flex items-center gap-3 px-4 lg:px-6 py-4 max-w-[1400px] mx-auto">
          <Button variant="ghost" size="sm" asChild className="-ml-2 h-8">
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* CORE 2: Secure Checkout Navigation Steps */}
      <div className="bg-background border-b">
        <div className="flex items-center justify-center gap-0 px-4 lg:px-6 py-3 max-w-[1400px] mx-auto">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className={cn(
                "flex items-center gap-1.5 text-xs font-medium",
                i === 2 ? "text-primary" : "text-muted-foreground"
              )}>
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                  i === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {i < 2 ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < steps.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto lg:grid lg:grid-cols-[1fr_400px] lg:gap-8 px-4 lg:px-6 py-6">
        {/* Left: Forms & Payment */}
        <div className="space-y-6">
          {/* CORE 3: Localized Payment Architecture Selector */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">Payment Method</h3>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((pm) => {
                  const Icon = pm.icon
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors",
                        paymentMethod === pm.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-muted-foreground/30"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{pm.label}</span>
                      <span className="text-[10px] text-muted-foreground">{pm.description}</span>
                    </button>
                  )
                })}
              </div>
              {/* Card details form */}
              {paymentMethod === "card" && (
                <div className="space-y-3 mt-4 pt-4 border-t">
                  <Input
                    placeholder="Cardholder name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="h-10 text-sm"
                  />
                  <Input
                    placeholder="Card number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                    className="h-10 text-sm font-mono"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                      className="h-10 text-sm font-mono"
                    />
                    <Input
                      placeholder="CVC"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={4}
                      className="h-10 text-sm font-mono"
                      type="password"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CORE 4: Regional Driver Tipping Component */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">Add a Tip</h3>
              <p className="text-xs text-muted-foreground">100% goes to your driver</p>
              <div className="flex gap-2 flex-wrap">
                {tipPresets.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => { setTipPercentage(pct); setCustomTip("") }}
                    className={cn(
                      "flex-1 min-w-[60px] rounded-lg border py-2 text-center text-sm font-medium transition-colors",
                      tipPercentage === pct && !customTip
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:border-muted-foreground/30"
                    )}
                  >
                    {pct === 0 ? "No tip" : `${pct}%`}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Custom:</span>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  placeholder="$0.00"
                  value={customTip}
                  onChange={(e) => { setCustomTip(e.target.value); setTipPercentage(0) }}
                  className="w-24 rounded-lg border bg-background px-3 py-1.5 text-sm text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </CardContent>
          </Card>

          {/* OPTIONAL 7: Carbon Offset / Charity Round-Up Module */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                    <span className="text-sm">🌱</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Offset Carbon Footprint</p>
                    <p className="text-xs text-muted-foreground">Round up to the nearest dollar</p>
                  </div>
                </div>
                <Switch checked={carbonOffset} onCheckedChange={setCarbonOffset} />
              </div>
            </CardContent>
          </Card>

          {/* OPTIONAL 8: Tokenized Save Card Info Vault Toggle */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Save card for future orders</p>
                    <p className="text-xs text-muted-foreground">Securely tokenized &amp; encrypted</p>
                  </div>
                </div>
                <Switch checked={saveCard} onCheckedChange={setSaveCard} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Sticky Summary Ledger */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-4 mt-8 lg:mt-0">
          {/* CORE 5: Final Consolidated Financial Ledger */}
          <Card>
            <CardContent className="p-4 space-y-2.5">
              <h3 className="text-sm font-semibold">Order Summary</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span className="tabular-nums">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="tabular-nums">${totals.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="tabular-nums">${totals.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (HST)</span>
                  <span className="tabular-nums">${totals.tax.toFixed(2)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tip</span>
                    <span className="tabular-nums">${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                {carbonOffset && (
                  <div className="flex justify-between text-green-600 text-xs">
                    <span>Carbon offset</span>
                    <span>+$0.01</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* CORE 6: Primary Place Order Button */}
          <Button
            size="lg"
            className="w-full gap-2 text-base"
            disabled={processing}
            onClick={handlePlaceOrder}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </span>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Place Order &middot; ${grandTotal.toFixed(2)}
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>256-bit SSL encrypted &bull; Your data is safe</span>
          </div>

          {/* Delivery Address Summary */}
          <Card className="bg-muted/30">
            <CardContent className="p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {fulfillment.mode === "delivery" ? "Delivering to" : "Pickup at"}
                </span>
                <Button variant="ghost" size="sm" asChild className="h-5 text-[10px]">
                  <Link href="/checkout/fulfillment">Edit</Link>
                </Button>
              </div>
              <p className="font-medium">
                {fulfillment.mode === "delivery"
                  ? fulfillment.address?.formatted ?? "No address set"
                  : "Downtown Flagship"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
