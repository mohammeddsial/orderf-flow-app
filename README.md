# Order Flow

A multi‑restaurant food‑delivery platform: a **React Native (Expo)** customer app, a **Next.js** customer web app, a **Vite + React** admin panel, and a small **Express** mock API — wired together so the admin configures what each restaurant's mobile app looks like in real time.

---

## Monorepo layout

```
app/
├── apps/
│   ├── mobile/          # React Native (Expo SDK 54) customer app
│   ├── web-customer/    # Next.js 16 customer-facing web app
│   ├── admin/           # Vite + React + Tailwind admin panel (all roles)
│   └── api/             # Express mock backend (persists to db.json)
├── packages/
│   └── database/        # shared client-side store (ActiveRecord-style)
├── App.tsx              # Expo entry shim (re-exports apps/mobile/src/App)
└── package.json         # npm workspaces + Turborepo scripts
```

---

## Design engines

Three theme engines drive structure (radius, shadows, typography, spacing); the restaurant's brand colors drive the palette:

| Engine | Character |
|---|---|
| **BRUTALIST_MODERNIST** | Raw, bold, high‑contrast — zero‑radius, black primary, orange accent |
| **MINIMALIST_CLEAN** | Soft rounded corners (4–24px), subtle gray shadows, dark gray primary |
| **VIBRANT_STREET_TECH** | Neon glow, pill radii, cyan/magenta accents on dark backgrounds |

Each engine defines 5 token groups: **colors** (24 tokens), **spacing** (8 tokens), **typography** (5 sizes + weights + families), **borders** (7 radii + 4 widths), and **shadows** (6 levels). Tokens live in `apps/mobile/src/theme/engines.ts` and `apps/admin/src/lib/engineTokens.ts`.

---

## App 1 — Mobile (`@multi-restaurant/mobile`)

React Native (Expo SDK 54) app with Gluestack UI v4 + React Navigation.

### Screens (15)

| Screen | Description |
|---|---|
| **HomePage** | Configurable section‑based home: hero, loyalty, cart recovery, flash deals, recommendations, categories, featured, stories, popular, announcements, image mosaic, meal deals, birthdays |
| **MenuPage** | Full menu browser — search, dietary filters, category tabs, product grid, in‑page item customizer |
| **ProductDetailPage** | Full product detail — hero image, quantity, modifier groups, meal‑deal toggle, portion picker, special instructions |
| **CartPage** | Cart review — per‑item quantity, fulfillment toggle, coupon code, subtotal/tax/discount summary |
| **UpsellPage** | Post‑cart upsell interstitial — 4 recommended add‑ons with "Skip" link |
| **DeliveryConfigPage** | Delivery/pickup config — address, drop‑off instructions, buzzer code, time‑window selection |
| **CheckoutPage** | Secure checkout — payment method, tip selection, order summary, place order |
| **OrderSuccessPage** | Order confirmation — ETA countdown, status tracker, live map placeholder, "Track Order" CTA |
| **OrderTrackingPage** | Live order tracking — status timeline, driver info, ETA, order summary |
| **RewardsPage** | Loyalty — tier badge, points balance + progress bar, redeemable offers |
| **ReviewPage** | Post‑order review — star ratings (food + delivery), attribute tags, comments, photo upload |
| **ProfilePage** | User profile — avatar, name, email, role display, demo role switcher |
| **PromotionsPage** | Deals & offers — active promotions list, coupon codes |
| **SearchPage** | Global search with filters — search menu items across categories |
| **AddressPage** | Saved addresses — list with labels, default address indicator |

### Navigation

- **RootStack**: wraps the tab navigator + modal `CheckoutFlow` (Cart → Upsell → Delivery → Checkout → OrderSuccess)
- **BottomTabs** (6 tabs): Home, Menu, Cart (opens checkout modal), Rewards, Promotions, Profile
- **CustomTabBar**: floating bar with rounded top corners, animated active tab, central elevated Rewards star button

### Components

**Layout primitives**: `ScreenLayout`, `SolidHeader`, `OverlayHeader`, `DismissalHeader`, `Card`, `Button`, `Heading`, `BodyText`, `HeroImage`

**Side drawer**: animated slide‑in panel with restaurant logo, fulfillment toggle, location, and menu items

**Home section components** (11): `HomeHeader`, `LoyaltyCard`, `OrderAgainRail`, `QuickAddButton`, `Recommendations`, `CategoryTiles`, `FeaturedTier`, `StoriesRail`, `PopularRail`, `Gutter`, `SectionHeader`

**Adaptive components** (4): `FlashCountdown`, `CartRecovery`, `ActiveTracker`, `DemoControls`

**Home widgets** (5): `HeroSection`, `MealDealCombo`, `AnnouncementStrip`, `ImageMosaic`, `BirthdayBanner`, `OfferBanner`

