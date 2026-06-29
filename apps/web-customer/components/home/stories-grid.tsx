"use client"

import { useState } from "react"
import { Play, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { images } from "@/lib/images"
import { products } from "@/lib/mock"

const storyData = products.slice(0, 8).map((p, i) => ({
  id: p.id,
  title: p.name,
  src: [images.story0, images.story1, images.story2, images.story3, images.story4, images.story5, images.story6, images.story7][i],
  gradient: [
    "from-violet-800/60 via-purple-800/40",
    "from-emerald-800/60 via-teal-800/40",
    "from-orange-800/60 via-amber-800/40",
    "from-blue-800/60 via-indigo-800/40",
    "from-rose-800/60 via-pink-800/40",
    "from-lime-800/60 via-green-800/40",
    "from-red-800/60 via-rose-800/40",
    "from-sky-800/60 via-blue-800/40",
  ][i],
}))

export function StoriesGrid() {
  const [activeStory, setActiveStory] = useState<string | null>(null)

  return (
    <section className="py-10 px-4 lg:px-6 max-w-[1400px] mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Food Stories</h2>
        <p className="text-sm text-muted-foreground mt-1">See how your favorites are made</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {storyData.map((story) => {
          const isActive = activeStory === story.id
          return (
            <button
              key={story.id}
              onClick={() => setActiveStory(isActive ? null : story.id)}
              className="group"
            >
              <div
                className={cn(
                  "w-full rounded-2xl overflow-hidden relative transition-all duration-300 border-2",
                  isActive ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]" : "border-transparent hover:border-white/30"
                )}
              >
                <div className="relative pt-[75%]">
                  <img src={story.src} alt={story.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <div className={cn("absolute inset-0 bg-gradient-to-b", story.gradient)} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-3">
                    <div className="flex gap-1">
                      <div className={cn("h-1 w-4 rounded-full transition-colors", isActive ? "bg-primary" : "bg-white/60")} />
                      <div className="h-1 w-4 rounded-full bg-white/30" />
                      <div className="h-1 w-4 rounded-full bg-white/30" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Play className="h-3.5 w-3.5 text-white fill-white" />
                    </div>
                    <span className="text-[10px] text-white/90 text-center leading-tight font-medium drop-shadow-lg">
                      {story.title}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
      {activeStory && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-muted/50 to-muted border hover:border-primary/30 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-primary/40" />
              <div>
                <p className="text-sm font-medium">{storyData.find((s) => s.id === activeStory)?.title}</p>
                <p className="text-xs text-muted-foreground">Watch how this dish is prepared from scratch</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      )}
    </section>
  )
}