import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../theme';

const Avatar = ({
  source,
  name,
  size = 'md',
  style,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return { container: styles.xs, text: styles.xsText };
      case 'sm':
        return { container: styles.sm, text: styles.smText };
      case 'lg':
        return { container: styles.lg, text: styles.lgText };
      case 'xl':
        return { container: styles.xl, text: styles.xlText };
      default:
        return { container: styles.md, text: styles.mdText };
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getBackgroundColor = (name) => {
    const avatarColors = [
      colors.primary,
      colors.secondary,
      colors.success,
      colors.warning,
      colors.info,
    ];
    if (!name) return avatarColors[0];
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
  };

  const sizeStyles = getSizeStyles();

  if (source) {
    return (
      <Image
        source={source}
        style={[styles.base, sizeStyles.container, style]}
      />
    );
  }

  return (
    <View
      style={[
        styles.base,
        styles.initialsContainer,
        sizeStyles.container,
        { backgroundColor: getBackgroundColor(name) },
        style,
      ]}
    >
      <Text style={[styles.initials, sizeStyles.text]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '600',
  },
  xs: {
    width: 24,
    height: 24,
  },
  xsText: {
    fontSize: 10,
  },
  sm: {
    width: 32,
    height: 32,
  },
  smText: {
    fontSize: 12,
  },
  md: {
    width: 40,
    height: 40,
  },
  mdText: {
    fontSize: 14,
  },
  lg: {
    width: 56,
    height: 56,
  },
  lgText: {
    fontSize: 20,
  },
  xl: {
    width: 80,
    height: 80,
  },
  xlText: {
    fontSize: 28,
  },
});

export default Avatar;
