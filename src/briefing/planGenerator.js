// Plan Generator
// Generates quests based on plan selection and constraints

/**
 * Plan definitions
 *
 * | Plan    | Quest Count | Features                                |
 * |---------|-------------|----------------------------------------|
 * | Comfort | 6           | Safe steps, lower commitment           |
 * | Stretch | 8           | +2 confidence quests, higher commitment |
 */

export const PLAN_OPTIONS = {
  comfort: {
    id: 'comfort',
    name: 'Comfort Path',
    tagline: 'Build confidence at your pace',
    description: 'Start with manageable challenges that build your solo travel skills gradually.',
    questCount: 6,
    features: [
      'Gentle learning curve',
      'Focus on essentials',
      'Less time commitment',
    ],
    icon: '🛤️',
    recommended: true,
    color: '#4CAF50',
  },
  stretch: {
    id: 'stretch',
    name: 'Stretch Path',
    tagline: 'Push your boundaries',
    description: 'Challenge yourself with extra quests that build deeper confidence.',
    questCount: 8,
    features: [
      'Extra confidence challenges',
      'Deeper skill building',
      'Greater transformation',
    ],
    icon: '🚀',
    recommended: false,
    color: '#FF9800',
  },
};

// Base quest templates - these get adjusted based on constraints
const BASE_QUESTS = {
  comfort: [
    {
      id: 'destination-research',
      name: 'Choose Your Destination',
      icon: '🗺️',
      description: 'Research and pick your first solo travel destination',
      maxSegments: 3,
      category: 'planning',
    },
    {
      id: 'budget-basics',
      name: 'Budget Foundations',
      icon: '💰',
      description: 'Create a simple trip budget that works for you',
      maxSegments: 2,
      category: 'planning',
    },
    {
      id: 'booking-first-stay',
      name: 'Book Your First Stay',
      icon: '🏨',
      description: 'Reserve your accommodation with confidence',
      maxSegments: 2,
      category: 'booking',
    },
    {
      id: 'packing-essentials',
      name: 'Pack Smart',
      icon: '🎒',
      description: 'Create your essential packing list',
      maxSegments: 3,
      category: 'preparation',
    },
    {
      id: 'safety-basics',
      name: 'Safety Prep',
      icon: '🛡️',
      description: 'Set up basic safety measures for peace of mind',
      maxSegments: 2,
      category: 'preparation',
    },
    {
      id: 'first-day-plan',
      name: 'First Day Blueprint',
      icon: '📋',
      description: 'Plan your arrival day to start stress-free',
      maxSegments: 2,
      category: 'planning',
    },
  ],
  stretch: [
    // All comfort quests plus these additional ones
    {
      id: 'solo-dining',
      name: 'Solo Dining Challenge',
      icon: '🍽️',
      description: 'Practice dining alone before your trip',
      maxSegments: 2,
      category: 'confidence',
    },
    {
      id: 'stranger-conversation',
      name: 'Conversation Starter',
      icon: '💬',
      description: 'Strike up a conversation with someone new',
      maxSegments: 2,
      category: 'confidence',
    },
  ],
};

/**
 * Adjusts quest difficulty based on constraints
 * @param {Array} quests - Base quests array
 * @param {Object} constraints - User constraints
 * @returns {Array} - Adjusted quests
 */
const adjustQuestsForConstraints = (quests, constraints) => {
  return quests.map(quest => {
    let adjustedQuest = { ...quest };

    // Adjust based on confidence level
    if (constraints.soloConfidence === 'nervous') {
      // More steps, gentler pace
      if (quest.category === 'confidence') {
        adjustedQuest.maxSegments = Math.max(1, quest.maxSegments - 1);
      }
    } else if (constraints.soloConfidence === 'bold') {
      // Can handle more challenge
      if (quest.category === 'confidence') {
        adjustedQuest.maxSegments = quest.maxSegments + 1;
      }
    }

    // Adjust based on planning energy
    if (constraints.planningEnergy === 'low') {
      // Fewer steps overall
      adjustedQuest.maxSegments = Math.max(1, adjustedQuest.maxSegments - 1);
    } else if (constraints.planningEnergy === 'high') {
      // More detailed steps
      adjustedQuest.maxSegments = adjustedQuest.maxSegments + 1;
    }

    // Adjust based on trip size
    if (constraints.tripSize === 'mini') {
      // Quick trip, fewer steps
      adjustedQuest.maxSegments = Math.max(1, Math.min(adjustedQuest.maxSegments, 2));
    } else if (constraints.tripSize === 'big') {
      // Extended trip, can have more preparation
      adjustedQuest.maxSegments = adjustedQuest.maxSegments + 1;
    }

    return adjustedQuest;
  });
};

/**
 * Generates quests based on plan and constraints
 * @param {string} planId - 'comfort' or 'stretch'
 * @param {Object} constraints - User constraints from briefing
 * @returns {Array} - Array of quest objects
 */
export const generateQuestsForPlan = (planId, constraints) => {
  const plan = PLAN_OPTIONS[planId];
  if (!plan) {
    console.warn(`Unknown plan: ${planId}, defaulting to comfort`);
    return generateQuestsForPlan('comfort', constraints);
  }

  let quests = [...BASE_QUESTS.comfort];

  // Add stretch quests if stretch plan selected
  if (planId === 'stretch') {
    quests = [...quests, ...BASE_QUESTS.stretch];
  }

  // Adjust quests based on constraints
  quests = adjustQuestsForConstraints(quests, constraints);

  // Initialize quest progress
  quests = quests.map(quest => ({
    ...quest,
    completedSegments: 0,
  }));

  return quests;
};

/**
 * Get plan by ID
 * @param {string} planId
 * @returns {Object} - Plan object
 */
export const getPlanById = (planId) => {
  return PLAN_OPTIONS[planId] || PLAN_OPTIONS.comfort;
};

/**
 * Get all plans as array
 * @returns {Array} - Array of plan objects
 */
export const getAllPlans = () => {
  return Object.values(PLAN_OPTIONS);
};

/**
 * Get recommended plan
 * @returns {Object} - The recommended plan
 */
export const getRecommendedPlan = () => {
  return Object.values(PLAN_OPTIONS).find(plan => plan.recommended) || PLAN_OPTIONS.comfort;
};

export default {
  PLAN_OPTIONS,
  generateQuestsForPlan,
  getPlanById,
  getAllPlans,
  getRecommendedPlan,
};
