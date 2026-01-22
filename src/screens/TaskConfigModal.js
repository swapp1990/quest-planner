import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  ThemedModal,
  ModalHeader,
  SectionHeader,
  ListRow,
  InfoBanner,
} from '../components';
import CircularProgress from '../components/CircularProgress';

const TaskConfigModal = ({ visible, task, onClose, onSave, onBack }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [maxStreak, setMaxStreak] = useState(4);
  const [time, setTime] = useState('');
  const [emojiText, setEmojiText] = useState('');
  const [emojiColor, setEmojiColor] = useState('#fff');

  const isCustom = task?.isCustom;

  useEffect(() => {
    if (visible && task) {
      setName(task.name || '');
      setIcon(task.icon || '⭐');
      setMaxStreak(task.maxStreak || 4);
      setTime(task.time || '');
      setEmojiText(task.emojiText || '');
      setEmojiColor(task.emojiColor || '#fff');
    }
  }, [visible, task]);

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      icon,
      maxStreak,
      time: time.trim() || null,
      emojiText: emojiText.trim() || null,
      emojiColor: emojiColor || null,
    });
  };

  const displayName = name || task?.name || 'New Task';

  return (
    <ThemedModal
      visible={visible}
      onClose={onClose}
      theme="orange"
    >
      {/* Header */}
      <ModalHeader
        title="Confirm Task"
        onClose={onBack}
        showBackArrow={true}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Task Preview */}
        <View style={styles.previewContainer}>
          <View style={styles.circleContainer}>
            <CircularProgress
              size={140}
              strokeWidth={10}
              progress={0}
              maxSegments={maxStreak}
              color="#fff"
            />
            <View style={styles.iconContainer}>
              <Text style={styles.previewIcon}>{icon}</Text>
            </View>
            {/* Options button */}
            <TouchableOpacity style={styles.optionsButton}>
              <Text style={styles.optionsText}>•••</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.previewName}>
            {emojiText && <Text style={{ color: emojiColor }}>{emojiText} </Text>}
            {displayName.toUpperCase()}
          </Text>
        </View>

        {/* Info Banner for custom tasks */}
        {isCustom && (
          <InfoBanner
            icon="💡"
            message="Create your own custom task with any name and icon."
            variant="info"
          />
        )}

        {/* Title Input (for custom tasks) */}
        {isCustom && (
          <>
            <SectionHeader title="Title" />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter task name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoFocus
              />
              <Text style={styles.charCount}>{name.length} / 20</Text>
            </View>
          </>
        )}

        {/* Configuration Options */}
        <ListRow
          icon="1️⃣"
          iconBackground="rgba(255, 255, 255, 0.2)"
          label="Day-Long Task"
          showChevron={true}
          onPress={() => setMaxStreak(1)}
        />

        <ListRow
          icon="🎯"
          iconBackground="rgba(255, 255, 255, 0.2)"
          label="Goal"
          value={`${maxStreak} ${maxStreak === 1 ? 'time' : 'times'}`}
          onPress={() => {
            const next = maxStreak >= 10 ? 1 : maxStreak + 1;
            setMaxStreak(next);
          }}
        />

        <ListRow
          icon="📅"
          iconBackground="rgba(255, 255, 255, 0.2)"
          label="Task Days"
          value="Every Day"
          onPress={() => {}}
        />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, (!name.trim() && isCustom) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!name.trim() && isCustom}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>SAVE TASK</Text>
        </TouchableOpacity>
      </View>
    </ThemedModal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circleContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 48,
  },
  optionsButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
  },
  charCount: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  saveButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default TaskConfigModal;
