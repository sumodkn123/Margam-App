import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Switch,
} from 'react-native';
import {
  X,
  MapPin,
  Sparkles,
  Send,
  Coffee,
  CheckCircle2,
  Map,
  Search,
  Building,
  Calendar,
} from 'lucide-react-native';
import { AnonymousCandidate, PublicVenue } from '../../types';
import {
  getDestinationMatchInsights,
  getActiveDestinationState,
  setActiveDestinationState,
  DestinationMatchInsightsResult,
} from '../../services/insightsService';
import { THEME } from '../../constants/theme';

interface DestinationInsightsModalProps {
  visible: boolean;
  onClose: () => void;
  onRequestIntroduction: (candidate: AnonymousCandidate) => void;
  onViewDestinationOnMap: (destName: string) => void;
  onDestinationUpdated?: () => void;
}

export const DestinationInsightsModal: React.FC<DestinationInsightsModalProps> = ({
  visible,
  onClose,
  onRequestIntroduction,
  onViewDestinationOnMap,
  onDestinationUpdated,
}) => {
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [availableDuringVisitOnly, setAvailableDuringVisitOnly] = useState<boolean>(false);
  const [isChangingDest, setIsChangingDest] = useState<boolean>(false);
  const [destSearchInput, setDestSearchInput] = useState<string>('');

  const [destData, setDestData] = useState<DestinationMatchInsightsResult>(() =>
    getDestinationMatchInsights({ radiusKm: 5 })
  );

  useEffect(() => {
    if (visible) {
      const active = getActiveDestinationState();
      const data = getDestinationMatchInsights({
        destinationName: active.destinationName || 'Kochi',
        radiusKm: selectedRadius,
        availableDuringVisitOnly,
      });
      setDestData(data);
      if (!active.hasActiveDestination) {
        setIsChangingDest(true);
      }
    }
  }, [visible, selectedRadius, availableDuringVisitOnly]);

  const handleSelectNewDestination = (cityName: string) => {
    setActiveDestinationState(cityName, selectedRadius);
    const updated = getDestinationMatchInsights({
      destinationName: cityName,
      radiusKm: selectedRadius,
      availableDuringVisitOnly,
    });
    setDestData(updated);
    setIsChangingDest(false);
    if (onDestinationUpdated) {
      onDestinationUpdated();
    }
  };

  const radiusOptions = [1, 3, 5, 10, 25];

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeContainer}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <X size={20} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>At Destination Discovery</Text>
            <Text style={styles.headerSubTitle}>Compatible profiles where you are heading</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {isChangingDest ? (
          /* ==================================================== */
          /* CASE B: DESTINATION PICKER                           */
          /* ==================================================== */
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.pickerBanner}>
              <View style={styles.pickerIconCircle}>
                <MapPin size={24} color="#10B981" />
              </View>
              <Text style={styles.pickerTitle}>Where are you heading?</Text>
              <Text style={styles.pickerSub}>
                Select your destination city to find compatible verified matches living or available there.
              </Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchRow}>
              <Search size={16} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search city, district or area..."
                value={destSearchInput}
                onChangeText={setDestSearchInput}
                onSubmitEditing={() => {
                  if (destSearchInput.trim()) {
                    handleSelectNewDestination(destSearchInput.trim());
                  }
                }}
              />
              {destSearchInput.length > 0 && (
                <TouchableOpacity
                  style={styles.searchConfirmBtn}
                  onPress={() => handleSelectNewDestination(destSearchInput.trim())}
                >
                  <Text style={styles.searchConfirmBtnText}>Select</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Popular Destinations Grid */}
            <Text style={styles.popularTitle}>Popular Destinations in Kerala & South</Text>
            <View style={styles.popularGrid}>
              {destData.popularDestinations.map((city) => (
                <TouchableOpacity
                  key={`city-${city}`}
                  style={styles.cityCard}
                  activeOpacity={0.8}
                  onPress={() => handleSelectNewDestination(city)}
                >
                  <Building size={18} color="#059669" style={{ marginBottom: 6 }} />
                  <Text style={styles.cityName}>{city}</Text>
                  <Text style={styles.citySub}>Explore matches</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          /* ==================================================== */
          /* CASE A: DESTINATION DISCOVERY SCREEN                */
          /* ==================================================== */
          <>
            <ScrollView
              style={styles.scrollContent}
              contentContainerStyle={{ paddingBottom: 110 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Destination Hero Banner */}
              <View style={styles.destBannerCard}>
                <View style={styles.destBannerTop}>
                  <View style={styles.destNameRow}>
                    <MapPin size={20} color="#059669" style={{ marginRight: 6 }} />
                    <Text style={styles.destTitleText}>Matches in {destData.destinationName}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.changeDestBtn}
                    onPress={() => setIsChangingDest(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.changeDestBtnText}>Change City</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.destSubText}>
                  {destData.totalCount} compatible profiles within {selectedRadius} km
                </Text>
              </View>

              {/* Radius Selector */}
              <View style={styles.controlCard}>
                <Text style={styles.controlTitle}>Search Radius from Destination</Text>
                <View style={styles.radiusRow}>
                  {radiusOptions.map((rad) => {
                    const active = selectedRadius === rad;
                    return (
                      <TouchableOpacity
                        key={`rad-${rad}`}
                        style={[styles.radiusChip, active && styles.radiusChipActive]}
                        onPress={() => setSelectedRadius(rad)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.radiusChipText, active && styles.radiusChipTextActive]}>
                          {rad} km
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Visit Availability Toggle */}
                <View style={styles.toggleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleLabel}>Available during your visit</Text>
                    <Text style={styles.toggleSub}>Only show profiles open for introductions</Text>
                  </View>
                  <Switch
                    value={availableDuringVisitOnly}
                    onValueChange={setAvailableDuringVisitOnly}
                    trackColor={{ false: '#CBD5E1', true: '#A7F3D0' }}
                    thumbColor={availableDuringVisitOnly ? '#059669' : '#F1F5F9'}
                  />
                </View>
              </View>

              {/* Verified Public Venues in this Destination */}
              {destData.availableVenues.length > 0 && (
                <View style={styles.venuesSection}>
                  <View style={styles.venuesHeaderRow}>
                    <Coffee size={15} color="#D97706" />
                    <Text style={styles.venuesTitle}>
                      Verified Public Meeting Spots in {destData.destinationName}
                    </Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.venuesScroll}>
                    {destData.availableVenues.map((v) => (
                      <View key={v.id} style={styles.venueCard}>
                        <Text style={styles.venueName} numberOfLines={1}>{v.name}</Text>
                        <Text style={styles.venueArea}>{v.area}</Text>
                        <View style={styles.venueRatingRow}>
                          <Text style={styles.venueRating}>⭐ {v.rating}</Text>
                          <Text style={styles.venueTag}>Public Space</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Candidate Matches */}
              <View style={styles.listHeaderRow}>
                <Text style={styles.listTitle}>
                  Eligible Matches ({destData.candidates.length})
                </Text>
              </View>

              {destData.candidates.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No profiles found within {selectedRadius} km</Text>
                  <Text style={styles.emptySub}>
                    Try expanding the search radius to 10 or 25 km to discover more compatible matches around {destData.destinationName}.
                  </Text>
                </View>
              ) : (
                destData.candidates.map((cand) => (
                  <View key={cand.id} style={styles.candidateCard}>
                    <View style={styles.candHeader}>
                      <View style={styles.compatPill}>
                        <Sparkles size={12} color="#D97706" />
                        <Text style={styles.compatText}>{cand.compatibilityPercentage}% Match</Text>
                      </View>
                      <View style={styles.distPill}>
                        <MapPin size={12} color="#059669" />
                        <Text style={styles.distPillText}>{cand.distanceLabel}</Text>
                      </View>
                    </View>

                    <View style={styles.candBodyRow}>
                      <View style={styles.candAvatarWrap}>
                        <Building size={20} color="#059669" />
                      </View>
                      <View style={styles.candInfoCol}>
                        <Text style={styles.candZone}>{cand.approximateZone}</Text>
                        <Text style={styles.candNote}>{cand.availabilityNote}</Text>
                        <View style={styles.timelineRow}>
                          <CheckCircle2 size={12} color="#059669" />
                          <Text style={styles.timelineText}>Timeline & Value Alignment</Text>
                        </View>
                      </View>
                    </View>

                    {/* Reasons */}
                    <View style={styles.reasonsWrap}>
                      {cand.compatibilityReasons.slice(0, 2).map((r, i) => (
                        <View key={`r-${i}`} style={styles.reasonTag}>
                          <Text style={styles.reasonTagText}>{r}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Action */}
                    <TouchableOpacity
                      style={styles.introBtn}
                      activeOpacity={0.88}
                      onPress={() => {
                        onClose();
                        onRequestIntroduction(cand);
                      }}
                    >
                      <Send size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.introBtnText}>Request Introduction</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Bottom Bar: View on Map */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={styles.viewMapBtn}
                activeOpacity={0.88}
                onPress={() => {
                  onClose();
                  onViewDestinationOnMap(destData.destinationName);
                }}
              >
                <Map size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.viewMapBtnText}>View on Map ({destData.destinationName})</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
  scrollContent: {
    padding: 16,
  },
  pickerBanner: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  pickerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 6,
  },
  pickerSub: {
    fontSize: 13,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  searchConfirmBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  searchConfirmBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cityCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cityName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  citySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  destBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  destBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  destNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  changeDestBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  changeDestBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  destSubText: {
    fontSize: 13,
    color: '#64748B',
  },
  controlCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  controlTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  radiusChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  radiusChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  radiusChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  radiusChipTextActive: {
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  toggleSub: {
    fontSize: 11,
    color: '#64748B',
  },
  venuesSection: {
    marginBottom: 14,
  },
  venuesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  venuesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  venuesScroll: {
    gap: 10,
  },
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    width: 200,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  venueName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  venueArea: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 6,
  },
  venueRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  venueRating: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  venueTag: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  listHeaderRow: {
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
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
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  candHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  compatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  compatText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  distPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  distPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  candBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  candAvatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  candInfoCol: {
    flex: 1,
  },
  candZone: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  candNote: {
    fontSize: 11,
    color: '#059669',
    marginTop: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  timelineText: {
    fontSize: 11,
    color: '#475569',
  },
  reasonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
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
  introBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introBtnText: {
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
  viewMapBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMapBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
