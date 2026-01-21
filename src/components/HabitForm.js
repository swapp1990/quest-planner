import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button, Input, H2, Body, BodySmall } from './';
import { colors, spacing } from '../theme';

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitForm = ({ visible, habit, onSave, onCancel }) => {
  const [name, setName] = useState(habit?.name || '');
  const [notes, setNotes] = useState(habit?.notes || '');
  const [scheduleType, setScheduleType] = useState(habit?.schedule?.type || 'daily');
  const [selectedDays, setSelectedDays] = useState(habit?.schedule?.weekdays || []);

  const toggleWeekday = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const schedule =
      scheduleType === 'daily'
        ? { type: 'daily', weekdays: [] }
        : { type: 'weekdays', weekdays: selectedDays };

    onSave({
      name: name.trim(),
      notes: notes.trim(),
      schedule,
    });

    setName('');
    setNotes('');
    setScheduleType('daily');
    setSelectedDays([]);
  };

  const handleCancel = () => {
    setName(habit?.name || '');
    setNotes(habit?.notes || '');
    setScheduleType(habit?.schedule?.type || 'daily');
    setSelectedDays(habit?.schedule?.weekdays || []);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <H2>{habit ? 'Edit Habit' : 'New Habit'}</H2>
        </View>

        <View style={styles.content}>
          <Input
            label="Habit Name"
            placeholder="e.g., Morning meditation"
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <Input
            label="Notes (optional)"
            placeholder="Add any notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          {/* Schedule Type */}
          <View style={styles.section}>
            <BodySmall color={colors.gray700} style={styles.label}>
              Schedule
            </BodySmall>
            <View style={styles.scheduleTypes}>
              <TouchableOpacity
                style={[
                  styles.scheduleButton,
                  scheduleType === 'daily' && styles.scheduleButtonActive,
                ]}
                onPress={() => setScheduleType('daily')}
              >
                <Body
                  color={scheduleType === 'daily' ? '#fff' : colors.gray700}
                >
                  Daily
                </Body>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.scheduleButton,
                  scheduleType === 'weekdays' && styles.scheduleButtonActive,
                ]}
                onPress={() => setScheduleType('weekdays')}
              >
                <Body
                  color={scheduleType === 'weekdays' ? '#fff' : colors.gray700}
                >
                  Specific Days
                </Body>
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekday Selector */}
          {scheduleType === 'weekdays' && (
            <View style={styles.section}>
              <BodySmall color={colors.gray700} style={styles.label}>
                Select Days
              </BodySmall>
              <View style={styles.weekdaysRow}>
                {WEEKDAY_NAMES.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.weekdayButton,
                      selectedDays.includes(index) && styles.weekdayButtonActive,
                    ]}
                    onPress={() => toggleWeekday(index)}
                  >
                    <BodySmall
                      color={
                        selectedDays.includes(index) ? '#fff' : colors.gray700
                      }
                    >
                      {day}
                    </BodySmall>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={handleCancel}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Save"
                onPress={handleSave}
                disabled={
                  !name.trim() ||
                  (scheduleType === 'weekdays' && selectedDays.length === 0)
                }
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  section: {
    marginTop: spacing.sm,
  },
  label: {
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  scheduleTypes: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  scheduleButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  scheduleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weekdaysRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  weekdayButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  weekdayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
  },
});

export default HabitForm;
