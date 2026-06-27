// apps/mobile/src/components/home/cards/MenuItemCard.tsx
import React from 'react';
import { CardVariant } from '../cardVariants';
import { OverlayPriceCard } from './OverlayPriceCard';
import { ListRowCard } from './ListRowCard';
import { QtyRowCard } from './QtyRowCard';
import { PlainGridCard } from './PlainGridCard';
import { FeatureCard } from './FeatureCard';

interface CardProps {
  item: any;
  variant: CardVariant;
  onPress: (id: string) => void;
  onAdd?: (id: string, qty?: number) => void;
}

export const MenuItemCard: React.FC<CardProps> = ({ variant, ...props }) => {
  switch (variant) {
    case 'listRow':
      return <ListRowCard {...props} />;
    case 'qtyRow':
      return <QtyRowCard {...props} />;
    case 'plainGrid':
      return <PlainGridCard {...props} />;
    case 'feature':
      return <FeatureCard {...props} />;
    case 'overlayPrice':
    default:
      return <OverlayPriceCard {...props} />;
  }
};