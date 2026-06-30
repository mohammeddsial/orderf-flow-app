import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { PageHero, SectionCard } from '../components/admin-ui';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FieldLabel } from '../components/admin-ui';
import { Tag, Plus, Flame, Clock } from 'lucide-react';

type Deal = {
  id: string;
  title: string;
  code: string;
  discount: string;
  status: 'active' | 'scheduled' | 'expired';
  isFlash?: boolean;
  expiry: string;
};

const INITIAL_DEALS: Deal[] = [
  { id: '1', title: 'Welcome 20% Off', code: 'WELCOME20', discount: '20%', status: 'active', expiry: 'Dec 31, 2026' },
  { id: '2', title: 'Free Delivery $25+', code: 'FREESHIP', discount: 'Free Ship', status: 'active', expiry: 'Jul 31, 2026' },
  { id: '3', title: 'Burger Bundle 2 for $18', code: 'BURGER2', discount: '$5 off', status: 'active', expiry: 'Jul 15, 2026' },
  { id: '4', title: 'Flash: 50% Shakes', code: 'SHAKE50', discount: '50%', status: 'active', isFlash: true, expiry: 'Jul 7, 2026' },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  expired: 'bg-gray-100 text-gray-500',
};

export const Promotions = () => {
  const [deals] = useState<Deal[]>(INITIAL_DEALS);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <Layout title="Promotions" breadcrumb="Promotions" searchPlaceholder="Search deals...">
      <div className="space-y-6">
        <PageHero
          title="Promotions"
          subtitle="Create deals, discount codes, and flash sales"
          actions={<Button size="sm" onClick={() => setShowCreate(!showCreate)}><Plus className="mr-1.5 h-4 w-4" /> New Deal</Button>}
        />

        {showCreate && (
          <SectionCard icon={Tag} title="Create New Deal" description="Set up a new promotion or discount code">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Deal Title</FieldLabel>
                <Input placeholder="e.g. Summer BBQ Special" />
              </div>
              <div>
                <FieldLabel>Promo Code</FieldLabel>
                <Input placeholder="e.g. SUMMER10" />
              </div>
              <div>
                <FieldLabel>Discount Type</FieldLabel>
                <Input placeholder="e.g. 15% or $5" />
              </div>
              <div>
                <FieldLabel>Expiry Date</FieldLabel>
                <Input type="date" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm">Create Deal</Button>
              <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </SectionCard>
        )}

        <SectionCard icon={Tag} title="Active Deals" description={`${deals.length} promotions running`}>
          <div className="space-y-2">
            {deals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${deal.isFlash ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-primary'}`}>
                    {deal.isFlash ? <Flame className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className="font-medium text-[#1E2D4A]">{deal.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Code: <span className="font-mono font-semibold">{deal.code}</span> · {deal.discount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {deal.expiry}
                    </p>
                  </div>
                  <Badge className={STATUS_COLORS[deal.status]}>
                    {deal.status}
                  </Badge>
                  {deal.isFlash && <Badge className="bg-red-100 text-red-700">Flash</Badge>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Layout>
  );
};
