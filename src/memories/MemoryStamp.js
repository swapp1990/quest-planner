import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

/**
 * MemoryStamp - Individual stamp component
 * States: locked, empty (unlocked but not earned), earned
 */
const MemoryStamp = ({
  actNumber,
  actName,
  actIcon,
  label,
  isLocked = false,
  isEarned = false,
  onPress,
}) => {
  const getStampStyle = () => {
    if (isLocked) return styles.stampLocked;
    if (isEarned) return styles.stampEarned;
    return styles.stampEmpty;
  };

  const getIconStyle = () => {
    if (isLocked) return styles.iconLocked;
    if (isEarned) return styles.iconEarned;
    return styles.iconEmpty;
  };

  const content = (
    <View style={[styles.stamp, getStampStyle()]}>
      {/* Act number badge */}
      <View style={[styles.actBadge, isEarned && styles.actBadgeEarned]}>
        <Text style={[styles.actNumber, isEarned && styles.actNumberEarned]}>
          {actNumber}
        </Text>
      </View>

      {/* Icon */}
      <Text style={[styles.icon, getIconStyle()]}>
        {isLocked ? '🔒' : actIcon}
      </Text>

      {/* Label - only show if earned */}
      {isEarned && label && (
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      )}

      {/* Act name - show if not earned */}
      {!isEarned && !isLocked && (
        <Text style={styles.actNameEmpty} numberOfLines={1}>
          {actName}
        </Text>
      )}
    </View>
  );

  if (isEarned && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  stamp: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderStyle: 'dashed',
  },
  stampEmpty: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  stampEarned: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  actBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actBadgeEarned: {
    backgroundColor: '#4A90E2',
  },
  actNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actNumberEarned: {
    color: '#fff',
  },
  icon: {
    fontSize: 24,
  },
  iconLocked: {
    opacity: 0.3,
    fontSize: 18,
  },
  iconEmpty: {
    opacity: 0.5,
  },
  iconEarned: {
    opacity: 1,
  },
  label: {
    display: 'none', // Hide label on stamp, show in modal
  },
  actNameEmpty: {
    display: 'none', // Hide for cleaner look
  },
});

export default MemoryStamp;
