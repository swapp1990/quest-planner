import React, { useEffect, useRef, useState } from 'react';
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
import { HOME_STATES, actions } from '../navigation';
import CircularProgress from '../components/CircularProgress';
import {
  StampCollection,
  ActIndicator,
  CollectionAddAnimation,
} from '../components';
import * as Haptics from 'expo-haptics';
import QuestInfoModal from './QuestInfoModal';
import QuestActionModal from './QuestActionModal';
import { MemoryStampModal, StampRevealModal, generateStamp, getStampInsights } from '../memories';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;
const CIRCLE_SIZE = CARD_SIZE - 16;

// ============================================================
// Quest Circle Component
// ============================================================

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
        <View style={[styles.circleContainer, isLocked && styles.lockedCircle]}>
          {isComplete && !isLocked && <View style={styles.completeBackground} />}
          <CircularProgress
            size={CIRCLE_SIZE}
            strokeWidth={10}
            progress={isLocked ? 0 : progress}
            maxSegments={quest.maxSegments}
            completedSegments={isLocked ? 0 : quest.completedSegments}
            color={isComplete ? '#4CAF50' : isLocked ? 'rgba(255, 255, 255, 0.3)' : '#fff'}
          />
          <View style={styles.iconContainer}>
            {isLocked ? (
              <Text style={styles.lockedIcon}>🔒</Text>
            ) : (
              <Text style={[styles.questIcon, isComplete && styles.iconComplete]}>
                {quest.icon}
              </Text>
            )}
          </View>
          {!isLocked && (
            <View style={styles.progressBadge}>
              <Text style={[styles.progressText, isComplete && styles.progressTextComplete]}>
                {quest.completedSegments}/{quest.maxSegments}
              </Text>
            </View>
          )}
        </View>
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

// ============================================================
// Main Component
// ============================================================

