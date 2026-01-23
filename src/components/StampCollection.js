import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * StampCollection - Displays earned stamps as a trophy shelf
 * Hidden when no stamps have been earned yet.
 *
 * @param {Array} stamps - Array of earned stamp objects { actIcon, label, chapterId }
 * @param {function} onStampPress - Callback when a stamp is tapped
 */
const StampCollection = ({ stamps = [], onStampPress }) => {
  // Don't render if no stamps earned
  if (!stamps || stamps.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Collection</Text>
      <View style={styles.stampRow}>
        {stamps.map((stamp, index) => (
          <TouchableOpacity
            key={stamp.chapterId || index}
            style={styles.stampItem}
            onPress={() => onStampPress?.(stamp)}
            activeOpacity={0.7}
          >
            <View style={styles.stampCircle}>
              <Text style={styles.stampIcon}>{stamp.actIcon}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  stampRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stampItem: {
    alignItems: 'center',
  },
  stampCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  stampIcon: {
    fontSize: 24,
  },
});

export default StampCollection;
