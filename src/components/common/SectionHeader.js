import React from 'react';
import { Text, StyleSheet } from 'react-native';

const SectionHeader = ({
  title,
  style,
  variant = 'default', // 'default' or 'olive' for green theme
}) => {
  const textColor = variant === 'olive'
    ? 'rgba(85, 107, 47, 0.9)' // Olive/khaki color for green theme
    : 'rgba(255, 255, 255, 0.6)';

  return (
    <Text style={[styles.header, { color: textColor }, style]}>
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 16,
  },
});

export default SectionHeader;
