import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { CreateRestaurantDialog } from './CreateRestaurantDialog';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  SlidersHorizontal,
  Smartphone,
  BarChart3,
  Users,
  Tag,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Flame,
  Star,
  Shield,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title: string;
  breadcrumb?: string;
  searchPlaceholder?: string;
}

type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  to?: string;
  badge?: string;
};

const NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Orders', icon: ShoppingBag, badge: '12' },
  { label: 'Menu Manager', icon: UtensilsCrossed, to: '/menu' },
  { label: 'Pages', icon: Smartphone, to: '/home-layout' },
  { label: 'Restaurant Settings', icon: SlidersHorizontal, to: '/settings' },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Customers', icon: Users },
  { label: 'Promotions', icon: Tag },
  { label: 'Super Admin', icon: Shield, to: '/super-admin' },
];

const RestaurantSwitcher: React.FC = () => {
  const { restaurants, currentId, setCurrentId, refresh } = useRestaurant();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentId ?? ''}
        onChange={(e) => setCurrentId(e.target.value)}
        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-[#1E2D4A] focus:border-orange-400 focus:outline-none"
      >
        {restaurants.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setCreateOpen(true)}
        title="Add restaurant"
        className="rounded-lg border border-gray-200 px-2.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-orange-50"
      >
        + Add
      </button>

      <CreateRestaurantDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={async (r) => {
          await refresh();
          setCurrentId(r.id);
          navigate('/menu'); // go straight to Menu setup for the new restaurant
        }}
      />
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, title, breadcrumb, searchPlaceholder }) => {
  const location = useLocation();
  const { current } = useRestaurant();

  const renderNav = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = item.to ? location.pathname === item.to : false;
    const base =
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full';
    const cls = isActive
      ? `${base} bg-primary text-white shadow-sm`
      : `${base} text-slate-300 hover:bg-white/5 hover:text-white`;

    const inner = (
      <>
        <Icon size={18} />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge ? (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">
            {item.badge}
          </span>
        ) : null}
      </>
    );

    if (item.to) {
      return (
        <Link key={item.label} to={item.to} className={cls}>
          {inner}
        </Link>
      );
    }
    return (
      <button key={item.label} type="button" className={cls}>
        {inner}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#F4F6F9]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-[#16233C] text-white">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Flame className="h-5 w-5 text-white" />
          </span>
          <div>
            <h1 className="text-base font-bold leading-tight">{current?.name ?? 'Order Flow'}</h1>
            <p className="text-xs text-slate-400">Restaurant Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">{NAV.map(renderNav)}</nav>

        <div className="space-y-1 px-3 py-3">
          <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
            <HelpCircle size={18} />
            <span>Help &amp; Support</span>
          </button>
          <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>

        <div className="m-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            AD
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Alex Donovan</p>
            <p className="truncate text-xs text-slate-400">alex@burgerbliss.co</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Home</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-primary">{breadcrumb ?? title}</span>
            </div>
            <h2 className="text-sm font-semibold text-[#1E2D4A]">{title}</h2>
          </div>

          <div className="flex items-center gap-4">
            <RestaurantSwitcher />
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder ?? 'Search...'}
                className="w-64 rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-orange-400 focus:bg-white focus:outline-none"
              />
            </div>
            <button type="button" className="relative rounded-full border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                AD
              </span>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-[#1E2D4A]">Alex Donovan</p>
                <p className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
