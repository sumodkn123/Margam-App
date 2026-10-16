// MARGAM — Profile & Settings Route (profile.tsx)
// Full-screen executive matrimonial profile & account settings modal.

import React, { useState } from 'react';
import { router } from 'expo-router';
import { MargamProfileScreen } from '../screens/MargamProfileScreen';
import { CURRENT_USER } from '../constants/mockData';
import {
  MapVisibilityOption,
  LocationDisplayMode,
  AvailabilityStatus,
  ProfileFieldPerms,
  VisibilityState,
} from '../types';

export default function ProfileRoute() {
  const [mapVisibility, setMapVisibility] = useState<MapVisibilityOption>('all_criteria');
  const [locationMode, setLocationMode] = useState<LocationDisplayMode>('approximate_area');
  const [availability, setAvailability] = useState<AvailabilityStatus>('available');
  const [fieldPerms, setFieldPerms] = useState<ProfileFieldPerms>(CURRENT_USER.fieldPerms);

  const handleFieldPermChange = (field: keyof ProfileFieldPerms, state: VisibilityState) => {
    if (field === 'exactLocation') return;
    setFieldPerms((prev) => ({
      ...prev,
      [field]: state,
    }));
  };

  return (
    <MargamProfileScreen
      onBack={() => router.back()}
      onLogout={() => router.replace('/(tabs)')}
      mapVisibility={mapVisibility}
      onChangeMapVisibility={setMapVisibility}
      locationMode={locationMode}
      onChangeLocationMode={setLocationMode}
      availability={availability}
      onChangeAvailability={setAvailability}
      fieldPerms={fieldPerms}
      onChangeFieldPerm={handleFieldPermChange}
      onNavigateToHome={() => router.push('/(tabs)')}
      onNavigateToMap={() => router.push('/(tabs)/map')}
      onNavigateToRequests={() => router.push('/(tabs)/requests')}
      onOpenConversation={(convId, name) => router.push('/(tabs)/chat')}
      onOpenPrivacyCenter={() => router.push('/privacy')}
    />
  );
}
