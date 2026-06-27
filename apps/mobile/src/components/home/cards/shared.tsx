// Shared building blocks for the reference card design (rounded white card,
// soft shadow, favorite heart, rating row, orange price pill).
import React, { useState } from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';
import { ThemeTokens } from '../../../theme/engines';

export const softCard = (t: ThemeTokens): ViewStyle => ({
  backgroundColor: t.colors.surface,
  borderRadius: 18,
  shadowColor: '#000000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
});

export const Favorite: React.FC = () => {
  const [fav, setFav] = useState(false);
  return (
    <Pressable
      onPress={() => setFav((f) => !f)}
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.92)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 15, color: fav ? '#FF3B30' : '#9aa0a6' }}>{fav ? '♥' : '♡'}</Text>
    </Pressable>
  );
};

export const RatingRow: React.FC<{ t: ThemeTokens }> = ({ t }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
    <Text style={{ fontSize: t.typography.fontSizeXs, color: t.colors.text, fontWeight: '700' }}>⭐ 4.9</Text>
    <Text style={{ fontSize: t.typography.fontSizeXs, color: t.colors.textDisabled }}>⏰ 20–25 Min</Text>
  </View>
);

// Price tag: brand PRIMARY pill. Used only to show a price (a label).
export const PricePill: React.FC<{ t: ThemeTokens; children: React.ReactNode; style?: ViewStyle }> = ({ t, children, style }) => (
  <View
    style={[
      { alignSelf: 'flex-start', backgroundColor: t.colors.primary, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 },
      style,
    ]}
  >
    <Text style={{ color: t.colors.textInverse, fontWeight: '800', fontSize: t.typography.fontSizeSm }}>{children}</Text>
  </View>
);

// Action button: a tappable button must read differently from a price tag.
// Price pills are full-radius pills; buttons are rounded RECTANGLES with a
// shadow. Shape (not just color) separates them — important because the brand
// accent and primary are often near-identical shades.
export const ActionButton: React.FC<{ t: ThemeTokens; label: string; onPress: () => void; style?: ViewStyle }> = ({ t, label, onPress, style }) => (
  <Pressable
    onPress={onPress}
    style={[
      {
        alignSelf: 'flex-start',
        backgroundColor: t.colors.accent,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 18,
        shadowColor: '#000000',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      },
      style,
    ]}
  >
    <Text style={{ color: t.colors.textInverse, fontWeight: '800', fontSize: t.typography.fontSizeSm }}>{label}</Text>
  </Pressable>
);
