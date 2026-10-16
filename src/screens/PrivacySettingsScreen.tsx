// MARGAM — Privacy Settings & Visibility Screen
// Full control over discovery map presence, location fuzzing, and field disclosure matrix

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { PrivacyDashboard } from '../components/privacy/PrivacyDashboard';
import { PreviewWhatOthersSeeModal } from '../components/profile/PreviewWhatOthersSeeModal';
import {
  MapVisibilityOption,
  LocationDisplayMode,
  AvailabilityStatus,
  ProfileFieldPerms,
  VisibilityState,
} from '../types';
import {
  getMasterProfile,
  setPrivacyPreset,
} from '../services/advancedProfileEngine';
import { ArrowLeft, ShieldCheck, Eye } from 'lucide-react-native';

interface PrivacySettingsScreenProps {
  onBack: () => void;
  mapVisibility: MapVisibilityOption;
  onChangeMapVisibility: (option: MapVisibilityOption) => void;
  locationMode: LocationDisplayMode;
  onChangeLocationMode: (mode: LocationDisplayMode) => void;
  availability: AvailabilityStatus;
  onChangeAvailability: (status: AvailabilityStatus) => void;
  fieldPerms: ProfileFieldPerms;
  onChangeFieldPerm: (field: keyof ProfileFieldPerms, state: VisibilityState) => void;
}

export const PrivacySettingsScreen: React.FC<PrivacySettingsScreenProps> = ({
  onBack,
  mapVisibility,
  onChangeMapVisibility,
  locationMode,
  onChangeLocationMode,
  availability,
  onChangeAvailability,
  fieldPerms,
  onChangeFieldPerm,
}) => {
  const [masterProfile, setMasterProfile] = useState(() =>
    getMasterProfile('usr-current-sumod')
  );
  const [simulatorVisible, setSimulatorVisible] = useState(false);

  const handleSelectPreset = (preset: any) => {
    const updated = setPrivacyPreset('usr-current-sumod', preset);
    setMasterProfile({ ...updated });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Navigation Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.title}>Privacy & Discovery</Text>
          <Text style={styles.subtitle}>
            Map presence, location fuzzing & field matrix
          </Text>
        </View>

        <TouchableOpacity
          style={styles.shieldBadge}
          onPress={() => setSimulatorVisible(true)}
          activeOpacity={0.8}
        >
          <ShieldCheck size={14} color="#059669" />
          <Text style={styles.shieldText}>Protected</Text>
        </TouchableOpacity>
      </View>

      {/* Main Privacy Dashboard Content */}
      <View style={styles.content}>
        <PrivacyDashboard
          mapVisibility={mapVisibility}
          onChangeMapVisibility={onChangeMapVisibility}
          locationMode={locationMode}
          onChangeLocationMode={onChangeLocationMode}
          availability={availability}
          onChangeAvailability={onChangeAvailability}
          fieldPerms={fieldPerms}
          onChangeFieldPerm={onChangeFieldPerm}
          masterProfile={masterProfile}
          onSelectPrivacyPreset={handleSelectPreset}
          onOpenViewAsOthers={() => setSimulatorVisible(true)}
        />
      </View>

      {/* "What Others See" Simulator Modal */}
      <PreviewWhatOthersSeeModal
        visible={simulatorVisible}
        onClose={() => setSimulatorVisible(false)}
        userId="usr-current-sumod"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  shieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  shieldText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  content: {
    flex: 1,
  },
});
