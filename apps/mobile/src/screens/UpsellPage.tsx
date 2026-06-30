import React, { useState } from 'react';
import { View, ScrollView, Pressable, Text } from 'react-native';
import { useMenuItems, useCart } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import {
  ScreenLayout,
  Card,
  Heading,
  BodyText,
  Button,
  DismissalHeader,
} from '../components/Layout';

export const UpsellPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as any;
  const allMenuItems = useMenuItems();
  const cart = useCart();
  const [addedItems, setAddedItems] = useState<string[]>([]);

  const recommendedItems = allMenuItems.filter(item => item.category === 'Sides' || item.category === 'Drinks').slice(0, 4);

  const handleAddUpsell = (itemId: string) => {
    if (cart) {
      try {
        cart.addToCart(itemId, 1);
        setAddedItems([...addedItems, itemId]);
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const handleSkip = () => {
    navigation.navigate('Checkout');
  };

  return (
    <>
      <DismissalHeader onDismiss={handleSkip} />
      <ScreenLayout scrollable paddingHorizontal={tokens.spacing.lg}>
        <View style={{ marginBottom: tokens.spacing.lg }}>
          <Heading level={1} marginBottom={tokens.spacing.sm}>
            Complete Your Meal
          </Heading>
          <BodyText size="sm" color={tokens.colors.textDisabled}>
            Add sides, drinks, or desserts to your order
          </BodyText>
        </View>

        <View style={{ marginBottom: tokens.spacing.xl }}>
          {recommendedItems.map(item => (
            <Card
              key={item.id}
              marginBottom={tokens.spacing.md}
              padding={tokens.spacing.md}
              backgroundColor={
                addedItems.includes(item.id) ? tokens.colors.accentLight : tokens.colors.surface
              }
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Heading level={4}>{item.title}</Heading>
                  <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.sm}>
                    {item.calories} cal
                  </BodyText>
                  <Heading level={4}>${item.basePrice.toFixed(2)}</Heading>
                </View>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: tokens.colors.surfaceInverse,
                    borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusMd,
                    marginLeft: tokens.spacing.md,
                  }}
                />
              </View>
              <Button
                label={addedItems.includes(item.id) ? 'Added ✓' : 'Add'}
                onPress={() => handleAddUpsell(item.id)}
                disabled={addedItems.includes(item.id)}
                variant={addedItems.includes(item.id) ? 'secondary' : 'primary'}
                size="sm"
              />
            </Card>
          ))}
        </View>

        <View style={{ marginBottom: tokens.spacing.xl }}>
          <Button
            label="Continue to Checkout"
            onPress={handleSkip}
            size="lg"
          />
        </View>

        <Pressable onPress={handleSkip} style={{ marginBottom: tokens.spacing.lg }}>
          <Text
            style={{
              fontSize: tokens.typography.fontSizeSm,
              color: tokens.colors.textDisabled,
              textAlign: 'center',
              textDecorationLine: 'underline',
            }}
          >
            Skip & Continue
          </Text>
        </Pressable>
      </ScreenLayout>
    </>
  );
};

export default UpsellPage;
