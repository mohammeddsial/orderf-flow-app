import React, { useEffect, useState } from 'react';
import { api, HomeSection, mediaUrl } from '../lib/api';
import { useRestaurant } from '../context/RestaurantContext';
import { Layout } from '../components/Layout';
import { PageHero, SectionCard } from '../components/admin-ui';
import { PublishDialog } from '../components/PublishDialog';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Smartphone, ArrowUp, ArrowDown, Save, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { VARIANTS_BY_SECTION, CardVariant } from '../lib/cardVariants';
import { SECTION_CATALOG } from '../lib/sectionCatalog';

const VARIANT_LABELS: Record<CardVariant, string> = {
  listRow: 'List Row',
  overlayPrice: 'Price on Image',
  qtyRow: 'Qty Stepper',
  plainGrid: 'Grid',
  feature: 'Large Feature',
  restaurantCard: 'Restaurant Card',
  video: 'Hero Video',
  slides: 'Image Slides',
};

// Tiny visual mock of each card layout (so the picker shows the real shape).
const VariantPreview: React.FC<{ variant: CardVariant }> = ({ variant }) => {
  const img = 'bg-gradient-to-br from-orange-300 to-orange-500';
  const line = 'rounded bg-gray-300';
  const pill = 'rounded-full bg-primary';

  switch (variant) {
    case 'listRow':
      return (
        <div className="flex w-full items-center gap-1.5">
          <div className={`${img} h-9 w-9 flex-shrink-0 rounded`} />
          <div className="flex-1 space-y-1">
            <div className={`${line} h-1.5 w-3/4`} />
            <div className={`${line} h-1.5 w-1/2`} />
            <div className={`${pill} h-1.5 w-1/3`} />
          </div>
        </div>
      );
    case 'qtyRow':
      return (
        <div className="flex w-full items-center gap-1.5">
          <div className={`${img} h-9 w-9 flex-shrink-0 rounded`} />
          <div className="flex-1 space-y-1">
            <div className={`${line} h-1.5 w-3/4`} />
            <div className={`${line} h-1.5 w-1/3`} />
          </div>
          <div className="flex items-center gap-0.5">
            <span className="h-3 w-3 rounded-full border border-gray-300" />
            <span className="text-[8px] text-gray-500">1</span>
            <span className="h-3 w-3 rounded-full bg-primary" />
          </div>
        </div>
      );
    case 'overlayPrice':
      return (
        <div className="mx-auto w-12 overflow-hidden rounded border border-gray-200">
          <div className={`relative h-8 w-full ${img}`}>
            <span className="absolute -bottom-1 left-1 h-2 w-5 rounded-full bg-primary" />
          </div>
          <div className="space-y-1 p-1 pt-1.5">
            <div className={`${line} h-1.5 w-3/4`} />
          </div>
        </div>
      );
    case 'plainGrid':
      return (
        <div className="mx-auto w-12 overflow-hidden rounded border border-gray-200">
          <div className={`h-7 w-full ${img}`} />
          <div className="space-y-1 p-1">
            <div className={`${line} h-1.5 w-3/4`} />
            <div className={`${pill} h-1.5 w-1/2`} />
          </div>
        </div>
      );
    case 'feature':
      return (
        <div className="w-full overflow-hidden rounded border border-gray-200">
          <div className={`h-7 w-full ${img}`} />
          <div className="space-y-1 p-1.5">
            <div className={`${line} h-1.5 w-3/4`} />
            <div className="flex items-center justify-between">
              <div className={`${line} h-1.5 w-1/3`} />
              <div className={`${pill} h-2 w-6`} />
            </div>
          </div>
        </div>
      );
    case 'restaurantCard':
      return (
        <div className="w-full overflow-hidden rounded border border-gray-200 shadow-sm">
          <div className={`relative h-7 w-full ${img}`}>
            <span className="absolute left-1 top-1 h-2 w-7 rounded-full bg-primary" />
          </div>
          <div className="space-y-1 p-1.5">
            <div className="flex items-center justify-between">
              <div className={`${line} h-1.5 w-1/2`} />
              <div className={`${line} h-1.5 w-1/5`} />
            </div>
            <div className="flex gap-1">
              <span className="h-2 w-5 rounded-full bg-gray-200" />
              <span className="h-2 w-5 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      );
    case 'video':
      return (
        <div className={`relative h-9 w-full overflow-hidden rounded ${img}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[8px] text-primary">▶</span>
          </div>
        </div>
      );
    case 'slides':
      return (
        <div className="relative h-9 w-full overflow-hidden rounded">
          <div className={`absolute inset-0 ${img}`} />
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            <span className="h-1 w-3 rounded-full bg-white" />
            <span className="h-1 w-1 rounded-full bg-white/60" />
            <span className="h-1 w-1 rounded-full bg-white/60" />
          </div>
        </div>
      );
    default:
      return <span className="text-xs">{variant}</span>;
  }
};

export const HomeLayout = () => {
  const { currentId, current } = useRestaurant();
  const [pages, setPages] = useState<Record<string, HomeSection[]>>({});
  const [selectedPage, setSelectedPage] = useState('home');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<{ key: string; label: string } | null>(null);

  useEffect(() => {
    if (!currentId) return;
    api.getPages(currentId).then(setPages).catch(() => {});
  }, [currentId]);

  const sections = pages[selectedPage] ?? [];
  const enabled = sections.filter((s) => s.enabled);
  const selectedLabel = selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1);

  const setSectionsForPage = (updater: (list: HomeSection[]) => HomeSection[]) =>
    setPages((prev) => ({ ...prev, [selectedPage]: updater(prev[selectedPage] ?? []) }));

  const toggle = (i: number) =>
    setSectionsForPage((list) => list.map((s, idx) => (idx === i ? { ...s, enabled: !s.enabled } : s)));

  const move = (i: number, dir: -1 | 1) =>
    setSectionsForPage((list) => {
      const next = [...list];
      const t = i + dir;
      if (t < 0 || t >= next.length) return list;
      [next[i], next[t]] = [next[t], next[i]];
      return next;
    });

  const setVariant = (i: number, variant: CardVariant) =>
    setSectionsForPage((list) => list.map((s, idx) => (idx === i ? { ...s, variant } : s)));

  const setHeading = (i: number, heading: string) =>
    setSectionsForPage((list) => list.map((s, idx) => (idx === i ? { ...s, heading } : s)));

  const setVideo = (i: number, url: string) =>
    setSectionsForPage((list) =>
      list.map((s, idx) => (idx === i ? { ...s, media: { ...(s.media || {}), videoUrl: url } } : s))
    );

  const setSlide = (i: number, slot: number, url: string) =>
    setSectionsForPage((list) =>
      list.map((s, idx) => {
        if (idx !== i) return s;
        const slides = [...(s.media?.slides || [])];
        slides[slot] = url;
        return { ...s, media: { ...(s.media || {}), slides } };
      })
    );

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const onVideoFile = async (i: number, file?: File) => {
    if (!file) return;
    const { url } = await api.uploadMedia(file.name, await readAsDataUrl(file));
    setVideo(i, url);
  };

  const onSlideFile = async (i: number, slot: number, file?: File) => {
    if (!file) return;
    const { url } = await api.uploadMedia(file.name, await readAsDataUrl(file));
    setSlide(i, slot, url);
  };

  const setContent = (i: number, patch: Record<string, unknown>) =>
    setSectionsForPage((list) => list.map((s, idx) => (idx === i ? { ...s, content: { ...(s.content || {}), ...patch } } : s)));

  const onContentImage = async (i: number, file?: File) => {
    if (!file) return;
    const { url } = await api.uploadMedia(file.name, await readAsDataUrl(file));
    setContent(i, { imageUrl: url });
  };

  // Sections from the catalog for this page that aren't on the page yet.
  const available = (SECTION_CATALOG[selectedPage] ?? []).filter(
    (c) => !sections.some((s) => s.key === c.key)
  );

  const addSection = (c: { key: string; label: string }) => {
    setSectionsForPage((list) =>
      list.some((s) => s.key === c.key) ? list : [...list, { key: c.key, label: c.label, enabled: true }]
    );
    setAddOpen(false);
  };

  // Permanently remove a section from the page (different from the hide/show switch).
  const removeSection = (i: number) => {
    setSectionsForPage((list) => list.filter((_, idx) => idx !== i));
    setExpandedKey(null);
  };

  const removeByKey = (key: string) => {
    setSectionsForPage((list) => list.filter((s) => s.key !== key));
    setExpandedKey(null);
  };

  const publish = async () => {
    if (!currentId) return;
    const updatedPages = { ...pages, [selectedPage]: sections };
    await api.updateAllPages(currentId, updatedPages);
  };

  // Pages available for selection (hardcoded for now)
  const pageKeys = ['home', 'menu'];

  return (
    <Layout title="Mobile Pages" breadcrumb="Mobile Pages" searchPlaceholder="Search sections...">
      <div className="mx-auto max-w-5xl space-y-6 pb-4">
        <PageHero
          title="Mobile Pages"
          subtitle={`Add, remove and reorder the sections on each mobile page${current ? ` for ${current.name}` : ''}`}
          status={{ label: `${enabled.length} of ${sections.length} on`, tone: 'muted' }}
        />

        {/* Page selector tabs */}
        <div className="flex gap-2">
          {pageKeys.map((key) => {
            const active = key === selectedPage;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPage(key)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 bg-white text-[#1E2D4A] hover:bg-gray-50'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} screen
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          {/* Section list */}
          <SectionCard
            icon={Smartphone}
            title={`${selectedLabel} sections`}
            description="Click a section to change its card design. Toggle off to hide it, or reorder with the arrows."
          >
            {/* Add Section */}
            <div className="mb-3">
              <Button variant="outline" size="sm" onClick={() => setAddOpen((o) => !o)} className="gap-1">
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
              {addOpen ? (
                <div className="mt-2 flex flex-wrap gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-3">
                  {available.length === 0 ? (
                    <span className="text-xs text-muted-foreground">All available sections are already added.</span>
                  ) : (
                    available.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => addSection(c)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-[#1E2D4A] transition-colors hover:bg-orange-50 hover:text-primary"
                      >
                        + {c.label}
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              {sections.map((s, i) => {
                const allowed = VARIANTS_BY_SECTION[s.key] || [];
                const isExpanded = expandedKey === s.key;
                return (
                  <div key={s.key} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div
                      className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${
                        s.enabled ? 'bg-white' : 'bg-gray-50/60'
                      }`}
                      onClick={() => setExpandedKey(isExpanded ? null : s.key)}
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
                        <Button variant="ghost" size="icon" disabled={i === 0} onClick={(e) => { e.stopPropagation(); move(i, -1); }}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" disabled={i === sections.length - 1} onClick={(e) => { e.stopPropagation(); move(i, 1); }}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Remove section" onClick={(e) => { e.stopPropagation(); setRemoveTarget({ key: s.key, label: s.label }); }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <Switch checked={s.enabled} onCheckedChange={() => toggle(i)} onClick={(e) => e.stopPropagation()} />
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>

                    {/* Expanded editor: heading + card design */}
                    {isExpanded && (
                      <div className="space-y-3 border-t border-gray-100 bg-gray-50/60 px-3 py-3">
                        <div>
                          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Heading (shown on the app)</p>
                          <input
                            value={s.heading ?? ''}
                            placeholder={s.label}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setHeading(i, e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1E2D4A] outline-none focus:border-primary"
                          />
                          <p className="mt-1 text-[11px] text-muted-foreground">Leave blank to use the default heading.</p>
                        </div>

                        {allowed.length > 0 && (
                          <div>
                            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.key === 'hero' ? 'Hero Type' : 'Card Design'}</p>
                            <div className="flex flex-wrap gap-2">
                              {allowed.map((variant) => (
                                <button
                                  key={variant}
                                  onClick={() => setVariant(i, variant)}
                                  className={`flex w-[110px] flex-col items-center gap-1.5 rounded-xl border p-2 transition-colors ${
                                    s.variant === variant
                                      ? 'border-primary bg-orange-50 ring-1 ring-primary'
                                      : 'border-gray-200 bg-white hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex h-14 w-full items-center justify-center px-1">
                                    <VariantPreview variant={variant} />
                                  </div>
                                  <span className="text-[11px] font-medium text-[#1E2D4A]">{VARIANT_LABELS[variant]}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Hero media uploads: a video file, or three slide images */}
                        {s.key === 'hero' && s.variant !== 'slides' && (
                          <div>
                            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Hero Video</p>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1E2D4A] hover:bg-gray-50">
                              Browse video…
                              <input type="file" accept="video/*" className="hidden" onClick={(e) => e.stopPropagation()} onChange={(e) => onVideoFile(i, e.target.files?.[0])} />
                            </label>
                            {s.media?.videoUrl ? (
                              <video src={mediaUrl(s.media.videoUrl)} className="mt-2 h-28 w-full rounded-lg bg-black object-cover" muted controls />
                            ) : (
                              <p className="mt-1 text-[11px] text-muted-foreground">No video uploaded — the default video is used.</p>
                            )}
                          </div>
                        )}

                        {s.key === 'flashDeal' && (
                          <div>
                            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Flash Deal Content</p>
                            <div className="grid grid-cols-2 gap-2">
                              <label className="col-span-2 block">
                                <span className="text-[11px] text-muted-foreground">Title</span>
                                <input value={s.content?.title ?? ''} placeholder="25% OFF ALL BURGERS" onClick={(e) => e.stopPropagation()} onChange={(e) => setContent(i, { title: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-[#1E2D4A] outline-none focus:border-primary" />
                              </label>
                              <label className="col-span-2 block">
                                <span className="text-[11px] text-muted-foreground">Subtitle</span>
                                <input value={s.content?.subtitle ?? ''} placeholder="Limited time — claim before it ends" onClick={(e) => e.stopPropagation()} onChange={(e) => setContent(i, { subtitle: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-[#1E2D4A] outline-none focus:border-primary" />
                              </label>
                              <label className="block">
                                <span className="text-[11px] text-muted-foreground">Background color</span>
                                <input type="color" value={s.content?.color ?? '#ff8313'} onClick={(e) => e.stopPropagation()} onChange={(e) => setContent(i, { color: e.target.value })} className="h-9 w-full rounded-lg border border-gray-200 bg-white" />
                              </label>
                              <label className="block">
                                <span className="text-[11px] text-muted-foreground">Countdown (seconds)</span>
                                <input type="number" value={s.content?.durationSec ?? ''} placeholder="1800" onClick={(e) => e.stopPropagation()} onChange={(e) => setContent(i, { durationSec: e.target.value === '' ? undefined : Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-[#1E2D4A] outline-none focus:border-primary" />
                              </label>
                              <label className="col-span-2 flex h-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-white text-center text-[11px] text-muted-foreground hover:bg-gray-50">
                                {s.content?.imageUrl ? (
                                  <img src={mediaUrl(s.content.imageUrl)} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <span>+ Deal image</span>
                                )}
                                <input type="file" accept="image/*" className="hidden" onClick={(e) => e.stopPropagation()} onChange={(e) => onContentImage(i, e.target.files?.[0])} />
                              </label>
                            </div>
                          </div>
                        )}

                        {s.key === 'hero' && s.variant === 'slides' && (
                          <div>
                            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Slide Images (3)</p>
                            <div className="grid grid-cols-3 gap-2">
                              {[0, 1, 2].map((slot) => {
                                const url = s.media?.slides?.[slot];
                                return (
                                  <label key={slot} className="flex aspect-[3/4] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-white text-center text-[11px] text-muted-foreground hover:bg-gray-50">
                                    {url ? (
                                      <img src={mediaUrl(url)} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                      <span>+ Image {slot + 1}</span>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onClick={(e) => e.stopPropagation()} onChange={(e) => onSlideFile(i, slot, e.target.files?.[0])} />
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {sections.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No sections — start the backend on :4000.</p>
              ) : null}
            </div>
          </SectionCard>

          {/* Confirm-remove dialog (reuses the Save/Publish dialog) */}
          <PublishDialog
            open={!!removeTarget}
            onOpenChange={(o) => { if (!o) setRemoveTarget(null); }}
            title={removeTarget ? `Remove “${removeTarget.label}”?` : 'Remove section?'}
            description="This removes the section from this page. You can re-add it anytime from Add Section."
            confirmLabel="Remove"
            successTitle="Section removed"
            successText="Don’t forget to Save to publish the change."
            onConfirm={async () => {
              if (removeTarget) removeByKey(removeTarget.key);
            }}
          />

          {/* Live phone preview – keep as is */}
          <div className="lg:sticky lg:top-4 self-start">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live preview</p>
            <div className="mx-auto w-[260px] overflow-hidden rounded-[2rem] border-[6px] border-[#1E2D4A] bg-gray-50 shadow-lg" style={{ height: 520 }}>
              <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
                <span className="text-sm font-bold">{current?.name ?? 'Restaurant'}</span>
                <span className="text-[10px] opacity-80">{selectedLabel}</span>
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
              <p className="font-semibold">Publish {selectedLabel} layout</p>
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
          title={`Publish ${selectedLabel} layout?`}
          description={`The mobile ${selectedLabel} screen will use this section layout the next time it launches.`}
          successTitle="Layout published"
          successText={`The mobile ${selectedLabel} layout has been updated.`}
          onConfirm={publish}
        />
      </div>
    </Layout>
  );
};