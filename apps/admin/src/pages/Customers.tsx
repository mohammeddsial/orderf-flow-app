import React from 'react';
import { Layout } from '../components/Layout';
import { PageHero, SectionCard } from '../components/admin-ui';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Users, Star } from 'lucide-react';

const DEMO_CUSTOMERS = [
  { id: 1, name: 'David Chen', email: 'david@email.com', orders: 24, spent: 482.50, tier: 'Gold', lastOrder: '2 days ago' },
  { id: 2, name: 'Emily Davis', email: 'emily@email.com', orders: 18, spent: 324.75, tier: 'Silver', lastOrder: '5 days ago' },
  { id: 3, name: 'Sarah Johnson', email: 'sarah@email.com', orders: 32, spent: 615.20, tier: 'Platinum', lastOrder: '1 day ago' },
  { id: 4, name: 'Mike Wilson', email: 'mike@email.com', orders: 7, spent: 98.40, tier: 'Bronze', lastOrder: '1 week ago' },
  { id: 5, name: 'Lisa Brown', email: 'lisa@email.com', orders: 15, spent: 267.80, tier: 'Silver', lastOrder: '3 days ago' },
];

const TIER_COLORS: Record<string, string> = {
  Gold: 'bg-amber-100 text-amber-700',
  Silver: 'bg-slate-100 text-slate-700',
  Platinum: 'bg-indigo-100 text-indigo-700',
  Bronze: 'bg-orange-100 text-orange-700',
};

export const Customers = () => {
  return (
    <Layout title="Customers" breadcrumb="Customers" searchPlaceholder="Search customers...">
      <div className="space-y-6">
        <PageHero
          title="Customers"
          subtitle="Customer list, order history, and loyalty status"
          status={{ label: `${DEMO_CUSTOMERS.length} customers`, tone: 'muted' }}
        />

        <SectionCard icon={Users} title="All Customers" description="Click a customer to view their order history">
          <div className="space-y-2">
            {DEMO_CUSTOMERS.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[#1E2D4A]">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1E2D4A]">{customer.orders} orders</p>
                    <p className="text-xs text-muted-foreground">${customer.spent.toFixed(2)} total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Last order</p>
                    <p className="text-xs text-[#1E2D4A]">{customer.lastOrder}</p>
                  </div>
                  <Badge className={TIER_COLORS[customer.tier]}>
                    <Star className="mr-1 h-3 w-3 fill-current" />
                    {customer.tier}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Layout>
  );
};
