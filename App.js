import React, { useReducer, useEffect } from 'react';
import { CampaignProvider, useCampaign } from './src/campaign';
import CampaignSelectScreen from './src/screens/CampaignSelectScreen';
import CampaignIntroScreen from './src/screens/CampaignIntroScreen';
import CampaignHomeScreen from './src/screens/CampaignHomeScreen';
import ChapterDetailScreen from './src/screens/ChapterDetailScreen';
import ActOnboardingModal from './src/screens/ActOnboardingModal';
import CampaignBriefingModal from './src/screens/CampaignBriefingModal';
import {
  SCREENS,
  HOME_STATES,
  createInitialState,
  navigationReducer,
  actions,
} from './src/navigation';

// Main app content with navigation state machine
const AppContent = () => {
  const {
    campaign,
    startCampaign,
    completeActOnboarding,
    needsOnboarding,
    isChapterComplete,
    completeBriefing,
  } = useCampaign();

  // Initialize state machine
  const [navState, dispatch] = useReducer(
    navigationReducer,
    campaign,
    (camp) => createInitialState(!!camp)
  );

  // Update screen when campaign loads (handles app restart with existing campaign)
  useEffect(() => {
    if (campaign && navState.screen === SCREENS.SELECT) {
      dispatch({ type: 'SET_STATE', payload: { screen: SCREENS.HOME } });
    }
  }, [campaign]);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  // Campaign Selection
  const handleSelectCampaign = (campaignData) => {
    dispatch(actions.selectCampaign(campaignData));
  };

  const handleBeginJourney = () => {
    dispatch(actions.beginJourney());
  };

  const handleBackToSelect = () => {
    dispatch(actions.backToSelect());
  };

  // Briefing
  const handleBriefingComplete = (briefingData) => {
    completeBriefing(briefingData);
    completeActOnboarding('chapter-1', []);
    dispatch(actions.completeBriefing());
  };

  const handleBriefingClose = () => {
    dispatch(actions.backToIntro());
  };

  const handleBriefingSkip = () => {
    startCampaign();
    completeActOnboarding('chapter-1', [0, 2, 2, 0, 1]);
    dispatch(actions.skipBriefing());
  };

  // Onboarding
  const handleOnboardingComplete = (answers) => {
    if (navState.context.onboardingChapter) {
      completeActOnboarding(navState.context.onboardingChapter.id, answers);
    }
    dispatch(actions.completeOnboarding());
  };

  const handleOnboardingClose = () => {
    dispatch(actions.closeOnboarding());
  };

  // Chapter Navigation - now just dispatches, logic handled by CampaignHomeScreen
  const handleViewChapter = (chapter, skipOnboardingCheck = false) => {
    // Check if this chapter needs onboarding
    const chapterIndex = campaign?.chapters.findIndex(c => c.id === chapter.id) ?? 0;
    const isLocked = chapterIndex > 0 &&
      campaign?.chapters.slice(0, chapterIndex).some(c => !isChapterComplete(c));

    if (!skipOnboardingCheck && !isLocked && needsOnboarding(chapter.id)) {
      dispatch(actions.startOnboarding(chapter));
    } else {
      dispatch(actions.viewChapter(chapter));
    }
  };

  const handleExitCampaign = () => {
    dispatch(actions.exitCampaign());
  };

  // ============================================================
  // RENDER
  // ============================================================

  switch (navState.screen) {
    case SCREENS.SELECT:
      return (
        <CampaignSelectScreen
          onSelectCampaign={handleSelectCampaign}
        />
      );

    case SCREENS.INTRO:
      return (
        <CampaignIntroScreen
          campaign={navState.context.selectedCampaign}
          onBegin={handleBeginJourney}
          onBack={handleBackToSelect}
        />
      );

    case SCREENS.BRIEFING:
      return (
        <CampaignBriefingModal
          onComplete={handleBriefingComplete}
          onClose={handleBriefingClose}
          onSkip={handleBriefingSkip}
        />
      );

    case SCREENS.ONBOARDING:
      return (
        <ActOnboardingModal
          chapter={navState.context.onboardingChapter}
          onComplete={handleOnboardingComplete}
          onClose={handleOnboardingClose}
        />
      );

    case SCREENS.CHAPTER:
      return (
        <ChapterDetailScreen
          chapter={navState.context.selectedChapter}
          onBack={() => dispatch(actions.viewChapter(null))}
        />
      );

    case SCREENS.HOME:
    default:
      return (
        <CampaignHomeScreen
          navState={navState}
          dispatch={dispatch}
          onViewAct={handleViewChapter}
          onBack={handleExitCampaign}
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
