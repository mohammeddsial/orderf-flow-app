import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme';
import HomePage from '../screens/HomePage';
import MenuPage from '../screens/MenuPage';
import ProductDetailPage from '../screens/ProductDetailPage';
import CartPage from '../screens/CartPage';
import UpsellPage from '../screens/UpsellPage';
import CheckoutPage from '../screens/CheckoutPage';
import DeliveryConfigPage from '../screens/DeliveryConfigPage';
import OrderSuccessPage from '../screens/OrderSuccessPage';
import RewardsPage from '../screens/RewardsPage';
import ReviewPage from '../screens/ReviewPage';

const HomeStack = createStackNavigator();
const MenuStack = createStackNavigator();
const RewardsStack = createStackNavigator();
const CheckoutStack = createStackNavigator();
const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screen for the Cart tab — the tab never renders its own content;
// its press is intercepted to open the checkout modal. Defined at module scope
// so it has a stable identity across renders.
const EmptyScreen = () => <View />;

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={HomePage} />
    <HomeStack.Screen name="ProductDetail" component={ProductDetailPage} />
    <HomeStack.Screen name="Rewards" component={RewardsPage} />
    <HomeStack.Screen name="Review" component={ReviewPage} />
  </HomeStack.Navigator>
);

const MenuStackNavigator = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="MenuScreen" component={MenuPage} />
    <MenuStack.Screen name="ProductDetail" component={ProductDetailPage} />
  </MenuStack.Navigator>
);

const RewardsStackNavigator = () => (
  <RewardsStack.Navigator screenOptions={{ headerShown: false }}>
    <RewardsStack.Screen name="RewardsScreen" component={RewardsPage} />
  </RewardsStack.Navigator>
);

const CheckoutStackNavigator = () => (
  <CheckoutStack.Navigator screenOptions={{ headerShown: false }}>
    <CheckoutStack.Screen name="CartScreen" component={CartPage} />
    <CheckoutStack.Screen name="Upsell" component={UpsellPage} />
    <CheckoutStack.Screen name="DeliveryConfig" component={DeliveryConfigPage} />
    <CheckoutStack.Screen name="Checkout" component={CheckoutPage} />
    <CheckoutStack.Screen
      name="OrderSuccess"
      component={OrderSuccessPage}
      options={{ gestureEnabled: false }}
    />
  </CheckoutStack.Navigator>
);

const BottomTabNavigator = () => {
  const { tokens } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.textDisabled,
        tabBarStyle: {
          backgroundColor: tokens.colors.surface,
          borderTopColor: tokens.colors.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuStackNavigator}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🍔</Text>,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={EmptyScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🛒</Text>,
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('CheckoutFlow');
          },
        })}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsStackNavigator}
        options={{
          tabBarLabel: 'Rewards',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>⭐</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const { tokens } = useTheme();

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: tokens.colors.background },
        }}
      >
        <RootStack.Screen name="MainApp" component={BottomTabNavigator} />
        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen name="CheckoutFlow" component={CheckoutStackNavigator} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
