import React from 'react';
import { StreaksProvider } from './src/streaks';
import StreaksScreen from './src/screens/StreaksScreen';

export default function App() {
  return (
    <StreaksProvider>
      <StreaksScreen />
    </StreaksProvider>
  );
}
