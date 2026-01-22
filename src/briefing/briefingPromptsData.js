// Campaign Briefing Prompts Data
// 6 conversational prompts with chip selections

export const BRIEFING_PROMPTS = [
  {
    id: 'timeline',
    aiMessage: "Hey! How long are you thinking for your trip?",
    options: [
      { id: 'weekend', label: 'Quick weekend', icon: '⚡', value: 'weekend' },
      { id: 'week', label: 'About a week', icon: '📅', value: 'week' },
      { id: 'extended', label: '2+ weeks', icon: '🌍', value: 'extended' },
    ],
    allowFreeText: false,
  },
  {
    id: 'budget_vibe',
    aiMessage: "Nice! What's your budget vibe for this adventure?",
    options: [
      { id: 'save', label: 'Budget-conscious', icon: '💰', value: 'save' },
      { id: 'balanced', label: 'Balanced spending', icon: '⚖️', value: 'balanced' },
      { id: 'treat', label: 'Treat myself', icon: '✨', value: 'treat' },
    ],
    allowFreeText: false,
  },
  {
    id: 'confidence',
    aiMessage: "How are you feeling about traveling solo?",
    options: [
      { id: 'nervous', label: 'A bit nervous', icon: '🙈', value: 'nervous' },
      { id: 'ready', label: 'Ready to try', icon: '👍', value: 'ready' },
      { id: 'bold', label: 'Born for this', icon: '🔥', value: 'bold' },
    ],
    allowFreeText: false,
  },
  {
    id: 'planning_energy',
    aiMessage: "How much energy do you have for planning?",
    options: [
      { id: 'low', label: 'Keep it simple', icon: '😌', value: 'low' },
      { id: 'med', label: 'Moderate effort', icon: '📝', value: 'med' },
      { id: 'high', label: 'Love planning!', icon: '📋', value: 'high' },
    ],
    allowFreeText: false,
  },
  {
    id: 'priority',
    aiMessage: "What matters most to you on this trip?",
    options: [
      { id: 'safety', label: 'Feeling safe', icon: '🛡️', value: 'safety' },
      { id: 'adventure', label: 'New experiences', icon: '🎯', value: 'adventure' },
      { id: 'growth', label: 'Personal growth', icon: '🌱', value: 'growth' },
      { id: 'relaxation', label: 'Relaxation', icon: '🧘', value: 'relaxation' },
    ],
    allowFreeText: true,
  },
  {
    id: 'style',
    aiMessage: "Last one! How structured do you like your travel?",
    options: [
      { id: 'planned', label: 'Well planned', icon: '📅', value: 'planned' },
      { id: 'flexible', label: 'Flexible outline', icon: '🎲', value: 'flexible' },
      { id: 'spontaneous', label: 'Spontaneous', icon: '🌊', value: 'spontaneous' },
    ],
    allowFreeText: false,
  },
];

// Thinking messages for brief generation
export const BRIEF_THINKING_MESSAGES = [
  { delay: 0, text: 'Analyzing your preferences...' },
  { delay: 600, text: 'Creating your mission brief...' },
  { delay: 1200, text: 'Customizing your adventure...' },
];

// Get a prompt by ID
export const getPromptById = (promptId) => {
  return BRIEFING_PROMPTS.find(p => p.id === promptId);
};

// Get prompt index by ID
export const getPromptIndex = (promptId) => {
  return BRIEFING_PROMPTS.findIndex(p => p.id === promptId);
};

export default BRIEFING_PROMPTS;
