"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { UtensilsCrossed } from "lucide-react"

type ProductImageProps = {
  src: string
  alt: string
  className?: string
  aspectRatio?: string
  priority?: boolean
}

export function ProductImage({ src, alt, className, aspectRatio = "aspect-[4/3]", priority }: ProductImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={cn("relative overflow-hidden bg-muted", aspectRatio, className)}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-background animate-pulse" />
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <UtensilsCrossed className="h-10 w-10 opacity-30" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            "h-full w-full object-cover transition-all duration-500",
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        />
      )}
    </div>
  )
}
