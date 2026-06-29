"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { CartItem } from "@/types"

type CartState = {
  items: CartItem[]
  couponCode: string | null
  rewardsPoints: number
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateItemModifiers: (itemId: string, modifierGroupId: string, optionIds: string[]) => void
  updateItemPortionSize: (itemId: string, portionSizeId: string) => void
  updateItemSpecialInstructions: (itemId: string, instructions: string) => void
  toggleMealDealUpgrade: (itemId: string) => void
  setCouponCode: (code: string | null) => void
  applyRewardsPoints: (points: number) => void
  clearCart: () => void
  getCartTotal: () => { subtotal: number; tax: number; deliveryFee: number; serviceFee: number; discount: number; total: number }
}

let nextCartItemId = Date.now()

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      rewardsPoints: 0,

      addItem: (item) =>
        set((state) => {
          const itemToAdd = { ...item, id: item.id || `cart-${nextCartItemId++}` }
          return { items: [...state.items, itemToAdd] }
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== itemId) }
          }
          return {
            items: state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
          }
        }),

      updateItemModifiers: (itemId, modifierGroupId, optionIds) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId
              ? { ...i, selectedModifiers: { ...i.selectedModifiers, [modifierGroupId]: optionIds } }
              : i
          ),
        })),

      updateItemPortionSize: (itemId, portionSizeId) =>
        set((state) => ({
          items: state.items.map((i) => {
            const portionSize = i.product.portionSizes.find((p) => p.id === portionSizeId)
            return i.id === itemId ? { ...i, selectedPortionSize: portionSize || null } : i
          }),
        })),

      updateItemSpecialInstructions: (itemId, instructions) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, specialInstructions: instructions } : i
          ),
        })),

      toggleMealDealUpgrade: (itemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  mealDealUpgrade: i.mealDealUpgrade ? null : i.product.mealDealUpgrade,
                }
              : i
          ),
        })),

      setCouponCode: (code) => set({ couponCode: code }),

      applyRewardsPoints: (points) => set({ rewardsPoints: points }),

      clearCart: () => set({ items: [], couponCode: null, rewardsPoints: 0 }),

      getCartTotal: () => {
        const state = get()
        const subtotal = state.items.reduce((sum, item) => {
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
        const discount = 0
        const total = Math.round((subtotal + deliveryFee + serviceFee + tax - discount) * 100) / 100

        return { subtotal, tax, deliveryFee, serviceFee, discount, total }
      },
    }),
    {
      name: "oredflow-cart",
    }
  )
)