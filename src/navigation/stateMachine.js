/**
 * App Navigation State Machine
 *
 * Centralized state management for all app navigation and UI states.
 * Uses a reducer pattern for predictable state transitions.
 */

// ============================================================
// STATES
// ============================================================

export const SCREENS = {
  SELECT: 'select',
  INTRO: 'intro',
  BRIEFING: 'briefing',
  HOME: 'home',
  ONBOARDING: 'onboarding',
  CHAPTER: 'chapter',
};

// Sub-states for HOME screen
export const HOME_STATES = {
  QUESTS: 'quests',
  STAMP_REVEAL: 'stamp_reveal',
  STAMP_COLLECTING: 'stamp_collecting',
  ACT_UNLOCK: 'act_unlock',
  QUEST_INFO: 'quest_info',
  QUEST_ACTION: 'quest_action',
  STAMP_DETAIL: 'stamp_detail',
};

// ============================================================
// ACTIONS
// ============================================================

export const ACTIONS = {
  // Navigation actions
  SELECT_CAMPAIGN: 'SELECT_CAMPAIGN',
  BEGIN_JOURNEY: 'BEGIN_JOURNEY',
  COMPLETE_BRIEFING: 'COMPLETE_BRIEFING',
  SKIP_BRIEFING: 'SKIP_BRIEFING',
  BACK_TO_SELECT: 'BACK_TO_SELECT',
  BACK_TO_INTRO: 'BACK_TO_INTRO',
  EXIT_CAMPAIGN: 'EXIT_CAMPAIGN',

  // Chapter/Act navigation
  VIEW_CHAPTER: 'VIEW_CHAPTER',
  CLEAR_SELECTED_CHAPTER: 'CLEAR_SELECTED_CHAPTER',
  START_ONBOARDING: 'START_ONBOARDING',
  COMPLETE_ONBOARDING: 'COMPLETE_ONBOARDING',
  CLOSE_ONBOARDING: 'CLOSE_ONBOARDING',

  // Act completion flow
  ACT_COMPLETED: 'ACT_COMPLETED',
  CONTINUE_FROM_STAMP: 'CONTINUE_FROM_STAMP',
  STAMP_ANIMATION_DONE: 'STAMP_ANIMATION_DONE',
  UNLOCK_ACT: 'UNLOCK_ACT',

  // Quest interactions
  OPEN_QUEST_INFO: 'OPEN_QUEST_INFO',
  CLOSE_QUEST_INFO: 'CLOSE_QUEST_INFO',
  OPEN_QUEST_ACTION: 'OPEN_QUEST_ACTION',
  CLOSE_QUEST_ACTION: 'CLOSE_QUEST_ACTION',

  // Stamp detail
  VIEW_STAMP: 'VIEW_STAMP',
  CLOSE_STAMP: 'CLOSE_STAMP',

  // Direct state set (for initialization)
  SET_STATE: 'SET_STATE',
};

// ============================================================
// INITIAL STATE
// ============================================================

export const createInitialState = (hasCampaign = false) => ({
  screen: hasCampaign ? SCREENS.HOME : SCREENS.SELECT,
  homeState: HOME_STATES.QUESTS,
  context: {
    selectedCampaign: null,
    selectedChapter: null,
    onboardingChapter: null,
    pendingUnlockChapter: null,
    completedChapterId: null,
    selectedQuest: null,
    selectedStamp: null,
    questInfoFirstTime: false,
  },
});

// ============================================================
// REDUCER
// ============================================================

