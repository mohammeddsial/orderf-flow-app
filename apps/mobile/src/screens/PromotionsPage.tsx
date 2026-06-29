import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme';

export const PromotionsPage: React.FC = () => {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 56 }}>🎁</Text>
      <Text style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeXl, color: tokens.colors.text, marginTop: 8 }}>Promotions</Text>
      <Text style={{ color: tokens.colors.textDisabled, marginTop: 4 }}>Deals & offers</Text>
    </View>
  );
};

export default PromotionsPage;
