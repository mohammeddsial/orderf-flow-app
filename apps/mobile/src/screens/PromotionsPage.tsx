import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import { ScreenLayout, Card, Heading, BodyText, Button, SolidHeader } from '../components/Layout';
import { cardChrome, type EngineId } from '../components/home/engineStyle';
import { Icon } from '../components/shared/Icon';
import { useTenant } from '@multi-restaurant/database';

type Promotion = {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiry: string;
  icon: string;
  color: string;
};

const PROMOTIONS: Promotion[] = [
  {
    id: 'promo-welcome',
    title: 'Welcome! 20% Off',
    description: 'New here? Enjoy 20% off your first order with us.',
    discount: '20% OFF',
    code: 'WELCOME20',
    expiry: 'Dec 31, 2026',
    icon: 'celebration',
    color: '#FF6B35',
  },
  {
    id: 'promo-bundle',
    title: 'Burger Bundle',
    description: 'Any two classic burgers for just $18. Perfect for sharing.',
    discount: '2 for $18',
    code: 'BURGER2',
    expiry: 'Jul 15, 2026',
    icon: 'burger',
    color: '#FF9E46',
  },
  {
    id: 'promo-delivery',
    title: 'Free Delivery',
    description: 'Spend $25 or more and get free delivery on your order.',
    discount: 'FREE DELIVERY',
    code: 'FREESHIP',
    expiry: 'Jul 31, 2026',
    icon: 'delivery',
    color: '#388E3C',
  },
  {
    id: 'promo-shake',
    title: '50% Off Milkshakes',
    description: 'Late night cravings? Half-price milkshakes after 8 PM.',
    discount: '50% OFF',
    code: 'SHAKE50',
    expiry: 'Jul 7, 2026',
    icon: 'gift',
    color: '#9C27B0',
  },
  {
    id: 'promo-combo',
    title: 'Combo Meal Save $3',
    description: 'Get any burger + fries + drink combo and save $3 instantly.',
    discount: 'SAVE $3',
    code: 'COMBO3',
    expiry: 'Jul 14, 2026',
    icon: 'burger',
    color: '#FF6B35',
  },
  {
    id: 'promo-loyalty',
    title: 'Double Points Tuesday',
    description: 'Earn 2x loyalty points on every order every Tuesday.',
    discount: '2X POINTS',
    code: 'TUESDAY2X',
    expiry: 'Ongoing',
    icon: 'rewards',
    color: '#FFD700',
  },
];

export const PromotionsPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const tenant = useTenant();

  return (
    <>
      <SolidHeader title="Promotions" onBackPress={() => navigation.navigate('Home')} />
      <ScreenLayout scrollable paddingHorizontal={tokens.spacing.lg}>
        {/* Hero banner */}
        <Card marginBottom={tokens.spacing.lg} shadow>
          <View style={{ alignItems: 'center', paddingVertical: tokens.spacing.lg }}>
            <Icon name="gift" size={48} color={tokens.colors.accent} />
            <Heading level={2} marginBottom={tokens.spacing.xs}>
              Deals & Offers
            </Heading>
            <BodyText size="sm" color={tokens.colors.textDisabled} style={{ textAlign: 'center' }}>
              Save big on your favourite meals from {tenant.name}
            </BodyText>
          </View>
        </Card>

        {/* Active promotions */}
        <Heading level={3} marginBottom={tokens.spacing.md}>
          Active Promotions
        </Heading>
        {PROMOTIONS.map((promo) => (
          <Card key={promo.id} marginBottom={tokens.spacing.md} shadow>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              {/* Icon */}
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 26,
                  backgroundColor: promo.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: tokens.spacing.md,
                }}
              >
                <Icon name={promo.icon} size={26} color="#FFFFFF" />
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                  <Heading level={4} style={{ flex: 1 }}>
                    {promo.title}
                  </Heading>
                  <View
                    style={{
                      backgroundColor: promo.color,
                      paddingHorizontal: tokens.spacing.sm,
                      paddingVertical: 2,
                    borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 4,
                      marginLeft: tokens.spacing.sm,
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '900', fontSize: 10 }}>
                      {promo.discount}
                    </Text>
                  </View>
                </View>
                <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.sm}>
                  {promo.description}
                </BodyText>

                {/* Code + expiry */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: tokens.colors.border,
                        borderStyle: 'dashed',
                        paddingHorizontal: tokens.spacing.sm,
                        paddingVertical: 4,
                      borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 4,
                        marginRight: tokens.spacing.sm,
                      }}
                    >
                      <Text
                        style={{
                          color: tokens.colors.primary,
                          fontWeight: '900',
                          fontSize: 12,
                          letterSpacing: 1,
                        }}
                      >
                        {promo.code}
                      </Text>
                    </View>
                    <BodyText size="sm" color={tokens.colors.textDisabled}>
                      Exp: {promo.expiry}
                    </BodyText>
                  </View>
                </View>
              </View>
            </View>

            {/* Action */}
            <View style={{ marginTop: tokens.spacing.md }}>
              <Button
                label="Order Now"
                onPress={() => navigation.navigate('Menu')}
                size="sm"
              />
            </View>
          </Card>
        ))}

        {/* Refer a friend */}
        <Card marginBottom={tokens.spacing.lg} padding={tokens.spacing.xl}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginBottom: tokens.spacing.sm }}>🤝</Text>
            <Heading level={3} marginBottom={tokens.spacing.xs}>
              Refer a Friend
            </Heading>
            <BodyText size="sm" color={tokens.colors.textDisabled} style={{ textAlign: 'center' }} marginBottom={tokens.spacing.md}>
              Give $10, get $10. Share your code with friends and you both earn rewards.
            </BodyText>
            <View
              style={{
                borderWidth: 1,
                borderColor: tokens.colors.primary,
                paddingHorizontal: tokens.spacing.lg,
                paddingVertical: tokens.spacing.sm,
                borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 8,
                marginBottom: tokens.spacing.md,
              }}
            >
              <Text style={{ color: tokens.colors.primary, fontWeight: '900', fontSize: 18, letterSpacing: 2 }}>
                {tenant.name?.toUpperCase().replace(/\s/g, '')}-10
              </Text>
            </View>
            <Button label="Share Code" onPress={() => {}} variant="outline" size="sm" />
          </View>
        </Card>

        <View style={{ height: 40 }} />
      </ScreenLayout>
    </>
  );
};

export default PromotionsPage;
