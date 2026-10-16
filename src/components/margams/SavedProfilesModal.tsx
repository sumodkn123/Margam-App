import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {
  Star,
  Heart,
  User,
  Send,
  X,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import {
  SavedMargamProfile,
  SavedProfileCategory,
  MargamProfileCandidate,
} from '../../types';
import {
  getSavedProfilesGrouped,
  removeSavedProfile,
  updateSavedProfileState,
} from '../../services/swipeDiscoveryService';

const { width } = Dimensions.get('window');

interface SavedProfilesModalProps {
  visible: boolean;
  onClose: () => void;
  onViewProfile: (candidate: MargamProfileCandidate) => void;
  onRequestIntroduction: (candidate: MargamProfileCandidate) => void;
  onShowInterest: (candidate: MargamProfileCandidate) => void;
}

export const SavedProfilesModal: React.FC<SavedProfilesModalProps> = ({
  visible,
  onClose,
  onViewProfile,
  onRequestIntroduction,
  onShowInterest,
}) => {
  const [activeCategory, setActiveCategory] = useState<SavedProfileCategory>('Saved Recently');
  const [, setRefreshKey] = useState(0);

  const savedGrouped = getSavedProfilesGrouped();

  const categories: { key: SavedProfileCategory; label: string; count: number }[] = [
    { key: 'Saved Recently', label: 'Recently', count: savedGrouped.recentlySaved.length },
    { key: 'High Compatibility', label: '90%+ Match', count: savedGrouped.highCompatibility.length },
    { key: 'Shared Margams', label: 'Shared Margams', count: savedGrouped.sharedMargams.length },
    { key: 'Potential Future Matches', label: 'Future Goals', count: savedGrouped.futureMatches.length },
  ];

  const getActiveList = (): SavedMargamProfile[] => {
    switch (activeCategory) {
      case 'Saved Recently':
        return savedGrouped.recentlySaved;
      case 'High Compatibility':
        return savedGrouped.highCompatibility;
      case 'Shared Margams':
        return savedGrouped.sharedMargams;
      case 'Potential Future Matches':
        return savedGrouped.futureMatches;
      default:
        return [];
    }
  };

  const handleRemove = (candidateId: string) => {
    removeSavedProfile(candidateId);
    setRefreshKey((k) => k + 1);
  };

  const handleInterest = (cand: MargamProfileCandidate) => {
    updateSavedProfileState(cand.id, 'Interested');
    onShowInterest(cand);
    setRefreshKey((k) => k + 1);
  };

  const activeList = getActiveList();

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
            <View style={styles.starIconWrap}>
              <Star size={18} color="#F59E0B" fill="#F59E0B" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Saved Profiles</Text>
              <Text style={styles.headerSubtitle}>
                {savedGrouped.allCount} profiles saved privately for review
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <X size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[styles.tabPill, activeCategory === cat.key && styles.tabPillActive]}
                activeOpacity={0.8}
                onPress={() => setActiveCategory(cat.key)}
              >
                <Text style={[styles.tabPillText, activeCategory === cat.key && styles.tabPillTextActive]}>
                  {cat.label} ({cat.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.listScrollView}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {activeList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <Star size={32} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyTitle}>No profiles in this category</Text>
              <Text style={styles.emptySubtitle}>
                Tap the star (⭐) on any candidate card while swiping to bookmark them privately for later review.
              </Text>
            </View>
          ) : (
            activeList.map((item) => {
              const { candidate, currentState, savedAt } = item;
              return (
                <View key={candidate.id} style={styles.savedCard}>
                  {/* Photo & Basic Details */}
                  <TouchableOpacity
                    style={styles.cardHeaderArea}
                    activeOpacity={0.9}
                    onPress={() => onViewProfile(candidate)}
                  >
                    <Image source={{ uri: candidate.photoUrl }} style={styles.candidatePhoto} />
                    <View style={styles.candidateDetails}>
                      <View style={styles.nameRow}>
                        <Text style={styles.nameText}>{candidate.name}, {candidate.age}</Text>
                        {candidate.isVerified && (
                          <CheckCircle2 size={15} color="#2563EB" fill="#2563EB" style={{ marginLeft: 4 }} />
                        )}
                      </View>
                      <Text style={styles.metaText}>{candidate.profession} • {candidate.area}</Text>

                      {/* State Badge */}
                      <View style={styles.badgeRow}>
                        <View style={styles.compatPill}>
                          <Text style={styles.compatPillText}>{candidate.compatibilityPercentage}% Match</Text>
                        </View>
                        <View
                          style={[
                            styles.statePill,
                            currentState === 'Interested'
                              ? { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }
                              : currentState === 'Request Sent'
                              ? { backgroundColor: '#FDF2F8', borderColor: '#FCE7F3' }
                              : {},
                          ]}
                        >
                          <Text
                            style={[
                              styles.statePillText,
                              currentState === 'Interested' ? { color: '#2563EB' } : {},
                            ]}
                          >
                            {currentState}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Shared Margams chips */}
                  <View style={styles.margamChipsRow}>
                    {candidate.sharedMargams.map((m, idx) => (
                      <View key={idx} style={[styles.mChip, { backgroundColor: m.tagColor }]}>
                        <Text style={{ fontSize: 11, marginRight: 3 }}>{m.emoji}</Text>
                        <Text style={[styles.mChipText, { color: m.textColor }]}>{m.name}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Actions Row */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.actionBtnOutline}
                      activeOpacity={0.8}
                      onPress={() => onViewProfile(candidate)}
                    >
                      <User size={13} color="#0F172A" style={{ marginRight: 4 }} />
                      <Text style={styles.actionBtnOutlineText}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnOutline}
                      activeOpacity={0.8}
                      onPress={() => handleInterest(candidate)}
                    >
                      <Heart size={13} color="#2563EB" style={{ marginRight: 4 }} />
                      <Text style={[styles.actionBtnOutlineText, { color: '#2563EB' }]}>Interest</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnPrimary}
                      activeOpacity={0.85}
                      onPress={() => onRequestIntroduction(candidate)}
                    >
                      <Send size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.actionBtnPrimaryText}>Request Intro</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteIconBtn}
                      activeOpacity={0.8}
                      onPress={() => handleRemove(candidate.id)}
                    >
                      <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"
                          stroke="#94A3B8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabPillActive: {
    backgroundColor: '#0F172A',
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
  },
  listScrollView: {
    flex: 1,
    paddingTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
  },
  savedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  candidatePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  candidateDetails: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  compatPill: {
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  compatPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EC4899',
  },
  statePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  margamChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  mChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  mChipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  actionBtnOutlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#EC4899',
  },
  actionBtnPrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deleteIconBtn: {
    padding: 6,
    marginLeft: 'auto',
  },
});
