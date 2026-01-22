import React, { useState } from 'react';
import { CampaignProvider, useCampaign, SOLO_TRIP_CAMPAIGN } from './src/campaign';
import CampaignSelectScreen from './src/screens/CampaignSelectScreen';
import CampaignIntroScreen from './src/screens/CampaignIntroScreen';
import CampaignHomeScreen from './src/screens/CampaignHomeScreen';
import ChapterDetailScreen from './src/screens/ChapterDetailScreen';
import ActOnboardingModal from './src/screens/ActOnboardingModal';
import CampaignBriefingModal from './src/screens/CampaignBriefingModal';

// Navigation screens
const SCREENS = {
  SELECT: 'select',
  INTRO: 'intro',
  BRIEFING: 'briefing',
  ONBOARDING: 'onboarding',
  HOME: 'home',
  CHAPTER: 'chapter',
};

// Main app content with navigation
const AppContent = () => {
  const {
    campaign,
    startCampaign,
    completeActOnboarding,
    needsOnboarding,
    isChapterComplete,
    completeBriefing,
    isBriefingComplete,
  } = useCampaign();
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
    // Go to briefing flow (new 3-step campaign briefing)
    setCurrentScreen(SCREENS.BRIEFING);
  };

  const handleBackToSelect = () => {
    setSelectedCampaign(null);
    setCurrentScreen(SCREENS.SELECT);
  };

  const handleBackFromChapter = () => {
    setSelectedChapter(null);
    setCurrentScreen(SCREENS.HOME);
  };

  // Briefing (new 3-step flow) handlers
  const handleBriefingComplete = (briefingData) => {
    completeBriefing(briefingData);
    // Also mark first chapter as onboarded since briefing replaces it
    completeActOnboarding('chapter-1', []);
    setCurrentScreen(SCREENS.HOME);
  };

  const handleBriefingClose = () => {
    // Go back to intro if closing briefing without completing
    setCurrentScreen(SCREENS.INTRO);
  };

  // Legacy act onboarding handlers (for subsequent chapters)
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

    case SCREENS.BRIEFING:
      return (
        <CampaignBriefingModal
          onComplete={handleBriefingComplete}
          onClose={handleBriefingClose}
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
