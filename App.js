import React, { useReducer, useEffect, useState } from 'react';
import { CampaignProvider, useCampaign } from './src/campaign';
import { PurchasesProvider } from './src/purchases';
import CampaignSelectScreen from './src/screens/CampaignSelectScreen';
import CampaignIntroScreen from './src/screens/CampaignIntroScreen';
import CampaignHomeScreen from './src/screens/CampaignHomeScreen';
import ChapterDetailScreen from './src/screens/ChapterDetailScreen';
import CampaignBriefingModal from './src/screens/CampaignBriefingModal';
import PaywallScreen from './src/screens/PaywallScreen';
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

  const [showPaywall, setShowPaywall] = useState(false);

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

  // Briefing - now used for all acts
  const handleBriefingComplete = (briefingData) => {
    const chapterId = briefingData.chapterId || 'chapter-1';

    // For Act 1, use completeBriefing which also initializes quests
    if (chapterId === 'chapter-1') {
      completeBriefing(briefingData);
    }

    // Mark the act as onboarded
    completeActOnboarding(chapterId, []);
    dispatch(actions.completeBriefing());
  };

  const handleBriefingClose = () => {
    // If we're onboarding a specific chapter, go back to home
    if (navState.context.onboardingChapter) {
      dispatch(actions.closeOnboarding());
    } else {
      dispatch(actions.backToIntro());
    }
  };

  const handleBriefingSkip = () => {
    const chapterId = navState.context.onboardingChapter?.id || 'chapter-1';

    if (chapterId === 'chapter-1') {
      startCampaign();
    }
    completeActOnboarding(chapterId, [0, 2, 2, 0, 1]);

    if (navState.context.onboardingChapter) {
      dispatch(actions.completeOnboarding());
    } else {
      dispatch(actions.skipBriefing());
    }
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

  if (showPaywall) {
    return <PaywallScreen onClose={() => setShowPaywall(false)} />;
  }

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
          chapterId="chapter-1"
          onComplete={handleBriefingComplete}
          onClose={handleBriefingClose}
          onSkip={handleBriefingSkip}
        />
      );

    case SCREENS.ONBOARDING:
      // Use the same briefing modal for all acts
      return (
        <CampaignBriefingModal
          chapterId={navState.context.onboardingChapter?.id || 'chapter-1'}
          onComplete={handleBriefingComplete}
          onClose={handleBriefingClose}
          onSkip={handleBriefingSkip}
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
          onShowPaywall={() => setShowPaywall(true)}
        />
      );
  }
};

export default function App() {
  return (
    <PurchasesProvider>
      <CampaignProvider>
        <AppContent />
      </CampaignProvider>
    </PurchasesProvider>
  );
}
