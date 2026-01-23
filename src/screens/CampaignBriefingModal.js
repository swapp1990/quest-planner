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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import {
  ChatBubble,
  UserBubble,
  ChoiceChips,
  FreeTextInput,
  TypingIndicator,
  StepIndicator,
  ConstraintCard,
  PlanOptionCard,
} from '../briefing/components';

import { BRIEFING_PROMPTS, BRIEF_THINKING_MESSAGES } from '../briefing/briefingPromptsData';
import {
  mapResponsesToConstraints,
  getConstraintOrder,
  getDefaultConstraints,
  CONSTRAINT_LABELS,
} from '../briefing/constraintMapper';
import { PLAN_OPTIONS, generateQuestsForPlan } from '../briefing/planGenerator';

// Generate random constraints for skip functionality
const generateRandomConstraints = () => {
  const options = {
    tripSize: ['mini', 'standard', 'big'],
    spendVibe: ['save', 'balanced', 'treat'],
    soloConfidence: ['nervous', 'ready', 'bold'],
    planningEnergy: ['low', 'med', 'high'],
    structure: ['planned', 'flexible', 'spontaneous'],
  };

  const randomConstraints = {};
  Object.entries(options).forEach(([key, values]) => {
    randomConstraints[key] = values[Math.floor(Math.random() * values.length)];
  });

  return randomConstraints;
};

const { width, height } = Dimensions.get('window');

// Steps in the briefing flow
const STEPS = {
  CHAT: 0,
  BRIEF: 1,
  PLAN: 2,
};

// Plan step phases
const PLAN_PHASES = {
  SELECT_PLAN: 'select_plan',
  GENERATING: 'generating',
  PREVIEW_QUESTS: 'preview_quests',
};

// Gradient colors by step
const STEP_GRADIENTS = {
  [STEPS.CHAT]: ['#5B9FED', '#4A90E2', '#3B7DD8', '#2E6BC4'],
  [STEPS.BRIEF]: ['#8B7FD6', '#7B6FC6', '#6B5FB6', '#5B4FA6'],
  [STEPS.PLAN]: ['#4CAF50', '#43A047', '#388E3C', '#2E7D32'],
};

// AI thinking messages for quest generation
const QUEST_THINKING_MESSAGES = [
  { delay: 0, text: 'Analyzing your preferences...' },
  { delay: 800, text: 'Crafting personalized quests...' },
  { delay: 1600, text: 'Balancing challenge levels...' },
  { delay: 2400, text: 'Finalizing your adventure...' },
];

// Pulsing dot for thinking indicator
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
  }, [delay]);

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

