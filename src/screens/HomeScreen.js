import React, { useState } from 'react';
import { View, StyleSheet, Platform, Modal, ScrollView } from 'react-native';
import { Button, Card, H1, H3, Body, BodySmall, Caption, Avatar, Badge, Divider } from '../components';
import { colors, spacing } from '../theme';
import { useAuth } from '../auth/AuthContext';
import { usePurchases } from '../purchases';
import PaywallScreen from './PaywallScreen';
import ExtractionScreen from './ExtractionScreen';

const HomeScreen = () => {
  const { user, signOut } = useAuth();
  const { isPremium, isLoading: isPurchasesLoading } = usePurchases();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showExtraction, setShowExtraction] = useState(false);

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
        <View style={styles.infoRow}>
          <BodySmall color={colors.gray600}>Subscription</BodySmall>
          {isPurchasesLoading ? (
            <Caption color={colors.gray400}>Loading...</Caption>
          ) : (
            <Badge
              label={isPremium ? 'Premium' : 'Free'}
              variant={isPremium ? 'success' : 'secondary'}
              size="sm"
            />
          )}
        </View>
      </Card>

      {!isPremium && !isPurchasesLoading && (
        <Card style={styles.upgradeCard}>
          <View style={styles.upgradeContent}>
            <View style={styles.upgradeText}>
              <H3>Upgrade to Premium</H3>
              <BodySmall color={colors.gray500}>
                Unlock all features and remove ads
              </BodySmall>
            </View>
            <Button
              title="Upgrade"
              onPress={() => setShowPaywall(true)}
              size="sm"
            />
          </View>
        </Card>
      )}

      <Card style={styles.extractionCard}>
        <View style={styles.extractionContent}>
          <View style={styles.extractionText}>
            <H3>Form Extraction</H3>
            <BodySmall color={colors.gray500}>
              Extract member info from membership forms
            </BodySmall>
          </View>
          <Button
            title="Open"
            onPress={() => setShowExtraction(true)}
            variant="outline"
            size="sm"
          />
        </View>
      </Card>

      <View style={styles.signOutContainer}>
        <Button
          title="Sign Out"
          onPress={signOut}
          variant="outline"
        />
      </View>

      <Modal
        visible={showPaywall}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPaywall(false)}
      >
        <PaywallScreen onClose={() => setShowPaywall(false)} />
      </Modal>

      <Modal
        visible={showExtraction}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowExtraction(false)}
      >
        <ExtractionScreen onClose={() => setShowExtraction(false)} />
      </Modal>
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
  upgradeCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  upgradeText: {
    flex: 1,
    gap: spacing.xs,
  },
  extractionCard: {
    marginTop: spacing.lg,
  },
  extractionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  extractionText: {
    flex: 1,
    gap: spacing.xs,
  },
  signOutContainer: {
    marginTop: spacing.xl,
  },
});

export default HomeScreen;
