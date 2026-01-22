// Constraint Mapper
// Maps chat responses to the 5 constraints used for quest generation

/**
 * Constraint definitions
 *
 * | Chat Response | Constraint      | Options                         |
 * |---------------|-----------------|----------------------------------|
 * | timeline      | tripSize        | mini, standard, big              |
 * | budget_vibe   | spendVibe       | save, balanced, treat            |
 * | confidence    | soloConfidence  | nervous, ready, bold             |
 * | planning_energy | planningEnergy | low, med, high                  |
 * | style         | structure       | planned, flexible, spontaneous   |
 */

// Mapping from chat prompt IDs to constraint names
const PROMPT_TO_CONSTRAINT = {
  timeline: 'tripSize',
  budget_vibe: 'spendVibe',
  confidence: 'soloConfidence',
  planning_energy: 'planningEnergy',
  style: 'structure',
  // priority is stored but not mapped to a constraint (used for quest content)
};

// Value mappings for each prompt
const VALUE_MAPPINGS = {
  timeline: {
    weekend: 'mini',
    week: 'standard',
    extended: 'big',
  },
  budget_vibe: {
    save: 'save',
    balanced: 'balanced',
    treat: 'treat',
  },
  confidence: {
    nervous: 'nervous',
    ready: 'ready',
    bold: 'bold',
  },
  planning_energy: {
    low: 'low',
    med: 'med',
    high: 'high',
  },
  style: {
    planned: 'planned',
    flexible: 'flexible',
    spontaneous: 'spontaneous',
  },
};

// Constraint display labels
export const CONSTRAINT_LABELS = {
  tripSize: {
    name: 'Trip Length',
    options: {
      mini: { label: 'Quick Trip', description: '2-4 days', icon: '⚡' },
      standard: { label: 'Week Trip', description: '5-7 days', icon: '📅' },
      big: { label: 'Extended', description: '2+ weeks', icon: '🌍' },
    },
  },
  spendVibe: {
    name: 'Budget Style',
    options: {
      save: { label: 'Budget', description: 'Cost-conscious', icon: '💰' },
      balanced: { label: 'Balanced', description: 'Mix of both', icon: '⚖️' },
      treat: { label: 'Treat', description: 'Splurge a little', icon: '✨' },
    },
  },
  soloConfidence: {
    name: 'Confidence',
    options: {
      nervous: { label: 'Building Up', description: 'Take it slow', icon: '🙈' },
      ready: { label: 'Ready', description: 'Feeling prepared', icon: '👍' },
      bold: { label: 'Bold', description: 'Bring it on!', icon: '🔥' },
    },
  },
  planningEnergy: {
    name: 'Planning Style',
    options: {
      low: { label: 'Simple', description: 'Minimal planning', icon: '😌' },
      med: { label: 'Moderate', description: 'Some planning', icon: '📝' },
      high: { label: 'Detailed', description: 'Love to plan', icon: '📋' },
    },
  },
  structure: {
    name: 'Travel Style',
    options: {
      planned: { label: 'Planned', description: 'Structured itinerary', icon: '📅' },
      flexible: { label: 'Flexible', description: 'Loose outline', icon: '🎲' },
      spontaneous: { label: 'Spontaneous', description: 'Go with the flow', icon: '🌊' },
    },
  },
};

/**
 * Maps chat responses to constraints
 * @param {Object} chatResponses - Object with prompt IDs as keys and selected option values
 * @returns {Object} - Constraint object with constraint names as keys
 */
export const mapResponsesToConstraints = (chatResponses) => {
  const constraints = {};

  Object.entries(chatResponses).forEach(([promptId, selectedValue]) => {
    const constraintName = PROMPT_TO_CONSTRAINT[promptId];

    if (constraintName) {
      const mapping = VALUE_MAPPINGS[promptId];
      if (mapping && mapping[selectedValue]) {
        constraints[constraintName] = mapping[selectedValue];
      } else {
        // If no mapping, use the raw value (for free text or unmapped values)
        constraints[constraintName] = selectedValue;
      }
    }
  });

  return constraints;
};

/**
 * Get default constraints
 * @returns {Object} - Default constraint values
 */
export const getDefaultConstraints = () => ({
  tripSize: 'standard',
  spendVibe: 'balanced',
  soloConfidence: 'ready',
  planningEnergy: 'med',
  structure: 'flexible',
});

/**
 * Get constraint options for a given constraint name
 * @param {string} constraintName
 * @returns {Object} - Options for the constraint
 */
export const getConstraintOptions = (constraintName) => {
  return CONSTRAINT_LABELS[constraintName]?.options || {};
};

/**
 * Get constraint display info
 * @param {string} constraintName
 * @param {string} value
 * @returns {Object} - Display info with label, description, icon
 */
export const getConstraintDisplay = (constraintName, value) => {
  const constraint = CONSTRAINT_LABELS[constraintName];
  if (!constraint) return null;

  return {
    name: constraint.name,
    ...constraint.options[value],
  };
};

/**
 * Get all constraint names in display order
 * @returns {Array} - Array of constraint names
 */
export const getConstraintOrder = () => [
  'tripSize',
  'spendVibe',
  'soloConfidence',
  'planningEnergy',
  'structure',
];

export default {
  mapResponsesToConstraints,
  getDefaultConstraints,
  getConstraintOptions,
  getConstraintDisplay,
  getConstraintOrder,
  CONSTRAINT_LABELS,
};
