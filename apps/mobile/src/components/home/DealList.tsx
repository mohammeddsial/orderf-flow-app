// apps/mobile/src/components/home/DealList.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme';
import { EngineId } from './engineStyle';
import { Icon } from '../shared/Icon';

interface DealItem {
  id: string;
  title: string;
  subtitle?: string;
}

const DEMO_DEALS: DealItem[] = [
  { id: 'd1', title: 'Free upgrades on pastry items' },
  { id: 'd2', title: 'Double points on midnight orders' },
];

export const DealList: React.FC = () => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  return (
    <View style={{ marginBottom: tokens.spacing.lg, paddingHorizontal: tokens.spacing.md }}>
      {DEMO_DEALS.map((deal, index) => (
        <Pressable
          key={deal.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: tokens.spacing.md,
            borderBottomWidth: index < DEMO_DEALS.length - 1 ? 1 : 0,
            borderBottomColor: tokens.colors.border,
            gap: tokens.spacing.sm,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#34C759',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="checkmark" size={16} color="#FFFFFF" />
          </View>
          <Text
            style={{
              flex: 1,
              color: tokens.colors.text,
              fontSize: tokens.typography.fontSizeMd,
              fontWeight: '500',
            }}
          >
            {deal.title}
          </Text>
          <Icon name="chevron-forward" size={18} color={tokens.colors.textDisabled} />
        </Pressable>
      ))}
    </View>
  );
};
