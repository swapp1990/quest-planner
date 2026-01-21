// Streak calculation utilities
import { getPreviousDueDate, isDueOnDate } from './scheduleUtils';

// Get date key in YYYY-MM-DD format
export const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Parse date key to Date object
export const parseDateKey = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Get date N days ago
export const getDaysAgo = (n) => {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return getDateKey(date);
};

// Check if a date is before another
export const isDateBefore = (dateKey1, dateKey2) => {
  return dateKey1 < dateKey2;
};

// Get date one day before
export const getPreviousDay = (dateKey) => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() - 1);
  return getDateKey(date);
};

// Calculate current streak for a habit (schedule-aware)
export const calculateCurrentStreak = (habitId, completions, habit) => {
  if (!habit) return 0;

  const today = getDateKey(new Date());
  let currentStreak = 0;
  let checkDate = today;

  // Start counting from today backwards, only on due days
  while (checkDate) {
    if (completions[checkDate]?.[habitId]) {
      currentStreak++;
      // Get previous due date based on schedule
      checkDate = getPreviousDueDate(habit, checkDate);
    } else {
      // If habit was due but not completed, streak is broken
      if (isDueOnDate(habit, checkDate)) {
        break;
      }
      // If not due, continue to previous due date
      checkDate = getPreviousDueDate(habit, checkDate);
    }

    // Safety: don't go back more than 365 days
    if (checkDate && parseDateKey(checkDate) < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) {
      break;
    }
  }

  return currentStreak;
};

// Calculate longest streak for a habit (schedule-aware)
export const calculateLongestStreak = (habitId, completions, habit) => {
  if (!habit) return 0;

  const dateKeys = Object.keys(completions).sort();
  if (dateKeys.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 0;
  let lastCompletedDate = null;

  for (const dateKey of dateKeys) {
    if (completions[dateKey]?.[habitId]) {
      if (lastCompletedDate === null) {
        // First completion
        currentStreak = 1;
      } else {
        // Check if this is the next expected due date
        const expectedNext = getPreviousDueDate(habit, dateKey);
        if (expectedNext === lastCompletedDate) {
          currentStreak++;
        } else {
          // Streak broken, start new streak
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }
      lastCompletedDate = dateKey;
    }
  }

  return Math.max(longestStreak, currentStreak);
};

// Get completion rate for last N days
export const getCompletionRate = (habitId, completions, days = 30) => {
  let completedDays = 0;
  const today = getDateKey(new Date());

  for (let i = 0; i < days; i++) {
    const checkDate = getDaysAgo(i);
    if (completions[checkDate]?.[habitId]) {
      completedDays++;
    }
  }

  return Math.round((completedDays / days) * 100);
};

// Get all completion dates for a habit
export const getCompletionDates = (habitId, completions) => {
  const dates = [];
  Object.keys(completions).forEach(dateKey => {
    if (completions[dateKey]?.[habitId]) {
      dates.push(dateKey);
    }
  });
  return dates.sort();
};

// Get last completed date
export const getLastCompletedDate = (habitId, completions) => {
  const dates = getCompletionDates(habitId, completions);
  return dates.length > 0 ? dates[dates.length - 1] : null;
};
