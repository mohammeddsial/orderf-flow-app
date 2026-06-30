import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated, Text, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme';
import { cardChrome, type EngineId } from '../components/home/engineStyle';
import { getAnimationConfig } from '../theme/animations';
import { WaveNotch } from '../components/navigation/WaveNotch';
import { TabBarIndicator } from '../components/navigation/TabBarIndicator';

const { width: SCREEN_W } = Dimensions.get('window');

const ICONS: Record<string, { name: keyof typeof Ionicons.glyphMap; size: number }> = {
  Home: { name: 'home', size: 24 },
  Menu: { name: 'restaurant', size: 24 },
  CartTab: { name: 'cart', size: 24 },
  Rewards: { name: 'star', size: 24 },
  Promotions: { name: 'gift', size: 24 },
  Profile: { name: 'person', size: 24 },
};

const LABELS: Record<string, string> = {
  Home: 'Home',
  Menu: 'Menu',
  CartTab: 'Cart',
  Rewards: 'Rewards',
  Promotions: 'Offers',
  Profile: 'Profile',
};

const AnimatedIcon: React.FC<{
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  engine: EngineId;
}> = ({ focused, iconName, size, color, engine }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const config = getAnimationConfig(engine);

  useEffect(() => {
    if (engine === 'VIBRANT_STREET_TECH') {
      Animated.spring(scale, { toValue: focused ? config.iconScaleActive : config.iconScaleInactive, friction: 3, tension: 40, useNativeDriver: true }).start();
      Animated.spring(lift, { toValue: focused ? -6 : 0, friction: 4, useNativeDriver: true }).start();
    } else {
      Animated.timing(scale, { toValue: focused ? config.iconScaleActive : config.iconScaleInactive, duration: config.tabSwitchDuration, useNativeDriver: true }).start();
      Animated.timing(lift, { toValue: focused ? -4 : 0, duration: config.tabSwitchDuration, useNativeDriver: true }).start();
    }
  }, [focused, scale, lift, engine, config]);

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY: lift }] }}>
      <Ionicons name={iconName} size={size} color={color} />
    </Animated.View>
  );
};

// ─── BRUTALIST: Solid colored bg, SVG wave notch + FAB, icon-only, hard snap ───
const BrutalistTabBar: React.FC<BottomTabBarProps & { tokens: any }> = ({ state, navigation, tokens }) => {
  const insets = useSafeAreaInsets();
  const barHeight = 60 + insets.bottom;
  const notchRadius = 28;

  const nonCenterRoutes = state.routes.filter((r) => r.name !== 'Rewards');
  const leftRoutes = nonCenterRoutes.slice(0, 2);
  const rightRoutes = nonCenterRoutes.slice(2);

  const renderTab = (route: any, index: number) => {
    const focused = state.index === state.routes.indexOf(route);
    const iconConfig = ICONS[route.name];
    if (!iconConfig) return null;
    const color = focused ? '#FFFFFF' : 'rgba(255,255,255,0.6)';

    return (
      <Pressable
        key={route.key}
        onPress={() => navigation.navigate(route.name as never)}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <AnimatedIcon focused={focused} iconName={iconConfig.name} size={iconConfig.size} color={color} engine="BRUTALIST_MODERNIST" />
      </Pressable>
    );
  };

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <View style={{ height: barHeight }}>
        <WaveNotch width={SCREEN_W} height={barHeight} notchRadius={notchRadius} backgroundColor={tokens.colors.primary} />

        <View style={{ flexDirection: 'row', alignItems: 'center', height: barHeight, paddingBottom: insets.bottom }}>
          {leftRoutes.map(renderTab)}

          <View style={{ width: 80, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable
              onPress={() => navigation.navigate('Rewards' as never)}
              style={{
                width: 56,
                height: 56,
                borderRadius: 0,
                backgroundColor: tokens.colors.textInverse,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: tokens.colors.border,
                marginTop: -20,
              }}
            >
              <Ionicons name="star" size={28} color={tokens.colors.primary} />
            </Pressable>
          </View>

          {rightRoutes.map(renderTab)}
        </View>
      </View>
    </View>
  );
};

// ─── MINIMALIST: Floating capsule, white bg, active pill behind icon+label ───
const MinimalistTabBar: React.FC<BottomTabBarProps & { tokens: any }> = ({ state, navigation, tokens }) => {
  const insets = useSafeAreaInsets();
  const labelOpacity = useRef(new Animated.Value(0)).current;

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 12 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginHorizontal: 16,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 30,
          paddingVertical: 8,
          paddingHorizontal: 8,
          height: 60,
          shadowColor: '#000000',
          shadowOpacity: 0.08,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const iconConfig = ICONS[route.name];
          if (!iconConfig) return null;

          if (route.name === 'Rewards') {
            return (
              <Pressable key={route.key} onPress={() => navigation.navigate(route.name as never)} style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: tokens.colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: -28,
                    shadowColor: '#000000',
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 6,
                  }}
                >
                  <Ionicons name="star" size={24} color={tokens.colors.textInverse} />
                </View>
              </Pressable>
            );
          }

          const color = focused ? tokens.colors.primary : tokens.colors.textDisabled;

          return (
            <Pressable key={route.key} onPress={() => navigation.navigate(route.name as never)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  backgroundColor: focused ? tokens.colors.accentLight + '40' : 'transparent',
                }}
              >
                <AnimatedIcon focused={focused} iconName={iconConfig.name} size={22} color={color} engine="MINIMALIST_CLEAN" />
                {focused && (
                  <Animated.Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color,
                      opacity: labelOpacity,
                    }}
                  >
                    {LABELS[route.name]}
                  </Animated.Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

