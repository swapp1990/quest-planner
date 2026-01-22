import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * PlanOptionCard - Game-style plan selection card
 * Shows plan details with selection state
 */
const PlanOptionCard = ({
  plan,
  isSelected = false,
  onSelect,
  index = 0,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 60,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(plan.id);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[
          styles.container,
          isSelected && styles.containerSelected,
          { borderColor: isSelected ? plan.color : 'transparent' },
        ]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        {/* Recommended badge */}
        {plan.recommended && (
          <View style={[styles.recommendedBadge, { backgroundColor: plan.color }]}>
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>{plan.icon}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{plan.name}</Text>
            <Text style={styles.tagline}>{plan.tagline}</Text>
          </View>
          {/* Selection indicator */}
          <View style={[styles.radio, isSelected && styles.radioSelected]}>
            {isSelected && <View style={[styles.radioInner, { backgroundColor: plan.color }]} />}
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{plan.description}</Text>

        {/* Quest count */}
        <View style={[styles.questCountBadge, { backgroundColor: `${plan.color}15` }]}>
          <Text style={[styles.questCountText, { color: plan.color }]}>
            {plan.questCount} Quests
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {plan.features.map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={[styles.featureCheck, { color: plan.color }]}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'transparent',
    position: 'relative',
  },
  containerSelected: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 36,
    marginRight: 14,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    color: '#333',
    fontSize: 20,
    fontWeight: '800',
  },
  tagline: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#333',
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  description: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  questCountBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 14,
  },
  questCountText: {
    fontSize: 14,
    fontWeight: '700',
  },
  features: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCheck: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  featureText: {
    color: '#555',
    fontSize: 14,
  },
});

export default PlanOptionCard;
