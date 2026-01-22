// Stamp Generator - Derives personality labels from act onboarding answers

import { ACT_QUESTIONS } from '../campaign/questionsData';

// Stamp definitions for each chapter
// Each stamp has a label derived from answer patterns
const STAMP_DEFINITIONS = {
  'chapter-1': {
    actName: 'The Call',
    actIcon: '🌅',
    // Key questions: travel-style (0), comfort-level (2)
    labelMatrix: {
      // travel-style: explore (0)
      '0-2': 'Bold Explorer',      // explore + push
      '0-3': 'Bold Explorer',      // explore + unpredictable
      '0-0': 'Curious Wanderer',   // explore + familiar
      '0-1': 'Curious Wanderer',   // explore + mixed
      // travel-style: culture (1)
      '1-0': 'Culture Seeker',
      '1-1': 'Culture Seeker',
      '1-2': 'Culture Seeker',
      '1-3': 'Culture Seeker',
      // travel-style: relax (2)
      '2-0': 'Peaceful Dreamer',
      '2-1': 'Peaceful Dreamer',
      '2-2': 'Peaceful Dreamer',
      '2-3': 'Peaceful Dreamer',
      // travel-style: social (3)
      '3-0': 'Social Adventurer',
      '3-1': 'Social Adventurer',
      '3-2': 'Social Adventurer',
      '3-3': 'Social Adventurer',
    },
    defaultLabel: 'Dreamer',
    keyQuestionIndices: [0, 2], // travel-style, comfort-level
  },
  'chapter-2': {
    actName: 'Planning',
    actIcon: '📋',
    // Key questions: booking-style (0), packing-style (2)
    labelMatrix: {
      // booking-style: apps (0)
      '0-0': 'Tech-Savvy Planner',  // apps + minimalist
      '0-1': 'Prepared Planner',     // apps + prepared
      '0-2': 'Last-Minute Pro',      // apps + last minute
      '0-3': 'Organized Planner',    // apps + checklist
      // booking-style: direct (1)
      '1-0': 'Direct Booker',
      '1-1': 'Thorough Planner',
      '1-2': 'Flexible Booker',
      '1-3': 'Detail Oriented',
      // booking-style: agent (2)
      '2-0': 'Guided Traveler',
      '2-1': 'Prepared Traveler',
      '2-2': 'Relaxed Planner',
      '2-3': 'Methodical Planner',
      // booking-style: deals (3)
      '3-0': 'Deal Hunter',
      '3-1': 'Savvy Saver',
      '3-2': 'Spontaneous Saver',
      '3-3': 'Budget Master',
    },
    defaultLabel: 'Planner',
    keyQuestionIndices: [0, 2], // booking-style, packing-style
  },
  'chapter-3': {
    actName: 'The Journey',
    actIcon: '🗺️',
    // Key questions: social-comfort (2), challenge-handling (3)
    labelMatrix: {
      // social-comfort: love (0)
      '0-0': 'Social Butterfly',     // love + thrive
      '0-1': 'Friendly Explorer',    // love + adapt
      '0-2': 'Cautious Connector',   // love + plan
      '0-3': 'Helpful Traveler',     // love + seek help
      // social-comfort: open (1)
      '1-0': 'Open Adventurer',
      '1-1': 'Adaptable Traveler',
      '1-2': 'Balanced Explorer',
      '1-3': 'Thoughtful Traveler',
      // social-comfort: selective (2)
      '2-0': 'Independent Spirit',
      '2-1': 'Resilient Traveler',
      '2-2': 'Strategic Explorer',
      '2-3': 'Careful Adventurer',
      // social-comfort: solo (3)
      '3-0': 'Solo Warrior',
      '3-1': 'Quiet Wanderer',
      '3-2': 'Prepared Loner',
      '3-3': 'Reflective Traveler',
    },
    defaultLabel: 'Traveler',
    keyQuestionIndices: [2, 3], // social-comfort, challenge-handling
  },
  'chapter-4': {
    actName: 'Return',
    actIcon: '🏠',
    // Key questions: reflection-style (2), growth-focus (3)
    labelMatrix: {
      // reflection-style: write (0)
      '0-0': 'Storyteller',          // write + confidence
      '0-1': 'Perspective Writer',   // write + perspective
      '0-2': 'Skill Journalist',     // write + skills
      '0-3': 'Connection Chronicler', // write + connections
      // reflection-style: talk (1)
      '1-0': 'Confident Narrator',
      '1-1': 'Wisdom Sharer',
      '1-2': 'Experience Teacher',
      '1-3': 'Social Storyteller',
      // reflection-style: think (2)
      '2-0': 'Quiet Achiever',
      '2-1': 'Deep Thinker',
      '2-2': 'Silent Learner',
      '2-3': 'Reflective Soul',
      // reflection-style: create (3)
      '3-0': 'Creative Spirit',
      '3-1': 'Visual Storyteller',
      '3-2': 'Maker',
      '3-3': 'Artistic Connector',
    },
    defaultLabel: 'Reflector',
    keyQuestionIndices: [2, 3], // reflection-style, growth-focus
  },
};

/**
 * Generate a stamp from act onboarding answers
 * @param {string} chapterId - e.g., 'chapter-1'
 * @param {number[]} answers - Array of answer indices [0-3] for each question
 * @param {Date|string} completedAt - When the chapter was completed
 * @returns {Object} Stamp object
 */
export const generateStamp = (chapterId, answers, completedAt = null) => {
  const definition = STAMP_DEFINITIONS[chapterId];

  if (!definition || !answers || answers.length < 5) {
    return {
      chapterId,
      label: definition?.defaultLabel || 'Traveler',
      actName: definition?.actName || 'Unknown',
      actIcon: definition?.actIcon || '📍',
      completedAt,
      answers: answers || [],
    };
  }

  const [keyIndex1, keyIndex2] = definition.keyQuestionIndices;
  const key = `${answers[keyIndex1]}-${answers[keyIndex2]}`;
  const label = definition.labelMatrix[key] || definition.defaultLabel;

  return {
    chapterId,
    label,
    actName: definition.actName,
    actIcon: definition.actIcon,
    completedAt,
    answers,
  };
};

/**
 * Get the questions that contributed to the stamp label
 * @param {string} chapterId
 * @param {number[]} answers
 * @returns {Array} Array of { question, answer } objects
 */
export const getStampInsights = (chapterId, answers) => {
  const definition = STAMP_DEFINITIONS[chapterId];
  const questions = ACT_QUESTIONS[chapterId]?.questions || [];

  if (!definition || !answers) return [];

  const insights = definition.keyQuestionIndices.map(index => {
    const question = questions[index];
    const answerIndex = answers[index];
    const selectedOption = question?.options[answerIndex];

    return {
      question: question?.question || '',
      answer: selectedOption?.label || '',
      icon: selectedOption?.icon || '',
    };
  });

  return insights;
};

/**
 * Get stamp definition metadata
 * @param {string} chapterId
 * @returns {Object}
 */
export const getStampDefinition = (chapterId) => {
  return STAMP_DEFINITIONS[chapterId] || null;
};

export default {
  generateStamp,
  getStampInsights,
  getStampDefinition,
};
