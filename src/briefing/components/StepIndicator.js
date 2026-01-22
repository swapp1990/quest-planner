import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * StepIndicator - "Step 1 of 3" progress dots
 * Shows current step in the briefing flow
 */
const StepIndicator = ({ currentStep, totalSteps = 3, labels = ['Chat', 'Brief', 'Plan'] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View key={index} style={styles.dotWrapper}>
            <View
              style={[
                styles.dot,
                index < currentStep && styles.dotCompleted,
                index === currentStep && styles.dotActive,
              ]}
            >
              {index < currentStep && <Text style={styles.checkmark}>✓</Text>}
              {index === currentStep && <Text style={styles.dotNumber}>{index + 1}</Text>}
              {index > currentStep && <Text style={styles.dotNumber}>{index + 1}</Text>}
            </View>
            <Text
              style={[
                styles.label,
                index === currentStep && styles.labelActive,
                index < currentStep && styles.labelCompleted,
              ]}
            >
              {labels[index]}
            </Text>
            {/* Connector line */}
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.connector,
                  index < currentStep && styles.connectorCompleted,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dotWrapper: {
    alignItems: 'center',
    position: 'relative',
    width: 80,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#fff',
  },
  dotCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  dotNumber: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    fontWeight: '700',
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  labelActive: {
    color: '#fff',
    fontWeight: '700',
  },
  labelCompleted: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  connector: {
    position: 'absolute',
    top: 15,
    left: 56,
    width: 48,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  connectorCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default StepIndicator;
