import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme';
import { cardChrome, type EngineId } from '../components/home/engineStyle';

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
  useEffect(() => {
    if (engine === 'BRUTALIST_MODERNIST') {
      Animated.timing(scale, { toValue: focused ? 1.1 : 1, duration: 200, useNativeDriver: true }).start();
      Animated.timing(lift, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    } else if (engine === 'VIBRANT_STREET_TECH') {
      Animated.spring(scale, { toValue: focused ? 1.3 : 1, friction: 3, tension: 40, useNativeDriver: true }).start();
      Animated.spring(lift, { toValue: focused ? -6 : 0, friction: 4, useNativeDriver: true }).start();
    } else {
      Animated.spring(scale, { toValue: focused ? 1.25 : 1, friction: 5, useNativeDriver: true }).start();
      Animated.spring(lift, { toValue: focused ? -4 : 0, friction: 6, useNativeDriver: true }).start();
    }
  }, [focused, scale, lift, engine]);
  return (
    <Animated.View style={{ transform: [{ scale }, { translateY: lift }] }}>
      <Ionicons name={iconName} size={size} color={color} />
    </Animated.View>
  );
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const insets = useSafeAreaInsets();

  // ---- BRUTALIST: Sharp rectangle, no rounded corners, thick top border
  if (engine === 'BRUTALIST_MODERNIST') {
    return (
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: tokens.colors.surface,
            borderTopWidth: tokens.borders.widthThick,
            borderTopColor: tokens.colors.border,
            paddingTop: 8,
            paddingBottom: insets.bottom + 4,
            height: 60 + insets.bottom,
          }}
        >
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const iconConfig = ICONS[route.name];
            if (route.name === 'Rewards') {
              return (
                <Pressable key={route.key} onPress={() => navigation.navigate(route.name as never)} style={{ alignItems: 'center' }}>
                  <View style={{ width: 48, height: 48, backgroundColor: tokens.colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: tokens.borders.widthMedium, borderColor: tokens.colors.border }}>
                    <Ionicons name="star" size={24} color={tokens.colors.textInverse} />
                  </View>
                </Pressable>
              );
            }
            const color = focused ? tokens.colors.textInverse : tokens.colors.textDisabled;
            return (
              <Pressable key={route.key} onPress={() => navigation.navigate(route.name as never)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {iconConfig ? <AnimatedIcon focused={focused} iconName={iconConfig.name} size={iconConfig.size} color={color} engine={engine} /> : null}
                {focused && <Text style={{ fontSize: 8, fontWeight: '900', color: tokens.colors.primary, textTransform: 'uppercase', marginTop: 2 }}>{LABELS[route.name]}</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  // ---- VIBRANT: Dark surface, neon top border, glow on active
  if (engine === 'VIBRANT_STREET_TECH') {
    return (
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: '#1A1F2E',
            borderTopWidth: tokens.borders.widthThin,
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
                      borderColor: '#1A1F2E',
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
                {iconConfig ? <AnimatedIcon focused={focused} iconName={iconConfig.name} size={iconConfig.size} color={color} engine={engine} /> : null}
                {focused && <View style={{ marginTop: 4, width: 24, height: 2, backgroundColor: tokens.colors.secondary, shadowColor: tokens.colors.secondary, shadowOpacity: 1, shadowRadius: 4 }} />}
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  // ---- MINIMALIST: Rounded top corners, soft shadow, frosted glass, labels always visible
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: 'rgba(255,255,255,0.92)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 10,
          paddingBottom: insets.bottom + 6,
          height: 64 + insets.bottom,
          shadowColor: '#000000',
          shadowOpacity: 0.08,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: -4 },
          elevation: 8,
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const iconConfig = ICONS[route.name];
          if (route.name === 'Rewards') {
            return (
              <Pressable key={route.key} onPress={() => navigation.navigate(route.name as never)} style={{ width: 64, alignItems: 'center' }}>
                <View
                  style={{
                    position: 'absolute',
                    top: -22,
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    backgroundColor: tokens.colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 4,
                    borderColor: 'rgba(255,255,255,0.92)',
                    shadowColor: '#000000',
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 8,
                  }}
                >
                  <Ionicons name="star" size={26} color={tokens.colors.textInverse} />
                </View>
                <Text style={{ fontSize: 8, fontWeight: '600', color: tokens.colors.primary, marginTop: 32 }}>{LABELS[route.name]}</Text>
              </Pressable>
            );
          }
          const color = focused ? tokens.colors.primary : tokens.colors.textDisabled;
          return (
            <Pressable key={route.key} onPress={() => navigation.navigate(route.name as never)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {iconConfig ? <AnimatedIcon focused={focused} iconName={iconConfig.name} size={22} color={color} engine={engine} /> : null}
              <Text style={{ fontSize: 9, fontWeight: focused ? '600' : '400', color, marginTop: 2 }}>{LABELS[route.name]}</Text>
              {focused && <View style={{ marginTop: 2, width: 4, height: 4, borderRadius: 2, backgroundColor: tokens.colors.primary }} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
