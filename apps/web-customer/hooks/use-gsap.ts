"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export function useGsapHover(ref: React.RefObject<HTMLElement | null>, options?: {
  scale?: number
  duration?: number
  shadow?: boolean
}) {
  const { scale = 1.03, duration = 0.3, shadow = true } = options || {}

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onEnter = () => {
      gsap.to(el, {
        scale,
        boxShadow: shadow ? "0 10px 40px rgba(0,0,0,0.12)" : undefined,
        duration,
        ease: "power2.out",
      })
    }

    const onLeave = () => {
      gsap.to(el, {
        scale: 1,
        boxShadow: shadow ? "0 1px 3px rgba(0,0,0,0.05)" : undefined,
        duration,
        ease: "power2.out",
      })
    }

    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)

    return () => {
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [ref, scale, duration, shadow])
}

export function useGsapStagger(ref: React.RefObject<HTMLElement | null>, options?: {
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  stagger?: number
  trigger?: boolean
}) {
  const { from = { y: 30, opacity: 0 }, to = { y: 0, opacity: 1 }, stagger = 0.08, trigger = true } = options || {}

  useEffect(() => {
    if (!trigger) return
    const el = ref.current
    if (!el) return

    const children = Array.from(el.children) as HTMLElement[]
    if (children.length === 0) return

    gsap.fromTo(children, from, {
      ...to,
      stagger,
      ease: "power2.out",
      duration: 0.5,
    })
  }, [ref, trigger])
}
