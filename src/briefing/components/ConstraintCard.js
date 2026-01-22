import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * ConstraintCard - Tap-to-toggle constraint display
 * Shows a constraint with its current value, allows cycling through options
 */
const ConstraintCard = ({
  name,
  icon,
  label,
  description,
  options,
  currentValue,
  onToggle,
  index = 0,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 80,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Quick scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Cycle to next option
    const optionKeys = Object.keys(options);
    const currentIndex = optionKeys.indexOf(currentValue);
    const nextIndex = (currentIndex + 1) % optionKeys.length;
    onToggle(optionKeys[nextIndex]);
  };

  const currentOption = options[currentValue];

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.9}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{currentOption?.icon || icon}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.valueRow}>
            <Text style={styles.label}>{currentOption?.label || label}</Text>
            <Text style={styles.tapHint}>tap to change</Text>
          </View>
          <Text style={styles.description}>{currentOption?.description || description}</Text>
        </View>
        <View style={styles.chevron}>
          <Text style={styles.chevronIcon}>↻</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#333',
    fontSize: 17,
    fontWeight: '700',
  },
  tapHint: {
    color: '#aaa',
    fontSize: 11,
    fontStyle: 'italic',
  },
  description: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  chevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronIcon: {
    color: '#666',
    fontSize: 18,
  },
});

export default ConstraintCard;
