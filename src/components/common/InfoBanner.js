import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const VARIANTS = {
  info: {
    background: 'rgba(255, 255, 255, 0.15)',
    iconColor: '#fff',
    textColor: 'rgba(255, 255, 255, 0.9)',
  },
  warning: {
    background: 'rgba(255, 193, 7, 0.2)',
    iconColor: '#FFC107',
    textColor: 'rgba(255, 255, 255, 0.9)',
  },
  success: {
    background: 'rgba(76, 175, 80, 0.2)',
    iconColor: '#4CAF50',
    textColor: 'rgba(255, 255, 255, 0.9)',
  },
  error: {
    background: 'rgba(244, 67, 54, 0.2)',
    iconColor: '#F44336',
    textColor: 'rgba(255, 255, 255, 0.9)',
  },
};

const InfoBanner = ({
  icon,
  message,
  variant = 'info',
  style,
}) => {
  const variantStyles = VARIANTS[variant] || VARIANTS.info;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: variantStyles.background },
        style,
      ]}
    >
      {icon && (
        <Text style={[styles.icon, { color: variantStyles.iconColor }]}>
          {icon}
        </Text>
      )}
      <Text style={[styles.message, { color: variantStyles.textColor }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 1,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default InfoBanner;
