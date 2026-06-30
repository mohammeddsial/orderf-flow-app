import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { type EngineId } from '../home/engineStyle';

type IconName = keyof typeof Ionicons.glyphMap;

const ICON_MAP: Record<string, IconName> = {
  // Profile / account
  settings: 'settings-outline',
  orders: 'receipt-outline',
  rewards: 'star-outline',
  addresses: 'location-outline',
  help: 'help-circle-outline',
  signout: 'log-out-outline',
  payments: 'card-outline',
  dietary: 'nutrition-outline',
  profile: 'person-outline',

  // Food / restaurant
  burger: 'fast-food-outline',
  cart: 'cart-outline',
  search: 'search-outline',
  gift: 'gift-outline',
  star: 'star-outline',

  // Status / order
  celebration: 'party-popper-outline',
  cooking: 'flame-outline',
  delivery: 'bicycle-outline',
  checkmark: 'checkmark-circle-outline',
  truck: 'car-outline',
  clock: 'time-outline',
  timer: 'timer-outline',
  fire: 'flame-outline',
  camera: 'camera-outline',
  mapPin: 'location-outline',
  store: 'storefront-outline',

  // Misc
  bell: 'notifications-outline',
  chart: 'bar-chart-outline',
  dollar: 'cash-outline',
  tag: 'pricetag-outline',
  upload: 'cloud-upload-outline',
  share: 'share-outline',
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color, style }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  const iconName = ICON_MAP[name] ?? 'ellipse-outline';
  const iconColor = color ?? tokens.colors.text;

  if (engine === 'BRUTALIST_MODERNIST') {
    return <Ionicons name={iconName} size={size} color={iconColor} style={[{ fontWeight: '900' }, style]} />;
  }

  if (engine === 'VIBRANT_STREET_TECH') {
    const filledName = (iconName.replace('-outline', '') as IconName);
    return <Ionicons name={filledName} size={size} color={iconColor} style={[{ textShadowColor: iconColor, textShadowRadius: 6 }, style]} />;
  }

  return <Ionicons name={iconName} size={size} color={iconColor} style={style} />;
};

export default Icon;
