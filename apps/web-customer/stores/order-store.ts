"use client"

import { create } from "zustand"
import { Order } from "@/types"
import { activeOrder } from "@/lib/mock"

type OrderState = {
  activeOrder: Order | null
  hasActiveOrder: boolean
  setActiveOrder: (order: Order) => void
  updateOrderStatus: (status: Order["status"], message: string) => void
  updateEta: (eta: string) => void
  clearActiveOrder: () => void
}

export const useOrderStore = create<OrderState>()((set) => ({
  activeOrder: activeOrder,
  hasActiveOrder: true,

  setActiveOrder: (order) => set({ activeOrder: order, hasActiveOrder: true }),

  updateOrderStatus: (status, message) =>
    set((state) => {
      if (!state.activeOrder) return state
      return {
        activeOrder: {
          ...state.activeOrder,
          status,
          tracking: [
            ...state.activeOrder.tracking,
            {
              timestamp: new Date().toISOString(),
              status,
              message,
            },
          ],
        },
      }
    }),

  updateEta: (eta) =>
    set((state) => {
      if (!state.activeOrder) return state
      return {
        activeOrder: { ...state.activeOrder, estimatedDelivery: eta },
      }
    }),

  clearActiveOrder: () => set({ activeOrder: null, hasActiveOrder: false }),
}))