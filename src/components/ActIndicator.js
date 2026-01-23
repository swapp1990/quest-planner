import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * ActIndicator - Numbered buttons for navigating between acts
 *
 * @param {number} totalActs - Total number of acts
 * @param {number} currentActIndex - Currently displayed act (0-indexed)
 * @param {function} isActUnlocked - Function to check if act is unlocked (index) => boolean
 * @param {function} onActPress - Callback when an act button is pressed (index) => void
 */
const ActIndicator = ({
  totalActs = 4,
  currentActIndex = 0,
  isActUnlocked,
  onActPress,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalActs }, (_, index) => {
        const isUnlocked = isActUnlocked?.(index) ?? index === 0;
        const isCurrent = index === currentActIndex;
        const isLocked = !isUnlocked;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.actButton,
              isCurrent && styles.actButtonCurrent,
              isLocked && styles.actButtonLocked,
            ]}
            onPress={() => !isLocked && onActPress?.(index)}
            disabled={isLocked}
            activeOpacity={0.7}
          >
            {isLocked ? (
              <Text style={styles.lockIcon}>🔒</Text>
            ) : (
              <Text
                style={[
                  styles.actNumber,
                  isCurrent && styles.actNumberCurrent,
                ]}
              >
                {index + 1}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  actButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actButtonCurrent: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actButtonLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  actNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  actNumberCurrent: {
    color: '#C96FB9',
  },
  lockIcon: {
    fontSize: 14,
    opacity: 0.4,
  },
});

export default ActIndicator;
