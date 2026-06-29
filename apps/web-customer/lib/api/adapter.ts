import type {
  ApiMenuItem,
  ApiModifierGroup,
  ApiModifierOption,
  ApiOrder,
  ApiRestaurant,
} from "./client"
import type {
  Category,
  Deal,
  Order,
  OrderStatus,
  Product,
  Reward,
} from "@/types"
import { getProductImages } from "@/lib/images"

// ---- Restaurant → design tokens -------------------------------------------

export type RestaurantConfig = {
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
}

export function adaptRestaurant(r: ApiRestaurant): RestaurantConfig {
  return {
    id: r.id,
    name: r.name,
    logoUrl: r.logoUrl,
    activeUiStyle: r.activeUiStyle,
    primaryColor: r.primaryColor,
    secondaryColor: r.secondaryColor,
    backgroundColor: r.backgroundColor,
    accentColor: r.accentColor,
    surfaceColor: r.surfaceColor,
    accentLightColor: r.accentLightColor,
    borderRadiusType: r.borderRadiusType,
  }
}

// ---- Menu items → Products -------------------------------------------------

const CATEGORY_MAP: Record<string, { id: string; slug: string; icon: string }> = {
  Burgers: { id: "cat-burgers", slug: "burgers", icon: "Sandwich" },
  Sides: { id: "cat-sides", slug: "sides", icon: "Fries" },
  Drinks: { id: "cat-drinks", slug: "drinks", icon: "CupSoda" },
  Desserts: { id: "cat-desserts", slug: "desserts", icon: "IceCream" },
  Combos: { id: "cat-combos", slug: "combos", icon: "UtensilsCrossed" },
  Breakfast: { id: "cat-breakfast", slug: "breakfast", icon: "Coffee" },
}

export function adaptProduct(item: ApiMenuItem): Product {
  const imgData = getProductImages(item.id)
  const productImages = [imgData.main, ...imgData.gallery]
  const cat = CATEGORY_MAP[item.category] || {
    id: `cat-${item.category.toLowerCase()}`,
    slug: item.category.toLowerCase(),
    icon: "Utensils",
  }

  return {
    id: item.id,
    name: item.title,
    slug: item.id,
    description: item.description,
    longDescription: item.description,
    basePrice: item.basePrice,
    calories: item.calories,
    kilojoules: Math.round(item.calories * 4.184),
    image: productImages[0] || item.imageUrl,
    images: productImages.length > 0 ? productImages : [item.imageUrl],
    categoryId: cat.id,
    dietaryTags: [],
    allergens: [],
    rating: 4.5,
    reviewCount: 0,
    isNew: false,
    isChefRecommended: item.basePrice > 12,
    isPopular: false,
    daypart: "all-day",
    modifiers: (item.modifiers || []).map(adaptModifierGroup),
    portionSizes: [],
    mealDealUpgrade: null,
    frequentlyPairedWith: [],
    nutritionFacts: {
      servingSize: "1 serving",
      protein: "-",
      carbs: "-",
      fat: "-",
      saturatedFat: "-",
      transFat: "0g",
      cholesterol: "-",
      sodium: "-",
      fiber: "-",
      sugar: "-",
      vitaminA: "-",
      vitaminC: "-",
      calcium: "-",
      iron: "-",
    },
  }
}

function adaptModifierGroup(g: ApiModifierGroup): Product["modifiers"][number] {
  return {
    id: g.id,
    name: g.name,
    required: g.maxSelection === 1,
    minSelections: 0,
    maxSelections: g.maxSelection,
    type: g.maxSelection === 1 ? "radio" : "checkbox",
    options: g.options.map(adaptModifierOption),
  }
}

function adaptModifierOption(o: ApiModifierOption): Product["modifiers"][number]["options"][number] {
  return {
    id: o.id,
    name: o.name,
    priceAdjustment: o.price,
    caloriesAdjustment: 0,
    default: false,
  }
}

// ---- Menu items → Categories (derived) ------------------------------------

export function deriveCategories(items: ApiMenuItem[]): Category[] {
  const seen = new Map<string, Category>()
  for (const item of items) {
    const cat = CATEGORY_MAP[item.category]
    if (!cat || seen.has(cat.id)) continue
    seen.set(cat.id, {
      id: cat.id,
      name: item.category,
      slug: cat.slug,
      description: `${item.category} menu items`,
      icon: cat.icon,
    })
  }
  return Array.from(seen.values())
}

// ---- Orders ---------------------------------------------------------------

const STATUS_MAP: Record<string, OrderStatus> = {
  PREPARING: "preparing",
  COOKING: "cooking",
  READY: "ready",
  OUT_FOR_DELIVERY: "out-for-delivery",
  DELIVERED: "delivered",
  PICKED_UP: "picked-up",
}

export function adaptOrder(o: ApiOrder): Partial<Order> {
  return {
    id: o.id,
    status: STATUS_MAP[o.status] || "preparing",
    total: o.total,
    estimatedDelivery: o.eta,
    placedAt: new Date().toISOString(),
    driver: {
      id: o.id,
      name: o.driver,
      photo: "",
      vehicle: "",
      rating: o.rating,
      lat: 0,
      lng: 0,
    },
  }
}

// ---- Fallback helpers (return mock when API lacks data) --------------------

export function withFallback<T>(apiData: T | null | undefined, mockData: T): T {
  if (apiData == null || (Array.isArray(apiData) && apiData.length === 0)) {
    return mockData
  }
  return apiData
}
