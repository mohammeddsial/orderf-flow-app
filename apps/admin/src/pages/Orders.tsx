import React, { useEffect, useState } from 'react';
import { api, AdminOrder } from '../lib/api';
import { useRestaurant } from '../context/RestaurantContext';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/admin-ui';
import { Badge } from '../components/ui/badge';
import { ShoppingBag, Clock, Truck, CheckCircle } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  PREPARING: 'bg-amber-100 text-amber-700',
  COOKING: 'bg-orange-100 text-primary',
  READY: 'bg-blue-100 text-blue-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
};

export const Orders = () => {
  const { currentId } = useRestaurant();
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    if (!currentId) return;
    api.getOrders(currentId).then(setOrders).catch(() => {});
  }, [currentId]);

  return (
    <Layout title="Orders" breadcrumb="Orders" searchPlaceholder="Search orders...">
      <div className="space-y-6">
        <PageHero
          title="Orders"
          subtitle="Live order feed — accept, track, and manage deliveries"
          status={{ label: `${orders.length} total`, tone: 'muted' }}
        />

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-primary">
                    {order.status === 'DELIVERED' ? <CheckCircle className="h-5 w-5" /> :
                     order.status === 'OUT_FOR_DELIVERY' ? <Truck className="h-5 w-5" /> :
                     <Clock className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f0f0f]">#{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer} · {order.items.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-[#0f0f0f]">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">ETA: {order.eta}</p>
                  </div>
                  <Badge className={STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}>
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
