import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, Sliders, Check, RotateCcw } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { DiscoveryFilterParams } from '../../types';

interface DiscoveryFilterModalProps {
  visible: boolean;
  filters: DiscoveryFilterParams;
  onApply: (filters: DiscoveryFilterParams) => void;
  onClose: () => void;
}

export const DEFAULT_FILTERS: DiscoveryFilterParams = {
  minAge: 23,
  maxAge: 35,
  maxDistanceKm: 25,
  minCompatibility: 75,
  marriageTimeline: 'All',
  professionCategory: 'All',
  verifiedOnly: false,
  targetGender: 'Female',
  selectedMargam: 'All',
  margamIntent: 'All',
  openToIntroductionsOnly: false,
  openToMeetingsOnly: false,
};

const COMPATIBILITY_OPTIONS = [70, 75, 80, 85, 90, 95];
const DISTANCE_OPTIONS = [1, 3, 5, 10, 25, 50, 100];
const TIMELINE_OPTIONS = ['All', 'Within 6 months', 'Within 1 year', 'Flexible timeline'];
const PROFESSION_OPTIONS = ['All', 'Tech', 'Healthcare', 'Finance', 'Design', 'Engineering', 'Education'];
const MARGAM_OPTIONS = ['All', 'Café Business', 'Travel', 'Fitness', 'Food & Cooking', 'Photography', 'Nature', 'Adventure'];
const INTENT_OPTIONS = ['All', 'Interested', 'Regularly Does', 'Future Goal', 'Wants to Build This'];

