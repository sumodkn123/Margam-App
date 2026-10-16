// MARGAM — Margams Discovery Route (margams.tsx)
// Mounts the interest-based MargamsScreen with Expo Router navigation bindings.

import React from 'react';
import { router } from 'expo-router';
import { MargamsScreen } from '../../screens/MargamsScreen';
import { ANONYMOUS_MATCHES } from '../../constants/mockData';

export default function MargamsRoute() {
  return (
    <MargamsScreen
      onSelectCandidate={(candidate) => {
        router.push('/(tabs)/requests');
      }}
      onOpenCandidateProfile={(candidateOrId) => {
        // Can open candidate modal or push
      }}
      onRequestButtonPress={() => {
        router.push('/(tabs)/requests');
      }}
      onOpenProfile={() => {
        router.push('/profile');
      }}
      onOpenChat={() => {
        router.push('/(tabs)/chat');
      }}
    />
  );
}
