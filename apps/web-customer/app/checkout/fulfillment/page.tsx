"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFulfillmentStore } from "@/stores"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useStores } from "@/lib/mock"
import { cn } from "@/lib/utils"
import { ArrowLeft, MapPin, Store, Calendar, Leaf } from "lucide-react"

export default function FulfillmentPage() {
  const router = useRouter()
  const {
    fulfillment,
    setMode,
    setAddress,
    setPickupStore,
    setDropOffOption,
    setDropOffInstructions,
    setEntryBuzzerCode,
    setScheduledTime,
    toggleEcoPackaging,
  } = useFulfillmentStore()
  const { data: stores = [] } = useStores()

  const [street, setStreet] = useState(fulfillment.address?.street ?? "")
  const [city, setCity] = useState(fulfillment.address?.city ?? "")
  const [postalCode, setPostalCode] = useState(fulfillment.address?.postalCode ?? "")
  const [buzzer, setBuzzer] = useState(fulfillment.entryBuzzerCode ?? "")
  const [instructions, setInstructions] = useState(fulfillment.dropOffInstructions ?? "")
  const [scheduled, setScheduled] = useState(fulfillment.scheduledTime ?? "")

  const handleSave = () => {
    if (fulfillment.mode === "delivery") {
      setAddress({
        formatted: `${street}, ${city}, ${postalCode}`,
        street,
        city,
        state: "NY",
        postalCode,
        country: "US",
        lat: 40.7484,
        lng: -73.9857,
      })
      setEntryBuzzerCode(buzzer)
    } else {
      // pickup - store selection already tracked
    }
    setDropOffInstructions(instructions)
    setScheduledTime(scheduled || null)
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-10 lg:pt-20">
      <div className="w-full max-w-xl space-y-6">
        {/* CORE 1: Form-Focused Header with Back Button */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 h-8">
            <Link href="/checkout">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-lg font-bold">Delivery Details</h1>
        </div>

        {/* CORE 2: Fulfillment Mode Selector Tabs */}
        <div className="flex rounded-xl border p-1 bg-muted/30">
          <button
            onClick={() => setMode("delivery")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors",
              fulfillment.mode === "delivery"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MapPin className="h-4 w-4" />
            Delivery
          </button>
          <button
            onClick={() => setMode("pickup")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors",
              fulfillment.mode === "pickup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Store className="h-4 w-4" />
            Pickup
          </button>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            {fulfillment.mode === "delivery" ? (
              <>
                {/* CORE 3: Address Validation & Store Geolocation */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Delivery Address</h3>
                  <Input
                    placeholder="Street address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="h-10"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-10"
                    />
                    <Input
                      placeholder="Postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* CORE 4: Drop-Off Logistics Panel */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Drop-off Options</h3>
                  <div className="flex gap-2">
                    {(["leave-at-door", "meet-driver", "hand-it-to-me"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setDropOffOption(opt)}
                        className={cn(
                          "flex-1 rounded-lg border py-2 px-3 text-xs font-medium text-center transition-colors",
                          fulfillment.dropOffOption === opt
                            ? "border-primary bg-primary/5 text-primary"
                            : "text-muted-foreground hover:border-muted-foreground/30"
                        )}
                      >
                        {opt === "leave-at-door" ? "Leave at Door" : opt === "meet-driver" ? "Meet Driver" : "Hand it to me"}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Buzzer / entry code"
                      value={buzzer}
                      onChange={(e) => setBuzzer(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <textarea
                    placeholder="Additional delivery instructions..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            ) : (
              <>
                {/* CORE 3: Store Selection for Pickup */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Select Store</h3>
                  <div className="space-y-2">
                    {stores.filter((s) => s.acceptingOrders).map((store) => (
                      <button
                        key={store.id}
                        onClick={() => setPickupStore(store.id)}
                        className={cn(
                          "w-full rounded-lg border p-3 text-left transition-colors",
                          fulfillment.pickupStoreId === store.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-muted-foreground/30"
                        )}
                      >
                        <p className="text-sm font-medium">{store.name}</p>
                        <p className="text-xs text-muted-foreground">{store.address}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* CORE 5: Pre-Schedule Time Window Matrix */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule for later
              </h3>
              <input
                type="datetime-local"
                value={scheduled}
                onChange={(e) => setScheduled(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {scheduled && (
                <p className="text-xs text-muted-foreground">
                  Your order will be ready at the scheduled time
                </p>
              )}
            </div>

            {/* OPTIONAL 6: Eco-Packaging Waste Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Leaf className="h-5 w-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Eco-Friendly Packaging</p>
                  <p className="text-xs text-muted-foreground">Plastic-free &amp; utensil-free</p>
                </div>
              </div>
              <Switch checked={fulfillment.ecoPackaging} onCheckedChange={toggleEcoPackaging} />
            </div>
          </CardContent>
        </Card>

        {/* Save & Continue */}
        <Button size="lg" className="w-full" onClick={handleSave}>
          Save &amp; Continue
        </Button>
      </div>
    </div>
  )
}
