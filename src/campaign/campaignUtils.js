// Pure utility functions for campaign logic

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Check if a quest is completed
 */
export const isQuestComplete = (quest) => {
  return quest.completedSegments >= quest.maxSegments;
};

/**
 * Check if all quests in a chapter are completed
 */
export const isChapterComplete = (chapter) => {
  if (!chapter.quests || chapter.quests.length === 0) return false;
  return chapter.quests.every(quest => isQuestComplete(quest));
};

/**
 * Get chapter progress as percentage
 */
export const getChapterProgress = (chapter) => {
  if (!chapter.quests || chapter.quests.length === 0) return 0;

  const totalSegments = chapter.quests.reduce((sum, q) => sum + q.maxSegments, 0);
  const completedSegments = chapter.quests.reduce((sum, q) => sum + q.completedSegments, 0);

  return totalSegments > 0 ? (completedSegments / totalSegments) * 100 : 0;
};

/**
 * Get completed quest count for a chapter
 */
export const getCompletedQuestCount = (chapter) => {
  if (!chapter.quests) return 0;
  return chapter.quests.filter(q => isQuestComplete(q)).length;
};

/**
 * Check if a chapter should be locked
 * A chapter is locked if the previous chapter is not completed
 */
export const isChapterLocked = (chapters, chapterIndex) => {
  if (chapterIndex === 0) return false; // First chapter is always unlocked

  const previousChapter = chapters[chapterIndex - 1];
  return !isChapterComplete(previousChapter);
};

/**
 * Get overall campaign progress
 */
export const getCampaignProgress = (campaign) => {
  if (!campaign.chapters || campaign.chapters.length === 0) return 0;

  const totalQuests = campaign.chapters.reduce(
    (sum, ch) => sum + (ch.quests?.length || 0),
    0
  );
  const completedQuests = campaign.chapters.reduce(
    (sum, ch) => sum + getCompletedQuestCount(ch),
    0
  );

  return totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;
};

/**
 * Check if entire campaign is completed
 */
export const isCampaignComplete = (campaign) => {
  if (!campaign.chapters || campaign.chapters.length === 0) return false;
  return campaign.chapters.every(chapter => isChapterComplete(chapter));
};

/**
 * Increment quest progress by one segment
 */
export const incrementQuestProgress = (quest) => {
  if (isQuestComplete(quest)) return quest;

  return {
    ...quest,
    completedSegments: quest.completedSegments + 1,
  };
};

/**
 * Initialize a campaign with default progress values
 */
export const initializeCampaign = (campaignTemplate) => {
  return {
    ...campaignTemplate,
    id: generateId(),
    startedAt: new Date().toISOString(),
    completedAt: null,
    chapters: campaignTemplate.chapters.map((chapter, chapterIndex) => ({
      ...chapter,
      // Use consistent chapter IDs based on order for onboarding data mapping
      id: `chapter-${chapter.order}`,
      quests: chapter.quests.map((quest, questIndex) => ({
        ...quest,
        id: `quest-${chapter.order}-${quest.order}`,
        completedSegments: 0,
      })),
    })),
  };
};
