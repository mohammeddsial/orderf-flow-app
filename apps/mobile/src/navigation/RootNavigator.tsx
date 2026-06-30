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
import OrderTrackingPage from '../screens/OrderTrackingPage';
import RewardsPage from '../screens/RewardsPage';
import ReviewPage from '../screens/ReviewPage';
import ProfilePage from '../screens/ProfilePage';
import SearchPage from '../screens/SearchPage';
import OrderHistoryPage from '../screens/OrderHistoryPage';
import AddressPage from '../screens/AddressPage';
import PromotionsPage from '../screens/PromotionsPage';
import { CustomTabBar } from './CustomTabBar';

const HomeStack = createStackNavigator();
const MenuStack = createStackNavigator();
const RewardsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const PromotionsStack = createStackNavigator();
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
    <HomeStack.Screen name="OrderTracking" component={OrderTrackingPage} />
  </HomeStack.Navigator>
);

const MenuStackNavigator = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="MenuScreen" component={MenuPage} />
    <MenuStack.Screen name="ProductDetail" component={ProductDetailPage} />
    <MenuStack.Screen name="Search" component={SearchPage} />
  </MenuStack.Navigator>
);

const RewardsStackNavigator = () => (
  <RewardsStack.Navigator screenOptions={{ headerShown: false }}>
    <RewardsStack.Screen name="RewardsScreen" component={RewardsPage} />
  </RewardsStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileScreen" component={ProfilePage} />
    <ProfileStack.Screen name="OrderHistory" component={OrderHistoryPage} />
    <ProfileStack.Screen name="AddressPage" component={AddressPage} />
  </ProfileStack.Navigator>
);

const PromotionsStackNavigator = () => (
  <PromotionsStack.Navigator screenOptions={{ headerShown: false }}>
    <PromotionsStack.Screen name="PromotionsScreen" component={PromotionsPage} />
  </PromotionsStack.Navigator>
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
    <CheckoutStack.Screen name="OrderTracking" component={OrderTrackingPage} />
  </CheckoutStack.Navigator>
);

const BottomTabNavigator = () => {
  const { tokens } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.textDisabled,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Menu" component={MenuStackNavigator} />
      <Tab.Screen
        name="CartTab"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('CheckoutFlow');
          },
        })}
      />
      <Tab.Screen name="Rewards" component={RewardsStackNavigator} />
      <Tab.Screen name="Promotions" component={PromotionsStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
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
          cardStyle: { backgroundColor: tokens.colors.background, overflow: 'visible' },
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
