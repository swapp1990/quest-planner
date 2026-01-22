import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import CircularProgress from './CircularProgress';

const QuestCard = ({
  quest,
  onPress,
  onLongPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isComplete = quest.completedSegments >= quest.maxSegments;
  const progress = (quest.completedSegments / quest.maxSegments) * 100;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    if (!isComplete && onPress) {
      // Pulse animation on complete
      if (quest.completedSegments + 1 >= quest.maxSegments) {
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.05,
            useNativeDriver: true,
            speed: 50,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
          }),
        ]).start();
      }
      onPress();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.container, isComplete && styles.containerComplete]}
        onPress={handlePress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={isComplete}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, isComplete && styles.iconContainerComplete]}>
          <Text style={styles.iconText}>{quest.icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[styles.name, isComplete && styles.nameComplete]}
            numberOfLines={1}
          >
            {quest.name}
          </Text>
          {quest.description && (
            <Text
              style={[styles.description, isComplete && styles.descriptionComplete]}
              numberOfLines={1}
            >
              {quest.description}
            </Text>
          )}
        </View>

        {/* Progress Ring */}
        <View style={styles.progressContainer}>
          {isComplete ? (
            <View style={styles.completeIcon}>
              <Text style={styles.completeEmoji}>✓</Text>
            </View>
          ) : (
            <View style={styles.ringWrapper}>
              <CircularProgress
                size={48}
                strokeWidth={4}
                progress={progress}
                maxSegments={quest.maxSegments}
                completedSegments={quest.completedSegments}
                color="#fff"
              />
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>
                  {quest.completedSegments}/{quest.maxSegments}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    minHeight: 72,
  },
  containerComplete: {
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerComplete: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  iconText: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  nameComplete: {
    textDecorationLine: 'line-through',
    opacity: 0.8,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
  },
  descriptionComplete: {
    opacity: 0.6,
  },
  progressContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringWrapper: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  completeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeEmoji: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
});

export default QuestCard;