// ─── VIBRANT: Dark translucent, neon glow, dot indicator, spring bounce ───
const VibrantTabBar: React.FC<BottomTabBarProps & { tokens: any }> = ({ state, navigation, tokens }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: 'rgba(10,14,19,0.88)',
          borderTopWidth: 1,
          borderTopColor: tokens.colors.secondary,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          paddingTop: 12,
          paddingBottom: insets.bottom + 8,
          height: 66 + insets.bottom,
          shadowColor: tokens.colors.secondary,
          shadowOpacity: 0.5,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
          elevation: 16,
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const iconConfig = ICONS[route.name];
          if (!iconConfig) return null;

          if (route.name === 'Rewards') {
            return (
              <Pressable key={route.key} onPress={() => navigation.navigate(route.name as never)} style={{ width: 64, alignItems: 'center' }}>
                <View
                  style={{
                    position: 'absolute',
                    top: -26,
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    backgroundColor: tokens.colors.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 5,
                    borderColor: 'rgba(10,14,19,0.88)',
                    shadowColor: tokens.colors.accent,
                    shadowOpacity: 0.8,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 10,
                  }}
                >
                  <Ionicons name="star" size={28} color="#FFFFFF" />
                </View>
              </Pressable>
            );
          }

          const color = focused ? tokens.colors.secondary : '#555';
          return (
            <Pressable key={route.key} onPress={() => navigation.navigate(route.name as never)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <AnimatedIcon focused={focused} iconName={iconConfig.name} size={iconConfig.size} color={color} engine="VIBRANT_STREET_TECH" />
              {focused && (
                <View
                  style={{
                    marginTop: 4,
                    width: 24,
                    height: 2,
                    backgroundColor: tokens.colors.secondary,
                    shadowColor: tokens.colors.secondary,
                    shadowOpacity: 1,
                    shadowRadius: 4,
                  }}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

// ─── Main export — switches on engine ───
export const CustomTabBar: React.FC<BottomTabBarProps> = (props) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  if (engine === 'BRUTALIST_MODERNIST') {
    return <BrutalistTabBar {...props} tokens={tokens} />;
  }
  if (engine === 'VIBRANT_STREET_TECH') {
    return <VibrantTabBar {...props} tokens={tokens} />;
  }
  return <MinimalistTabBar {...props} tokens={tokens} />;
};

export default CustomTabBar;
