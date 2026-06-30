import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useCurrentUser } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout, Card, Heading, BodyText, SolidHeader } from '../components/Layout';
import { Icon } from '../components/shared/Icon';
import { type EngineId } from '../components/home/engineStyle';

const AddressPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const user = useCurrentUser();
  const addresses = user?.addresses || [];

  return (
    <>
      <SolidHeader title="Saved Addresses" onBackPress={() => navigation.goBack()} />
      <ScreenLayout scrollable>
        {addresses.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: tokens.spacing.xl }}>
            <Icon name="addresses" size={48} color={tokens.colors.textDisabled} />
            <Heading level={3} marginBottom={tokens.spacing.xs}>No addresses saved</Heading>
            <BodyText color={tokens.colors.textDisabled}>Add an address for faster checkout</BodyText>
          </View>
        ) : (
          <View style={{ gap: tokens.spacing.sm }}>
            {addresses.map((addr) => (
              <Card key={addr.id} shadow>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.xs }}>
                      <Heading level={4}>{addr.label}</Heading>
                      {addr.isDefault && (
                        <BodyText size="sm" color={tokens.colors.accent} style={{ marginLeft: tokens.spacing.sm }}>(Default)</BodyText>
                      )}
                    </View>
                    <BodyText size="sm" color={tokens.colors.textDisabled}>{addr.street}</BodyText>
                    <BodyText size="sm" color={tokens.colors.textDisabled}>{addr.city}, {addr.state} {addr.zipCode}</BodyText>
                  </View>
                  <Icon name="addresses" size={24} color={tokens.colors.accent} />
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScreenLayout>
    </>
  );
};

export default AddressPage;
