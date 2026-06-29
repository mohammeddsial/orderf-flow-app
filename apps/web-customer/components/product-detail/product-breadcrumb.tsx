"use client"

import Link from "next/link"
import { ChevronLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ProductBreadcrumbProps = {
  productName: string
}

export function ProductBreadcrumb({ productName }: ProductBreadcrumbProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" asChild className="-ml-2 h-8">
          <Link href="/menu">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Menu
          </Link>
        </Button>
        <span className="hidden sm:inline">/</span>
        <span className="hidden sm:inline truncate max-w-[200px] font-medium text-foreground">
          {productName}
        </span>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}