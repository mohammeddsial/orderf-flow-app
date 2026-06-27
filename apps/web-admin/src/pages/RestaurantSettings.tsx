import React, { useState, useRef, useEffect } from 'react';
import type { RestaurantTenant } from '@multi-restaurant/database';
import { api } from '../lib/api';
import { ENGINE_TOKENS, TOKEN_GROUPS, type TokenOverrides, type EngineId, type EngineTokenGroups } from '../lib/engineTokens';
import { useRestaurant } from '../context/RestaurantContext';
import { Layout } from '../components/Layout';
import { PublishDialog } from '../components/PublishDialog';
import { PageHero, SectionCard, FieldLabel } from '../components/admin-ui';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ImagePlus, SlidersHorizontal, Settings2, Palette, Save, Upload, Sparkles, Eye } from 'lucide-react';

type ColorSwatchProps = {
  label: string;
  sub: string;
  value: string;
  onChange: (v: string) => void;
};

function ColorSwatch({ label, sub, value, onChange }: ColorSwatchProps) {
  return (
    <div className="rounded-xl border border-gray-100 p-3">
      <label className="block cursor-pointer">
        <span className="block h-12 w-full rounded-lg" style={{ background: value }} />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="sr-only" />
      </label>
      <div className="mt-2">
        <p className="text-sm font-semibold text-[#1E2D4A]">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5">
        <span className="h-3 w-3 rounded-full border border-gray-200" style={{ background: value }} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-xs text-[#1E2D4A] outline-none"
        />
      </div>
    </div>
  );
}

export const RestaurantSettings = () => {
  const { currentId, refresh } = useRestaurant();
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [tagline, setTagline] = useState('Flame-Grilled Perfection Since 2008');
  const [cuisineTags, setCuisineTags] = useState('American · Fast Casual · Burgers');
  const [archetype, setArchetype] = useState('Classic American Diner');
  const [primary, setPrimary] = useState('#FF6B35');
  const [secondary, setSecondary] = useState('#1E2D4A');
  const [background, setBackground] = useState('#F4F6F9');
  const [accent, setAccent] = useState('#E84545');
  const [surface, setSurface] = useState('#E6E6E6');
  const [accentLight, setAccentLight] = useState('#FF9E46');
  const [style, setStyle] = useState<RestaurantTenant['activeUiStyle']>('VIBRANT_STREET_TECH');
  const [borderRadius, setBorderRadius] = useState<RestaurantTenant['borderRadiusType']>('ROUNDED_SM');
  const [overrides, setOverrides] = useState<TokenOverrides>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current settings from the backend.
  useEffect(() => {
    if (!currentId) return;
    api
      .getRestaurant(currentId)
      .then((t) => {
        setName(t.name);
        setLogo(t.logoUrl);
        setPrimary(t.primaryColor);
        setSecondary(t.secondaryColor);
        setBackground(t.backgroundColor);
        setAccent(t.accentColor);
        setSurface(t.surfaceColor);
        setAccentLight(t.accentLightColor);
        setStyle(t.activeUiStyle);
        setBorderRadius(t.borderRadiusType);
        setOverrides((t as any).tokenOverrides || {});
      })
      .catch(() => {
        /* backend offline — keep defaults */
      });
  }, [currentId]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const publish = async () => {
    if (!currentId) return;
    await api.updateRestaurant(currentId, {
      name,
      logoUrl: logo,
      primaryColor: primary,
      secondaryColor: secondary,
      backgroundColor: background,
      accentColor: accent,
      surfaceColor: surface,
      accentLightColor: accentLight,
      activeUiStyle: style,
      borderRadiusType: borderRadius,
      tokenOverrides: overrides,
    } as any);
    await refresh(); // update the name shown in the switcher/sidebar
  };

  // Only two engines are supported now; fall back to Minimalist for any legacy value.
  const tokenStyle: EngineId = style === 'VIBRANT_STREET_TECH' ? 'VIBRANT_STREET_TECH' : 'MINIMALIST_CLEAN';

  // Edit a single engine-token property as an override (blank / equal-to-default
  // removes the override so the engine value is used).
  const setField = (group: keyof EngineTokenGroups, key: string, raw: string) =>
    setOverrides((prev) => {
      const def = ENGINE_TOKENS[tokenStyle][group][key];
      const numeric = typeof def === 'number';
      const next: Record<string, number | string> = { ...(prev[group] || {}) };
      const val = raw === '' ? undefined : numeric ? Number(raw) : raw;
      if (val === undefined || val === def) delete next[key];
      else next[key] = val;
      return { ...prev, [group]: next };
    });

  return (
    <Layout title="Restaurant Settings" breadcrumb="Settings" searchPlaceholder="Search settings...">
      <div className="mx-auto max-w-6xl space-y-6 pb-4">
        <PageHero
          title="Restaurant Settings"
          subtitle="Manage your brand identity, visual style, and display preferences"
          status={{ label: 'Restaurant Live', tone: 'live' }}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            <SectionCard icon={ImagePlus} title="Brand Logo">
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-8 text-center">
                {logo ? (
                  <img src={logo} alt="Logo" className="mx-auto mb-3 h-16 w-16 rounded-lg object-contain" />
                ) : (
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm">
                    <Upload className="h-5 w-5" />
                  </div>
                )}
                <p className="text-sm font-semibold text-[#1E2D4A]">Drag &amp; drop your logo</p>
                <p className="mb-3 text-xs text-muted-foreground">PNG, SVG, WebP — max 5 MB</p>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Browse Files
                </Button>
                <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </div>
            </SectionCard>

            <SectionCard icon={SlidersHorizontal} title="Style Engine">
              <div className="space-y-4">
                <div>
                  <FieldLabel>Restaurant Archetype</FieldLabel>
                  <Select value={archetype} onValueChange={setArchetype}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Classic American Diner">Classic American Diner</SelectItem>
                      <SelectItem value="Fast Casual">Fast Casual</SelectItem>
                      <SelectItem value="Fine Dining">Fine Dining</SelectItem>
                      <SelectItem value="Street Food">Street Food</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <FieldLabel>Visual Theme Variant</FieldLabel>
                  <Select value={style} onValueChange={(v) => setStyle(v as typeof style)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIBRANT_STREET_TECH">Bold &amp; Vibrant</SelectItem>
                      <SelectItem value="MINIMALIST_CLEAN">Minimal &amp; Clean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-start gap-2 rounded-xl bg-orange-50 p-3 text-sm text-[#1E2D4A]">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-xs">Style engine settings affect how your menu page renders to customers in real time.</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={Eye} title="Style &amp; Typography">
              <p className="mb-3 text-xs text-muted-foreground">
                Every Border, Shadow &amp; Typography property from the{' '}
                <span className="font-semibold text-[#1E2D4A]">{style}</span> engine. Edit to override for this restaurant — blank uses the engine default (shown as the placeholder).
              </p>
              <div className="space-y-4">
                {TOKEN_GROUPS.map((grp) => (
                  <div key={grp.key}>
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{grp.label}</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {Object.keys(ENGINE_TOKENS[tokenStyle][grp.key]).map((k) => {
                        const def = ENGINE_TOKENS[tokenStyle][grp.key][k];
                        const numeric = typeof def === 'number';
                        const g = overrides[grp.key] as Record<string, number | string> | undefined;
                        const current = g && g[k] !== undefined ? g[k] : '';
                        return (
                          <label key={k} className="block">
                            <span className="block truncate text-[11px] text-muted-foreground" title={k}>{k}</span>
                            <input
                              type={numeric ? 'number' : 'text'}
                              value={current as string | number}
                              placeholder={String(def)}
                              onChange={(e) => setField(grp.key, k, e.target.value)}
                              className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-[#1E2D4A] outline-none focus:border-primary"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <SectionCard icon={Settings2} title="Restaurant Identity">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Restaurant Name</FieldLabel>
                    <span className="text-[11px] text-muted-foreground">{name.length}/64</span>
                  </div>
                  <Input value={name} maxLength={64} onChange={(e) => setName(e.target.value)} className="font-semibold" />
                  <p className="mt-1 text-[11px] text-muted-foreground">Shown on menus, receipts &amp; customer emails</p>
                </div>
                <div>
                  <FieldLabel>Tagline</FieldLabel>
                  <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>Cuisine Tags</FieldLabel>
                  <Input value={cuisineTags} onChange={(e) => setCuisineTags(e.target.value)} />
                  <p className="mt-1 text-[11px] text-muted-foreground">Separate tags with · to help customers discover you</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={Palette} title="Brand Color Palette">
              <div className="grid grid-cols-2 gap-3">
                <ColorSwatch label="Primary" sub="Buttons & CTA" value={primary} onChange={setPrimary} />
                <ColorSwatch label="Background" sub="Page canvas" value={background} onChange={setBackground} />
                <ColorSwatch label="Foreground" sub="Text & icons" value={secondary} onChange={setSecondary} />
                <ColorSwatch label="Accent" sub="Alerts & badges" value={accent} onChange={setAccent} />
                <ColorSwatch label="Surface" sub="Borders & surfaces" value={surface} onChange={setSurface} />
                <ColorSwatch label="Accent Light" sub="Hover & highlights" value={accentLight} onChange={setAccentLight} />
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Click any swatch to open the system color picker, or type a hex value directly.
              </p>
            </SectionCard>
          </div>
        </div>

        {/* Sticky publish bar */}
        <div className="sticky bottom-0 flex items-center justify-between rounded-2xl bg-[#1E2D4A] px-6 py-4 text-white shadow-lg">
          <div>
            <p className="font-semibold">Ready to publish changes?</p>
            <p className="text-sm text-slate-300">Updates go live immediately across all touchpoints</p>
          </div>
          <Button onClick={() => setConfirmOpen(true)} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <PublishDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Publish settings?"
          description="Your brand identity and colors will go live across all touchpoints."
          successTitle="Settings published"
          successText="Your brand updates are now live."
          onConfirm={publish}
        />
      </div>
    </Layout>
  );
};
