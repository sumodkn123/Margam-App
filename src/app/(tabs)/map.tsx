// MARGAM — Map Discovery Route (map.tsx)
// Mounts the MapDiscoveryScreen with Apple Maps / Google Maps cartography.

import React from 'react';
import { router } from 'expo-router';
import { MapDiscoveryScreen } from '../../screens/MapDiscoveryScreen';

export default function MapRoute() {
  return (
    <MapDiscoveryScreen
      onBack={() => router.push('/(tabs)')}
      onStartRequest={(candidate, route) => {
        router.push('/(tabs)/requests');
      }}
      onOpenPrivacy={() => {
        router.push('/privacy');
      }}
      onOpenProfile={() => {
        router.push('/profile');
      }}
      onOpenCandidateProfile={(candidate) => {
        router.push('/(tabs)/margams');
      }}
    />
  );
}
