// Act-Specific Briefing Data
// Chat prompts, constraints, and plan options for each act

/**
 * ACT 1: The Call to Travel - Initial planning and dreaming phase
 * ACT 2: Planning & Preparation - Booking and getting ready
 * ACT 3: The Journey Begins - On the trip, experiencing
 * ACT 4: Return & Reflect - Coming home and processing
 */

// ============================================================
// ACT 1: The Call to Travel
// ============================================================

const ACT_1_PROMPTS = [
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

const ACT_1_CONSTRAINTS = {
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

const ACT_1_PLANS = {
  comfort: {
    id: 'comfort',
    name: 'Comfort Path',
    tagline: 'Build confidence at your pace',
    description: 'Start with manageable challenges that build your solo travel skills gradually.',
    questCount: 6,
    features: ['Gentle learning curve', 'Focus on essentials', 'Less time commitment'],
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
    features: ['Extra confidence challenges', 'Deeper skill building', 'Greater transformation'],
    icon: '🚀',
    recommended: false,
    color: '#FF9800',
  },
};

const ACT_1_QUESTS = {
  comfort: [
    { id: 'destination-research', name: 'Choose Your Destination', icon: '🗺️', description: 'Research and pick your first solo travel destination', maxSegments: 3, category: 'planning' },
    { id: 'budget-basics', name: 'Budget Foundations', icon: '💰', description: 'Create a simple trip budget that works for you', maxSegments: 2, category: 'planning' },
    { id: 'booking-first-stay', name: 'Book Your First Stay', icon: '🏨', description: 'Reserve your accommodation with confidence', maxSegments: 2, category: 'booking' },
    { id: 'packing-essentials', name: 'Pack Smart', icon: '🎒', description: 'Create your essential packing list', maxSegments: 3, category: 'preparation' },
    { id: 'safety-basics', name: 'Safety Prep', icon: '🛡️', description: 'Set up basic safety measures for peace of mind', maxSegments: 2, category: 'preparation' },
    { id: 'first-day-plan', name: 'First Day Blueprint', icon: '📋', description: 'Plan your arrival day to start stress-free', maxSegments: 2, category: 'planning' },
  ],
  stretch: [
    { id: 'solo-dining', name: 'Solo Dining Challenge', icon: '🍽️', description: 'Practice dining alone before your trip', maxSegments: 2, category: 'confidence' },
    { id: 'stranger-conversation', name: 'Conversation Starter', icon: '💬', description: 'Strike up a conversation with someone new', maxSegments: 2, category: 'confidence' },
  ],
};

// ============================================================
// ACT 2: Planning & Preparation
// ============================================================

const ACT_2_PROMPTS = [
  {
    id: 'booking_comfort',
    aiMessage: "Time to make it real! How do you feel about booking things?",
    options: [
      { id: 'nervous', label: 'A bit anxious', icon: '😰', value: 'nervous' },
      { id: 'okay', label: 'Ready for it', icon: '👍', value: 'okay' },
      { id: 'excited', label: 'Love this part!', icon: '🎉', value: 'excited' },
    ],
    allowFreeText: false,
  },
  {
    id: 'accommodation_style',
    aiMessage: "What type of accommodation appeals to you most?",
    options: [
      { id: 'hotel', label: 'Hotels', icon: '🏨', value: 'hotel' },
      { id: 'hostel', label: 'Hostels', icon: '🛏️', value: 'hostel' },
      { id: 'airbnb', label: 'Airbnb/Rentals', icon: '🏠', value: 'airbnb' },
      { id: 'mixed', label: 'Mix it up', icon: '🎲', value: 'mixed' },
    ],
    allowFreeText: false,
  },
  {
    id: 'itinerary_detail',
    aiMessage: "How detailed do you want your daily plans?",
    options: [
      { id: 'minimal', label: 'Just the basics', icon: '📝', value: 'minimal' },
      { id: 'moderate', label: 'Key activities set', icon: '📋', value: 'moderate' },
      { id: 'detailed', label: 'Hour by hour', icon: '⏰', value: 'detailed' },
    ],
    allowFreeText: false,
  },
  {
    id: 'packing_style',
    aiMessage: "How do you approach packing?",
    options: [
      { id: 'minimalist', label: 'Light packer', icon: '🎒', value: 'minimalist' },
      { id: 'prepared', label: 'Better prepared', icon: '🧳', value: 'prepared' },
      { id: 'everything', label: 'Bring it all', icon: '🛄', value: 'everything' },
    ],
    allowFreeText: false,
  },
  {
    id: 'flexibility',
    aiMessage: "How flexible are your travel dates?",
    options: [
      { id: 'fixed', label: 'Fixed dates', icon: '📅', value: 'fixed' },
      { id: 'somewhat', label: 'Some flexibility', icon: '🔄', value: 'somewhat' },
      { id: 'flexible', label: 'Very flexible', icon: '🌊', value: 'flexible' },
    ],
    allowFreeText: false,
  },
];

const ACT_2_CONSTRAINTS = {
  bookingComfort: {
    name: 'Booking Comfort',
    options: {
      nervous: { label: 'Guided', description: 'Step by step', icon: '😰' },
      okay: { label: 'Ready', description: 'Can handle it', icon: '👍' },
      excited: { label: 'Confident', description: 'Bring it on', icon: '🎉' },
    },
  },
  accommodationType: {
    name: 'Stay Type',
    options: {
      hotel: { label: 'Hotels', description: 'Traditional stays', icon: '🏨' },
      hostel: { label: 'Hostels', description: 'Social & budget', icon: '🛏️' },
      airbnb: { label: 'Rentals', description: 'Home-like stays', icon: '🏠' },
      mixed: { label: 'Mixed', description: 'Variety of stays', icon: '🎲' },
    },
  },
  itineraryDetail: {
    name: 'Plan Detail',
    options: {
      minimal: { label: 'Minimal', description: 'Just basics', icon: '📝' },
      moderate: { label: 'Moderate', description: 'Key activities', icon: '📋' },
      detailed: { label: 'Detailed', description: 'Hour by hour', icon: '⏰' },
    },
  },
  packingStyle: {
    name: 'Packing Style',
    options: {
      minimalist: { label: 'Light', description: 'Essentials only', icon: '🎒' },
      prepared: { label: 'Prepared', description: 'Well equipped', icon: '🧳' },
      everything: { label: 'Full', description: 'All options', icon: '🛄' },
    },
  },
  dateFlexibility: {
    name: 'Date Flexibility',
    options: {
      fixed: { label: 'Fixed', description: 'Set dates', icon: '📅' },
      somewhat: { label: 'Flexible', description: 'Some room', icon: '🔄' },
      flexible: { label: 'Open', description: 'Very flexible', icon: '🌊' },
    },
  },
};

const ACT_2_PLANS = {
  comfort: {
    id: 'comfort',
    name: 'Steady Prep',
    tagline: 'One step at a time',
    description: 'Methodical preparation with clear checkpoints along the way.',
    questCount: 4,
    features: ['Clear milestones', 'Manageable tasks', 'Built-in flexibility'],
    icon: '📋',
    recommended: true,
    color: '#8B7FD6',
  },
  stretch: {
    id: 'stretch',
    name: 'Deep Dive',
    tagline: 'Leave nothing to chance',
    description: 'Comprehensive preparation covering all the details.',
    questCount: 6,
    features: ['Thorough planning', 'Backup options', 'Expert-level prep'],
    icon: '🔍',
    recommended: false,
    color: '#FF9800',
  },
};

const ACT_2_QUESTS = {
  comfort: [
    { id: 'book-flights', name: 'Book Flights', icon: '🛫', description: 'Secure your travel tickets', maxSegments: 1, category: 'booking' },
    { id: 'reserve-stay', name: 'Reserve Accommodation', icon: '🏨', description: 'Find and book your stay', maxSegments: 1, category: 'booking' },
    { id: 'daily-itinerary', name: 'Plan Daily Itinerary', icon: '🗺️', description: 'Map out activities for each day', maxSegments: 5, category: 'planning' },
    { id: 'pack-essentials', name: 'Pack Essentials', icon: '🧳', description: 'Gather and pack everything you need', maxSegments: 3, category: 'preparation' },
  ],
  stretch: [
    { id: 'backup-plans', name: 'Backup Plans', icon: '🔄', description: 'Create plan B for key activities', maxSegments: 2, category: 'planning' },
    { id: 'local-contacts', name: 'Local Contacts', icon: '📞', description: 'Save important local numbers and contacts', maxSegments: 2, category: 'safety' },
  ],
};

// ============================================================
// ACT 3: The Journey Begins
// ============================================================

const ACT_3_PROMPTS = [
  {
    id: 'arrival_feeling',
    aiMessage: "You've arrived! How are you feeling right now?",
    options: [
      { id: 'overwhelmed', label: 'A bit overwhelmed', icon: '😵', value: 'overwhelmed' },
      { id: 'excited', label: 'Excited!', icon: '🎉', value: 'excited' },
      { id: 'calm', label: 'Calm and ready', icon: '😌', value: 'calm' },
    ],
    allowFreeText: false,
  },
  {
    id: 'social_preference',
    aiMessage: "How social do you want to be on this trip?",
    options: [
      { id: 'solo', label: 'Mostly solo', icon: '🧘', value: 'solo' },
      { id: 'mix', label: 'Mix of both', icon: '🎭', value: 'mix' },
      { id: 'social', label: 'Meet people', icon: '👋', value: 'social' },
    ],
    allowFreeText: false,
  },
  {
    id: 'documentation_style',
    aiMessage: "How do you want to capture memories?",
    options: [
      { id: 'minimal', label: 'Live in the moment', icon: '🧘', value: 'minimal' },
      { id: 'photos', label: 'Lots of photos', icon: '📸', value: 'photos' },
      { id: 'journal', label: 'Journal entries', icon: '📝', value: 'journal' },
      { id: 'both', label: 'Everything!', icon: '✨', value: 'both' },
    ],
    allowFreeText: false,
  },
  {
    id: 'food_adventure',
    aiMessage: "How adventurous are you with food?",
    options: [
      { id: 'familiar', label: 'Stick to familiar', icon: '🍕', value: 'familiar' },
      { id: 'some', label: 'Try some new things', icon: '🍜', value: 'some' },
      { id: 'all', label: 'Try everything!', icon: '🌶️', value: 'all' },
    ],
    allowFreeText: false,
  },
  {
    id: 'comfort_zone',
    aiMessage: "How far outside your comfort zone do you want to go?",
    options: [
      { id: 'safe', label: 'Stay comfortable', icon: '🛋️', value: 'safe' },
      { id: 'stretch', label: 'Gentle stretches', icon: '🌱', value: 'stretch' },
      { id: 'push', label: 'Push my limits', icon: '🔥', value: 'push' },
    ],
    allowFreeText: false,
  },
];

const ACT_3_CONSTRAINTS = {
  arrivalState: {
    name: 'Current State',
    options: {
      overwhelmed: { label: 'Adjusting', description: 'Taking it slow', icon: '😵' },
      excited: { label: 'Energized', description: 'Ready to explore', icon: '🎉' },
      calm: { label: 'Centered', description: 'In the zone', icon: '😌' },
    },
  },
  socialLevel: {
    name: 'Social Style',
    options: {
      solo: { label: 'Solo', description: 'Personal journey', icon: '🧘' },
      mix: { label: 'Balanced', description: 'Mix of both', icon: '🎭' },
      social: { label: 'Social', description: 'Connect with others', icon: '👋' },
    },
  },
  documentationStyle: {
    name: 'Memory Capture',
    options: {
      minimal: { label: 'Present', description: 'Live the moment', icon: '🧘' },
      photos: { label: 'Visual', description: 'Lots of photos', icon: '📸' },
      journal: { label: 'Written', description: 'Journal entries', icon: '📝' },
      both: { label: 'Everything', description: 'All methods', icon: '✨' },
    },
  },
  foodAdventure: {
    name: 'Food Style',
    options: {
      familiar: { label: 'Familiar', description: 'Safe choices', icon: '🍕' },
      some: { label: 'Curious', description: 'Try new things', icon: '🍜' },
      all: { label: 'Adventurous', description: 'Try everything', icon: '🌶️' },
    },
  },
  comfortZone: {
    name: 'Challenge Level',
    options: {
      safe: { label: 'Comfortable', description: 'Stay in zone', icon: '🛋️' },
      stretch: { label: 'Stretching', description: 'Gentle growth', icon: '🌱' },
      push: { label: 'Pushing', description: 'Full challenge', icon: '🔥' },
    },
  },
};

const ACT_3_PLANS = {
  comfort: {
    id: 'comfort',
    name: 'Mindful Journey',
    tagline: 'Quality over quantity',
    description: 'Focus on meaningful experiences without rushing.',
    questCount: 3,
    features: ['Curated experiences', 'Built-in rest', 'Deeper connections'],
    icon: '🧘',
    recommended: true,
    color: '#4CAF50',
  },
  stretch: {
    id: 'stretch',
    name: 'Full Adventure',
    tagline: 'Make every moment count',
    description: 'Pack in more experiences and challenges.',
    questCount: 5,
    features: ['More activities', 'Social challenges', 'Maximum memories'],
    icon: '🚀',
    recommended: false,
    color: '#FF9800',
  },
};

const ACT_3_QUESTS = {
  comfort: [
    { id: 'document-experiences', name: 'Document Experiences', icon: '📸', description: 'Capture photos and journal entries each day', maxSegments: 7, category: 'memory' },
    { id: 'try-local-cuisine', name: 'Try Local Cuisine', icon: '🍜', description: 'Taste authentic local dishes', maxSegments: 5, category: 'experience' },
    { id: 'connect-with-locals', name: 'Connect with Locals', icon: '🤝', description: 'Have meaningful conversations with people you meet', maxSegments: 3, category: 'social' },
  ],
  stretch: [
    { id: 'unexpected-adventure', name: 'Say Yes Challenge', icon: '🎲', description: 'Say yes to an unexpected opportunity', maxSegments: 2, category: 'growth' },
    { id: 'solo-activity', name: 'Solo Activity', icon: '🎭', description: 'Do something alone you normally wouldn\'t', maxSegments: 2, category: 'confidence' },
  ],
};

// ============================================================
// ACT 4: Return & Reflect
// ============================================================

const ACT_4_PROMPTS = [
  {
    id: 'return_feeling',
    aiMessage: "Welcome back! How does it feel to be home?",
    options: [
      { id: 'relieved', label: 'Relieved', icon: '😌', value: 'relieved' },
      { id: 'nostalgic', label: 'Missing it already', icon: '🥺', value: 'nostalgic' },
      { id: 'transformed', label: 'Changed somehow', icon: '✨', value: 'transformed' },
    ],
    allowFreeText: false,
  },
  {
    id: 'memory_priority',
    aiMessage: "What do you want to preserve most from this trip?",
    options: [
      { id: 'photos', label: 'Visual memories', icon: '📸', value: 'photos' },
      { id: 'stories', label: 'Stories to tell', icon: '📖', value: 'stories' },
      { id: 'lessons', label: 'Lessons learned', icon: '💡', value: 'lessons' },
      { id: 'connections', label: 'Connections made', icon: '🤝', value: 'connections' },
    ],
    allowFreeText: true,
  },
  {
    id: 'sharing_style',
    aiMessage: "How do you like to share your travel experiences?",
    options: [
      { id: 'private', label: 'Keep it private', icon: '🔒', value: 'private' },
      { id: 'close', label: 'Close friends/family', icon: '👨‍👩‍👧', value: 'close' },
      { id: 'social', label: 'Social media', icon: '📱', value: 'social' },
      { id: 'creative', label: 'Create something', icon: '🎨', value: 'creative' },
    ],
    allowFreeText: false,
  },
  {
    id: 'next_adventure',
    aiMessage: "How are you feeling about future solo trips?",
    options: [
      { id: 'hesitant', label: 'Need more time', icon: '🤔', value: 'hesitant' },
      { id: 'open', label: 'Open to it', icon: '👍', value: 'open' },
      { id: 'eager', label: 'Already planning!', icon: '🗺️', value: 'eager' },
    ],
    allowFreeText: false,
  },
];

const ACT_4_CONSTRAINTS = {
  returnFeeling: {
    name: 'Return State',
    options: {
      relieved: { label: 'Relieved', description: 'Good to be back', icon: '😌' },
      nostalgic: { label: 'Nostalgic', description: 'Missing the trip', icon: '🥺' },
      transformed: { label: 'Changed', description: 'Feel different', icon: '✨' },
    },
  },
  memoryPriority: {
    name: 'Memory Focus',
    options: {
      photos: { label: 'Visual', description: 'Photos & videos', icon: '📸' },
      stories: { label: 'Stories', description: 'Tales to tell', icon: '📖' },
      lessons: { label: 'Lessons', description: 'What you learned', icon: '💡' },
      connections: { label: 'People', description: 'Connections made', icon: '🤝' },
    },
  },
  sharingStyle: {
    name: 'Sharing Style',
    options: {
      private: { label: 'Private', description: 'Personal only', icon: '🔒' },
      close: { label: 'Close Circle', description: 'Family/friends', icon: '👨‍👩‍👧' },
      social: { label: 'Social', description: 'Share widely', icon: '📱' },
      creative: { label: 'Creative', description: 'Make something', icon: '🎨' },
    },
  },
  futureTrips: {
    name: 'Future Plans',
    options: {
      hesitant: { label: 'Processing', description: 'Need time', icon: '🤔' },
      open: { label: 'Open', description: 'Ready when right', icon: '👍' },
      eager: { label: 'Eager', description: 'Already planning', icon: '🗺️' },
    },
  },
};

const ACT_4_PLANS = {
  comfort: {
    id: 'comfort',
    name: 'Gentle Reflection',
    tagline: 'Process at your own pace',
    description: 'Take time to absorb and appreciate your journey.',
    questCount: 3,
    features: ['Thoughtful processing', 'Personal mementos', 'No pressure sharing'],
    icon: '🌸',
    recommended: true,
    color: '#9C27B0',
  },
  stretch: {
    id: 'stretch',
    name: 'Full Story',
    tagline: 'Capture everything',
    description: 'Create a comprehensive record of your adventure.',
    questCount: 5,
    features: ['Detailed organization', 'Creative projects', 'Share your journey'],
    icon: '📚',
    recommended: false,
    color: '#FF9800',
  },
};

const ACT_4_QUESTS = {
  comfort: [
    { id: 'organize-photos', name: 'Organize Photos', icon: '🖼️', description: 'Sort and edit your favorite shots', maxSegments: 3, category: 'memory' },
    { id: 'trip-summary', name: 'Write Trip Summary', icon: '✍️', description: 'Capture your overall experience in words', maxSegments: 1, category: 'reflection' },
    { id: 'share-highlights', name: 'Share Highlights', icon: '💬', description: 'Share your journey with friends and family', maxSegments: 2, category: 'sharing' },
  ],
  stretch: [
    { id: 'create-album', name: 'Create Photo Album', icon: '📔', description: 'Curate a beautiful photo collection', maxSegments: 2, category: 'creative' },
    { id: 'lessons-list', name: 'Lessons Learned', icon: '💡', description: 'Document what you learned for next time', maxSegments: 2, category: 'growth' },
  ],
};

// ============================================================
// UNIFIED DATA STRUCTURE
// ============================================================

export const ACT_BRIEFING_DATA = {
  'chapter-1': {
    actNumber: 1,
    title: 'The Call to Travel',
    subtitle: 'Begin your journey',
    icon: '🌍',
    gradientColors: {
      chat: ['#5B9FED', '#4A90E2', '#3B7DD8', '#2E6BC4'],
      brief: ['#8B7FD6', '#7B6FC6', '#6B5FB6', '#5B4FA6'],
      plan: ['#4CAF50', '#43A047', '#388E3C', '#2E7D32'],
    },
    prompts: ACT_1_PROMPTS,
    constraints: ACT_1_CONSTRAINTS,
    constraintOrder: ['tripSize', 'spendVibe', 'soloConfidence', 'planningEnergy', 'structure'],
    plans: ACT_1_PLANS,
    quests: ACT_1_QUESTS,
    thinkingMessages: [
      { delay: 0, text: 'Analyzing your preferences...' },
      { delay: 800, text: 'Crafting personalized quests...' },
      { delay: 1600, text: 'Balancing challenge levels...' },
      { delay: 2400, text: 'Finalizing your adventure...' },
    ],
    promptMapping: {
      timeline: 'tripSize',
      budget_vibe: 'spendVibe',
      confidence: 'soloConfidence',
      planning_energy: 'planningEnergy',
      style: 'structure',
    },
    valueMapping: {
      timeline: { weekend: 'mini', week: 'standard', extended: 'big' },
      budget_vibe: { save: 'save', balanced: 'balanced', treat: 'treat' },
      confidence: { nervous: 'nervous', ready: 'ready', bold: 'bold' },
      planning_energy: { low: 'low', med: 'med', high: 'high' },
      style: { planned: 'planned', flexible: 'flexible', spontaneous: 'spontaneous' },
    },
  },
  'chapter-2': {
    actNumber: 2,
    title: 'Planning & Preparation',
    subtitle: 'Make it real',
    icon: '📋',
    gradientColors: {
      chat: ['#8B7FD6', '#7B6FC6', '#6B5FB6', '#5B4FA6'],
      brief: ['#6B8E9F', '#5B7E8F', '#4B6E7F', '#3B5E6F'],
      plan: ['#4CAF50', '#43A047', '#388E3C', '#2E7D32'],
    },
    prompts: ACT_2_PROMPTS,
    constraints: ACT_2_CONSTRAINTS,
    constraintOrder: ['bookingComfort', 'accommodationType', 'itineraryDetail', 'packingStyle', 'dateFlexibility'],
    plans: ACT_2_PLANS,
    quests: ACT_2_QUESTS,
    thinkingMessages: [
      { delay: 0, text: 'Understanding your prep style...' },
      { delay: 800, text: 'Building your preparation plan...' },
      { delay: 1600, text: 'Setting up milestones...' },
      { delay: 2400, text: 'Finalizing your prep quests...' },
    ],
    promptMapping: {
      booking_comfort: 'bookingComfort',
      accommodation_style: 'accommodationType',
      itinerary_detail: 'itineraryDetail',
      packing_style: 'packingStyle',
      flexibility: 'dateFlexibility',
    },
    valueMapping: {
      booking_comfort: { nervous: 'nervous', okay: 'okay', excited: 'excited' },
      accommodation_style: { hotel: 'hotel', hostel: 'hostel', airbnb: 'airbnb', mixed: 'mixed' },
      itinerary_detail: { minimal: 'minimal', moderate: 'moderate', detailed: 'detailed' },
      packing_style: { minimalist: 'minimalist', prepared: 'prepared', everything: 'everything' },
      flexibility: { fixed: 'fixed', somewhat: 'somewhat', flexible: 'flexible' },
    },
  },
  'chapter-3': {
    actNumber: 3,
    title: 'The Journey Begins',
    subtitle: 'Live your adventure',
    icon: '🚀',
    gradientColors: {
      chat: ['#4CAF50', '#43A047', '#388E3C', '#2E7D32'],
      brief: ['#FF9800', '#F57C00', '#EF6C00', '#E65100'],
      plan: ['#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A'],
    },
    prompts: ACT_3_PROMPTS,
    constraints: ACT_3_CONSTRAINTS,
    constraintOrder: ['arrivalState', 'socialLevel', 'documentationStyle', 'foodAdventure', 'comfortZone'],
    plans: ACT_3_PLANS,
    quests: ACT_3_QUESTS,
    thinkingMessages: [
      { delay: 0, text: 'Sensing your adventure vibe...' },
      { delay: 800, text: 'Crafting your experience quests...' },
      { delay: 1600, text: 'Adding the right challenges...' },
      { delay: 2400, text: 'Your journey awaits...' },
    ],
    promptMapping: {
      arrival_feeling: 'arrivalState',
      social_preference: 'socialLevel',
      documentation_style: 'documentationStyle',
      food_adventure: 'foodAdventure',
      comfort_zone: 'comfortZone',
    },
    valueMapping: {
      arrival_feeling: { overwhelmed: 'overwhelmed', excited: 'excited', calm: 'calm' },
      social_preference: { solo: 'solo', mix: 'mix', social: 'social' },
      documentation_style: { minimal: 'minimal', photos: 'photos', journal: 'journal', both: 'both' },
      food_adventure: { familiar: 'familiar', some: 'some', all: 'all' },
      comfort_zone: { safe: 'safe', stretch: 'stretch', push: 'push' },
    },
  },
  'chapter-4': {
    actNumber: 4,
    title: 'Return & Reflect',
    subtitle: 'Preserve your story',
    icon: '🏠',
    gradientColors: {
      chat: ['#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A'],
      brief: ['#607D8B', '#546E7A', '#455A64', '#37474F'],
      plan: ['#E91E63', '#D81B60', '#C2185B', '#AD1457'],
    },
    prompts: ACT_4_PROMPTS,
    constraints: ACT_4_CONSTRAINTS,
    constraintOrder: ['returnFeeling', 'memoryPriority', 'sharingStyle', 'futureTrips'],
    plans: ACT_4_PLANS,
    quests: ACT_4_QUESTS,
    thinkingMessages: [
      { delay: 0, text: 'Reflecting on your journey...' },
      { delay: 800, text: 'Creating your memory plan...' },
      { delay: 1600, text: 'Adding reflection activities...' },
      { delay: 2400, text: 'Your story awaits...' },
    ],
    promptMapping: {
      return_feeling: 'returnFeeling',
      memory_priority: 'memoryPriority',
      sharing_style: 'sharingStyle',
      next_adventure: 'futureTrips',
    },
    valueMapping: {
      return_feeling: { relieved: 'relieved', nostalgic: 'nostalgic', transformed: 'transformed' },
      memory_priority: { photos: 'photos', stories: 'stories', lessons: 'lessons', connections: 'connections' },
      sharing_style: { private: 'private', close: 'close', social: 'social', creative: 'creative' },
      next_adventure: { hesitant: 'hesitant', open: 'open', eager: 'eager' },
    },
  },
};

/**
 * Get briefing data for a specific chapter
 * @param {string} chapterId - e.g., 'chapter-1', 'chapter-2'
 * @returns {Object} - The briefing data for that chapter
 */
export const getBriefingData = (chapterId) => {
  return ACT_BRIEFING_DATA[chapterId] || ACT_BRIEFING_DATA['chapter-1'];
};

/**
 * Map chat responses to constraints for a specific chapter
 * @param {string} chapterId
 * @param {Object} chatResponses
 * @returns {Object} - Mapped constraints
 */
export const mapResponsesToConstraints = (chapterId, chatResponses) => {
  const actData = getBriefingData(chapterId);
  const constraints = {};

  Object.entries(chatResponses).forEach(([promptId, selectedValue]) => {
    const constraintName = actData.promptMapping[promptId];

    if (constraintName) {
      const mapping = actData.valueMapping[promptId];
      if (mapping && mapping[selectedValue]) {
        constraints[constraintName] = mapping[selectedValue];
      } else {
        constraints[constraintName] = selectedValue;
      }
    }
  });

  return constraints;
};

/**
 * Generate quests for a specific chapter and plan
 * @param {string} chapterId
 * @param {string} planId - 'comfort' or 'stretch'
 * @param {Object} constraints
 * @returns {Array} - Generated quests
 */
export const generateQuestsForAct = (chapterId, planId, constraints) => {
  const actData = getBriefingData(chapterId);

  let quests = [...actData.quests.comfort];

  if (planId === 'stretch') {
    quests = [...quests, ...actData.quests.stretch];
  }

  // Initialize quest progress
  quests = quests.map(quest => ({
    ...quest,
    completedSegments: 0,
  }));

  return quests;
};

/**
 * Get default constraints for a chapter
 * @param {string} chapterId
 * @returns {Object}
 */
export const getDefaultConstraints = (chapterId) => {
  const actData = getBriefingData(chapterId);
  const defaults = {};

  actData.constraintOrder.forEach(constraintName => {
    const constraint = actData.constraints[constraintName];
    const optionKeys = Object.keys(constraint.options);
    // Default to the middle option
    defaults[constraintName] = optionKeys[Math.floor(optionKeys.length / 2)];
  });

  return defaults;
};

export default ACT_BRIEFING_DATA;
