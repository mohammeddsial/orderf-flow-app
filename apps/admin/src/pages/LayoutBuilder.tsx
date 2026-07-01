import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api, HomeSection } from '../lib/api';
import { useRestaurant } from '../context/RestaurantContext';
import { Layout } from '../components/Layout';
import { PageHero, SectionCard } from '../components/admin-ui';
import { PublishDialog } from '../components/PublishDialog';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import {
  Smartphone,
  Save,
  Plus,
  GripVertical,
  Trash2,
  Eye,
  EyeOff,
  LayoutGrid,
  Pencil,
  Monitor,
  RefreshCw,
} from 'lucide-react';
import { SECTION_CATALOG } from '../lib/sectionCatalog';

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

type DragData = {
  source: 'sidebar' | 'canvas';
  key?: string;
  label?: string;
  index?: number;
};

function SortableSection({
  section,
  index,
  onToggle,
  onDelete,
  onRename,
}: {
  section: HomeSection;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
  onRename: (label: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `canvas-${section.key}`,
    data: { source: 'canvas', index } as DragData,
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(section.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== section.label) {
      onRename(trimmed);
    } else {
      setDraft(section.label);
    }
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-xl border p-3 transition-colors ${
        section.enabled
          ? 'border-gray-200 bg-white shadow-sm'
          : 'border-dashed border-gray-200 bg-gray-50/60'
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
        {index + 1}
      </span>

      <div className="flex-1">
        {editing ? (
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') {
                setDraft(section.label);
                setEditing(false);
              }
            }}
            className="h-7 py-0 text-sm"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-1.5">
            <p
              className={`text-sm font-medium ${
                section.enabled ? 'text-[#0f0f0f]' : 'text-muted-foreground'
              }`}
            >
              {section.label}
            </p>
            <button
              type="button"
              onClick={() => {
                setDraft(section.label);
                setEditing(true);
              }}
              className="opacity-0 transition-opacity group-hover:opacity-100 text-gray-400 hover:text-primary"
              title="Edit label"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
        )}
        <p className="text-[11px] text-muted-foreground">{section.key}</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        title={section.enabled ? 'Hide section' : 'Show section'}
      >
        {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
        title="Remove section"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="ml-1">
        <Switch checked={section.enabled} onCheckedChange={onToggle} />
      </div>
    </div>
  );
}

function SidebarSectionCard({ section }: { section: { key: string; label: string } }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${section.key}`,
    data: { source: 'sidebar', key: section.key, label: section.label } as DragData,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={`w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-[#0f0f0f] shadow-sm transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98] ${
        isDragging ? 'opacity-30' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      <span className="flex items-center gap-2">
        <Plus className="h-3.5 w-3.5 text-primary" />
        {section.label}
      </span>
    </button>
  );
}

