import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * MemoryStampModal - Expanded view of an earned stamp
 * Shows the stamp card with label and insights
 */
const MemoryStampModal = ({ visible, stamp, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!stamp) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.cardContainer,
                {
                  opacity: opacityAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Stamp Card */}
              <View style={styles.card}>
                {/* Header with act info */}
                <View style={styles.cardHeader}>
                  <View style={styles.actBadge}>
                    <Text style={styles.actBadgeText}>ACT {stamp.chapterNumber}</Text>
                  </View>
                  <Text style={styles.actName}>{stamp.actName}</Text>
                </View>

                {/* Large icon */}
                <View style={styles.iconContainer}>
                  <Text style={styles.largeIcon}>{stamp.actIcon}</Text>
                </View>

                {/* Personality label */}
                <Text style={styles.label}>{stamp.label}</Text>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Insights - what led to this label */}
                {stamp.insights && stamp.insights.length > 0 && (
                  <View style={styles.insightsContainer}>
                    <Text style={styles.insightsTitle}>Based on your answers</Text>
                    {stamp.insights.map((insight, index) => (
                      <View key={index} style={styles.insightRow}>
                        <Text style={styles.insightIcon}>{insight.icon}</Text>
                        <Text style={styles.insightText} numberOfLines={2}>
                          {insight.answer}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Close hint */}
                <Text style={styles.closeHint}>Tap outside to close</Text>
              </View>

              {/* Decorative stamp border effect */}
              <View style={styles.stampBorder} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: SCREEN_WIDTH - 64,
    maxWidth: 320,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  stampBorder: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.2)',
    borderStyle: 'dashed',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  actBadge: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  actBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actName: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  largeIcon: {
    fontSize: 44,
  },
  label: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
    marginBottom: 16,
  },
  insightsContainer: {
    width: '100%',
    paddingTop: 8,
  },
  insightsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: 'center',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  closeHint: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 16,
  },
});

export default MemoryStampModal;
