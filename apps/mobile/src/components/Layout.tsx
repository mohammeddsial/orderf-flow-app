import React, { ReactNode } from 'react';
import { View, ScrollView, Text, Pressable, Image, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { cardChrome, pillChrome, sectionTitleStyle, type EngineId } from './home/engineStyle';
import { AnimatedPressable } from './shared/AnimatedPressable';

interface LayoutProps {
  children: ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  paddingHorizontal?: number;
}

export const ScreenLayout: React.FC<LayoutProps> = ({
  children,
  scrollable = true,
  backgroundColor,
  paddingHorizontal = 16,
}) => {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  if (Platform.OS === 'web') {
    const bgColor = backgroundColor || tokens.colors.background;
    return (
      <div
        style={{
          height: `${screenHeight}px`,
          boxSizing: 'border-box',
          overflowY: scrollable ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch',
          backgroundColor: bgColor,
          paddingLeft: `${paddingHorizontal}px`,
          paddingRight: `${paddingHorizontal}px`,
          paddingTop: `${insets.top || 0}px`,
          paddingBottom: `${insets.bottom || 0}px`,
        }}
      >
        {children}
      </div>
    );
  }

  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor || tokens.colors.background,
      }}
    >
      <Container
        style={{
          flex: 1,
          paddingHorizontal,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

interface SolidHeaderProps {
  title: string;
  onBackPress: () => void;
  rightAction?: ReactNode;
  backgroundColor?: string;
}

export const SolidHeader: React.FC<SolidHeaderProps> = ({
  title,
  onBackPress,
  rightAction,
  backgroundColor,
}) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  return (
    <View
      style={{
        backgroundColor: backgroundColor || tokens.colors.surface,
        borderBottomColor: tokens.colors.border,
        borderBottomWidth: engine === 'BRUTALIST_MODERNIST' ? tokens.borders.widthMedium : tokens.borders.widthThin,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Pressable
        onPress={onBackPress}
        style={{
          paddingHorizontal: tokens.spacing.sm,
          paddingVertical: tokens.spacing.sm,
        }}
      >
        <Text
          style={{
            fontSize: tokens.typography.fontSizeLg,
            fontWeight: '600',
            color: tokens.colors.text,
          }}
        >
          ←
        </Text>
      </Pressable>

      <Text
        style={{
          fontSize: tokens.typography.fontSizeLg,
          fontWeight: '700',
          color: tokens.colors.text,
          flex: 1,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>

      <View style={{ width: 40 }}>{rightAction}</View>
    </View>
  );
};

interface OverlayHeaderProps {
  onBackPress: () => void;
  onClosePress?: () => void;
  style?: any;
}

export const OverlayHeader: React.FC<OverlayHeaderProps> = ({
  onBackPress,
  onClosePress,
  style,
}) => {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          position: 'absolute',
          top: insets.top + tokens.spacing.md,
          left: 0,
          right: 0,
          paddingHorizontal: tokens.spacing.md,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        },
        style,
      ]}
    >
      <Pressable
        onPress={onBackPress}
        style={{
          width: 40,
          height: 40,
          borderRadius: tokens.borders.radiusSm,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 20, color: '#FFFFFF', fontWeight: '700' }}>←</Text>
      </Pressable>

      {onClosePress && (
        <Pressable
          onPress={onClosePress}
          style={{
            width: 40,
            height: 40,
            borderRadius: tokens.borders.radiusSm,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24, color: '#FFFFFF', fontWeight: '700' }}>✕</Text>
        </Pressable>
      )}
    </View>
  );
};

interface DismissalHeaderProps {
  onDismiss: () => void;
}

export const DismissalHeader: React.FC<DismissalHeaderProps> = ({ onDismiss }) => {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}
    >
      <Pressable
        onPress={onDismiss}
        style={{
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: tokens.spacing.sm,
        }}
      >
        <Text
          style={{
            fontSize: tokens.typography.fontSizeMd,
            color: tokens.colors.text,
            textDecorationLine: 'underline',
          }}
        >
          Skip
        </Text>
      </Pressable>
    </View>
  );
};