function DropZone({
  isEmpty,
  children,
}: {
  isEmpty: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop-zone' });

  return (
    <div ref={setNodeRef} className="min-h-[200px] space-y-2">
      {isEmpty && (
        <div
          className={`flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
            isOver
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 bg-gray-50/50'
          }`}
        >
          <LayoutGrid className="mb-2 h-8 w-8 text-gray-300" />
          <p className="text-sm text-muted-foreground">
            {isOver ? 'Drop to add section' : 'Drag sections here from the left'}
          </p>
        </div>
      )}
      {children}
    </div>
  );
}

function MobilePreview({
  restaurantName,
  pageLabel,
  currentId,
}: {
  restaurantName: string;
  pageLabel: string;
  currentId: string | null;
}) {
  const [iframeKey, setIframeKey] = useState(0);
  const mobileUrl = currentId
    ? `http://localhost:8081?tenant=${currentId}`
    : 'http://localhost:8081';

  return (
    <div className="lg:sticky lg:top-4 self-start">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Mobile preview
        </p>
        <button
          type="button"
          onClick={() => setIframeKey((k) => k + 1)}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary"
          title="Refresh preview"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
      <div
        className="mx-auto w-[280px] overflow-hidden rounded-[2.5rem] border-[8px] border-[#4a0929] bg-white shadow-xl"
        style={{ height: 560 }}
      >
        <div className="flex items-center justify-between bg-primary px-4 py-2 text-white">
          <span className="text-xs font-bold truncate">{restaurantName}</span>
          <span className="text-[10px] opacity-80">{pageLabel}</span>
        </div>
        <iframe
          key={iframeKey}
          src={mobileUrl}
          className="w-full border-0"
          style={{ height: 'calc(100% - 36px)' }}
          title="Mobile preview"
        />
      </div>
    </div>
  );
}

function WebPreview({ currentId }: { currentId: string | null }) {
  const [iframeKey, setIframeKey] = useState(0);

  const webUrl = currentId
    ? `http://localhost:8081?tenant=${currentId}`
    : 'http://localhost:8081';

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Web preview
        </p>
        <button
          type="button"
          onClick={() => setIframeKey((k) => k + 1)}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary"
          title="Refresh preview"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>
      <div
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        style={{ height: 600 }}
      >
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
          <Monitor className="h-3.5 w-3.5 text-gray-400" />
          <span className="truncate text-[11px] text-muted-foreground">{webUrl}</span>
        </div>
        <iframe
          key={iframeKey}
          src={webUrl}
          className="w-full border-0"
          style={{ height: 'calc(100% - 37px)' }}
          title="Web preview"
        />
      </div>
    </div>
  );
}

