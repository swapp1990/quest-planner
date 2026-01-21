import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { H1, H3, Body, BodySmall, Button, HabitForm } from '../components';
import { colors, spacing } from '../theme';
import { useHabits } from '../habits';

const HabitsScreen = ({ navigation }) => {
  const { habits, addHabit } = useHabits();
  const [showForm, setShowForm] = useState(false);

  const activeHabits = habits.filter(h => !h.archived);

  const handleHabitPress = (habit) => {
    navigation.navigate('HabitDetail', { habitId: habit.id });
  };

  const handleAddHabit = (habitData) => {
    addHabit(habitData);
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H1>Habits</H1>
        <BodySmall color={colors.gray500}>
          {activeHabits.length} {activeHabits.length === 1 ? 'habit' : 'habits'}
        </BodySmall>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <H3 color={colors.gray400}>No habits yet</H3>
            <BodySmall color={colors.gray400} style={styles.emptyText}>
              Create your first habit to get started
            </BodySmall>
          </View>
        ) : (
          activeHabits.map(habit => {
            const scheduleText =
              habit.schedule?.type === 'daily'
                ? 'Daily'
                : habit.schedule?.weekdays
                    ?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d])
                    .join(', ') || 'Not scheduled';

            return (
              <TouchableOpacity
                key={habit.id}
                style={styles.habitCard}
                onPress={() => handleHabitPress(habit)}
                activeOpacity={0.7}
              >
                <Body style={styles.habitName}>{habit.name}</Body>
                <BodySmall color={colors.gray500}>{scheduleText}</BodySmall>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <View style={styles.addButtonContainer}>
        <Button
          title="+ Add Habit"
          onPress={() => setShowForm(true)}
        />
      </View>

      <HabitForm
        visible={showForm}
        onSave={handleAddHabit}
        onCancel={() => setShowForm(false)}
      />
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
  habitCard: {
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  habitName: {
    marginBottom: spacing.xs,
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
  addButtonContainer: {
    padding: spacing.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});

export default HabitsScreen;
