import React from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Button, Card, H1, H3, Body, BodySmall, Caption, Badge, Divider } from '../components';
import { colors, spacing } from '../theme';
import { usePurchases, usePurchaseActions } from '../purchases';

const PREMIUM_FEATURES = [
  'Unlimited access to all features',
  'Priority customer support',
  'Early access to new updates',
  'No advertisements',
];

const PaywallScreen = ({ onClose }) => {
  const { isPremium, isLoading } = usePurchases();
  const {
    isPurchasing,
    isRestoring,
    error,
    getPackages,
    handlePurchase,
    handleRestore,
  } = usePurchaseActions();

  const packages = getPackages();

  const formatPrice = (pkg) => {
    return pkg.product.priceString;
  };

  const getPackageLabel = (pkg) => {
    switch (pkg.packageType) {
      case 'MONTHLY':
        return 'Monthly';
      case 'ANNUAL':
        return 'Annual';
      case 'WEEKLY':
        return 'Weekly';
      case 'LIFETIME':
        return 'Lifetime';
      default:
        return pkg.identifier;
    }
  };

  if (isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <H1>Premium Active</H1>
          <Badge label="Subscribed" variant="success" size="lg" />
        </View>
        <Card style={styles.card}>
          <Body>You have full access to all premium features.</Body>
        </Card>
        <Button title="Close" onPress={onClose} variant="outline" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H1>Go Premium</H1>
        <BodySmall color={colors.gray500}>Unlock all features</BodySmall>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.featuresCard}>
          <Caption color={colors.gray500}>WHAT YOU GET</Caption>
          <View style={styles.featuresList}>
            {PREMIUM_FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Body color={colors.success}>✓</Body>
                <Body style={styles.featureText}>{feature}</Body>
              </View>
            ))}
          </View>
        </Card>

        <Divider spacing="md" />

        {isLoading ? (
          <Card style={styles.card}>
            <Body center color={colors.gray500}>Loading plans...</Body>
          </Card>
        ) : packages.length === 0 ? (
          <Card style={styles.card}>
            <Body center color={colors.gray500}>No plans available</Body>
            <Caption center color={colors.gray400} style={styles.hint}>
              Configure products in App Store Connect and RevenueCat
            </Caption>
          </Card>
        ) : (
          <View style={styles.packagesContainer}>
            {packages.map((pkg) => (
              <Card key={pkg.identifier} style={styles.packageCard}>
                <View style={styles.packageHeader}>
                  <H3>{getPackageLabel(pkg)}</H3>
                  <Body color={colors.primary}>{formatPrice(pkg)}</Body>
                </View>
                <BodySmall color={colors.gray500}>
                  {pkg.product.description || 'Full premium access'}
                </BodySmall>
                <Button
                  title={isPurchasing ? 'Processing...' : 'Subscribe'}
                  onPress={() => handlePurchase(pkg)}
                  disabled={isPurchasing || isRestoring}
                  loading={isPurchasing}
                  style={styles.subscribeButton}
                />
              </Card>
            ))}
          </View>
        )}

        {error && (
          <Caption color={colors.error} style={styles.error}>
            {error}
          </Caption>
        )}

        <Divider spacing="md" />

        <Button
          title={isRestoring ? 'Restoring...' : 'Restore Purchases'}
          onPress={handleRestore}
          variant="ghost"
          disabled={isPurchasing || isRestoring}
          loading={isRestoring}
        />

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <BodySmall color={colors.gray500}>Maybe Later</BodySmall>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: spacing.md,
  },
  featuresCard: {
    gap: spacing.sm,
  },
  featuresList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    flex: 1,
  },
  packagesContainer: {
    gap: spacing.md,
  },
  packageCard: {
    gap: spacing.sm,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscribeButton: {
    marginTop: spacing.sm,
  },
  error: {
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  hint: {
    marginTop: spacing.xs,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
});

export default PaywallScreen;
