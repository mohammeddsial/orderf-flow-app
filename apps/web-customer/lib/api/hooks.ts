"use client"

import { useQuery } from "@tanstack/react-query"
import {
  apiFetch,
  type ApiDeal,
  type ApiLimitedTimeOffer,
  type ApiMenuItem,
  type ApiOrder,
  type ApiPageLayouts,
  type ApiRestaurant,
  type ApiReward,
  type ApiStore,
  type ApiUser,
} from "./client"
import {
  adaptDeal,
  adaptLimitedTimeOffer,
  adaptOrder,
  adaptProduct,
  adaptRestaurant,
  adaptReward,
  adaptStore,
  adaptUser,
  deriveCategories,
  withFallback,
  type RestaurantConfig,
} from "./adapter"
import type { Category, Deal, LimitedTimeOffer, Product, Reward, Store, User } from "@/types"
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
  deals: ["deals"] as const,
  limitedTimeOffer: ["limited-time-offer"] as const,
  rewards: ["rewards"] as const,
  stores: ["stores"] as const,
  user: ["user"] as const,
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

// ---- Deals -----------------------------------------------------------------

export function useDeals() {
  return useQuery({
    queryKey: queryKeys.deals,
    queryFn: async () => {
      const data = await apiFetch<ApiDeal[]>("/deals")
      return withFallback(data, activeDeals).map(adaptDeal)
    },
    initialData: activeDeals,
  })
}

export function useLimitedTimeOffer() {
  return useQuery({
    queryKey: queryKeys.limitedTimeOffer,
    queryFn: async () => {
      const data = await apiFetch<ApiLimitedTimeOffer>("/limited_time_offer")
      return adaptLimitedTimeOffer(withFallback(data, limitedTimeOffer))
    },
    initialData: limitedTimeOffer,
  })
}

// ---- Rewards ---------------------------------------------------------------

export function useRewards() {
  return useQuery({
    queryKey: queryKeys.rewards,
    queryFn: async () => {
      const data = await apiFetch<ApiReward[]>("/rewards")
      return withFallback(data, rewards).map(adaptReward)
    },
    initialData: rewards,
  })
}

// ---- Stores ----------------------------------------------------------------

export function useStores() {
  return useQuery({
    queryKey: queryKeys.stores,
    queryFn: async () => {
      const data = await apiFetch<ApiStore[]>("/stores")
      return withFallback(data, stores).map(adaptStore)
    },
    initialData: stores,
  })
}

// ---- User ------------------------------------------------------------------

export function useUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const data = await apiFetch<ApiUser>("/user")
      return adaptUser(withFallback(data, mockUser))
    },
    initialData: mockUser,
  })
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
  return useQuery({
    queryKey: ["active-order"],
    queryFn: async () => {
      const data = await apiFetch<ApiOrder[]>("/orders")
      const active = data.find(
        (o) => !["DELIVERED", "PICKED_UP"].includes(o.status),
      )
      return active ? adaptOrder(active) : activeOrder
    },
    initialData: activeOrder,
  })
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ["recent-orders"],
    queryFn: async () => {
      const data = await apiFetch<ApiOrder[]>("/orders")
      const delivered = data.filter((o) =>
        ["DELIVERED", "PICKED_UP"].includes(o.status),
      )
      const adapted = delivered.map(adaptOrder)
      return withFallback(adapted, recentOrders)
    },
    initialData: recentOrders,
  })
}
