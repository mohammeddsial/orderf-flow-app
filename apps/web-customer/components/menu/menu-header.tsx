"use client"

import { stores } from "@/lib/mock"
import { MapPin, Clock, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function MenuHeader() {
  const [selectedStore, setSelectedStore] = useState(stores[0])

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 lg:px-6 py-4 border-b bg-background max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary shrink-0" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 px-2 font-medium">
              <span className="truncate max-w-[180px]">{selectedStore.name}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[280px]">
            {stores.map((store) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className="flex flex-col items-start gap-0.5"
                disabled={!store.acceptingOrders}
              >
                <span className="font-medium text-sm">{store.name}</span>
                <span className="text-xs text-muted-foreground">
                  {store.address} &middot; {store.distance}mi
                  {!store.acceptingOrders && " (Closed)"}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Badge variant="secondary" className="gap-1 text-xs">
          <Clock className="h-3 w-3" />
          Kitchen open until {selectedStore.kitchenOpenUntil}
        </Badge>
      </div>
    </div>
  )
}
