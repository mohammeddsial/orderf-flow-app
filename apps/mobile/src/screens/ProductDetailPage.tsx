import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { useMenuItemById, useCart } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import {
  ScreenLayout,
  Card,
  Heading,
  BodyText,
  Button,
  HeroImage,
  OverlayHeader,
} from '../components/Layout';

export const ProductDetailPage: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { tokens } = useTheme();
  const { itemId } = route.params;
  const item = useMenuItemById(itemId);
  const cart = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({});
  const [isMealDeal, setIsMealDeal] = useState(false);
  const [portionSize, setPortionSize] = useState('regular');

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Heading level={2}>Item not found</Heading>
      </View>
    );
  }

  const handleModifierToggle = (modifierId: string, optionId: string) => {
    setSelectedModifiers(prev => ({
      ...prev,
      [modifierId]: prev[modifierId]?.includes(optionId)
        ? prev[modifierId].filter(id => id !== optionId)
        : [...(prev[modifierId] || []), optionId],
    }));
  };

  const modifierPrice = Object.entries(selectedModifiers).reduce((sum, [modifierId, optionIds]) => {
    const modifier = item.modifiers.find(m => m.id === modifierId);
    if (!modifier) return sum;
    return sum + optionIds.reduce((optSum, optionId) => {
      const option = modifier.options.find(o => o.id === optionId);
      return optSum + (option?.price || 0);
    }, 0);
  }, 0);

  const totalPrice = (item.basePrice + modifierPrice) * quantity;

  const handleAddToCart = () => {
    if (cart) {
      const modifierSelections = Object.entries(selectedModifiers).map(([modifierId, optionIds]) => {
        const modifier = item.modifiers.find(m => m.id === modifierId);
        const selectedOptions = optionIds
          .map(optionId => modifier?.options.find(o => o.id === optionId))
          .filter(Boolean) as any[];
        return {
          modifierId,
          selectedOptions,
        };
      });

      try {
        (cart as any).addToCart(item.id, quantity, modifierSelections, isMealDeal ? 'Made it a meal' : '');
        navigation.navigate('Upsell');
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ position: 'relative', aspectRatio: 1 }}>
          <HeroImage
            source={{ uri: item.imageUrl }}
            aspectRatio={1}
          />
          <OverlayHeader
            onBackPress={() => navigation.goBack()}
          />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: tokens.spacing.lg, paddingVertical: tokens.spacing.lg }}>
            <View style={{ marginBottom: tokens.spacing.lg }}>
              <Heading level={1}>{item.title}</Heading>
              <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.md}>
                {item.description}
              </BodyText>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Heading level={2}>${item.basePrice.toFixed(2)}</Heading>
                  <BodyText size="sm" color={tokens.colors.accent}>
                    +${modifierPrice.toFixed(2)} modifiers
                  </BodyText>
                </View>
                <Card padding={tokens.spacing.md} marginBottom={0}>
                  <BodyText size="sm" color={tokens.colors.textDisabled}>
                    {item.calories} cal
                  </BodyText>
                </Card>
              </View>
            </View>

            <View style={{ marginBottom: tokens.spacing.lg }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm }}>
                <Card padding={tokens.spacing.sm} marginBottom={0} borderWidth={tokens.borders.widthThin}>
                  <BodyText size="sm">Contains Gluten</BodyText>
                </Card>
                <Card padding={tokens.spacing.sm} marginBottom={0} borderWidth={tokens.borders.widthThin}>
                  <BodyText size="sm">Contains Dairy</BodyText>
                </Card>
              </View>
            </View>

            <View style={{ marginBottom: tokens.spacing.lg }}>
              {item.modifiers.map(modifier => (
                <Card key={modifier.id} marginBottom={tokens.spacing.md}>
                  <Heading level={4} marginBottom={tokens.spacing.sm}>
                    {modifier.name}
                  </Heading>
                  <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.md}>
                    Select up to {modifier.maxSelection}
                  </BodyText>
                  {modifier.options.map(option => (
                    <Pressable
                      key={option.id}
                      onPress={() => handleModifierToggle(modifier.id, option.id)}
                      style={{
                        paddingVertical: tokens.spacing.md,
                        borderBottomColor: tokens.colors.borderLight,
                        borderBottomWidth: tokens.borders.widthThin,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            borderColor: tokens.colors.border,
                            borderWidth: tokens.borders.widthThin,
                            marginRight: tokens.spacing.md,
                            backgroundColor: selectedModifiers[modifier.id]?.includes(option.id)
                              ? tokens.colors.primary
                              : 'transparent',
                          }}
                        />
                        <BodyText>{option.name}</BodyText>
                      </View>
                      {option.price > 0 && (
                        <BodyText color={tokens.colors.accent}>
                          +${option.price.toFixed(2)}
                        </BodyText>
                      )}
                    </Pressable>
                  ))}
                </Card>
              ))}
            </View>

            <View style={{ marginBottom: tokens.spacing.lg }}>
              <Heading level={4} marginBottom={tokens.spacing.md}>
                Portion Size
              </Heading>
              <View style={{ flexDirection: 'row', gap: tokens.spacing.sm }}>
                {['regular', 'large', 'family'].map(size => (
                  <Pressable
                    key={size}
                    onPress={() => setPortionSize(size)}
                    style={{
                      flex: 1,
                      paddingVertical: tokens.spacing.md,
                      paddingHorizontal: tokens.spacing.lg,
                      backgroundColor: portionSize === size
                        ? tokens.colors.primary
                        : tokens.colors.surface,
                      borderColor: tokens.colors.border,
                      borderWidth: tokens.borders.widthThin,
                      borderRadius: tokens.borders.radiusMd,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: tokens.typography.fontSizeSm,
                        fontWeight: '600',
                        color: portionSize === size
                          ? tokens.colors.textInverse
                          : tokens.colors.text,
                        textTransform: 'capitalize',
                      }}
                    >
                      {size}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: tokens.spacing.lg }}>
              <Card
                padding={tokens.spacing.md}
                backgroundColor={isMealDeal ? tokens.colors.accentLight : tokens.colors.surface}
                borderWidth={tokens.borders.widthThin}
                borderColor={isMealDeal ? tokens.colors.accent : tokens.colors.border}
              >
                <Pressable
                  onPress={() => setIsMealDeal(!isMealDeal)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <Heading level={4}>Make it a Meal</Heading>
                    <BodyText size="sm" color={tokens.colors.textDisabled}>
                      +$3 Includes sides & drink
                    </BodyText>
                  </View>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      borderColor: tokens.colors.border,
                      borderWidth: tokens.borders.widthThin,
                      backgroundColor: isMealDeal ? tokens.colors.accent : 'transparent',
                    }}
                  />
                </Pressable>
              </Card>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            backgroundColor: tokens.colors.surface,
            borderTopColor: tokens.colors.border,
            borderTopWidth: tokens.borders.widthThin,
            paddingHorizontal: tokens.spacing.lg,
            paddingVertical: tokens.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: tokens.spacing.md,
              backgroundColor: tokens.colors.surfaceInverse,
              borderRadius: tokens.borders.radiusMd,
              paddingHorizontal: tokens.spacing.md,
            }}
          >
            <Pressable
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={{ paddingVertical: tokens.spacing.md }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700' }}>−</Text>
            </Pressable>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: tokens.typography.fontSizeLg,
                fontWeight: '700',
              }}
            >
              {quantity}
            </Text>
            <Pressable
              onPress={() => setQuantity(quantity + 1)}
              style={{ paddingVertical: tokens.spacing.md }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700' }}>+</Text>
            </Pressable>
          </View>

          <Button
            label={`Add to Basket • $${totalPrice.toFixed(2)}`}
            onPress={handleAddToCart}
            size="lg"
          />
        </View>
      </View>
    </>
  );
};

export default ProductDetailPage;
