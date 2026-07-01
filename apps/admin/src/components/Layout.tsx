import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth, AdminRole } from '../context/AuthContext';
import { CreateRestaurantDialog } from './CreateRestaurantDialog';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
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
  Building2,
  Repeat,
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
  roles: AdminRole[];
};

const TENANT_NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/', roles: ['restaurant_admin', 'super_admin'] },
  { label: 'Orders', icon: ShoppingBag, badge: '12', roles: ['restaurant_admin'] },
  { label: 'Menu Manager', icon: UtensilsCrossed, to: '/menu', roles: ['restaurant_admin'] },
  { label: 'Layout Builder', icon: Smartphone, to: '/layout-builder', roles: ['restaurant_admin'] },
  { label: 'Analytics', icon: BarChart3, roles: ['restaurant_admin'] },
  { label: 'Customers', icon: Users, roles: ['restaurant_admin'] },
  { label: 'Promotions', icon: Tag, roles: ['restaurant_admin'] },
];

const SUPER_NAV: NavItem[] = [
  { label: 'Super Admin', icon: Shield, to: '/super-admin', roles: ['super_admin'] },
  { label: 'All Tenants', icon: Building2, to: '/super-admin#tenants', roles: ['super_admin'] },
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
        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-[#0f0f0f] focus:border-primary focus:outline-none"
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
        className="rounded-lg border border-gray-200 px-2.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-pink-50"
      >
        + Add
      </button>

      <CreateRestaurantDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={async (r) => {
          await refresh();
          setCurrentId(r.id);
          navigate('/menu');
        }}
      />
    </div>
  );
};

const RoleSwitcher: React.FC = () => {
  const { user, switchRole } = useAuth();
  if (!user) return null;

  const nextRole: AdminRole = user.role === 'super_admin' ? 'restaurant_admin' : 'super_admin';

  return (
    <button
      type="button"
      onClick={() => switchRole(nextRole)}
      className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 text-sm font-medium text-pink-light transition-colors hover:bg-white/10 hover:text-white"
      title={`Switch to ${nextRole === 'super_admin' ? 'Super Admin' : 'Tenant Admin'} view`}
    >
      <Repeat size={18} />
      <span>Switch to {nextRole === 'super_admin' ? 'Super Admin' : 'Tenant'}</span>
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, title, breadcrumb, searchPlaceholder }) => {
  const location = useLocation();
  const { current } = useRestaurant();
  const { user, isSuperAdmin } = useAuth();

  const visibleNav = [...TENANT_NAV, ...(isSuperAdmin ? SUPER_NAV : [])].filter((item) =>
    item.roles.includes(user?.role ?? 'restaurant_admin')
  );

  const renderNav = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = item.to
      ? location.pathname === item.to.split('#')[0] &&
        (!item.to.includes('#') || location.hash === item.to.substring(item.to.indexOf('#')))
      : false;
    const base =
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full';
    const cls = isActive
      ? `${base} bg-primary text-white shadow-sm`
      : `${base} text-pink-light hover:bg-white/5 hover:text-white`;

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

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AD';

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      <aside className="flex w-64 flex-col bg-[#4a0929] text-white">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Flame className="h-5 w-5 text-white" />
          </span>
          <div>
            <h1 className="text-base font-bold leading-tight">{current?.name ?? 'Order Flow'}</h1>
            <p className="text-xs text-pink-light">
              {isSuperAdmin ? 'Super Admin' : 'Restaurant Admin'}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {visibleNav.map(renderNav)}
        </nav>

        <div className="space-y-1 px-3 py-3">
          <RoleSwitcher />
          <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-pink-light transition-colors hover:bg-white/5 hover:text-white">
            <HelpCircle size={18} />
            <span>Help &amp; Support</span>
          </button>
          <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-pink-light transition-colors hover:bg-white/5 hover:text-white">
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>

        <div className="m-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name ?? 'Unknown'}</p>
            <p className="truncate text-xs text-pink-light">{user?.email ?? ''}</p>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Home</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-primary">{breadcrumb ?? title}</span>
            </div>
            <h2 className="text-sm font-semibold text-[#0f0f0f]">{title}</h2>
          </div>

          <div className="flex items-center gap-4">
            {current && <RestaurantSwitcher />}
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder ?? 'Search...'}
                className="w-64 rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>
            <button type="button" className="relative rounded-full border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {initials}
              </span>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-[#0f0f0f]">{user?.name ?? 'Unknown'}</p>
                <p className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                  {isSuperAdmin ? (
                    <>
                      <Shield className="h-3 w-3 fill-primary text-primary" />
                      Super Admin
                    </>
                  ) : (
                    <>
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      Tenant Admin
                    </>
                  )}
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
