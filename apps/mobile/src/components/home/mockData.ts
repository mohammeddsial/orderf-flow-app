// Lightweight demo data for Home sections that aren't yet backed by the store
// (stories, reorders, flash deal, live order, abandoned cart). Toggled on/off
// from the on-screen DemoControls panel so every module is demoable.

export interface Story {
  id: string;
  label: string;
  color: string;
  seen: boolean;
}

export const DEMO_STORIES: Story[] = [
  { id: 's1', label: 'New Drop', color: '#FF6B35', seen: false },
  { id: 's2', label: 'Chef Pick', color: '#00D9FF', seen: false },
  { id: 's3', label: 'BTS', color: '#FF006E', seen: true },
  { id: 's4', label: 'Combo', color: '#388E3C', seen: false },
  { id: 's5', label: 'Late Night', color: '#5C6AC4', seen: true },
];

export interface ReorderCard {
  id: string;
  title: string;
  itemCount: number;
  total: number;
}

export const DEMO_REORDERS: ReorderCard[] = [
  { id: 'o1', title: 'Classic Burger + Fries', itemCount: 3, total: 18.97 },
  { id: 'o2', title: 'Spicy Inferno Combo', itemCount: 2, total: 21.48 },
  { id: 'o3', title: 'Deluxe + Milkshake', itemCount: 2, total: 20.98 },
];

export interface FlashDeal {
  title: string;
  subtitle: string;
  durationSec: number;
}

export const DEMO_FLASH: FlashDeal = {
  title: '25% OFF ALL BURGERS',
  subtitle: 'Limited time — claim before it ends',
  durationSec: 1800, // 30 minutes
};

export interface ActiveOrderInfo {
  id: string;
  statusLabel: string;
  etaMin: number;
  progress: number; // 0..1
}

export const DEMO_ACTIVE_ORDER: ActiveOrderInfo = {
  id: 'OF-2048',
  statusLabel: 'Preparing your food',
  etaMin: 24,
  progress: 0.55,
};

export interface AbandonedCart {
  title: string;
  itemCount: number;
  total: number;
}

export const DEMO_ABANDONED: AbandonedCart = {
  title: 'Deluxe Burger + Hand-Cut Fries',
  itemCount: 3,
  total: 27.4,
};
