import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

const { height } = Dimensions.get('window');

// Animated quest info card
const QuestInfoCard = ({ quest, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.questCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.questIconContainer}>
        <Text style={styles.questIcon}>{quest.icon}</Text>
      </View>
      <View style={styles.questContent}>
        <Text style={styles.questName}>{quest.name}</Text>
        <Text style={styles.questDescription}>{quest.description}</Text>
        <View style={styles.questMeta}>
          <View style={styles.segmentBadge}>
            <Text style={styles.segmentText}>
              {quest.maxSegments} {quest.maxSegments === 1 ? 'step' : 'steps'}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const QuestInfoModal = ({ chapter, onDismiss, isFirstTime = false }) => {
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(height)).current;

  const quests = chapter?.quests || [];

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(contentAnim, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouch}
          onPress={handleDismiss}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ translateY: contentAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#8B7FD6', '#7B6FC6', '#6B5FB6', '#5B4FA6']}
          style={styles.content}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.header}>
              {isFirstTime && (
                <View style={styles.firstTimeBadge}>
                  <Text style={styles.firstTimeBadgeText}>NEW ACT</Text>
                </View>
              )}
              <Text style={styles.title}>Your Quests</Text>
              <Text style={styles.subtitle}>
                {chapter?.subtitle}: {chapter?.title}
              </Text>
              <Text style={styles.description}>
                {isFirstTime
                  ? 'Tap on any quest circle to make progress. Complete all quests to unlock the next act!'
                  : 'Here are all the quests for this act. Tap the quest circles on the main screen to track your progress.'}
              </Text>
            </View>

            {/* Quest list */}
            <ScrollView
              style={styles.questList}
              contentContainerStyle={styles.questListContent}
              showsVerticalScrollIndicator={false}
            >
              {quests.map((quest, index) => (
                <QuestInfoCard
                  key={quest.id || index}
                  quest={quest}
                  index={index}
                />
              ))}
            </ScrollView>

            {/* Dismiss button */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={handleDismiss}
                activeOpacity={0.8}
              >
                <Text style={styles.dismissButtonText}>
                  {isFirstTime ? 'GOT IT!' : 'CLOSE'}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  overlayTouch: {
    flex: 1,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.85,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
  },
  firstTimeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  firstTimeBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  questList: {
    flex: 1,
  },
  questListContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  questCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  questIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(139, 127, 214, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  questIcon: {
    fontSize: 28,
  },
  questContent: {
    flex: 1,
  },
  questName: {
    color: '#333',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  questDescription: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  questMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentBadge: {
    backgroundColor: 'rgba(139, 127, 214, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  segmentText: {
    color: '#6B5FB6',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  dismissButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default QuestInfoModal;
