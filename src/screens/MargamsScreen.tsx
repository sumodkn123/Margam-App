// MARGAM — Margams Discovery Screen
// Matches the exact design screenshot with Explore Margams category cards,
// Selected Path dropdown bar, fitted card deck, and 3D Red Love button.

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Platform,
} from 'react-native';
import {
  Search,
  SlidersHorizontal,
  Users,
  Briefcase,
  Plane,
  Leaf,
  Dumbbell,
  Utensils,
  Mountain,
} from 'lucide-react-native';
import { MargamLogoNew } from '../components/brand/MargamLogoNew';
import {
  MargamProfileCandidate,
  AnonymousCandidate,
  MargamSwipeFilterOptions,
  ProfileMargamDisplayItem,
} from '../types';
import { MargamCardDeck } from '../components/margams/MargamCardDeck';
import { MargamCategoryFilterModal } from '../components/margams/MargamCategoryFilterModal';
import { CompatibilityBreakdownModal } from '../components/insights/CompatibilityBreakdownModal';
import { MutualInterestModal } from '../components/margams/MutualInterestModal';
import { InterestSentToast } from '../components/margams/InterestSentToast';
import { SavedProfilesModal } from '../components/margams/SavedProfilesModal';
import { MargamFilterPanelModal } from '../components/margams/MargamFilterPanelModal';
import { ComparePathsModal } from '../components/margams/ComparePathsModal';
import { FullscreenPhotoViewerModal } from '../components/profile/FullscreenPhotoViewerModal';
import { MargamDetailModal } from '../components/profile/MargamDetailModal';
import { ProfileMoreActionSheet } from '../components/profile/ProfileMoreActionSheet';
import { ReportProfileModal } from '../components/profile/ReportProfileModal';
import { BlockConfirmationModal } from '../components/profile/BlockConfirmationModal';
import {
  getSwipeDiscoveryQueue,
  recordSwipeAction,
  DEFAULT_SWIPE_FILTERS,
  hideCandidate,
  blockCandidate,
  reportCandidate,
  isCandidateSaved,
  toggleSaveCandidate,
} from '../services/swipeDiscoveryService';
import { resolveCityCoordinates } from '../services/discoveryEngine';
import { generatePrivacyZone } from '../services/privacyFuzzing';

interface MargamsScreenProps {
  onSelectCandidate: (candidate: AnonymousCandidate) => void;
  onRequestButtonPress: () => void;
  onOpenProfile: () => void;
  onOpenChat: () => void;
  onOpenCandidateProfile?: (candidate: MargamProfileCandidate | AnonymousCandidate) => void;
}

// Category cards matching the screenshot
const EXPLORE_CATEGORIES = [
  {
    id: 'business',
    name: 'Business',
    icon: Briefcase,
    activeBg: '#4F46E5',
    activeText: '#FFFFFF',
    inactiveBg: '#EEF2FF',
    iconColor: '#4F46E5',
    defaultMargam: 'Café Business',
    emoji: '☕',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: Plane,
    activeBg: '#2563EB',
    activeText: '#FFFFFF',
    inactiveBg: '#EFF6FF',
    iconColor: '#2563EB',
    defaultMargam: 'International Travel',
    emoji: '✈',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: Leaf,
    activeBg: '#10B981',
    activeText: '#FFFFFF',
    inactiveBg: '#ECFDF5',
    iconColor: '#10B981',
    defaultMargam: 'Mindful Living',
    emoji: '🍃',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: Dumbbell,
    activeBg: '#EC4899',
    activeText: '#FFFFFF',
    inactiveBg: '#FDF2F8',
    iconColor: '#EC4899',
    defaultMargam: 'Fitness & Gym',
    emoji: '🏋',
  },
  {
    id: 'food',
    name: 'Food',
    icon: Utensils,
    activeBg: '#F59E0B',
    activeText: '#FFFFFF',
    inactiveBg: '#FFFBEB',
    iconColor: '#EA580C',
    defaultMargam: 'Food & Culinary',
    emoji: '🍴',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    icon: Mountain,
    activeBg: '#8B5CF6',
    activeText: '#FFFFFF',
    inactiveBg: '#FAF5FF',
    iconColor: '#8B5CF6',
    defaultMargam: 'Trekking & Outdoors',
    emoji: '🏔',
  },
];

