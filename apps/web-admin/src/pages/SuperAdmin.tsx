import React, { useEffect, useState } from 'react';
import type { RestaurantTenant } from '@multi-restaurant/database';
import { api } from '../lib/api';
import { useRestaurant } from '../context/RestaurantContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { CreateRestaurantDialog } from '../components/CreateRestaurantDialog';
import { PublishDialog } from '../components/PublishDialog';
import {
  Shield,
  Building2,
  DollarSign,
  PackageCheck,
  Activity,
  Server,
  Eye,
  Ban,
  Edit3,
  ExternalLink,
  Plus,
  Search,
  ChevronDown,
  Globe,
  Palette,
  Layers,
  Type,
  Sparkles,
  Save,
  TrendingUp,
  Users,
  Store,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wrench,
  Flame,
  Settings2,
  LogOut,
  HelpCircle,
  Bell,
} from 'lucide-react';

type EngineConfig = {
  name: string;
  label: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    muted: string;
    border: string;
  };
  radii: {
    sharp: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  borders: {
    thin: number;
    medium: number;
    thick: number;
    color: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: number;
  };
};

const DEFAULT_ENGINES: Record<string, EngineConfig> = {
  BRUTALIST_MODERNIST: {
    name: 'BRUTALIST_MODERNIST',
    label: 'Brutalist Modernist',
    colors: {
      background: '#F0EDE8',
      surface: '#FFFFFF',
      primary: '#F24F04',
      secondary: '#1A1A1A',
      accent: '#0066FF',
      text: '#0D0D0D',
      muted: '#6B6B6B',
      border: '#000000',
    },
    radii: { sharp: 0, sm: 0, md: 0, lg: 0, xl: 0, pill: 0 },
    borders: { thin: 2, medium: 3, thick: 5, color: '#000000' },
    typography: { headingFont: 'Impact, sans-serif', bodyFont: 'monospace', scale: 1.0 },
  },
  MINIMALIST_CLEAN: {
    name: 'MINIMALIST_CLEAN',
    label: 'Minimalist Clean',
    colors: {
      background: '#FAFAFA',
      surface: '#FFFFFF',
      primary: '#1A1A1A',
      secondary: '#4A4A4A',
      accent: '#2563EB',
      text: '#171717',
      muted: '#888888',
      border: '#E5E5E5',
    },
    radii: { sharp: 0, sm: 4, md: 8, lg: 12, xl: 16, pill: 9999 },
    borders: { thin: 1, medium: 2, thick: 3, color: '#E5E5E5' },
    typography: { headingFont: 'Inter, sans-serif', bodyFont: 'Inter, sans-serif', scale: 1.0 },
  },
  VIBRANT_STREET_TECH: {
    name: 'VIBRANT_STREET_TECH',
    label: 'Vibrant Street Tech',
    colors: {
      background: '#0A0E13',
      surface: '#14191F',
      primary: '#00D9FF',
      secondary: '#FF006E',
      accent: '#FFD700',
      text: '#FFFFFF',
      muted: '#8B95A5',
      border: '#1F2937',
    },
    radii: { sharp: 0, sm: 6, md: 12, lg: 16, xl: 20, pill: 9999 },
    borders: { thin: 1, medium: 2, thick: 3, color: '#1F2937' },
    typography: { headingFont: 'Space Grotesk, sans-serif', bodyFont: 'monospace', scale: 1.0 },
  },
};

type ColorInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <label className="flex items-center gap-2">
      <span className="relative flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-200 shadow-sm" style={{ background: value }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 rounded border border-gray-200 bg-white px-2 py-1 text-xs font-mono text-[#1E2D4A] outline-none focus:border-primary"
      />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </label>
  );
}

