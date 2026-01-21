import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HabitsProvider, useHabits } from './src/habits';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme';

const AppContent = () => {
  const { isLoading } = useHabits();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <HabitsProvider>
      <StatusBar style="dark" />
      <AppContent />
    </HabitsProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray50,
  },
});
