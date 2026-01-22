import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getTodayKey,
  shouldResetToday,
  resetHabit,
  isHabitComplete,
  incrementHabit as incrementHabitUtil,
  generateId,
} from './streaksUtils';

const StreaksContext = createContext();

const STORAGE_KEY_HABITS = '@streaks_habits';
const STORAGE_KEY_HISTORY = '@streaks_history';

export const StreaksProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [history, setHistory] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save habits whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveHabits();
    }
  }, [habits]);

  // Save history whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveHistory();
    }
  }, [history]);

  // AppState listener for daily reset
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Check on mount
    checkAndResetDaily();

    return () => {
      subscription.remove();
    };
  }, [habits]);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      checkAndResetDaily();
    }
  };

  const checkAndResetDaily = () => {
    const today = getTodayKey();
    let needsUpdate = false;

    const updatedHabits = habits.map(habit => {
      if (shouldResetToday(habit)) {
        needsUpdate = true;
        return resetHabit(habit);
      }
      return habit;
    });

    if (needsUpdate) {
      setHabits(updatedHabits);
      // Save snapshot to history
      saveHistorySnapshot(today, updatedHabits);
    }
  };

  const loadData = async () => {
    try {
      const [habitsData, historyData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_HABITS),
        AsyncStorage.getItem(STORAGE_KEY_HISTORY),
      ]);

      if (habitsData) {
        const loadedHabits = JSON.parse(habitsData);
        setHabits(loadedHabits);

        // Check if we need to reset on load
        const today = getTodayKey();
        const needsReset = loadedHabits.some(h => shouldResetToday(h));

        if (needsReset) {
          const resetHabits = loadedHabits.map(h =>
            shouldResetToday(h) ? resetHabit(h) : h
          );
          setHabits(resetHabits);
        }
      }

      if (historyData) {
        setHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Error loading streaks data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const saveHistorySnapshot = (dateKey, habitsSnapshot) => {
    setHistory(prev => ({
      ...prev,
      [dateKey]: habitsSnapshot.map(h => ({
        id: h.id,
        name: h.name,
        completedToday: h.completedToday,
        maxStreak: h.maxStreak,
        totalStreak: h.totalStreak,
      })),
    }));
  };

  // CRUD Operations

  const addHabit = (habitData) => {
    const today = getTodayKey();
    const newHabit = {
      id: generateId(),
      name: habitData.name,
      icon: habitData.icon || '⭐',
      maxStreak: habitData.maxStreak || 4,
      completedToday: 0,
      totalStreak: 0,
      time: habitData.time || null,
      emojiText: habitData.emojiText || null,
      emojiColor: habitData.emojiColor || null,
      createdAt: new Date().toISOString(),
      lastCompletedDate: null,
      lastResetDate: today,
      order: habits.length,
    };

    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  };

  const updateHabit = (habitId, habitData) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === habitId
          ? {
              ...h,
              name: habitData.name !== undefined ? habitData.name : h.name,
              icon: habitData.icon !== undefined ? habitData.icon : h.icon,
              maxStreak: habitData.maxStreak !== undefined ? habitData.maxStreak : h.maxStreak,
              time: habitData.time !== undefined ? habitData.time : h.time,
              emojiText: habitData.emojiText !== undefined ? habitData.emojiText : h.emojiText,
              emojiColor: habitData.emojiColor !== undefined ? habitData.emojiColor : h.emojiColor,
            }
          : h
      )
    );
  };

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const incrementHabit = (habitId) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          // Check if needs reset first
          if (shouldResetToday(h)) {
            const resetH = resetHabit(h);
            return incrementHabitUtil(resetH);
          }
          return incrementHabitUtil(h);
        }
        return h;
      })
    );
  };

  const reorderHabits = (newOrder) => {
    setHabits(newOrder);
  };

  const clearAllData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEY_HABITS),
        AsyncStorage.removeItem(STORAGE_KEY_HISTORY),
      ]);
      setHabits([]);
      setHistory({});
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const value = {
    habits,
    history,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    incrementHabit,
    reorderHabits,
    clearAllData,
    isHabitComplete: (habitId) => {
      const habit = habits.find(h => h.id === habitId);
      return habit ? isHabitComplete(habit) : false;
    },
  };

  return (
    <StreaksContext.Provider value={value}>
      {children}
    </StreaksContext.Provider>
  );
};

export const useStreaks = () => {
  const context = useContext(StreaksContext);
  if (!context) {
    throw new Error('useStreaks must be used within StreaksProvider');
  }
  return context;
};
