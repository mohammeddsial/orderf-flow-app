import React, { useEffect, useState } from 'react';
import { api, HomeSection } from '../lib/api';
import { useRestaurant } from '../context/RestaurantContext';
import { Layout } from '../components/Layout';
import { PageHero, SectionCard } from '../components/admin-ui';
import { PublishDialog } from '../components/PublishDialog';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Smartphone, ArrowUp, ArrowDown, Save, Plus } from 'lucide-react';
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

export const HomeLayout = () => {
  const { currentId, current } = useRestaurant();
  const [pages, setPages] = useState<Record<string, HomeSection[]>>({});
  const [selectedPage, setSelectedPage] = useState('home');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPageKey, setNewPageKey] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
    <Layout title="Mobile Pages" breadcrumb="Mobile Pages" searchPlaceholder="Search sections...">
      <div className="mx-auto max-w-5xl space-y-6 pb-4">
        <PageHero
          title="Mobile Pages"
          subtitle={`Add, remove and reorder the sections on each mobile page${current ? ` for ${current.name}` : ''}`}
          status={{ label: `${enabled.length} of ${sections.length} on`, tone: 'muted' }}
        />

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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          {/* Section list */}
          <SectionCard
            icon={Smartphone}
            title={`${selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)} sections`}
            description="Toggle a section off to remove it, or use the arrows to reorder. Saving publishes to the app."
          >
            <div className="space-y-2">
              {sections.map((s, i) => (
                <div
                  key={s.key}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                    s.enabled
                      ? 'border-gray-100 bg-white'
                      : 'border-dashed border-gray-200 bg-gray-50/60'
                  }`}
                >
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
                  <Switch checked={s.enabled} onCheckedChange={() => toggle(i)} />
                </div>
              ))}
              {sections.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No sections — start the backend on :4000 or add sections manually.
                </p>
              ) : null}
            </div>
          </SectionCard>

          {/* Live phone preview */}
          <div className="lg:sticky lg:top-4 self-start">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Live preview
            </p>
            <div
              className="mx-auto w-[260px] overflow-hidden rounded-[2rem] border-[6px] border-[#1E2D4A] bg-gray-50 shadow-lg"
              style={{ height: 520 }}
            >
              <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
                <span className="text-sm font-bold">{current?.name ?? 'Restaurant'}</span>
                <span className="text-[10px] opacity-80">
                  {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
                </span>
              </div>
              <div className="space-y-2 overflow-y-auto p-3" style={{ height: 'calc(100% - 44px)' }}>
                {enabled.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-end rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] font-medium text-[#1E2D4A]"
                    style={{ height: s.key === 'hero' ? 80 : undefined }}
                  >
                    {s.label}
                  </div>
                ))}
                {enabled.length === 0 ? (
                  <p className="pt-8 text-center text-[11px] text-muted-foreground">All sections hidden</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Publish bar */}
        <div className="sticky bottom-0 flex items-center justify-between rounded-2xl bg-[#1E2D4A] px-6 py-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-slate-300" />
            <div>
              <p className="font-semibold">Publish {selectedPage} layout</p>
              <p className="text-sm text-slate-300">The app reads this the next time it launches</p>
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
          description={`The mobile ${selectedPage} screen will use this section layout the next time it launches.`}
          successTitle="Layout published"
          successText={`The mobile ${selectedPage} layout has been updated.`}
          onConfirm={publish}
        />

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