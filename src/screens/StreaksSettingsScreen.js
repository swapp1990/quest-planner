import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  ThemedModal,
  ModalHeader,
  SectionHeader,
  ListRow,
  InfoBanner,
} from '../components';
import { useStreaks } from '../streaks';

const StreaksSettingsScreen = ({ visible, onClose }) => {
  const { clearAllData } = useStreaks();

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your tasks and history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Success', 'All data has been cleared.', [
              { text: 'OK', onPress: onClose },
            ]);
          },
        },
      ]
    );
  };

  return (
    <ThemedModal
      visible={visible}
      onClose={onClose}
      theme="purple"
    >
      {/* Header */}
      <ModalHeader
        title="Settings"
        onClose={onClose}
        closeIcon="Done"
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* About Section */}
        <SectionHeader title="About" />
        <InfoBanner
          icon="💡"
          message="Streaks helps you build better habits by tracking your daily progress. Complete segments each day to maintain your streak."
          variant="info"
        />

        {/* Version Section */}
        <SectionHeader title="Version" />
        <ListRow
          icon="📱"
          iconBackground="rgba(255, 255, 255, 0.2)"
          label="App Version"
          value="1.0.0"
          showChevron={false}
        />

        {/* Data Section */}
        <SectionHeader title="Data" />
        <ListRow
          icon="🗑️"
          iconBackground="rgba(239, 68, 68, 0.3)"
          label="Clear All Data"
          showChevron={true}
          onPress={handleClearData}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with Claude Code</Text>
        </View>
      </ScrollView>
    </ThemedModal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
  },
});

export default StreaksSettingsScreen;
