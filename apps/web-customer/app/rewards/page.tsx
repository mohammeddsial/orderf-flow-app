"use client"

import { useState } from "react"
import Link from "next/link"
import { useUserStore, useOrderStore } from "@/stores"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useRewards, useDeals } from "@/lib/mock"
import { images } from "@/lib/images"
import {
  Crown,
  Gift,
  QrCode,
  Star,
  ChevronRight,
  Clock,
  ChefHat,
  Bike,
  Ticket,
} from "lucide-react"

const rewardImages: Record<string, string> = {
  "rew-free-fries": images.freeFries,
  "rew-free-drink": images.freeDrink,
  "rew-free-burger": images.freeBurger,
  "rew-free-milkshake": images.freeMilkshake,
  "rew-free-delivery": images.dealFreeDelivery,
  "rew-combo-meal": images.comboMeal,
  "rew-merch-hat": images.merchHat,
  "rew-merch-hoodie": images.merchHoodie,
}

const tierConfig = {
  bronze: { color: "from-amber-700 to-amber-600", badge: "Bronze", next: "Silver", points: 1000 },
  silver: { color: "from-slate-400 to-slate-300", badge: "Silver", next: "Gold", points: 2500 },
  gold: { color: "from-amber-500 to-amber-400", badge: "Gold", next: "Platinum", points: 5000 },
  platinum: { color: "from-indigo-500 to-indigo-400", badge: "Platinum", next: null, points: 0 },
}

export default function RewardsPage() {
  const user = useUserStore((s) => s.user)
  const earnPoints = useUserStore((s) => s.earnPoints)
  const redeemPoints = useUserStore((s) => s.redeemPoints)
  const { activeOrder, hasActiveOrder } = useOrderStore()
  const [showQR, setShowQR] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const tier = tierConfig[user.tier]
  const progress = (user.tierPointsCurrent / user.tierPointsNeeded) * 100
  const pointsToNext = user.tierPointsNeeded - user.tierPointsCurrent

  const myRewards = useRewards()
  const deals = useDeals()
  const groupedRewards = myRewards.filter((r) => {
    if (activeTab === "all") return true
    const points = parseInt(activeTab)
    return r.pointsCost <= points + 100 && r.pointsCost > points - 100
  })

  const tabValues = [
    { value: "all", label: "All" },
    { value: "200", label: "200 pts" },
    { value: "500", label: "500 pts" },
    { value: "1000", label: "1000 pts" },
  ]

  return (
    <div className="min-h-screen pb-20 lg:pb-0">

      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* CORE 2: Loyalty Dashboard */}
        <Card className={cn("overflow-hidden", tier.color)}>
          <div className={cn("bg-gradient-to-r p-6 text-white", tier.color)}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="h-5 w-5" />
                  <Badge className="bg-white/20 text-white border-white/20 text-xs">
                    {tier.badge} Tier
                  </Badge>
                </div>
                <p className="text-4xl font-extrabold mt-2">{user.points.toLocaleString()}</p>
                <p className="text-sm text-white/80 mt-0.5">total points</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30 border-0"
                onClick={() => setShowQR(!showQR)}
              >
                <QrCode className="h-4 w-4 mr-1" />
                Scan to Earn
              </Button>
            </div>
            {tier.next && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/80 mb-1">
                  <span>{pointsToNext.toLocaleString()} pts to {tier.next}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/20 [&>div]:bg-white" />
              </div>
            )}
          </div>
        </Card>

        {/* CORE 3: Scan to Earn Web Card */}
        {showQR && (
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-muted mb-4">
                <QrCode className="h-20 w-20 text-primary/40" />
              </div>
              <p className="font-semibold">Show this code at checkout</p>
              <p className="text-xs text-muted-foreground mt-1">
                Present to any cashier to earn points on in-store purchases
              </p>
              <Badge variant="secondary" className="mt-3 font-mono text-sm px-4 py-1">
                {user.id}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => setShowQR(false)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CORE 4: Just for You Personalized Offers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Just for You</h2>
              <p className="text-sm text-muted-foreground">Personalized offers based on your taste</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {deals.slice(0, 4).map((deal) => (
              <Card key={deal.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                <div className="aspect-[2/1] bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-primary/40" />
                </div>
                <CardContent className="p-3 space-y-1">
                  <p className="text-sm font-semibold">{deal.title}</p>
                  <p className="text-xs text-muted-foreground">{deal.description}</p>
                  <Badge variant="secondary" className="mt-1 text-[10px] font-mono">
                    {deal.code}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CORE 5: Tiered Redemption Catalog */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight">Redeem Points</h2>
            <p className="text-sm text-muted-foreground">Exchange your points for rewards</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {tabValues.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {groupedRewards.map((reward) => {
                  const canAfford = user.points >= reward.pointsCost
                  const isTierLocked = reward.tier !== "all" && reward.tier !== user.tier
                  const pointsToTiers: Record<string, number> = { silver: 1000, gold: 2500, platinum: 5000 }

                  return (
                    <Card
                      key={reward.id}
                      className={cn(
                        "overflow-hidden transition-colors",
                        canAfford && !isTierLocked
                          ? "hover:border-primary/50 cursor-pointer"
                          : "opacity-60"
                      )}
                    >
<div className="aspect-square bg-muted overflow-hidden">
                      <img src={rewardImages[reward.id] || images.freeBurger} alt={reward.name} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                      <CardContent className="p-3 space-y-1.5">
                        <p className="text-sm font-medium truncate">{reward.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{reward.description}</p>
                        <div className="flex items-center justify-between pt-1">
                          <Badge
                            variant={canAfford && !isTierLocked ? "default" : "secondary"}
                            className="text-[10px]"
                          >
                            {reward.pointsCost} pts
                          </Badge>
                          {isTierLocked && (
                            <span className="text-[10px] text-muted-foreground">
                              {reward.tier} tier
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="w-full h-7 text-xs"
                          variant={canAfford && !isTierLocked ? "default" : "outline"}
                          disabled={!canAfford || isTierLocked}
                          onClick={() => {
                            if (canAfford && !isTierLocked) {
                              redeemPoints(reward.pointsCost)
                            }
                          }}
                        >
                          {isTierLocked
                            ? `${reward.tier} only`
                            : canAfford
                              ? "Redeem"
                              : `${reward.pointsCost - user.points} more pts`}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* CORE 6: Active Order Tracker Anchor */}
        {hasActiveOrder && activeOrder && (
          <Link
            href={`/order/success/${activeOrder.id}`}
            className="block rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                {activeOrder.status === "out-for-delivery" ? (
                  <Bike className="h-5 w-5 text-primary" />
                ) : (
                  <ChefHat className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Active Order</p>
                <p className="text-xs text-muted-foreground">
                  #{activeOrder.id} &middot; {activeOrder.status.replace("-", " ")}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