export const MargamsScreen: React.FC<MargamsScreenProps> = ({
  onSelectCandidate,
  onRequestButtonPress,
  onOpenProfile,
  onOpenChat,
  onOpenCandidateProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('business');
  const [selectedInterestName, setSelectedInterestName] = useState('Café Business');
  const [selectedEmoji, setSelectedEmoji] = useState('☕');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [breakdownCandidate, setBreakdownCandidate] = useState<MargamProfileCandidate | null>(null);

  // Filter options state
  const [filterOptions, setFilterOptions] = useState<MargamSwipeFilterOptions>({
    ...DEFAULT_SWIPE_FILTERS,
    selectedMargam: 'Café Business',
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Action feedback states
  const [mutualInterestCandidate, setMutualInterestCandidate] = useState<MargamProfileCandidate | null>(null);
  const [interestSentCandidate, setInterestSentCandidate] = useState<MargamProfileCandidate | null>(null);
  const [comparePathsCandidate, setComparePathsCandidate] = useState<MargamProfileCandidate | null>(null);
  const [photoViewerCandidate, setPhotoViewerCandidate] = useState<MargamProfileCandidate | null>(null);
  const [margamDetailItem, setMargamDetailItem] = useState<ProfileMargamDisplayItem | null>(null);

  // Moderation action states
  const [moreOptionsCandidate, setMoreOptionsCandidate] = useState<MargamProfileCandidate | null>(null);
  const [reportCandidateModal, setReportCandidateModal] = useState<MargamProfileCandidate | null>(null);
  const [blockCandidateModal, setBlockCandidateModal] = useState<MargamProfileCandidate | null>(null);

  // Dynamic Candidates matching selected interest and filter options
  const rawCandidates = getSwipeDiscoveryQueue('usr-current', filterOptions);
  const candidates = rawCandidates;

  // Transition animations for switching Margams
  const queueFadeAnim = useRef(new Animated.Value(1)).current;

  const handleSelectCategory = (cat: typeof EXPLORE_CATEGORIES[0]) => {
    setSelectedCategory(cat.id);
    setSelectedInterestName(cat.defaultMargam);
    setSelectedEmoji(cat.emoji);
    setFilterOptions((prev) => ({ ...prev, selectedMargam: cat.defaultMargam }));

    Animated.sequence([
      Animated.timing(queueFadeAnim, { toValue: 0.3, duration: 90, useNativeDriver: false }),
      Animated.timing(queueFadeAnim, { toValue: 1, duration: 180, useNativeDriver: false }),
    ]).start();
  };

  const handleSelectInterestFromModal = (name: string, emoji: string) => {
    setSelectedInterestName(name);
    setSelectedEmoji(emoji);
    setFilterOptions((prev) => ({ ...prev, selectedMargam: name }));
  };

  const handleLaunchIntroduction = (cand: MargamProfileCandidate) => {
    const geo = resolveCityCoordinates(cand.city);
    const safeFuzzed = generatePrivacyZone(geo.lat, geo.lng, cand.id, `${cand.city} area`);

    const anonymousContract: AnonymousCandidate = {
      id: cand.id,
      compatibilityPercentage: cand.compatibilityPercentage,
      availability: 'Open to introductions',
      approximateZone: `${cand.city} area`,
      distanceLabel: 'Shared Margam Match',
      marriageTimelineMatch: true,
      lifestyleMatch: true,
      locationPreferenceMatch: true,
      sharedInterestsCount: cand.sharedMargams.length,
      compatibilityReasons: cand.sharedMargams.map((m) => `Shared ${m.name}`),
      fuzzedCoordinate: safeFuzzed,
      availabilityNote: `Discovered via ${selectedInterestName}`,
    };

    onSelectCandidate(anonymousContract);
    onRequestButtonPress();
  };

  const handleShowInterest = (cand: MargamProfileCandidate) => {
    const res = recordSwipeAction({
      profileId: cand.id,
      actionType: 'INTEREST_SHOWN',
      source: 'MARGAMS_SWIPE',
      margamId: selectedInterestName,
    });

    if (res.isMutualInterest) {
      setMutualInterestCandidate(cand);
    } else {
      setInterestSentCandidate(cand);
    }
  };

  const handlePassCandidate = (cand: MargamProfileCandidate) => {
    recordSwipeAction({
      profileId: cand.id,
      actionType: 'PASSED',
      source: 'MARGAMS_SWIPE',
      margamId: selectedInterestName,
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* 1. Header Bar matching screenshot */}
      <View style={styles.header}>
        <View style={styles.headerLeftCol}>
          <MargamLogoNew size={36} />
          <View style={styles.headerBrandText}>
            <Text style={styles.headerBrandTitle}>Margams</Text>
            <Text style={styles.headerBrandSubtitle}>
              Shared interests. Meaningful connections.
            </Text>
          </View>
        </View>

        <View style={styles.headerActionsRight}>
          <TouchableOpacity
            style={styles.headerCircleBtn}
            activeOpacity={0.8}
            onPress={() => setIsCategoryModalOpen(true)}
            accessibilityLabel="Search margams"
          >
            <Search size={18} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCircleBtn}
            activeOpacity={0.8}
            onPress={() => setIsFilterModalOpen(true)}
            accessibilityLabel="Discovery filters"
          >
            <SlidersHorizontal size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. "Explore Margams" Section */}
      <View style={styles.exploreSection}>
        <View style={styles.exploreHeaderRow}>
          <Text style={styles.exploreTitle}>Explore Margams</Text>
          <TouchableOpacity onPress={() => setIsCategoryModalOpen(true)}>
            <Text style={styles.seeAllText}>See All &gt;</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {EXPLORE_CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: isSelected ? cat.activeBg : cat.inactiveBg },
                ]}
                onPress={() => handleSelectCategory(cat)}
                activeOpacity={0.8}
              >
                <IconComp
                  size={19}
                  color={isSelected ? cat.activeText : cat.iconColor}
                  style={{ marginBottom: 4 }}
                />
                <Text
                  style={[
                    styles.categoryName,
                    { color: isSelected ? cat.activeText : '#1E293B' },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Selected Path Dropdown Bar with Filter Button */}
      <View style={styles.pathDropdownBarWrapper}>
        <TouchableOpacity
          style={styles.pathDropdownBar}
          activeOpacity={0.85}
          onPress={() => setIsCategoryModalOpen(true)}
        >
          <View style={styles.pathBarLeft}>
            <Text style={{ fontSize: 13, marginRight: 5 }}>{selectedEmoji}</Text>
            <Text style={styles.pathBarName}>{selectedInterestName}</Text>
            <Text style={styles.pathBarArrow}>▼</Text>
          </View>
          <View style={styles.pathBarDivider} />
          <View style={styles.pathBarRight}>
            <Users size={13} color="#64748B" style={{ marginRight: 5 }} />
            <Text style={styles.pathBarSubtitle}>Showing people who share this path</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pathFilterBtn}
          activeOpacity={0.8}
          onPress={() => setIsFilterModalOpen(true)}
          accessibilityLabel="Filter path candidates"
        >
          <SlidersHorizontal size={16} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* 4. The Card Deck Container (Proportioned to fit inside page) */}
      <View style={styles.deckWrapper}>
        <Animated.View style={{ opacity: queueFadeAnim, width: '100%', alignItems: 'center' }}>
          <MargamCardDeck
            candidates={candidates}
            selectedMargam={selectedInterestName}
            onSelectCandidate={(cand) => {
              if (onOpenCandidateProfile) {
                onOpenCandidateProfile(cand);
              } else {
                handleLaunchIntroduction(cand);
              }
            }}
            onOpenCandidateProfile={(cand) => {
              if (onOpenCandidateProfile) {
                onOpenCandidateProfile(cand);
              } else {
                handleLaunchIntroduction(cand);
              }
            }}
            onWhyThisMatch={(cand) => setBreakdownCandidate(cand)}
            onShowInterest={handleShowInterest}
            onPassCandidate={handlePassCandidate}
            onOpenPhotoViewer={(cand) => setPhotoViewerCandidate(cand)}
            onOpenMargamDetail={(name) => {
              const raw = candidates[0]?.sharedMargams.find((m) => m.name === name);
              if (raw) {
                const displayItem: ProfileMargamDisplayItem = {
                  id: `mg-${raw.name.toLowerCase().replace(/\s+/g, '-')}`,
                  name: raw.name,
                  emoji: raw.emoji,
                  intent: 'experience_together',
                  intentCategory: 'Lifestyle',
                  bgColor: raw.tagColor || '#FFF7ED',
                  textColor: raw.textColor || '#EA580C',
                  isShared: true,
                };
                setMargamDetailItem(displayItem);
              }
            }}
            onOpenComparePaths={(cand) => setComparePathsCandidate(cand)}
            onOpenSavedProfiles={() => setIsSavedModalOpen(true)}
            onOpenFilterPanel={() => setIsFilterModalOpen(true)}
            onMoreOptions={(cand) => setMoreOptionsCandidate(cand)}
            onChangeMargam={() => setIsCategoryModalOpen(true)}
          />
        </Animated.View>
      </View>

      {/* MODALS */}
      {/* 1. Category Picker Modal */}
      <MargamCategoryFilterModal
        visible={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedInterest={selectedInterestName}
        onSelectInterest={(item) => handleSelectInterestFromModal(item.name, item.emoji)}
      />

      {/* 2. Filter Panel Modal */}
      <MargamFilterPanelModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filterOptions}
        onApplyFilters={(f) => setFilterOptions(f)}
      />

      {/* 3. AI Compatibility Breakdown */}
      {breakdownCandidate && (
        <CompatibilityBreakdownModal
          visible={!!breakdownCandidate}
          onClose={() => setBreakdownCandidate(null)}
          candidate={{
            id: breakdownCandidate.id,
            compatibilityPercentage: breakdownCandidate.compatibilityPercentage,
            availability: 'Open to introductions',
            approximateZone: `${breakdownCandidate.city} area`,
            distanceLabel: 'Shared Margam Match',
            marriageTimelineMatch: true,
            lifestyleMatch: true,
            locationPreferenceMatch: true,
            sharedInterestsCount: breakdownCandidate.sharedMargams.length,
            compatibilityReasons: breakdownCandidate.sharedMargams.map((m) => `Shared ${m.name}`),
            fuzzedCoordinate: generatePrivacyZone(
              resolveCityCoordinates(breakdownCandidate.city).lat,
              resolveCityCoordinates(breakdownCandidate.city).lng,
              breakdownCandidate.id,
              `${breakdownCandidate.city} area`
            ),
            availabilityNote: `Discovered via ${selectedInterestName}`,
          }}
          onRequestIntroduction={() => {
            const cand = breakdownCandidate;
            setBreakdownCandidate(null);
            handleLaunchIntroduction(cand);
          }}
        />
      )}

      {/* 4. Mutual Interest Celebration Modal */}
      {mutualInterestCandidate && (
        <MutualInterestModal
          visible={!!mutualInterestCandidate}
          candidate={mutualInterestCandidate}
          onClose={() => setMutualInterestCandidate(null)}
          onRequestIntroduction={() => {
            const cand = mutualInterestCandidate;
            setMutualInterestCandidate(null);
            handleLaunchIntroduction(cand);
          }}
          onViewProfile={() => {
            const cand = mutualInterestCandidate;
            setMutualInterestCandidate(null);
            onOpenCandidateProfile?.(cand);
          }}
        />
      )}

      {/* 5. Interest Sent Toast */}
      {interestSentCandidate && (
        <InterestSentToast
          visible={!!interestSentCandidate}
          candidate={interestSentCandidate}
          onContinueExploring={() => setInterestSentCandidate(null)}
          onViewProfile={(cand) => {
            setInterestSentCandidate(null);
            onOpenCandidateProfile?.(cand);
          }}
          onSaveProfile={(cand) => {
            setInterestSentCandidate(null);
            toggleSaveCandidate(cand, 'DEFAULT');
          }}
        />
      )}

      {/* 6. Saved Profiles Modal */}
      <SavedProfilesModal
        visible={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onViewProfile={(cand: MargamProfileCandidate) => {
          setIsSavedModalOpen(false);
          onOpenCandidateProfile?.(cand);
        }}
        onRequestIntroduction={(cand: MargamProfileCandidate) => {
          setIsSavedModalOpen(false);
          handleLaunchIntroduction(cand);
        }}
        onShowInterest={(cand: MargamProfileCandidate) => {
          setIsSavedModalOpen(false);
          handleShowInterest(cand);
        }}
      />

      {/* 7. Compare Paths Modal */}
      {comparePathsCandidate && (
        <ComparePathsModal
          visible={!!comparePathsCandidate}
          onClose={() => setComparePathsCandidate(null)}
          candidate={comparePathsCandidate}
          onRequestIntroduction={() => {
            const cand = comparePathsCandidate;
            setComparePathsCandidate(null);
            handleLaunchIntroduction(cand);
          }}
        />
      )}

      {/* 8. Fullscreen Photo Viewer Modal */}
      {photoViewerCandidate && (
        <FullscreenPhotoViewerModal
          visible={!!photoViewerCandidate}
          onClose={() => setPhotoViewerCandidate(null)}
          photos={[{ id: '1', url: photoViewerCandidate.photoUrl, caption: photoViewerCandidate.name, isPrimary: true, visibility: 'public' }]}
          userName={photoViewerCandidate.name}
          isVerified={photoViewerCandidate.isVerified}
          compatibilityPercentage={photoViewerCandidate.compatibilityPercentage}
          onRequestIntroduction={() => {
            const cand = photoViewerCandidate;
            setPhotoViewerCandidate(null);
            handleLaunchIntroduction(cand);
          }}
        />
      )}

      {/* 9. Margam Detail Modal */}
      {margamDetailItem && (
        <MargamDetailModal
          visible={!!margamDetailItem}
          onClose={() => setMargamDetailItem(null)}
          margam={margamDetailItem}
          userName={candidates[0]?.name || 'Candidate'}
          onExploreMargam={(name) => {
            setMargamDetailItem(null);
            setSelectedInterestName(name);
          }}
        />
      )}

      {/* 10. More Options Sheet */}
      {moreOptionsCandidate && (
        <ProfileMoreActionSheet
          visible={!!moreOptionsCandidate}
          isSaved={isCandidateSaved(moreOptionsCandidate.id)}
          userName={moreOptionsCandidate.name}
          onClose={() => setMoreOptionsCandidate(null)}
          onSendRequest={() => {
            const cand = moreOptionsCandidate;
            setMoreOptionsCandidate(null);
            handleLaunchIntroduction(cand);
          }}
          onToggleSave={() => {
            toggleSaveCandidate(moreOptionsCandidate, 'DEFAULT');
          }}
          onShare={() => {
            setMoreOptionsCandidate(null);
          }}
          onReport={() => {
            const cand = moreOptionsCandidate;
            setMoreOptionsCandidate(null);
            setReportCandidateModal(cand);
          }}
          onBlock={() => {
            const cand = moreOptionsCandidate;
            setMoreOptionsCandidate(null);
            setBlockCandidateModal(cand);
          }}
          onHide={() => {
            hideCandidate(moreOptionsCandidate.id);
            setMoreOptionsCandidate(null);
          }}
        />
      )}

      {/* 11. Report Profile Modal */}
      {reportCandidateModal && (
        <ReportProfileModal
          visible={!!reportCandidateModal}
          userName={reportCandidateModal.name}
          onClose={() => setReportCandidateModal(null)}
          onSubmitReport={(reason, details) => {
            reportCandidate(reportCandidateModal.id, reason as any, details);
            setReportCandidateModal(null);
          }}
        />
      )}

      {/* 12. Block Confirmation Modal */}
      {blockCandidateModal && (
        <BlockConfirmationModal
          visible={!!blockCandidateModal}
          userName={blockCandidateModal.name}
          onClose={() => setBlockCandidateModal(null)}
          onConfirmBlock={() => {
            blockCandidate(blockCandidateModal.id);
            setBlockCandidateModal(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 4,
    paddingBottom: 6,
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBrandText: {
    marginLeft: 8,
  },
  headerBrandTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    lineHeight: 25,
  },
  headerBrandSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
  },
  headerActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreSection: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  exploreHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  exploreTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryCard: {
    width: 72,
    height: 58,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '700',
  },
  pathDropdownBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 6,
    gap: 8,
  },
  pathDropdownBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pathFilterBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathBarName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  pathBarArrow: {
    fontSize: 9,
    color: '#0F172A',
    marginLeft: 4,
  },
  pathBarDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  pathBarRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathBarSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  deckWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
