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
  Alert,
} from 'react-native';
import {
  X,
  Car,
  MapPin,
  Clock,
  Sparkles,
  Send,
  Coffee,
  CheckCircle2,
  Map,
  ArrowRight,
  SlidersHorizontal,
  Compass,
  Calendar,
} from 'lucide-react-native';
import { AnonymousCandidate, PublicVenue } from '../../types';
import {
  getRouteMatchInsights,
  getActiveRouteState,
  setActiveRouteState,
  RouteMatchInsightsResult,
} from '../../services/insightsService';
import { THEME } from '../../constants/theme';

interface RouteInsightsModalProps {
  visible: boolean;
  onClose: () => void;
  onRequestIntroduction: (candidate: AnonymousCandidate) => void;
  onSuggestMeeting: (candidate: AnonymousCandidate, venue?: PublicVenue) => void;
  onViewRouteOnMap: (originName: string, destName: string) => void;
  onRouteUpdated?: () => void;
}

export const RouteInsightsModal: React.FC<RouteInsightsModalProps> = ({
  visible,
  onClose,
  onRequestIntroduction,
  onSuggestMeeting,
  onViewRouteOnMap,
  onRouteUpdated,
}) => {
  const [detourFilter, setDetourFilter] = useState<number>(10);
  const [isEditingRoute, setIsEditingRoute] = useState<boolean>(false);
  const [originInput, setOriginInput] = useState<string>('Thrissur');
  const [destInput, setDestInput] = useState<string>('Kochi');
  const [travelDateInput, setTravelDateInput] = useState<string>('Today');

  const [routeData, setRouteData] = useState<RouteMatchInsightsResult>(() =>
    getRouteMatchInsights({ detourMinutesThreshold: 10 })
  );

  useEffect(() => {
    if (visible) {
      const active = getActiveRouteState();
      setOriginInput(active.originName || 'Thrissur');
      setDestInput(active.destinationName || 'Kochi');
      const data = getRouteMatchInsights({ detourMinutesThreshold: detourFilter });
      setRouteData(data);
      if (!active.hasActiveRoute) {
        setIsEditingRoute(true);
      }
    }
  }, [visible, detourFilter]);

  const handleSaveRoute = () => {
    if (!destInput.trim()) {
      Alert.alert('Destination Required', 'Please enter a destination city to calculate corridor matches.');
      return;
    }
    const origin = originInput.trim() || 'Thrissur';
    const dest = destInput.trim();
    setActiveRouteState(origin, dest, detourFilter, travelDateInput);
    const updated = getRouteMatchInsights({
      origin: { latitude: 0, longitude: 0, name: origin },
      destination: { latitude: 0, longitude: 0, name: dest },
      detourMinutesThreshold: detourFilter,
    });
    setRouteData(updated);
    setIsEditingRoute(false);
    if (onRouteUpdated) {
      onRouteUpdated();
    }
  };

  const detourOptions = [5, 10, 20, 30];

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeContainer}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <X size={20} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Along Route Discovery</Text>
            <Text style={styles.headerSubTitle}>Compatible profiles near your travel path</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {isEditingRoute ? (
          /* ==================================================== */
          /* CASE B: ROUTE SETUP / SELECT TRIP PROMPT             */
          /* ==================================================== */
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.setupBanner}>
              <View style={styles.setupIconCircle}>
                <Car size={24} color="#3B82F6" />
              </View>
              <Text style={styles.setupTitle}>Find Matches Along Your Way</Text>
              <Text style={styles.setupSub}>
                Enter your travel route to discover compatible verified profiles living along your highway corridor or near transit stops.
              </Text>
            </View>

            {/* Inputs */}
            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>Departure Origin</Text>
              <View style={styles.inputRow}>
                <MapPin size={16} color="#64748B" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Thrissur"
                  value={originInput}
                  onChangeText={setOriginInput}
                />
              </View>

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Destination City</Text>
              <View style={styles.inputRow}>
                <Compass size={16} color="#3B82F6" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Kochi"
                  value={destInput}
                  onChangeText={setDestInput}
                />
              </View>

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Travel Schedule</Text>
              <View style={styles.inputRow}>
                <Calendar size={16} color="#64748B" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Today, Tomorrow, This Weekend"
                  value={travelDateInput}
                  onChangeText={setTravelDateInput}
                />
              </View>

              {/* Quick Route Suggestions */}
              <Text style={styles.quickRoutesTitle}>Popular Kerala Highway Routes</Text>
              <View style={styles.quickRoutesWrap}>
                {[
                  { origin: 'Thrissur', dest: 'Kochi' },
                  { origin: 'Kochi', dest: 'Kozhikode' },
                  { origin: 'Kochi', dest: 'Trivandrum' },
                  { origin: 'Kochi', dest: 'Bangalore' },
                ].map((r, i) => (
                  <TouchableOpacity
                    key={`qr-${i}`}
                    style={styles.quickRouteChip}
                    onPress={() => {
                      setOriginInput(r.origin);
                      setDestInput(r.dest);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.quickRouteChipText}>
                      {r.origin} → {r.dest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.calculateBtn}
                activeOpacity={0.88}
                onPress={handleSaveRoute}
              >
                <Car size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.calculateBtnText}>Find Route Matches</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          /* ==================================================== */
          /* CASE A: ACTIVE ROUTE DISCOVERY SCREEN               */
          /* ==================================================== */
          <>
            <ScrollView
              style={styles.scrollContent}
              contentContainerStyle={{ paddingBottom: 110 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Route Corridor Banner */}
              <View style={styles.routeBannerCard}>
                <View style={styles.routeBannerHeader}>
                  <View style={styles.routeCitiesRow}>
                    <Text style={styles.routeCityName}>{routeData.routeOrigin}</Text>
                    <ArrowRight size={16} color="#3B82F6" style={{ marginHorizontal: 8 }} />
                    <Text style={styles.routeCityName}>{routeData.routeDestination}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.changeRouteBtn}
                    onPress={() => setIsEditingRoute(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.changeRouteBtnText}>Change</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.routeMetaRow}>
                  <View style={styles.metaBadge}>
                    <Car size={13} color="#2563EB" />
                    <Text style={styles.metaBadgeText}>{routeData.distanceKm} km</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Clock size={13} color="#2563EB" />
                    <Text style={styles.metaBadgeText}>{routeData.durationLabel}</Text>
                  </View>
                  <View style={styles.corridorBadge}>
                    <Text style={styles.corridorBadgeText}>Corridor Buffer: 12 km</Text>
                  </View>
                </View>
              </View>

              {/* Detour Filter Selector */}
              <View style={styles.detourFilterSection}>
                <View style={styles.filterTitleRow}>
                  <SlidersHorizontal size={14} color="#1E293B" />
                  <Text style={styles.detourSectionTitle}>Max Highway Detour Time</Text>
                </View>
                <View style={styles.detourButtonsRow}>
                  {detourOptions.map((mins) => {
                    const active = detourFilter === mins;
                    return (
                      <TouchableOpacity
                        key={`detour-${mins}`}
                        style={[styles.detourChip, active && styles.detourChipActive]}
                        onPress={() => setDetourFilter(mins)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.detourChipText, active && styles.detourChipTextActive]}>
                          ≤ {mins} min
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Recommended Safe Highway Venues */}
              {routeData.recommendedVenues.length > 0 && (
                <View style={styles.venuesSection}>
                  <View style={styles.venuesHeaderRow}>
                    <Coffee size={15} color="#D97706" />
                    <Text style={styles.venuesTitle}>Verified Public Meeting Venues Along Route</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.venuesScroll}>
                    {routeData.recommendedVenues.map((v) => (
                      <View key={v.id} style={styles.venueCard}>
                        <Text style={styles.venueName} numberOfLines={1}>{v.name}</Text>
                        <Text style={styles.venueArea}>{v.area}, {v.city}</Text>
                        <View style={styles.venueRatingRow}>
                          <Text style={styles.venueRatingText}>⭐ {v.rating}</Text>
                          <Text style={styles.verifiedTag}>Verified Public</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Candidate Matches */}
              <View style={styles.matchesHeaderRow}>
                <Text style={styles.matchesTitle}>
                  Compatible Profiles ({routeData.candidates.length})
                </Text>
                <Text style={styles.matchesSub}>Within ≤{detourFilter}m detour</Text>
              </View>

              {routeData.candidates.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No matches within ≤{detourFilter} min detour</Text>
                  <Text style={styles.emptySub}>
                    Try increasing your detour threshold to 20 or 30 minutes to discover more profiles along this route.
                  </Text>
                </View>
              ) : (
                routeData.candidates.map((cand) => (
                  <View key={cand.id} style={styles.candidateCard}>
                    <View style={styles.candHeader}>
                      <View style={styles.compatPill}>
                        <Sparkles size={12} color="#D97706" />
                        <Text style={styles.compatText}>{cand.compatibilityPercentage}% Match</Text>
                      </View>
                      <View style={styles.detourBadge}>
                        <Car size={12} color="#2563EB" />
                        <Text style={styles.detourBadgeText}>+{cand.routeDetourMinutes}m detour</Text>
                      </View>
                    </View>

                    <View style={styles.candBodyRow}>
                      <View style={styles.candAvatarWrap}>
                        <Car size={20} color="#64748B" />
                      </View>
                      <View style={styles.candInfoCol}>
                        <Text style={styles.candZone}>{cand.approximateZone}</Text>
                        <Text style={styles.candDist}>{cand.distanceLabel}</Text>
                        <Text style={styles.candNote}>{cand.availabilityNote}</Text>
                      </View>
                    </View>

                    {/* Venue Recommendation for this candidate */}
                    {cand.suggestedVenue && (
                      <View style={styles.suggestedVenueRow}>
                        <Coffee size={13} color="#B45309" />
                        <Text style={styles.suggestedVenueText} numberOfLines={1}>
                          Suggested meet: {cand.suggestedVenue.name}
                        </Text>
                      </View>
                    )}

                    {/* Action buttons */}
                    <View style={styles.candActionsRow}>
                      <TouchableOpacity
                        style={styles.suggestMeetBtn}
                        activeOpacity={0.8}
                        onPress={() => {
                          onClose();
                          onSuggestMeeting(cand, cand.suggestedVenue);
                        }}
                      >
                        <Coffee size={14} color="#2563EB" style={{ marginRight: 6 }} />
                        <Text style={styles.suggestMeetBtnText}>Suggest Meeting</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.requestIntroBtn}
                        activeOpacity={0.88}
                        onPress={() => {
                          onClose();
                          onRequestIntroduction(cand);
                        }}
                      >
                        <Send size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.requestIntroBtnText}>Request Intro</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Bottom View on Map Floating Button */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={styles.viewMapBtn}
                activeOpacity={0.88}
                onPress={() => {
                  onClose();
                  onViewRouteOnMap(routeData.routeOrigin || 'Thrissur', routeData.routeDestination || 'Kochi');
                }}
              >
                <Map size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.viewMapBtnText}>View Route on Map</Text>
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
  setupBanner: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  setupIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  setupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 6,
    textAlign: 'center',
  },
  setupSub: {
    fontSize: 13,
    color: '#3B82F6',
    textAlign: 'center',
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    padding: 0,
  },
  quickRoutesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 18,
    marginBottom: 8,
  },
  quickRoutesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  quickRouteChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickRouteChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  calculateBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  calculateBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  routeBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  routeBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  routeCitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeCityName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  changeRouteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  changeRouteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  routeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  corridorBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  corridorBadgeText: {
    fontSize: 11,
    color: '#64748B',
  },
  detourFilterSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  detourSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  detourButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detourChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  detourChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  detourChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  detourChipTextActive: {
    color: '#FFFFFF',
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
  venueRatingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  verifiedTag: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  matchesHeaderRow: {
    marginBottom: 10,
  },
  matchesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  matchesSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
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
  detourBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  detourBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
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
    backgroundColor: '#F1F5F9',
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
  candDist: {
    fontSize: 12,
    color: '#64748B',
  },
  candNote: {
    fontSize: 11,
    color: '#059669',
    marginTop: 2,
  },
  suggestedVenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    marginBottom: 10,
  },
  suggestedVenueText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '500',
  },
  candActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestMeetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  suggestMeetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  requestIntroBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: THEME.colors.primary,
  },
  requestIntroBtnText: {
    fontSize: 12,
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
    backgroundColor: '#1E293B',
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
