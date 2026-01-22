import React from 'react';
import {
  Modal,
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const THEMES = {
  purple: {
    colors: ['#5B9FED', '#8B7FD6', '#C96FB9', '#E85DA0'],
    locations: [0, 0.35, 0.7, 1],
    useGradient: true,
  },
  green: {
    // Brighter lime/yellow-green matching reference
    colors: ['#9CCC65', '#8BC34A', '#7CB342'],
    locations: [0, 0.5, 1],
    useGradient: true,
    solidColor: '#8BC34A', // Fallback solid
  },
  orange: {
    colors: ['#FFAB91', '#FF7043', '#F4511E'],
    locations: [0, 0.5, 1],
    useGradient: true,
  },
  blue: {
    colors: ['#64B5F6', '#42A5F5', '#2196F3'],
    locations: [0, 0.5, 1],
    useGradient: true,
  },
};

const ThemedModal = ({
  visible,
  onClose,
  theme = 'purple',
  children,
  animationType = 'slide',
  presentationStyle = 'pageSheet',
}) => {
  const themeConfig = THEMES[theme] || THEMES.purple;

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={themeConfig.colors}
        locations={themeConfig.locations}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

export default ThemedModal;
