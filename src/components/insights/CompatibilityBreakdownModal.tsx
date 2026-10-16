import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Heart,
  Clock,
  Briefcase,
  MapPin,
  Home,
  Compass,
} from 'lucide-react-native';
import { AnonymousCandidate, DetailedCompatibilityBreakdown } from '../../types';
import { computeDetailedCompatibilityBreakdown } from '../../services/insightsService';
import { THEME } from '../../constants/theme';

interface CompatibilityBreakdownModalProps {
  visible: boolean;
  candidate: AnonymousCandidate | null;
  onClose: () => void;
  onRequestIntroduction: (candidate: AnonymousCandidate) => void;
}

export const CompatibilityBreakdownModal: React.FC<CompatibilityBreakdownModalProps> = ({
  visible,
  candidate,
  onClose,
  onRequestIntroduction,
}) => {
  if (!candidate) return null;

  const breakdown: DetailedCompatibilityBreakdown = computeDetailedCompatibilityBreakdown(
    undefined,
    candidate
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Marriage Goals':
        return <Heart size={16} color="#E11D48" />;
      case 'Lifestyle & Habits':
        return <Clock size={16} color="#059669" />;
      case 'Location & Commute':
        return <MapPin size={16} color="#2563EB" />;
      case 'Education & Career':
        return <Briefcase size={16} color="#7C3AED" />;
      case 'Family Values':
        return <Home size={16} color="#D97706" />;
      default:
        return <Compass size={16} color="#0D9488" />;
    }
  };

  const getRatingBadgeStyle = (rating: string) => {
    switch (rating) {
      case 'Exceptional':
        return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
      case 'Very strong':
        return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
      case 'Strong':
        return { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' };
      default:
        return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
    }
  };

  const categories = Object.values(breakdown.categories);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <X size={20} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Compatibility Breakdown</Text>
            <Text style={styles.headerSubTitle}>Why this match aligns with you</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Overall Score Hero Card */}
          <View style={styles.heroScoreCard}>
            <View style={styles.scoreCircle}>
              <Sparkles size={22} color="#D97706" />
              <Text style={styles.scoreNumber}>{breakdown.overallPercentage}%</Text>
              <Text style={styles.scoreLabel}>Alignment</Text>
            </View>

            <View style={styles.heroTextCol}>
              <View style={styles.verifiedRow}>
                <View style={styles.verifiedDot} />
                <Text style={styles.verifiedBadgeText}>Privacy-Safe Match</Text>
              </View>
              <Text style={styles.candidateZoneText}>{candidate.approximateZone}</Text>
              <Text style={styles.candidateDistanceText}>{candidate.distanceLabel}</Text>
              <Text style={styles.factualStatement}>
                Calculated across 6 foundational life dimensions using your verified preferences.
              </Text>
            </View>
          </View>

          {/* Key Shared Alignments */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderTitle}>Key Shared Alignments</Text>
            <View style={styles.alignmentsList}>
              {breakdown.keyAlignments.map((alignment, idx) => (
                <View key={`align-${idx}`} style={styles.alignmentRow}>
                  <CheckCircle2 size={16} color="#059669" style={{ marginTop: 2 }} />
                  <Text style={styles.alignmentText}>{alignment}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 6 Foundational Dimension Breakdown */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderTitle}>Dimensional Breakdown</Text>
            <Text style={styles.sectionSubTitle}>
              Detailed evaluation based on your active matrimonial criteria
            </Text>

            {categories.map((cat, idx) => {
              const badge = getRatingBadgeStyle(cat.rating);
              return (
                <View key={`cat-${idx}`} style={styles.categoryItem}>
                  <View style={styles.categoryHeaderRow}>
                    <View style={styles.catTitleLeft}>
                      <View style={styles.catIconWrap}>{getCategoryIcon(cat.category)}</View>
                      <Text style={styles.catName}>{cat.category}</Text>
                    </View>
                    <View
                      style={[
                        styles.ratingPill,
                        { backgroundColor: badge.bg, borderColor: badge.border },
                      ]}
                    >
                      <Text style={[styles.ratingPillText, { color: badge.text }]}>
                        {cat.rating} ({cat.percentage}%)
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${cat.percentage}%`, backgroundColor: badge.text },
                      ]}
                    />
                  </View>

                  <Text style={styles.catDetailsText}>{cat.details}</Text>
                </View>
              );
            })}
          </View>

          {/* Constructive Considerations / Potential Differences */}
          <View style={[styles.sectionCard, styles.differencesCard]}>
            <View style={styles.diffHeaderRow}>
              <AlertCircle size={16} color="#64748B" />
              <Text style={styles.diffHeaderTitle}>Considerations for Discussion</Text>
            </View>
            <Text style={styles.diffDescription}>
              Factual aspects where routines or locations differ, ideal topics for initial safe conversation:
            </Text>
            {breakdown.potentialDifferences.map((diff, idx) => (
              <View key={`diff-${idx}`} style={styles.diffItemRow}>
                <View style={styles.diffBullet} />
                <Text style={styles.diffItemText}>{diff}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Floating Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.introBtn}
            activeOpacity={0.88}
            onPress={() => {
              onClose();
              onRequestIntroduction(candidate);
            }}
          >
            <Send size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.introBtnText}>Request Introduction</Text>
          </TouchableOpacity>
        </View>
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
  headerTitleContainer: {
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
  scrollContent: {
    padding: 16,
  },
  heroScoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  scoreCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFFBEB',
    borderWidth: 3,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scoreNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 2,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
    textTransform: 'uppercase',
  },
  heroTextCol: {
    flex: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  verifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  candidateZoneText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  candidateDistanceText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  factualStatement: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  alignmentsList: {
    marginTop: 8,
    gap: 10,
  },
  alignmentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  alignmentText: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
    lineHeight: 18,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  catTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  ratingPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  ratingPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  catDetailsText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  differencesCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  diffHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  diffHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  diffDescription: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    lineHeight: 17,
  },
  diffItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  diffBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#94A3B8',
    marginTop: 6,
  },
  diffItemText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  introBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  introBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
