import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * CollectionAddAnimation - Animates an item flying into a collection
 *
 * Shows the item in the center, then animates it flying up to the collection area.
 * Can be reused for any collectible (stamps, badges, etc.)
 *
 * @param {boolean} visible - Whether animation is playing
 * @param {string} icon - The emoji/icon to animate
 * @param {string} label - Optional label to show briefly (e.g., "The Adventurer")
 * @param {object} targetPosition - { x, y } position to fly to (optional, defaults to top-center)
 * @param {function} onComplete - Callback when animation finishes
 */
const CollectionAddAnimation = ({
  visible,
  icon,
  label,
  targetPosition = { x: SCREEN_WIDTH / 2, y: 120 },
  onComplete,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const positionAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      positionAnim.setValue(0);
      opacityAnim.setValue(0);
      labelOpacity.setValue(0);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Animation sequence:
      // 1. Pop in at center with label
      // 2. Brief pause to show label
      // 3. Shrink and fly to target
      // 4. Disappear at target

      Animated.sequence([
        // Pop in
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(labelOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Pause to show
        Animated.delay(600),
        // Fade label
        Animated.timing(labelOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        // Fly to target
        Animated.parallel([
          Animated.timing(positionAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.4,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        // Fade out at target
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete?.();
      });
    }
  }, [visible]);

  if (!visible) return null;

  // Calculate positions
  const startY = SCREEN_HEIGHT / 2 - 60;
  const endY = targetPosition.y;
  const startX = SCREEN_WIDTH / 2;
  const endX = targetPosition.x;

  const translateY = positionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [startY, endY],
  });

  const translateX = positionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, endX],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Semi-transparent backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          },
        ]}
      />

      {/* Animated item */}
      <Animated.View
        style={[
          styles.itemContainer,
          {
            opacity: opacityAnim,
            transform: [
              { translateX: Animated.subtract(translateX, SCREEN_WIDTH / 2) },
              { translateY: Animated.subtract(translateY, SCREEN_HEIGHT / 2) },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <View style={styles.itemCircle}>
          <Text style={styles.itemIcon}>{icon}</Text>
        </View>
      </Animated.View>

      {/* Label (shows briefly) */}
      {label && (
        <Animated.View
          style={[
            styles.labelContainer,
            {
              opacity: labelOpacity,
              transform: [
                {
                  translateY: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.labelText}>{label}</Text>
          <Text style={styles.addedText}>Added to Collection</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  itemContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  itemCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  itemIcon: {
    fontSize: 56,
  },
  labelContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 + 60,
    alignItems: 'center',
  },
  labelText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  addedText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default CollectionAddAnimation;
