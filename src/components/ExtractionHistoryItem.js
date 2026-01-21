import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Card from './Card';
import { Body, BodySmall, Caption } from './Typography';
import Badge from './Badge';
import { colors, spacing, borderRadius } from '../theme';

const ExtractionHistoryItem = ({ item, onPress }) => {
  const getStatusBadge = () => {
    switch (item.status) {
      case 'completed':
        return <Badge label="Completed" variant="success" size="sm" />;
      case 'failed':
        return <Badge label="Failed" variant="error" size="sm" />;
      case 'in_progress':
        return <Badge label="Processing" variant="warning" size="sm" />;
      default:
        return <Badge label="Pending" variant="secondary" size="sm" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getName = () => {
    if (item.status === 'completed' && item.result?.name) {
      return item.result.name;
    }
    if (item.status === 'in_progress' || item.status === 'pending') {
      return 'Processing...';
    }
    if (item.status === 'failed') {
      return 'Extraction Failed';
    }
    return 'Unknown';
  };

  const getPhoneNumbers = () => {
    if (item.status === 'completed' && item.result?.phone_numbers?.length > 0) {
      return item.result.phone_numbers.join(', ');
    }
    return null;
  };

  return (
    <Card style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
        )}
        <View style={styles.info}>
          <View style={styles.header}>
            <Body numberOfLines={1} style={styles.name}>
              {getName()}
            </Body>
            {getStatusBadge()}
          </View>
          {getPhoneNumbers() && (
            <BodySmall color={colors.gray600} numberOfLines={1}>
              {getPhoneNumbers()}
            </BodySmall>
          )}
          <Caption color={colors.gray400}>{formatDate(item.createdAt)}</Caption>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
  },
});

export default ExtractionHistoryItem;
