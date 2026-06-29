# Order Flow

A multi‑restaurant food‑delivery platform: a **React Native (Expo)** customer app, a **Next.js** customer web app, a **Vite + React** admin panel, and a small **Express** mock API — wired together so the admin configures what each restaurant's mobile app looks like in real time.

## Monorepo layout

```
app/
├─ apps/
│  ├─ mobile/        # React Native (Expo SDK 54) customer app — entry: index.js → src/App.tsx
│  ├─ web-customer/  # Next.js 16 customer-facing web app
│  ├─ web-admin/     # Vite + React + Tailwind admin panel
│  └─ api/           # Express mock backend (persists to db.json)
├─ packages/         # shared client-side store (@multi-restaurant/database)
├─ App.tsx           # Expo entry shim (re-exports apps/mobile/src/App)
└─ package.json      # npm workspaces + scripts
```

## Design engines

Three theme engines drive structure (radius, shadows, typography, spacing); the restaurant's brand colors drive the palette:

- **BRUTALIST_MODERNIST** — raw, bold, high‑contrast
- **MINIMALIST_CLEAN** — soft radius, subtle shadows
- **VIBRANT_STREET_TECH** — rounded, neon glow

Engine tokens live in `apps/mobile/src/theme/engines.ts` and are mirrored for the admin in `apps/web-admin/src/lib/engineTokens.ts`.

## What the admin can control (per restaurant)

- **Mobile Pages** — add / remove / reorder / hide sections on the Home and Menu pages, and pick a **card design (variant)** per section.
- **Per‑section heading** — override the title shown on the app.
- **Hero section** — choose **Video** or a **3‑image slideshow**, uploaded from the admin.
- **Flash Deal** — editable color, image, title/subtitle and countdown time.
- **Restaurant Settings** — brand colors, logo, engine choice, and an editable **Style & Typography** panel exposing every Border / Shadow / Typography token (saved as per‑restaurant overrides).

## Card / section designs

Product cards: `listRow`, `overlayPrice`, `qtyRow`, `plainGrid`, `feature`, `restaurantCard`. Plus sections: hero (video/slides), recommendations, popular, featured, categories (image mosaic), restaurant browser, meal deal, **discount offer**, flash deal, image mosaic, stories, announcement, birthday, loyalty, cart recovery, order again.

## Getting started

```bash
npm install

# Start the mock API, admin, and mobile together
npm run start:all
```

Or run pieces individually:

```bash
npm run mock-api                 # Express API on http://localhost:4000
npm run dev:admin                # admin (Vite)
npm run dev:customer             # customer web (Next.js)
cd apps/mobile && npx expo start # mobile (scan the QR in Expo Go)
```

### Connecting the phone to the API

In `apps/mobile/src/api/client.ts` set `MACHINE_IP` to your computer's LAN IP (the phone loads data and uploaded media from `http://<MACHINE_IP>:4000`). Phone and computer must be on the same Wi‑Fi.

## Tech

React Native, Expo SDK 54, expo-video, React Navigation, Next.js 16, Vite, React, Tailwind, shadcn/ui, Express, npm workspaces.