import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { RestaurantThemeProvider } from "@/components/restaurant-theme-provider"
import { GlobalHeader } from "@/components/layout/global-header"
import { MiniCart } from "@/components/layout/mini-cart"
import { ActiveOrderTracker } from "@/components/layout/active-order-tracker"
import { Footer } from "@/components/layout/footer"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1"

async function fetchRestaurantName(): Promise<string> {
  try {
    const activeRes = await fetch(`${API_BASE_URL}/active_restaurant`, {
      cache: "no-store",
    })
    if (!activeRes.ok) return "Order Flow"
    const { restaurantId } = await activeRes.json()
    if (!restaurantId) return "Order Flow"
    const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
      cache: "no-store",
    })
    if (!res.ok) return "Order Flow"
    const restaurant = await res.json()
    return restaurant?.name || "Order Flow"
  } catch {
    return "Order Flow"
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const name = await fetchRestaurantName()
  return {
    title: `${name} — Premium Food Delivery`,
    description: `Order from ${name}. Fast delivery, fresh food.`,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          <Providers>
            <RestaurantThemeProvider />
            <div className="flex min-h-screen flex-col">
              <GlobalHeader />
              <ActiveOrderTracker />
              <main className="flex-1">{children}</main>
              <Footer />
              <MiniCart />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