interface CardProps {
  children: ReactNode;
  backgroundColor?: string;
  padding?: number;
  marginBottom?: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shadow?: boolean;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  backgroundColor,
  padding,
  marginBottom,
  borderColor,
  borderWidth,
  borderRadius,
  shadow = false,
  onPress,
}) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const chrome = cardChrome(tokens, engine);

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={!onPress}
      style={{
        ...chrome,
        backgroundColor: backgroundColor || chrome.backgroundColor,
        padding: padding || tokens.spacing.md,
        marginBottom: marginBottom || tokens.spacing.md,
        ...(borderColor ? { borderColor } : {}),
        ...(borderWidth !== undefined ? { borderWidth } : {}),
        ...(borderRadius !== undefined ? { borderRadius } : {}),
        ...(shadow ? {
          shadowColor: engine === 'VIBRANT_STREET_TECH' ? tokens.colors.secondary : '#000000',
          shadowOpacity: engine === 'VIBRANT_STREET_TECH' ? 0.5 : 0.08,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 14,
          elevation: 4,
        } : {}),
      }}
    >
      {children}
    </AnimatedPressable>
  );
};

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'md',
}) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: tokens.colors.primary,
          borderColor: tokens.colors.primary,
          textColor: tokens.colors.textInverse,
        };
      case 'secondary':
        return {
          backgroundColor: tokens.colors.secondary,
          borderColor: tokens.colors.secondary,
          textColor: tokens.colors.textInverse,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: tokens.colors.border,
          textColor: tokens.colors.text,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: tokens.spacing.sm,
          paddingHorizontal: tokens.spacing.md,
          fontSize: tokens.typography.fontSizeSm,
        };
      case 'lg':
        return {
          paddingVertical: tokens.spacing.lg,
          paddingHorizontal: tokens.spacing.xl,
          fontSize: tokens.typography.fontSizeLg,
        };
      case 'md':
      default:
        return {
          paddingVertical: tokens.spacing.md,
          paddingHorizontal: tokens.spacing.lg,
          fontSize: tokens.typography.fontSizeMd,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const buttonRadius = engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusPill;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: variantStyles.backgroundColor,
        borderColor: variantStyles.borderColor,
        borderWidth: variant === 'outline' ? tokens.borders.widthThin : 0,
        borderRadius: buttonRadius,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
        ...sizeStyles,
      }}
    >
      <Text
        style={{
          color: variantStyles.textColor,
          fontWeight: engine === 'BRUTALIST_MODERNIST' ? '900' : '700',
          fontSize: sizeStyles.fontSize,
          textTransform: engine === 'BRUTALIST_MODERNIST' ? 'uppercase' : 'none',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

interface HeadingProps {
  level: 1 | 2 | 3 | 4;
  children: ReactNode;
  color?: string;
  marginBottom?: number;
  style?: any;
}

export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  color,
  marginBottom,
  style,
}) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;

  const fontSizes = [
    tokens.typography.fontSizeXl,
    tokens.typography.fontSizeLg,
    tokens.typography.fontSizeMd,
    tokens.typography.fontSizeSm,
  ];

  const titleStyle = sectionTitleStyle(tokens, engine);

  return (
    <Text
      style={[{
        fontSize: fontSizes[level - 1],
        fontWeight: level <= 2 ? titleStyle.fontWeight : '700',
        color: color || tokens.colors.text,
        marginBottom: marginBottom || tokens.spacing.sm,
        ...(level <= 2 ? {
          textTransform: titleStyle.textTransform as any,
          letterSpacing: titleStyle.letterSpacing,
        } : {}),
      }, style]}
    >
      {children}
    </Text>
  );
};

interface BodyTextProps {
  children: ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  marginBottom?: number;
  numberOfLines?: number;
  style?: any;
}

export const BodyText: React.FC<BodyTextProps> = ({
  children,
  color,
  size = 'md',
  marginBottom,
  numberOfLines,
  style,
}) => {
  const { tokens } = useTheme();

  const fontSizes = {
    sm: tokens.typography.fontSizeSm,
    md: tokens.typography.fontSizeMd,
    lg: tokens.typography.fontSizeLg,
  };

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontSize: fontSizes[size],
        color: color || tokens.colors.text,
        marginBottom: marginBottom || 0,
        lineHeight: fontSizes[size] * 1.5,
      }, style]}
    >
      {children}
    </Text>
  );
};

interface HeroImageProps {
  source: { uri: string };
  aspectRatio?: number;
}

export const HeroImage: React.FC<HeroImageProps> = ({ source, aspectRatio = 16 / 9 }) => {
  return (
    <Image
      source={source}
      style={{
        width: '100%',
        aspectRatio,
        backgroundColor: '#E0E0E0',
      }}
      resizeMode="cover"
    />
  );
};
