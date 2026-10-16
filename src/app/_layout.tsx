// MARGAM — Expo Router Root Layout
// Configures root Stack navigator, SafeAreaProvider, and global status bar.

import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FAF9F6' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            presentation: 'card',
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
