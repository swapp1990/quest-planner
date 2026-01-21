import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import { PurchasesProvider } from './src/purchases';
import { ExtractionProvider } from './src/extraction';
import SignInScreen from './src/screens/SignInScreen';
import HomeScreen from './src/screens/HomeScreen';
import { colors } from './src/theme';

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return user ? <HomeScreen /> : <SignInScreen />;
};

const PurchasesWrapper = ({ children }) => {
  const { user } = useAuth();
  return (
    <PurchasesProvider userId={user?.id}>
      <ExtractionProvider>
        {children}
      </ExtractionProvider>
    </PurchasesProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PurchasesWrapper>
        <StatusBar style="dark" />
        <AppContent />
      </PurchasesWrapper>
    </AuthProvider>
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
