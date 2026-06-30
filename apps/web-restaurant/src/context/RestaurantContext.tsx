import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { RestaurantTenant } from '@multi-restaurant/database';
import { api } from '../lib/api';

interface RestaurantCtx {
  restaurants: RestaurantTenant[];
  currentId: string | null;
  current: RestaurantTenant | null;
  refresh: () => Promise<void>;
}

const Ctx = createContext<RestaurantCtx | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<RestaurantTenant[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const list = await api.getRestaurants();
      setRestaurants(list);
      // Restaurant admin is tied to ONE restaurant — pick the first (or from localStorage)
      const stored = localStorage.getItem('currentRestaurantId');
      const id = stored && list.some((r) => r.id === stored) ? stored : list[0]?.id ?? null;
      setCurrentId(id);
    } catch {
      /* backend offline */
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!currentId) return;
    localStorage.setItem('currentRestaurantId', currentId);
    api.setActiveRestaurant(currentId).catch(() => {});
  }, [currentId]);

  const current = restaurants.find((r) => r.id === currentId) ?? null;

  return (
    <Ctx.Provider value={{ restaurants, currentId, current, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useRestaurant(): RestaurantCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider');
  return ctx;
}
