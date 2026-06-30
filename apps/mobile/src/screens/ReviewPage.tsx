import React, { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { useSubmitReview, useOrderById } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout, Card, Heading, BodyText, Button, DismissalHeader } from '../components/Layout';
import { Icon } from '../components/shared/Icon';

export const ReviewPage: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as any;
  const { orderId } = route.params;
  const order = useOrderById(orderId);
  const { submitReview, loading } = useSubmitReview();

  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [foodComments, setFoodComments] = useState('');
  const [deliveryComments, setDeliveryComments] = useState('');
  const [selectedFoodAttributes, setSelectedFoodAttributes] = useState<string[]>([]);
  const [selectedDeliveryAttributes, setSelectedDeliveryAttributes] = useState<string[]>([]);

  const foodAttributes = ['Fresh', 'Hot', 'Tasty', 'Good Portion', 'Correct Order'];
  const deliveryAttributes = ['On Time', 'Careful', 'Friendly', 'Professional'];

  const handleSubmitReview = async () => {
    if (order) {
      await submitReview({
        orderId: order.id,
        userId: order.userId,
        restaurantId: order.restaurantId,
        foodRating,
        deliveryRating,
        foodComments,
        deliveryComments,
        foodAttributes: selectedFoodAttributes,
        deliveryAttributes: selectedDeliveryAttributes,
        mediaUrls: [],
      });
      navigation.goBack();
    }
  };

  if (!order) return <View style={{ flex: 1 }} />;

  return (
    <>
      <DismissalHeader onDismiss={() => navigation.goBack()} />
      <ScreenLayout scrollable paddingHorizontal={tokens.spacing.lg}>
        <Heading level={2} marginBottom={tokens.spacing.lg}>
          How was your order?
        </Heading>

        <Card marginBottom={tokens.spacing.lg}>
          <Heading level={4} marginBottom={tokens.spacing.md}>
            Food Quality
          </Heading>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: tokens.spacing.md }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Pressable
                key={star}
                onPress={() => setFoodRating(star)}
                style={{ padding: tokens.spacing.sm }}
              >
                <Icon name="rewards" size={32} color={star <= foodRating ? '#FFD700' : '#ccc'} />
              </Pressable>
            ))}
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
            {foodAttributes.map(attr => (
              <Pressable
                key={attr}
                onPress={() => {
                  setSelectedFoodAttributes(prev =>
                    prev.includes(attr) ? prev.filter(a => a !== attr) : [...prev, attr]
                  );
                }}
                style={{
                  paddingVertical: tokens.spacing.sm,
                  paddingHorizontal: tokens.spacing.md,
                  backgroundColor: selectedFoodAttributes.includes(attr)
                    ? tokens.colors.accent
                    : tokens.colors.surface,
                  borderColor: tokens.colors.border,
                  borderWidth: tokens.borders.widthThin
                  borderRadius: tokens.borders.radiusPill,
                }}
              >
                <BodyText
                  size="sm"
                  color={
                    selectedFoodAttributes.includes(attr)
                      ? tokens.colors.textInverse
                      : tokens.colors.text
                  }
                >
                  {attr}
                </BodyText>
              </Pressable>
            ))}
          </View>

          <TextInput
            placeholder="Tell us more about the food..."
            placeholderTextColor={tokens.colors.textDisabled}
            value={foodComments}
            onChangeText={setFoodComments}
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
              textAlignVertical: 'top',
            }}
          />
        </Card>

        <Card marginBottom={tokens.spacing.lg}>
          <Heading level={4} marginBottom={tokens.spacing.md}>
            Delivery Experience
          </Heading>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: tokens.spacing.md }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Pressable
                key={star}
                onPress={() => setDeliveryRating(star)}
                style={{ padding: tokens.spacing.sm }}
              >
                <Icon name="rewards" size={32} color={star <= deliveryRating ? '#FFD700' : '#ccc'} />
              </Pressable>
            ))}
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
            {deliveryAttributes.map(attr => (
              <Pressable
                key={attr}
                onPress={() => {
                  setSelectedDeliveryAttributes(prev =>
                    prev.includes(attr) ? prev.filter(a => a !== attr) : [...prev, attr]
                  );
                }}
                style={{
                  paddingVertical: tokens.spacing.sm,
                  paddingHorizontal: tokens.spacing.md,
                  backgroundColor: selectedDeliveryAttributes.includes(attr)
                    ? tokens.colors.accent
                    : tokens.colors.surface,
                  borderColor: tokens.colors.border,
                  borderWidth: tokens.borders.widthThin
                  borderRadius: tokens.borders.radiusPill,
                }}
              >
                <BodyText
                  size="sm"
                  color={
                    selectedDeliveryAttributes.includes(attr)
                      ? tokens.colors.textInverse
                      : tokens.colors.text
                  }
                >
                  {attr}
                </BodyText>
              </Pressable>
            ))}
          </View>

          <TextInput
            placeholder="How was your delivery experience?"
            placeholderTextColor={tokens.colors.textDisabled}
            value={deliveryComments}
            onChangeText={setDeliveryComments}
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
              textAlignVertical: 'top',
            }}
          />
        </Card>

        <Card marginBottom={tokens.spacing.lg} padding={tokens.spacing.lg}>
          <View style={{ alignItems: 'center' }}>
            <Icon name="camera" size={32} color={tokens.colors.textDisabled} />
            <Heading level={4} marginBottom={tokens.spacing.sm}>
              Add Photos (Optional)
            </Heading>
            <Button label="Upload Photo" onPress={() => {}} size="sm" variant="outline" />
          </View>
        </Card>

        <Button
          label="Submit Review"
          onPress={handleSubmitReview}
          disabled={loading || foodRating === 0 || deliveryRating === 0}
          size="lg"
        />
      </ScreenLayout>
    </>
  );
};

export default ReviewPage;
