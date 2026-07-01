import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export const WINE = '#4a0929';
export const WINE_PANEL = '#4a0929';
export const PINK = '#b81969';
export const PINK_LIGHT = '#f6c0db';

type PageHeroProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  status?: { label: string; tone?: 'live' | 'muted' };
};

export function PageHero({ title, subtitle, actions, status }: PageHeroProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[#0f0f0f]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        {status ? (
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              status.tone === 'muted'
                ? 'border-gray-200 bg-white text-muted-foreground'
                : 'border-green-200 bg-green-50 text-green-600'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${status.tone === 'muted' ? 'bg-gray-300' : 'bg-green-500'}`} />
            {status.label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

type SectionCardProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({ icon: Icon, title, description, children, className }: SectionCardProps) {
  return (
    <section className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${className ?? ''}`}>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[#0f0f0f]">{title}</h2>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  iconClass?: string;
};

export function StatCard({ label, value, hint, icon: Icon, iconClass }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass ?? 'bg-pink-50 text-primary'}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold text-[#0f0f0f]">{value}</div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}
