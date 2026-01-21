import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { H1, H2, H3, Body, BodySmall, Card } from '../components';
import { colors, spacing } from '../theme';
import { useHabits } from '../habits';
import { getDaysAgo, getDateKey } from '../habits/streakUtils';

const InsightsScreen = () => {
  const { habits, completions, isDueToday } = useHabits();

  const activeHabits = habits.filter(h => !h.archived);

  // Calculate weekly consistency
  const calculateWeeklyConsistency = () => {
    let totalDue = 0;
    let totalCompleted = 0;

    for (let i = 0; i < 7; i++) {
      const dateKey = getDaysAgo(i);
      const date = new Date();
      date.setDate(date.getDate() - i);

      activeHabits.forEach(habit => {
        // Check if habit was due on that day
        const [year, month, day] = dateKey.split('-').map(Number);
        const checkDate = new Date(year, month - 1, day);
        const dayOfWeek = checkDate.getDay();

        let isDue = true;
        if (habit.schedule?.type === 'weekdays') {
          isDue = habit.schedule.weekdays.includes(dayOfWeek);
        }

        if (isDue) {
          totalDue++;
          if (completions[dateKey]?.[habit.id]) {
            totalCompleted++;
          }
        }
      });
    }

    return totalDue > 0 ? Math.round((totalCompleted / totalDue) * 100) : 0;
  };

  // Get top habits by completion
  const getTopHabits = () => {
    const habitCounts = activeHabits.map(habit => {
      let count = 0;
      for (let i = 0; i < 30; i++) {
        const dateKey = getDaysAgo(i);
        if (completions[dateKey]?.[habit.id]) {
          count++;
        }
      }
      return { habit, count };
    });

    return habitCounts.sort((a, b) => b.count - a.count).slice(0, 3);
  };

  // Get missed habits this week
  const getMissedHabitsThisWeek = () => {
    const missed = [];

    for (let i = 1; i < 7; i++) {
      // Skip today (i=0)
      const dateKey = getDaysAgo(i);
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();

      activeHabits.forEach(habit => {
        let isDue = true;
        if (habit.schedule?.type === 'weekdays') {
          isDue = habit.schedule.weekdays.includes(dayOfWeek);
        }

        if (isDue && !completions[dateKey]?.[habit.id]) {
          const existing = missed.find(m => m.habit.id === habit.id);
          if (existing) {
            existing.count++;
          } else {
            missed.push({ habit, count: 1 });
          }
        }
      });
    }

    return missed.sort((a, b) => b.count - a.count).slice(0, 3);
  };

  const weeklyConsistency = calculateWeeklyConsistency();
  const topHabits = getTopHabits();
  const missedHabits = getMissedHabitsThisWeek();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H1>Insights</H1>
        <BodySmall color={colors.gray500}>Last 7 days</BodySmall>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weekly Consistency */}
        <Card style={styles.card}>
          <H2 style={styles.cardTitle}>Weekly Consistency</H2>
          <View style={styles.bigStat}>
            <H1 style={styles.bigNumber}>{weeklyConsistency}%</H1>
            <BodySmall color={colors.gray500}>of habits completed</BodySmall>
          </View>
        </Card>

        {/* Top Habits */}
        <Card style={styles.card}>
          <H3 style={styles.cardTitle}>Top Habits (30 days)</H3>
          {topHabits.length === 0 ? (
            <BodySmall color={colors.gray400}>No data yet</BodySmall>
          ) : (
            topHabits.map(({ habit, count }) => (
              <View key={habit.id} style={styles.listItem}>
                <Body>{habit.name}</Body>
                <BodySmall color={colors.gray500}>
                  {count} {count === 1 ? 'day' : 'days'}
                </BodySmall>
              </View>
            ))
          )}
        </Card>

        {/* Missed Habits */}
        <Card style={styles.card}>
          <H3 style={styles.cardTitle}>Missed This Week</H3>
          {missedHabits.length === 0 ? (
            <BodySmall color={colors.success}>All caught up! 🎉</BodySmall>
          ) : (
            missedHabits.map(({ habit, count }) => (
              <View key={habit.id} style={styles.listItem}>
                <Body>{habit.name}</Body>
                <BodySmall color={colors.error}>
                  {count} {count === 1 ? 'miss' : 'misses'}
                </BodySmall>
              </View>
            ))
          )}
        </Card>
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
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
  bigStat: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  bigNumber: {
    fontSize: 48,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
});

export default InsightsScreen;