export const navigationReducer = (state, action) => {
  console.log(`[StateMachine] ${action.type}`, action.payload || '');

  switch (action.type) {
    // -------------------- Navigation --------------------

    case ACTIONS.SELECT_CAMPAIGN:
      return {
        ...state,
        screen: SCREENS.INTRO,
        context: {
          ...state.context,
          selectedCampaign: action.payload.campaign,
        },
      };

    case ACTIONS.BEGIN_JOURNEY:
      return {
        ...state,
        screen: SCREENS.BRIEFING,
      };

    case ACTIONS.COMPLETE_BRIEFING:
      return {
        ...state,
        screen: SCREENS.HOME,
        homeState: HOME_STATES.QUESTS,
        context: {
          ...state.context,
          selectedChapter: null,
        },
      };

    case ACTIONS.SKIP_BRIEFING:
      return {
        ...state,
        screen: SCREENS.HOME,
        homeState: HOME_STATES.QUESTS,
        context: {
          ...state.context,
          selectedChapter: null,
        },
      };

    case ACTIONS.BACK_TO_SELECT:
      return {
        ...state,
        screen: SCREENS.SELECT,
        context: {
          ...state.context,
          selectedCampaign: null,
        },
      };

    case ACTIONS.BACK_TO_INTRO:
      return {
        ...state,
        screen: SCREENS.INTRO,
      };

    case ACTIONS.EXIT_CAMPAIGN:
      return {
        ...state,
        screen: SCREENS.SELECT,
      };

    // -------------------- Chapter/Act Navigation --------------------

    case ACTIONS.VIEW_CHAPTER:
      // Just select the chapter, stay on HOME
      return {
        ...state,
        screen: SCREENS.HOME,
        homeState: HOME_STATES.QUESTS,
        context: {
          ...state.context,
          selectedChapter: action.payload.chapter,
        },
      };

    case ACTIONS.CLEAR_SELECTED_CHAPTER:
      return {
        ...state,
        context: {
          ...state.context,
          selectedChapter: null,
        },
      };

    case ACTIONS.START_ONBOARDING:
      return {
        ...state,
        screen: SCREENS.ONBOARDING,
        context: {
          ...state.context,
          onboardingChapter: action.payload.chapter,
        },
      };

    case ACTIONS.COMPLETE_ONBOARDING:
      return {
        ...state,
        screen: SCREENS.HOME,
        homeState: HOME_STATES.QUESTS,
        context: {
          ...state.context,
          onboardingChapter: null,
          selectedChapter: null,
        },
      };

    case ACTIONS.CLOSE_ONBOARDING:
      // Go back to home or intro depending on context
      const isFirstChapter = state.context.onboardingChapter?.id === 'chapter-1';
      return {
        ...state,
        screen: isFirstChapter ? SCREENS.INTRO : SCREENS.HOME,
        homeState: HOME_STATES.QUESTS,
        context: {
          ...state.context,
          onboardingChapter: null,
        },
      };

    // -------------------- Act Completion Flow --------------------

    case ACTIONS.ACT_COMPLETED:
      // Show stamp reveal modal
      return {
        ...state,
        homeState: HOME_STATES.STAMP_REVEAL,
        context: {
          ...state.context,
          completedChapterId: action.payload.chapterId,
        },
      };

    case ACTIONS.CONTINUE_FROM_STAMP:
      // Start stamp collecting animation
      return {
        ...state,
        homeState: HOME_STATES.STAMP_COLLECTING,
      };

    case ACTIONS.STAMP_ANIMATION_DONE:
      // Show act unlock overlay, switch to next chapter view
      return {
        ...state,
        homeState: HOME_STATES.ACT_UNLOCK,
        context: {
          ...state.context,
          selectedChapter: action.payload.nextChapter,
          pendingUnlockChapter: action.payload.nextChapter,
        },
      };

    case ACTIONS.UNLOCK_ACT:
      // User tapped "Let's Go!" - go to onboarding for the new act
      const chapterToUnlock = state.context.pendingUnlockChapter;
      return {
        ...state,
        screen: SCREENS.ONBOARDING,
        homeState: HOME_STATES.QUESTS,
        context: {
          ...state.context,
          onboardingChapter: chapterToUnlock,
          pendingUnlockChapter: null,
          completedChapterId: null,
        },
      };

    // -------------------- Quest Interactions --------------------

    case ACTIONS.OPEN_QUEST_INFO:
      return {
        ...state,
        homeState: HOME_STATES.QUEST_INFO,
        context: {
          ...state.context,
          questInfoFirstTime: action.payload.firstTime || false,
        },
      };

    case ACTIONS.CLOSE_QUEST_INFO:
      return {
        ...state,
        homeState: HOME_STATES.QUESTS,
        context: {
          ...state.context,
          questInfoFirstTime: false,
        },
      };

    case ACTIONS.OPEN_QUEST_ACTION:
      return {
        ...state,
        homeState: HOME_STATES.QUEST_ACTION,
        context: {
          ...state.context,
          selectedQuest: action.payload.quest,
        },
      };

    case ACTIONS.CLOSE_QUEST_ACTION:
      return {
        ...state,
        homeState: HOME_STATES.QUESTS,
        context: {
          ...state.context,
          selectedQuest: null,
        },
      };

    // -------------------- Stamp Detail --------------------

    case ACTIONS.VIEW_STAMP:
      return {
        ...state,
        homeState: HOME_STATES.STAMP_DETAIL,
        context: {
          ...state.context,
          selectedStamp: action.payload.stamp,
        },
      };

    case ACTIONS.CLOSE_STAMP:
      return {
        ...state,
        homeState: HOME_STATES.QUESTS,
        context: {
          ...state.context,
          selectedStamp: null,
        },
      };

    // -------------------- Direct State Set --------------------

    case ACTIONS.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      console.warn(`[StateMachine] Unknown action: ${action.type}`);
      return state;
  }
};

