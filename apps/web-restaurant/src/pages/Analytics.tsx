import React from 'react';
import { Layout } from '../components/Layout';
import { PageHero, SectionCard, StatCard } from '../components/admin-ui';
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react';

export const Analytics = () => {
  return (
    <Layout title="Analytics" breadcrumb="Analytics" searchPlaceholder="Search analytics...">
      <div className="space-y-6">
        <PageHero
          title="Analytics"
          subtitle="Sales trends, peak hours, and item performance"
          status={{ label: 'Last 30 days', tone: 'muted' }}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Revenue" value="$12,480" hint="This month" icon={DollarSign} />
          <StatCard label="Orders" value="342" hint="This month" icon={TrendingUp} />
          <StatCard label="Avg Order" value="$36.50" hint="Per order" icon={Clock} />
          <StatCard label="Repeat Customers" value="68%" hint="Returning rate" icon={Users} />
        </div>

        <SectionCard icon={TrendingUp} title="Sales Trend" description="Daily revenue over the last 14 days">
          <div className="flex h-48 items-end justify-between gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/20"
                style={{ height: `${30 + Math.random() * 70}%` }}
              >
                <div className="h-full w-full rounded-t bg-primary/60" />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>14 days ago</span>
            <span>Today</span>
          </div>
        </SectionCard>

        <SectionCard icon={Clock} title="Peak Hours" description="When your kitchen is busiest">
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="text-center">
                <div
                  className="mx-auto w-full rounded bg-primary/30"
                  style={{ height: `${20 + Math.random() * 60}px` }}
                />
                <p className="mt-1 text-[9px] text-muted-foreground">{i + 10}h</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Layout>
  );
};
