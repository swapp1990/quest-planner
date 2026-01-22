import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActionSheetIOS,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import StreakCard from '../components/StreakCard';
import { useStreaks } from '../streaks';
import TaskSelectModal from './TaskSelectModal';
import TaskConfigModal from './TaskConfigModal';
import StreaksSettingsScreen from './StreaksSettingsScreen';

const { width, height } = Dimensions.get('window');

const StreaksScreen = () => {
  const { habits, incrementHabit, addHabit, updateHabit, deleteHabit } =
    useStreaks();
  const [currentPage, setCurrentPage] = useState(0);

  // Two-step modal flow
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingHabit, setEditingHabit] = useState(null);

  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleHabitPress = (habitId) => {
    incrementHabit(habitId);
  };

  const handleAddPress = () => {
    setEditingHabit(null);
    setSelectedTask(null);
    setSelectModalVisible(true);
  };

  const handleTaskSelected = (task) => {
    setSelectedTask(task);
    setSelectModalVisible(false);
    setConfigModalVisible(true);
  };

  const handleConfigBack = () => {
    setConfigModalVisible(false);
    setSelectModalVisible(true);
  };

  const handleConfigClose = () => {
    setConfigModalVisible(false);
    setSelectedTask(null);
    setEditingHabit(null);
  };

  const handleSaveTask = (taskData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, taskData);
    } else {
      addHabit(taskData);
    }
    setConfigModalVisible(false);
    setSelectedTask(null);
    setEditingHabit(null);
  };

  const handleHabitLongPress = (habit) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Edit', 'Delete'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            // Edit - go directly to config modal
            setEditingHabit(habit);
            setSelectedTask({
              icon: habit.icon,
              name: habit.name,
              maxStreak: habit.maxStreak,
              time: habit.time,
              emojiText: habit.emojiText,
              emojiColor: habit.emojiColor,
              isCustom: true, // Allow editing name
            });
            setConfigModalVisible(true);
          } else if (buttonIndex === 2) {
            // Delete
            Alert.alert(
              'Delete Task',
              `Are you sure you want to delete "${habit.name}"?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteHabit(habit.id),
                },
              ]
            );
          }
        }
      );
    } else {
      // Android fallback
      Alert.alert('Edit Task', 'Choose an action', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Edit',
          onPress: () => {
            setEditingHabit(habit);
            setSelectedTask({
              icon: habit.icon,
              name: habit.name,
              maxStreak: habit.maxStreak,
              time: habit.time,
              emojiText: habit.emojiText,
              emojiColor: habit.emojiColor,
              isCustom: true,
            });
            setConfigModalVisible(true);
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Task',
              `Are you sure you want to delete "${habit.name}"?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteHabit(habit.id),
                },
              ]
            );
          },
        },
      ]);
    }
  };

  const allHabits = [...habits, { id: 'add' }];
  const totalPages = 1;

  return (
    <LinearGradient
      colors={['#5B9FED', '#8B7FD6', '#C96FB9', '#E85DA0']}
      style={styles.container}
      locations={[0, 0.35, 0.7, 1]}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {allHabits.map(habit => (
              <StreakCard
                key={habit.id}
                habit={habit}
                onPress={() =>
                  habit.id === 'add'
                    ? handleAddPress()
                    : handleHabitPress(habit.id)
                }
                onLongPress={
                  habit.id !== 'add'
                    ? () => handleHabitLongPress(habit)
                    : undefined
                }
              />
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Text style={styles.navIcon}>⚙️</Text>
          </TouchableOpacity>

          <View style={styles.pageIndicator}>
            {[...Array(totalPages)].map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentPage && styles.dotActive]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navIcon}>⭐</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Step 1: Task Selection Modal (Green) */}
      <TaskSelectModal
        visible={selectModalVisible}
        onClose={() => setSelectModalVisible(false)}
        onSelectTask={handleTaskSelected}
      />

      {/* Step 2: Task Configuration Modal (Orange) */}
      <TaskConfigModal
        visible={configModalVisible}
        task={selectedTask}
        onClose={handleConfigClose}
        onBack={handleConfigBack}
        onSave={handleSaveTask}
      />

      {/* Settings Modal */}
      <StreaksSettingsScreen
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  navIcon: {
    fontSize: 20,
  },
  pageIndicator: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: '#fff',
  },
});

export default StreaksScreen;
