// Shared building blocks for card designs — engine-aware via cardChrome().
import React, { useState } from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';
import { ThemeTokens } from '../../../theme/engines';
import { cardChrome, EngineId, imageRadiusFor } from '../engineStyle';

// Engine-aware card container (replaces the old hardcoded softCard).
export const engineCard = (t: ThemeTokens, engine: EngineId): ViewStyle =>
  cardChrome(t, engine);

// Backward-compatible alias so any stray imports still resolve.
export const softCard = (t: ThemeTokens, engine?: EngineId): ViewStyle => {
  if (engine) return cardChrome(t, engine);
  return cardChrome(t, 'MINIMALIST_CLEAN');
};

export const Favorite: React.FC<{ engine?: EngineId; t?: ThemeTokens }> = ({ engine = 'MINIMALIST_CLEAN', t }) => {
  const [fav, setFav] = useState(false);
  const radius = engine === 'BRUTALIST_MODERNIST' ? 0 : 15;
  const bg =
    engine === 'VIBRANT_STREET_TECH'
      ? 'rgba(0,217,255,0.15)'
      : 'rgba(255,255,255,0.92)';
  const heartColor = fav
    ? engine === 'VIBRANT_STREET_TECH'
      ? '#FF006E'
      : '#FF3B30'
    : '#9aa0a6';

  return (
    <Pressable
      onPress={() => setFav((f) => !f)}
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 30,
        height: 30,
        borderRadius: radius,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 15, color: heartColor }}>{fav ? '♥' : '♡'}</Text>
    </Pressable>
  );
};

export const RatingRow: React.FC<{ t: ThemeTokens }> = ({ t }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
    <Text style={{ fontSize: t.typography.fontSizeXs, color: t.colors.text, fontWeight: '700' }}>⭐ 4.9</Text>
    <Text style={{ fontSize: t.typography.fontSizeXs, color: t.colors.textDisabled }}>⏰ 20–25 Min</Text>
  </View>
);

// Price tag: engine-aware pill shape.
export const PricePill: React.FC<{ t: ThemeTokens; engine?: EngineId; children: React.ReactNode; style?: ViewStyle }> = ({ t, engine = 'MINIMALIST_CLEAN', children, style }) => {
  const radius =
    engine === 'BRUTALIST_MODERNIST' ? 0 : 999;
  return (
    <View
      style={[
        { alignSelf: 'flex-start', backgroundColor: t.colors.primary, borderRadius: radius, paddingVertical: 6, paddingHorizontal: 14 },
        style,
      ]}
    >
      <Text style={{ color: t.colors.textInverse, fontWeight: '800', fontSize: t.typography.fontSizeSm }}>{children}</Text>
    </View>
  );
};

// Action button: engine-aware shape + shadow.
export const ActionButton: React.FC<{ t: ThemeTokens; engine?: EngineId; label: string; onPress: () => void; style?: ViewStyle }> = ({ t, engine = 'MINIMALIST_CLEAN', label, onPress, style }) => {
  const radius =
    engine === 'BRUTALIST_MODERNIST' ? 0 : 12;
  const shadow =
    engine === 'VIBRANT_STREET_TECH'
      ? {
          shadowColor: t.colors.accent,
          shadowOpacity: 0.6,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 0 },
          elevation: 6,
        }
      : {
          shadowColor: '#000000',
          shadowOpacity: 0.12,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 2,
        };

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: t.colors.accent,
          borderRadius: radius,
          paddingVertical: 10,
          paddingHorizontal: 18,
          ...shadow,
        },
        style,
      ]}
    >
      <Text style={{ color: t.colors.textInverse, fontWeight: '800', fontSize: t.typography.fontSizeSm }}>{label}</Text>
    </Pressable>
  );
};

// Engine-aware image radius helper (re-exported for convenience).
export { imageRadiusFor };
