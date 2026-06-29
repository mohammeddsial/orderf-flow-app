export type DietaryTag = "Vegan" | "Vegetarian" | "Gluten-Free" | "Halal" | "Nut-Free" | "Dairy-Free"

export type Allergen = "Gluten" | "Dairy" | "Eggs" | "Nuts" | "Soy" | "Shellfish" | "Fish" | "Sesame" | "Sulphites"

export type Category = {
  id: string
  name: string
  slug: string
  description: string
  icon: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  basePrice: number
  calories: number
  kilojoules: number
  image: string
  images: string[]
  categoryId: string
  dietaryTags: DietaryTag[]
  allergens: Allergen[]
  rating: number
  reviewCount: number
  isNew: boolean
  isChefRecommended: boolean
  isPopular: boolean
  daypart: "breakfast" | "lunch" | "dinner" | "all-day"
  modifiers: ModifierGroup[]
  portionSizes: PortionOption[]
  mealDealUpgrade: MealDealUpgrade | null
  frequentlyPairedWith: string[]
  nutritionFacts: NutritionFacts
}

export type ModifierGroup = {
  id: string
  name: string
  required: boolean
  minSelections: number
  maxSelections: number
  type: "radio" | "checkbox"
  options: ModifierOption[]
}

export type ModifierOption = {
  id: string
  name: string
  priceAdjustment: number
  caloriesAdjustment: number
  default: boolean
}

export type PortionOption = {
  id: string
  label: string
  priceMultiplier: number
  sizeLabel: "Small" | "Regular" | "Medium" | "Large" | "X-Large"
}

export type MealDealUpgrade = {
  id: string
  name: string
  description: string
  price: number
  includes: string[]
}

export type NutritionFacts = {
  servingSize: string
  protein: string
  carbs: string
  fat: string
  saturatedFat: string
  transFat: string
  cholesterol: string
  sodium: string
  fiber: string
  sugar: string
  vitaminA: string
  vitaminC: string
  calcium: string
  iron: string
}

export type CartItem = {
  id: string
  product: Product
  quantity: number
  selectedModifiers: Record<string, string[]>
  selectedPortionSize: PortionOption | null
  mealDealUpgrade: MealDealUpgrade | null
  specialInstructions: string
}

export type FulfillmentMode = "delivery" | "pickup"

export type Fulfillment = {
  mode: FulfillmentMode
  pickupStoreId: string | null
  address: Address | null
  dropOffInstructions: string
  dropOffOption: "leave-at-door" | "meet-driver" | "hand-it-to-me"
  entryBuzzerCode: string
  scheduledTime: string | null
  ecoPackaging: boolean
}

export type Address = {
  formatted: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  lat: number
  lng: number
}

export type OrderStatus = "preparing" | "cooking" | "ready" | "out-for-delivery" | "delivered" | "picked-up"

export type Order = {
  id: string
  status: OrderStatus
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  serviceFee: number
  tax: number
  tip: number | null
  tipPercentage: number | null
  discount: number
  total: number
  fulfillment: Fulfillment
  couponCode: string | null
  rewardsApplied: number
  carbonOffset: boolean
  placedAt: string
  estimatedDelivery: string
  driver: Driver | null
  tracking: TrackingUpdate[]
}

export type Driver = {
  id: string
  name: string
  photo: string
  vehicle: string
  rating: number
  lat: number
  lng: number
}

export type TrackingUpdate = {
  timestamp: string
  status: string
  message: string
}

export type User = {
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
  savedAddresses: Address[]
  savedPayments: SavedPayment[]
  pastOrders: PastOrder[]
  dietaryPreferences: DietaryTag[]
  allergenAlerts: Allergen[]
}

export type SavedPayment = {
  id: string
  type: "visa" | "mastercard" | "amex" | "apple-pay" | "google-pay" | "interac"
  lastFour: string
  expiryDate: string
  isDefault: boolean
}

export type PastOrder = {
  orderId: string
  items: { productId: string; productName: string; quantity: number }[]
  total: number
  placedAt: string
  isFavourite: boolean
}

export type Deal = {
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

export type Reward = {
  id: string
  name: string
  description: string
  image: string
  pointsCost: number
  tier: "all" | "silver" | "gold" | "platinum"
  category: "food" | "drink" | "dessert" | "merchandise" | "delivery"
}

export type Review = {
  id: string
  orderId: string
  userId: string
  tasteRating: number
  deliveryRating: number
  tags: string[]
  feedback: string
  mediaUrls: string[]
  createdAt: string
  pointsEarned: number
}

export type Story = {
  id: string
  productId: string
  title: string
  mediaUrl: string
  mediaType: "image" | "video"
  duration: number
}