import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Body, BodySmall, Caption } from './';
import { colors, spacing } from '../theme';
import { getDateKey, parseDateKey } from '../habits/streakUtils';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const HabitCalendar = ({ completionDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create completion dates set for fast lookup
  const completionSet = new Set(completionDates);

  // Generate calendar grid
  const calendarDays = [];

  // Add empty cells for days before first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateKey = getDateKey(date);
    const isCompleted = completionSet.has(dateKey);
    const isToday = dateKey === getDateKey(new Date());

    calendarDays.push({
      day,
      dateKey,
      isCompleted,
      isToday,
    });
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Body color={colors.primary}>←</Body>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToCurrentMonth}>
          <Body>{MONTH_NAMES[month]} {year}</Body>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Body color={colors.primary}>→</Body>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdays}>
        {DAYS_OF_WEEK.map(day => (
          <View key={day} style={styles.weekdayCell}>
            <Caption color={colors.gray500}>{day}</Caption>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {calendarDays.map((dayData, index) => (
          <View key={index} style={styles.dayCell}>
            {dayData && (
              <View
                style={[
                  styles.dayContent,
                  dayData.isCompleted && styles.dayCompleted,
                  dayData.isToday && styles.dayToday,
                ]}
              >
                <Caption
                  color={
                    dayData.isCompleted
                      ? '#fff'
                      : dayData.isToday
                      ? colors.primary
                      : colors.gray700
                  }
                >
                  {dayData.day}
                </Caption>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    padding: 2,
  },
  dayContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayCompleted: {
    backgroundColor: colors.primary,
  },
  dayToday: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
});

export default HabitCalendar;
