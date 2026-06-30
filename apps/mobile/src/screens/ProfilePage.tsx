import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useCurrentUser, useTenant, useOrders } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout, Card, Heading, BodyText, Button, SolidHeader } from '../components/Layout';
import { cardChrome, type EngineId } from '../components/home/engineStyle';
import { Icon } from '../components/shared/Icon';

export const ProfilePage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const user = useCurrentUser();
  const tenant = useTenant();
  const orders = useOrders();

  if (!user) {
    return (
      <>
        <SolidHeader title="Profile" onBackPress={() => navigation.navigate('Home')} />
        <ScreenLayout scrollable>
          <Card padding={tokens.spacing.xl}>
            <View style={{ alignItems: 'center' }}>
              <Icon name="profile" size={56} color={tokens.colors.textDisabled} />
              <Heading level={3}>Not signed in</Heading>
              <BodyText color={tokens.colors.textDisabled} marginBottom={tokens.spacing.lg}>
                Sign in to view your profile
              </BodyText>
              <Button label="Sign In" onPress={() => {}} />
            </View>
          </Card>
        </ScreenLayout>
      </>
    );
  }

  const recentOrders = orders.slice(0, 3);
  const tierColor = user.loyaltyProfile?.tier === 'GOLD' ? '#FFD700' : user.loyaltyProfile?.tier === 'SILVER' ? '#C0C0C0' : '#CD7F32';

  const menuItems = [
    { key: 'orders', label: 'Order History', icon: 'orders' },
    { key: 'addresses', label: 'Saved Addresses', icon: 'addresses' },
    { key: 'payments', label: 'Payment Methods', icon: 'payments' },
    { key: 'dietary', label: 'Dietary Preferences', icon: 'dietary' },
    { key: 'help', label: 'Help & Support', icon: 'help' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <>
      <SolidHeader title="Profile" onBackPress={() => navigation.navigate('Home')} />
      <ScreenLayout scrollable paddingHorizontal={tokens.spacing.lg}>
        {/* Profile header */}
        <Card marginBottom={tokens.spacing.lg} shadow>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.lg }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 32,
                backgroundColor: tokens.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: tokens.spacing.md,
              }}
            >
              <Text style={{ fontSize: 28, color: tokens.colors.textInverse, fontWeight: '900' }}>
                {user.firstName?.charAt(0)?.toUpperCase() ?? '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Heading level={3} marginBottom={2}>
                {user.firstName} {user.lastName}
              </Heading>
              <BodyText size="sm" color={tokens.colors.textDisabled}>
                {user.email}
              </BodyText>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: tokens.spacing.xs }}>
                <View
                  style={{
                    backgroundColor: tierColor,
                    paddingHorizontal: tokens.spacing.sm,
                    paddingVertical: 2,
                    borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : 4,
                    marginRight: tokens.spacing.sm,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 10 }}>
                    {user.loyaltyProfile?.tier ?? 'BRONZE'}
                  </Text>
                </View>
                <BodyText size="sm" color={tokens.colors.accent}>
                  {user.loyaltyProfile?.pointsBalance ?? 0} pts
                </BodyText>
              </View>
            </View>
          </View>
        </Card>

        {/* Loyalty summary */}
        <Card marginBottom={tokens.spacing.lg} padding={tokens.spacing.lg}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <BodyText size="sm" color={tokens.colors.textDisabled}>
                Loyalty Points
              </BodyText>
              <Heading level={2} marginBottom={tokens.spacing.xs}>
                {user.loyaltyProfile?.pointsBalance ?? 0}
              </Heading>
              <BodyText size="sm" color={tokens.colors.accent}>
                {tenant.name} member
              </BodyText>
            </View>
            <Button
              label="View Rewards"
              onPress={() => navigation.navigate('Rewards')}
              size="sm"
              variant="outline"
            />
          </View>
        </Card>

        {/* Recent orders */}
        {recentOrders.length > 0 && (
          <>
            <Heading level={3} marginBottom={tokens.spacing.md}>
              Recent Orders
            </Heading>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: tokens.spacing.md, marginBottom: tokens.spacing.lg }}
            >
              {recentOrders.map((order: any) => (
                <Pressable
                  key={order.id}
                  onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
                  style={{
                    width: 220,
                    padding: tokens.spacing.md,
                    backgroundColor: tokens.colors.surface,
                    borderRadius: tokens.borders.radiusMd,
                    borderWidth: 1,
                    borderColor: tokens.colors.borderLight,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm }}>
                    <Icon name="burger" size={24} color={tokens.colors.accent} />
                    <View style={{ flex: 1 }}>
                      <Heading level={4}>{order.id}</Heading>
                      <BodyText size="sm" color={tokens.colors.textDisabled}>
                        ${order.total?.toFixed(2) ?? '0.00'}
                      </BodyText>
                    </View>
                  </View>
                  <BodyText size="sm" color={tokens.colors.textDisabled} numberOfLines={1}>
                    {order.items?.length ?? 0} items • {order.status}
                  </BodyText>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* Menu list */}
        <Heading level={3} marginBottom={tokens.spacing.md}>
          Account
        </Heading>
        {menuItems.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => {
              if (item.key === 'orders') navigation.navigate('HomeScreen');
              if (item.key === 'addresses') navigation.navigate('Rewards');
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: tokens.spacing.md,
              paddingHorizontal: tokens.spacing.md,
              backgroundColor: tokens.colors.surface,
              borderRadius: tokens.borders.radiusMd,
              borderWidth: 1,
              borderColor: tokens.colors.borderLight,
              marginBottom: tokens.spacing.sm,
            }}
          >
            <Icon name={item.icon} size={22} color={tokens.colors.text} />
            <BodyText style={{ flex: 1 }}>{item.label}</BodyText>
            <Text style={{ color: tokens.colors.textDisabled, fontSize: 20 }}>›</Text>
          </Pressable>
        ))}

        <View style={{ height: 40 }} />
      </ScreenLayout>
    </>
  );
};

export default ProfilePage;
