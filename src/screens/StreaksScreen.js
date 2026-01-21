import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import CircularProgress from '../components/CircularProgress';

const { width, height } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 2;

// Mock habit data matching the screenshot
const INITIAL_HABITS = [
  { id: '1', name: 'RUN 2.3 KM', icon: '🏃', completedToday: 3, maxStreak: 4, emojiText: '♥', emojiColor: '#fff' },
  { id: '2', name: "DON'T SMOKE", icon: '🚭', completedToday: 5, maxStreak: 5, emojiText: '⊘', emojiColor: '#fff', totalStreak: 6 },
  { id: '3', name: 'EAT A HEALTHY MEAL', icon: '🥕', completedToday: 2, maxStreak: 4, emojiText: '♥', emojiColor: '#fff', totalStreak: 8 },
  { id: '4', name: 'BRUSH YOUR TEETH', icon: '🪥', completedToday: 1, maxStreak: 4, time: '3:00', emojiText: '♥', emojiColor: '#fff', totalStreak: 2 },
  { id: '5', name: 'WALK THE DOG', icon: '🐕', completedToday: 0, maxStreak: 5, emojiText: '', emojiColor: '#fff' },
];

const HabitCard = ({ habit, onPress }) => {
  const isAddCard = habit.id === 'add';

  if (isAddCard) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.addCircle}>
          <View style={styles.addIconContainer}>
            <Text style={styles.addIcon}>+</Text>
          </View>
        </View>
        <Text style={styles.habitName}>ADD TASK</Text>
      </TouchableOpacity>
    );
  }

  const progress = (habit.completedToday / habit.maxStreak) * 100;
  const isComplete = habit.completedToday === habit.maxStreak;
  const displayStreak = habit.totalStreak || habit.completedToday;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {displayStreak > 0 && (
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>{displayStreak}</Text>
        </View>
      )}
      <View style={styles.circleContainer}>
        {isComplete && (
          <View style={styles.completeBackground} />
        )}
        <CircularProgress
          size={CARD_SIZE - 30}
          strokeWidth={8}
          progress={progress}
          maxSegments={habit.maxStreak}
          color="#fff"
        />
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{habit.icon}</Text>
        </View>
      </View>
      <View style={styles.habitInfo}>
        <Text style={styles.habitName}>
          {habit.emojiText && (
            <Text style={[styles.emojiIcon, { color: habit.emojiColor }]}>
              {habit.emojiText}{' '}
            </Text>
          )}
          {habit.name}
        </Text>
        {habit.time && <Text style={styles.habitTime}>{habit.time}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const StreaksScreen = () => {
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [currentPage, setCurrentPage] = useState(0);

  const handleHabitPress = (habitId) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          // Don't increment if already at max
          if (habit.completedToday >= habit.maxStreak) {
            return habit;
          }

          const newCompletedToday = habit.completedToday + 1;
          const isNowComplete = newCompletedToday === habit.maxStreak;
          const newTotalStreak = isNowComplete
            ? (habit.totalStreak || 0) + 1
            : habit.totalStreak;

          return {
            ...habit,
            completedToday: newCompletedToday,
            totalStreak: newTotalStreak
          };
        }
        return habit;
      })
    );
  };

  const allHabits = [...habits, { id: 'add' }];
  const totalPages = 1;

  return (
    <LinearGradient
      colors={['#5B9FED', '#8B7FD6', '#C96FB9', '#E85DA0']}
      style={styles.container}
      locations={[0, 0.35, 0.7, 1]}
    >
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {allHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={() => habit.id === 'add' ? console.log('Add new habit') : handleHabitPress(habit.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>⚙️</Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          {[...Array(totalPages)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage && styles.dotActive
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>⭐</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 40,
    paddingBottom: 100,
    justifyContent: 'space-evenly',
    minHeight: height - 180,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flex: 1,
  },
  card: {
    width: CARD_SIZE,
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  circleContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  completeBackground: {
    position: 'absolute',
    width: CARD_SIZE - 36,
    height: CARD_SIZE - 36,
    borderRadius: (CARD_SIZE - 36) / 2,
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
    fontSize: 70,
  },
  streakBadge: {
    position: 'absolute',
    top: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  streakText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  habitInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  habitName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  emojiIcon: {
    fontSize: 15,
    fontWeight: '600',
  },
  habitTime: {
    color: '#fff',
    fontSize: 13,
    marginTop: 2,
    opacity: 0.9,
  },
  addCircle: {
    width: CARD_SIZE - 20,
    height: CARD_SIZE - 20,
    borderRadius: (CARD_SIZE - 20) / 2,
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 40,
    color: '#C96FB9',
    fontWeight: '300',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  navButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 22,
  },
  pageIndicator: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: '#fff',
  },
});

export default StreaksScreen;
