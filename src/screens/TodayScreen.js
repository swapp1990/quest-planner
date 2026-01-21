import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { H1, H3, Body, BodySmall } from '../components';
import { colors, spacing } from '../theme';
import { useHabits } from '../habits';

const HabitRow = ({ habit, isCompleted, onToggle, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.habitRow, isCompleted && styles.habitRowCompleted]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        {isCompleted && (
          <View style={styles.checkmark} />
        )}
      </TouchableOpacity>
      <Body style={[styles.habitName, isCompleted && styles.habitNameCompleted]}>
        {habit.name}
      </Body>
    </TouchableOpacity>
  );
};

const TodayScreen = ({ navigation }) => {
  const { habits, toggleCompletion, isCompletedToday, isDueToday, getTodayCompletionCount } = useHabits();

  const activeHabits = habits.filter(h => !h.archived);
  const dueTodayHabits = activeHabits.filter(h => isDueToday(h.id));
  const completedCount = getTodayCompletionCount();
  const totalCount = dueTodayHabits.length;

  const handleHabitPress = (habit) => {
    navigation.navigate('HabitDetail', { habitId: habit.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H1>Today</H1>
        <BodySmall color={colors.gray500}>
          {completedCount} / {totalCount} completed
        </BodySmall>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {dueTodayHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <H3 color={colors.gray400}>
              {activeHabits.length === 0 ? 'No habits yet' : 'All done for today!'}
            </H3>
            <BodySmall color={colors.gray400} style={styles.emptyText}>
              {activeHabits.length === 0
                ? 'Tap the Habits tab to create your first habit'
                : 'No habits scheduled for today'}
            </BodySmall>
          </View>
        ) : (
          dueTodayHabits.map(habit => (
            <HabitRow
              key={habit.id}
              habit={habit}
              isCompleted={isCompletedToday(habit.id)}
              onToggle={() => toggleCompletion(habit.id)}
              onPress={() => handleHabitPress(habit)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  habitRowCompleted: {
    backgroundColor: colors.gray50,
    borderColor: colors.primary,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.gray300,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  habitName: {
    flex: 1,
  },
  habitNameCompleted: {
    color: colors.gray500,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyText: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default TodayScreen;
