import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import {
  initializeCampaign,
  isQuestComplete,
  isChapterComplete,
  isCampaignComplete,
  getChapterProgress,
  getCampaignProgress,
  getCompletedQuestCount,
  isChapterLocked,
} from './campaignUtils';
import { SOLO_TRIP_CAMPAIGN } from './soloTripData';

const STORAGE_KEY = '@campaign_data';
const ONBOARDING_STORAGE_KEY = '@campaign_onboarding';
const BRIEFING_STORAGE_KEY = '@campaign_briefing';

// Set to true to clear cache on app reload (for development)
const DEV_CLEAR_CACHE = false;

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [justCompletedChapter, setJustCompletedChapter] = useState(null);

  // Act onboarding state
  // Structure: { 'chapter-1': { onboarded: true, questInfoSeen: true, answers: [0, 2, 1, 3, 0] }, ... }
  const [actOnboardingState, setActOnboardingState] = useState({});

  // User profile from campaign briefing
  // Structure: { chatResponses: {...}, constraints: {...}, selectedPlan: 'comfort', briefingCompletedAt: timestamp }
  const [userProfile, setUserProfile] = useState(null);

  // Load campaign on mount
  useEffect(() => {
    loadCampaign();
  }, []);

  // Save campaign when it changes
  useEffect(() => {
    if (!isLoading && campaign) {
      saveCampaign();
    }
  }, [campaign]);

  const loadCampaign = async () => {
    try {
      // Clear cache for development testing
      if (DEV_CLEAR_CACHE) {
        await AsyncStorage.removeItem(STORAGE_KEY);
        await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
        await AsyncStorage.removeItem(BRIEFING_STORAGE_KEY);
        console.log('Campaign cache cleared');
      }

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCampaign(JSON.parse(stored));
      }

      // Load onboarding state
      const onboardingStored = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (onboardingStored) {
        setActOnboardingState(JSON.parse(onboardingStored));
      }

      // Load briefing/user profile
      const briefingStored = await AsyncStorage.getItem(BRIEFING_STORAGE_KEY);
      if (briefingStored) {
        setUserProfile(JSON.parse(briefingStored));
      }
    } catch (error) {
      console.error('Error loading campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCampaign = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const saveOnboardingState = async (newState) => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  };

  /**
   * Start a new campaign
   */
  const startCampaign = (campaignTemplate = SOLO_TRIP_CAMPAIGN) => {
    const newCampaign = initializeCampaign(campaignTemplate);
    setCampaign(newCampaign);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /**
   * Increment quest progress
   */
  const incrementQuest = (chapterId, questId) => {
    if (!campaign) return;

    setCampaign(prev => {
      const newCampaign = { ...prev };
      const chapterIndex = newCampaign.chapters.findIndex(c => c.id === chapterId);

      if (chapterIndex === -1) return prev;

      const chapter = { ...newCampaign.chapters[chapterIndex] };
      const questIndex = chapter.quests.findIndex(q => q.id === questId);

      if (questIndex === -1) return prev;

      const quest = { ...chapter.quests[questIndex] };

      // Already complete
      if (isQuestComplete(quest)) return prev;

      // Increment
      quest.completedSegments += 1;
      chapter.quests = [...chapter.quests];
      chapter.quests[questIndex] = quest;
      newCampaign.chapters = [...newCampaign.chapters];
      newCampaign.chapters[chapterIndex] = chapter;

      // Haptic feedback
      if (isQuestComplete(quest)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Check if chapter just completed
        if (isChapterComplete(chapter)) {
          setJustCompletedChapter(chapter.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          // Check if campaign completed
          if (isCampaignComplete(newCampaign)) {
            newCampaign.completedAt = new Date().toISOString();
          }
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      return newCampaign;
    });
  };

  /**
   * Clear chapter completion celebration state
   */
  const clearChapterCelebration = () => {
    setJustCompletedChapter(null);
  };

  /**
   * Reset campaign
   */
  const resetCampaign = async () => {
    setCampaign(null);
    setActOnboardingState({});
    setUserProfile(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
    await AsyncStorage.removeItem(BRIEFING_STORAGE_KEY);
  };

  /**
   * Complete act onboarding for a chapter
   */
  const completeActOnboarding = (chapterId, answers) => {
    const newState = {
      ...actOnboardingState,
      [chapterId]: {
        ...actOnboardingState[chapterId],
        onboarded: true,
        answers,
      },
    };
    setActOnboardingState(newState);
    saveOnboardingState(newState);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /**
   * Mark quest info as seen for a chapter
   */
  const markQuestInfoSeen = (chapterId) => {
    const newState = {
      ...actOnboardingState,
      [chapterId]: {
        ...actOnboardingState[chapterId],
        questInfoSeen: true,
      },
    };
    setActOnboardingState(newState);
    saveOnboardingState(newState);
  };

  /**
   * Check if chapter needs onboarding
   */
  const needsOnboarding = (chapterId) => {
    return !actOnboardingState[chapterId]?.onboarded;
  };

  /**
   * Check if chapter needs quest info modal shown
   */
  const needsQuestInfo = (chapterId) => {
    const chapterState = actOnboardingState[chapterId];
    // Only show quest info if onboarded but hasn't seen quest info yet
    return chapterState?.onboarded && !chapterState?.questInfoSeen;
  };

  /**
   * Get onboarding answers for a chapter
   */
  const getOnboardingAnswers = (chapterId) => {
    return actOnboardingState[chapterId]?.answers || null;
  };

  // ============================================================
  // Campaign Briefing Methods
  // ============================================================

  /**
   * Save briefing/user profile to storage
   */
  const saveBriefing = async (profile) => {
    try {
      await AsyncStorage.setItem(BRIEFING_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving briefing:', error);
    }
  };

  /**
   * Complete campaign briefing and store user profile
   * @param {Object} briefingData - { chatResponses, constraints, selectedPlan, quests, briefingCompletedAt }
   */
  const completeBriefing = (briefingData) => {
    const profile = {
      chatResponses: briefingData.chatResponses,
      constraints: briefingData.constraints,
      constraintsAdjusted: false, // Track if user adjusted constraints
      selectedPlan: briefingData.selectedPlan,
      briefingCompletedAt: briefingData.briefingCompletedAt,
    };

    setUserProfile(profile);
    saveBriefing(profile);

    // Also initialize the campaign with generated quests
    if (briefingData.quests) {
      const campaignWithQuests = initializeCampaign({
        ...SOLO_TRIP_CAMPAIGN,
        chapters: SOLO_TRIP_CAMPAIGN.chapters.map((chapter, index) => {
          // Only apply custom quests to the first chapter for now
          if (index === 0) {
            return {
              ...chapter,
              quests: briefingData.quests,
            };
          }
          return chapter;
        }),
      });
      setCampaign(campaignWithQuests);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /**
   * Check if campaign briefing is complete
   * @returns {boolean}
   */
  const isBriefingComplete = () => {
    return userProfile?.briefingCompletedAt != null;
  };

  /**
   * Get user profile
   * @returns {Object|null}
   */
  const getUserProfile = () => {
    return userProfile;
  };

  /**
   * Update constraints after briefing (if user adjusts them)
   * @param {Object} newConstraints
   */
  const updateConstraints = (newConstraints) => {
    if (!userProfile) return;

    const updatedProfile = {
      ...userProfile,
      constraints: newConstraints,
      constraintsAdjusted: true,
    };

    setUserProfile(updatedProfile);
    saveBriefing(updatedProfile);
  };

  /**
   * DEV ONLY: Complete all quests in a chapter to test stamp reveal
   */
  const devCompleteChapter = (chapterId) => {
    if (!campaign) return;

    setCampaign(prev => {
      const newCampaign = { ...prev };
      const chapterIndex = newCampaign.chapters.findIndex(c => c.id === chapterId);

      if (chapterIndex === -1) return prev;

      const chapter = { ...newCampaign.chapters[chapterIndex] };

      // Complete all quests
      chapter.quests = chapter.quests.map(quest => ({
        ...quest,
        completedSegments: quest.maxSegments,
      }));

      newCampaign.chapters = [...newCampaign.chapters];
      newCampaign.chapters[chapterIndex] = chapter;

      // Trigger chapter completion celebration
      setJustCompletedChapter(chapter.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      return newCampaign;
    });
  };

  /**
   * Get chapter by ID
   */
  const getChapter = (chapterId) => {
    if (!campaign) return null;
    return campaign.chapters.find(c => c.id === chapterId);
  };

  /**
   * Check if chapter is locked
   */
  const checkChapterLocked = (chapterIndex) => {
    if (!campaign) return true;
    return isChapterLocked(campaign.chapters, chapterIndex);
  };

  const value = {
    campaign,
    isLoading,
    justCompletedChapter,
    actOnboardingState,
    userProfile,
    startCampaign,
    incrementQuest,
    resetCampaign,
    getChapter,
    checkChapterLocked,
    clearChapterCelebration,
    // Onboarding methods
    completeActOnboarding,
    markQuestInfoSeen,
    needsOnboarding,
    needsQuestInfo,
    getOnboardingAnswers,
    // Briefing methods
    completeBriefing,
    isBriefingComplete,
    getUserProfile,
    updateConstraints,
    // Utility functions exposed
    getChapterProgress: (chapter) => getChapterProgress(chapter),
    getCampaignProgress: () => campaign ? getCampaignProgress(campaign) : 0,
    getCompletedQuestCount: (chapter) => getCompletedQuestCount(chapter),
    isChapterComplete: (chapter) => isChapterComplete(chapter),
    isQuestComplete: (quest) => isQuestComplete(quest),
    isCampaignComplete: () => campaign ? isCampaignComplete(campaign) : false,
    // DEV helpers
    devCompleteChapter,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
