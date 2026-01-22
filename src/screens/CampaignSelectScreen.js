import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Available campaigns
const CAMPAIGNS = [
  {
    id: 'solo-trip',
    name: 'Solo Trip',
    description: 'Plan your perfect solo adventure',
    icon: '✈️',
    difficulty: 'Beginner',
    chapters: 4,
    questsEstimate: '6-8 per act',
    isLocked: false,
  },
  {
    id: 'fitness-journey',
    name: 'Fitness Journey',
    description: 'Transform your body and mind',
    icon: '💪',
    difficulty: 'Intermediate',
    chapters: 6,
    questsEstimate: '~24',
    isLocked: true,
  },
  {
    id: 'learn-language',
    name: 'Learn a Language',
    description: 'Master a new language in 90 days',
    icon: '🗣️',
    difficulty: 'Intermediate',
    chapters: 8,
    questsEstimate: '~32',
    isLocked: true,
  },
  {
    id: 'side-hustle',
    name: 'Side Hustle',
    description: 'Launch your passion project',
    icon: '🚀',
    difficulty: 'Advanced',
    chapters: 5,
    questsEstimate: '~20',
    isLocked: true,
  },
];

const CampaignCard = ({ campaign, onPress }) => {
  const isLocked = campaign.isLocked;

  return (
    <TouchableOpacity
      style={[styles.card, isLocked && styles.cardLocked]}
      onPress={() => !isLocked && onPress(campaign)}
      activeOpacity={isLocked ? 1 : 0.7}
      disabled={isLocked}
    >
      {/* Icon */}
      <View style={[styles.cardIcon, isLocked && styles.cardIconLocked]}>
        <Text style={styles.cardIconText}>
          {isLocked ? '🔒' : campaign.icon}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isLocked && styles.textLocked]}>
            {campaign.name}
          </Text>
          <View style={[styles.difficultyBadge, isLocked && styles.badgeLocked]}>
            <Text style={styles.difficultyText}>{campaign.difficulty}</Text>
          </View>
        </View>
        <Text style={[styles.cardDescription, isLocked && styles.textLocked]}>
          {campaign.description}
        </Text>
        <Text style={[styles.cardMeta, isLocked && styles.textLocked]}>
          {campaign.chapters} Acts • {campaign.questsEstimate} quests
        </Text>
      </View>

      {/* Chevron */}
      {!isLocked && (
        <Text style={styles.chevron}>›</Text>
      )}
    </TouchableOpacity>
  );
};

const CampaignSelectScreen = ({ onSelectCampaign }) => {
  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Quest</Text>
          <Text style={styles.headerSubtitle}>
            Select a campaign to begin your journey
          </Text>
        </View>

        {/* Campaign List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {CAMPAIGNS.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onPress={onSelectCampaign}
            />
          ))}

          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>
              More campaigns coming soon...
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  cardLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.6,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardIconLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardIconText: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(139, 195, 74, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  difficultyText: {
    color: '#8BC34A',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  cardMeta: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  textLocked: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  chevron: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 28,
    fontWeight: '300',
    marginLeft: 8,
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  comingSoonText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default CampaignSelectScreen;
