import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '@multi-restaurant/database';

const STORAGE_KEY = '@active_restaurant_id';

// --- HARDCODE YOUR MACHINE'S IP ---
const MACHINE_IP = '192.168.18.16';  // ← CHANGE THIS TO YOUR CURRENT IP
export const API_BASE = `http://${MACHINE_IP}:4000/api/v1`;
// -----------------------------------

// Fallback restaurant ID (used only if no active restaurant is found)
export const RESTAURANT_ID = 'tenant-burgerbliss';

export type SectionConfig = { key: string; label: string; enabled: boolean; cardVariant?: string };

const DEFAULT_HOME: SectionConfig[] = [
  { key: 'hero', label: 'Hero Video', enabled: true },
  { key: 'cartRecovery', label: 'Cart Recovery', enabled: true },
  { key: 'loyalty', label: 'Loyalty Dashboard', enabled: true },
  { key: 'orderAgain', label: 'Order Again', enabled: true },
  { key: 'recommendations', label: 'Recommendations', enabled: true },
  { key: 'flashDeal', label: 'Flash Deal', enabled: true },
  { key: 'categories', label: 'Category Tiles', enabled: true },
  { key: 'mealDeal', label: 'Meal Deal Combo', enabled: true },
  { key: 'featured', label: 'Featured', enabled: true },
  { key: 'stories', label: 'Stories', enabled: true },
  { key: 'popular', label: 'Popular', enabled: true },
  { key: 'videoSection', label: 'Video Section', enabled: true, cardVariant: 'video' },
  { key: 'announcement', label: 'Announcement Strip', enabled: true },
  { key: 'imageMosaic', label: 'Image Mosaic', enabled: true },
];

const DEFAULT_MENU: SectionConfig[] = [
  { key: 'search', label: 'Search & Filters', enabled: true },
  { key: 'categories', label: 'Category Nav', enabled: true },
  { key: 'grid', label: 'Product Grid', enabled: true },
];

let homeSectionConfig: SectionConfig[] = DEFAULT_HOME;
let menuSectionConfig: SectionConfig[] = DEFAULT_MENU;

export const getHomeSectionConfig = (): SectionConfig[] => homeSectionConfig;
export const getMenuSectionConfig = (): SectionConfig[] => menuSectionConfig;

export async function bootstrapFromApi(timeoutMs = 15000): Promise<boolean> { // increased to 15s
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    let targetId: string | null = null;

    // 1. Try to fetch the active restaurant from the backend
    try {
      const activeRes = await fetch(`${API_BASE}/active_restaurant?_=${Date.now()}`, {
        signal: ctrl.signal,
        cache: 'no-cache',
      });
      if (activeRes.ok) {
        const active = await activeRes.json();
        if (active && typeof active.restaurantId === 'string') {
          targetId = active.restaurantId;
          await AsyncStorage.setItem(STORAGE_KEY, targetId);
        }
      } else {
        console.warn('Active restaurant fetch returned non-OK status:', activeRes.status);
      }
    } catch (err) {
      console.warn('Failed to fetch active restaurant:', err);
    }

    // 2. Fallback to stored ID
    if (!targetId) {
      try {
        const storedId = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedId) targetId = storedId;
      } catch (err) {
        console.warn('Failed to read stored restaurant ID:', err);
      }
    }

    // 3. Final fallback
    if (!targetId) {
      targetId = RESTAURANT_ID;
    }

    console.log(`🔄 Bootstrap target restaurant: ${targetId}`);

    // Now fetch the restaurant data
    const [settings, items, pages] = await Promise.all([
      fetch(`${API_BASE}/restaurants/${targetId}`, { signal: ctrl.signal }).then((r) => r.json()),
      fetch(`${API_BASE}/restaurants/${targetId}/menu_items`, { signal: ctrl.signal }).then((r) => r.json()),
      fetch(`${API_BASE}/restaurants/${targetId}/pages`, { signal: ctrl.signal }).then((r) => r.json()),
    ]);

    if (settings && typeof settings === 'object') {
      Object.assign(store.getCurrentTenant(), settings);
    }
    if (Array.isArray(items) && items.length > 0) {
      const arr = store.getMenuItems();
      arr.splice(0, arr.length, ...items);
    }
    if (pages && typeof pages === 'object') {
      if (Array.isArray(pages.home) && pages.home.length > 0) homeSectionConfig = pages.home;
      if (Array.isArray(pages.menu) && pages.menu.length > 0) menuSectionConfig = pages.menu;
    }
    return true;
  } catch (err) {
    console.warn('Bootstrap failed, using fallback data:', err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}