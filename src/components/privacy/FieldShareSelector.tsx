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
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    gap: 8,
  },
  sectionCardSensitive: {
    borderColor: '#FEF3C7',
    backgroundColor: '#FFFBEB',
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    color: '#D97706',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sensitiveNotice: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  checkboxRowChecked: {
    backgroundColor: '#EFF6FF',
  },
  checkboxRowDisabled: {
    opacity: 0.55,
  },
  checkboxSquare: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSquareChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxSquareHighRisk: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  checkboxSquareForbidden: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  labelContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  labelTextChecked: {
    color: '#0F172A',
    fontWeight: '700',
  },
  labelTextForbidden: {
    color: '#94A3B8',
  },
  labelSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  labelSubtitleForbidden: {
    color: '#EF4444',
    fontWeight: '600',
  },
});
