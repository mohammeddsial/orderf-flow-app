"use client"

import { useUserStore } from "@/stores"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Gift, ChevronRight, Crown } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const tierConfig = {
  bronze: { color: "bg-amber-700", text: "text-amber-700", badge: "Bronze" },
  silver: { color: "bg-slate-400", text: "text-slate-400", badge: "Silver" },
  gold: { color: "bg-amber-500", text: "text-amber-500", badge: "Gold" },
  platinum: { color: "bg-indigo-500", text: "text-indigo-500", badge: "Platinum" },
}

export function LoyaltyCard() {
  const user = useUserStore((s) => s.user)
  const tier = tierConfig[user.tier]
  const progress = (user.tierPointsCurrent / user.tierPointsNeeded) * 100

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <Card className={cn("overflow-hidden border-2", `border-${tier.color.split("-")[1]}-500/30`)}>
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-background p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", tier.color)} variant="secondary">
                    {tier.badge} Tier
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {user.points.toLocaleString()} pts
                  </span>
                </div>
                <p className="font-semibold text-lg mt-0.5">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/rewards">
                  <Gift className="h-4 w-4 mr-1" />
                  Redeem
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="/rewards">
                  Rewards
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progress to {user.tierPointsNeeded.toLocaleString()} pts</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {user.tierPointsNeeded - user.tierPointsCurrent} points until next tier
            </p>
          </div>
        </div>
      </Card>
    </section>
  )
}