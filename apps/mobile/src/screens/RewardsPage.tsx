import React from 'react';
import { View, Text } from 'react-native';
import { useCurrentUser } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout, Card, Heading, BodyText, Button, SolidHeader } from '../components/Layout';

export const RewardsPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens } = useTheme();
  const user = useCurrentUser();

  if (!user) return <View style={{ flex: 1 }} />;

  const offers = [
    { id: '1', title: '$5 Off Next Order', pointsCost: 100 },
    { id: '2', title: 'Free Dessert', pointsCost: 200 },
    { id: '3', title: 'Free Delivery', pointsCost: 150 },
  ];

  return (
    <>
      <SolidHeader title="Rewards" onBackPress={() => navigation.navigate('Home')} />
      <ScreenLayout scrollable paddingHorizontal={tokens.spacing.lg}>
        <Card marginBottom={tokens.spacing.lg} shadow>
          <View style={{ alignItems: 'center', marginBottom: tokens.spacing.lg }}>
            <Heading level={3} marginBottom={tokens.spacing.sm}>
              {user.loyaltyProfile.tier} Tier
            </Heading>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: tokens.spacing.sm }}>
              <Heading level={1}>{user.loyaltyProfile.pointsBalance}</Heading>
              <BodyText>points available</BodyText>
            </View>
          </View>

          <View style={{ height: 4, backgroundColor: tokens.colors.borderLight, borderRadius: tokens.borders.radiusPill, overflow: 'hidden', marginBottom: tokens.spacing.lg }}>
            <View style={{ height: '100%', width: '45%', backgroundColor: tokens.colors.secondary }} />
          </View>

          <BodyText size="sm" color={tokens.colors.textDisabled}>
            {1000 - user.loyaltyProfile.pointsBalance} points to next tier
          </BodyText>
        </Card>

        <Card marginBottom={tokens.spacing.lg} padding={tokens.spacing.xl}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 60, marginBottom: tokens.spacing.md }}>📱</Text>
            <Heading level={4} marginBottom={tokens.spacing.sm}>
              Scan to Earn
            </Heading>
            <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.md}>
              Show this code at checkout
            </BodyText>
            <View style={{ width: 150, height: 150, backgroundColor: tokens.colors.surfaceInverse, borderRadius: tokens.borders.radiusMd, marginBottom: tokens.spacing.md }} />
            <BodyText size="sm" color={tokens.colors.accent}>
              ID: {user.id.slice(-8)}
            </BodyText>
          </View>
        </Card>

        <Heading level={3} marginBottom={tokens.spacing.md}>
          Available Offers
        </Heading>
        {offers.map(offer => (
          <Card key={offer.id} marginBottom={tokens.spacing.md}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Heading level={4}>{offer.title}</Heading>
                <BodyText size="sm" color={tokens.colors.accent}>
                  {offer.pointsCost} points
                </BodyText>
              </View>
              <Button
                label="Redeem"
                onPress={() => {}}
                size="sm"
                disabled={user.loyaltyProfile.pointsBalance < offer.pointsCost}
              />
            </View>
          </Card>
        ))}
      </ScreenLayout>
    </>
  );
};

export default RewardsPage;
