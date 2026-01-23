import React, { useEffect, useRef } from 'react';
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
 * ActUnlockModal - Shows when a new act is unlocked
 *
 * @param {boolean} visible - Whether modal is visible
 * @param {number} actNumber - The act number being unlocked
 * @param {string} actTitle - Title of the act
 * @param {string} actIcon - Icon for the act (optional)
 * @param {function} onContinue - Callback when user taps to continue
 */
const ActUnlockModal = ({
  visible,
  actNumber,
  actTitle,
  actIcon = '🔓',
  onContinue,
}) => {
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const lockAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const unlockAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      backdropAnim.setValue(0);
      cardAnim.setValue(0);
      lockAnim.setValue(0);
      shakeAnim.setValue(0);
      unlockAnim.setValue(0);
      contentAnim.setValue(0);

      // Animation sequence
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
        // Show lock
        Animated.spring(lockAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        // Shake the lock
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -1,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        // Unlock animation
        Animated.timing(unlockAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        // Show content
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });
    }
  }, [visible]);

  const handleContinue = () => {
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

  const shakeRotation = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
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
          colors={['rgba(76, 175, 80, 0.95)', 'rgba(56, 142, 60, 0.95)']}
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
          {/* Lock Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [
                  {
                    scale: lockAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1.2, 1],
                    }),
                  },
                  { rotate: shakeRotation },
                  {
                    scale: unlockAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.3, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.lockIcon,
                {
                  opacity: unlockAnim.interpolate({
                    inputRange: [0, 0.3],
                    outputRange: [1, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              🔒
            </Animated.Text>
            <Animated.Text
              style={[
                styles.unlockIcon,
                {
                  opacity: unlockAnim.interpolate({
                    inputRange: [0.3, 0.6],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              {actIcon}
            </Animated.Text>
          </Animated.View>

          {/* Content */}
          <Animated.View
            style={[
              styles.content,
              { opacity: contentAnim },
            ]}
          >
            <Text style={styles.readyText}>Ready for</Text>
            <Text style={styles.actNumber}>Act {actNumber}</Text>
            <Text style={styles.actTitle}>{actTitle}</Text>
          </Animated.View>

          {/* Continue Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              { opacity: contentAnim },
            ]}
          >
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueText}>Let's Go!</Text>
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
  iconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  lockIcon: {
    fontSize: 64,
    position: 'absolute',
  },
  unlockIcon: {
    fontSize: 64,
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  readyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  actNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4CAF50',
    marginBottom: 4,
  },
  actTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ActUnlockModal;
