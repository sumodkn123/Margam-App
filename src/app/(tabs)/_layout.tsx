// MARGAM — Expo Router Tabs Layout
// iOS-native 5-tab navigation bar with safe-area support, live badges, and Kerala Rose theme tokens.

import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Compass, Map as MapIcon, Inbox, MessageCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 58 + safeBottom,
          paddingBottom: safeBottom,
          paddingTop: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          elevation: 10,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home size={22} color={color as string} strokeWidth={focused ? 2.4 : 1.9} />
          ),
        }}
      />
      <Tabs.Screen
        name="margams"
        options={{
          title: 'Margams',
          tabBarIcon: ({ color, focused }) => (
            <Compass size={23} color={color as string} strokeWidth={focused ? 2.4 : 1.9} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <MapIcon size={22} color={color as string} strokeWidth={focused ? 2.4 : 1.9} />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarBadge: 1,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            fontSize: 9,
            fontWeight: '800',
          },
          tabBarIcon: ({ color, focused }) => (
            <Inbox size={22} color={color as string} strokeWidth={focused ? 2.4 : 1.9} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarBadge: 1,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            fontSize: 9,
            fontWeight: '800',
          },
          tabBarIcon: ({ color, focused }) => (
            <MessageCircle size={22} color={color as string} strokeWidth={focused ? 2.4 : 1.9} />
          ),
        }}
      />
    </Tabs>
  );
}