// ============================================================
// ACTION CREATORS
// ============================================================

export const actions = {
  selectCampaign: (campaign) => ({
    type: ACTIONS.SELECT_CAMPAIGN,
    payload: { campaign },
  }),

  beginJourney: () => ({
    type: ACTIONS.BEGIN_JOURNEY,
  }),

  completeBriefing: () => ({
    type: ACTIONS.COMPLETE_BRIEFING,
  }),

  skipBriefing: () => ({
    type: ACTIONS.SKIP_BRIEFING,
  }),

  backToSelect: () => ({
    type: ACTIONS.BACK_TO_SELECT,
  }),

  backToIntro: () => ({
    type: ACTIONS.BACK_TO_INTRO,
  }),

  exitCampaign: () => ({
    type: ACTIONS.EXIT_CAMPAIGN,
  }),

  viewChapter: (chapter) => ({
    type: ACTIONS.VIEW_CHAPTER,
    payload: { chapter },
  }),

  clearSelectedChapter: () => ({
    type: ACTIONS.CLEAR_SELECTED_CHAPTER,
  }),

  startOnboarding: (chapter) => ({
    type: ACTIONS.START_ONBOARDING,
    payload: { chapter },
  }),

  completeOnboarding: () => ({
    type: ACTIONS.COMPLETE_ONBOARDING,
  }),

  closeOnboarding: () => ({
    type: ACTIONS.CLOSE_ONBOARDING,
  }),

  actCompleted: (chapterId) => ({
    type: ACTIONS.ACT_COMPLETED,
    payload: { chapterId },
  }),

  continueFromStamp: () => ({
    type: ACTIONS.CONTINUE_FROM_STAMP,
  }),

  stampAnimationDone: (nextChapter) => ({
    type: ACTIONS.STAMP_ANIMATION_DONE,
    payload: { nextChapter },
  }),

  unlockAct: () => ({
    type: ACTIONS.UNLOCK_ACT,
  }),

  openQuestInfo: (firstTime = false) => ({
    type: ACTIONS.OPEN_QUEST_INFO,
    payload: { firstTime },
  }),

  closeQuestInfo: () => ({
    type: ACTIONS.CLOSE_QUEST_INFO,
  }),

  openQuestAction: (quest) => ({
    type: ACTIONS.OPEN_QUEST_ACTION,
    payload: { quest },
  }),

  closeQuestAction: () => ({
    type: ACTIONS.CLOSE_QUEST_ACTION,
  }),

  viewStamp: (stamp) => ({
    type: ACTIONS.VIEW_STAMP,
    payload: { stamp },
  }),

  closeStamp: () => ({
    type: ACTIONS.CLOSE_STAMP,
  }),
};
