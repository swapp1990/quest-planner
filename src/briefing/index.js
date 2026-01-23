// Briefing Module Exports

// Act-specific briefing data (new unified approach)
export {
  ACT_BRIEFING_DATA,
  getBriefingData,
  mapResponsesToConstraints as mapActResponsesToConstraints,
  generateQuestsForAct,
  getDefaultConstraints as getActDefaultConstraints,
} from './actBriefingData';

// Legacy data (kept for backwards compatibility)
export {
  BRIEFING_PROMPTS,
  BRIEF_THINKING_MESSAGES,
  getPromptById,
  getPromptIndex,
} from './briefingPromptsData';

export {
  mapResponsesToConstraints,
  getDefaultConstraints,
  getConstraintOptions,
  getConstraintDisplay,
  getConstraintOrder,
  CONSTRAINT_LABELS,
} from './constraintMapper';

export {
  PLAN_OPTIONS,
  generateQuestsForPlan,
  getPlanById,
  getAllPlans,
  getRecommendedPlan,
} from './planGenerator';

// Components
export {
  ChatBubble,
  UserBubble,
  ChoiceChips,
  FreeTextInput,
  TypingIndicator,
  StepIndicator,
  ConstraintCard,
  PlanOptionCard,
} from './components';
