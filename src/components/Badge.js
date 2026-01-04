import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

const Badge = ({
  label,
  variant = 'primary',
  size = 'md',
  dot = false,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
        };
      case 'success':
        return {
          container: styles.successContainer,
          text: styles.successText,
        };
      case 'warning':
        return {
          container: styles.warningContainer,
          text: styles.warningText,
        };
      case 'error':
        return {
          container: styles.errorContainer,
          text: styles.errorText,
        };
      case 'info':
        return {
          container: styles.infoContainer,
          text: styles.infoText,
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

  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          variantStyles.container,
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        style,
      ]}
    >
      <Text style={[styles.baseText, variantStyles.text, sizeStyles.text]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
  },
  baseText: {
    fontWeight: '600',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
  // Variants
  primaryContainer: {
    backgroundColor: colors.primaryLight + '30',
  },
  primaryText: {
    color: colors.primaryDark,
  },
  secondaryContainer: {
    backgroundColor: colors.secondaryLight + '30',
  },
  secondaryText: {
    color: colors.secondaryDark,
  },
  successContainer: {
    backgroundColor: colors.successLight,
  },
  successText: {
    color: colors.success,
  },
  warningContainer: {
    backgroundColor: colors.warningLight,
  },
  warningText: {
    color: colors.warning,
  },
  errorContainer: {
    backgroundColor: colors.errorLight,
  },
  errorText: {
    color: colors.error,
  },
  infoContainer: {
    backgroundColor: colors.infoLight,
  },
  infoText: {
    color: colors.info,
  },
  // Sizes
  smContainer: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  smText: {
    fontSize: 10,
  },
  mdContainer: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
  },
  mdText: {
    fontSize: 12,
  },
  lgContainer: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  lgText: {
    fontSize: 14,
  },
});

export default Badge;
