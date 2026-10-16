import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
} from 'react-native';
import { SlidersHorizontal, Check, X, Sparkles, RotateCcw } from 'lucide-react-native';
import { MargamSwipeFilterOptions } from '../../types';
import { DEFAULT_SWIPE_FILTERS, getSwipeDiscoveryQueue } from '../../services/swipeDiscoveryService';

const { width } = Dimensions.get('window');

interface MargamFilterPanelModalProps {
  visible: boolean;
  filters: MargamSwipeFilterOptions;
  onApplyFilters: (updated: MargamSwipeFilterOptions) => void;
  onClose: () => void;
}

const INTENT_OPTIONS = [
  { key: 'love_this', label: 'Enjoys this' },
  { key: 'regularly_do', label: 'Regularly does this' },
  { key: 'want_to_try', label: 'Wants to try this' },
  { key: 'want_partner_who_likes', label: 'Wants a partner who likes this' },
  { key: 'want_to_build', label: 'Wants to build this' },
  { key: 'future_goal', label: 'Future goal' },
];

export const MargamFilterPanelModal: React.FC<MargamFilterPanelModalProps> = ({
  visible,
  filters,
  onApplyFilters,
  onClose,
}) => {
  const [draftFilters, setDraftFilters] = useState<MargamSwipeFilterOptions>(filters);

  // Sync draft filters when modal opens
  React.useEffect(() => {
    if (visible) {
      setDraftFilters(filters);
    }
  }, [visible, filters]);

  // Compute real potential matches based on draft filters
  const matchCount = useMemo(() => {
    const queue = getSwipeDiscoveryQueue('usr-current', draftFilters);
    return queue.length;
  }, [draftFilters]);

  const toggleIntent = (key: string) => {
    setDraftFilters((prev) => {
      const exists = prev.intentFilters.includes(key);
      const updated = exists
        ? prev.intentFilters.filter((k) => k !== key)
        : [...prev.intentFilters, key];
      return { ...prev, intentFilters: updated };
    });
  };

  const handleReset = () => {
    setDraftFilters(DEFAULT_SWIPE_FILTERS);
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <SlidersHorizontal size={20} color="#0F172A" style={{ marginRight: 8 }} />
            <Text style={styles.headerTitle}>Discovery Filters</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollBody} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Section 1: Multi-Margam Match Mode */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Margam Match Mode</Text>
            <Text style={styles.sectionSubtitle}>
              How shared interests are matched across multiple candidates
            </Text>

            <View style={styles.segmentedRow}>
              <TouchableOpacity
                style={[styles.segmentBtn, draftFilters.matchMode === 'ANY' && styles.segmentBtnActive]}
                activeOpacity={0.8}
                onPress={() => setDraftFilters((prev) => ({ ...prev, matchMode: 'ANY' }))}
              >
                <Text style={[styles.segmentBtnText, draftFilters.matchMode === 'ANY' && styles.segmentBtnTextActive]}>
                  Match ANY (Broader)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.segmentBtn, draftFilters.matchMode === 'ALL' && styles.segmentBtnActive]}
                activeOpacity={0.8}
                onPress={() => setDraftFilters((prev) => ({ ...prev, matchMode: 'ALL' }))}
              >
                <Text style={[styles.segmentBtnText, draftFilters.matchMode === 'ALL' && styles.segmentBtnTextActive]}>
                  Match ALL (Strict)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 2: Core Margam Only Filter */}
          <View style={styles.sectionCard}>
            <View style={styles.switchRow}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.sectionTitle}>Core Margam Only</Text>
                <Text style={styles.sectionSubtitle}>
                  Show only candidates where {draftFilters.selectedMargam} is marked as a foundational life goal (not just a casual hobby).
                </Text>
              </View>
              <Switch
                value={draftFilters.coreOnly}
                onValueChange={(val) => setDraftFilters((prev) => ({ ...prev, coreOnly: val }))}
                trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Section 3: Intent Filter */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Shared Intent Level</Text>
            <Text style={styles.sectionSubtitle}>
              Filter by what candidates want to do with this Margam
            </Text>

            <View style={styles.chipsGrid}>
              {INTENT_OPTIONS.map((opt) => {
                const isSelected = draftFilters.intentFilters.includes(opt.key);
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.intentChip, isSelected && styles.intentChipSelected]}
                    activeOpacity={0.8}
                    onPress={() => toggleIntent(opt.key)}
                  >
                    {isSelected && <Check size={13} color="#2563EB" style={{ marginRight: 4 }} />}
                    <Text style={[styles.intentChipText, isSelected && styles.intentChipTextSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 4: Minimum Compatibility Threshold */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              Minimum Compatibility: {draftFilters.minCompatibility}%
            </Text>
            <Text style={styles.sectionSubtitle}>
              Profiles with comprehensive synergy across marriage timeline, lifestyle, and values
            </Text>

            <View style={styles.compatThresholdsRow}>
              {[70, 75, 80, 85, 90].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.compatPillBtn,
                    draftFilters.minCompatibility === val && styles.compatPillBtnActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setDraftFilters((prev) => ({ ...prev, minCompatibility: val }))}
                >
                  <Text
                    style={[
                      styles.compatPillBtnText,
                      draftFilters.minCompatibility === val && styles.compatPillBtnTextActive,
                    ]}
                  >
                    {val}%+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Section 5: Verification & Safety */}
          <View style={styles.sectionCard}>
            <View style={styles.switchRow}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.sectionTitle}>Verified Profiles Only</Text>
                <Text style={styles.sectionSubtitle}>
                  Show only candidates with verified ID, liveness check, and confirmed profession
                </Text>
              </View>
              <Switch
                value={draftFilters.verifiedOnly}
                onValueChange={(val) => setDraftFilters((prev) => ({ ...prev, verifiedOnly: val }))}
                trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Section 6: Relocation Preferences */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Relocation Flexibility</Text>
            <View style={styles.segmentedRow}>
              {['Any', 'Within Kerala', 'Within India / Abroad'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.segmentBtn,
                    (draftFilters.relocation || 'Any') === r && styles.segmentBtnActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setDraftFilters((prev) => ({ ...prev, relocation: r }))}
                >
                  <Text
                    style={[
                      styles.segmentBtnText,
                      (draftFilters.relocation || 'Any') === r && styles.segmentBtnTextActive,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footerBar}>
          <TouchableOpacity style={styles.resetBtn} activeOpacity={0.8} onPress={handleReset}>
            <RotateCcw size={15} color="#64748B" style={{ marginRight: 4 }} />
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyBtn} activeOpacity={0.85} onPress={handleApply}>
            <Text style={styles.applyBtnText}>
              {matchCount > 0 ? `Apply Filters (${matchCount} Profiles)` : 'No Matches — Broaden Filters'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    flex: 1,
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 2,
    marginBottom: 12,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentBtnTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  intentChipSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  intentChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  intentChipTextSelected: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  compatThresholdsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  compatPillBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  compatPillBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  compatPillBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  compatPillBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  applyBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
