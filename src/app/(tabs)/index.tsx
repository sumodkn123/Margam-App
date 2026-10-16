// MARGAM — Home Screen Route (index.tsx)
// Mounts the executive MargamHomeScreen with Expo Router navigation bindings.

import React from 'react';
import { router } from 'expo-router';
import { MargamHomeScreen } from '../../screens/MargamHomeScreen';
import { ANONYMOUS_MATCHES } from '../../constants/mockData';

export default function HomeRoute() {
  return (
    <MargamHomeScreen
      onNavigateToMap={(mode, dest, trip) => {
        router.push('/(tabs)/map');
      }}
      onSelectCandidate={(candidate) => {
        router.push('/(tabs)/requests');
      }}
      onOpenCandidateProfile={(candidateOrId) => {
        router.push('/(tabs)/margams');
      }}
      onRequestButtonPress={() => {
        router.push('/(tabs)/requests');
      }}
      onOpenChat={() => {
        router.push('/(tabs)/chat');
      }}
      onOpenProfile={() => {
        router.push('/profile');
      }}
      onOpenPrivacy={() => {
        router.push('/privacy');
      }}
      onOpenNotifications={() => {
        router.push('/(tabs)/requests');
      }}
      onOpenAcceptedRequest={(actorName, actorId) => {
        router.push('/(tabs)/chat');
      }}
      onOpenNewMatches={() => {
        router.push('/(tabs)/margams');
      }}
    />
  );
}
