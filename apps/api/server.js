// Dummy REST backend for Order Flow.
// Rails-style resource routes under /api/v1 so this can be swapped for a real
// Rails API later by pointing the apps at the new base URL.
// State is persisted to db.json so edits survive server restarts.
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  restaurants as seedRestaurants,
  menuItems as seedItems,
  orders as seedOrders,
  defaultPages as seedPages,
} from './data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(__dirname, 'db.json');

const clonePages = () => JSON.parse(JSON.stringify(seedPages));

function seedState() {
  const restaurants = seedRestaurants.map((r) => ({ ...r }));
  const pageLayouts = {};
  for (const r of restaurants) pageLayouts[r.id] = clonePages();
  return {
    restaurants,
    menuItems: seedItems.map((i) => ({ ...i })),
    orders: seedOrders.map((o) => ({ ...o })),
    pageLayouts,
    activeRestaurantId: restaurants[0]?.id ?? null,
  };
}

function loadState() {
  try {
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    const seed = seedState();
    return {
      restaurants: Array.isArray(db.restaurants) ? db.restaurants : seed.restaurants,
      menuItems: Array.isArray(db.menuItems) ? db.menuItems : seed.menuItems,
      orders: Array.isArray(db.orders) ? db.orders : seed.orders,
      pageLayouts: db.pageLayouts && typeof db.pageLayouts === 'object' ? db.pageLayouts : seed.pageLayouts,
      activeRestaurantId: typeof db.activeRestaurantId === 'string' ? db.activeRestaurantId : seed.activeRestaurantId,
    };
  } catch {
    return seedState();
  }
}

let { restaurants, menuItems, orders, pageLayouts, activeRestaurantId } = loadState();

function persist() {
  try {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ restaurants, menuItems, orders, pageLayouts, activeRestaurantId }, null, 2)
    );
  } catch (e) {
    console.error('Failed to persist db.json:', e.message);
  }
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' })); // base64 logos can be large

const now = () => new Date().toISOString();
const rid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const cleanSections = (arr) =>
  (Array.isArray(arr) ? arr : []).map((s) => ({
    key: String(s.key),
    label: String(s.label ?? s.key),
    enabled: Boolean(s.enabled),
  }));

const api = express.Router();

// ---- Restaurants ---------------------------------------------------------
api.get('/restaurants', (_req, res) => res.json(restaurants));

api.post('/restaurants', (req, res) => {
  const created = {
    id: rid('tenant'),
    name: req.body?.name ?? 'New Restaurant',
    logoUrl: '',
    activeUiStyle: 'MINIMALIST_CLEAN',
    primaryColor: '#FF6B35',
    secondaryColor: '#1E2D4A',
    backgroundColor: '#FFFFFF',
    accentColor: '#E84545',
    surfaceColor: '#E6E6E6',
    accentLightColor: '#FF9E46',
    borderRadiusType: 'ROUNDED_SM',
    createdAt: now(),
    updatedAt: now(),
    ...req.body,
  };
  restaurants.push(created);
  pageLayouts[created.id] = clonePages();
  persist();
  res.status(201).json(created);
});

api.get('/restaurants/:id', (req, res) => {
  const found = restaurants.find((r) => r.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Not found' });
  res.json(found);
});

const updateRestaurant = (req, res) => {
  const idx = restaurants.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  restaurants[idx] = { ...restaurants[idx], ...req.body, id: restaurants[idx].id, updatedAt: now() };
  persist();
  res.json(restaurants[idx]);
};
api.put('/restaurants/:id', updateRestaurant);
api.patch('/restaurants/:id', updateRestaurant);

api.delete('/restaurants/:id', (req, res) => {
  const before = restaurants.length;
  restaurants = restaurants.filter((r) => r.id !== req.params.id);
  if (restaurants.length === before) return res.status(404).json({ error: 'Not found' });
  menuItems = menuItems.filter((i) => i.restaurantId !== req.params.id);
  delete pageLayouts[req.params.id];
  if (activeRestaurantId === req.params.id) activeRestaurantId = restaurants[0]?.id ?? null;
  persist();
  res.status(204).end();
});

// ---- Menu items (scoped to a restaurant) ---------------------------------
api.get('/restaurants/:id/menu_items', (req, res) =>
  res.json(menuItems.filter((i) => i.restaurantId === req.params.id))
);

api.post('/restaurants/:id/menu_items', (req, res) => {
  const created = {
    id: rid('item'),
    modifiers: [],
    isAvailable: true,
    createdAt: now(),
    updatedAt: now(),
    ...req.body,
    restaurantId: req.params.id,
  };
  menuItems.push(created);
  persist();
  res.status(201).json(created);
});

api.post('/restaurants/:id/menu_items/import', (req, res) => {
  const incoming = Array.isArray(req.body) ? req.body : req.body?.items ?? [];
  const created = incoming.map((row) => ({
    id: rid('item'),
    modifiers: [],
    isAvailable: true,
    createdAt: now(),
    updatedAt: now(),
    ...row,
    restaurantId: req.params.id,
  }));
  menuItems.push(...created);
  persist();
  res.status(201).json(created);
});

const updateItem = (req, res) => {
  const idx = menuItems.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  menuItems[idx] = { ...menuItems[idx], ...req.body, id: menuItems[idx].id, updatedAt: now() };
  persist();
  res.json(menuItems[idx]);
};
api.put('/menu_items/:id', updateItem);
api.patch('/menu_items/:id', updateItem);

api.delete('/menu_items/:id', (req, res) => {
  const before = menuItems.length;
  menuItems = menuItems.filter((i) => i.id !== req.params.id);
  if (menuItems.length === before) return res.status(404).json({ error: 'Not found' });
  persist();
  res.status(204).end();
});

// ---- Orders --------------------------------------------------------------
api.get('/orders', (req, res) => {
  const r = req.query.restaurantId;
  res.json(r ? orders.filter((o) => o.restaurantId === r) : orders);
});

// ---- Mobile page layouts (per restaurant, per page) ----------------------
api.get('/restaurants/:id/pages', (req, res) => {
  if (!pageLayouts[req.params.id]) pageLayouts[req.params.id] = clonePages();
  res.json(pageLayouts[req.params.id]);
});

api.put('/restaurants/:id/pages/:page', (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Expected an array' });
  if (!pageLayouts[req.params.id]) pageLayouts[req.params.id] = clonePages();
  pageLayouts[req.params.id][req.params.page] = cleanSections(req.body);
  persist();
  res.json(pageLayouts[req.params.id][req.params.page]);
});

// ---- Active restaurant (admin -> mobile preview link) --------------------
api.get('/active_restaurant', (_req, res) => res.json({ restaurantId: activeRestaurantId }));

api.put('/active_restaurant', (req, res) => {
  const id = req.body?.restaurantId;
  if (!restaurants.some((r) => r.id === id)) return res.status(400).json({ error: 'Unknown restaurant' });
  activeRestaurantId = id;
  persist();
  res.json({ restaurantId: activeRestaurantId });
});

app.use('/api/v1', api);
app.get('/', (_req, res) => res.json({ ok: true, service: 'order-flow-dummy-api' }));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Dummy API running on http://localhost:${PORT}/api/v1 (persisting to db.json)`);
});
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${PORT} is already in use — another API instance is running.\n` +
        `Stop it first, or start this one on another port:  set PORT=4001 && npm start\n`
    );
    process.exit(1);
  }
  throw err;
});
