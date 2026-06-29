"use client"

import { Badge } from "@/components/ui/badge"
import { AlertCircle, X } from "lucide-react"
import { useState } from "react"

export function AnnouncementStrip() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="flex items-center justify-between gap-3 px-4 py-2 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 text-sm overflow-hidden">
          <AlertCircle className="h-4 w-4 text-primary shrink-0" />
          <p className="truncate">
            <span className="font-medium">Delivery update:</span>{" "}
            <span className="text-muted-foreground">
              All stores operating normally. Average delivery time 25-35 min.
            </span>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}