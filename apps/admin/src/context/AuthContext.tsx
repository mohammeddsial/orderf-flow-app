import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AdminRole = 'restaurant_admin' | 'super_admin';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  restaurantId: string | null;
}

const DEMO_SUPER_ADMIN: AdminUser = {
  id: 'admin-001',
  email: 'alex@burgerbliss.co',
  name: 'Alex Donovan',
  role: 'super_admin',
  restaurantId: null,
};

const DEMO_RESTAURANT_ADMIN: AdminUser = {
  id: 'admin-002',
  email: 'manager@burgerbliss.co',
  name: 'Sam Manager',
  role: 'restaurant_admin',
  restaurantId: 'tenant-burgerbliss',
};

interface AuthCtx {
  user: AdminUser | null;
  isSuperAdmin: boolean;
  switchRole: (role: AdminRole) => void;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('adminRole');
    if (stored === 'restaurant_admin') {
      setUser(DEMO_RESTAURANT_ADMIN);
    } else {
      setUser(DEMO_SUPER_ADMIN);
    }
  }, []);

  const switchRole = (role: AdminRole) => {
    localStorage.setItem('adminRole', role);
    if (role === 'restaurant_admin') {
      setUser(DEMO_RESTAURANT_ADMIN);
    } else {
      setUser(DEMO_SUPER_ADMIN);
    }
  };

  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <Ctx.Provider value={{ user, isSuperAdmin, switchRole }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
