import React, { useState } from 'react';
import { CampaignProvider, useCampaign, SOLO_TRIP_CAMPAIGN } from './src/campaign';
import CampaignSelectScreen from './src/screens/CampaignSelectScreen';
import CampaignIntroScreen from './src/screens/CampaignIntroScreen';
import CampaignHomeScreen from './src/screens/CampaignHomeScreen';
import ChapterDetailScreen from './src/screens/ChapterDetailScreen';
import ActOnboardingModal from './src/screens/ActOnboardingModal';

// Navigation screens
const SCREENS = {
  SELECT: 'select',
  INTRO: 'intro',
  ONBOARDING: 'onboarding',
  HOME: 'home',
  CHAPTER: 'chapter',
};

// Main app content with navigation
const AppContent = () => {
  const { campaign, startCampaign, completeActOnboarding, needsOnboarding, isChapterComplete } = useCampaign();
  const [currentScreen, setCurrentScreen] = useState(
    campaign ? SCREENS.HOME : SCREENS.SELECT
  );
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [onboardingChapter, setOnboardingChapter] = useState(null);

  // Update screen when campaign loads
  React.useEffect(() => {
    if (campaign && currentScreen === SCREENS.SELECT) {
      setCurrentScreen(SCREENS.HOME);
    }
  }, [campaign]);

  // Navigation handlers
  const handleSelectCampaign = (campaignData) => {
    setSelectedCampaign(campaignData);
    setCurrentScreen(SCREENS.INTRO);
  };

  const handleBeginJourney = () => {
    startCampaign();
    // Get the first chapter for onboarding
    const firstChapter = SOLO_TRIP_CAMPAIGN.chapters[0];
    // Create a chapter object with id for onboarding
    const chapterWithId = {
      ...firstChapter,
      id: `chapter-${firstChapter.order}`,
    };
    setOnboardingChapter(chapterWithId);
    setCurrentScreen(SCREENS.ONBOARDING);
  };

  const handleBackToSelect = () => {
    setSelectedCampaign(null);
    setCurrentScreen(SCREENS.SELECT);
  };

  const handleBackFromChapter = () => {
    setSelectedChapter(null);
    setCurrentScreen(SCREENS.HOME);
  };

  const handleOnboardingComplete = (answers) => {
    if (onboardingChapter) {
      completeActOnboarding(onboardingChapter.id, answers);
    }
    setOnboardingChapter(null);
    setCurrentScreen(SCREENS.HOME);
  };

  const handleOnboardingClose = () => {
    // If closing onboarding without completing:
    // - For first chapter (no campaign yet started), go back to intro
    // - For subsequent chapters, go back to home
    const isFirstChapter = onboardingChapter?.id === 'chapter-1';
    setOnboardingChapter(null);
    setCurrentScreen(campaign && !isFirstChapter ? SCREENS.HOME : SCREENS.INTRO);
  };

  const handleViewChapter = (chapter) => {
    // Check if this chapter needs onboarding (when switching to a new unlocked chapter)
    const chapterIndex = campaign?.chapters.findIndex(c => c.id === chapter.id) ?? 0;
    const isLocked = chapterIndex > 0 && campaign?.chapters.slice(0, chapterIndex).some(c => !isChapterComplete(c));

    if (!isLocked && needsOnboarding(chapter.id)) {
      setOnboardingChapter(chapter);
      setCurrentScreen(SCREENS.ONBOARDING);
    } else {
      setSelectedChapter(chapter);
      setCurrentScreen(SCREENS.HOME);
    }
  };

  const handleClearSelectedChapter = () => {
    setSelectedChapter(null);
  };

  const handleExitCampaign = () => {
    setCurrentScreen(SCREENS.SELECT);
  };

  // Render current screen
  switch (currentScreen) {
    case SCREENS.SELECT:
      return (
        <CampaignSelectScreen
          onSelectCampaign={handleSelectCampaign}
        />
      );

    case SCREENS.INTRO:
      return (
        <CampaignIntroScreen
          campaign={selectedCampaign}
          onBegin={handleBeginJourney}
          onBack={handleBackToSelect}
        />
      );

    case SCREENS.ONBOARDING:
      return (
        <ActOnboardingModal
          chapter={onboardingChapter}
          onComplete={handleOnboardingComplete}
          onClose={handleOnboardingClose}
        />
      );

    case SCREENS.CHAPTER:
      return (
        <ChapterDetailScreen
          chapter={selectedChapter}
          onBack={handleBackFromChapter}
        />
      );

    case SCREENS.HOME:
    default:
      return (
        <CampaignHomeScreen
          onViewAct={handleViewChapter}
          onBack={handleExitCampaign}
          selectedChapter={selectedChapter}
          onClearSelectedChapter={handleClearSelectedChapter}
        />
      );
  }
};

export default function App() {
  return (
    <CampaignProvider>
      <AppContent />
    </CampaignProvider>
  );
}
