import React, { useEffect, useState } from 'react';
import { api, HomeSection } from '../lib/api';
import { useRestaurant } from '../context/RestaurantContext';
import { Layout } from '../components/Layout';
import { PageHero, SectionCard } from '../components/admin-ui';
import { PublishDialog } from '../components/PublishDialog';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Smartphone, ArrowUp, ArrowDown, Save, Plus, Trash2, Monitor, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';

// All possible page keys – keep in sync with mobile app
const ALL_PAGE_KEYS = [
  'home',
  'menu',
  'cart',
  'checkout',
  'delivery',
  'product',
  'orderSuccess',
  'upsell',
  'rewards',
  'reviews',
];

// Master list of all available sections with allowed card variants
const ALL_SECTIONS: Record<string, { label: string; allowedVariants?: string[] }> = {
  hero: { label: 'Hero Video' },
  cartRecovery: { label: 'Cart Recovery', allowedVariants: ['listRow', 'overlayPrice'] },
  loyalty: { label: 'Loyalty Dashboard' },
  orderAgain: { label: 'Order Again', allowedVariants: ['listRow', 'plainGrid', 'overlayPrice'] },
  recommendations: { label: 'Recommendations', allowedVariants: ['plainGrid', 'overlayPrice', 'listRow', 'feature'] },
  flashDeal: { label: 'Flash Deal', allowedVariants: ['feature', 'overlayPrice'] },
  categories: { label: 'Category Tiles' },
  mealDeal: { label: 'Meal Deal Combo', allowedVariants: ['feature', 'overlayPrice'] },
  featured: { label: 'Featured', allowedVariants: ['feature', 'overlayPrice', 'plainGrid', 'slides'] },
  stories: { label: 'Stories' },
  popular: { label: 'Popular', allowedVariants: ['listRow', 'plainGrid', 'overlayPrice', 'qtyRow'] },
  videoSection: { label: 'Video Section', allowedVariants: ['video', 'slides'] },
  announcement: { label: 'Announcement Strip' },
  imageMosaic: { label: 'Image Mosaic' },
  search: { label: 'Search & Filters' },
  grid: { label: 'Product Grid', allowedVariants: ['plainGrid', 'listRow', 'overlayPrice', 'qtyRow'] },
};

const CARD_VARIANT_LABELS: Record<string, string> = {
  listRow: 'List Row',
  overlayPrice: 'Overlay Price',
  qtyRow: 'Quantity Row',
  plainGrid: 'Plain Grid',
  feature: 'Feature Card',
  slides: 'Slides',
  video: 'Video',
  restaurantCard: 'Restaurant Card',
};

