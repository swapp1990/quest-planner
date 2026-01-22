import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { getQuestAction } from '../campaign/questActionsData';

const { height } = Dimensions.get('window');

const QuestActionModal = ({ quest, onSubmit, onClose }) => {
  const [answer, setAnswer] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const overlayAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(height)).current;
  const inputRef = useRef(null);

  // Get the current action based on completed segments
  const currentSegment = quest?.completedSegments || 0;
  const action = getQuestAction(quest?.id, currentSegment);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
    ]).start(() => {
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 100);
    });

    // Keyboard listeners
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleClose = () => {
    Keyboard.dismiss();
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
      onClose();
    });
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

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
      onSubmit(answer);
    });
  };

  const isComplete = quest?.completedSegments >= quest?.maxSegments;
  const progressText = `${currentSegment + 1} of ${quest?.maxSegments}`;

  return (
    <View style={styles.container}>
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
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [{ translateY: contentAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#5B9FED', '#4A90E2', '#3B7DD8', '#2E6BC4']}
            style={styles.content}
          >
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Quest Info Header */}
            <View style={styles.header}>
              <View style={styles.questIconContainer}>
                <Text style={styles.questIcon}>{quest?.icon}</Text>
              </View>
              <View style={styles.questInfo}>
                <Text style={styles.questName}>{quest?.name}</Text>
                <Text style={styles.progressText}>Step {progressText}</Text>
              </View>
            </View>

            {/* Question */}
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{action.question}</Text>
              {action.hint && (
                <Text style={styles.hintText}>{action.hint}</Text>
              )}
            </View>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={action.placeholder}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={answer}
                onChangeText={setAnswer}
                multiline
                maxLength={200}
                returnKeyType="done"
                blurOnSubmit
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  Complete Step
                </Text>
              </TouchableOpacity>
            </View>

            {/* Optional indicator */}
            <Text style={styles.optionalText}>
              Answer can be left blank for testing
            </Text>
          </LinearGradient>
        </Animated.View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    maxHeight: height * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  content: {
    paddingBottom: 40,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  questIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  questIcon: {
    fontSize: 28,
  },
  questInfo: {
    flex: 1,
  },
  questName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  questionContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  questionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 8,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  optionalText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default QuestActionModal;
