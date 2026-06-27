import React, { useEffect, useState } from 'react';
import type { MenuItem } from '@multi-restaurant/database';
import { api, AdminOrder } from '../lib/api';
import { useRestaurant } from '../context/RestaurantContext';
import { Layout } from '../components/Layout';
import { PageHero, SectionCard, StatCard } from '../components/admin-ui';
import { Badge } from '../components/ui/badge';
import { getPlaceholderImage } from '@multi-restaurant/database';
import {
  UtensilsCrossed,
  CheckCircle,
  Star,
  TrendingUp,
  MapPin,
  Truck,
  User,
} from 'lucide-react';

export const Dashboard = () => {
  const { currentId } = useRestaurant();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);


  useEffect(() => {
    if (!currentId) return;
    api.getMenuItems(currentId).then(setItems).catch(() => { });
    api.getOrders(currentId).then(setOrders).catch(() => { });
  }, [currentId]);

  const totalItems = items.length;
  const availableItems = items.filter((i) => i.isAvailable).length;
  const popularItems = items.filter((i) => i.basePrice > 10).length;

  return (

    <Layout title="Dashboard" breadcrumb="Dashboard" searchPlaceholder="Search orders, customers...">
      <div className="space-y-6">
        <PageHero
          title="Dashboard"
          subtitle="A live snapshot of your menu and active orders"
          status={{ label: 'Restaurant Live', tone: 'live' }}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Items" value={totalItems} hint="Menu items" icon={UtensilsCrossed} />
          <StatCard
            label="Available"
            value={availableItems}
            hint="In stock"
            icon={CheckCircle}
            iconClass="bg-green-50 text-green-600"
          />
          <StatCard
            label="Popular Items"
            value={popularItems}
            hint="High demand"
            icon={TrendingUp}
            iconClass="bg-yellow-50 text-yellow-600"
          />
          <StatCard
            label="Avg Rating"
            value="4.7"
            hint="Customer feedback"
            icon={Star}
            iconClass="bg-purple-50 text-purple-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard icon={Star} title="Popular Items" description="Top selling items from your menu" className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {items.slice(0, 4).map((item) => {
                const imageUrl = item.imageUrl || getPlaceholderImage(item.title); // <-- define here
                return (
                  <div key={item.id} className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img src={imageUrl} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#1E2D4A]">{item.title}</p>
                      <p className="text-sm font-semibold text-primary">${item.basePrice}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          4.7
                        </span>
                        <span>· 15m</span>
                        <Badge variant={item.isAvailable ? 'default' : 'destructive'} className="text-[10px]">
                          {item.isAvailable ? 'Available' : 'Sold Out'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard icon={Truck} title="Order Tracking" description="Live order status">
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="space-y-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <span className="font-medium text-[#1E2D4A]">{order.id}</span>
                    <span className="text-sm text-muted-foreground">Est. {order.eta}</span>
                  </div>
                  <div className="relative flex h-28 items-center justify-center rounded-xl bg-gray-100">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      <span className="text-xs font-medium text-[#1E2D4A]">{order.status}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>{order.driver}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E2D4A]">{order.driver}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">{order.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {order.items.map((it) => (
                      <Badge key={it} variant="outline" className="text-xs">
                        {it}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </Layout>
  );
};