export const SuperAdmin = () => {
  const navigate = useNavigate();
  const { restaurants, currentId, setCurrentId, refresh } = useRestaurant();
  const [engines, setEngines] = useState(DEFAULT_ENGINES);
  const [activeTab, setActiveTab] = useState<'command' | 'tenants' | 'engines'>('command');
  const [searchQuery, setSearchQuery] = useState('');
  const [suspendTarget, setSuspendTarget] = useState<RestaurantTenant | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [engineToEdit, setEngineToEdit] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<RestaurantTenant | null>(null);
  const [editTenantName, setEditTenantName] = useState('');
  const [expandedEngine, setExpandedEngine] = useState<string | null>(null);

  const totalTenants = restaurants.length;
  const activeTenants = restaurants.filter((r) => {
    try { return JSON.parse((r as any).status ?? 'active'); } catch { return true; }
  }).length;
  const estimatedGMV = 284750;
  const totalOrders = 12473;
  const avgRating = 4.6;
  const systemHealth = { cpu: 42, memory: 68, uptime: 99.98 };

  const filteredTenants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const impersonateTenant = (tenant: RestaurantTenant) => {
    setCurrentId(tenant.id);
    navigate('/');
  };

  const handleSuspend = () => {
    setSuspendTarget(null);
  };

  const updateEngine = (name: string, updater: (prev: EngineConfig) => EngineConfig) => {
    setEngines((prev) => ({ ...prev, [name]: updater(prev[name]) }));
  };

  const publishEngines = async () => {
    for (const [name, config] of Object.entries(engines)) {
      try {
        const tenant = restaurants.find((r) => r.activeUiStyle === name);
        if (tenant) {
          await api.updateRestaurant(tenant.id, {
            primaryColor: config.colors.primary,
            secondaryColor: config.colors.secondary,
            backgroundColor: config.colors.background,
            accentColor: config.colors.accent,
          } as any);
        }
      } catch {}
    }
  };

  const handleEditTenant = (tenant: RestaurantTenant) => {
    setEditingTenant(tenant);
    setEditTenantName(tenant.name);
  };

  const handleSaveTenantEdit = async () => {
    if (!editingTenant) return;
    try {
      await api.updateRestaurant(editingTenant.id, { name: editTenantName } as any);
      await refresh();
    } catch {}
    setEditingTenant(null);
  };

  const SuspendDialog = () => (
    <Dialog open={!!suspendTarget} onOpenChange={(o) => { if (!o) setSuspendTarget(null); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Suspend {suspendTarget?.name}?</DialogTitle>
          <DialogDescription className="text-center">
            This will immediately pause all operations for this tenant. Customers will see an "unavailable" message.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={() => setSuspendTarget(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleSuspend}>Suspend Tenant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderEngineEditor = (engineId: string) => {
    const engine = engines[engineId];
    if (!engine) return null;
    const isExpanded = expandedEngine === engineId;

    return (
      <div key={engineId} className="rounded-xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setExpandedEngine(isExpanded ? null : engineId)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
              style={{ background: engine.colors.primary }}
            >
              {engineId === 'BRUTALIST_MODERNIST' ? 'BM' : engineId === 'MINIMALIST_CLEAN' ? 'MC' : 'VS'}
            </div>
            <div>
              <p className="font-semibold text-[#1E2D4A]">{engine.label}</p>
              <p className="text-xs text-muted-foreground">{engineId}</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-5">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Palette className="h-3.5 w-3.5" /> Color Tokens
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <ColorInput label="Background" value={engine.colors.background} onChange={(v) => updateEngine(engineId, (e) => ({ ...e, colors: { ...e.colors, background: v } }))} />
                <ColorInput label="Surface" value={engine.colors.surface} onChange={(v) => updateEngine(engineId, (e) => ({ ...e, colors: { ...e.colors, surface: v } }))} />
                <ColorInput label="Primary" value={engine.colors.primary} onChange={(v) => updateEngine(engineId, (e) => ({ ...e, colors: { ...e.colors, primary: v } }))} />
                <ColorInput label="Secondary" value={engine.colors.secondary} onChange={(v) => updateEngine(engineId, (e) => ({ ...e, colors: { ...e.colors, secondary: v } }))} />
                <ColorInput label="Accent" value={engine.colors.accent} onChange={(v) => updateEngine(engineId, (e) => ({ ...e, colors: { ...e.colors, accent: v } }))} />
                <ColorInput label="Text" value={engine.colors.text} onChange={(v) => updateEngine(engineId, (e) => ({ ...e, colors: { ...e.colors, text: v } }))} />
                <ColorInput label="Muted" value={engine.colors.muted} onChange={(v) => updateEngine(engineId, (e) => ({ ...e, colors: { ...e.colors, muted: v } }))} />
                <ColorInput label="Border" value={engine.colors.border} onChange={(v) => updateEngine(engineId, (e) => ({ ...e, colors: { ...e.colors, border: v } }))} />
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" /> Border Radii
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {Object.entries(engine.radii).map(([key, val]) => (
                  <label key={key} className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground capitalize">{key}</span>
                    <Input
                      type="number"
                      min={0}
                      max={9999}
                      value={val}
                      onChange={(e) => updateEngine(engineId, (prev) => ({ ...prev, radii: { ...prev.radii, [key]: Number(e.target.value) } }))}
                      className="h-8 text-xs"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Wrench className="h-3.5 w-3.5" /> Border Weights
              </p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(engine.borders).filter(([k]) => k !== 'color').map(([key, val]) => (
                  <label key={key} className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground capitalize">{key}</span>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      step={0.5}
                      value={val}
                      onChange={(e) => updateEngine(engineId, (prev) => ({ ...prev, borders: { ...prev.borders, [key]: Number(e.target.value) } }))}
                      className="h-8 text-xs"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Type className="h-3.5 w-3.5" /> Typography
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground">Heading Font</span>
                  <Input
                    value={engine.typography.headingFont}
                    onChange={(e) => updateEngine(engineId, (prev) => ({ ...prev, typography: { ...prev.typography, headingFont: e.target.value } }))}
                    className="h-8 text-xs"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground">Body Font</span>
                  <Input
                    value={engine.typography.bodyFont}
                    onChange={(e) => updateEngine(engineId, (prev) => ({ ...prev, typography: { ...prev.typography, bodyFont: e.target.value } }))}
                    className="h-8 text-xs"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground">Scale</span>
                  <Input
                    type="number"
                    min={0.5}
                    max={2}
                    step={0.05}
                    value={engine.typography.scale}
                    onChange={(e) => updateEngine(engineId, (prev) => ({ ...prev, typography: { ...prev.typography, scale: Number(e.target.value) } }))}
                    className="h-8 text-xs"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-[11px] font-semibold text-[#1E2D4A] mb-2">Live Preview</p>
              <div
                className="rounded-lg p-4 space-y-2"
                style={{ background: engine.colors.background }}
              >
                <div
                  className="rounded px-3 py-2 font-bold text-sm"
                  style={{
                    background: engine.colors.primary,
                    color: '#FFFFFF',
                    fontFamily: engine.typography.headingFont,
                    borderRadius: engine.radii.md,
                  }}
                >
                  {engine.label} Theme Preview
                </div>
                <div
                  className="rounded px-3 py-2 text-xs"
                  style={{
                    background: engine.colors.surface,
                    color: engine.colors.text,
                    border: `${engine.borders.thin}px solid ${engine.colors.border}`,
                    borderRadius: engine.radii.sm,
                    fontFamily: engine.typography.bodyFont,
                  }}
                >
                  Sample card content with the current color and typography settings applied.
                </div>
                <span
                  className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold"
                  style={{
                    background: engine.colors.accent,
                    color: '#FFFFFF',
                    borderRadius: engine.radii.pill,
                    fontFamily: engine.typography.bodyFont,
                  }}
                >
                  Pill Tag
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F4F6F9]">
      {/* Super Admin Sidebar */}
      <aside className="flex w-64 flex-col bg-[#0F172A] text-white">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <Shield className="h-5 w-5 text-white" />
          </span>
          <div>
            <h1 className="text-base font-bold leading-tight">PlatformOS</h1>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          <button
            type="button"
            onClick={() => setActiveTab('command')}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'command' ? 'bg-yellow-500/90 text-[#0F172A] shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Activity size={18} />
            <span>Global Command</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tenants')}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'tenants' ? 'bg-yellow-500/90 text-[#0F172A] shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Building2 size={18} />
            <span>Tenant Management</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('engines')}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'engines' ? 'bg-yellow-500/90 text-[#0F172A] shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Palette size={18} />
            <span>Style Engines</span>
          </button>

          <div className="my-2 border-t border-white/10" />

          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Store size={18} />
            <span>Tenant Admin</span>
          </button>
        </nav>

        <div className="px-3 py-3 space-y-1">
          <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
            <HelpCircle size={18} />
            <span>Help & Support</span>
          </button>
          <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>

        <div className="m-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-[#0F172A]">
            SA
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">System Admin</p>
            <p className="truncate text-xs text-slate-400">admin@platformos.io</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">PlatformOS</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-[#0F172A]">
                {activeTab === 'command' ? 'Global Command Center' : activeTab === 'tenants' ? 'Tenant Management' : 'Style Engine Governance'}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-[#1E2D4A] flex items-center gap-2">
              <Shield className="h-4 w-4 text-yellow-500" />
              Super Admin Workspace
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search tenants..." onChange={(e) => setSearchQuery(e.target.value)} className="w-64 rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-yellow-500 focus:bg-white focus:outline-none" />
            </div>
            <button type="button" className="relative rounded-full border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-yellow-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Tab: Global Command Center */}
          {activeTab === 'command' && (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total Tenants</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Building2 className="h-4 w-4" /></span>
                  </div>
                  <div className="mt-3 text-3xl font-bold text-[#1E2D4A]">{totalTenants}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{activeTenants} active · {totalTenants - activeTenants} suspended</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Platform GMV</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600"><DollarSign className="h-4 w-4" /></span>
                  </div>
                  <div className="mt-3 text-3xl font-bold text-[#1E2D4A]">${(estimatedGMV / 1000).toFixed(0)}K</div>
                  <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-green-500" /> +12.4% from last month</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total Orders</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600"><PackageCheck className="h-4 w-4" /></span>
                  </div>
                  <div className="mt-3 text-3xl font-bold text-[#1E2D4A]">{totalOrders.toLocaleString()}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Across all tenants · 24h rolling</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Avg. Rating</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600"><Sparkles className="h-4 w-4" /></span>
                  </div>
                  <div className="mt-3 text-3xl font-bold text-[#1E2D4A]">{avgRating}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Platform-wide weighted average</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold text-[#1E2D4A] flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" /> System Health Telemetry
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'API Latency', value: systemHealth.cpu, color: 'bg-green-500', unit: 'ms' },
                      { label: 'Memory Usage', value: systemHealth.memory, color: systemHealth.memory > 70 ? 'bg-yellow-500' : 'bg-green-500', unit: '%' },
                      { label: 'Uptime', value: systemHealth.uptime, color: 'bg-green-500', unit: '%' },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-muted-foreground">{m.label}</span>
                          <span className="font-semibold text-[#1E2D4A]">{m.value}{m.unit}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div className={`h-full rounded-full ${m.color} transition-all`} style={{ width: `${typeof m.value === 'number' && m.value <= 100 ? m.value : 42}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl border border-green-100 bg-green-50 px-4 py-3 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">All systems operational</p>
                      <p className="text-xs text-green-600">Last incident: 14 days ago · 99.98% uptime SLA</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold text-[#1E2D4A] flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Tenant Activity Stream
                  </h3>
                  <div className="space-y-3">
                    {restaurants.slice(0, 5).map((r, i) => (
                      <div key={r.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500 text-xs font-bold text-white">
                          {r.name.charAt(0)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-[#1E2D4A]">{r.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {i === 0 ? 'Menu updated 5 min ago' : i === 1 ? 'New order received' : i === 2 ? 'Settings changed' : i === 3 ? 'Review posted' : 'Theme customized'}
                          </p>
                        </div>
                        <Badge variant={i === 0 ? 'default' : 'outline'} className="text-[10px]">
                          {i === 0 ? 'Active' : i === 1 ? 'Order' : i === 2 ? 'Config' : 'Review'}
                        </Badge>
                      </div>
                    ))}
                    {restaurants.length === 0 && (
                      <p className="py-4 text-center text-sm text-muted-foreground">No tenant activity yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Tenant Management Grid */}
          {activeTab === 'tenants' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tenants</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-36"><SelectValue placeholder="Sort by" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="orders">Most Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setCreateOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" /> Onboard Tenant
                </Button>
              </div>

              <CreateRestaurantDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={async (r) => {
                  await refresh();
                  navigate('/super-admin');
                }}
              />

              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tenant</th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Style Engine</th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Orders (30d)</th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">GMV</th>
                        <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTenants.map((tenant, i) => {
                        const mockOrders = Math.floor(Math.random() * 500) + 50;
                        const mockGMV = Math.floor(Math.random() * 25000) + 5000;
                        const isActive = true;
                        return (
                          <tr key={tenant.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                  {tenant.logoUrl ? (
                                    <img src={tenant.logoUrl} alt="" className="h-full w-full object-contain" />
                                  ) : (
                                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                                      {tenant.name.charAt(0)}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-[#1E2D4A]">{tenant.name}</p>
                                  <p className="text-xs text-muted-foreground">ID: {tenant.id.slice(0, 8)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-mono ${
                                  tenant.activeUiStyle === 'VIBRANT_STREET_TECH' ? 'border-cyan-300 bg-cyan-50 text-cyan-700' :
                                  tenant.activeUiStyle === 'MINIMALIST_CLEAN' ? 'border-gray-300 bg-gray-50 text-gray-700' :
                                  'border-orange-300 bg-orange-50 text-orange-700'
                                }`}
                              >
                                {tenant.activeUiStyle === 'VIBRANT_STREET_TECH' ? 'Vibrant Tech' :
                                 tenant.activeUiStyle === 'MINIMALIST_CLEAN' ? 'Minimalist' :
                                 'Brutalist'}
                              </Badge>
                            </td>
                            <td className="px-5 py-3">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                {isActive ? 'Active' : 'Suspended'}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-sm font-medium text-[#1E2D4A]">{mockOrders}</td>
                            <td className="px-5 py-3 text-sm font-semibold text-[#1E2D4A]">${mockGMV.toLocaleString()}</td>
                            <td className="px-5 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Impersonate tenant"
                                  onClick={() => impersonateTenant(tenant)}
                                >
                                  <Eye className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Edit tenant"
                                  onClick={() => handleEditTenant(tenant)}
                                >
                                  <Edit3 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="View live store"
                                  onClick={() => { setCurrentId(tenant.id); navigate('/'); }}
                                >
                                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Suspend tenant"
                                  onClick={() => setSuspendTarget(tenant)}
                                >
                                  <Ban className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredTenants.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                            No tenants found. Click "Onboard Tenant" to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm">
                <span className="text-muted-foreground">Showing {filteredTenants.length} of {totalTenants} tenants</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Global Style Engine Governance */}
          {activeTab === 'engines' && (
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800">Global Style Engine Governance</p>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    Changes made here define the locked core parameters for all three UI style engines. Tenant restaurants inherit from these global definitions but can apply local overrides via their Theme Customizer.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {Object.keys(DEFAULT_ENGINES).map(renderEngineEditor)}
              </div>

              <div className="sticky bottom-0 flex items-center justify-between rounded-2xl bg-[#0F172A] px-6 py-4 text-white shadow-lg">
                <div>
                  <p className="font-semibold">Publish Global Style Changes?</p>
                  <p className="text-sm text-slate-300">All tenants using affected engines will update on next launch</p>
                </div>
                <Button onClick={() => { setPublishOpen(true); }} className="gap-2 bg-yellow-500 text-[#0F172A] hover:bg-yellow-400">
                  <Save className="h-4 w-4" />
                  Deploy Changes
                </Button>
              </div>

              <PublishDialog
                open={publishOpen}
                onOpenChange={setPublishOpen}
                title="Deploy Global Style Changes?"
                description="This will push your engine configurations to all tenant configurations. Individual overrides will be preserved."
                successTitle="Global styles deployed"
                successText="Engine configurations have been published to the platform."
                onConfirm={publishEngines}
              />
            </div>
          )}
        </main>
      </div>

      <SuspendDialog />

      {/* Edit Tenant Dialog */}
      <Dialog open={!!editingTenant} onOpenChange={(o) => { if (!o) setEditingTenant(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>Update the tenant's display name.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tenant Name</Label>
              <Input value={editTenantName} onChange={(e) => setEditTenantName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Style Engine</Label>
              <Input value={editingTenant?.activeUiStyle ?? ''} disabled className="text-muted-foreground" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTenant(null)}>Cancel</Button>
            <Button onClick={handleSaveTenantEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};