**Product cards** (8 variants): `ListRowCard`, `OverlayPriceCard`, `QtyRowCard`, `PlainGridCard`, `FeatureCard`, `RestaurantCard`, `VideoCard`, `SlidesCard`

### Theme system

`ThemeProvider` wraps the app — merges engine tokens with per‑tenant brand colors (primary, secondary, accent, background, surface). Supports live engine override for preview. Exposed via `useTheme()` hook.

---

## App 2 — Customer Web (`@multi-restaurant/customer-web`)

Next.js 16 (App Router) with React 19, Tailwind CSS v4, and shadcn/ui (radix-nova style).

### Routes (11)

| Route | Description |
|---|---|
| `/` | Home — 17 modular sections (hero, announcements, loyalty, order‑again, recommends, deals, categories, featured, LTO, popular, birthday, mosaic, cart recovery, offers) |
| `/menu` | Menu browser — search, dietary filters, category nav, product grid, cross‑sell, allergen matrix, customizer drawer |
| `/menu/[item_id]` | Product detail (server component) — gallery, modifiers, portion toggle, meal deal, nutrition, paired rail |
| `/cart` | Cart — items, quantity, coupon code, tier progress, free delivery threshold |
| `/checkout/fulfillment` | Fulfillment config — delivery/pickup, address, store selection, scheduling, eco‑packaging |
| `/checkout` | Payment — method selector, card form, tip presets, carbon offset, order summary, place order |
| `/checkout/upsell` | Post‑cart upsell — 6 add‑ons with 5‑minute countdown timer |
| `/order/success/[order_id]` | Order tracking — status steps, driver info, ETA countdown, order summary drawer |
| `/order/review/[order_id]` | Post‑delivery review — taste + delivery ratings, chips, feedback, media upload |
| `/rewards` | Loyalty — tier display, points, rewards catalog, deals tab, QR scan‑in |
| `/not-found` | Custom 404 |

### State management

**Zustand stores** (5):
- `useCartStore` — persisted to localStorage, handles add/remove/quantity/modifiers/portion, computes totals (tax 8.75%, delivery $3.99, service fee 5%)
- `useUserStore` — persisted, user profile, addresses, dietary preferences, loyalty
- `useFulfillmentStore` — persisted, delivery/pickup config
- `useOrderStore` — in‑memory, active order tracking
- `useUIStore` — in‑memory, cart drawer toggle

**React Query** — 20 hooks for API data fetching (restaurant config, products, categories, orders, page layouts), 60s stale time. Falls back to mock data when API is unavailable.

### Components (60+)

Layout: `GlobalHeader`, `ActiveOrderTracker`, `Footer`, `MiniCart`

17 home sections, 10 menu components, 10 product‑detail components, 5 shared components, 24 shadcn/ui primitives

### Libraries

`framer-motion`, `gsap`, `embla-carousel-react`, `leaflet` + `react-leaflet`, `react-hook-form` + `zod`, `next-themes`

---

## App 3 — Admin Panel (`@multi-restaurant/admin`)

Vite + React + Tailwind CSS v4 + shadcn/ui (New York v4).

### Pages (11 routes)

| Route | Page | Role | Description |
|---|---|---|---|
| `/` | Dashboard | all | 4 stat cards, popular items grid, live order tracker |
| `/orders` | Orders | all | Order list with status badges |
| `/menu` | MenuManager | all | Full CRUD for menu items — data table, add/edit dialog, CSV import/export |
| `/home-layout` | HomeLayout | all | Section/page layout editor — 10 page keys, toggle/reorder sections, card variant per section, live iframe preview |
| `/analytics` | Analytics | all | Revenue, orders, avg order, repeat customers, sales trend charts |
| `/reports` | Reports | all | Downloadable daily/weekly/monthly/tax reports |
| `/customers` | Customers | all | Customer table with orders, spend, loyalty tier |
| `/promotions` | Promotions | all | Deal list with CRUD dialog, flash deal toggle |
| `/settings` | RestaurantSettings | all | Brand identity + style engine — logo upload, name/tagline/cuisine tags, engine selector, 6‑color palette picker |
| `/super-admin` | Tenant Admin Console | super_admin | Multi‑tenant governance — global stats, tenant management table, style engine governance |
| `*` | 404 → `/` | — | Catch‑all redirect |

### Components

- **Layout**: Dark navy sidebar (`#16233C`/`#1E2D4A`) with nav items, restaurant switcher dropdown, search, notifications, user avatar
- **Admin UI primitives**: `PageHero`, `SectionCard`, `StatCard`, `FieldLabel`
- **Dialogs**: `CreateRestaurantDialog`, `PublishDialog` (confirm → saving → success/error), `ResultDialog`
- **36 shadcn/ui primitives** (accordion through tooltip)

