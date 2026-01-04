import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography as typographyTheme } from '../theme';

const createTypographyComponent = (variant, defaultColor) => {
  return ({ children, color, style, center, ...props }) => (
    <Text
      style={[
        styles[variant],
        { color: color || defaultColor },
        center && styles.center,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const H1 = createTypographyComponent('h1', colors.gray900);
export const H2 = createTypographyComponent('h2', colors.gray900);
export const H3 = createTypographyComponent('h3', colors.gray900);
export const Body = createTypographyComponent('body', colors.gray700);
export const BodySmall = createTypographyComponent('bodySmall', colors.gray600);
export const Caption = createTypographyComponent('caption', colors.gray500);

const styles = StyleSheet.create({
  h1: {
    ...typographyTheme.h1,
  },
  h2: {
    ...typographyTheme.h2,
  },
  h3: {
    ...typographyTheme.h3,
  },
  body: {
    ...typographyTheme.body,
  },
  bodySmall: {
    ...typographyTheme.bodySmall,
  },
  caption: {
    ...typographyTheme.caption,
  },
  center: {
    textAlign: 'center',
  },
});

export default {
  H1,
  H2,
  H3,
  Body,
  BodySmall,
  Caption,
};
