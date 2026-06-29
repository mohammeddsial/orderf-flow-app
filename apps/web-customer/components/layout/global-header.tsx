"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useCartStore, useUserStore, useFulfillmentStore, useUIStore } from "@/stores"
import { stores } from "@/lib/mock"
import {
  ShoppingBag,
  MapPin,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  RotateCcw,
  Gift,
  Star,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function GlobalHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const items = useCartStore((s) => s.items)
  const user = useUserStore((s) => s.user)
  const fulfillment = useFulfillmentStore((s) => s.fulfillment)
  const setMode = useFulfillmentStore((s) => s.setMode)
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedStore, setSelectedStore] = useState(stores[0])

  useEffect(() => setMounted(true), [])

  if (pathname.startsWith("/checkout") || pathname.startsWith("/order/success") || pathname === "/cart") return null

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-primary">ored</span>
          <span>Flow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          <Button variant="ghost" asChild size="sm">
            <Link href="/menu">Menu</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/rewards">
              <Gift className="h-4 w-4 mr-1" />
              Rewards
            </Link>
          </Button>
        </nav>

        <div className="flex-1" />

        {/* Store/Location Picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 max-w-[220px]">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate text-xs">{selectedStore.name}</span>
              <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px]">
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

        {/* Delivery/Pickup Toggle */}
        <div className="hidden sm:flex rounded-lg border p-0.5">
          <Button
            variant={fulfillment.mode === "delivery" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs rounded-md"
            onClick={() => setMode("delivery")}
          >
            Delivery
          </Button>
          <Button
            variant={fulfillment.mode === "pickup" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs rounded-md"
            onClick={() => setMode("pickup")}
          >
            Pickup
          </Button>
        </div>

        {/* Cart */}
        <Button
          variant="outline"
          size="icon"
          className="relative shrink-0"
          onClick={() => setCartDrawerOpen(true)}
        >
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {cartCount}
            </span>
          )}
        </Button>

        {/* Rewards / Profile */}
        <Button variant="ghost" size="icon" asChild className="shrink-0 hidden sm:flex">
          <Link href="/rewards">
            <Star className="h-4 w-4" />
          </Link>
        </Button>

        {/* Dark mode toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="shrink-0"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}

        {/* Mobile Menu Trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="border-t lg:hidden py-3 px-4 max-w-[1400px] mx-auto flex flex-col gap-2">
          <Button variant="ghost" asChild className="justify-start" size="sm">
            <Link href="/menu" onClick={() => setMobileMenuOpen(false)}>
              Menu
            </Link>
          </Button>
          <Button variant="ghost" asChild className="justify-start" size="sm">
            <Link href="/rewards" onClick={() => setMobileMenuOpen(false)}>
              <Gift className="h-4 w-4 mr-2" />
              Rewards
            </Link>
          </Button>
          <Button variant="ghost" asChild className="justify-start" size="sm">
            <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Cart{cartCount > 0 && ` (${cartCount})`}
            </Link>
          </Button>
          <div className="flex rounded-lg border p-0.5 w-fit">
            <Button
              variant={fulfillment.mode === "delivery" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs rounded-md"
              onClick={() => setMode("delivery")}
            >
              Delivery
            </Button>
            <Button
              variant={fulfillment.mode === "pickup" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs rounded-md"
              onClick={() => setMode("pickup")}
            >
              Pickup
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export { GlobalHeader as default }