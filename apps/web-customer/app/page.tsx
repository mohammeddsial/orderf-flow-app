import { HeroVideo } from "@/components/home/hero-video"
import { AnnouncementStrip } from "@/components/home/announcement-strip"
import { LoyaltyCard } from "@/components/home/loyalty-card"
import { OrderAgainRail } from "@/components/home/order-again-rail"
import { RecommendedGrid } from "@/components/home/recommended-grid"
import { DealsGrid } from "@/components/home/deals-grid"
import { CategoryTiles } from "@/components/home/category-tiles"
import { FeaturedItems } from "@/components/home/featured-items"
import { PopularRail } from "@/components/home/popular-rail"
import { FoodMosaic } from "@/components/home/food-mosaic"
import { FinishOrderBanner } from "@/components/home/finish-order-banner"
import { LimitedTimeDeal } from "@/components/home/limited-time-deal"
import { BirthdayBanner } from "@/components/home/birthday-banner"
import { OffersCarousel } from "@/components/home/offers-carousel"
import { OffersFeed } from "@/components/home/offers-feed"
import { StoriesGrid } from "@/components/home/stories-grid"

export default function HomePage() {
  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* CORE 2: Video Reel Hero */}
      <HeroVideo />

      {/* OPTIONAL 12: Announcement Strip */}
      <AnnouncementStrip />

      {/* CORE 3: Loyalty Card Widget */}
      <LoyaltyCard />

      {/* CORE 4: Order Again Rail */}
      <OrderAgainRail />

      {/* CORE 5: Recommended for You */}
      <RecommendedGrid />

      {/* CORE 6: Deals / Promos */}
      <DealsGrid />

      {/* CORE 7: Category Tiles */}
      <CategoryTiles />

      {/* CORE 9: Featured Items */}
      <FeaturedItems />

      {/* OPTIONAL 15: Limited-Time Deal + Countdown Timer */}
      <LimitedTimeDeal />

      {/* CORE 10: Popular Rail */}
      <PopularRail />

      {/* OPTIONAL 16: Birthday Reward Banner */}
      <BirthdayBanner />

      {/* OPTIONAL 13: Food Culture Image Mosaic */}
      <FoodMosaic />

      {/* OPTIONAL 14: Finish Your Order Banner */}
      <FinishOrderBanner />

      {/* OPTIONAL 17: Offers Carousel */}
      <OffersCarousel />

      {/* OPTIONAL 18: Offers Feed */}
      <OffersFeed />

      {/* OPTIONAL 19: Stories Grid */}
      <StoriesGrid />
    </div>
  )
}