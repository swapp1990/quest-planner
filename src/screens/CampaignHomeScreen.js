import React, { useEffect, useRef } from 'react';
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
    markQuestInfoSeen,
    actOnboardingState,
    justCompletedChapter,
    clearChapterCelebration,
    devCompleteChapter,
  } = useCampaign();

  // Animation refs
  const stampCollectAnim = useRef(new Animated.Value(0)).current;

  // Get state from navState
  const { homeState, context } = navState;
  const { selectedChapter, selectedQuest, selectedStamp, questInfoFirstTime } = context;

  // Find current chapter
  const currentChapterIndex = campaign?.chapters.findIndex(
    (ch) => !isChapterComplete(ch)
  ) ?? 0;
  const currentChapter = campaign?.chapters[currentChapterIndex];

  // Determine displayed chapter
  const displayedChapterIndex = selectedChapter
    ? campaign?.chapters.findIndex((ch) => ch.id === selectedChapter.id) ?? currentChapterIndex
    : currentChapterIndex;
  const displayedChapter = selectedChapter || currentChapter;
  const isViewingLockedChapter = selectedChapter && checkChapterLocked(displayedChapterIndex);

  // ============================================================
  // EFFECTS
  // ============================================================

  // Show quest info on first visit after onboarding
  useEffect(() => {
    if (
      homeState === HOME_STATES.QUESTS &&
      displayedChapter &&
      needsQuestInfo(displayedChapter.id)
    ) {
      dispatch(actions.openQuestInfo(true));
    }
  }, [displayedChapter?.id, actOnboardingState, homeState]);

  // Handle chapter completion - trigger stamp reveal
  useEffect(() => {
    if (justCompletedChapter && homeState === HOME_STATES.QUESTS) {
      dispatch(actions.actCompleted(justCompletedChapter));
    }
  }, [justCompletedChapter]);

  // Handle stamp collecting animation
  useEffect(() => {
    if (homeState === HOME_STATES.STAMP_COLLECTING) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      stampCollectAnim.setValue(0);

      Animated.timing(stampCollectAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
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
          dispatch(actions.closeQuestInfo()); // Reset to QUESTS state
        }
      });
    }
  }, [homeState]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleStampRevealContinue = () => {
    dispatch(actions.continueFromStamp());
  };

  const handleUnlockAct = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    clearChapterCelebration();
    dispatch(actions.unlockAct());
  };

  const handleQuestPress = (quest) => {
    if (displayedChapter && !isViewingLockedChapter) {
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

          {/* Current Act Banner */}
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

              {/* Stamp Row */}
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

                    const onPress = () => {
                      if (isEarned) {
                        const insights = getStampInsights(chapter.id, answers);
                        handleStampPress({
                          ...stamp,
                          insights,
                          chapterNumber: index + 1,
                        });
                      } else if (!isLocked) {
                        onViewAct(chapter);
                      }
                    };

                    return (
                      <TouchableOpacity
                        key={chapter.id}
                        style={[
                          styles.stampDot,
                          isCurrent && !isEarned && styles.stampDotCurrent,
                          isEarned && styles.stampDotComplete,
                          isLocked && styles.stampDotLocked,
                        ]}
                        onPress={onPress}
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
                    );
                  })}
                </View>
              )}
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
          {/* DEV: Complete chapter button */}
          {displayedChapter && !isChapterComplete(displayedChapter) && !isViewingLockedChapter && (
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

        {/* Stamp Collecting Animation */}
        {homeState === HOME_STATES.STAMP_COLLECTING && (
          <View style={styles.collectingOverlay}>
            <Animated.View
              style={[
                styles.collectingStamp,
                {
                  opacity: stampCollectAnim.interpolate({
                    inputRange: [0, 0.3, 0.7, 1],
                    outputRange: [1, 1, 0.5, 0],
                  }),
                  transform: [
                    {
                      scale: stampCollectAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 0.8, 0.3],
                      }),
                    },
                    {
                      translateY: stampCollectAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -200],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.collectingText}>Stamp Added!</Text>
              <Text style={styles.collectingEmoji}>✨</Text>
            </Animated.View>
          </View>
        )}

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
  // Stamp Collecting Animation
  collectingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectingStamp: {
    alignItems: 'center',
  },
  collectingText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  collectingEmoji: {
    fontSize: 48,
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
