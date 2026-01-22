/**
 * Utility functions for Streaks habit tracking
 */

/**
 * Get today's date as a string key (YYYY-MM-DD)
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a habit should be reset today
 * @param {Object} habit - The habit object
 * @returns {boolean} True if habit needs reset
 */
export const shouldResetToday = (habit) => {
  if (!habit.lastResetDate) {
    return true; // First time, needs reset
  }

  const today = getTodayKey();
  return habit.lastResetDate !== today;
};

/**
 * Reset a habit for a new day
 * @param {Object} habit - The habit object to reset
 * @returns {Object} Updated habit with reset values
 */
export const resetHabit = (habit) => {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  // Check if habit was completed yesterday to maintain streak
  const wasCompletedYesterday = habit.lastCompletedDate === yesterday &&
                                 habit.completedToday >= habit.maxStreak;

  // If completed yesterday, increment total streak; otherwise reset
  const newTotalStreak = wasCompletedYesterday ? habit.totalStreak + 1 : 0;

  return {
    ...habit,
    completedToday: 0,
    lastResetDate: today,
    totalStreak: newTotalStreak,
  };
};

/**
 * Get yesterday's date as a string key (YYYY-MM-DD)
 * @returns {string} Yesterday's date in YYYY-MM-DD format
 */
const getYesterdayKey = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a habit is complete for today
 * @param {Object} habit - The habit object
 * @returns {boolean} True if habit is complete
 */
export const isHabitComplete = (habit) => {
  return habit.completedToday >= habit.maxStreak;
};

/**
 * Increment a habit's completion
 * @param {Object} habit - The habit object
 * @returns {Object} Updated habit with incremented completion
 */
export const incrementHabit = (habit) => {
  const today = getTodayKey();

  // Don't increment if already complete
  if (isHabitComplete(habit)) {
    return habit;
  }

  const newCompletedToday = habit.completedToday + 1;
  const isNowComplete = newCompletedToday >= habit.maxStreak;

  return {
    ...habit,
    completedToday: newCompletedToday,
    lastCompletedDate: isNowComplete ? today : habit.lastCompletedDate,
  };
};

/**
 * Generate a unique ID for a new habit
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
