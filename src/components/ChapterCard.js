import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import CircularProgress from './CircularProgress';

const ChapterCard = ({
  chapter,
  chapterNumber,
  progress,
  completedQuests,
  totalQuests,
  isLocked,
  isCompleted,
  onPress,
}) => {
  const handlePress = () => {
    if (!isLocked && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isLocked && styles.containerLocked,
        isCompleted && styles.containerCompleted,
      ]}
      onPress={handlePress}
      activeOpacity={isLocked ? 1 : 0.7}
      disabled={isLocked}
    >
      {/* Chapter Number Badge */}
      <View style={[styles.numberBadge, isLocked && styles.numberBadgeLocked]}>
        <Text style={styles.numberText}>{chapterNumber}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.subtitle, isLocked && styles.textLocked]}>
          {chapter.subtitle}
        </Text>
        <Text
          style={[styles.title, isLocked && styles.textLocked]}
          numberOfLines={1}
        >
          {chapter.title}
        </Text>
        <Text style={[styles.questCount, isLocked && styles.textLocked]}>
          {isCompleted
            ? '✓ Completed'
            : `${completedQuests}/${totalQuests} quests complete`}
        </Text>
      </View>

      {/* Progress Ring */}
      <View style={styles.progressContainer}>
        {isLocked ? (
          <View style={styles.lockIcon}>
            <Text style={styles.lockEmoji}>🔒</Text>
          </View>
        ) : isCompleted ? (
          <View style={styles.checkIcon}>
            <Text style={styles.checkEmoji}>✓</Text>
          </View>
        ) : (
          <CircularProgress
            size={56}
            strokeWidth={5}
            progress={progress}
            maxSegments={totalQuests}
            completedSegments={completedQuests}
            color="#fff"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  containerLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    opacity: 0.7,
  },
  containerCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  numberBadgeLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  numberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  questCount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  textLocked: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  progressContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockEmoji: {
    fontSize: 24,
    opacity: 0.6,
  },
  checkIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkEmoji: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
  },
});

export default ChapterCard;
