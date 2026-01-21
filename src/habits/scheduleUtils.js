// Schedule utilities

// Check if a habit is due on a specific date
export const isDueOnDate = (habit, dateKey) => {
  if (!habit.schedule || habit.schedule.type === 'daily') {
    return true;
  }

  if (habit.schedule.type === 'weekdays') {
    // Parse the date to get day of week
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    return habit.schedule.weekdays.includes(dayOfWeek);
  }

  return true;
};

// Get the next due date after a given date
export const getNextDueDate = (habit, fromDateKey) => {
  const [year, month, day] = fromDateKey.split('-').map(Number);
  let currentDate = new Date(year, month - 1, day);

  // Check up to 7 days ahead
  for (let i = 1; i <= 7; i++) {
    currentDate.setDate(currentDate.getDate() + 1);
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;

    if (isDueOnDate(habit, dateKey)) {
      return dateKey;
    }
  }

  return null;
};

// Get the previous due date before a given date
export const getPreviousDueDate = (habit, fromDateKey) => {
  const [year, month, day] = fromDateKey.split('-').map(Number);
  let currentDate = new Date(year, month - 1, day);

  // Check up to 7 days back
  for (let i = 1; i <= 7; i++) {
    currentDate.setDate(currentDate.getDate() - 1);
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;

    if (isDueOnDate(habit, dateKey)) {
      return dateKey;
    }
  }

  return null;
};
