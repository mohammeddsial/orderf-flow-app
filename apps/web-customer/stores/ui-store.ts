"use client"

import { create } from "zustand"

type UIState = {
  cartDrawerOpen: boolean
  setCartDrawerOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  cartDrawerOpen: false,
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
}))