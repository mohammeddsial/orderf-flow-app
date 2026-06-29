"use client"

import { useQuery } from "@tanstack/react-query"
import { apiFetch, type ApiMenuItem, type ApiOrder, type ApiPageLayouts, type ApiRestaurant } from "./client"
import { adaptProduct, adaptRestaurant, deriveCategories, type RestaurantConfig } from "./adapter"
import type { Category, Deal, Product, Reward } from "@/types"
import {
  activeDeals,
  limitedTimeOffer,
  rewards,
  stores,
  mockUser,
  activeOrder,
  recentOrders,
} from "@/lib/mock"

// ---- Query keys -----------------------------------------------------------

export const queryKeys = {
  activeRestaurant: ["active-restaurant"] as const,
  restaurant: (id: string) => ["restaurant", id] as const,
  menuItems: (restaurantId: string) => ["menu-items", restaurantId] as const,
  pageLayouts: (restaurantId: string) => ["page-layouts", restaurantId] as const,
  orders: (restaurantId: string) => ["orders", restaurantId] as const,
}

// ---- Active restaurant ----------------------------------------------------

export function useActiveRestaurant() {
  return useQuery({
    queryKey: queryKeys.activeRestaurant,
    queryFn: () => apiFetch<{ restaurantId: string }>("/active_restaurant"),
  })
}

// ---- Restaurant config ----------------------------------------------------

export function useRestaurant(restaurantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.restaurant(restaurantId || ""),
    queryFn: () => apiFetch<ApiRestaurant>(`/restaurants/${restaurantId}`),
    enabled: !!restaurantId,
    select: adaptRestaurant,
  })
}

export function useRestaurantConfig(): {
  config: RestaurantConfig | undefined
  restaurantId: string | undefined
  isLoading: boolean
} {
  const { data: activeData, isLoading: loadingActive } = useActiveRestaurant()
  const restaurantId = activeData?.restaurantId
  const { data: config, isLoading: loadingRestaurant } = useRestaurant(restaurantId)
  return {
    config,
    restaurantId,
    isLoading: loadingActive || loadingRestaurant,
  }
}

// ---- Menu items → Products ------------------------------------------------

export function useProducts(restaurantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.menuItems(restaurantId || ""),
    queryFn: () => apiFetch<ApiMenuItem[]>(`/restaurants/${restaurantId}/menu_items`),
    enabled: !!restaurantId,
    select: (items) => items.map(adaptProduct),
  })
}

export function useProduct(productId: string | undefined) {
  const { restaurantId } = useRestaurantConfig()
  const { data: products } = useProducts(restaurantId)
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => {
      if (!productId) return null
      return products?.find((p) => p.id === productId) || null
    },
    enabled: !!productId && !!products,
  })
}

// ---- Categories (derived from menu items) ---------------------------------

export function useCategories(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["categories", restaurantId || ""],
    queryFn: async () => {
      if (!restaurantId) return [] as Category[]
      const items = await apiFetch<ApiMenuItem[]>(`/restaurants/${restaurantId}/menu_items`)
      const derived = deriveCategories(items)
      // Fallback to mock categories if API has none
      return derived.length > 0 ? derived : (await import("@/lib/mock")).categories
    },
    enabled: !!restaurantId,
  })
}

// ---- Deals (mock fallback — API has no deals endpoint yet) ----------------

export function useDeals(): Deal[] {
  return activeDeals
}

export function useLimitedTimeOffer() {
  return limitedTimeOffer
}

// ---- Rewards (mock fallback — API has no rewards endpoint yet) -------------

export function useRewards(): Reward[] {
  return rewards
}

// ---- Stores (mock fallback — API has no stores endpoint yet) ---------------

export function useStores() {
  return stores
}

// ---- User (mock fallback — API has no user endpoint yet) ------------------

export function useUser() {
  return mockUser
}

// ---- Orders ---------------------------------------------------------------

export function useOrders(restaurantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders(restaurantId || ""),
    queryFn: () => apiFetch<ApiOrder[]>(restaurantId ? `/orders?restaurantId=${restaurantId}` : "/orders"),
    enabled: !!restaurantId,
  })
}

// ---- Page layouts ---------------------------------------------------------

export function usePageLayouts(restaurantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.pageLayouts(restaurantId || ""),
    queryFn: () => apiFetch<ApiPageLayouts>(`/restaurants/${restaurantId}/pages`),
    enabled: !!restaurantId,
  })
}

// ---- Product selectors (mirror mock helper signatures) --------------------

export function useProductById(productId: string | undefined): Product | null {
  const { restaurantId } = useRestaurantConfig()
  const { data: products } = useProducts(restaurantId)
  if (!productId || !products) return null
  return products.find((p) => p.id === productId) || null
}

export function useProductsByCategory(categoryId: string | undefined): Product[] {
  const { restaurantId } = useRestaurantConfig()
  const { data: products } = useProducts(restaurantId)
  if (!categoryId || !products) return []
  return products.filter((p) => p.categoryId === categoryId)
}

export function usePopularProducts(): Product[] {
  const { restaurantId } = useRestaurantConfig()
  const { data: products } = useProducts(restaurantId)
  if (!products) return []
  return products.filter((p) => p.isPopular || p.rating >= 4.5).slice(0, 10)
}

export function useChefRecommendedProducts(): Product[] {
  const { restaurantId } = useRestaurantConfig()
  const { data: products } = useProducts(restaurantId)
  if (!products) return []
  return products.filter((p) => p.isChefRecommended).slice(0, 10)
}

export function useNewProducts(): Product[] {
  const { restaurantId } = useRestaurantConfig()
  const { data: products } = useProducts(restaurantId)
  if (!products) return []
  return products.filter((p) => p.isNew).slice(0, 10)
}

export function useActiveOrder() {
  return activeOrder
}

export function useRecentOrders() {
  return recentOrders
}
