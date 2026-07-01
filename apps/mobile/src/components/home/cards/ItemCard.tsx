import React from 'react';
import { ListRowCard } from './ListRowCard';
import { OverlayPriceCard } from './OverlayPriceCard';
import { QtyRowCard } from './QtyRowCard';
import { PlainGridCard } from './PlainGridCard';
import { FeatureCard } from './FeatureCard';
import { VideoCard } from './VideoCard';
import { SlidesCard } from './SlidesCard';

interface ItemCardProps {
  variant: string;
  item: any;
  onPress: (id: string) => void;
  onAdd?: (id: string, qty?: number) => void;
}

const CARD_MAP: Record<string, React.FC<{ item: any; onPress: (id: string) => void; onAdd?: (id: string, qty?: number) => void }>> = {
  listRow: ListRowCard,
  overlayPrice: OverlayPriceCard,
  qtyRow: QtyRowCard,
  plainGrid: PlainGridCard,
  feature: FeatureCard,
  video: VideoCard,
  slides: SlidesCard,
};

export const ItemCard: React.FC<ItemCardProps> = ({ variant, item, onPress, onAdd }) => {
  const Card = CARD_MAP[variant] ?? ListRowCard;
  return <Card item={item} onPress={onPress} onAdd={onAdd} />;
};
