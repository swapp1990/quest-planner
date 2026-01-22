import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * ChoiceChips - Horizontal chip selection with haptics
 * Options appear with staggered animation
 */
const ChoiceChips = ({ options, onSelect, isVisible = true }) => {
  const fadeAnims = useRef(options.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(options.map(() => new Animated.Value(30))).current;

  useEffect(() => {
    if (isVisible) {
      // Stagger the chip animations
      const animations = options.map((_, index) =>
        Animated.parallel([
          Animated.timing(fadeAnims[index], {
            toValue: 1,
            duration: 250,
            delay: index * 80,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnims[index], {
            toValue: 0,
            friction: 8,
            tension: 100,
            delay: index * 80,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.stagger(80, animations).start();
    }
  }, [isVisible, options.length]);

  const handlePress = (option) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(option);
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <Animated.View
          key={option.id}
          style={{
            opacity: fadeAnims[index],
            transform: [{ translateY: slideAnims[index] }],
          }}
        >
          <TouchableOpacity
            style={styles.chip}
            onPress={() => handlePress(option)}
            activeOpacity={0.7}
          >
            {option.icon && <Text style={styles.icon}>{option.icon}</Text>}
            <Text style={styles.label}>{option.label}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    paddingLeft: 44, // Align with chat bubble content
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ChoiceChips;
