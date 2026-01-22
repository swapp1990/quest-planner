import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const EMOJI_CATEGORIES = {
  Exercise: ['🏃', '🚴', '🏋️', '🧘', '🏊', '⚽', '🏀', '🎾', '🥊', '🤸'],
  Food: ['🥗', '🥕', '🍎', '🥦', '🫐', '🍊', '🥑', '🥤', '☕', '💧'],
  'Self-Care': ['🪥', '🛀', '💤', '🧖', '💆', '🧴', '💅', '🧘‍♀️', '🌸', '✨'],
  Work: ['💼', '💻', '📚', '✍️', '📝', '📖', '🎯', '🏆', '💡', '🎨'],
  Activities: ['🎵', '🎮', '🎬', '📷', '🎸', '🎭', '🎪', '🎲', '🧩', '🪴'],
  Other: ['⭐', '❤️', '🔥', '💪', '🌟', '🎉', '🚀', '🏠', '🌈', '☀️'],
};

const EmojiPicker = ({ selectedEmoji, onEmojiSelect }) => {
  const [activeCategory, setActiveCategory] = useState('Exercise');

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {Object.keys(EMOJI_CATEGORIES).map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              activeCategory === category && styles.categoryTabActive,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Emoji Grid */}
      <View style={styles.emojiGrid}>
        {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
          <TouchableOpacity
            key={`${emoji}-${index}`}
            style={[
              styles.emojiTile,
              selectedEmoji === emoji && styles.emojiTileSelected,
            ]}
            onPress={() => onEmojiSelect(emoji)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryContent: {
    paddingRight: 12,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryTabActive: {
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  categoryTextActive: {
    color: '#C96FB9',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiTile: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiTileSelected: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  emoji: {
    fontSize: 28,
  },
});

export default EmojiPicker;
