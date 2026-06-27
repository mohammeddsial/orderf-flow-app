// apps/mobile/src/components/home/BirthdayBanner.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme';
import { useCurrentUser } from '@multi-restaurant/database';
import { EngineId, cardChrome } from './engineStyle';

// Helper to check if today is the user's birthday
const isToday = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  const today = new Date();
  const birth = new Date(dateStr);
  return (
    today.getMonth() === birth.getMonth() &&
    today.getDate() === birth.getDate()
  );
};

export const BirthdayBanner: React.FC<{ onClaim: () => void }> = ({ onClaim }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const user = useCurrentUser();

  const isBirthday = isToday(user?.birthday);

  if (!isBirthday || !user) return null;

  return (
    <View style={{ paddingHorizontal: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
      <Pressable
        onPress={onClaim}
        style={{
          padding: tokens.spacing.lg,
          ...cardChrome(tokens, engine),
          backgroundColor:
            engine === 'VIBRANT_STREET_TECH'
              ? tokens.colors.accent + '22'
              : tokens.colors.accentLight,
          borderColor: tokens.colors.accent,
          borderWidth: tokens.borders.widthMedium,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md }}>
          <Text style={{ fontSize: 48 }}>🎂</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: tokens.colors.text,
                fontWeight: '800',
                fontSize: tokens.typography.fontSizeLg,
              }}
            >
              Happy Birthday, {user.firstName}! 🎉
            </Text>
            <Text
              style={{
                color: tokens.colors.textDisabled,
                fontSize: tokens.typography.fontSizeSm,
                marginTop: 2,
              }}
            >
              Enjoy a free dessert on us! Tap to claim.
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
              Claim 🎁
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};