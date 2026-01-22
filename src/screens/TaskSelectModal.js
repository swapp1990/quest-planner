import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  ThemedModal,
  ModalHeader,
  SectionHeader,
  ListRow,
  IconButton,
} from '../components';

// Predefined task templates
const TASK_CATEGORIES = {
  habits: {
    icon: '✓',
    tasks: [
      { icon: '💧', name: 'Drink Water', defaultSegments: 8 },
      { icon: '🪥', name: 'Brush Teeth', defaultSegments: 2 },
      { icon: '📚', name: 'Read', defaultSegments: 1 },
      { icon: '🧹', name: 'Clean', defaultSegments: 1 },
      { icon: '💊', name: 'Medication', defaultSegments: 1 },
      { icon: '📓', name: 'Journal', defaultSegments: 1 },
    ],
  },
  health: {
    icon: '❤️',
    tasks: [
      { icon: '🏃', name: 'Walk or Run', defaultSegments: 1 },
      { icon: '❤️', name: 'Heart Rate Zone', defaultSegments: 1 },
      { icon: '🧍', name: 'Stand Minutes', defaultSegments: 1 },
      { icon: '🚴', name: 'Cycle', defaultSegments: 1 },
      { icon: '🏊', name: 'Swim', defaultSegments: 1 },
      { icon: '☀️', name: 'Time In Daylight', defaultSegments: 1 },
      { icon: '🧘', name: 'Mindful Minutes', defaultSegments: 1 },
      { icon: '🪜', name: 'Climb Flights', defaultSegments: 1 },
    ],
  },
  fitness: {
    icon: '🍴',
    tasks: [
      { icon: '🥗', name: 'Eat Healthy Meal', defaultSegments: 3 },
      { icon: '🚭', name: "Don't Smoke", defaultSegments: 1 },
      { icon: '🍺', name: "No Alcohol", defaultSegments: 1 },
      { icon: '☕', name: 'Limit Coffee', defaultSegments: 3 },
    ],
  },
  time: {
    icon: '⏱️',
    tasks: [
      { icon: '😴', name: 'Sleep Early', defaultSegments: 1 },
      { icon: '⏰', name: 'Wake Up Early', defaultSegments: 1 },
      { icon: '📵', name: 'Screen Time Limit', defaultSegments: 1 },
    ],
  },
  avoid: {
    icon: '⊘',
    tasks: [
      { icon: '🍬', name: 'No Sweets', defaultSegments: 1 },
      { icon: '🍟', name: 'No Junk Food', defaultSegments: 1 },
      { icon: '📱', name: 'No Social Media', defaultSegments: 1 },
    ],
  },
};

const CATEGORY_KEYS = ['habits', 'health', 'fitness', 'time', 'avoid'];

const TaskSelectModal = ({ visible, onClose, onSelectTask }) => {
  const [activeCategory, setActiveCategory] = useState('habits');

  const handleTaskSelect = (task) => {
    onSelectTask({
      icon: task.icon,
      name: task.name,
      maxStreak: task.defaultSegments,
    });
  };

  const handleCustomTask = () => {
    onSelectTask({
      icon: '✨',
      name: '',
      maxStreak: 4,
      isCustom: true,
    });
  };

  const getCategoryLabel = (key) => {
    const labels = {
      habits: 'HABITS TASKS',
      health: 'HEALTH TASKS',
      fitness: 'FOOD & DIET',
      time: 'TIME TASKS',
      avoid: 'AVOID TASKS',
    };
    return labels[key] || key.toUpperCase();
  };

  return (
    <ThemedModal
      visible={visible}
      onClose={onClose}
      theme="green"
    >
      {/* Header */}
      <ModalHeader
        title="Add Task"
        onClose={onClose}
        onAction={() => {}}
        actionIcon="🔍"
        buttonStyle="dark"
      />

      {/* Category Tabs */}
      <View style={styles.categoryRow}>
        {CATEGORY_KEYS.map((key) => (
          <IconButton
            key={key}
            icon={TASK_CATEGORIES[key].icon}
            selected={activeCategory === key}
            onPress={() => setActiveCategory(key)}
            size="md"
            color="rgba(0, 0, 0, 0.15)"
            selectedColor="#CDDC39"
            iconColor="#fff"
            selectedIconColor="#333"
          />
        ))}
      </View>

      {/* Info Text */}
      <Text style={styles.infoText}>
        Select a task below or create a custom one.
      </Text>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
        <SectionHeader
          title={getCategoryLabel(activeCategory)}
          variant="olive"
        />

        {/* Task List */}
        {TASK_CATEGORIES[activeCategory].tasks.map((task, index) => (
          <ListRow
            key={`${task.name}-${index}`}
            icon={task.icon}
            iconBackground="rgba(0, 0, 0, 0.12)"
            badge={<Text style={styles.heartBadge}>❤️</Text>}
            label={task.name}
            variant="solid"
            onPress={() => handleTaskSelect(task)}
          />
        ))}

        {/* Custom Task Option */}
        <SectionHeader
          title="OR CREATE YOUR OWN"
          variant="olive"
        />
        <ListRow
          icon="✨"
          iconBackground="rgba(0, 0, 0, 0.12)"
          label="Custom Task"
          value="Create"
          variant="solid"
          onPress={handleCustomTask}
        />

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ThemedModal>
  );
};

const styles = StyleSheet.create({
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  heartBadge: {
    fontSize: 14,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default TaskSelectModal;
