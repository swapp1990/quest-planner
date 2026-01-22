import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import MemoryStamp from './MemoryStamp';
import MemoryStampModal from './MemoryStampModal';
import { generateStamp, getStampInsights } from './stampGenerator';

// TEST MODE: Set to true to show first 2 stamps as earned for visual testing
const TEST_MODE = true;
const TEST_ANSWERS = {
  'chapter-1': [0, 2, 2, 0, 1], // explore + push = "Bold Explorer"
  'chapter-2': [3, 1, 0, 1, 2], // deals + minimalist = "Deal Hunter"
};

/**
 * MemoryShelf - Horizontal row of memory stamps
 * Shows all 4 act stamps with their current state
 */
const MemoryShelf = ({
  chapters,
  actOnboardingState,
  isChapterComplete,
  checkChapterLocked,
}) => {
  const [selectedStamp, setSelectedStamp] = useState(null);

  const handleStampPress = (stamp, chapterIndex) => {
    const insights = getStampInsights(stamp.chapterId, stamp.answers);
    setSelectedStamp({
      ...stamp,
      insights,
      chapterNumber: chapterIndex + 1,
    });
  };

  const handleCloseModal = () => {
    setSelectedStamp(null);
  };

  // Count earned stamps
  const earnedCount = chapters.filter((ch, idx) => {
    if (TEST_MODE && idx < 2) return true; // Test: first 2 earned
    const isComplete = isChapterComplete(ch);
    const hasAnswers = actOnboardingState[ch.id]?.answers;
    return isComplete && hasAnswers;
  }).length;

  return (
    <View style={styles.container}>
      {/* Section header - inline with count */}
      <View style={styles.header}>
        <Text style={styles.title}>MEMORIES</Text>
        <Text style={styles.count}>({earnedCount}/{chapters.length})</Text>
      </View>

      {/* Stamps row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stampsRow}
      >
        {chapters.map((chapter, index) => {
          // TEST MODE: Override for first 2 stamps
          const isTestEarned = TEST_MODE && index < 2;
          const testAnswers = TEST_ANSWERS[chapter.id];

          const isLocked = isTestEarned ? false : checkChapterLocked(index);
          const isComplete = isTestEarned ? true : isChapterComplete(chapter);
          const onboardingData = actOnboardingState[chapter.id];
          const hasAnswers = isTestEarned ? true : !!onboardingData?.answers;
          const answers = isTestEarned ? testAnswers : onboardingData?.answers;

          // Generate stamp data if we have answers
          const stamp = hasAnswers
            ? generateStamp(chapter.id, answers)
            : {
                chapterId: chapter.id,
                actName: chapter.subtitle || `Act ${index + 1}`,
                actIcon: chapter.icon,
                label: null,
              };

          const isEarned = isComplete && hasAnswers;

          return (
            <View key={chapter.id} style={styles.stampWrapper}>
              <MemoryStamp
                actNumber={index + 1}
                actName={stamp.actName}
                actIcon={stamp.actIcon}
                label={stamp.label}
                isLocked={isLocked}
                isEarned={isEarned}
                onPress={isEarned ? () => handleStampPress(stamp, index) : undefined}
              />
            </View>
          );
        })}
      </ScrollView>

      {/* Expanded stamp modal */}
      <MemoryStampModal
        visible={selectedStamp !== null}
        stamp={selectedStamp}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  count: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 8,
  },
  stampsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  stampWrapper: {},
});

export default MemoryShelf;
