import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
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

export const metadata: Metadata = {
  title: "oredFlow - Premium Food Delivery",
  description: "Order from the best local restaurants. Fast delivery, fresh food.",
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
