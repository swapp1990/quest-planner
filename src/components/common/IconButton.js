import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

const SIZES = {
  sm: 36,
  md: 44,
  lg: 56,
};

const ICON_SIZES = {
  sm: 16,
  md: 20,
  lg: 26,
};

const IconButton = ({
  icon,
  selected = false,
  onPress,
  size = 'md',
  color = 'rgba(0, 0, 0, 0.15)',
  selectedColor = '#CDDC39',
  iconColor = '#fff',
  selectedIconColor = '#333',
  style,
}) => {
  const buttonSize = SIZES[size] || SIZES.md;
  const iconSize = ICON_SIZES[size] || ICON_SIZES.md;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          backgroundColor: selected ? selectedColor : color,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {typeof icon === 'string' ? (
        <Text
          style={[
            styles.iconText,
            {
              fontSize: iconSize,
              color: selected ? selectedIconColor : iconColor,
            },
          ]}
        >
          {icon}
        </Text>
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    textAlign: 'center',
  },
});

export default IconButton;
