export { categories } from "./categories"
export { products, getProductById, getProductsByCategory, getPopularProducts, getChefRecommendedProducts, getNewProducts, getProductsByDaypart } from "./products"
export { mockUser } from "./user"
export { activeOrder, recentOrders } from "./orders"
export { activeDeals, limitedTimeOffer } from "./deals"
export { rewards } from "./rewards"
export { stores } from "./stores"

// API hooks (use these in client components to fetch live data; mock is fallback)
export {
  useActiveRestaurant,
  useRestaurant,
  useRestaurantConfig,
  useProducts,
  useProduct,
  useCategories,
  useDeals,
  useLimitedTimeOffer,
  useRewards,
  useStores,
  useUser,
  useOrders,
  usePageLayouts,
  useProductById,
  useProductsByCategory,
  usePopularProducts,
  useChefRecommendedProducts,
  useNewProducts,
  useActiveOrder,
  useRecentOrders,
  queryKeys,
} from "@/lib/api/hooks"