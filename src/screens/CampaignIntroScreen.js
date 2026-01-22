import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SOLO_TRIP_CAMPAIGN } from '../campaign';

// Map campaign IDs to full template data
const CAMPAIGN_TEMPLATES = {
  'solo-trip': SOLO_TRIP_CAMPAIGN,
};

const CampaignIntroScreen = ({ campaign, onBegin, onBack }) => {
  // Get full campaign template by ID, or use the campaign if it already has chapters array
  const campaignData = campaign?.id && CAMPAIGN_TEMPLATES[campaign.id]
    ? CAMPAIGN_TEMPLATES[campaign.id]
    : SOLO_TRIP_CAMPAIGN;

  // Show estimate since quests are AI-generated and user-selectable
  // Base estimate: 6-8 quests per act depending on plan choice
  const estimatedQuestsPerAct = '6-8';
  const totalActsCount = campaignData.chapters.length;

  return (
    <LinearGradient
      colors={['#5B9FED', '#4A90E2', '#3B7DD8', '#2E6BC4']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.icon}>{campaignData.icon}</Text>
          <Text style={styles.title}>{campaignData.name}</Text>
          <Text style={styles.description}>{campaignData.description}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{totalActsCount}</Text>
              <Text style={styles.statLabel}>Acts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{estimatedQuestsPerAct}</Text>
              <Text style={styles.statLabel}>Quests/Act</Text>
            </View>
          </View>

          {/* First chapter preview */}
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>YOUR JOURNEY BEGINS WITH</Text>
            <Text style={styles.previewTitle}>
              {campaignData.chapters[0].subtitle}: {campaignData.chapters[0].title}
            </Text>
            <Text style={styles.previewDescription}>
              {campaignData.chapters[0].description}
            </Text>
          </View>
        </View>

        {/* Begin Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.beginButton}
            onPress={onBegin}
            activeOpacity={0.8}
          >
            <Text style={styles.beginButtonText}>BEGIN JOURNEY</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '500',
    marginTop: -2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statNumber: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  previewLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  previewDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  beginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  beginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default CampaignIntroScreen;
