import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, Card, H1, H3, Body, BodySmall, Caption, Avatar, Badge, Divider } from '../components';
import { colors, spacing } from '../theme';
import { useAuth } from '../auth/AuthContext';

const HomeScreen = () => {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H1>Home</H1>
        <BodySmall color={colors.gray500}>Welcome back!</BodySmall>
      </View>

      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Avatar
            source={user.picture ? { uri: user.picture } : undefined}
            name={user.name}
            size="xl"
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <H3>{user.name}</H3>
              <Badge label="Verified" variant="success" size="sm" />
            </View>
            <Body color={colors.gray500}>{user.email}</Body>
          </View>
        </View>
      </Card>

      <Divider spacing="lg" />

      <Card variant="filled" style={styles.infoCard}>
        <Caption color={colors.gray500}>ACCOUNT INFO</Caption>
        <View style={styles.infoRow}>
          <BodySmall color={colors.gray600}>User ID</BodySmall>
          <Caption>{user.id}</Caption>
        </View>
        <View style={styles.infoRow}>
          <BodySmall color={colors.gray600}>Sign-in Method</BodySmall>
          <Badge label="Google" variant="info" size="sm" />
        </View>
      </Card>

      <View style={styles.signOutContainer}>
        <Button
          title="Sign Out"
          onPress={signOut}
          variant="outline"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  profileCard: {
    marginBottom: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoCard: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signOutContainer: {
    marginTop: spacing.xl,
  },
});

export default HomeScreen;
