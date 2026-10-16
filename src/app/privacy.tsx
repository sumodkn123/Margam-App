// MARGAM — Privacy Center Route (privacy.tsx)
// Dedicated visibility & request disclosure settings.

import React from 'react';
import { router } from 'expo-router';
import { PrivacyCenterScreen } from '../screens/PrivacyCenterScreen';

export default function PrivacyRoute() {
  return <PrivacyCenterScreen onBack={() => router.back()} initialView="hub" />;
}
