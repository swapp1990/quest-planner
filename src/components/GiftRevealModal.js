import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

/**
 * GiftRevealModal - Reusable gift box reveal component
 *
 * Shows a gift box that needs to be tapped to open, revealing content inside.
 * Continue button only enables after the gift is opened.
 *
 * @param {boolean} visible - Whether modal is visible
 * @param {string} headerText - Text shown above the gift (e.g., "Act 1 Complete")
 * @param {string} giftIcon - Icon for the closed gift box (default: 🎁)
 * @param {React.ReactNode} revealContent - Content to show when gift opens
 * @param {React.ReactNode} footerContent - Optional content below revealed item
 * @param {string} continueText - Text for continue button (default: "Continue")
 * @param {function} onContinue - Callback when continue is pressed
 * @param {function} onOpen - Optional callback when gift is opened
 * @param {array} gradientColors - Optional backdrop gradient colors
 */
const GiftRevealModal = ({
  visible,
  headerText,
  giftIcon = '🎁',
  revealContent,
  footerContent,
  continueText = 'Continue',
  onContinue,
  onOpen,
  gradientColors = ['rgba(91, 159, 237, 0.95)', 'rgba(201, 111, 185, 0.95)'],
}) => {
  const [isOpened, setIsOpened] = useState(false);

  // Animations
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const giftAnim = useRef(new Animated.Value(0)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  const openAnim = useRef(new Animated.Value(0)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      setIsOpened(false);

      // Reset all animations
      backdropAnim.setValue(0);
      cardAnim.setValue(0);
      giftAnim.setValue(0);
      wiggleAnim.setValue(0);
      openAnim.setValue(0);
      revealAnim.setValue(0);
      footerAnim.setValue(0);
      pulseAnim.setValue(1);

      // Initial entrance animation
      Animated.sequence([
        // Fade in backdrop
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Scale in card
        Animated.spring(cardAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        // Pop in gift box
        Animated.spring(giftAnim, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start wiggle and pulse to indicate tappable
        startWiggleAnimation();
        startPulseAnimation();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      });
    }
  }, [visible]);

  const startWiggleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(wiggleAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: -1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    ).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleOpenGift = () => {
    if (isOpened) return;

    setIsOpened(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Stop wiggle and pulse
    wiggleAnim.stopAnimation();
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);

    // Opening animation sequence
    Animated.sequence([
      // Gift explodes/fades out
      Animated.timing(openAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      // Reveal content pops in
      Animated.spring(revealAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
      // Footer fades in
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    onOpen?.();
  };

  const handleContinue = () => {
    if (!isOpened) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate out
    Animated.parallel([
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onContinue?.();
    });
  };

  const wiggleRotation = wiggleAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropAnim },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Card */}
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardAnim,
              transform: [
                {
                  scale: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>{headerText}</Text>
          </View>

          {/* Gift Box (before opening) */}
          {!isOpened && (
            <TouchableOpacity
              onPress={handleOpenGift}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[
                  styles.giftContainer,
                  {
                    transform: [
                      {
                        scale: giftAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0, 1.3, 1],
                        }),
                      },
                      { scale: pulseAnim },
                      { rotate: wiggleRotation },
                    ],
                  },
                ]}
              >
                <View style={styles.giftBox}>
                  <Text style={styles.giftIcon}>{giftIcon}</Text>
                </View>
                <Text style={styles.tapHint}>Tap to open</Text>
              </Animated.View>
            </TouchableOpacity>
          )}

          {/* Revealed Content (after opening) */}
          {isOpened && (
            <Animated.View
              style={[
                styles.revealContainer,
                {
                  opacity: revealAnim,
                  transform: [
                    {
                      scale: revealAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.3, 1.1, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {revealContent}
            </Animated.View>
          )}

          {/* Footer Content */}
          {isOpened && footerContent && (
            <Animated.View
              style={[
                styles.footerContainer,
                { opacity: footerAnim },
              ]}
            >
              {footerContent}
            </Animated.View>
          )}

          {/* Continue Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: isOpened ? footerAnim : 0.4,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isOpened && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              activeOpacity={0.8}
              disabled={!isOpened}
            >
              <Text style={styles.continueText}>{continueText}</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  giftContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  giftBox: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  giftIcon: {
    fontSize: 64,
  },
  tapHint: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginTop: 8,
  },
  revealContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerContainer: {
    width: '100%',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default GiftRevealModal;
