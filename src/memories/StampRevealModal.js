import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GiftRevealModal from '../components/GiftRevealModal';
import { generateStamp, getStampInsights } from './stampGenerator';

/**
 * StampRevealModal - Celebratory reveal when user earns a stamp
 * Uses the reusable GiftRevealModal with stamp-specific content
 */
const StampRevealModal = ({
  visible,
  chapterId,
  chapterNumber,
  answers,
  onContinue,
}) => {
  const stamp = answers ? generateStamp(chapterId, answers) : null;
  const insights = answers ? getStampInsights(chapterId, answers) : [];

  if (!stamp) return null;

  // Stamp content shown after gift opens
  const stampContent = (
    <View style={styles.stampContainer}>
      <View style={styles.stampCircle}>
        <Text style={styles.stampIcon}>{stamp.actIcon}</Text>
      </View>
      <Text style={styles.stampLabel}>{stamp.label}</Text>
      <Text style={styles.stampSubtext}>Stamp Earned</Text>
    </View>
  );

  // Insights shown below stamp
  const insightsContent = insights.length > 0 ? (
    <View style={styles.insightsContainer}>
      <Text style={styles.insightsTitle}>Based on your answers</Text>
      {insights.map((insight, index) => (
        <View key={index} style={styles.insightRow}>
          <Text style={styles.insightIcon}>{insight.icon}</Text>
          <Text style={styles.insightText} numberOfLines={2}>
            {insight.answer}
          </Text>
        </View>
      ))}
    </View>
  ) : null;

  return (
    <GiftRevealModal
      visible={visible}
      headerText={`Act ${chapterNumber} Complete`}
      giftIcon="🎁"
      revealContent={stampContent}
      footerContent={insightsContent}
      continueText="Continue"
      onContinue={onContinue}
    />
  );
};

const styles = StyleSheet.create({
  stampContainer: {
    alignItems: 'center',
  },
  stampCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  stampIcon: {
    fontSize: 48,
  },
  stampLabel: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
  },
  stampSubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  insightsContainer: {
    width: '100%',
  },
  insightsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: 'center',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default StampRevealModal;
