import React, { ReactNode } from 'react';
import { View, ScrollView, Text, Pressable, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

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
  const { tokens } = useTheme();

  return (
    <View
      style={{
        backgroundColor: backgroundColor || tokens.colors.surface,
        borderBottomColor: tokens.colors.border,
        borderBottomWidth: tokens.borders.widthThin,
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
  const { tokens } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={{
        backgroundColor: backgroundColor || tokens.colors.surface,
        padding: padding || tokens.spacing.md,
        marginBottom: marginBottom || tokens.spacing.md,
        borderColor: borderColor || tokens.colors.border,
        borderWidth: borderWidth || 0,
        borderRadius: borderRadius || tokens.borders.radiusMd,
        shadowColor: shadow ? '#000000' : 'transparent',
        shadowOpacity: shadow ? 0.1 : 0,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: shadow ? 4 : 0,
        elevation: shadow ? 3 : 0,
      }}
    >
      {children}
    </Pressable>
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
  const { tokens } = useTheme();

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

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: variantStyles.backgroundColor,
        borderColor: variantStyles.borderColor,
        borderWidth: variant === 'outline' ? tokens.borders.widthThin : 0,
        borderRadius: tokens.borders.radiusMd,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
        ...sizeStyles,
      }}
    >
      <Text
        style={{
          color: variantStyles.textColor,
          fontWeight: '600',
          fontSize: sizeStyles.fontSize,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

interface HeadingProps {
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  color?: string;
  marginBottom?: number;
  style?: any;
}

export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  color,
  marginBottom,
}) => {
  const { tokens } = useTheme();

  const fontSizes = [
    tokens.typography.fontSizeXl,
    tokens.typography.fontSizeLg,
    tokens.typography.fontSizeMd,
    tokens.typography.fontSizeSm,
  ];

  return (
    <Text
      style={{
        fontSize: fontSizes[level - 1],
        fontWeight: '700',
        color: color || tokens.colors.text,
        marginBottom: marginBottom || tokens.spacing.sm,
      }}
    >
      {children}
    </Text>
  );
};

interface BodyTextProps {
  children: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  marginBottom?: number;
  style?: any;
  numberOfLines?: number;
}

export const BodyText: React.FC<BodyTextProps> = ({
  children,
  color,
  size = 'md',
  marginBottom,
}) => {
  const { tokens } = useTheme();

  const fontSizes = {
    sm: tokens.typography.fontSizeSm,
    md: tokens.typography.fontSizeMd,
    lg: tokens.typography.fontSizeLg,
  };

  return (
    <Text
      style={{
        fontSize: fontSizes[size],
        color: color || tokens.colors.text,
        marginBottom: marginBottom || 0,
        lineHeight: fontSizes[size] * 1.5,
      }}
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
