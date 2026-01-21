import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExtractionContext = createContext(null);

const HISTORY_INDEX_KEY = '@extraction_history_index';
const ITEM_KEY_PREFIX = '@extraction_item_';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const ExtractionProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const indexJson = await AsyncStorage.getItem(HISTORY_INDEX_KEY);
      const ids = indexJson ? JSON.parse(indexJson) : [];

      const items = await Promise.all(
        ids.map(async (id) => {
          const itemJson = await AsyncStorage.getItem(`${ITEM_KEY_PREFIX}${id}`);
          return itemJson ? JSON.parse(itemJson) : null;
        })
      );

      setHistory(items.filter(Boolean));
    } catch (error) {
      console.error('Failed to load extraction history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveIndex = async (ids) => {
    await AsyncStorage.setItem(HISTORY_INDEX_KEY, JSON.stringify(ids));
  };

  const saveItem = async (item) => {
    await AsyncStorage.setItem(`${ITEM_KEY_PREFIX}${item.id}`, JSON.stringify(item));
  };

  const addExtraction = useCallback(async (extractionData) => {
    const newItem = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      jobId: null,
      result: null,
      error: null,
      ...extractionData,
    };

    setHistory((prev) => [newItem, ...prev]);

    const currentIndex = await AsyncStorage.getItem(HISTORY_INDEX_KEY);
    const ids = currentIndex ? JSON.parse(currentIndex) : [];
    await saveIndex([newItem.id, ...ids]);
    await saveItem(newItem);

    return newItem;
  }, []);

  const updateExtraction = useCallback(async (id, updates) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    const itemJson = await AsyncStorage.getItem(`${ITEM_KEY_PREFIX}${id}`);
    if (itemJson) {
      const item = JSON.parse(itemJson);
      await saveItem({ ...item, ...updates });
    }
  }, []);

  const deleteExtraction = useCallback(async (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));

    await AsyncStorage.removeItem(`${ITEM_KEY_PREFIX}${id}`);

    const currentIndex = await AsyncStorage.getItem(HISTORY_INDEX_KEY);
    const ids = currentIndex ? JSON.parse(currentIndex) : [];
    await saveIndex(ids.filter((itemId) => itemId !== id));
  }, []);

  return (
    <ExtractionContext.Provider
      value={{
        history,
        isLoading,
        addExtraction,
        updateExtraction,
        deleteExtraction,
        loadHistory,
      }}
    >
      {children}
    </ExtractionContext.Provider>
  );
};

export const useExtraction = () => {
  const context = useContext(ExtractionContext);
  if (!context) {
    throw new Error('useExtraction must be used within ExtractionProvider');
  }
  return context;
};
