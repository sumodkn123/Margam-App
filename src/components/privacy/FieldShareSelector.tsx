// MARGAM - "What would you like to share?" Granular Consent Selector
// Enforces granular field-level toggles and prevents accidental PII disclosure

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { UserShareSelection, RouteShareSelection, RequestType } from '../../types';
import { Check, Lock, AlertTriangle, ShieldCheck } from 'lucide-react-native';

interface FieldShareSelectorProps {
  shareSelection: UserShareSelection;
  onChangeShareSelection: (newSelection: UserShareSelection) => void;
  requestType: RequestType;
  routeSelection?: RouteShareSelection;
  onChangeRouteSelection?: (newRouteSelection: RouteShareSelection) => void;
}

export const FieldShareSelector: React.FC<FieldShareSelectorProps> = ({
  shareSelection,
  onChangeShareSelection,
  requestType,
  routeSelection,
  onChangeRouteSelection,
}) => {
  const toggleUserField = (field: keyof UserShareSelection) => {
    if (field === 'exactLocation') return; // Invariant: exact location is permanently locked
    onChangeShareSelection({
      ...shareSelection,
      [field]: !shareSelection[field],
    });
  };

  const toggleRouteField = (field: keyof RouteShareSelection) => {
    if (!routeSelection || !onChangeRouteSelection) return;
    onChangeRouteSelection({
      ...routeSelection,
      [field]: !routeSelection[field],
    });
  };

  const renderCheckboxRow = (
    label: string,
    checked: boolean,
    onToggle: () => void,
    isForbidden: boolean = false,
    subtitle?: string,
    isHighRisk: boolean = false
  ) => {
    return (
      <TouchableOpacity
        style={[
          styles.checkboxRow,
          checked && styles.checkboxRowChecked,
          isForbidden && styles.checkboxRowDisabled,
        ]}
        onPress={onToggle}
        disabled={isForbidden}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkboxSquare,
            checked && styles.checkboxSquareChecked,
            isForbidden && styles.checkboxSquareForbidden,
            isHighRisk && checked && styles.checkboxSquareHighRisk,
          ]}
        >
          {checked && !isForbidden && <Check size={13} color="#0B0F14" strokeWidth={3} />}
          {isForbidden && <Lock size={11} color={COLORS.textMuted} />}
        </View>

        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.labelText,
              checked && styles.labelTextChecked,
              isForbidden && styles.labelTextForbidden,
            ]}
          >
            {label}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.labelSubtitle,
                isForbidden && styles.labelSubtitleForbidden,
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Category: Basic Information */}
      <View style={styles.sectionCard}>
        <Text style={styles.categoryTitle}>Basic Information</Text>
        {renderCheckboxRow('First name', shareSelection.firstName, () => toggleUserField('firstName'))}
        {renderCheckboxRow('Age', shareSelection.age, () => toggleUserField('age'))}
        {renderCheckboxRow('Gender', shareSelection.gender, () => toggleUserField('gender'))}
        {renderCheckboxRow(
          'Full name (Surname)', 
          shareSelection.fullName, 
          () => toggleUserField('fullName'),
          false,
          'Recommend keeping private until mutual acceptance'
        )}
      </View>

      {/* Category: Photos */}
      <View style={styles.sectionCard}>
        <Text style={styles.categoryTitle}>Photographs</Text>
        {renderCheckboxRow('Profile photo', shareSelection.profilePhoto, () => toggleUserField('profilePhoto'))}
        {renderCheckboxRow('Additional photos', shareSelection.additionalPhotos, () => toggleUserField('additionalPhotos'), false, 'Shared galleries')}
      </View>

      {/* Category: About Me */}
      <View style={styles.sectionCard}>
        <Text style={styles.categoryTitle}>About Me</Text>
        {renderCheckboxRow('Short introduction', shareSelection.shortIntro, () => toggleUserField('shortIntro'))}
        {renderCheckboxRow('Full biography', shareSelection.fullBio, () => toggleUserField('fullBio'))}
      </View>

      {/* Category: Career & Education */}
      <View style={styles.sectionCard}>
        <Text style={styles.categoryTitle}>Career & Education</Text>
        {renderCheckboxRow('Profession / Role', shareSelection.profession, () => toggleUserField('profession'))}
        {renderCheckboxRow('Education degree', shareSelection.education, () => toggleUserField('education'))}
        {renderCheckboxRow('Company / Employer', shareSelection.company, () => toggleUserField('company'))}
        {renderCheckboxRow('College / Institution', shareSelection.institution, () => toggleUserField('institution'))}
        {renderCheckboxRow('Workplace office location', shareSelection.workplaceLocation, () => toggleUserField('workplaceLocation'))}
      </View>

      {/* Category: Location (Absolute Invariant Check) */}
      <View style={styles.sectionCard}>
        <Text style={styles.categoryTitle}>Location</Text>
        {renderCheckboxRow('City (e.g., Thrissur)', shareSelection.city, () => toggleUserField('city'))}
        {renderCheckboxRow('General Area / District', shareSelection.area, () => toggleUserField('area'))}
        {renderCheckboxRow(
          'Exact Home / Residence Coordinates',
          false,
          () => {},
          true,
          'PERMANENTLY LOCKED — Margam never allows exact residential sharing'
        )}
      </View>

      {/* Category: Route Information (if Route Meet or Trip Request) */}
      {routeSelection && onChangeRouteSelection && (
        <View style={styles.sectionCard}>
          <Text style={styles.categoryTitle}>Travel & Route Visibility</Text>
          {renderCheckboxRow('Destination city', routeSelection.destinationCity, () => toggleRouteField('destinationCity'))}
          {renderCheckboxRow('Approximate arrival area', routeSelection.approximateArrivalArea, () => toggleRouteField('approximateArrivalArea'))}
          {renderCheckboxRow('Approximate arrival time', routeSelection.approximateArrivalTime, () => toggleRouteField('approximateArrivalTime'))}
          {renderCheckboxRow('Exact route track', routeSelection.exactRoute, () => toggleRouteField('exactRoute'), false, 'Keeps corridor private by default')}
          {renderCheckboxRow(
            'Live GPS Tracking',
            false,
            () => {},
            true,
            'PERMANENTLY LOCKED — Never shared automatically'
          )}
        </View>
      )}

      {/* Category: Lifestyle & Family */}
      <View style={styles.sectionCard}>
        <Text style={styles.categoryTitle}>Lifestyle & Family</Text>
        {renderCheckboxRow('Lifestyle preferences', shareSelection.lifestylePreferences, () => toggleUserField('lifestylePreferences'))}
        {renderCheckboxRow('Detailed lifestyle information', shareSelection.detailedLifestyle, () => toggleUserField('detailedLifestyle'))}
        {renderCheckboxRow('Family overview', shareSelection.familyOverview, () => toggleUserField('familyOverview'))}
        {renderCheckboxRow('Detailed family background', shareSelection.detailedFamily, () => toggleUserField('detailedFamily'))}
      </View>

      {/* Category: Contact Information (Default OFF & High-Risk Alert) */}
      <View style={[styles.sectionCard, styles.sectionCardSensitive]}>
        <View style={styles.sensitiveHeader}>
          <AlertTriangle size={14} color={COLORS.warning} />
          <Text style={styles.categoryTitleSensitive}>Direct Contact Information</Text>
        </View>
        <Text style={styles.sensitiveNotice}>
          Disabled by default. In Margam, conversation unlocks inside the app after acceptance without needing to expose personal numbers or emails.
        </Text>
        {renderCheckboxRow('Phone number', shareSelection.phoneNumber, () => toggleUserField('phoneNumber'), false, 'Direct mobile line', true)}
        {renderCheckboxRow('Personal Email', shareSelection.email, () => toggleUserField('email'), false, 'Personal email address', true)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 8,
  },
  sectionCardSensitive: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sensitiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTitleSensitive: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sensitiveNotice: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  checkboxRowChecked: {
    backgroundColor: 'rgba(229, 139, 88, 0.08)',
  },
  checkboxRowDisabled: {
    opacity: 0.6,
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxSquareChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxSquareHighRisk: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  checkboxSquareForbidden: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  labelContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  labelTextChecked: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  labelTextForbidden: {
    color: COLORS.textMuted,
  },
  labelSubtitle: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  labelSubtitleForbidden: {
    color: COLORS.error,
    fontWeight: '600',
  },
});