export const LayoutBuilder = () => {
  const { currentId, current } = useRestaurant();
  const [pages, setPages] = useState<Record<string, HomeSection[]>>({});
  const [selectedPage, setSelectedPage] = useState('home');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeDrag, setActiveDrag] = useState<{ label: string; source: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!currentId) return;
    api
      .getPages(currentId)
      .then((data) => {
        setPages(data);
        if (!data[selectedPage] && Object.keys(data).length > 0) {
          setSelectedPage(Object.keys(data)[0]);
        }
      })
      .catch(() => {});
  }, [currentId]);

  const sections = pages[selectedPage] ?? [];
  const pageKeys = Object.keys(pages);
  const catalog = SECTION_CATALOG[selectedPage] ?? SECTION_CATALOG.home;

  const availableSections = useMemo(
    () => catalog.filter((c) => !sections.some((s) => s.key === c.key)),
    [catalog, sections]
  );

  const setSections = (updater: (list: HomeSection[]) => HomeSection[]) => {
    setPages((prev) => ({
      ...prev,
      [selectedPage]: updater(prev[selectedPage] ?? []),
    }));
    setDirty(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as DragData | undefined;
    if (data?.source === 'sidebar') {
      setActiveDrag({ label: data.label ?? '', source: 'sidebar' });
    } else if (data?.source === 'canvas') {
      const sec = sections[data.index ?? 0];
      setActiveDrag({ label: sec?.label ?? '', source: 'canvas' });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDrag(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as DragData | undefined;
    const overData = over.data.current as DragData | undefined;

    if (activeData?.source === 'sidebar' && activeData.key && activeData.label) {
      const overIndex =
        overData?.source === 'canvas' ? overData.index ?? 0 : sections.length;

      setSections((list) => {
        const newItem: HomeSection = {
          key: activeData.key!,
          label: activeData.label!,
          enabled: true,
        };
        const next = [...list];
        next.splice(overIndex, 0, newItem);
        return next;
      });
      return;
    }

    if (activeData?.source === 'canvas' && overData?.source === 'canvas') {
      const from = activeData.index ?? 0;
      const to = overData.index ?? 0;
      if (from === to) return;

      setSections((list) => arrayMove(list, from, to));
    }
  };

  const toggleSection = (i: number) =>
    setSections((list) =>
      list.map((s, idx) => (idx === i ? { ...s, enabled: !s.enabled } : s))
    );

  const deleteSection = (i: number) =>
    setSections((list) => list.filter((_, idx) => idx !== i));

  const renameSection = (i: number, label: string) =>
    setSections((list) =>
      list.map((s, idx) => (idx === i ? { ...s, label } : s))
    );

  const addSectionByClick = (key: string, label: string) => {
    setSections((list) => [...list, { key, label, enabled: true }]);
  };

  const publish = async () => {
    if (!currentId) return;
    await api.updatePage(currentId, selectedPage, sections);
    setDirty(false);
  };

  const pageLabel = selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1);
  const enabledCount = sections.filter((s) => s.enabled).length;

  const sortableIds = sections.map((s) => `canvas-${s.key}`);

  return (
    <Layout title="Layout Builder" breadcrumb="Layout Builder" searchPlaceholder="Search sections...">
      <div className="mx-auto max-w-[1440px] space-y-6 pb-4">
        <PageHero
          title="Layout Builder"
          subtitle={`Drag and drop sections to build the ${pageLabel} page${current ? ` for ${current.name}` : ''}`}
          status={{
            label: `${enabledCount} of ${sections.length} on`,
            tone: 'muted',
          }}
        />

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
                    : 'border border-gray-200 bg-white text-[#0f0f0f] hover:bg-gray-50'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            );
          })}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr_260px]">
            <SectionCard
              icon={LayoutGrid}
              title="Available"
              description="Drag onto canvas or click +add"
            >
              <div className="space-y-2">
                {availableSections.map((s) => (
                  <div key={s.key} className="space-y-1">
                    <SidebarSectionCard section={s} />
                    <button
                      type="button"
                      onClick={() => addSectionByClick(s.key, s.label)}
                      className="w-full text-center text-[11px] text-muted-foreground hover:text-primary"
                    >
                      + add
                    </button>
                  </div>
                ))}
                {availableSections.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    All sections added
                  </p>
                )}
              </div>
            </SectionCard>

            <SectionCard
              icon={Smartphone}
              title={`${pageLabel} sections`}
              description="Drag to reorder · Click pencil to edit label · Eye to toggle · Trash to remove"
            >
              <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                <DropZone isEmpty={sections.length === 0}>
                  {sections.map((s, i) => (
                    <SortableSection
                      key={`canvas-${s.key}`}
                      section={s}
                      index={i}
                      onToggle={() => toggleSection(i)}
                      onDelete={() => deleteSection(i)}
                      onRename={(label) => renameSection(i, label)}
                    />
                  ))}
                </DropZone>
              </SortableContext>
            </SectionCard>

            <div className="space-y-6">
              <MobilePreview
                restaurantName={current?.name ?? 'Restaurant'}
                pageLabel={pageLabel}
                currentId={currentId}
              />
            </div>
          </div>

          <WebPreview currentId={currentId} />

          <DragOverlay dropAnimation={{ duration: 200 }}>
            {activeDrag ? (
              <div className="rounded-xl border border-primary bg-white px-3 py-2.5 text-sm font-medium text-[#0f0f0f] shadow-xl">
                {activeDrag.source === 'sidebar' && <Plus className="mr-2 inline h-3.5 w-3.5 text-primary" />}
                {activeDrag.label}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <div className="sticky bottom-0 flex items-center justify-between rounded-2xl bg-[#4a0929] px-6 py-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-pink-light" />
            <div>
              <p className="font-semibold">
                Publish {pageLabel} layout
                {dirty && <span className="ml-2 text-yellow">● unsaved</span>}
              </p>
              <p className="text-sm text-pink-light">The app reads this the next time it launches</p>
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
          title={`Publish ${pageLabel} layout?`}
          description={`The mobile ${selectedPage} screen will use this section layout the next time it launches.`}
          successTitle="Layout published"
          successText={`The mobile ${selectedPage} layout has been updated.`}
          onConfirm={publish}
        />
      </div>
    </Layout>
  );
};
