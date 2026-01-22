import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { getQuestionsForChapter, THINKING_MESSAGES } from '../campaign';

const { width, height } = Dimensions.get('window');

// Phases of the onboarding flow
const PHASES = {
  QUESTIONS: 'questions',
  THINKING: 'thinking',
  REVEAL: 'reveal',
};

// Pulsing dot animation for AI thinking
const PulsingDot = ({ delay = 0 }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.pulsingDot,
        {
          opacity: pulseAnim,
          transform: [
            {
              scale: pulseAnim.interpolate({
                inputRange: [0.3, 1],
                outputRange: [0.8, 1.2],
              }),
            },
          ],
        },
      ]}
    />
  );
};

// Animated thinking message
const ThinkingMessage = ({ text, isVisible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isVisible) {
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
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.Text
      style={[
        styles.thinkingText,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {text}
    </Animated.Text>
  );
};

// Animated quest card for reveal phase
const AnimatedQuestCard = ({ quest, index, startAnimation }) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (startAnimation) {
      Animated.sequence([
        Animated.delay(index * 400),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 6,
            tension: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      });
    }
  }, [startAnimation]);

  return (
    <Animated.View
      style={[
        styles.questRevealCard,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Text style={styles.questRevealIcon}>{quest.icon}</Text>
      <View style={styles.questRevealInfo}>
        <Text style={styles.questRevealName}>{quest.name}</Text>
        <Text style={styles.questRevealSegments}>
          {quest.maxSegments} {quest.maxSegments === 1 ? 'step' : 'steps'}
        </Text>
      </View>
    </Animated.View>
  );
};

const ActOnboardingModal = ({ chapter, onComplete, onClose }) => {
  const [phase, setPhase] = useState(PHASES.QUESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [startRevealAnimation, setStartRevealAnimation] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Get questions for this chapter
  const questionsData = getQuestionsForChapter(chapter.id);
  const questions = questionsData.questions;
  const quests = chapter.quests || [];

  // Progress through thinking messages
  useEffect(() => {
    if (phase === PHASES.THINKING) {
      THINKING_MESSAGES.forEach((msg, index) => {
        setTimeout(() => {
          setVisibleMessages((prev) => [...prev, index]);
        }, msg.delay);
      });

      // Move to reveal phase after all messages
      setTimeout(() => {
        transitionToPhase(PHASES.REVEAL);
      }, 3200);
    }
  }, [phase]);

  // Start reveal animation when entering reveal phase
  useEffect(() => {
    if (phase === PHASES.REVEAL) {
      setTimeout(() => {
        setStartRevealAnimation(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 300);
    }
  }, [phase]);

  const transitionToPhase = (newPhase) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPhase(newPhase);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleOptionSelect = (optionIndex) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      // Animate to next question
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestion(currentQuestion + 1);
        slideAnim.setValue(width);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // All questions answered, move to thinking phase
      transitionToPhase(PHASES.THINKING);
    }
  };

  const handleStartAct = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete(answers);
  };

  // Render question phase
  const renderQuestionsPhase = () => {
    const question = questions[currentQuestion];

    return (
      <Animated.View
        style={[styles.phaseContainer, { opacity: fadeAnim }]}
      >
        <View style={styles.questionHeader}>
          <Text style={styles.phaseTitle}>{questionsData.title}</Text>
          <Text style={styles.phaseSubtitle}>{questionsData.subtitle}</Text>
        </View>

        <Animated.View
          style={[
            styles.questionContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Text style={styles.questionText}>{question.question}</Text>

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionButton}
                onPress={() => handleOptionSelect(index)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Progress dots */}
        <View style={styles.progressDots}>
          {questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentQuestion && styles.progressDotActive,
                index < currentQuestion && styles.progressDotCompleted,
              ]}
            />
          ))}
        </View>
      </Animated.View>
    );
  };

  // Render thinking phase
  const renderThinkingPhase = () => (
    <Animated.View
      style={[styles.phaseContainer, styles.thinkingPhase, { opacity: fadeAnim }]}
    >
      <View style={styles.thinkingContent}>
        <View style={styles.pulsingDotsContainer}>
          <PulsingDot delay={0} />
          <PulsingDot delay={150} />
          <PulsingDot delay={300} />
        </View>

        <Text style={styles.thinkingTitle}>Creating Your Quests</Text>

        <View style={styles.thinkingMessages}>
          {THINKING_MESSAGES.map((msg, index) => (
            <ThinkingMessage
              key={index}
              text={msg.text}
              isVisible={visibleMessages.includes(index)}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );

  // Render reveal phase
  const renderRevealPhase = () => (
    <Animated.View
      style={[styles.phaseContainer, styles.revealPhase, { opacity: fadeAnim }]}
    >
      <View style={styles.revealHeader}>
        <Text style={styles.revealTitle}>Your Quests Are Ready!</Text>
        <Text style={styles.revealSubtitle}>
          {chapter.subtitle}: {chapter.title}
        </Text>
      </View>

      <ScrollView
        style={styles.questsScrollView}
        contentContainerStyle={styles.questsScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {quests.map((quest, index) => (
          <AnimatedQuestCard
            key={quest.id || index}
            quest={quest}
            index={index}
            startAnimation={startRevealAnimation}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.startActButton}
        onPress={handleStartAct}
        activeOpacity={0.8}
      >
        <Text style={styles.startActButtonText}>START ACT</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // Get gradient colors based on phase
  const getGradientColors = () => {
    switch (phase) {
      case PHASES.QUESTIONS:
        return ['#5B9FED', '#4A90E2', '#3B7DD8', '#2E6BC4'];
      case PHASES.THINKING:
        return ['#8B7FD6', '#7B6FC6', '#6B5FB6', '#5B4FA6'];
      case PHASES.REVEAL:
        return ['#4CAF50', '#43A047', '#388E3C', '#2E7D32'];
      default:
        return ['#5B9FED', '#4A90E2', '#3B7DD8', '#2E6BC4'];
    }
  };

  return (
    <LinearGradient colors={getGradientColors()} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Close button (only in questions phase) */}
        {phase === PHASES.QUESTIONS && (
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === PHASES.QUESTIONS && renderQuestionsPhase()}
        {phase === PHASES.THINKING && renderThinkingPhase()}
        {phase === PHASES.REVEAL && renderRevealPhase()}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  phaseContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  // Questions Phase
  questionHeader: {
    marginBottom: 32,
  },
  phaseTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  phaseSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  // Thinking Phase
  thinkingPhase: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  thinkingContent: {
    alignItems: 'center',
  },
  pulsingDotsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  pulsingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  thinkingTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 32,
  },
  thinkingMessages: {
    alignItems: 'center',
    minHeight: 120,
  },
  thinkingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 12,
  },
  // Reveal Phase
  revealPhase: {
    paddingTop: 60,
  },
  revealHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  revealTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  revealSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  questsScrollView: {
    flex: 1,
  },
  questsScrollContent: {
    paddingBottom: 20,
  },
  questRevealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  questRevealIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  questRevealInfo: {
    flex: 1,
  },
  questRevealName: {
    color: '#333',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  questRevealSegments: {
    color: '#666',
    fontSize: 14,
  },
  startActButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  startActButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default ActOnboardingModal;
