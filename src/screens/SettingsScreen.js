import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { H1, H3, Body, BodySmall, Button, Card } from '../components';
import { colors, spacing } from '../theme';
import { useHabits } from '../habits';

const SettingsScreen = () => {
  const { setHabits, completions } = useHabits();

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all habits and completion history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@habits_data_habits');
              await AsyncStorage.removeItem('@habits_data_completions');
              setHabits([]);
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H1>Settings</H1>
      </View>
      <View style={styles.content}>
        <Card style={styles.card}>
          <H3 style={styles.cardTitle}>About</H3>
          <BodySmall color={colors.gray600}>
            Streaks - A habit tracker demo app inspired by the Streaks iOS app.
            Built with React Native.
          </BodySmall>
        </Card>

        <Card style={styles.card}>
          <H3 style={styles.cardTitle}>Data Management</H3>
          <BodySmall color={colors.gray600} style={styles.description}>
            Clear all habits and completion history from this device.
          </BodySmall>
          <Button
            title="Clear All Data"
            variant="outline"
            onPress={handleClearData}
          />
        </Card>
      </View>
    </View>
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
    flex: 1,
    padding: spacing.md,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.md,
  },
});

export default SettingsScreen;
