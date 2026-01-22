import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCampaign, SOLO_TRIP_CAMPAIGN } from '../campaign';
import ChapterCard from '../components/ChapterCard';
import CircularProgress from '../components/CircularProgress';

const CampaignMapScreen = ({ onSelectChapter, onBack }) => {
  const {
    campaign,
    isLoading,
    startCampaign,
    checkChapterLocked,
    getChapterProgress,
    getCompletedQuestCount,
    isChapterComplete,
    getCampaignProgress,
    isCampaignComplete,
    justCompletedChapter,
    clearChapterCelebration,
  } = useCampaign();

  const [celebrationAnim] = useState(new Animated.Value(0));
  const [showCelebration, setShowCelebration] = useState(false);

  // Handle chapter completion celebration
  useEffect(() => {
    if (justCompletedChapter) {
      setShowCelebration(true);
      Animated.sequence([
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(celebrationAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowCelebration(false);
        clearChapterCelebration();
      });
    }
  }, [justCompletedChapter]);

  // No campaign started - show start screen
  if (!isLoading && !campaign) {
    return (
      <LinearGradient
        colors={['#5B9FED', '#4A90E2', '#3B7DD8', '#2E6BC4']}
        style={styles.container}
      >
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.startContainer}>
            <Text style={styles.startIcon}>✈️</Text>
            <Text style={styles.startTitle}>Solo Trip</Text>
            <Text style={styles.startDescription}>
              {SOLO_TRIP_CAMPAIGN.description}
            </Text>
            <Text style={styles.startChapters}>
              {SOLO_TRIP_CAMPAIGN.chapters.length} Chapters •{' '}
              {SOLO_TRIP_CAMPAIGN.chapters.reduce(
                (sum, ch) => sum + ch.quests.length,
                0
              )}{' '}
              Quests
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => startCampaign()}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>BEGIN JOURNEY</Text>
            </TouchableOpacity>

            {onBack && (
              <TouchableOpacity
                style={styles.backLink}
                onPress={onBack}
              >
                <Text style={styles.backLinkText}>← Back to Habits</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#5B9FED', '#4A90E2', '#3B7DD8', '#2E6BC4']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const overallProgress = getCampaignProgress();
  const completedChaptersCount = campaign?.chapters.filter(ch => isChapterComplete(ch)).length || 0;
  const campaignComplete = isCampaignComplete();

  return (
    <LinearGradient
      colors={['#5B9FED', '#4A90E2', '#3B7DD8', '#2E6BC4']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>{campaign.icon}</Text>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{campaign.name}</Text>
              <Text style={styles.headerProgress}>
                {campaignComplete
                  ? 'Journey Complete! 🎉'
                  : `${Math.round(overallProgress)}% Complete`}
              </Text>
            </View>
          </View>
          <View style={styles.headerProgress}>
            <CircularProgress
              size={44}
              strokeWidth={4}
              progress={overallProgress}
              maxSegments={campaign.chapters.length}
              completedSegments={completedChaptersCount}
              color="#fff"
            />
          </View>
        </View>

        {/* Chapter List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>YOUR JOURNEY</Text>

          {campaign.chapters.map((chapter, index) => {
            const isLocked = checkChapterLocked(index);
            const isComplete = isChapterComplete(chapter);
            const progress = getChapterProgress(chapter);
            const completedQuests = getCompletedQuestCount(chapter);
            const totalQuests = chapter.quests.length;

            return (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                chapterNumber={index + 1}
                progress={progress}
                completedQuests={completedQuests}
                totalQuests={totalQuests}
                isLocked={isLocked}
                isCompleted={isComplete}
                onPress={() => onSelectChapter && onSelectChapter(chapter)}
              />
            );
          })}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Chapter Complete Celebration */}
        {showCelebration && (
          <Animated.View
            style={[
              styles.celebrationOverlay,
              {
                opacity: celebrationAnim,
                transform: [
                  {
                    scale: celebrationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.celebrationCard}>
              <Text style={styles.celebrationEmoji}>🎉</Text>
              <Text style={styles.celebrationTitle}>Chapter Complete!</Text>
              <Text style={styles.celebrationSubtitle}>
                New chapter unlocked
              </Text>
            </View>
          </Animated.View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  // Start Screen
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  startIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  startTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
  },
  startDescription: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  startChapters: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  backLink: {
    marginTop: 24,
  },
  backLinkText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerProgress: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
  },
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 16,
    marginTop: 8,
  },
  bottomSpacer: {
    height: 40,
  },
  // Celebration
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  celebrationCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 48,
    paddingVertical: 32,
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default CampaignMapScreen;
