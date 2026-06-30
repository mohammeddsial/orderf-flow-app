// Typed client for the dummy backend. Swap VITE_API_URL to point at a real
// (e.g. Rails) API later — the route shapes are intentionally Rails-style.
import type { MenuItem, RestaurantTenant } from '@multi-restaurant/database';

const BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:4000/api/v1';

export interface HomeSection {
  key: string;
  label: string;
  enabled: boolean;
  cardVariant?: string;
}

export interface AdminOrder {
  id: string;
  restaurantId?: string;
  customer: string;
  status: string;
  eta: string;
  driver: string;
  rating: number;
  total: number;
  items: string[];
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // Restaurants
  getRestaurants: () => req<RestaurantTenant[]>('/restaurants'),
  getRestaurant: (id: string) => req<RestaurantTenant>(`/restaurants/${id}`),
  createRestaurant: (body: Partial<RestaurantTenant>) =>
    req<RestaurantTenant>('/restaurants', { method: 'POST', body: JSON.stringify(body) }),
  updateRestaurant: (id: string, body: Partial<RestaurantTenant>) =>
    req<RestaurantTenant>(`/restaurants/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteRestaurant: (id: string) => req<void>(`/restaurants/${id}`, { method: 'DELETE' }),

  // Active restaurant (admin -> mobile preview link)
  getActiveRestaurant: () => req<{ restaurantId: string | null }>('/active_restaurant'),
  setActiveRestaurant: (restaurantId: string) =>
    req<{ restaurantId: string }>('/active_restaurant', {
      method: 'PUT',
      body: JSON.stringify({ restaurantId }),
    }),

  // Menu items (scoped to a restaurant)
  getMenuItems: (restaurantId: string) => req<MenuItem[]>(`/restaurants/${restaurantId}/menu_items`),
  createMenuItem: (restaurantId: string, body: Partial<MenuItem>) =>
    req<MenuItem>(`/restaurants/${restaurantId}/menu_items`, { method: 'POST', body: JSON.stringify(body) }),
  importMenuItems: (restaurantId: string, items: Partial<MenuItem>[]) =>
    req<MenuItem[]>(`/restaurants/${restaurantId}/menu_items/import`, { method: 'POST', body: JSON.stringify(items) }),
  updateMenuItem: (id: string, body: Partial<MenuItem>) =>
    req<MenuItem>(`/menu_items/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteMenuItem: (id: string) => req<void>(`/menu_items/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: (restaurantId?: string) =>
    req<AdminOrder[]>(restaurantId ? `/orders?restaurantId=${restaurantId}` : '/orders'),

  // Mobile page layouts (per restaurant, per page)
  getPages: (restaurantId: string) =>
    req<Record<string, HomeSection[]>>(`/restaurants/${restaurantId}/pages`),
  updatePage: (restaurantId: string, page: string, sections: HomeSection[]) =>
    req<HomeSection[]>(`/restaurants/${restaurantId}/pages/${page}`, {
      method: 'PUT',
      body: JSON.stringify(sections),
    }),

  // NEW: Update the entire pages object for a restaurant
  updateAllPages: (restaurantId: string, pages: Record<string, HomeSection[]>) =>
    req<Record<string, HomeSection[]>>(`/restaurants/${restaurantId}`, {
      method: 'PATCH',
      body: JSON.stringify({ pages }),
    }),
};