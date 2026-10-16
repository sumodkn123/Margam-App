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
  Users,
  Sparkles,
  MapPin,
  Clock,
  Send,
  Heart,
  EyeOff,
  Map,
  CheckCircle2,
} from 'lucide-react-native';
import { AnonymousCandidate } from '../../types';
import {
  getNewMatches,
  markCandidateSaved,
  markCandidateDismissed,
  isCandidateSaved,
  markCandidateSeen,
} from '../../services/insightsService';
import { THEME } from '../../constants/theme';

interface NewMatchesModalProps {
  visible: boolean;
  onClose: () => void;
  onRequestIntroduction: (candidate: AnonymousCandidate) => void;
  onViewOnMap: () => void;
  onSelectCandidate?: (candidate: AnonymousCandidate) => void;
}

type FilterSortType = 'newest' | 'compatibility' | 'nearest' | 'available_now' | 'verified';

export const NewMatchesModal: React.FC<NewMatchesModalProps> = ({
  visible,
  onClose,
  onRequestIntroduction,
  onViewOnMap,
  onSelectCandidate,
}) => {
  const [activeSort, setActiveSort] = useState<FilterSortType>('newest');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Load new matches directly from engine
  const [result, setResult] = useState(() => getNewMatches({ filterSort: 'newest' }));

  useEffect(() => {
    if (visible) {
      const res = getNewMatches({ filterSort: activeSort });
      setResult(res);
    }
  }, [visible, activeSort]);

  const handleToggleSave = (candidate: AnonymousCandidate) => {
    const currentlySaved = savedIds.has(candidate.id) || isCandidateSaved(candidate.id);
    markCandidateSaved(candidate.id, !currentlySaved);

    setSavedIds((prev) => {
      const next = new Set(prev);
      if (currentlySaved) {
        next.delete(candidate.id);
      } else {
        next.add(candidate.id);
      }
      return next;
    });
  };

  const handleDismiss = (candidate: AnonymousCandidate) => {
    markCandidateDismissed(candidate.id);
    setDismissedIds((prev) => new Set(prev).add(candidate.id));
    Alert.alert('Profile Hidden', 'This match has been removed from your New Matches view.');
  };

  const visibleCandidates = result.candidates.filter((c) => !dismissedIds.has(c.id));

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeContainer}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <X size={20} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>New Matches</Text>
            <Text style={styles.headerSubTitle}>Profiles newly matching your preferences</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Stats Pill & Timeframe Banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statsIconWrap}>
            <Users size={16} color="#F43F5E" />
          </View>
          <View style={styles.statsTextWrap}>
            <Text style={styles.statsTitleText}>
              {visibleCandidates.length} eligible profiles
            </Text>
            <Text style={styles.statsSubText}>
              {result.newCountToday} joined today • {result.timeframeLabel}
            </Text>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPillsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsScroll}>
            {[
              { id: 'newest', label: 'Newest' },
              { id: 'compatibility', label: 'Highest Compatibility' },
              { id: 'nearest', label: 'Nearest' },
              { id: 'available_now', label: 'Available Now' },
              { id: 'verified', label: 'Verified' },
            ].map((f) => {
              const active = activeSort === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                  onPress={() => setActiveSort(f.id as FilterSortType)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Candidate List */}
        <ScrollView
          style={styles.scrollList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          {visibleCandidates.map((cand) => {
            const isSaved = savedIds.has(cand.id) || isCandidateSaved(cand.id);

            return (
              <View key={cand.id} style={styles.card}>
                {/* Top Badge Row */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.compatBadge}>
                    <Sparkles size={13} color="#D97706" />
                    <Text style={styles.compatBadgeText}>{cand.compatibilityPercentage}% Match</Text>
                  </View>

                  <View style={styles.cardTopActions}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
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
                      style={styles.iconActionBtn}
                      onPress={() => handleDismiss(cand)}
                      activeOpacity={0.7}
                    >
                      <EyeOff size={16} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Main Candidate Info */}
                <View style={styles.cardBody}>
                  <View style={styles.avatarSilhouette}>
                    <Users size={22} color="#94A3B8" />
                  </View>
                  <View style={styles.candidateDetails}>
                    <View style={styles.zoneRow}>
                      <MapPin size={13} color="#2563EB" />
                      <Text style={styles.zoneName}>{cand.approximateZone}</Text>
                    </View>
                    <Text style={styles.distanceSubtext}>{cand.distanceLabel}</Text>
                    <View style={styles.verifiedRow}>
                      <CheckCircle2 size={12} color="#059669" />
                      <Text style={styles.verifiedText}>Verified Preferences • Mutual Timeline</Text>
                    </View>
                  </View>
                </View>

                {/* Matching Reasons Tags */}
                <View style={styles.reasonsWrap}>
                  {cand.compatibilityReasons.slice(0, 3).map((r, i) => (
                    <View key={`reason-${i}`} style={styles.reasonTag}>
                      <Text style={styles.reasonTagText}>{r}</Text>
                    </View>
                  ))}
                </View>

                {/* Card Action Row */}
                <View style={styles.cardFooterRow}>
                  <TouchableOpacity
                    style={styles.detailsBtn}
                    activeOpacity={0.8}
                    onPress={() => {
                      markCandidateSeen(cand.id);
                      if (onSelectCandidate) {
                        onSelectCandidate(cand);
                      }
                    }}
                  >
                    <Text style={styles.detailsBtnText}>View Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sendIntroBtn}
                    activeOpacity={0.88}
                    onPress={() => {
                      onClose();
                      onRequestIntroduction(cand);
                    }}
                  >
                    <Send size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.sendIntroBtnText}>Request Introduction</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Bottom Floating Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.viewOnMapBtn}
            activeOpacity={0.88}
            onPress={() => {
              onClose();
              onViewOnMap();
            }}
          >
            <Map size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.viewOnMapText}>View on Map</Text>
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
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  statsIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statsTextWrap: {
    flex: 1,
  },
  statsTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E11D48',
  },
  statsSubText: {
    fontSize: 11,
    color: '#9F1239',
    marginTop: 1,
  },
  filterPillsContainer: {
    paddingVertical: 8,
  },
  filterPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  scrollList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  compatBadge: {
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
  compatBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  cardTopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarSilhouette: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  candidateDetails: {
    flex: 1,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zoneName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  distanceSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
  },
  reasonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  reasonTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  reasonTagText: {
    fontSize: 11,
    color: '#475569',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  detailsBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  sendIntroBtn: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIntroBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
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
  viewOnMapBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  viewOnMapText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