export const HomeLayout = () => {
  const { currentId, current } = useRestaurant();
  const [pages, setPages] = useState<Record<string, HomeSection[]>>({});
  const [selectedPage, setSelectedPage] = useState('home');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false);
  const [newSectionKey, setNewSectionKey] = useState<string>('');
  const [newPageKey, setNewPageKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState<'mobile' | 'web'>('mobile');
  const [reloadKey, setReloadKey] = useState(0);

  // Live preview URLs — both apps read active_restaurant from the API
  const PREVIEW_URL = {
    mobile: 'http://localhost:8081',
    web: 'http://localhost:3000',
  };

  // Reload iframes when restaurant changes (engine/colors may have changed)
  useEffect(() => {
    setReloadKey((k) => k + 1);
  }, [currentId]);

  // Fetch pages from backend
  useEffect(() => {
    if (!currentId) return;
    api
      .getPages(currentId)
      .then((data) => {
        setPages(data);
        // If the selected page doesn't exist, fallback to the first available
        if (!data[selectedPage] && Object.keys(data).length > 0) {
          setSelectedPage(Object.keys(data)[0]);
        }
      })
      .catch(() => {});
  }, [currentId]);

  const sections = pages[selectedPage] ?? [];
  const enabled = sections.filter((s) => s.enabled);
  const pageKeys = Object.keys(pages);

  const setSectionsForPage = (updater: (list: HomeSection[]) => HomeSection[]) =>
    setPages((prev) => ({
      ...prev,
      [selectedPage]: updater(prev[selectedPage] ?? []),
    }));

  const toggle = (i: number) =>
    setSectionsForPage((list) =>
      list.map((s, idx) => (idx === i ? { ...s, enabled: !s.enabled } : s))
    );

  const move = (i: number, dir: -1 | 1) =>
    setSectionsForPage((list) => {
      const next = [...list];
      const t = i + dir;
      if (t < 0 || t >= next.length) return list;
      [next[i], next[t]] = [next[t], next[i]];
      return next;
    });

  const addSection = (key: string) => {
    const meta = ALL_SECTIONS[key];
    if (!meta) return;
    setSectionsForPage((list) => [...list, { key, label: meta.label, enabled: true }]);
  };

  const removeSection = (i: number) =>
    setSectionsForPage((list) => list.filter((_, idx) => idx !== i));

  const setCardVariant = (i: number, variant: string) =>
    setSectionsForPage((list) =>
      list.map((s, idx) => (idx === i ? { ...s, cardVariant: variant === '_none' ? undefined : variant } : s))
    );

  const availableSections = Object.keys(ALL_SECTIONS).filter(
    (key) => !sections.some((s) => s.key === key)
  );

  const publish = async () => {
    if (!currentId) return;
    await api.updatePage(currentId, selectedPage, sections);
  };

  const handleAddPage = async () => {
    if (!currentId || !newPageKey) return;
    setLoading(true);
    try {
      // Add empty sections array for the new page
      const updatedPages = { ...pages, [newPageKey]: [] };
      await api.updateAllPages(currentId, updatedPages);
      setPages(updatedPages);
      setSelectedPage(newPageKey);
      setAddDialogOpen(false);
      setNewPageKey('');
    } catch (error) {
      console.error('Failed to add page:', error);
      alert('Could not add page. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Which pages are not yet added
  const availablePages = ALL_PAGE_KEYS.filter((key) => !pageKeys.includes(key));

  return (
    <Layout title="Pages" breadcrumb="Pages" searchPlaceholder="Search sections...">
      <div className="mx-auto max-w-5xl space-y-6 pb-4">
        <PageHero
          title="Pages"
          subtitle={`Add, remove and reorder the sections on each page${current ? ` for ${current.name}` : ''}`}
          status={{ label: `${enabled.length} of ${sections.length} on`, tone: 'muted' }}
        />

        {/* Platform toggle: Mobile | Web */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPlatform('mobile')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              platform === 'mobile'
                ? 'bg-primary text-white shadow-sm'
                : 'border border-gray-200 bg-white text-[#1E2D4A] hover:bg-gray-50'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </button>
          <button
            type="button"
            onClick={() => setPlatform('web')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              platform === 'web'
                ? 'bg-primary text-white shadow-sm'
                : 'border border-gray-200 bg-white text-[#1E2D4A] hover:bg-gray-50'
            }`}
          >
            <Monitor className="h-4 w-4" />
            Web
          </button>
        </div>

        {/* Page selector tabs + Add button */}
        <div className="flex gap-2 flex-wrap">
          {pageKeys.map((key) => {
            const active = key === selectedPage;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPage(key)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-[#1E2D4A] hover:bg-gray-50'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} screen
              </button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddDialogOpen(true)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Page
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Section list */}
          <SectionCard
            icon={Smartphone}
            title={`${selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)} sections`}
            description="Toggle a section off to remove it, or use the arrows to reorder. Saving publishes to the app."
          >
            <div className="space-y-2">
              {sections.map((s, i) => {
                const meta = ALL_SECTIONS[s.key];
                const variants = meta?.allowedVariants;
                return (
                  <div
                    key={s.key}
                    className={`rounded-xl border p-3 transition-colors ${
                      s.enabled
                        ? 'border-gray-100 bg-white'
                        : 'border-dashed border-gray-200 bg-gray-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${s.enabled ? 'text-[#1E2D4A]' : 'text-muted-foreground'}`}>
                          {s.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{s.key}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" disabled={i === 0} onClick={() => move(i, -1)}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" disabled={i === sections.length - 1} onClick={() => move(i, 1)}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeSection(i)} title="Remove section">
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                      <Switch checked={s.enabled} onCheckedChange={() => toggle(i)} />
                    </div>
                    {variants && variants.length > 0 && (
                      <div className="mt-2 ml-10 flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">Card style:</span>
                        <Select
                          value={s.cardVariant ?? '_none'}
                          onValueChange={(v) => setCardVariant(i, v)}
                        >
                          <SelectTrigger className="h-7 text-xs w-[160px]">
                            <SelectValue placeholder="Default" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_none">Default</SelectItem>
                            {variants.map((v) => (
                              <SelectItem key={v} value={v}>
                                {CARD_VARIANT_LABELS[v] ?? v}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                );
              })}
              {sections.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No sections — add sections using the button below.
                </p>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full gap-1"
                onClick={() => setAddSectionDialogOpen(true)}
                disabled={availableSections.length === 0}
              >
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>
          </SectionCard>

          {/* Live preview — real app in iframe */}
          <div className="lg:sticky lg:top-4 self-start">
            <div className="mb-2 flex items-center justify-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Live preview · {platform === 'mobile' ? 'Mobile' : 'Web'}
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="text-muted-foreground hover:text-[#1E2D4A] transition-colors"
                title="Reload preview"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
            {platform === 'mobile' ? (
              // Mobile: phone frame at 390px width (iPhone 14 Pro — most popular)
              <div
                className="mx-auto rounded-[2rem] border-[6px] border-[#1E2D4A] bg-gray-50 shadow-lg"
                style={{ width: 390, height: 700, overflow: 'hidden' }}
              >
                <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
                  <span className="text-sm font-bold">{current?.name ?? 'Restaurant'}</span>
                  <span className="text-[10px] opacity-80">
                    {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
                  </span>
                </div>
                <iframe
                  key={`mobile-${reloadKey}`}
                  src={PREVIEW_URL.mobile}
                  title="Mobile preview"
                  className="border-0 w-full"
                  scrolling="yes"
                  style={{ height: 'calc(100% - 44px)' }}
                />
              </div>
            ) : (
              // Web: full-width desktop browser frame
              <div className="w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-lg">
                <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-gray-500 border border-gray-200">
                    {PREVIEW_URL.web}
                  </div>
                </div>
                <iframe
                  key={`web-${reloadKey}`}
                  src={PREVIEW_URL.web}
                  title="Web preview"
                  className="border-0 w-full"
                  scrolling="yes"
                  style={{ height: 'calc(100vh - 200px)', minHeight: 500 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Publish bar */}
        <div className="sticky bottom-0 flex items-center justify-between rounded-2xl bg-[#1E2D4A] px-6 py-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            {platform === 'mobile' ? (
              <Smartphone className="h-5 w-5 text-slate-300" />
            ) : (
              <Monitor className="h-5 w-5 text-slate-300" />
            )}
            <div>
              <p className="font-semibold">Publish {selectedPage} layout</p>
              <p className="text-sm text-slate-300">The {platform} app reads this the next time it launches</p>
            </div>
          </div>
          <Button onClick={() => setConfirmOpen(true)} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <PublishDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={`Publish ${selectedPage} layout?`}
          description={`The ${platform} ${selectedPage} screen will use this section layout the next time it launches.`}
          successTitle="Layout published"
          successText={`The ${platform} ${selectedPage} layout has been updated.`}
          onConfirm={publish}
        />

        {/* Add Section Dialog */}
        <Dialog open={addSectionDialogOpen} onOpenChange={setAddSectionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a section</DialogTitle>
              <DialogDescription>
                Choose a section to add to the {selectedPage} page.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={newSectionKey} onValueChange={setNewSectionKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSections.map((key) => (
                      <SelectItem key={key} value={key}>
                        {ALL_SECTIONS[key]?.label ?? key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableSections.length === 0 && (
                  <p className="text-sm text-muted-foreground">All sections have been added to this page.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddSectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  addSection(newSectionKey);
                  setNewSectionKey('');
                  setAddSectionDialogOpen(false);
                }}
                disabled={!newSectionKey}
              >
                Add Section
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Page Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new page</DialogTitle>
              <DialogDescription>
                Choose a page to add to the layout editor. The page will appear as a new tab.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Page name</Label>
                <Select value={newPageKey} onValueChange={setNewPageKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availablePages.length === 0 && (
                  <p className="text-sm text-muted-foreground">All pages have been added.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPage} disabled={!newPageKey || loading}>
                {loading ? 'Adding...' : 'Add Page'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};