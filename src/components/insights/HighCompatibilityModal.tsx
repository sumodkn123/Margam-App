import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  X,
  Sparkles,
  Heart,
  Briefcase,
  Home,
  Clock,
  Send,
  EyeOff,
  Info,
  CheckCircle2,
} from 'lucide-react-native';
import { AnonymousCandidate } from '../../types';
import {
  getHighCompatibilityMatches,
  markCandidateSaved,
  markCandidateDismissed,
  isCandidateSaved,
  HighCompatibilityResult,
} from '../../services/insightsService';
import { CompatibilityBreakdownModal } from './CompatibilityBreakdownModal';
import { THEME } from '../../constants/theme';

interface HighCompatibilityModalProps {
  visible: boolean;
  onClose: () => void;
  onRequestIntroduction: (candidate: AnonymousCandidate) => void;
}

export const HighCompatibilityModal: React.FC<HighCompatibilityModalProps> = ({
  visible,
  onClose,
  onRequestIntroduction,
}) => {
  const [threshold, setThreshold] = useState<number>(85);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [selectedCandidateForBreakdown, setSelectedCandidateForBreakdown] =
    useState<AnonymousCandidate | null>(null);

  const [data, setData] = useState<HighCompatibilityResult>(() =>
    getHighCompatibilityMatches({ threshold: 85 })
  );

  useEffect(() => {
    if (visible) {
      const res = getHighCompatibilityMatches({ threshold });
      setData(res);
    }
  }, [visible, threshold]);

  const handleToggleSave = (cand: AnonymousCandidate) => {
    const isSaved = savedIds.has(cand.id) || isCandidateSaved(cand.id);
    markCandidateSaved(cand.id, !isSaved);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(cand.id);
      else next.add(cand.id);
      return next;
    });
  };

  const handleDismiss = (cand: AnonymousCandidate) => {
    markCandidateDismissed(cand.id);
    setDismissedIds((prev) => new Set(prev).add(cand.id));
    Alert.alert('Profile Hidden', 'This match has been removed from your High Compatibility recommendations.');
  };

  const visibleCandidates = data.candidates.filter((c) => !dismissedIds.has(c.id));
  const thresholdOptions = [80, 85, 90, 95];

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeContainer}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <X size={20} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>High Compatibility Matches</Text>
            <Text style={styles.headerSubTitle}>Profiles with exceptional matrimonial alignment</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Threshold Selector Banner */}
        <View style={styles.thresholdBanner}>
          <View style={styles.thresholdHeader}>
            <Sparkles size={16} color="#D97706" />
            <Text style={styles.thresholdTitle}>Compatibility Cutoff Threshold</Text>
          </View>
          <Text style={styles.thresholdSub}>
            Prioritizes foundational life compatibility over pure geographic proximity
          </Text>

          <View style={styles.thresholdRow}>
            {thresholdOptions.map((t) => {
              const active = threshold === t;
              return (
                <TouchableOpacity
                  key={`th-${t}`}
                  style={[styles.thresholdChip, active && styles.thresholdChipActive]}
                  onPress={() => setThreshold(t)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.thresholdChipText,
                      active && styles.thresholdChipTextActive,
                    ]}
                  >
                    {t}%+
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Alignment Metrics Strip */}
        <View style={styles.metricsStrip}>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{visibleCandidates.length}</Text>
            <Text style={styles.metricLbl}>Profiles</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{data.averageCompatibility}%</Text>
            <Text style={styles.metricLbl}>Avg Match</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{data.alignmentSummary.alignedTimelineCount}</Text>
            <Text style={styles.metricLbl}>Same Timeline</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{data.alignmentSummary.bothVegetarianCount}</Text>
            <Text style={styles.metricLbl}>Dietary Align</Text>
          </View>
        </View>

        {/* Candidates List */}
        <ScrollView
          style={styles.scrollList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {visibleCandidates.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No profiles found at {threshold}%+ cutoff</Text>
              <Text style={styles.emptySub}>
                Try lowering the threshold to 80% or 85% to view more highly aligned candidates.
              </Text>
            </View>
          ) : (
            visibleCandidates.map((cand) => {
              const isSaved = savedIds.has(cand.id) || isCandidateSaved(cand.id);

              return (
                <View key={cand.id} style={styles.candidateCard}>
                  {/* Card Header */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.scorePill}>
                      <Sparkles size={14} color="#D97706" />
                      <Text style={styles.scorePillText}>
                        {cand.compatibilityPercentage}% Match
                      </Text>
                    </View>

                    <View style={styles.topActions}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleToggleSave(cand)}
                        activeOpacity={0.7}
                      >
                        <Heart
                          size={16}
                          color={isSaved ? '#E11D48' : '#64748B'}
                          fill={isSaved ? '#E11D48' : 'none'}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleDismiss(cand)}
                        activeOpacity={0.7}
                      >
                        <EyeOff size={16} color="#64748B" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Body */}
                  <View style={styles.bodyRow}>
                    <View style={styles.scoreBadgeCircle}>
                      <Text style={styles.circleNumber}>{cand.compatibilityPercentage}%</Text>
                    </View>
                    <View style={styles.infoCol}>
                      <Text style={styles.zoneName}>{cand.approximateZone}</Text>
                      <Text style={styles.distanceLabel}>{cand.distanceLabel}</Text>
                      <Text style={styles.availabilityNote}>{cand.availabilityNote}</Text>
                    </View>
                  </View>

                  {/* Foundational Alignment Badges */}
                  <View style={styles.badgesRow}>
                    <View style={styles.alignmentBadge}>
                      <Clock size={11} color="#059669" />
                      <Text style={styles.alignmentBadgeText}>Timeline Match</Text>
                    </View>
                    <View style={styles.alignmentBadge}>
                      <Heart size={11} color="#E11D48" />
                      <Text style={styles.alignmentBadgeText}>Lifestyle Alignment</Text>
                    </View>
                    <View style={styles.alignmentBadge}>
                      <Briefcase size={11} color="#2563EB" />
                      <Text style={styles.alignmentBadgeText}>Career Synergy</Text>
                    </View>
                    <View style={styles.alignmentBadge}>
                      <Home size={11} color="#D97706" />
                      <Text style={styles.alignmentBadgeText}>Family Values</Text>
                    </View>
                  </View>

                  {/* "Why this match?" button */}
                  <TouchableOpacity
                    style={styles.whyBtn}
                    activeOpacity={0.8}
                    onPress={() => setSelectedCandidateForBreakdown(cand)}
                  >
                    <Info size={14} color="#B45309" style={{ marginRight: 6 }} />
                    <Text style={styles.whyBtnText}>Why this match? (View 6D Breakdown)</Text>
                  </TouchableOpacity>

                  {/* Request Introduction CTA */}
                  <TouchableOpacity
                    style={styles.introBtn}
                    activeOpacity={0.88}
                    onPress={() => {
                      onClose();
                      onRequestIntroduction(cand);
                    }}
                  >
                    <Send size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.introBtnText}>Request Introduction</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Compatibility Breakdown Sub-Modal */}
        <CompatibilityBreakdownModal
          visible={selectedCandidateForBreakdown !== null}
          candidate={selectedCandidateForBreakdown}
          onClose={() => setSelectedCandidateForBreakdown(null)}
          onRequestIntroduction={(c) => {
            setSelectedCandidateForBreakdown(null);
            onClose();
            onRequestIntroduction(c);
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  thresholdBanner: {
    backgroundColor: '#FFFBEB',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  thresholdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  thresholdTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  thresholdSub: {
    fontSize: 11,
    color: '#92400E',
    marginBottom: 10,
  },
  thresholdRow: {
    flexDirection: 'row',
    gap: 8,
  },
  thresholdChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
  },
  thresholdChipActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  thresholdChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  thresholdChipTextActive: {
    color: '#FFFFFF',
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricLbl: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  scrollList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  candidateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  scorePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreBadgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFBEB',
    borderWidth: 2,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  circleNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B45309',
  },
  infoCol: {
    flex: 1,
  },
  zoneName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  distanceLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  availabilityNote: {
    fontSize: 11,
    color: '#059669',
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  alignmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  alignmentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  whyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 10,
  },
  whyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  introBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
