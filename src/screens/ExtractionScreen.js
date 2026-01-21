import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Button,
  Card,
  H1,
  H3,
  Body,
  BodySmall,
  Caption,
  Badge,
  Divider,
  ExtractionHistoryItem,
} from '../components';
import { colors, spacing, borderRadius } from '../theme';
import { useExtraction, useExtractionActions } from '../extraction';

const ExtractionScreen = ({ onClose }) => {
  const { history, isLoading: isHistoryLoading } = useExtraction();
  const { captureAndExtract, isProcessing, currentExtraction, error } =
    useExtractionActions();

  const handleCamera = () => {
    captureAndExtract('camera');
  };

  const handleGallery = () => {
    captureAndExtract('gallery');
  };

  const renderCurrentExtraction = () => {
    if (!currentExtraction) return null;

    const getStatusBadge = () => {
      switch (currentExtraction.status) {
        case 'completed':
          return <Badge label="Completed" variant="success" />;
        case 'failed':
          return <Badge label="Failed" variant="error" />;
        case 'in_progress':
          return <Badge label="Processing" variant="warning" />;
        default:
          return <Badge label="Pending" variant="secondary" />;
      }
    };

    return (
      <Card style={styles.currentCard}>
        <View style={styles.currentHeader}>
          <H3>Current Extraction</H3>
          {getStatusBadge()}
        </View>

        <View style={styles.currentContent}>
          {currentExtraction.imageUri && (
            <Image
              source={{ uri: currentExtraction.imageUri }}
              style={styles.currentImage}
            />
          )}

          <View style={styles.currentInfo}>
            {isProcessing && (
              <View style={styles.processingRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <BodySmall color={colors.gray500}>Extracting information...</BodySmall>
              </View>
            )}

            {currentExtraction.status === 'completed' && currentExtraction.result && (
              <>
                <View style={styles.resultRow}>
                  <Caption color={colors.gray500}>NAME</Caption>
                  <Body>{currentExtraction.result.name || 'Not found'}</Body>
                </View>
                <View style={styles.resultRow}>
                  <Caption color={colors.gray500}>PHONE NUMBERS</Caption>
                  {currentExtraction.result.phone_numbers?.length > 0 ? (
                    currentExtraction.result.phone_numbers.map((phone, idx) => (
                      <BodySmall key={idx}>{phone}</BodySmall>
                    ))
                  ) : (
                    <BodySmall color={colors.gray400}>None found</BodySmall>
                  )}
                </View>
              </>
            )}

            {currentExtraction.status === 'failed' && (
              <BodySmall color={colors.error}>
                {currentExtraction.error || 'Extraction failed'}
              </BodySmall>
            )}
          </View>
        </View>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Body color={colors.gray400} center>
        No extraction history yet
      </Body>
      <BodySmall color={colors.gray400} center>
        Take a photo or select an image to extract member information
      </BodySmall>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <ExtractionHistoryItem item={item} onPress={() => {}} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H1>Form Extraction</H1>
        <BodySmall color={colors.gray500}>
          Extract member info from forms
        </BodySmall>
      </View>

      <View style={styles.buttonRow}>
        <Button
          title={isProcessing ? "Processing..." : "Camera"}
          onPress={handleCamera}
          disabled={isProcessing}
          loading={isProcessing}
          style={styles.actionButton}
        />
        <Button
          title="Gallery"
          onPress={handleGallery}
          variant="outline"
          disabled={isProcessing}
          style={styles.actionButton}
        />
      </View>

      {error && (
        <Card style={styles.errorCard}>
          <View style={styles.errorContent}>
            <Badge label="Error" variant="error" />
            <Body color={colors.error} style={styles.errorText}>{error}</Body>
          </View>
        </Card>
      )}

      {renderCurrentExtraction()}

      <Divider spacing="md" />

      <View style={styles.historyHeader}>
        <Caption color={colors.gray500}>HISTORY</Caption>
      </View>

      {isHistoryLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : history.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <BodySmall color={colors.gray500}>Close</BodySmall>
      </TouchableOpacity>
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
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  errorCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.error + '10',
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
  },
  currentCard: {
    marginBottom: spacing.md,
  },
  currentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  currentContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  currentImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
  },
  currentInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultRow: {
    gap: spacing.xs,
  },
  historyHeader: {
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
});

export default ExtractionScreen;
