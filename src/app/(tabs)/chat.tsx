// MARGAM — Connections & Chat Route (chat.tsx)
// Mounts ConnectionsHubScreen with safe messaging and active chat threads.

import React from 'react';
import { router } from 'expo-router';
import { ConnectionsHubScreen } from '../../screens/ConnectionsHubScreen';

export default function ChatRoute() {
  return (
    <ConnectionsHubScreen
      onOpenPrivacy={() => {
        router.push('/privacy');
      }}
      onOpenCandidateProfile={(candidateOrId) => {
        router.push('/(tabs)/margams');
      }}
    />
  );
}
