import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
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

// Active tab icon springs up + scales when focused.
const AnimatedIcon: React.FC<{
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
}> = ({ focused, iconName, size, color }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: focused ? 1.25 : 1, friction: 5, useNativeDriver: true }).start();
    Animated.spring(lift, { toValue: focused ? -4 : 0, friction: 6, useNativeDriver: true }).start();
  }, [focused, scale, lift]);
  return (
    <Animated.View style={{ transform: [{ scale }, { translateY: lift }] }}>
      <Ionicons name={iconName} size={size} color={color} />
    </Animated.View>
  );
};

// Rounded floating bottom bar with an elevated center star button.
export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const insets = useSafeAreaInsets();

  const tabRadius = engine === 'BRUTALIST_MODERNIST' ? 0 : 26;
  const centerButtonRadius = engine === 'BRUTALIST_MODERNIST' ? 0 : 29;
  const tabShadow = engine === 'VIBRANT_STREET_TECH'
    ? { shadowColor: tokens.colors.secondary, shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: 16 }
    : { shadowColor: '#000000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: 16 };

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: tokens.colors.surface,
          borderTopLeftRadius: tabRadius,
          borderTopRightRadius: tabRadius,
          paddingTop: 12,
          paddingBottom: insets.bottom + 8,
          height: 66 + insets.bottom,
          ...(engine === 'BRUTALIST_MODERNIST' ? { borderTopWidth: tokens.borders.widthThick, borderTopColor: tokens.colors.border } : {}),
          ...tabShadow,
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const iconConfig = ICONS[route.name];

          // Center button (the star) = Rewards.
          if (route.name === 'Rewards') {
            const onCenter = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
            };
            return (
              <Pressable key={route.key} onPress={onCenter} style={{ width: 64, alignItems: 'center' }}>
                <View
                  style={{
                    position: 'absolute',
                    top: -26,
                    width: 58,
                    height: 58,
                    borderRadius: centerButtonRadius,
                    backgroundColor: tokens.colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 5,
                    borderColor: tokens.colors.background,
                    ...(engine === 'VIBRANT_STREET_TECH' ? {
                      shadowColor: tokens.colors.accent,
                      shadowOpacity: 0.8,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 10,
                    } : {
                      shadowColor: '#000000',
                      shadowOpacity: 0.22,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 10,
                    }),
                  }}
                >
                  <Ionicons name="star" size={28} color={tokens.colors.textInverse} />
                </View>
              </Pressable>
            );
          }

          const color = focused ? tokens.colors.primary : tokens.colors.textDisabled;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {iconConfig ? (
                <AnimatedIcon focused={focused} iconName={iconConfig.name} size={iconConfig.size} color={color} />
              ) : null}
              <View style={{ marginTop: 5, width: 6, height: 6, borderRadius: 3, backgroundColor: focused ? tokens.colors.primary : 'transparent' }} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
