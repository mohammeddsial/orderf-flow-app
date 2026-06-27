// apps/mobile/src/components/home/OfferBanner.tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../../theme';
import { getPlaceholderImage } from '@multi-restaurant/database';

interface Props {
  title?: string;
  percent?: string;
  subtitle?: string;
  imageUrl?: string;
  onPress?: () => void;
}

// Discount offer banner (reference: "Food Package Offer — 25% DISCOUNT").
// Brand-primary rounded card: big percent on the left, food image on the right,
// with a soft shadow.
export const OfferBanner: React.FC<Props> = ({
  title = 'Food Package Offer',
  percent = '25%',
  subtitle = 'DISCOUNT',
  imageUrl,
  onPress,
}) => {
  const { tokens } = useTheme();
  const img = imageUrl || getPlaceholderImage('Food Package Offer');

  return (
    <View style={{ marginBottom: tokens.spacing.lg, paddingHorizontal: tokens.spacing.md }}>
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: tokens.colors.primary,
          borderRadius: 22,
          overflow: 'hidden',
          minHeight: 150,
          shadowColor: '#000000',
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 5,
        }}
      >
        <View style={{ flex: 1, padding: tokens.spacing.lg }}>
          <Text style={{ color: tokens.colors.textInverse, fontSize: tokens.typography.fontSizeLg, fontWeight: '700' }}>{title}</Text>
          <Text style={{ color: tokens.colors.textInverse, fontSize: 52, lineHeight: 56, fontWeight: '900', marginTop: tokens.spacing.sm }}>{percent}</Text>
          <Text style={{ color: tokens.colors.textInverse, fontSize: tokens.typography.fontSizeLg, fontWeight: '700', letterSpacing: 1 }}>{subtitle}</Text>
        </View>
        <Image source={{ uri: img }} resizeMode="cover" style={{ width: 150, height: 150 }} />
      </Pressable>
    </View>
  );
};

export default OfferBanner;
