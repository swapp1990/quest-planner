import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { H2, H3, Body, BodySmall, Button, HabitForm, HabitCalendar, Card } from '../components';
import { colors, spacing } from '../theme';
import { useHabits } from '../habits';

const HabitDetailScreen = ({ route, navigation }) => {
  const { habitId } = route.params;
  const { habits, updateHabit, deleteHabit, getHabitStats, toggleCompletion, isCompletedToday } = useHabits();
  const [showEditForm, setShowEditForm] = useState(false);

  const habit = habits.find(h => h.id === habitId);
  const stats = habit ? getHabitStats(habitId) : null;

  if (!habit) {
    return (
      <View style={styles.container}>
        <Body color={colors.gray400}>Habit not found</Body>
      </View>
    );
  }

  const handleUpdateHabit = (habitData) => {
    updateHabit(habitId, habitData);
    setShowEditForm(false);
  };

  const handleDeleteHabit = () => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit(habitId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const isCompleted = isCompletedToday(habitId);

  const scheduleText =
    habit.schedule?.type === 'daily'
      ? 'Daily'
      : habit.schedule?.weekdays
          ?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d])
          .join(', ') || 'Not scheduled';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Body color={colors.primary}>← Back</Body>
        </TouchableOpacity>
        <H2>{habit.name}</H2>
        <BodySmall color={colors.gray500} style={styles.schedule}>
          {scheduleText}
        </BodySmall>
        {habit.notes ? (
          <BodySmall color={colors.gray500} style={styles.notes}>
            {habit.notes}
          </BodySmall>
        ) : null}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Completion */}
        <View style={styles.todaySection}>
          <Button
            title={isCompleted ? "✓ Completed Today" : "Mark as Done"}
            onPress={() => toggleCompletion(habitId)}
            variant={isCompleted ? "primary" : "outline"}
          />
        </View>

        {/* Streak Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <H3>{stats.currentStreak}</H3>
            <BodySmall color={colors.gray500}>Current Streak</BodySmall>
          </Card>
          <Card style={styles.statCard}>
            <H3>{stats.longestStreak}</H3>
            <BodySmall color={colors.gray500}>Best Streak</BodySmall>
          </Card>
          <Card style={styles.statCard}>
            <H3>{stats.completionRate}%</H3>
            <BodySmall color={colors.gray500}>30-Day Rate</BodySmall>
          </Card>
        </View>

        {/* Calendar */}
        <View style={styles.calendarSection}>
          <HabitCalendar completionDates={stats.completionDates} />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Edit"
            variant="outline"
            onPress={() => setShowEditForm(true)}
          />
          <Button
            title="Delete"
            variant="outline"
            onPress={handleDeleteHabit}
          />
        </View>
      </ScrollView>

      <HabitForm
        visible={showEditForm}
        habit={habit}
        onSave={handleUpdateHabit}
        onCancel={() => setShowEditForm(false)}
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
  backButton: {
    marginBottom: spacing.sm,
  },
  schedule: {
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  notes: {
    marginTop: spacing.xs,
  },
  todaySection: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  calendarSection: {
    marginBottom: spacing.lg,
  },
  actions: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    gap: spacing.md,
  },
});

export default HabitDetailScreen;
