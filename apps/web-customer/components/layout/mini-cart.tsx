"use client"

import { useCartStore, useUIStore } from "@/stores"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ProductImage } from "@/components/shared/product-image"
import { getProductImages } from "@/lib/images"

export function MiniCart() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const { cartDrawerOpen, setCartDrawerOpen } = useUIStore()
  const pathname = usePathname()

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      let price = item.product.basePrice
      if (item.selectedPortionSize) {
        price *= item.selectedPortionSize.priceMultiplier
      }
      Object.entries(item.selectedModifiers).forEach(([, optionIds]) => {
        optionIds.forEach((oid) => {
          const modifierGroup = item.product.modifiers.find((mg) =>
            mg.options.some((o) => o.id === oid)
          )
          if (modifierGroup) {
            const option = modifierGroup.options.find((o) => o.id === oid)
            if (option) price += option.priceAdjustment
          }
        })
      })
      if (item.mealDealUpgrade) {
        price += item.mealDealUpgrade.price
      }
      return sum + price * item.quantity
    }, 0)

    const deliveryFee = 3.99
    const serviceFee = Math.round(subtotal * 0.05 * 100) / 100
    const tax = Math.round(subtotal * 0.0875 * 100) / 100
    const total = Math.round((subtotal + deliveryFee + serviceFee + tax) * 100) / 100

    return { subtotal, deliveryFee, serviceFee, tax, total }
  }, [items])

  if (pathname.startsWith("/checkout") || pathname.startsWith("/order/success")) return null

  const isEmpty = items.length === 0

  return (
    <>
      {/* Floating footer bar (mobile) */}
      {!isEmpty && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 max-w-[1400px] mx-auto">
<button
  onClick={() => setCartDrawerOpen(true)}
              className="flex items-center gap-3 text-sm"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="font-medium">
                {items.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </button>
            <div className="flex items-center gap-3">
              <span className="font-bold">${totals.total.toFixed(2)}</span>
              <Button size="sm">Checkout</Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Mini Cart Sheet (triggered by header bag icon) */}
      <Sheet open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
        <SheetContent className="w-[380px] sm:max-w-[420px] flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </SheetTitle>
          </SheetHeader>

          <Separator />

          {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 opacity-20" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm">Add some delicious items to get started</p>
              <Button variant="outline" asChild>
                <Link href="/menu" onClick={() => setCartDrawerOpen(false)}>
                  Browse Menu
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-3 py-2">
                  {items.map((item) => {
                    const portionMultiplier = item.selectedPortionSize?.priceMultiplier ?? 1
                    const modifierAdjustments = Object.entries(item.selectedModifiers).reduce(
                      (sum, [, optionIds]) => {
                        optionIds.forEach((oid) => {
                          const mg = item.product.modifiers.find((m) =>
                            m.options.some((o) => o.id === oid)
                          )
                          const opt = mg?.options.find((o) => o.id === oid)
                          if (opt) sum += opt.priceAdjustment
                        })
                        return sum
                      },
                      0
                    )
                    const unitPrice =
                      item.product.basePrice * portionMultiplier +
                      modifierAdjustments +
                      (item.mealDealUpgrade?.price ?? 0)

                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 rounded-lg border p-3 bg-muted/30"
                      >
                        <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden">
                          <ProductImage src={getProductImages(item.product.id).main} alt={item.product.name} aspectRatio="aspect-square" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product.name}</p>
                          {item.selectedPortionSize && (
                            <p className="text-xs text-muted-foreground">
                              {item.selectedPortionSize.sizeLabel}
                            </p>
                          )}
                          {item.mealDealUpgrade && (
                            <p className="text-xs text-primary">+ Meal Deal</p>
                          )}
                          {item.specialInstructions && (
                            <p className="text-xs text-muted-foreground italic truncate">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                          <p className="text-sm font-medium mt-1">
                            ${unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              <Separator />

              <div className="space-y-2 py-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>${totals.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>${totals.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" asChild>
                <Link href="/cart" onClick={() => setCartDrawerOpen(false)}>
                  View Cart & Checkout
                </Link>
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}