import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import CircularProgress from './CircularProgress';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;
const CIRCLE_SIZE = CARD_SIZE - 16;

const StreakCard = ({ habit, onPress, onLongPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isAddCard = habit.id === 'add';

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      speed: 50,
      bounciness: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 50,
      bounciness: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!isAddCard) {
      const isComplete = habit.completedToday >= habit.maxStreak;
      if (isComplete) {
        // Already complete, no feedback
      } else if (habit.completedToday === habit.maxStreak - 1) {
        // About to complete
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
    onPress();
  };

  // ADD TASK card
  if (isAddCard) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.card}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.circleContainer}>
            <View style={styles.addCircle}>
              <Text style={styles.addIcon}>+</Text>
            </View>
          </View>
          <View style={styles.habitInfo}>
            <Text style={styles.habitName}>ADD TASK</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const progress = (habit.completedToday / habit.maxStreak) * 100;
  const isComplete = habit.completedToday === habit.maxStreak;
  const displayStreak = habit.totalStreak || 0;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.circleContainer}>
          {/* Complete background - solid white circle */}
          {isComplete && <View style={styles.completeBackground} />}

          {/* Progress ring */}
          <CircularProgress
            size={CIRCLE_SIZE}
            strokeWidth={10}
            progress={progress}
            maxSegments={habit.maxStreak}
            completedSegments={habit.completedToday}
            color="#fff"
          />

          {/* Icon in center */}
          <View style={styles.iconContainer}>
            <Text style={[styles.icon, isComplete && styles.iconComplete]}>
              {habit.icon}
            </Text>
          </View>

          {/* Streak badge - positioned INSIDE circle at bottom */}
          {displayStreak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={[styles.streakText, isComplete && styles.streakTextComplete]}>
                {displayStreak}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.habitInfo}>
          <Text style={styles.habitName}>
            {habit.emojiText && (
              <Text style={[styles.emojiIcon, { color: habit.emojiColor || '#fff' }]}>
                {habit.emojiText}{' '}
              </Text>
            )}
            {habit.name}
          </Text>
          {habit.time && <Text style={styles.habitTime}>{habit.time}</Text>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    marginBottom: 24,
    alignItems: 'center',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeBackground: {
    position: 'absolute',
    width: CIRCLE_SIZE - 20,
    height: CIRCLE_SIZE - 20,
    borderRadius: (CIRCLE_SIZE - 20) / 2,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  icon: {
    fontSize: 56,
  },
  iconComplete: {
    // Icon color changes when complete (darker)
    opacity: 1,
  },
  streakBadge: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  streakTextComplete: {
    color: '#333',
    textShadowColor: 'transparent',
  },
  habitInfo: {
    marginTop: 12,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  habitName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  emojiIcon: {
    fontSize: 13,
    fontWeight: '700',
  },
  habitTime: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    opacity: 0.85,
  },
  addCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 48,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '300',
    marginTop: -4,
  },
});

export default StreakCard;
