"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon?: string
  title: string
  description?: string
  action?: { label: string; href: string }
  className?: string
}

export function EmptyState({ icon: Icon = UtensilsCrossed, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
      <span className="text-6xl mb-4 opacity-40">{icon}</span>
      <p className="text-lg font-medium text-muted-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground/60 mt-1 max-w-xs">{description}</p>}
      {action && (
        <Button asChild className="mt-6">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}