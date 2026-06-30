"use client"

import { useUserStore } from "@/stores"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Cake } from "lucide-react"

export function BirthdayBanner() {
  const user = useUserStore((s) => s.user)
  const birthDate = new Date(user.birthday)
  const today = new Date()
  const isBirthdayMonth = birthDate.getMonth() === today.getMonth()

  if (!isBirthdayMonth) return null

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <Card className="engine-card bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-background border-pink-500/20 overflow-hidden p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20">
              <Cake className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <p className="font-bold text-lg">Happy Birthday Month, {user.name}!</p>
              <p className="text-sm text-muted-foreground">
                Enjoy a free dessert on us — your birthday gift is ready
              </p>
            </div>
          </div>
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            <Gift className="h-4 w-4 mr-2" />
            Claim Free Gift
          </Button>
        </div>
      </Card>
    </section>
  )
}