### Context providers

- `ThemeContext` — static Figma theme object (primary, secondary, accent, background, logo)
- `RestaurantContext` — multi‑tenant state: restaurant list, current selection (persisted to localStorage + synced to API for mobile preview)

### API

All calls target `http://localhost:4000/api/v1`. Gracefully degrades on backend failure. Endpoints: restaurants CRUD, menu items CRUD + import, orders list, pages CRUD, active restaurant sync.

---

## API Layer (`apps/api`)

Express server on port 4000. Persists state to `db.json`. Acts as a transitional stand‑in for a future Rails API.

### Seed data

- **2 restaurants**: BurgerBliss (BRUTALIST_MODERNIST) + Green Garden (MINIMALIST_CLEAN)
- **14 menu items** across both restaurants
- **Page layouts** (home + menu) per restaurant
- **2 sample orders**

### Endpoints (all under `/api/v1`)

| Resource | Methods |
|---|---|
| Restaurants | GET list, POST create, GET/PUT/PATCH/DELETE by ID |
| Menu Items | GET by restaurant, POST create, POST import, PUT/PATCH/DELETE by ID |
| Orders | GET list (optional `?restaurantId=` filter) |
| Pages | GET by restaurant, PUT by restaurant + page |
| Active Restaurant | GET/PUT for admin‑to‑mobile preview syncing |

### Routes rewrite (`routes.json`)

Maps `/api/v1/restaurants/:id/menu_items` → `/menu_items?restaurantId=:id` and strips the `/api/v1` prefix for flat‑file compatibility.

---

## Shared Package (`@multi-restaurant/database`)

Client‑side ActiveRecord‑style singleton store — designed for future swap to Rails API.

### Files

| File | Purpose |
|---|---|
| `types.ts` | Domain types: `RestaurantTenant`, `MenuItem`, `Cart`, `Order`, `User`, `LoyaltyProfile`, `OrderReview`, `StoreState`, etc. |
| `store.ts` | Singleton `store` with CRUD: items, cart, orders, tenant, reviews, notifications, users |
| `hooks.ts` | React hooks: `useTenant`, `useMenuItems`, `useCart`, `useCreateOrder`, `useSubmitReview`, etc. |
| `themeService.ts` | Client‑side CSS generation from tokens |
| `imageUtils.ts` | Placeholder image URL generators |

### Seed data

1 tenant (BurgerBliss, BRUTALIST_MODERNIST), 8 menu items, 1 user (Alex Johnson, SILVER tier, 250 pts)

---

## Getting started

```bash
npm install

# Start everything
npm run start:all
```

Or run pieces individually:

```bash
npm run mock-api                        # Express API → http://localhost:4000
npm run dev:admin                       # Admin panel (Vite)
npm run dev --workspace=@multi-restaurant/customer-web   # Customer web (Next.js)
cd apps/mobile && npx expo start        # Mobile (scan QR in Expo Go)
```

### Connecting a phone to the API

In `apps/mobile/src/api/client.ts` set `MACHINE_IP` to your computer's LAN IP. Phone and computer must be on the same Wi‑Fi.

---

## Tech stack

| Layer | Technologies |
|---|---|
| Mobile | React Native, Expo SDK 54, expo‑video, Gluestack UI v4, React Navigation |
| Customer Web | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui (radix-nova), Zustand, React Query, Framer Motion, GSAP, Leaflet |
| Admin | Vite, React, Tailwind CSS v4, shadcn/ui (New York v4) |
| API | Express, CORS, file‑based persistence |
| Shared | TypeScript, custom ActiveRecord store |
| Build | Turborepo, npm workspaces |

---

## Current state (June 2026)

| Aspect | Status |
|---|---|
| **Mobile app** | Complete — all 15 screens built, 6‑tab navigation, 3‑engine theme system, cart persistence, API bootstrap, Jest test infra |
| **Customer web** | Complete — 11 routes, 60+ components, Zustand stores, React Query API hooks with mock fallbacks, dark mode |
| **Admin panel** | Complete — 10 unified routes for all roles (super_admin + restaurant_admin), role‑aware sidebar, multi‑tenant switching, full CRUD, publish workflow |
| **API** | Complete — 18 endpoints, 2 seed restaurants, file‑based persistence |
| **Shared store** | Complete — ActiveRecord‑style singleton, domain types, React hooks, CSS theme generator |
| **Multi‑tenant wiring** | Working — admin selects restaurant → persisted to localStorage + API → mobile reads active restaurant on bootstrap |
| **Design engines** | All 3 engines defined with full token sets on both mobile + admin |
| **Live preview** | Admin HomeLayout page renders iframes of mobile (port 8081) and web (port 3000) |
| **Backend** | Mock Express — ready to swap for Rails API (all types + endpoints are documented) |