const CampaignBriefingModal = ({ onComplete, onClose, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(STEPS.CHAT);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [chatResponses, setChatResponses] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [showTyping, setShowTyping] = useState(true);
  const [showChips, setShowChips] = useState(false);
  const [constraints, setConstraints] = useState({});
  const [selectedPlan, setSelectedPlan] = useState('comfort');

  // Plan step state
  const [planPhase, setPlanPhase] = useState(PLAN_PHASES.SELECT_PLAN);
  const [generatedQuests, setGeneratedQuests] = useState([]);
  const [visibleThinkingMessages, setVisibleThinkingMessages] = useState([]);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef(null);

  // Initialize first prompt
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(false);
      setChatHistory([{ type: 'ai', message: BRIEFING_PROMPTS[0].aiMessage }]);
      setTimeout(() => setShowChips(true), 300);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatHistory, showTyping, showChips]);

  // Handle chat option selection
  const handleOptionSelect = (option) => {
    const currentPrompt = BRIEFING_PROMPTS[currentPromptIndex];

    // Store response
    const newResponses = {
      ...chatResponses,
      [currentPrompt.id]: option.value,
    };
    setChatResponses(newResponses);

    // Add user bubble to chat
    setChatHistory((prev) => [
      ...prev,
      { type: 'user', label: option.label, icon: option.icon },
    ]);

    setShowChips(false);

    // Check if more prompts
    if (currentPromptIndex < BRIEFING_PROMPTS.length - 1) {
      // Show typing, then next prompt
      setShowTyping(true);

      setTimeout(() => {
        setShowTyping(false);
        const nextPrompt = BRIEFING_PROMPTS[currentPromptIndex + 1];
        setChatHistory((prev) => [...prev, { type: 'ai', message: nextPrompt.aiMessage }]);
        setCurrentPromptIndex(currentPromptIndex + 1);
        setTimeout(() => setShowChips(true), 300);
      }, 800);
    } else {
      // All prompts answered, transition to Brief step
      const mappedConstraints = mapResponsesToConstraints(newResponses);
      setConstraints(mappedConstraints);

      setTimeout(() => {
        transitionToStep(STEPS.BRIEF);
      }, 500);
    }
  };

  // Handle free text submission
  const handleFreeTextSubmit = (text) => {
    handleOptionSelect({
      id: 'custom',
      label: text,
      icon: '💬',
      value: text,
    });
  };

  // Handle skip chat - randomize constraints and go to Brief
  const handleSkipChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const randomConstraints = generateRandomConstraints();
    setConstraints(randomConstraints);
    setChatResponses({}); // No chat responses when skipped
    transitionToStep(STEPS.BRIEF);
  };

  // Handle constraint toggle
  const handleConstraintToggle = (constraintName, newValue) => {
    setConstraints((prev) => ({
      ...prev,
      [constraintName]: newValue,
    }));
  };

  // Transition between steps
  const transitionToStep = (newStep) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(newStep);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // Handle brief confirmation
  const handleBriefConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    transitionToStep(STEPS.PLAN);
  };

  // Handle plan selection
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  // Handle generate quests button
  const handleGenerateQuests = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPlanPhase(PLAN_PHASES.GENERATING);
    setVisibleThinkingMessages([]);

    // Animate thinking messages
    QUEST_THINKING_MESSAGES.forEach((msg, index) => {
      setTimeout(() => {
        setVisibleThinkingMessages((prev) => [...prev, index]);
      }, msg.delay);
    });

    // Generate quests after thinking animation
    setTimeout(() => {
      const quests = generateQuestsForPlan(selectedPlan, constraints);
      setGeneratedQuests(quests);
      setPlanPhase(PLAN_PHASES.PREVIEW_QUESTS);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 3200);
  };

  // Handle go back to plan selection
  const handleBackToPlanSelection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPlanPhase(PLAN_PHASES.SELECT_PLAN);
    setGeneratedQuests([]);
  };

  // Handle completion - confirm quests and proceed
  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    onComplete({
      chatResponses,
      constraints,
      selectedPlan,
      quests: generatedQuests,
      briefingCompletedAt: new Date().toISOString(),
    });
  };

  // Render Step 1: Chat
  const renderChatStep = () => {
    const currentPrompt = BRIEFING_PROMPTS[currentPromptIndex];

    return (
      <KeyboardAvoidingView
        style={styles.stepContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScrollView}
          contentContainerStyle={styles.chatScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {chatHistory.map((item, index) =>
            item.type === 'ai' ? (
              <ChatBubble
                key={`ai-${index}`}
                message={item.message}
                isVisible={true}
              />
            ) : (
              <UserBubble
                key={`user-${index}`}
                label={item.label}
                icon={item.icon}
                isVisible={true}
              />
            )
          )}

          {showTyping && <TypingIndicator isVisible={true} />}

          {showChips && (
            <>
              <ChoiceChips
                options={currentPrompt.options}
                onSelect={handleOptionSelect}
                isVisible={true}
              />
              {currentPrompt.allowFreeText && (
                <FreeTextInput
                  placeholder="Or tell me in your own words..."
                  onSubmit={handleFreeTextSubmit}
                  isVisible={true}
                />
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  // Render Step 2: Brief
  const renderBriefStep = () => {
    const constraintOrder = getConstraintOrder();

    return (
      <ScrollView
        style={styles.stepContainer}
        contentContainerStyle={styles.briefScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.briefHeader}>
          <Text style={styles.briefTitle}>Your Mission Brief</Text>
          <Text style={styles.briefSubtitle}>
            We've captured your preferences. Tap any card to adjust.
          </Text>
        </View>

        <View style={styles.constraintsContainer}>
          {constraintOrder.map((constraintName, index) => {
            const constraintDef = CONSTRAINT_LABELS[constraintName];
            const currentValue = constraints[constraintName];

            return (
              <ConstraintCard
                key={constraintName}
                name={constraintDef.name}
                options={constraintDef.options}
                currentValue={currentValue}
                onToggle={(newValue) => handleConstraintToggle(constraintName, newValue)}
                index={index}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleBriefConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Feels right ✓</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // Render Step 3: Plan (with phases)
  const renderPlanStep = () => {
    const plans = Object.values(PLAN_OPTIONS);

    // Phase 1: Select Plan
    if (planPhase === PLAN_PHASES.SELECT_PLAN) {
      return (
        <ScrollView
          style={styles.stepContainer}
          contentContainerStyle={styles.planScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Choose Your Path</Text>
            <Text style={styles.planSubtitle}>
              Select the journey that fits your pace
            </Text>
          </View>

          <View style={styles.plansContainer}>
            {plans.map((plan, index) => (
              <PlanOptionCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={handlePlanSelect}
                index={index}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateQuests}
            activeOpacity={0.8}
          >
            <Text style={styles.generateButtonText}>✨ Generate My Quests</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    // Phase 2: Generating (AI Thinking)
    if (planPhase === PLAN_PHASES.GENERATING) {
      return (
        <View style={[styles.stepContainer, styles.generatingContainer]}>
          <View style={styles.thinkingContent}>
            <View style={styles.pulsingDotsContainer}>
              <PulsingDot delay={0} />
              <PulsingDot delay={150} />
              <PulsingDot delay={300} />
            </View>

            <Text style={styles.thinkingTitle}>Creating Your Quests</Text>

            <View style={styles.thinkingMessages}>
              {QUEST_THINKING_MESSAGES.map((msg, index) => (
                <ThinkingMessage
                  key={index}
                  text={msg.text}
                  isVisible={visibleThinkingMessages.includes(index)}
                />
              ))}
            </View>
          </View>
        </View>
      );
    }

    // Phase 3: Preview Quests
    if (planPhase === PLAN_PHASES.PREVIEW_QUESTS) {
      const planInfo = PLAN_OPTIONS[selectedPlan];

      return (
        <ScrollView
          style={styles.stepContainer}
          contentContainerStyle={styles.previewScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Your {planInfo.name}</Text>
            <Text style={styles.previewSubtitle}>
              {generatedQuests.length} quests tailored to your preferences
            </Text>
          </View>

          <View style={styles.questsPreviewContainer}>
            {generatedQuests.map((quest, index) => (
              <View key={quest.id} style={styles.questPreviewCard}>
                <Text style={styles.questPreviewIcon}>{quest.icon}</Text>
                <View style={styles.questPreviewInfo}>
                  <Text style={styles.questPreviewName}>{quest.name}</Text>
                  <Text style={styles.questPreviewDesc}>{quest.description}</Text>
                  <Text style={styles.questPreviewSteps}>
                    {quest.maxSegments} {quest.maxSegments === 1 ? 'step' : 'steps'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.previewActions}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>Looks good!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToPlanSelection}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>← Try different path</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return null;
  };

  const currentGradient = STEP_GRADIENTS[currentStep];

  return (
    <LinearGradient colors={currentGradient} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header buttons */}
        {currentStep === STEPS.CHAT && (
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            {onSkip && (
              <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                <Text style={styles.skipButtonText}>Skip All</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Step indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={3}
          labels={['Chat', 'Brief', 'Plan']}
        />

        {/* Step content */}
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {currentStep === STEPS.CHAT && renderChatStep()}
          {currentStep === STEPS.BRIEF && renderBriefStep()}
          {currentStep === STEPS.PLAN && renderPlanStep()}
        </Animated.View>
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
  headerButtons: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Chat Step
  chatScrollView: {
    flex: 1,
  },
  chatScrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },

  // Brief Step
  briefScrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  briefHeader: {
    marginBottom: 24,
  },
  briefTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  briefSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    lineHeight: 22,
  },
  constraintsContainer: {
    marginBottom: 24,
  },
  confirmButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  // Plan Step - Select Plan Phase
  planScrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  planHeader: {
    marginBottom: 24,
  },
  planTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  planSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  plansContainer: {
    marginBottom: 24,
  },
  generateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#2E7D32',
    fontSize: 17,
    fontWeight: '700',
  },

  // Plan Step - Generating Phase
  generatingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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

  // Plan Step - Preview Quests Phase
  previewScrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  previewHeader: {
    marginBottom: 20,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  previewSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
  },
  questsPreviewContainer: {
    marginBottom: 24,
  },
  questPreviewCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  questPreviewIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  questPreviewInfo: {
    flex: 1,
  },
  questPreviewName: {
    color: '#333',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  questPreviewDesc: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  questPreviewSteps: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  previewActions: {
    gap: 12,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CampaignBriefingModal;
