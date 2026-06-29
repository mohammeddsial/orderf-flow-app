"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "@/types"
import { mockUser } from "@/lib/mock"

type UserState = {
  user: User
  isLoggedIn: boolean
  setUser: (user: User) => void
  updatePoints: (points: number) => void
  updateTier: (tier: User["tier"]) => void
  addAddress: (address: User["savedAddresses"][0]) => void
  removeAddress: (index: number) => void
  setDietaryPreferences: (preferences: User["dietaryPreferences"]) => void
  setAllergenAlerts: (allergens: User["allergenAlerts"]) => void
  redeemPoints: (points: number) => void
  earnPoints: (points: number) => void
  login: () => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: mockUser,
      isLoggedIn: true,

      setUser: (user) => set({ user }),
      updatePoints: (points) =>
        set((state) => ({
          user: { ...state.user, points },
        })),
      updateTier: (tier) =>
        set((state) => ({
          user: { ...state.user, tier },
        })),
      addAddress: (address) =>
        set((state) => ({
          user: {
            ...state.user,
            savedAddresses: [...state.user.savedAddresses, address],
          },
        })),
      removeAddress: (index) =>
        set((state) => ({
          user: {
            ...state.user,
            savedAddresses: state.user.savedAddresses.filter((_, i) => i !== index),
          },
        })),
      setDietaryPreferences: (preferences) =>
        set((state) => ({
          user: { ...state.user, dietaryPreferences: preferences },
        })),
      setAllergenAlerts: (allergens) =>
        set((state) => ({
          user: { ...state.user, allergenAlerts: allergens },
        })),
      redeemPoints: (points) =>
        set((state) => ({
          user: { ...state.user, points: state.user.points - points },
        })),
      earnPoints: (points) =>
        set((state) => ({
          user: { ...state.user, points: state.user.points + points },
        })),
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: "oredflow-user",
    }
  )
)