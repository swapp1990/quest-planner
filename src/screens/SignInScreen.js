import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, Card, H1, Body, Caption } from '../components';
import { colors, spacing } from '../theme';
import { useGoogleAuth } from '../auth/useGoogleAuth';

const SignInScreen = () => {
  const { handleGoogleSignIn, isSigningIn, error, isReady } = useGoogleAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H1>Welcome</H1>
        <Body color={colors.gray500}>Sign in to continue</Body>
      </View>

      <Card style={styles.card}>
        <Button
          title="Sign in with Google"
          onPress={handleGoogleSignIn}
          loading={isSigningIn}
          disabled={!isReady || isSigningIn}
          size="lg"
        />

        {error && (
          <Caption color={colors.error} style={styles.error}>
            {error}
          </Caption>
        )}
      </Card>

      <View style={styles.footer}>
        <Caption center color={colors.gray400}>
          By signing in, you agree to our Terms of Service
        </Caption>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
    paddingTop: Platform.OS === 'ios' ? 120 : 80,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  card: {
    gap: spacing.md,
  },
  error: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.lg,
    right: spacing.lg,
  },
});

export default SignInScreen;
