import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCampaign } from '../campaign';
import CircularProgress from '../components/CircularProgress';
import * as Haptics from 'expo-haptics';
import QuestInfoModal from './QuestInfoModal';
import QuestActionModal from './QuestActionModal';
import { MemoryStampModal, generateStamp, getStampInsights } from '../memories';

const { width } = Dimensions.get('window');
// Match StreakCard sizing exactly
const CARD_SIZE = (width - 48) / 2;
const CIRCLE_SIZE = CARD_SIZE - 16;

// Quest Circle Card - matches StreakCard styling exactly
const QuestCircle = ({ quest, onPress, isLocked = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isComplete = quest.completedSegments >= quest.maxSegments;
  const progress = (quest.completedSegments / quest.maxSegments) * 100;

  const handlePressIn = () => {
    if (isLocked) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      speed: 50,
      bounciness: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (isLocked) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 50,
      bounciness: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (isLocked) return;
    if (!isComplete && onPress) {
      // Check if about to complete
      if (quest.completedSegments === quest.maxSegments - 1) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onPress();
    }
  };

  return (
    <Animated.View style={[styles.questCard, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.questCardInner, isLocked && styles.lockedCard]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={isLocked ? 1 : 1}
        disabled={isComplete || isLocked}
      >
        {/* Progress Ring */}
        <View style={[styles.circleContainer, isLocked && styles.lockedCircle]}>
          {/* Complete background - solid white circle */}
          {isComplete && !isLocked && <View style={styles.completeBackground} />}

          <CircularProgress
            size={CIRCLE_SIZE}
            strokeWidth={10}
            progress={isLocked ? 0 : progress}
            maxSegments={quest.maxSegments}
            completedSegments={isLocked ? 0 : quest.completedSegments}
            color={isComplete ? '#4CAF50' : isLocked ? 'rgba(255, 255, 255, 0.3)' : '#fff'}
          />

          {/* Icon in center */}
          <View style={styles.iconContainer}>
            {isLocked ? (
              <Text style={styles.lockedIcon}>🔒</Text>
            ) : (
              <Text style={[styles.questIcon, isComplete && styles.iconComplete]}>
                {quest.icon}
              </Text>
            )}
          </View>

          {/* Progress badge inside circle at bottom */}
          {!isLocked && (
            <View style={styles.progressBadge}>
              <Text style={[styles.progressText, isComplete && styles.progressTextComplete]}>
                {quest.completedSegments}/{quest.maxSegments}
              </Text>
            </View>
          )}
        </View>

        {/* Quest Name */}
        <View style={styles.questInfo}>
          <Text
            style={[
              styles.questName,
              isComplete && styles.questNameComplete,
              isLocked && styles.lockedQuestName,
            ]}
            numberOfLines={2}
          >
            {quest.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Act indicator - shows stamp when completed
const ActIndicator = ({
  chapter,
  chapterIndex,
  isCurrentAct,
  isCompleted,
  isLocked,
  stamp,
  onPress,
  onStampPress,
}) => {
  const handlePress = () => {
    if (isLocked) return;
    if (isCompleted && stamp && onStampPress) {
      onStampPress();
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.actDot,
        isCurrentAct && styles.actDotActive,
        isCompleted && styles.actDotCompleted,
        isLocked && styles.actDotLocked,
      ]}
      onPress={handlePress}
      disabled={isLocked}
      activeOpacity={0.7}
    >
      {isCompleted && stamp ? (
        <Text style={styles.actStampIcon}>{stamp.actIcon}</Text>
      ) : isCompleted ? (
        <Text style={styles.actDotText}>✓</Text>
      ) : isLocked ? (
        <Text style={styles.actDotTextLocked}>?</Text>
      ) : (
        <Text style={styles.actDotText}>{chapterIndex + 1}</Text>
      )}
    </TouchableOpacity>
  );
};

const CampaignHomeScreen = ({ onViewAct, onBack, selectedChapter, onClearSelectedChapter }) => {
  const {
    campaign,
    incrementQuest,
    checkChapterLocked,
    isChapterComplete,
    isQuestComplete,
    getCampaignProgress,
    getChapterProgress,
    justCompletedChapter,
    clearChapterCelebration,
    needsQuestInfo,
    markQuestInfoSeen,
    actOnboardingState,
  } = useCampaign();

  const [celebrationAnim] = useState(new Animated.Value(0));
  const [showCelebration, setShowCelebration] = useState(false);
  const [showQuestInfo, setShowQuestInfo] = useState(false);
  const [questInfoFirstTime, setQuestInfoFirstTime] = useState(false);
  const [viewingChapter, setViewingChapter] = useState(null);
  const [showQuestAction, setShowQuestAction] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [selectedStamp, setSelectedStamp] = useState(null);

  // Find current (first incomplete) chapter
  const currentChapterIndex = campaign?.chapters.findIndex(
    (ch) => !isChapterComplete(ch)
  ) ?? 0;
  const currentChapter = campaign?.chapters[currentChapterIndex];

  // Determine which chapter to display (current or selected)
  const displayedChapterIndex = selectedChapter
    ? campaign?.chapters.findIndex((ch) => ch.id === selectedChapter.id) ?? currentChapterIndex
    : currentChapterIndex;
  const displayedChapter = selectedChapter || currentChapter;
  const isViewingLockedChapter = selectedChapter && checkChapterLocked(displayedChapterIndex);

  // Check if we need to show quest info on first visit (after onboarding completes)
  useEffect(() => {
    if (displayedChapter && needsQuestInfo(displayedChapter.id)) {
      setQuestInfoFirstTime(true);
      setViewingChapter(displayedChapter);
      setShowQuestInfo(true);
    }
  }, [displayedChapter?.id, actOnboardingState]);

  // Handle chapter completion celebration
  useEffect(() => {
    if (justCompletedChapter) {
      setShowCelebration(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.sequence([
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(celebrationAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowCelebration(false);
        clearChapterCelebration();

        // Find the next chapter and trigger onboarding if needed
        const completedIndex = campaign?.chapters.findIndex(ch => ch.id === justCompletedChapter);
        if (completedIndex !== -1 && completedIndex < campaign.chapters.length - 1) {
          const nextChapter = campaign.chapters[completedIndex + 1];
          // Trigger onViewAct to check for onboarding
          setTimeout(() => {
            onViewAct(nextChapter);
          }, 300);
        }
      });
    }
  }, [justCompletedChapter]);

  const handleQuestPress = (quest) => {
    if (displayedChapter && !isViewingLockedChapter) {
      setSelectedQuest(quest);
      setShowQuestAction(true);
    }
  };

  const handleQuestActionSubmit = (answer) => {
    if (selectedQuest && displayedChapter) {
      // Increment the quest progress after submitting
      incrementQuest(displayedChapter.id, selectedQuest.id);
    }
    setShowQuestAction(false);
    setSelectedQuest(null);
  };

  const handleQuestActionClose = () => {
    setShowQuestAction(false);
    setSelectedQuest(null);
  };

  const handleHelpPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuestInfoFirstTime(false);
    setViewingChapter(displayedChapter);
    setShowQuestInfo(true);
  };

  const handleQuestInfoDismiss = () => {
    setShowQuestInfo(false);
    if (questInfoFirstTime && viewingChapter) {
      markQuestInfoSeen(viewingChapter.id);
    }
    setViewingChapter(null);
    setQuestInfoFirstTime(false);
  };

  const handleBackToCurrentAct = () => {
    if (onClearSelectedChapter) {
      onClearSelectedChapter();
    }
  };

  if (!campaign) return null;

  const overallProgress = getCampaignProgress();

  // Get quests from displayed chapter
  const displayedQuests = displayedChapter?.quests || [];

  return (
    <LinearGradient
      colors={['#5B9FED', '#8B7FD6', '#C96FB9', '#E85DA0']}
      style={styles.container}
      locations={[0, 0.35, 0.7, 1]}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.campaignName}>{campaign.name}</Text>
              <Text style={styles.campaignProgress}>
                {Math.round(overallProgress)}% Complete
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.helpButton} onPress={handleHelpPress}>
                <Text style={styles.helpIcon}>?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={onBack}>
                <Text style={styles.menuIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Current Act Info with Stamp Row */}
          {displayedChapter && (
            <View style={styles.currentActBanner}>
              <TouchableOpacity
                style={[isViewingLockedChapter && styles.lockedActBanner]}
                onPress={() => onViewAct(displayedChapter)}
                activeOpacity={0.8}
              >
                <View style={styles.actBannerContent}>
                  <View style={styles.actInfo}>
                    <View style={styles.actSubtitleRow}>
                      <Text style={styles.actSubtitle}>{displayedChapter.subtitle}</Text>
                      {isViewingLockedChapter && (
                        <View style={styles.lockedBadge}>
                          <Text style={styles.lockedBadgeText}>LOCKED</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.actTitle}>{displayedChapter.title}</Text>
                  </View>
                  <Text style={styles.actChevron}>›</Text>
                </View>
              </TouchableOpacity>

              {/* Stamp Row - only show if at least one stamp earned */}
              {campaign.chapters.some(ch =>
                isChapterComplete(ch) && actOnboardingState[ch.id]?.answers
              ) && (
                <View style={styles.stampRow}>
                  {campaign.chapters.map((chapter, index) => {
                    const isComplete = isChapterComplete(chapter);
                    const isLocked = checkChapterLocked(index);
                    const isCurrent = index === displayedChapterIndex;
                    const answers = actOnboardingState[chapter.id]?.answers;
                    const stamp = answers ? generateStamp(chapter.id, answers) : null;
                    const isEarned = isComplete && stamp;
                    const isJustEarned = justCompletedChapter === chapter.id;

                    const handleStampPress = () => {
                      if (isEarned) {
                        const insights = getStampInsights(chapter.id, answers);
                        setSelectedStamp({
                          ...stamp,
                          insights,
                          chapterNumber: index + 1,
                        });
                      } else if (!isLocked) {
                        onViewAct(chapter);
                      }
                    };

                    return (
                      <Animated.View
                        key={chapter.id}
                        style={[
                          isJustEarned && {
                            transform: [{
                              scale: celebrationAnim.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [1, 1.3, 1],
                              })
                            }],
                          },
                        ]}
                      >
                        <TouchableOpacity
                          style={[
                            styles.stampDot,
                            isCurrent && !isEarned && styles.stampDotCurrent,
                            isEarned && styles.stampDotComplete,
                            isLocked && styles.stampDotLocked,
                          ]}
                          onPress={handleStampPress}
                          disabled={isLocked}
                          activeOpacity={0.7}
                        >
                          {isEarned ? (
                            <Text style={styles.stampIcon}>{stamp.actIcon}</Text>
                          ) : isLocked ? (
                            <Text style={styles.stampLockIcon}>🔒</Text>
                          ) : (
                            <Text style={styles.stampNumber}>{index + 1}</Text>
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Back to current act button when viewing other chapter */}
          {selectedChapter && displayedChapterIndex !== currentChapterIndex && (
            <TouchableOpacity
              style={styles.backToCurrentButton}
              onPress={handleBackToCurrentAct}
              activeOpacity={0.8}
            >
              <Text style={styles.backToCurrentText}>← Back to Current Act</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quest Circles Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questGrid}>
            {displayedQuests.map((quest) => (
              <QuestCircle
                key={quest.id}
                quest={quest}
                onPress={() => handleQuestPress(quest)}
                isLocked={isViewingLockedChapter}
              />
            ))}
          </View>
        </ScrollView>

        {/* Bottom hint */}
        <View style={styles.bottomNav}>
          <Text style={styles.actHint}>
            {displayedChapter ? `${displayedChapter.subtitle}` : 'Journey Complete'}
          </Text>
        </View>

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
              <Text style={styles.celebrationTitle}>Act Complete!</Text>
              <Text style={styles.celebrationSubtitle}>
                New chapter unlocked
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Quest Info Modal */}
        {showQuestInfo && viewingChapter && (
          <QuestInfoModal
            chapter={viewingChapter}
            onDismiss={handleQuestInfoDismiss}
            isFirstTime={questInfoFirstTime}
          />
        )}

        {/* Quest Action Modal */}
        {showQuestAction && selectedQuest && (
          <QuestActionModal
            quest={selectedQuest}
            onSubmit={handleQuestActionSubmit}
            onClose={handleQuestActionClose}
          />
        )}

        {/* Memory Stamp Modal */}
        <MemoryStampModal
          visible={selectedStamp !== null}
          stamp={selectedStamp}
          onClose={() => setSelectedStamp(null)}
        />
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  campaignName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  campaignProgress: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Current Act Banner
  currentActBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actInfo: {
    flex: 1,
  },
  actSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  actTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actChevron: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 24,
    fontWeight: '300',
  },
  // Stamp Row in Act Banner
  stampRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  stampDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stampDotCurrent: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#fff',
  },
  stampDotComplete: {
    backgroundColor: '#fff',
  },
  stampDotLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  stampIcon: {
    fontSize: 20,
  },
  stampLockIcon: {
    fontSize: 14,
    opacity: 0.4,
  },
  stampNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  actProgressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  actProgressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  actProgressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  actProgressText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'right',
  },
  actSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockedActBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  lockedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  lockedBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backToCurrentButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  backToCurrentText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  // Quest Grid - matches StreakCard layout
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  questGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  questCard: {
    width: CARD_SIZE,
    marginBottom: 24,
    alignItems: 'center',
  },
  questCardInner: {
    alignItems: 'center',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeBackground: {
    position: 'absolute',
    width: CIRCLE_SIZE - 20,
    height: CIRCLE_SIZE - 20,
    borderRadius: (CIRCLE_SIZE - 20) / 2,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  questIcon: {
    fontSize: 56,
  },
  iconComplete: {
    opacity: 1,
  },
  progressBadge: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  progressTextComplete: {
    color: '#333',
    textShadowColor: 'transparent',
  },
  questInfo: {
    marginTop: 12,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  questName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  questNameComplete: {
    opacity: 0.6,
  },
  lockedCard: {
    opacity: 0.5,
  },
  lockedCircle: {
    opacity: 0.6,
  },
  lockedIcon: {
    fontSize: 40,
  },
  lockedQuestName: {
    opacity: 0.5,
  },
  // Bottom Nav
  bottomNav: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 8,
  },
  actIndicators: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  actDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actDotActive: {
    backgroundColor: '#fff',
  },
  actDotCompleted: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  actDotLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actDotText: {
    color: '#C96FB9',
    fontSize: 14,
    fontWeight: '700',
  },
  actDotTextLocked: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 14,
    fontWeight: '700',
  },
  actStampIcon: {
    fontSize: 20,
  },
  actHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
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

export default CampaignHomeScreen;
