// MARGAM - Privacy & Discovery Dashboard (Section 15 & 16)
// Complete visibility matrix and discovery control center

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import {
  MapVisibilityOption,
  LocationDisplayMode,
  AvailabilityStatus,
  ProfileFieldPerms,
  VisibilityState,
} from '../../types';
import {
  Shield,
  Eye,
  Lock,
  UserCheck,
  Globe,
  MapPin,
  Check,
  AlertTriangle,
  Info,
} from 'lucide-react-native';

interface PrivacyDashboardProps {
  mapVisibility: MapVisibilityOption;
  onChangeMapVisibility: (option: MapVisibilityOption) => void;
  locationMode: LocationDisplayMode;
  onChangeLocationMode: (mode: LocationDisplayMode) => void;
  availability: AvailabilityStatus;
  onChangeAvailability: (status: AvailabilityStatus) => void;
  fieldPerms: ProfileFieldPerms;
  onChangeFieldPerm: (field: keyof ProfileFieldPerms, state: VisibilityState) => void;
}

export const PrivacyDashboard: React.FC<PrivacyDashboardProps> = ({
  mapVisibility,
  onChangeMapVisibility,
  locationMode,
  onChangeLocationMode,
  availability,
  onChangeAvailability,
  fieldPerms,
  onChangeFieldPerm,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'discovery'>('discovery');

  const renderRadioOption = (
    label: string,
    description: string,
    selected: boolean,
    onSelect: () => void
  ) => {
    return (
      <TouchableOpacity
        style={[styles.radioCard, selected && styles.radioCardSelected]}
        onPress={onSelect}
        activeOpacity={0.8}
      >
        <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <View style={styles.radioContent}>
          <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>
            {label}
          </Text>
          <Text style={styles.radioDesc}>{description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMatrixRow = (
    fieldName: string,
    permKey: keyof ProfileFieldPerms,
    currentState: VisibilityState,
    isHardlocked: boolean = false
  ) => {
    const states: { key: VisibilityState; label: string; icon: string }[] = [
      { key: 'private', label: 'Private', icon: '🔒' },
      { key: 'request_only', label: 'Request', icon: '👤' },
      { key: 'accepted_only', label: 'Accepted', icon: '🤝' },
      { key: 'public', label: 'Public', icon: '🌐' },
    ];

    return (
      <View key={permKey} style={styles.matrixRow}>
        <View style={styles.matrixFieldInfo}>
          <Text style={styles.matrixFieldName}>{fieldName}</Text>
          {isHardlocked && (
            <Text style={styles.matrixFieldWarning}>Hardcoded Private Invariant</Text>
          )}
        </View>

        <View style={styles.matrixButtonGroup}>
          {states.map((st) => {
            const isSelected = currentState === st.key;
            const disabled = isHardlocked && st.key !== 'private';
            return (
              <TouchableOpacity
                key={st.key}
                style={[
                  styles.matrixBtn,
                  isSelected && styles.matrixBtnSelected,
                  disabled && styles.matrixBtnDisabled,
                ]}
                onPress={() => !disabled && onChangeFieldPerm(permKey, st.key)}
                disabled={disabled}
              >
                <Text style={styles.matrixBtnIcon}>{st.icon}</Text>
                <Text
                  style={[
                    styles.matrixBtnText,
                    isSelected && styles.matrixBtnTextSelected,
                  ]}
                >
                  {st.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'discovery' && styles.tabBtnActive]}
          onPress={() => setActiveTab('discovery')}
        >
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'discovery' && styles.tabBtnTextActive,
            ]}
          >
            Discovery & Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'matrix' && styles.tabBtnActive]}
          onPress={() => setActiveTab('matrix')}
        >
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'matrix' && styles.tabBtnTextActive,
            ]}
          >
            Field Visibility Matrix
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'discovery' ? (
        <View style={styles.tabContent}>
          {/* Section 1: Map Visibility */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Eye size={15} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Map Discovery Visibility</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Determine who can see your anonymous marker zone when they search along routes:
            </Text>

            <View style={styles.optionsList}>
              {renderRadioOption(
                'Everyone matching my criteria',
                'Your approximate zone appears to all compatible candidates searching nearby routes.',
                mapVisibility === 'all_criteria',
                () => onChangeMapVisibility('all_criteria')
              )}
              {renderRadioOption(
                'Only highly compatible users (90%+)',
                'Limits map discovery markers strictly to top-tier algorithmic compatibility.',
                mapVisibility === 'highly_compatible_only',
                () => onChangeMapVisibility('highly_compatible_only')
              )}
              {renderRadioOption(
                'Only users I have opted to interact with',
                'Completely hidden until you initiate an introduction request first.',
                mapVisibility === 'opted_interact_only',
                () => onChangeMapVisibility('opted_interact_only')
              )}
              {renderRadioOption(
                'Nobody (Incognito Mode)',
                'Temporarily remove your presence from map discovery corridors entirely.',
                mapVisibility === 'nobody',
                () => onChangeMapVisibility('nobody')
              )}
            </View>
          </View>

          {/* Section 2: Location Granularity */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <MapPin size={15} color={COLORS.routeCyan} />
              <Text style={styles.sectionTitle}>Location Precision On Discovery</Text>
            </View>

            <View style={styles.optionsList}>
              {renderRadioOption(
                'Approximate Area (2.5 - 4.5 km zone)',
                'Shows a generalized privacy circle (e.g. "Thrissur Cultural Belt"). Prevents exact location inference.',
                locationMode === 'approximate_area',
                () => onChangeLocationMode('approximate_area')
              )}
              {renderRadioOption(
                'City Only',
                'Shows only your city name ("Thrissur"). No map pin or route intersection.',
                locationMode === 'city_only',
                () => onChangeLocationMode('city_only')
              )}
              {renderRadioOption(
                'Hidden',
                'Location coordinates are never transmitted to search clients.',
                locationMode === 'hidden',
                () => onChangeLocationMode('hidden')
              )}
            </View>
          </View>

          {/* Section 3: Availability */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Shield size={15} color={COLORS.privacyAccepted} />
              <Text style={styles.sectionTitle}>Introduction Availability</Text>
            </View>

            <View style={styles.optionsList}>
              {renderRadioOption(
                'Available',
                'Open to receiving introduction requests from compatible route matches.',
                availability === 'available',
                () => onChangeAvailability('available')
              )}
              {renderRadioOption(
                'Temporarily Unavailable',
                'Busy with current conversations. Pauses new introduction requests.',
                availability === 'temporarily_unavailable',
                () => onChangeAvailability('temporarily_unavailable')
              )}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.tabContent}>
          {/* Section: Profile Field Visibility Matrix (Section 16) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Field Visibility Matrix</Text>
            <Text style={styles.sectionSubtitle}>
              Configure default exposure states for every personal profile attribute:
            </Text>

            <View style={styles.matrixLegend}>
              <Text style={styles.legendItem}>🔒 Private</Text>
              <Text style={styles.legendItem}>👤 Request Only</Text>
              <Text style={styles.legendItem}>🤝 Accepted</Text>
              <Text style={styles.legendItem}>🌐 Public</Text>
            </View>

            <View style={styles.matrixContainer}>
              {renderMatrixRow('First Name', 'firstName', fieldPerms.firstName)}
              {renderMatrixRow('Full Legal Name', 'fullName', fieldPerms.fullName)}
              {renderMatrixRow('Age', 'age', fieldPerms.age)}
              {renderMatrixRow('Profile Photo', 'profilePhoto', fieldPerms.profilePhoto)}
              {renderMatrixRow('Additional Photos', 'additionalPhotos', fieldPerms.additionalPhotos)}
              {renderMatrixRow('Short Introduction', 'shortIntro', fieldPerms.shortIntro)}
              {renderMatrixRow('Full Biography', 'fullBio', fieldPerms.fullBio)}
              {renderMatrixRow('Profession', 'profession', fieldPerms.profession)}
              {renderMatrixRow('Company / Employer', 'company', fieldPerms.company)}
              {renderMatrixRow('Education Degree', 'education', fieldPerms.education)}
              {renderMatrixRow('City', 'city', fieldPerms.city)}
              {renderMatrixRow('Area / Sub-district', 'area', fieldPerms.area)}
              {renderMatrixRow('Exact Residential Coordinates', 'exactLocation', 'private', true)}
              {renderMatrixRow('Family Information', 'familyOverview', fieldPerms.familyOverview)}
              {renderMatrixRow('Phone Number', 'phoneNumber', fieldPerms.phoneNumber)}
              {renderMatrixRow('Personal Email', 'email', fieldPerms.email)}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 4,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabBtnTextActive: {
    color: '#0B0F14',
  },
  tabContent: {
    gap: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: SPACING.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  optionsList: {
    gap: 8,
  },
  radioCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  radioCardSelected: {
    backgroundColor: 'rgba(229, 139, 88, 0.08)',
    borderColor: COLORS.primary,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioCircleSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.primary,
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  radioLabelSelected: {
    color: COLORS.textPrimary,
  },
  radioDesc: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 14,
  },
  matrixLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  legendItem: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  matrixContainer: {
    gap: 10,
    marginTop: 6,
  },
  matrixRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 6,
  },
  matrixFieldInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matrixFieldName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  matrixFieldWarning: {
    fontSize: 9,
    color: COLORS.error,
    fontWeight: '700',
  },
  matrixButtonGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  matrixBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  matrixBtnSelected: {
    backgroundColor: 'rgba(229, 139, 88, 0.2)',
    borderColor: COLORS.primary,
  },
  matrixBtnDisabled: {
    opacity: 0.3,
  },
  matrixBtnIcon: {
    fontSize: 10,
  },
  matrixBtnText: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  matrixBtnTextSelected: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
