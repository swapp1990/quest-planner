import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ListRow = ({
  icon,
  iconBackground = 'rgba(0, 0, 0, 0.15)',
  label,
  value,
  badge,
  showChevron = true,
  onPress,
  disabled = false,
  style,
  // Theme variants
  variant = 'default', // 'default' or 'solid'
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress
    ? { onPress, disabled, activeOpacity: 0.7 }
    : {};

  // Solid variant uses brighter, more opaque background (for green theme)
  const rowBackground = variant === 'solid'
    ? 'rgba(255, 255, 255, 0.18)'
    : 'rgba(255, 255, 255, 0.1)';

  return (
    <Container
      style={[
        styles.container,
        { backgroundColor: rowBackground },
        disabled && styles.disabled,
        style,
      ]}
      {...containerProps}
    >
      {/* Icon */}
      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
          {typeof icon === 'string' ? (
            <Text style={styles.iconText}>{icon}</Text>
          ) : (
            icon
          )}
        </View>
      )}

      {/* Badge (e.g., heart) */}
      {badge && <View style={styles.badgeContainer}>{badge}</View>}

      {/* Label */}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>

      {/* Value (right side) */}
      {value && (
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      )}

      {/* Chevron */}
      {showChevron && (
        <Text style={styles.chevron}>›</Text>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    minHeight: 64,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  badgeContainer: {
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 8,
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 4,
  },
});

export default ListRow;
