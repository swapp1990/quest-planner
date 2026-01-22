// Quest action questions - one question per segment for each quest

export const QUEST_ACTIONS = {
  // Act 1: The Call to Travel
  'quest-1-1': {
    // Research Destinations (3 segments)
    name: 'Research Destinations',
    actions: [
      {
        question: 'What destination are you considering?',
        placeholder: 'e.g., Japan, Portugal, Thailand...',
        hint: 'Name a place that excites you',
      },
      {
        question: 'What about this destination interests you?',
        placeholder: 'e.g., the food, culture, nature...',
        hint: 'What draws you to explore here',
      },
      {
        question: 'Name one more destination on your list',
        placeholder: 'e.g., New Zealand, Morocco...',
        hint: 'Keep your options open',
      },
    ],
  },
  'quest-1-2': {
    // Set Travel Dates (1 segment)
    name: 'Set Travel Dates',
    actions: [
      {
        question: 'When do you plan to travel?',
        placeholder: 'e.g., March 15-22, 2026',
        hint: 'Pick your ideal window',
      },
    ],
  },
  'quest-1-3': {
    // Create Budget Plan (4 segments)
    name: 'Create Budget Plan',
    actions: [
      {
        question: 'What is your total trip budget?',
        placeholder: 'e.g., $2,000',
        hint: 'A rough estimate is fine',
      },
      {
        question: 'How much for flights?',
        placeholder: 'e.g., $600',
        hint: 'Check some prices online',
      },
      {
        question: 'How much for accommodation?',
        placeholder: 'e.g., $800',
        hint: 'Hotels, hostels, or Airbnb',
      },
      {
        question: 'How much for food and activities?',
        placeholder: 'e.g., $600',
        hint: 'Daily expenses add up',
      },
    ],
  },

  // Act 2: Planning & Preparation
  'quest-2-1': {
    // Book Flights (1 segment)
    name: 'Book Flights',
    actions: [
      {
        question: 'Which flight did you book?',
        placeholder: 'e.g., United LAX→TYO, Mar 15',
        hint: 'Airline and route',
      },
    ],
  },
  'quest-2-2': {
    // Reserve Accommodation (1 segment)
    name: 'Reserve Accommodation',
    actions: [
      {
        question: 'Where will you stay?',
        placeholder: 'e.g., Shinjuku Hotel, Tokyo',
        hint: 'Name and location',
      },
    ],
  },
  'quest-2-3': {
    // Plan Daily Itinerary (5 segments)
    name: 'Plan Daily Itinerary',
    actions: [
      {
        question: 'Day 1 plan?',
        placeholder: 'e.g., Arrive, check in, explore neighborhood',
        hint: 'Keep it light on arrival',
      },
      {
        question: 'Day 2 plan?',
        placeholder: 'e.g., Visit temples, local market',
        hint: 'Main attractions',
      },
      {
        question: 'Day 3 plan?',
        placeholder: 'e.g., Day trip to nearby town',
        hint: 'Explore beyond',
      },
      {
        question: 'Day 4 plan?',
        placeholder: 'e.g., Food tour, shopping',
        hint: 'Cultural experiences',
      },
      {
        question: 'Day 5+ plan?',
        placeholder: 'e.g., Flexible day, departure prep',
        hint: 'Leave room for spontaneity',
      },
    ],
  },
  'quest-2-4': {
    // Pack Essentials (3 segments)
    name: 'Pack Essentials',
    actions: [
      {
        question: 'What clothing are you packing?',
        placeholder: 'e.g., 5 shirts, 2 pants, jacket...',
        hint: 'Check the weather',
      },
      {
        question: 'What tech/documents?',
        placeholder: 'e.g., Passport, adapter, phone charger',
        hint: 'The essentials',
      },
      {
        question: 'Any special items?',
        placeholder: 'e.g., Camera, journal, snacks',
        hint: 'Things that make travel better',
      },
    ],
  },

  // Act 3: The Journey Begins
  'quest-3-1': {
    // Document Experiences (7 segments)
    name: 'Document Experiences',
    actions: [
      { question: 'Day 1 highlight?', placeholder: 'What stood out today...', hint: 'First impressions' },
      { question: 'Day 2 highlight?', placeholder: 'A moment worth remembering...', hint: 'Keep capturing' },
      { question: 'Day 3 highlight?', placeholder: 'Something unexpected...', hint: 'The surprises' },
      { question: 'Day 4 highlight?', placeholder: 'A favorite experience...', hint: 'What you loved' },
      { question: 'Day 5 highlight?', placeholder: 'A learning moment...', hint: 'Travel teaches' },
      { question: 'Day 6 highlight?', placeholder: 'A connection made...', hint: 'People you met' },
      { question: 'Day 7 highlight?', placeholder: 'Final memories...', hint: 'Wrap it up' },
    ],
  },
  'quest-3-2': {
    // Try Local Cuisine (5 segments)
    name: 'Try Local Cuisine',
    actions: [
      { question: 'First local dish?', placeholder: 'e.g., Ramen at a tiny shop', hint: 'What did you try?' },
      { question: 'Second discovery?', placeholder: 'e.g., Street food from a vendor', hint: 'Keep exploring' },
      { question: 'Third taste?', placeholder: 'e.g., Traditional breakfast', hint: 'Morning flavors' },
      { question: 'Fourth flavor?', placeholder: 'e.g., Local dessert or snack', hint: 'Sweet treats' },
      { question: 'Best meal of the trip?', placeholder: 'e.g., Omakase dinner', hint: 'The memorable one' },
    ],
  },
  'quest-3-3': {
    // Connect with Locals (3 segments)
    name: 'Connect with Locals',
    actions: [
      { question: 'First conversation?', placeholder: 'e.g., Chat with cafe owner', hint: 'Break the ice' },
      { question: 'Second connection?', placeholder: 'e.g., Fellow traveler from...', hint: 'Shared experiences' },
      { question: 'Meaningful exchange?', placeholder: 'e.g., Local showed me around', hint: 'Deeper connection' },
    ],
  },

  // Act 4: Return & Reflect
  'quest-4-1': {
    // Organize Photos (3 segments)
    name: 'Organize Photos',
    actions: [
      { question: 'How many photos did you take?', placeholder: 'e.g., About 500', hint: 'Rough count' },
      { question: 'Favorite photo?', placeholder: 'Describe it briefly...', hint: 'The one you love' },
      { question: 'Album created?', placeholder: 'e.g., "Japan 2026" on Google Photos', hint: 'Where you saved them' },
    ],
  },
  'quest-4-2': {
    // Write Trip Summary (1 segment)
    name: 'Write Trip Summary',
    actions: [
      {
        question: 'Sum up your trip in one sentence',
        placeholder: 'e.g., A week of discovery and delicious food',
        hint: 'Capture the essence',
      },
    ],
  },
  'quest-4-3': {
    // Share Highlights (2 segments)
    name: 'Share Highlights',
    actions: [
      { question: 'Who did you share with first?', placeholder: 'e.g., Posted on Instagram', hint: 'Start sharing' },
      { question: 'What was their reaction?', placeholder: 'e.g., Friends want to visit too!', hint: 'The feedback' },
    ],
  },
};

// Get action for a specific quest and segment
export const getQuestAction = (questId, segmentIndex) => {
  const quest = QUEST_ACTIONS[questId];
  if (!quest || !quest.actions[segmentIndex]) {
    return {
      question: 'What did you accomplish?',
      placeholder: 'Describe your progress...',
      hint: 'Keep going!',
    };
  }
  return quest.actions[segmentIndex];
};
