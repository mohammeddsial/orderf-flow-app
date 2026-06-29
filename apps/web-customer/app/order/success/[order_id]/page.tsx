"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useOrderStore, useUserStore } from "@/stores"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  ChefHat,
  Bike,
  Package,
  Clock,
  MapPin,
  ChevronDown,
  Download,
  Gift,
  MessageCircle,
  Phone,
  Home,
} from "lucide-react"

const statusSteps = [
  { key: "order-placed", label: "Order Placed", icon: CheckCircle2 },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "cooking", label: "Cooking", icon: ChefHat },
  { key: "out-for-delivery", label: "On the Way", icon: Bike },
  { key: "delivered", label: "Delivered", icon: Package },
]

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ order_id: string }>
}) {
  const router = useRouter()
  const { activeOrder, hasActiveOrder } = useOrderStore()
  const user = useUserStore((s) => s.user)
  const [showSummary, setShowSummary] = useState(false)
  const [etaMinutes, setEtaMinutes] = useState(25)

  useEffect(() => {
    if (!hasActiveOrder || !activeOrder) {
      router.replace("/")
      return
    }
    const interval = setInterval(() => {
      setEtaMinutes((prev) => Math.max(0, prev - 1))
    }, 60000)
    return () => clearInterval(interval)
  }, [hasActiveOrder, activeOrder, router])

  if (!hasActiveOrder || !activeOrder) return null

  const currentStepIndex = statusSteps.findIndex((s) => s.key === activeOrder.status)
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100

  return (
    <div className="min-h-screen">
      {/* CORE 1: Root-Level Header — NO BACK BUTTON */}
      <div className="border-b">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-primary">ored</span>
            <span>Flow</span>
          </div>
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go to Home
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* CORE 2: High-Celebration Confirmation Block */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order Confirmed!</h1>
            <p className="text-muted-foreground mt-1">
              Your order <span className="font-medium text-foreground">#{activeOrder.id}</span> is being prepared
            </p>
          </div>
        </div>

        {/* OPTIONAL 6: Instant Loyalty Accrual Banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Gift className="h-6 w-6 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">You earned 120 points!</p>
              <p className="text-xs text-muted-foreground">
                {user.points + 120} total points &middot; {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} tier
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="shrink-0 text-xs">
              <Link href="/rewards">View Rewards</Link>
            </Button>
          </CardContent>
        </Card>

        {/* CORE 3: Live Map Telemetry & Driver Status */}
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="aspect-[3/1] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary/40 mx-auto" />
                <p className="text-xs text-muted-foreground mt-1">Live map loading...</p>
              </div>
            </div>
            {activeOrder.driver && (
              <div className="flex items-center gap-3 p-4 border-t">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">
                  👨‍🍳
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activeOrder.driver.name}</p>
                  <p className="text-xs text-muted-foreground">{activeOrder.driver.vehicle}</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 text-xs">
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                  Contact
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CORE 4: Dynamic Precision ETA Counter */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Estimated arrival</span>
          </div>
          <p className="text-5xl font-extrabold tracking-tight tabular-nums">
            {etaMinutes}:00
          </p>
          <p className="text-sm text-muted-foreground mt-1">minutes</p>
        </div>

        {/* Order Status Progress */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Order placed</span>
              <span>Delivered</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="space-y-3">
              {statusSteps.map((step, i) => {
                const isComplete = i <= currentStepIndex
                const Icon = step.icon
                return (
                  <div key={step.key} className={cn(
                    "flex items-center gap-3 text-sm",
                    isComplete ? "text-foreground" : "text-muted-foreground/50"
                  )}>
                    <div className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      isComplete ? "bg-primary/10 text-primary" : "bg-muted"
                    )}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className={cn(isComplete && "font-medium")}>{step.label}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* CORE 5: Order Summary Dropdown & Receipt Vault */}
        <Card>
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="flex items-center justify-between w-full p-4 text-left"
          >
            <span className="text-sm font-medium">Order Summary</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", showSummary && "rotate-180")} />
          </button>
          {showSummary && (
            <div className="px-4 pb-4 space-y-3 border-t pt-3">
              {activeOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="tabular-nums font-medium">${(item.product.basePrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">${activeOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="tabular-nums">${activeOrder.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="tabular-nums font-bold">${activeOrder.total.toFixed(2)}</span>
              </div>
              <Separator />
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                <Download className="h-3.5 w-3.5" />
                Download Receipt (PDF)
              </Button>
            </div>
          )}
        </Card>

        {/* OPTIONAL 7: Emergency Support Shortcut */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Phone className="h-5 w-5 text-destructive shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Need help with your order?</p>
              <p className="text-xs text-muted-foreground">Contact support for assistance</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 text-xs">
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              Contact
            </Button>
          </CardContent>
        </Card>

        {/* Review Prompt */}
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href={`/order/review/${activeOrder.id}`}>
              Rate Your Experience
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
