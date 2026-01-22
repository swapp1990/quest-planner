// Solo Trip Campaign Definition

export const SOLO_TRIP_CAMPAIGN = {
  templateId: 'solo-trip',
  name: 'Solo Trip',
  description: 'Plan and execute your perfect solo adventure. From dreaming to returning home with unforgettable memories.',
  icon: '✈️',
  color: '#5B9FED',
  chapters: [
    {
      order: 1,
      title: 'The Call to Travel',
      subtitle: 'Act 1',
      description: 'Every journey begins with a spark of wanderlust. Research, dream, and set the foundation for your adventure.',
      icon: '🌍',
      quests: [
        {
          order: 1,
          name: 'Research Destinations',
          description: 'Explore 3 potential destinations that excite you',
          icon: '🔍',
          maxSegments: 3,
        },
        {
          order: 2,
          name: 'Set Travel Dates',
          description: 'Pick your departure and return dates',
          icon: '📅',
          maxSegments: 1,
        },
        {
          order: 3,
          name: 'Create Budget Plan',
          description: 'Plan your finances for flights, stay, food, and activities',
          icon: '💰',
          maxSegments: 4,
        },
      ],
    },
    {
      order: 2,
      title: 'Planning & Preparation',
      subtitle: 'Act 2',
      description: 'Turn your dreams into concrete plans. Book, prepare, and get ready for takeoff.',
      icon: '📋',
      quests: [
        {
          order: 1,
          name: 'Book Flights',
          description: 'Secure your travel tickets',
          icon: '🛫',
          maxSegments: 1,
        },
        {
          order: 2,
          name: 'Reserve Accommodation',
          description: 'Find and book your stay',
          icon: '🏨',
          maxSegments: 1,
        },
        {
          order: 3,
          name: 'Plan Daily Itinerary',
          description: 'Map out activities for each day of your trip',
          icon: '🗺️',
          maxSegments: 5,
        },
        {
          order: 4,
          name: 'Pack Essentials',
          description: 'Gather and pack everything you need',
          icon: '🧳',
          maxSegments: 3,
        },
      ],
    },
    {
      order: 3,
      title: 'The Journey Begins',
      subtitle: 'Act 3',
      description: 'You\'re on your way! Embrace every moment, taste new flavors, and connect with the world.',
      icon: '🚀',
      quests: [
        {
          order: 1,
          name: 'Document Experiences',
          description: 'Capture photos and journal entries each day',
          icon: '📸',
          maxSegments: 7,
        },
        {
          order: 2,
          name: 'Try Local Cuisine',
          description: 'Taste authentic local dishes',
          icon: '🍜',
          maxSegments: 5,
        },
        {
          order: 3,
          name: 'Connect with Locals',
          description: 'Have meaningful conversations with people you meet',
          icon: '🤝',
          maxSegments: 3,
        },
      ],
    },
    {
      order: 4,
      title: 'Return & Reflect',
      subtitle: 'Act 4',
      description: 'The adventure lives on through your memories. Organize, reflect, and share your story.',
      icon: '🏠',
      quests: [
        {
          order: 1,
          name: 'Organize Photos',
          description: 'Sort and edit your favorite shots',
          icon: '🖼️',
          maxSegments: 3,
        },
        {
          order: 2,
          name: 'Write Trip Summary',
          description: 'Capture your overall experience in words',
          icon: '✍️',
          maxSegments: 1,
        },
        {
          order: 3,
          name: 'Share Highlights',
          description: 'Share your journey with friends and family',
          icon: '💬',
          maxSegments: 2,
        },
      ],
    },
  ],
};

// Available campaigns (for future expansion)
export const AVAILABLE_CAMPAIGNS = [
  SOLO_TRIP_CAMPAIGN,
];