const CampaignHomeScreen = ({ navState, dispatch, onViewAct, onBack }) => {
  const {
    campaign,
    incrementQuest,
    checkChapterLocked,
    isChapterComplete,
    getCampaignProgress,
    needsQuestInfo,
    needsOnboarding,
    markQuestInfoSeen,
    actOnboardingState,
    justCompletedChapter,
    clearChapterCelebration,
    devCompleteChapter,
  } = useCampaign();

  // Track stamp animation data
  const [animatingStamp, setAnimatingStamp] = useState(null);

  // Get state from navState
  const { homeState, context } = navState;
  const { selectedChapter, selectedQuest, selectedStamp, questInfoFirstTime } = context;

  // Find current chapter (first incomplete one)
  const currentChapterIndex = campaign?.chapters.findIndex(
    (ch) => !isChapterComplete(ch)
  ) ?? 0;
  const currentChapter = campaign?.chapters[currentChapterIndex];

  // Determine displayed chapter
  const displayedChapterIndex = selectedChapter
    ? campaign?.chapters.findIndex((ch) => ch.id === selectedChapter.id) ?? currentChapterIndex
    : currentChapterIndex;
  const displayedChapter = selectedChapter || currentChapter;

  // Check if chapter is locked (previous chapters not complete)
  const isChapterLocked = (index) => checkChapterLocked(index);

  // Check if chapter needs onboarding (unlocked but not onboarded yet)
  const chapterNeedsOnboarding = displayedChapter && needsOnboarding(displayedChapter.id);

  // Quests should be hidden if: locked OR needs onboarding
  const shouldHideQuests = isChapterLocked(displayedChapterIndex) || chapterNeedsOnboarding;

  // Build earned stamps array for StampCollection
  const earnedStamps = campaign?.chapters
    .map((chapter, index) => {
      const isComplete = isChapterComplete(chapter);
      const answers = actOnboardingState[chapter.id]?.answers;
      if (isComplete && answers) {
        const stamp = generateStamp(chapter.id, answers);
        return {
          ...stamp,
          chapterIndex: index,
          insights: getStampInsights(chapter.id, answers),
        };
      }
      return null;
    })
    .filter(Boolean) || [];

  // ============================================================
  // EFFECTS
  // ============================================================

  // Show quest info on first visit after onboarding
  useEffect(() => {
    if (
      homeState === HOME_STATES.QUESTS &&
      displayedChapter &&
      !shouldHideQuests &&
      needsQuestInfo(displayedChapter.id)
    ) {
      dispatch(actions.openQuestInfo(true));
    }
  }, [displayedChapter?.id, actOnboardingState, homeState, shouldHideQuests]);

  // Handle chapter completion - trigger stamp reveal
  useEffect(() => {
    if (justCompletedChapter && homeState === HOME_STATES.QUESTS) {
      dispatch(actions.actCompleted(justCompletedChapter));
    }
  }, [justCompletedChapter]);

  // Handle stamp collecting animation state
  useEffect(() => {
    if (homeState === HOME_STATES.STAMP_COLLECTING && context.completedChapterId) {
      const answers = actOnboardingState[context.completedChapterId]?.answers;
      if (answers) {
        const stamp = generateStamp(context.completedChapterId, answers);
        setAnimatingStamp(stamp);
      }
    } else {
      setAnimatingStamp(null);
    }
  }, [homeState, context.completedChapterId]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleStampRevealContinue = () => {
    dispatch(actions.continueFromStamp());
  };

  const handleCollectionAnimationComplete = () => {
    // Find next chapter
    const completedIndex = campaign?.chapters.findIndex(
      ch => ch.id === context.completedChapterId
    );

    if (completedIndex !== -1 && completedIndex < campaign.chapters.length - 1) {
      const nextChapter = campaign.chapters[completedIndex + 1];
      dispatch(actions.stampAnimationDone(nextChapter));
    } else {
      // Last act - just go back to quests
      clearChapterCelebration();
      dispatch(actions.closeQuestInfo());
    }
  };

  const handleUnlockAct = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    clearChapterCelebration();
    dispatch(actions.unlockAct());
  };

  const handleActPress = (actIndex) => {
    const chapter = campaign?.chapters[actIndex];
    if (chapter) {
      onViewAct(chapter);
    }
  };

  const handleQuestPress = (quest) => {
    if (displayedChapter && !shouldHideQuests) {
      dispatch(actions.openQuestAction(quest));
    }
  };

  const handleQuestActionSubmit = (answer) => {
    if (selectedQuest && displayedChapter) {
      incrementQuest(displayedChapter.id, selectedQuest.id);
    }
    dispatch(actions.closeQuestAction());
  };

  const handleQuestActionClose = () => {
    dispatch(actions.closeQuestAction());
  };

  const handleHelpPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(actions.openQuestInfo(false));
  };

  const handleQuestInfoDismiss = () => {
    if (questInfoFirstTime && displayedChapter) {
      markQuestInfoSeen(displayedChapter.id);
    }
    dispatch(actions.closeQuestInfo());
  };

  const handleBackToCurrentAct = () => {
    dispatch(actions.clearSelectedChapter());
  };

  const handleStampPress = (stamp) => {
    dispatch(actions.viewStamp(stamp));
  };

  const handleStampClose = () => {
    dispatch(actions.closeStamp());
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (!campaign) return null;

  const overallProgress = getCampaignProgress();
  const displayedQuests = displayedChapter?.quests || [];

  // Get completed chapter info for stamp reveal
  const completedChapterIndex = context.completedChapterId
    ? campaign?.chapters.findIndex(ch => ch.id === context.completedChapterId)
    : -1;

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

          {/* Stamp Collection - only shows when stamps earned */}
          <StampCollection
            stamps={earnedStamps}
            onStampPress={(stamp) => handleStampPress({
              ...stamp,
              chapterNumber: stamp.chapterIndex + 1,
            })}
          />

          {/* Current Act Banner */}
          {displayedChapter && (
            <View style={styles.currentActBanner}>
              <View style={styles.actBannerContent}>
                <View style={styles.actInfo}>
                  <View style={styles.actSubtitleRow}>
                    <Text style={styles.actSubtitle}>{displayedChapter.subtitle}</Text>
                    {shouldHideQuests && (
                      <View style={styles.lockedBadge}>
                        <Text style={styles.lockedBadgeText}>
                          {chapterNeedsOnboarding ? 'NEW' : 'LOCKED'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.actTitle}>{displayedChapter.title}</Text>
                </View>
              </View>

              {/* Act Indicator - numbered buttons */}
              <View style={styles.actIndicatorContainer}>
                <ActIndicator
                  totalActs={campaign.chapters.length}
                  currentActIndex={displayedChapterIndex}
                  isActUnlocked={(index) => !checkChapterLocked(index)}
                  onActPress={handleActPress}
                />
              </View>
            </View>
          )}

          {/* Back to current act button */}
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

        {/* Quest Circles Grid - hidden if quests not unlocked */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {shouldHideQuests ? (
            <View style={styles.lockedContent}>
              <Text style={styles.lockedEmoji}>🔒</Text>
              <Text style={styles.lockedTitle}>
                {chapterNeedsOnboarding ? 'Complete Onboarding' : 'Complete Previous Acts'}
              </Text>
              <Text style={styles.lockedSubtitle}>
                {chapterNeedsOnboarding
                  ? 'Answer a few questions to unlock this act'
                  : 'Finish the current act to unlock this one'}
              </Text>
            </View>
          ) : (
            <View style={styles.questGrid}>
              {displayedQuests.map((quest) => (
                <QuestCircle
                  key={quest.id}
                  quest={quest}
                  onPress={() => handleQuestPress(quest)}
                  isLocked={false}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom hint */}
        <View style={styles.bottomNav}>
          <Text style={styles.actHint}>
            {displayedChapter ? `${displayedChapter.subtitle}` : 'Journey Complete'}
          </Text>
          {/* DEV: Complete chapter button */}
          {displayedChapter && !isChapterComplete(displayedChapter) && !shouldHideQuests && (
            <TouchableOpacity
              style={styles.devCompleteButton}
              onPress={() => devCompleteChapter(displayedChapter.id)}
            >
              <Text style={styles.devCompleteText}>DEV: Complete Act</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ============================================================ */}
        {/* MODALS & OVERLAYS - Controlled by homeState */}
        {/* ============================================================ */}

        {/* Stamp Reveal Modal */}
        <StampRevealModal
          visible={homeState === HOME_STATES.STAMP_REVEAL}
          chapterId={context.completedChapterId}
          chapterNumber={completedChapterIndex + 1}
          answers={context.completedChapterId ? actOnboardingState[context.completedChapterId]?.answers : null}
          onContinue={handleStampRevealContinue}
        />

        {/* Collection Add Animation - stamp flying to collection */}
        <CollectionAddAnimation
          visible={homeState === HOME_STATES.STAMP_COLLECTING}
          icon={animatingStamp?.actIcon || '🏆'}
          label={animatingStamp?.label}
          onComplete={handleCollectionAnimationComplete}
        />

        {/* Act Unlock Overlay */}
        {homeState === HOME_STATES.ACT_UNLOCK && context.pendingUnlockChapter && (
          <View style={styles.unlockOverlay}>
            <View style={styles.unlockContent}>
              <View style={styles.unlockIconContainer}>
                <Text style={styles.unlockLockIcon}>🔓</Text>
              </View>
              <Text style={styles.unlockReadyText}>Ready for</Text>
              <Text style={styles.unlockActNumber}>
                Act {campaign.chapters.findIndex(c => c.id === context.pendingUnlockChapter.id) + 1}
              </Text>
              <Text style={styles.unlockActTitle}>{context.pendingUnlockChapter.title}</Text>
              <TouchableOpacity
                style={styles.unlockButton}
                onPress={handleUnlockAct}
                activeOpacity={0.8}
              >
                <Text style={styles.unlockButtonText}>Let's Go!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quest Info Modal */}
        {homeState === HOME_STATES.QUEST_INFO && displayedChapter && (
          <QuestInfoModal
            chapter={displayedChapter}
            onDismiss={handleQuestInfoDismiss}
            isFirstTime={questInfoFirstTime}
          />
        )}

        {/* Quest Action Modal */}
        {homeState === HOME_STATES.QUEST_ACTION && selectedQuest && (
          <QuestActionModal
            quest={selectedQuest}
            onSubmit={handleQuestActionSubmit}
            onClose={handleQuestActionClose}
          />
        )}

        {/* Memory Stamp Modal */}
        <MemoryStampModal
          visible={homeState === HOME_STATES.STAMP_DETAIL}
          stamp={selectedStamp}
          onClose={handleStampClose}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
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
  // Act Banner
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
  actSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  actIndicatorContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
  // Quest Grid
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
    flexGrow: 1,
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
  // Locked Content (when quests hidden)
  lockedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  lockedEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  lockedTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  lockedSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Bottom Nav
  bottomNav: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 8,
  },
  actHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  devCompleteButton: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 100, 100, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  devCompleteText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  // Unlock Overlay
  unlockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  unlockContent: {
    alignItems: 'center',
  },
  unlockIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  unlockLockIcon: {
    fontSize: 48,
  },
  unlockReadyText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  unlockActNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  unlockActTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
  },
  unlockButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CampaignHomeScreen;
