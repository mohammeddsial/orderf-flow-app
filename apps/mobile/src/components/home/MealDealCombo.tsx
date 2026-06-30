// apps/mobile/src/components/home/MealDealCombo.tsx
import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { useTheme } from '../../theme';
import { EngineId, cardChrome, sectionTitleStyle } from './engineStyle';
import { store } from '@multi-restaurant/database';
import { getPlaceholderImage } from '@multi-restaurant/database';

// Mock Combo Data – ideally from backend, but static for demo
interface ComboItem {
  id: string;
  title: string;
  emoji: string;
  price: number;
}

interface ComboDeal {
  id: string;
  name: string;
  description: string;
  items: ComboItem[];
  originalPrice: number;
  comboPrice: number;
  imageUrl?: string;
}

const DEMO_COMBOS: ComboDeal[] = [
  {
    id: 'combo-1',
    name: 'Classic Burger Combo',
    description: 'Burger + Fries + Drink',
    items: [
      { id: 'c1-1', title: 'Classic Burger', emoji: '🍔', price: 9.99 },
      { id: 'c1-2', title: 'Hand-Cut Fries', emoji: '🍟', price: 4.99 },
      { id: 'c1-3', title: 'Cold Cola', emoji: '🥤', price: 2.49 },
    ],
    originalPrice: 17.47,
    comboPrice: 13.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Combo',
  },
  {
    id: 'combo-2',
    name: 'Deluxe Meal Deal',
    description: 'Deluxe Burger + Onion Rings + Milkshake',
    items: [
      { id: 'c2-1', title: 'Deluxe Burger', emoji: '🍔', price: 14.99 },
      { id: 'c2-2', title: 'Onion Rings', emoji: '🧅', price: 5.99 },
      { id: 'c2-3', title: 'Milkshake', emoji: '🥛', price: 5.99 },
    ],
    originalPrice: 26.97,
    comboPrice: 19.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Deluxe+Combo',
  },
];

export const MealDealCombo: React.FC<{ onSelect: (combo: ComboDeal) => void }> = ({ onSelect }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  const handleAddCombo = (combo: ComboDeal) => {
    try {
      combo.items.forEach((item) => {
        const menuItem = store.getMenuItems().find((mi) => mi.title.includes(item.title.split(' ')[0]));
        if (menuItem) {
          store.addToCart(menuItem.id, 1);
        }
      });
      onSelect(combo);
    } catch (error) {
      console.error('Error adding combo:', error);
    }
  };

  return (
    <View style={{ marginBottom: tokens.spacing.lg }}>
      <View style={{ paddingHorizontal: tokens.spacing.md }}>
        <Text style={sectionTitleStyle(tokens, engine)}>Build a Meal Deal 🍔</Text>
        <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm, marginBottom: tokens.spacing.md }}>
          Save up to $5 when you bundle!
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: tokens.spacing.md, gap: tokens.spacing.md }}
      >
        {DEMO_COMBOS.map((combo) => (
          <Pressable
            key={combo.id}
            onPress={() => handleAddCombo(combo)}
            style={{
              width: 280,
              padding: tokens.spacing.md,
              ...cardChrome(tokens, engine),
            }}
          >
            {combo.imageUrl ? (
              <Image
                source={{ uri: combo.imageUrl }}
                resizeMode="cover"
                style={{
                  height: 100,
                  borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusMd,
                  marginBottom: tokens.spacing.sm,
                  backgroundColor: tokens.colors.surfaceInverse,
                }}
              />
            ) : (
              <Image
                source={{ uri: getPlaceholderImage(combo.name) }}
                resizeMode="cover"
                style={{
                  height: 100,
                  borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusMd,
                  marginBottom: tokens.spacing.sm,
                  backgroundColor: tokens.colors.surfaceInverse,
                }}
              />
            )} : null}

            <Text style={{ color: tokens.colors.text, fontWeight: '700', fontSize: tokens.typography.fontSizeMd }}>
              {combo.name}
            </Text>
            <Text style={{ color: tokens.colors.textDisabled, fontSize: tokens.typography.fontSizeSm, marginBottom: tokens.spacing.sm }}>
              {combo.description}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: tokens.spacing.sm }}>
              {combo.items.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <Text style={{ fontSize: tokens.typography.fontSizeSm }}>{item.emoji}</Text>
                  {idx < combo.items.length - 1 ? (
                    <Text style={{ color: tokens.colors.textDisabled }}>+</Text>
                  ) : null}
                </React.Fragment>
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
                <Text
                  style={{
                    color: tokens.colors.textDisabled,
                    fontSize: tokens.typography.fontSizeSm,
                    textDecorationLine: 'line-through',
                  }}
                >
                  ${combo.originalPrice.toFixed(2)}
                </Text>
                <Text style={{ color: tokens.colors.accent, fontWeight: '800', fontSize: tokens.typography.fontSizeLg }}>
                  ${combo.comboPrice.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: tokens.spacing.sm,
                  paddingHorizontal: tokens.spacing.md,
                  borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusPill,
                  backgroundColor: tokens.colors.primary,
                }}
              >
                <Text style={{ color: tokens.colors.textInverse, fontWeight: '700', fontSize: tokens.typography.fontSizeSm }}>
                  Add All
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};