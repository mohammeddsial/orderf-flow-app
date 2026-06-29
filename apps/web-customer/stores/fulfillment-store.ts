"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Fulfillment, FulfillmentMode } from "@/types"

type FulfillmentState = {
  fulfillment: Fulfillment
  setMode: (mode: FulfillmentMode) => void
  setAddress: (address: Fulfillment["address"]) => void
  setPickupStore: (storeId: string) => void
  setDropOffOption: (option: Fulfillment["dropOffOption"]) => void
  setDropOffInstructions: (instructions: string) => void
  setEntryBuzzerCode: (code: string) => void
  setScheduledTime: (time: string | null) => void
  toggleEcoPackaging: () => void
  resetFulfillment: () => void
}

const defaultFulfillment: Fulfillment = {
  mode: "delivery",
  pickupStoreId: null,
  address: null,
  dropOffInstructions: "",
  dropOffOption: "leave-at-door",
  entryBuzzerCode: "",
  scheduledTime: null,
  ecoPackaging: false,
}

export const useFulfillmentStore = create<FulfillmentState>()(
  persist(
    (set) => ({
      fulfillment: defaultFulfillment,
      setMode: (mode) =>
        set((state) => ({
          fulfillment: { ...state.fulfillment, mode },
        })),
      setAddress: (address) =>
        set((state) => ({
          fulfillment: { ...state.fulfillment, address },
        })),
      setPickupStore: (storeId) =>
        set((state) => ({
          fulfillment: { ...state.fulfillment, pickupStoreId: storeId },
        })),
      setDropOffOption: (option) =>
        set((state) => ({
          fulfillment: { ...state.fulfillment, dropOffOption: option },
        })),
      setDropOffInstructions: (instructions) =>
        set((state) => ({
          fulfillment: { ...state.fulfillment, dropOffInstructions: instructions },
        })),
      setEntryBuzzerCode: (code) =>
        set((state) => ({
          fulfillment: { ...state.fulfillment, entryBuzzerCode: code },
        })),
      setScheduledTime: (time) =>
        set((state) => ({
          fulfillment: { ...state.fulfillment, scheduledTime: time },
        })),
      toggleEcoPackaging: () =>
        set((state) => ({
          fulfillment: { ...state.fulfillment, ecoPackaging: !state.fulfillment.ecoPackaging },
        })),
      resetFulfillment: () => set({ fulfillment: defaultFulfillment }),
    }),
    {
      name: "oredflow-fulfillment",
    }
  )
)