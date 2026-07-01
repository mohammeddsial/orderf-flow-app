import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { RestaurantTenant } from '@multi-restaurant/database';
import { api } from '../lib/api';

interface RestaurantCtx {
  restaurants: RestaurantTenant[];
  currentId: string | null;
  current: RestaurantTenant | null;
  setCurrentId: (id: string) => void;
  refresh: () => Promise<void>;
  addRestaurant: (name: string) => Promise<void>;
}

const Ctx = createContext<RestaurantCtx | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<RestaurantTenant[]>([]);
  const [currentId, setCurrentIdState] = useState<string | null>(() =>
    localStorage.getItem('currentRestaurantId')
  );

  const refresh = async () => {
    try {
      const list = await api.getRestaurants();
      setRestaurants(list);
      setCurrentIdState((prev) => (prev && list.some((r) => r.id === prev) ? prev : list[0]?.id ?? null));
    } catch {
      /* backend offline */
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // Persist the selection and mark it active on the backend so the mobile app
  // shows it on its next launch (admin -> mobile preview link). Runs on initial
  // load too, so the active restaurant always matches what the admin shows.
  useEffect(() => {
    if (!currentId) return;
    localStorage.setItem('currentRestaurantId', currentId);
    api.setActiveRestaurant(currentId).catch(() => {});
  }, [currentId]);

  const setCurrentId = (id: string) => setCurrentIdState(id);

  const addRestaurant = async (name: string) => {
    const created = await api.createRestaurant({ name });
    await refresh();
    setCurrentId(created.id);
  };

  const current = restaurants.find((r) => r.id === currentId) ?? null;

  return (
    <Ctx.Provider value={{ restaurants, currentId, current, setCurrentId, refresh, addRestaurant }}>
      {children}
    </Ctx.Provider>
  );
}

export function useRestaurant(): RestaurantCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider');
  return ctx;
}
