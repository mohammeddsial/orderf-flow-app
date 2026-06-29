"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { X, Star, Upload, Camera, Gift, ChevronRight } from "lucide-react"

const tasteChips = [
  "Delicious", "Fresh", "Hot & Ready", "Generous Portion",
  "Perfectly Cooked", "Well Packaged", "Great Value",
]

const deliveryChips = [
  "Arrived Hot", "On Time", "Friendly Driver", "Secure Packaging",
  "Delayed Dispatch", "Wrong Item", "Missing Item",
]

export default function ReviewsPage({
  params,
}: {
  params: Promise<{ order_id: string }>
}) {
  const router = useRouter()
  const [tasteRating, setTasteRating] = useState(0)
  const [deliveryRating, setDeliveryRating] = useState(0)
  const [hoverTaste, setHoverTaste] = useState(0)
  const [hoverDelivery, setHoverDelivery] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [feedback, setFeedback] = useState("")
  const [mediaFiles, setMediaFiles] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const newFiles = files.map((f) => URL.createObjectURL(f))
    setMediaFiles((prev) => [...prev, ...newFiles].slice(0, 4))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  const canSubmit = tasteRating > 0 && deliveryRating > 0

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Star className="h-8 w-8 text-green-500 fill-green-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold">Thank You!</h2>
          <p className="text-sm text-muted-foreground">
            Your feedback helps us improve. You earned 50 points!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* CORE 1: Lightweight Dismissal Header */}
        <div className="flex items-center justify-between mb-6">
          <div />
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Close
          </Button>
        </div>

        {/* OPTIONAL 7: Social Incentive Hook */}
        <Card className="border-primary/20 bg-primary/5 mb-6">
          <CardContent className="flex items-center gap-3 p-3">
            <Gift className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Earn 50 points for your review!</p>
              <p className="text-xs text-muted-foreground">Help others decide &amp; get rewarded</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold tracking-tight">Rate Your Experience</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your feedback helps us serve you better
          </p>
        </div>

        {/* CORE 2: Dual-Vector Feedback System */}
        <div className="space-y-6 mb-6">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">Food Quality</h3>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverTaste(star)}
                    onMouseLeave={() => setHoverTaste(0)}
                    onClick={() => setTasteRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        (hoverTaste || tasteRating) >= star
                          ? "fill-amber-500 text-amber-500"
                          : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {tasteRating > 0 ? `${tasteRating} out of 5 stars` : "Tap to rate"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">Delivery Experience</h3>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverDelivery(star)}
                    onMouseLeave={() => setHoverDelivery(0)}
                    onClick={() => setDeliveryRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        (hoverDelivery || deliveryRating) >= star
                          ? "fill-amber-500 text-amber-500"
                          : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {deliveryRating > 0 ? `${deliveryRating} out of 5 stars` : "Tap to rate"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CORE 3: Quick Attribute Descriptive Chips */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Quick Feedback</h3>
          <div className="flex flex-wrap gap-2">
            {tasteChips.map((chip) => (
              <button
                key={chip}
                onClick={() => toggleTag(chip)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  selectedTags.includes(chip)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                )}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Delivery Feedback</h3>
          <div className="flex flex-wrap gap-2">
            {deliveryChips.map((chip) => (
              <button
                key={chip}
                onClick={() => toggleTag(chip)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  selectedTags.includes(chip)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                )}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* CORE 4: Deep-Dive Qualitative Feedback Window */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Tell us more</h3>
          <Textarea
            placeholder="Share your experience... what did you love? What could be better?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>

        {/* CORE 5: Media Upload Attachment Node */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Add Photos</h3>
          <div className="flex gap-3">
            {mediaFiles.map((url, i) => (
              <div key={i} className="relative h-16 w-16 rounded-lg bg-muted overflow-hidden">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => setMediaFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {mediaFiles.length < 4 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors"
              >
                <Camera className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* CORE 6: Submission Finalization CTA */}
        <Button
          size="lg"
          className="w-full gap-2"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Submit Review
          <ChevronRight className="h-4 w-4" />
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Your review will be public and helps other customers
        </p>
      </div>
    </div>
  )
}
