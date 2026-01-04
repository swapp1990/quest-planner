import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

const Divider = ({
  color = colors.gray200,
  thickness = 1,
  spacing: spacingProp = 'md',
  style,
}) => {
  const getSpacing = () => {
    switch (spacingProp) {
      case 'none':
        return 0;
      case 'sm':
        return spacing.sm;
      case 'lg':
        return spacing.lg;
      default:
        return spacing.md;
    }
  };

  const marginValue = getSpacing();

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical: marginValue,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

export default Divider;
