const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Thin fetch wrapper that:
 * - prefixes the API base URL
 * - throws on non-2xx responses
 * - returns parsed JSON
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText)
    throw new ApiError(response.status, text || response.statusText)
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

// ---- Raw API response types (match server.js shapes) ----------------------

export type ApiRestaurant = {
  id: string
  name: string
  logoUrl: string
  activeUiStyle: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  accentColor: string
  surfaceColor: string
  accentLightColor: string
  borderRadiusType: string
  createdAt: string
  updatedAt: string
}

export type ApiMenuItem = {
  id: string
  restaurantId: string
  title: string
  description: string
  basePrice: number
  imageUrl: string
  calories: number
  category: string
  modifiers: ApiModifierGroup[]
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export type ApiModifierGroup = {
  id: string
  name: string
  maxSelection: number
  options: ApiModifierOption[]
}

export type ApiModifierOption = {
  id: string
  name: string
  price: number
}

export type ApiOrder = {
  id: string
  restaurantId: string
  customer: string
  status: string
  eta: string
  driver: string
  rating: number
  total: number
  items: string[]
}

export type ApiPageSection = {
  key: string
  label: string
  enabled: boolean
  cardVariant?: string
}

export type ApiActiveRestaurant = {
  restaurantId: string
}

export type ApiPageLayouts = Record<string, ApiPageSection[]>

// ---- Deals / Rewards / Stores / User (match server.js shapes) -------------

export type ApiDeal = {
  id: string
  title: string
  description: string
  image: string
  discountType: "percentage" | "fixed"
  discountValue: number
  code: string
  minOrder: number
  expiryDate: string
  isLimited: boolean
  remainingCount: number | null
  applicableProducts: string[]
}

export type ApiLimitedTimeOffer = {
  id: string
  title: string
  description: string
  image: string
  originalPrice: number
  discountedPrice: number
  expiryDate: string
}

export type ApiReward = {
  id: string
  name: string
  description: string
  image: string
  pointsCost: number
  tier: "all" | "silver" | "gold" | "platinum"
  category: "food" | "drink" | "dessert" | "merchandise" | "delivery"
}

export type ApiStore = {
  id: string
  name: string
  address: string
  distance: number
  isOpen: boolean
  hours: string
  kitchenOpenUntil: string
  acceptingOrders: boolean
}

export type ApiUser = {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  points: number
  tier: "bronze" | "silver" | "gold" | "platinum"
  tierPointsNeeded: number
  tierPointsCurrent: number
  birthday: string
  savedAddresses: {
    formatted: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    lat: number
    lng: number
  }[]
  savedPayments: {
    id: string
    type: "visa" | "mastercard" | "amex" | "apple-pay" | "google-pay" | "interac"
    lastFour: string
    expiryDate: string
    isDefault: boolean
  }[]
  pastOrders: {
    orderId: string
    items: { productId: string; productName: string; quantity: number }[]
    total: number
    placedAt: string
    isFavourite: boolean
  }[]
  dietaryPreferences: string[]
  allergenAlerts: string[]
}
