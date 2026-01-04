import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../theme';

const Card = ({
  children,
  variant = 'elevated',
  padding = 'md',
  onPress,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return styles.outlined;
      case 'filled':
        return styles.filled;
      default:
        return styles.elevated;
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: spacing.sm };
      case 'lg':
        return { padding: spacing.lg };
      default:
        return { padding: spacing.md };
    }
  };

  const cardStyles = [
    styles.base,
    getVariantStyles(),
    getPaddingStyles(),
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
  },
  elevated: {
    ...shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  filled: {
    backgroundColor: colors.gray50,
  },
});

export default Card;
