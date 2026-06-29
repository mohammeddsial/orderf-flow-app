"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const daypartSchedule: Record<string, { endHour: number; endMin: number }> = {
  breakfast: { endHour: 11, endMin: 0 },
  lunch: { endHour: 16, endMin: 0 },
  dinner: { endHour: 22, endMin: 0 },
}

function getCurrentDaypart(): string {
  const h = new Date().getHours()
  if (h < 11) return "breakfast"
  if (h < 16) return "lunch"
  return "dinner"
}

export function DaypartNotice() {
  const [timeLeft, setTimeLeft] = useState("")
  const daypart = getCurrentDaypart()

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const schedule = daypartSchedule[daypart]
      if (!schedule) return
      const end = new Date(now)
      end.setHours(schedule.endHour, schedule.endMin, 0, 0)
      const diff = end.getTime() - now.getTime()
      if (diff <= 0) return setTimeLeft("")
      const m = Math.floor(diff / 60000)
      setTimeLeft(`${m} min`)
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [daypart])

  const daypartLabel = daypart.charAt(0).toUpperCase() + daypart.slice(1)

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Badge variant="secondary" className="gap-1 text-xs">
        <Clock className="h-3 w-3" />
        {daypartLabel}
      </Badge>
      {timeLeft && (
        <span className="text-xs text-amber-500 font-medium">
          {daypart === "breakfast" ? "Breakfast" : daypart === "lunch" ? "Lunch" : "Dinner"} ends in {timeLeft}
        </span>
      )}
    </div>
  )
}
