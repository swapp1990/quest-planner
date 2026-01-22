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
import { useCampaign } from '../campaign';
import QuestCard from '../components/QuestCard';
import CircularProgress from '../components/CircularProgress';
import { InfoBanner } from '../components';

const ChapterDetailScreen = ({ chapter, onBack }) => {
  const {
    incrementQuest,
    getChapterProgress,
    getCompletedQuestCount,
    isChapterComplete,
    isQuestComplete,
  } = useCampaign();

  if (!chapter) {
    return null;
  }

  const progress = getChapterProgress(chapter);
  const completedQuests = getCompletedQuestCount(chapter);
  const totalQuests = chapter.quests.length;
  const isComplete = isChapterComplete(chapter);

  const handleQuestPress = (questId) => {
    incrementQuest(chapter.id, questId);
  };

  return (
    <LinearGradient
      colors={['#FFAB91', '#FF7043', '#F4511E', '#E64A19']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerSubtitle}>{chapter.subtitle}</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {chapter.title}
            </Text>
          </View>
          <View style={styles.headerProgress}>
            <CircularProgress
              size={44}
              strokeWidth={4}
              progress={progress}
              maxSegments={totalQuests}
              completedSegments={completedQuests}
              color="#fff"
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Chapter Description */}
          <InfoBanner
            icon={chapter.icon}
            message={chapter.description}
            variant="info"
          />

          {/* Progress Summary */}
          <View style={styles.progressSummary}>
            <Text style={styles.progressText}>
              {isComplete
                ? '🎉 All quests completed!'
                : `${completedQuests} of ${totalQuests} quests completed`}
            </Text>
          </View>

          {/* Quests Section */}
          <Text style={styles.sectionTitle}>QUESTS</Text>

          {chapter.quests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onPress={() => handleQuestPress(quest.id)}
            />
          ))}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Complete Chapter Button (when all quests done) */}
        {isComplete && (
          <View style={styles.completeContainer}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={onBack}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>
                ✓ CHAPTER COMPLETE - CONTINUE
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '500',
    marginTop: -2,
  },
  headerContent: {
    flex: 1,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerProgress: {
    marginLeft: 12,
  },
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  progressSummary: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    fontWeight: '500',
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 8,
  },
  bottomSpacer: {
    height: 100,
  },
  // Complete Button
  completeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  completeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ChapterDetailScreen;
