import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ModalHeader = ({
  title,
  onClose,
  onAction,
  actionIcon,
  showBackArrow = false,
  closeIcon = '✕',
  buttonStyle = 'dark', // 'dark' for green theme, 'light' for purple/orange
  style,
}) => {
  const buttonBg = buttonStyle === 'dark'
    ? 'rgba(0, 0, 0, 0.2)'
    : 'rgba(255, 255, 255, 0.2)';

  return (
    <View style={[styles.container, style]}>
      {/* Left Button (Close or Back) */}
      {onClose ? (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBg }]}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {showBackArrow ? '‹' : closeIcon}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonPlaceholder} />
      )}

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right Action Button */}
      {onAction && actionIcon ? (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBg }]}
          onPress={onAction}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{actionIcon}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPlaceholder: {
    width: 44,
    height: 44,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ModalHeader;