export const DiscoveryFilterModal: React.FC<DiscoveryFilterModalProps> = ({
  visible,
  filters,
  onApply,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<DiscoveryFilterParams>(filters);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Sliders size={20} color={THEME.colors.primary} />
              <Text style={styles.headerTitle}>Discovery Preferences</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Section 1: MATCH - Minimum Compatibility Threshold */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Minimum Compatibility</Text>
                <Text style={styles.sectionValueBadge}>{localFilters.minCompatibility}% or higher</Text>
              </View>
              <Text style={styles.sectionHint}>
                Profiles below this match score are filtered out from your map.
              </Text>
              <View style={styles.pillRow}>
                {COMPATIBILITY_OPTIONS.map((val) => {
                  const isSelected = localFilters.minCompatibility === val;
                  return (
                    <TouchableOpacity
                      key={val}
                      style={[styles.pill, isSelected && styles.pillSelected]}
                      onPress={() => setLocalFilters({ ...localFilters, minCompatibility: val })}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                        {val}%+
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 2: MARGAMS - Interest Integration */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Margam Interest</Text>
                <Text style={styles.sectionValueBadge}>{localFilters.selectedMargam || 'All'}</Text>
              </View>
              <Text style={styles.sectionHint}>
                Discover candidates who walk a shared life path or interest.
              </Text>
              <View style={styles.wrapPillRow}>
                {MARGAM_OPTIONS.map((margam) => {
                  const isSelected = (localFilters.selectedMargam || 'All') === margam;
                  return (
                    <TouchableOpacity
                      key={margam}
                      style={[styles.wrapPill, isSelected && styles.wrapPillSelected]}
                      onPress={() => setLocalFilters({ ...localFilters, selectedMargam: margam })}
                      activeOpacity={0.8}
                    >
                      {isSelected && <Check size={13} color="#FFFFFF" style={{ marginRight: 4 }} />}
                      <Text style={[styles.wrapPillText, isSelected && styles.wrapPillTextSelected]}>
                        {margam}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 3: MARGAM INTENT */}
            {localFilters.selectedMargam && localFilters.selectedMargam !== 'All' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interest Intent</Text>
                <Text style={styles.sectionHint}>
                  Match by what they want to do with this Margam.
                </Text>
                <View style={styles.wrapPillRow}>
                  {INTENT_OPTIONS.map((intent) => {
                    const isSelected = (localFilters.margamIntent || 'All') === intent;
                    return (
                      <TouchableOpacity
                        key={intent}
                        style={[styles.wrapPill, isSelected && styles.wrapPillSelected]}
                        onPress={() => setLocalFilters({ ...localFilters, margamIntent: intent })}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.wrapPillText, isSelected && styles.wrapPillTextSelected]}>
                          {intent}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Section 4: LOCATION - Maximum Distance */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Search Radius</Text>
                <Text style={styles.sectionValueBadge}>Up to {localFilters.maxDistanceKm} km</Text>
              </View>
              <Text style={styles.sectionHint}>
                Radius around your current location or selected destination.
              </Text>
              <View style={styles.pillRow}>
                {DISTANCE_OPTIONS.map((val) => {
                  const isSelected = localFilters.maxDistanceKm === val;
                  return (
                    <TouchableOpacity
                      key={val}
                      style={[styles.pill, isSelected && styles.pillSelected]}
                      onPress={() => setLocalFilters({ ...localFilters, maxDistanceKm: val })}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                        {val} km
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 5: Age Range */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Age Range</Text>
                <Text style={styles.sectionValueBadge}>
                  {localFilters.minAge} – {localFilters.maxAge} yrs
                </Text>
              </View>
              <View style={styles.stepperRow}>
                <View style={styles.stepperGroup}>
                  <Text style={styles.stepperLabel}>Min Age</Text>
                  <View style={styles.stepperControls}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          minAge: Math.max(21, localFilters.minAge - 1),
                        })
                      }
                    >
                      <Text style={styles.stepperBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperVal}>{localFilters.minAge}</Text>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          minAge: Math.min(localFilters.maxAge - 1, localFilters.minAge + 1),
                        })
                      }
                    >
                      <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.stepperDivider} />

                <View style={styles.stepperGroup}>
                  <Text style={styles.stepperLabel}>Max Age</Text>
                  <View style={styles.stepperControls}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          maxAge: Math.max(localFilters.minAge + 1, localFilters.maxAge - 1),
                        })
                      }
                    >
                      <Text style={styles.stepperBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperVal}>{localFilters.maxAge}</Text>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          maxAge: Math.min(48, localFilters.maxAge + 1),
                        })
                      }
                    >
                      <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Section 6: Marriage Timeline */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Marriage Timeline</Text>
              <View style={styles.wrapPillRow}>
                {TIMELINE_OPTIONS.map((item) => {
                  const isSelected = localFilters.marriageTimeline === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[styles.wrapPill, isSelected && styles.wrapPillSelected]}
                      onPress={() => setLocalFilters({ ...localFilters, marriageTimeline: item })}
                      activeOpacity={0.8}
                    >
                      {isSelected && <Check size={14} color="#FFFFFF" style={{ marginRight: 6 }} />}
                      <Text style={[styles.wrapPillText, isSelected && styles.wrapPillTextSelected]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 7: Verified & Meeting Toggles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile & Availability</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, localFilters.verifiedOnly && styles.toggleBtnActive]}
                  onPress={() =>
                    setLocalFilters({
                      ...localFilters,
                      verifiedOnly: !localFilters.verifiedOnly,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Text style={[styles.toggleBtnText, localFilters.verifiedOnly && styles.toggleBtnTextActive]}>
                    ✓ Verified Profiles Only
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.toggleBtn, localFilters.openToMeetingsOnly && styles.toggleBtnActive]}
                  onPress={() =>
                    setLocalFilters({
                      ...localFilters,
                      openToMeetingsOnly: !localFilters.openToMeetingsOnly,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Text style={[styles.toggleBtnText, localFilters.openToMeetingsOnly && styles.toggleBtnTextActive]}>
                    ☕ Open to Public Meeting
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <RotateCcw size={16} color={THEME.colors.textSecondary} />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              activeOpacity={0.88}
              onPress={handleApply}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 23, 44, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  sectionValueBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.primary,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sectionHint: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: THEME.colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  stepperRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  stepperGroup: {
    flex: 1,
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  stepperVal: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  stepperDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  wrapPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  wrapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  wrapPillSelected: {
    backgroundColor: THEME.colors.primary,
  },
  wrapPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.colors.textPrimary,
  },
  wrapPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  applyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
});
