import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme';
import { useTenant } from '@multi-restaurant/database';

export const ProfilePage: React.FC = () => {
  const { tokens } = useTheme();
  const tenant = useTenant();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 56 }}>👤</Text>
      <Text style={{ fontWeight: '800', fontSize: tokens.typography.fontSizeXl, color: tokens.colors.text, marginTop: 8 }}>Your Profile</Text>
      <Text style={{ color: tokens.colors.textDisabled, marginTop: 4 }}>{tenant.name} member</Text>
    </View>
  );
};

export default ProfilePage;
