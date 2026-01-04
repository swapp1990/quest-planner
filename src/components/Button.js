import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
        };
      case 'outline':
        return {
          container: styles.outlineContainer,
          text: styles.outlineText,
        };
      case 'ghost':
        return {
          container: styles.ghostContainer,
          text: styles.ghostText,
        };
      default:
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.smContainer,
          text: styles.smText,
        };
      case 'lg':
        return {
          container: styles.lgContainer,
          text: styles.lgText,
        };
      default:
        return {
          container: styles.mdContainer,
          text: styles.mdText,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.baseText, variantStyles.text, sizeStyles.text]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  baseText: {
    ...typography.button,
  },
  disabled: {
    opacity: 0.5,
  },
  // Variants
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryContainer: {
    backgroundColor: colors.secondary,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: colors.primary,
  },
  // Sizes
  smContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  smText: {
    fontSize: 14,
  },
  mdContainer: {
    paddingVertical: spacing.md - 4,
    paddingHorizontal: spacing.lg,
  },
  mdText: {
    fontSize: 16,
  },
  lgContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  lgText: {
    fontSize: 18,
  },
});

export default Button;
