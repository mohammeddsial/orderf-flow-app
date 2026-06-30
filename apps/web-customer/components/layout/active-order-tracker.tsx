"use client"

import Link from "next/link"
import { useOrderStore } from "@/stores"
import { Bike, Clock, ChefHat, Package } from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { icon: typeof Bike; label: string }> = {
  "order-placed": { icon: Package, label: "Order Placed" },
  preparing: { icon: ChefHat, label: "Preparing" },
  cooking: { icon: ChefHat, label: "Cooking" },
  "out-for-delivery": { icon: Bike, label: "On the Way" },
  delivered: { icon: Package, label: "Delivered" },
};

export function ActiveOrderTracker() {
  const { activeOrder, hasActiveOrder } = useOrderStore();

  if (!hasActiveOrder || !activeOrder) return null;

  const cfg = statusConfig[activeOrder.status] ?? statusConfig["order-placed"];
  const Icon = cfg.icon;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <Link
        href={`/order/success/${activeOrder.id}`}
        className="pointer-events-auto block max-w-md mx-auto bg-background border rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{cfg.label}</p>
            <p className="text-xs text-muted-foreground">
              Order #{activeOrder.id?.slice(-6)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium tabular-nums text-primary shrink-0">
            <Clock className="h-3.5 w-3.5" />
            <span>{activeOrder.estimatedDeliveryTime ?? 25} min</span>
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((activeOrder.status === "delivered" ? 5 : 3) / 5) * 100}%` }}
          />
        </div>
      </Link>
    </div>
  );
}
