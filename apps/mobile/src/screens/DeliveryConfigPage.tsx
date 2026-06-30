import React, { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { FulfillmentMode } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import {
  ScreenLayout,
  Card,
  Heading,
  BodyText,
  Button,
  SolidHeader,
} from '../components/Layout';

export const DeliveryConfigPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as any;
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>('DELIVERY');
  const [address, setAddress] = useState('123 Main Street, San Francisco, CA 94105');
  const [dropOffInstructions, setDropOffInstructions] = useState('');
  const [buzzerCode, setBuzzerCode] = useState('');
  const [selectedTimeWindow, setSelectedTimeWindow] = useState('ASAP');

  const timeWindows = [
    { id: 'ASAP', label: 'ASAP', time: '25-35 min' },
    { id: '11am-12pm', label: '11:00 AM', time: '11:00 AM - 12:00 PM' },
    { id: '12pm-1pm', label: '12:00 PM', time: '12:00 PM - 1:00 PM' },
    { id: '1pm-2pm', label: '1:00 PM', time: '1:00 PM - 2:00 PM' },
    { id: '2pm-3pm', label: '2:00 PM', time: '2:00 PM - 3:00 PM' },
  ];

  return (
    <>
      <SolidHeader
        title="Delivery & Pickup"
        onBackPress={() => navigation.goBack()}
      />
      <ScreenLayout scrollable paddingHorizontal={tokens.spacing.md}>
        <View style={{ marginBottom: tokens.spacing.lg }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: tokens.colors.surfaceInverse,
              borderRadius: tokens.borders.radiusPill,
              padding: tokens.spacing.xs,
              gap: tokens.spacing.xs,
            }}
          >
            {(['DELIVERY', 'PICKUP'] as FulfillmentMode[]).map(mode => (
              <Pressable
                key={mode}
                onPress={() => setFulfillmentMode(mode)}
                style={{
                  flex: 1,
                  paddingVertical: tokens.spacing.md,
                  paddingHorizontal: tokens.spacing.lg,
                  backgroundColor:
                    fulfillmentMode === mode ? tokens.colors.primary : 'transparent',
                  borderRadius: tokens.borders.radiusPill,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: tokens.typography.fontSizeMd,
                    fontWeight: '600',
                    color:
                      fulfillmentMode === mode
                        ? tokens.colors.textInverse
                        : tokens.colors.text,
                  }}
                >
                  {mode}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {fulfillmentMode === 'DELIVERY' && (
          <View style={{ marginBottom: tokens.spacing.lg }}>
            <Heading level={3} marginBottom={tokens.spacing.md}>
              Delivery Address
            </Heading>
            <TextInput
              placeholder="Enter delivery address"
              placeholderTextColor={tokens.colors.textDisabled}
              value={address}
              onChangeText={setAddress}
              style={{
                borderColor: tokens.colors.border,
                borderWidth: tokens.borders.widthThin
                borderRadius: tokens.borders.radiusMd,
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.md,
                fontSize: tokens.typography.fontSizeMd,
                color: tokens.colors.text,
                marginBottom: tokens.spacing.md,
              }}
            />
            <Card backgroundColor={tokens.colors.success} marginBottom={tokens.spacing.md}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, marginRight: tokens.spacing.sm }}>✓</Text>
                <BodyText size="sm" color={tokens.colors.textInverse}>
                  Address verified - Delivery available
                </BodyText>
              </View>
            </Card>
          </View>
        )}

        {fulfillmentMode === 'DELIVERY' && (
          <View style={{ marginBottom: tokens.spacing.lg }}>
            <Heading level={3} marginBottom={tokens.spacing.md}>
              Delivery Instructions
            </Heading>
            <TextInput
              placeholder="e.g., Leave at door, ring bell, etc."
              placeholderTextColor={tokens.colors.textDisabled}
              value={dropOffInstructions}
              onChangeText={setDropOffInstructions}
              multiline
              numberOfLines={3}
              style={{
                borderColor: tokens.colors.border,
                borderWidth: tokens.borders.widthThin
                borderRadius: tokens.borders.radiusMd,
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.md,
                fontSize: tokens.typography.fontSizeMd,
                color: tokens.colors.text,
                marginBottom: tokens.spacing.md,
                textAlignVertical: 'top',
              }}
            />

            <Heading level={4} marginBottom={tokens.spacing.md}>
              Gate/Buzzer Code (Optional)
            </Heading>
            <TextInput
              placeholder="Enter buzzer code if applicable"
              placeholderTextColor={tokens.colors.textDisabled}
              value={buzzerCode}
              onChangeText={setBuzzerCode}
              style={{
                borderColor: tokens.colors.border,
                borderWidth: tokens.borders.widthThin
                borderRadius: tokens.borders.radiusMd,
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.md,
                fontSize: tokens.typography.fontSizeMd,
                color: tokens.colors.text,
              }}
            />
          </View>
        )}

        {fulfillmentMode === 'PICKUP' && (
          <View style={{ marginBottom: tokens.spacing.lg }}>
            <Heading level={3} marginBottom={tokens.spacing.md}>
              Pickup Location
            </Heading>
            <Card marginBottom={tokens.spacing.md} padding={tokens.spacing.md}>
              <Heading level={4}>BurgerBliss Downtown</Heading>
              <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.sm}>
                456 Market Street, San Francisco, CA
              </BodyText>
              <BodyText size="sm" marginBottom={tokens.spacing.md}>
                Open until 10:00 PM
              </BodyText>
              <Button label="Use This Location" onPress={() => {}} size="sm" />
            </Card>
          </View>
        )}

        <View style={{ marginBottom: tokens.spacing.lg }}>
          <Heading level={3} marginBottom={tokens.spacing.md}>
            {fulfillmentMode === 'DELIVERY' ? 'Delivery Time' : 'Pickup Time'}
          </Heading>
          <View style={{ gap: tokens.spacing.sm }}>
            {timeWindows.map(window => (
              <Pressable
                key={window.id}
                onPress={() => setSelectedTimeWindow(window.id)}
                style={{
                  paddingVertical: tokens.spacing.md,
                  paddingHorizontal: tokens.spacing.lg,
                  borderColor:
                    selectedTimeWindow === window.id
                      ? tokens.colors.primary
                      : tokens.colors.border,
                  borderWidth: tokens.borders.widthThin
                  borderRadius: tokens.borders.radiusMd,
                  backgroundColor:
                    selectedTimeWindow === window.id
                      ? tokens.colors.accentLight
                      : tokens.colors.surface,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: tokens.typography.fontSizeMd,
                      fontWeight: '600',
                      color: tokens.colors.text,
                    }}
                  >
                    {window.label}
                  </Text>
                  <BodyText size="sm" color={tokens.colors.textDisabled}>
                    {window.time}
                  </BodyText>
                </View>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 12,
                    borderColor: tokens.colors.border,
                    borderWidth: tokens.borders.widthThin
                    backgroundColor:
                      selectedTimeWindow === window.id
                        ? tokens.colors.primary
                        : 'transparent',
                  }}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <Button
          label="Continue to Checkout"
          onPress={() => navigation.navigate('Checkout')}
          size="lg"
        />
      </ScreenLayout>
    </>
  );
};

export default DeliveryConfigPage;
