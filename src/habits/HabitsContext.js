import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  getCompletionRate,
  getCompletionDates,
  getLastCompletedDate,
} from './streakUtils';

const HabitsContext = createContext();

const STORAGE_KEY = '@habits_data';

// Mock data for Phase 0
const MOCK_HABITS = [
  {
    id: '1',
    name: 'Morning meditation',
    createdAt: new Date().toISOString(),
    archived: false,
    schedule: { type: 'daily', weekdays: [] },
  },
  {
    id: '2',
    name: 'Drink 8 glasses of water',
    createdAt: new Date().toISOString(),
    archived: false,
    schedule: { type: 'daily', weekdays: [] },
  },
  {
    id: '3',
    name: 'Read for 30 minutes',
    createdAt: new Date().toISOString(),
    archived: false,
    schedule: { type: 'weekdays', weekdays: [1, 3, 5] }, // Mon, Wed, Fri
  },
];

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState(MOCK_HABITS);
  const [completions, setCompletions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever habits or completions change
  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [habits, completions]);

  const loadData = async () => {
    try {
      const habitsData = await AsyncStorage.getItem(STORAGE_KEY + '_habits');
      const completionsData = await AsyncStorage.getItem(STORAGE_KEY + '_completions');

      if (habitsData) {
        setHabits(JSON.parse(habitsData));
      }
      if (completionsData) {
        setCompletions(JSON.parse(completionsData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY + '_habits', JSON.stringify(habits));
      await AsyncStorage.setItem(STORAGE_KEY + '_completions', JSON.stringify(completions));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Get today's date key (YYYY-MM-DD in local timezone)
  const getTodayKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Add a new habit
  const addHabit = (habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habitData.name,
      notes: habitData.notes || '',
      schedule: habitData.schedule || { type: 'daily', weekdays: [] },
      createdAt: new Date().toISOString(),
      archived: false,
    };
    setHabits(prev => [...prev, newHabit]);
  };

  // Update an existing habit
  const updateHabit = (habitId, habitData) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === habitId
          ? {
              ...h,
              name: habitData.name,
              notes: habitData.notes || '',
              schedule: habitData.schedule || h.schedule,
            }
          : h
      )
    );
  };

  // Delete a habit
  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    // Also remove all completions for this habit
    setCompletions(prev => {
      const newCompletions = { ...prev };
      Object.keys(newCompletions).forEach(dateKey => {
        delete newCompletions[dateKey][habitId];
      });
      return newCompletions;
    });
  };

  // Toggle completion for a habit on today
  const toggleCompletion = (habitId) => {
    const todayKey = getTodayKey();
    setCompletions(prev => {
      const newCompletions = { ...prev };
      if (!newCompletions[todayKey]) {
        newCompletions[todayKey] = {};
      }
      newCompletions[todayKey][habitId] = !newCompletions[todayKey][habitId];
      return newCompletions;
    });
  };

  // Check if a habit is due today
  const isDueToday = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || !habit.schedule) return true; // Default to daily

    if (habit.schedule.type === 'daily') return true;

    // For weekdays schedule
    if (habit.schedule.type === 'weekdays') {
      const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
      return habit.schedule.weekdays.includes(today);
    }

    return true;
  };

  // Check if a habit is completed today
  const isCompletedToday = (habitId) => {
    const todayKey = getTodayKey();
    return completions[todayKey]?.[habitId] || false;
  };

  // Get today's completion count
  const getTodayCompletionCount = () => {
    const todayKey = getTodayKey();
    const todayCompletions = completions[todayKey] || {};
    return Object.values(todayCompletions).filter(Boolean).length;
  };

  // Get habit stats
  const getHabitStats = (habitId) => {
    const habit = habits.find(h => h.id === habitId);

    return {
      currentStreak: calculateCurrentStreak(habitId, completions, habit),
      longestStreak: calculateLongestStreak(habitId, completions, habit),
      completionRate: getCompletionRate(habitId, completions, 30),
      completionDates: getCompletionDates(habitId, completions),
      lastCompletedDate: getLastCompletedDate(habitId, completions),
    };
  };

  const value = {
    habits,
    setHabits,
    completions,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isDueToday,
    isCompletedToday,
    getTodayCompletionCount,
    getTodayKey,
    getHabitStats,
    isLoading,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within HabitsProvider');
  }
  return context;
};
