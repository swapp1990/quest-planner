// Act Onboarding Questions Data

export const ACT_QUESTIONS = {
  'chapter-1': {
    title: "Let's Plan Your Adventure",
    subtitle: 'Answer a few questions to personalize your quests',
    questions: [
      {
        id: 'travel-style',
        question: 'What energizes you most when traveling?',
        options: [
          { id: 'explore', label: 'Exploring hidden gems off the beaten path', icon: '🗺️' },
          { id: 'culture', label: 'Immersing in local culture and traditions', icon: '🎭' },
          { id: 'relax', label: 'Finding peace and relaxation', icon: '🧘' },
          { id: 'social', label: 'Meeting new people and socializing', icon: '🤝' },
        ],
      },
      {
        id: 'planning-style',
        question: 'How do you like to plan?',
        options: [
          { id: 'detailed', label: 'Detailed itinerary, everything scheduled', icon: '📋' },
          { id: 'flexible', label: 'Rough outline with flexibility', icon: '📝' },
          { id: 'spontaneous', label: 'Completely spontaneous', icon: '🎲' },
          { id: 'essentials', label: 'Just the essentials (flights, first night)', icon: '✈️' },
        ],
      },
      {
        id: 'comfort-level',
        question: "What's your comfort zone?",
        options: [
          { id: 'familiar', label: 'I prefer familiar environments', icon: '🏠' },
          { id: 'mixed', label: 'Mix of comfort and adventure', icon: '⚖️' },
          { id: 'push', label: 'Push me out of my comfort zone!', icon: '🚀' },
          { id: 'unpredictable', label: 'Complete unpredictability excites me', icon: '🎢' },
        ],
      },
      {
        id: 'budget-priority',
        question: 'Where would you splurge?',
        options: [
          { id: 'experiences', label: 'Unique experiences and activities', icon: '🎯' },
          { id: 'food', label: 'Great food and dining', icon: '🍽️' },
          { id: 'accommodation', label: 'Comfortable accommodation', icon: '🏨' },
          { id: 'transport', label: 'Transportation and convenience', icon: '🚕' },
        ],
      },
      {
        id: 'trip-duration',
        question: 'How long is your ideal first solo trip?',
        options: [
          { id: 'weekend', label: 'Quick weekend getaway (2-4 days)', icon: '📅' },
          { id: 'week', label: 'A good week (5-7 days)', icon: '🗓️' },
          { id: 'extended', label: 'Extended adventure (2+ weeks)', icon: '🌍' },
          { id: 'long', label: 'As long as possible!', icon: '🌟' },
        ],
      },
    ],
  },
  'chapter-2': {
    title: 'Time to Get Practical',
    subtitle: 'Help us tailor your planning quests',
    questions: [
      {
        id: 'booking-style',
        question: 'How do you prefer to book travel?',
        options: [
          { id: 'apps', label: 'Travel apps and aggregators', icon: '📱' },
          { id: 'direct', label: 'Directly with airlines/hotels', icon: '🏢' },
          { id: 'agent', label: 'Travel agent assistance', icon: '👤' },
          { id: 'deals', label: 'Hunt for the best deals', icon: '💎' },
        ],
      },
      {
        id: 'accommodation-type',
        question: 'Where do you like to stay?',
        options: [
          { id: 'hotel', label: 'Hotels for comfort and service', icon: '🏨' },
          { id: 'hostel', label: 'Hostels to meet people', icon: '🛏️' },
          { id: 'airbnb', label: 'Local apartments for authenticity', icon: '🏠' },
          { id: 'unique', label: 'Unique stays (treehouses, boats)', icon: '🏕️' },
        ],
      },
      {
        id: 'packing-style',
        question: 'How do you pack?',
        options: [
          { id: 'light', label: 'Minimalist - carry-on only', icon: '🎒' },
          { id: 'prepared', label: 'Prepared for everything', icon: '🧳' },
          { id: 'lastminute', label: 'Last minute tosser', icon: '⏰' },
          { id: 'list', label: 'Detailed checklist follower', icon: '✅' },
        ],
      },
      {
        id: 'activity-pace',
        question: 'What\'s your ideal daily pace?',
        options: [
          { id: 'packed', label: 'Packed schedule, see everything', icon: '🏃' },
          { id: 'balanced', label: 'Balanced with downtime', icon: '☯️' },
          { id: 'relaxed', label: 'Relaxed, go with the flow', icon: '🌊' },
          { id: 'flexible', label: 'Depends on my mood', icon: '🎭' },
        ],
      },
      {
        id: 'documentation',
        question: 'How do you document trips?',
        options: [
          { id: 'photos', label: 'Lots of photos', icon: '📸' },
          { id: 'journal', label: 'Written journal entries', icon: '📓' },
          { id: 'social', label: 'Social media updates', icon: '📲' },
          { id: 'memory', label: 'Just live in the moment', icon: '🧠' },
        ],
      },
    ],
  },
  'chapter-3': {
    title: 'Adventure Awaits',
    subtitle: 'Customize your journey experience',
    questions: [
      {
        id: 'photo-style',
        question: 'What do you love to photograph?',
        options: [
          { id: 'landmarks', label: 'Iconic landmarks and scenery', icon: '🏛️' },
          { id: 'people', label: 'People and street life', icon: '👥' },
          { id: 'food', label: 'Food and local cuisine', icon: '🍜' },
          { id: 'moments', label: 'Candid moments and details', icon: '✨' },
        ],
      },
      {
        id: 'food-adventure',
        question: 'How adventurous with food?',
        options: [
          { id: 'very', label: 'Try everything once!', icon: '🦑' },
          { id: 'moderate', label: 'Open but careful', icon: '🍲' },
          { id: 'safe', label: 'Stick to familiar foods', icon: '🍕' },
          { id: 'research', label: 'Research first, then decide', icon: '📖' },
        ],
      },
      {
        id: 'social-comfort',
        question: 'How do you feel about meeting strangers?',
        options: [
          { id: 'love', label: 'Love it! Best part of travel', icon: '💬' },
          { id: 'open', label: 'Open when opportunity arises', icon: '👋' },
          { id: 'selective', label: 'Selective about interactions', icon: '🎯' },
          { id: 'solo', label: 'Prefer my own company', icon: '🧘' },
        ],
      },
      {
        id: 'challenge-handling',
        question: 'How do you handle unexpected challenges?',
        options: [
          { id: 'thrive', label: 'Thrive on problem-solving', icon: '💪' },
          { id: 'adapt', label: 'Adapt and move on', icon: '🔄' },
          { id: 'plan', label: 'Plan to avoid them', icon: '🗂️' },
          { id: 'help', label: 'Seek help when needed', icon: '🆘' },
        ],
      },
      {
        id: 'memory-keeper',
        question: 'What memories do you cherish most?',
        options: [
          { id: 'views', label: 'Breathtaking views', icon: '🌅' },
          { id: 'connections', label: 'Human connections made', icon: '❤️' },
          { id: 'achievements', label: 'Personal achievements', icon: '🏆' },
          { id: 'discoveries', label: 'Unexpected discoveries', icon: '🔮' },
        ],
      },
    ],
  },
  'chapter-4': {
    title: 'Coming Home',
    subtitle: 'Shape your reflection journey',
    questions: [
      {
        id: 'photo-organizing',
        question: 'How do you organize photos?',
        options: [
          { id: 'immediate', label: 'Sort during the trip', icon: '📱' },
          { id: 'after', label: 'Big edit session after', icon: '💻' },
          { id: 'cloud', label: 'Auto-backup, sort later', icon: '☁️' },
          { id: 'minimal', label: 'Keep everything, rarely sort', icon: '📦' },
        ],
      },
      {
        id: 'sharing-style',
        question: 'How do you share travel stories?',
        options: [
          { id: 'social', label: 'Social media posts', icon: '📲' },
          { id: 'album', label: 'Photo albums for close ones', icon: '📚' },
          { id: 'verbal', label: 'In-person storytelling', icon: '🗣️' },
          { id: 'private', label: 'Keep memories private', icon: '🤫' },
        ],
      },
      {
        id: 'reflection-style',
        question: 'How do you reflect on experiences?',
        options: [
          { id: 'write', label: 'Write about them', icon: '✍️' },
          { id: 'talk', label: 'Talk with others', icon: '💭' },
          { id: 'think', label: 'Quiet contemplation', icon: '🧠' },
          { id: 'create', label: 'Create something (art, video)', icon: '🎨' },
        ],
      },
      {
        id: 'growth-focus',
        question: 'What growth do you seek from travel?',
        options: [
          { id: 'confidence', label: 'Self-confidence', icon: '💪' },
          { id: 'perspective', label: 'New perspectives', icon: '👁️' },
          { id: 'skills', label: 'Practical skills', icon: '🛠️' },
          { id: 'connections', label: 'Lasting connections', icon: '🔗' },
        ],
      },
      {
        id: 'next-adventure',
        question: 'After this trip, what\'s next?',
        options: [
          { id: 'bigger', label: 'Bigger, bolder adventures', icon: '🚀' },
          { id: 'similar', label: 'Similar style, new place', icon: '🔄' },
          { id: 'different', label: 'Completely different type', icon: '🎭' },
          { id: 'rest', label: 'Rest and save for later', icon: '🏡' },
        ],
      },
    ],
  },
};

// AI Thinking messages shown during quest generation
export const THINKING_MESSAGES = [
  { delay: 0, text: 'Analyzing your preferences...' },
  { delay: 800, text: 'Finding perfect challenges...' },
  { delay: 1600, text: 'Customizing difficulty...' },
  { delay: 2400, text: 'Finalizing your quests...' },
];

// Get questions for a chapter
export const getQuestionsForChapter = (chapterId) => {
  return ACT_QUESTIONS[chapterId] || ACT_QUESTIONS['chapter-1'];
};
