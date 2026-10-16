// MARGAM — Modern Privacy & Discovery Dashboard
// Privacy-First Progressive Disclosure, Anti-Triangulation Engine,
// Preset Configuration, and Field-Level Access Control

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  ShieldCheck,
  Shield,
  ShieldAlert,
  Eye,
  Lock,
  MapPin,
  Check,
  Sliders,
  Globe,
  Compass,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  User,
  Heart,
  AlertTriangle,
} from 'lucide-react-native';
import {
  MapVisibilityOption,
  LocationDisplayMode,
  AvailabilityStatus,
  ProfileFieldPerms,
  VisibilityState,
} from '../../types';
import {
  AdvancedMatrimonialProfile,
  PrivacyPreset,
  SectionAccessRequest,
  AccessRequestStatus,
} from '../../types/profile';
import {
  getSectionAccessRequestsForOwner,
  respondToSectionAccessRequest,
} from '../../services/advancedProfileEngine';

export interface PrivacyDashboardProps {
  mapVisibility: MapVisibilityOption;
  onChangeMapVisibility: (option: MapVisibilityOption) => void;
  locationMode: LocationDisplayMode;
  onChangeLocationMode: (mode: LocationDisplayMode) => void;
  availability: AvailabilityStatus;
  onChangeAvailability: (status: AvailabilityStatus) => void;
  fieldPerms: ProfileFieldPerms;
  onChangeFieldPerm: (field: keyof ProfileFieldPerms, state: VisibilityState) => void;
  masterProfile?: AdvancedMatrimonialProfile;
  onSelectPrivacyPreset?: (preset: PrivacyPreset) => void;
  onOpenViewAsOthers?: () => void;
}

export type PrivacyDashboardTab = 'overview' | 'map' | 'matrix' | 'requests';

export const PrivacyDashboard: React.FC<PrivacyDashboardProps> = ({
  mapVisibility,
  onChangeMapVisibility,
  locationMode,
  onChangeLocationMode,
  availability,
  onChangeAvailability,
  fieldPerms,
  onChangeFieldPerm,
  masterProfile,
  onSelectPrivacyPreset,
  onOpenViewAsOthers,
}) => {
  const [activeTab, setActiveTab] = useState<PrivacyDashboardTab>('overview');
  const [accessRequests, setAccessRequests] = useState<SectionAccessRequest[]>(() =>
    getSectionAccessRequestsForOwner(masterProfile?.userId || 'usr-current-sumod')
  );

  const pendingRequestsCount = accessRequests.filter((r) => r.status === 'pending').length;

  const handleRespondAccessRequest = (requestId: string, decision: AccessRequestStatus) => {
    try {
      const updated = respondToSectionAccessRequest(requestId, decision);
      setAccessRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...updated } : r))
      );
      Alert.alert(
        decision === 'allowed' ? 'Access Granted' : 'Request Declined',
        decision === 'allowed'
          ? 'The candidate can now view this section of your profile.'
          : 'Access request has been declined.'
      );
    } catch {
      Alert.alert('Error', 'Unable to update request status.');
    }
  };

  const renderRadioCard = (
    title: string,
    description: string,
    selected: boolean,
    onSelect: () => void,
    icon?: React.ReactNode,
    badgeText?: string
  ) => {
    return (
      <TouchableOpacity
        style={[styles.radioCard, selected && styles.radioCardSelected]}
        onPress={onSelect}
        activeOpacity={0.82}
      >
        <View style={styles.radioCardHeaderRow}>
          <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
            {selected && <View style={styles.radioCircleDot} />}
          </View>
          <View style={styles.radioTextCol}>
            <View style={styles.radioTitleRow}>
              {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
              <Text style={[styles.radioTitle, selected && styles.radioTitleSelected]}>
                {title}
              </Text>
              {badgeText && (
                <View style={[styles.radioBadge, selected && styles.radioBadgeSelected]}>
                  <Text style={[styles.radioBadgeText, selected && styles.radioBadgeTextSelected]}>
                    {badgeText}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.radioDesc}>{description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMatrixRow = (
    fieldName: string,
    permKey: keyof ProfileFieldPerms,
    currentState: VisibilityState,
    isHardlocked: boolean = false,
    helperNote?: string
  ) => {
    const states: { key: VisibilityState; label: string; icon: string }[] = [
      { key: 'private', label: 'Private', icon: '🔒' },
      { key: 'request_only', label: 'Request', icon: '👤' },
      { key: 'accepted_only', label: 'Accepted', icon: '🤝' },
      { key: 'public', label: 'Public', icon: '🌐' },
    ];

    return (
      <View key={permKey} style={styles.matrixRowCard}>
        <View style={styles.matrixRowHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.matrixFieldName}>{fieldName}</Text>
            {helperNote && <Text style={styles.matrixFieldHelper}>{helperNote}</Text>}
          </View>
          {isHardlocked && (
            <View style={styles.invariantBadge}>
              <ShieldAlert size={11} color="#DC2626" style={{ marginRight: 3 }} />
              <Text style={styles.invariantBadgeText}>Permanent Invariant</Text>
            </View>
          )}
        </View>

        <View style={styles.matrixPillsRow}>
          {states.map((st) => {
            const isSelected = currentState === st.key;
            const disabled = isHardlocked && st.key !== 'private';
            return (
              <TouchableOpacity
                key={st.key}
                style={[
                  styles.matrixPill,
                  isSelected && styles.matrixPillActive,
                  disabled && styles.matrixPillDisabled,
                ]}
                onPress={() => !disabled && onChangeFieldPerm(permKey, st.key)}
                disabled={disabled}
                activeOpacity={0.75}
              >
                <Text style={styles.matrixPillIcon}>{st.icon}</Text>
                <Text
                  style={[
                    styles.matrixPillText,
                    isSelected && styles.matrixPillTextActive,
                    disabled && styles.matrixPillTextDisabled,
                  ]}
                >
                  {st.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. TOP SEGMENTED NAVIGATION */}
      <View style={styles.tabNavContainer}>
        <TouchableOpacity
          style={[styles.tabNavBtn, activeTab === 'overview' && styles.tabNavBtnActive]}
          onPress={() => setActiveTab('overview')}
          activeOpacity={0.8}
        >
          <Shield
            size={14}
            color={activeTab === 'overview' ? '#2563EB' : '#64748B'}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[styles.tabNavText, activeTab === 'overview' && styles.tabNavTextActive]}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabNavBtn, activeTab === 'map' && styles.tabNavBtnActive]}
          onPress={() => setActiveTab('map')}
          activeOpacity={0.8}
        >
          <MapPin
            size={14}
            color={activeTab === 'map' ? '#2563EB' : '#64748B'}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.tabNavText, activeTab === 'map' && styles.tabNavTextActive]}>
            Map & Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabNavBtn, activeTab === 'matrix' && styles.tabNavBtnActive]}
          onPress={() => setActiveTab('matrix')}
          activeOpacity={0.8}
        >
          <Sliders
            size={14}
            color={activeTab === 'matrix' ? '#2563EB' : '#64748B'}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[styles.tabNavText, activeTab === 'matrix' && styles.tabNavTextActive]}
          >
            Field Matrix
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabNavBtn, activeTab === 'requests' && styles.tabNavBtnActive]}
          onPress={() => setActiveTab('requests')}
          activeOpacity={0.8}
        >
          <Lock
            size={14}
            color={activeTab === 'requests' ? '#2563EB' : '#64748B'}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[styles.tabNavText, activeTab === 'requests' && styles.tabNavTextActive]}
          >
            Requests
          </Text>
          {pendingRequestsCount > 0 && (
            <View style={styles.unreadCounterBadge}>
              <Text style={styles.unreadCounterText}>{pendingRequestsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & PRIVACY PRESETS                                         */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <>
            {/* 1. Executive Privacy Shield Banner */}
            <View style={styles.shieldBannerCard}>
              <View style={styles.shieldBannerHeader}>
                <View style={styles.shieldIconCircle}>
                  <ShieldCheck size={26} color="#059669" strokeWidth={2.4} />
                </View>
                <View style={styles.shieldBannerTextCol}>
                  <View style={styles.shieldTitleRow}>
                    <Text style={styles.shieldBannerTitle}>100% Privacy Protection</Text>
                    <View style={styles.activeGuaranteePill}>
                      <Text style={styles.activeGuaranteePillText}>ACTIVE</Text>
                    </View>
                  </View>
                  <Text style={styles.shieldBannerSubtitle}>
                    Anti-Triangulation & Zero PII Exposure Engine active across all discovery routes
                  </Text>
                </View>
              </View>

              <View style={styles.guaranteeDivider} />

              <View style={styles.guaranteeGrid}>
                <View style={styles.guaranteeItem}>
                  <Check size={14} color="#059669" strokeWidth={2.8} style={{ marginRight: 6 }} />
                  <Text style={styles.guaranteeItemText}>Zero Raw GPS Coordinates Broadcast</Text>
                </View>
                <View style={styles.guaranteeItem}>
                  <Check size={14} color="#059669" strokeWidth={2.8} style={{ marginRight: 6 }} />
                  <Text style={styles.guaranteeItemText}>Phone & Email Strictly Private Until Mutual Match</Text>
                </View>
                <View style={styles.guaranteeItem}>
                  <Check size={14} color="#059669" strokeWidth={2.8} style={{ marginRight: 6 }} />
                  <Text style={styles.guaranteeItemText}>Horoscope & Family Locked Behind Consent Request</Text>
                </View>
              </View>

              {onOpenViewAsOthers && (
                <TouchableOpacity
                  style={styles.viewAsOthersBtn}
                  onPress={onOpenViewAsOthers}
                  activeOpacity={0.85}
                >
                  <Eye size={16} color="#2563EB" style={{ marginRight: 6 }} />
                  <Text style={styles.viewAsOthersBtnText}>Preview What Others See</Text>
                  <ChevronRight size={16} color="#2563EB" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              )}
            </View>

            {/* 2. Global Privacy Presets */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderCol}>
                <Text style={styles.sectionTitle}>Global Privacy Preset</Text>
                <Text style={styles.sectionSubtitle}>
                  Choose how much of your matrimonial profile is discoverable to candidates searching nearby routes.
                </Text>
              </View>

              <View style={styles.cardsList}>
                {renderRadioCard(
                  'Maximum Privacy',
                  'Highest anonymity. Only blurred photo, fuzzed city, and basic interests visible until you explicitly approve an introduction.',
                  masterProfile?.privacyPreset === 'maximum_privacy',
                  () => onSelectPrivacyPreset?.('maximum_privacy'),
                  <Shield size={16} color="#64748B" />,
                  'Discreet'
                )}

                {renderRadioCard(
                  'Balanced ⭐ (Recommended)',
                  'First name, age, profession, and Core Margams visible to compatible matches. Horoscope, family, and direct contact details remain locked.',
                  masterProfile?.privacyPreset === 'balanced',
                  () => onSelectPrivacyPreset?.('balanced'),
                  <Sliders size={16} color="#2563EB" />,
                  'Optimal'
                )}

                {renderRadioCard(
                  'Open Discovery',
                  'Full matrimonial biodata visible to all verified members along your travel corridors. Direct contact details remain strictly private.',
                  masterProfile?.privacyPreset === 'open',
                  () => onSelectPrivacyPreset?.('open'),
                  <Globe size={16} color="#059669" />,
                  'Fastest Match'
                )}
              </View>
            </View>

            {/* 3. Introduction Availability */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderCol}>
                <Text style={styles.sectionTitle}>Introduction Availability</Text>
                <Text style={styles.sectionSubtitle}>
                  Control whether compatible candidates along routes can send you introduction requests.
                </Text>
              </View>

              <View style={styles.cardsList}>
                {renderRadioCard(
                  'Available & Exploring',
                  'Open to receiving introduction requests from compatible matrimonial matches along routes.',
                  availability === 'available',
                  () => onChangeAvailability('available'),
                  <Check size={16} color="#059669" />
                )}

                {renderRadioCard(
                  'Temporarily Paused / Busy',
                  'Currently in meaningful conversations. Pauses new introduction requests while preserving connections.',
                  availability === 'temporarily_unavailable',
                  () => onChangeAvailability('temporarily_unavailable'),
                  <Clock size={16} color="#F59E0B" />
                )}
              </View>
            </View>

            {/* 4. Safe Location Fuzzing Summary Pill */}
            <View style={styles.safeLocationBox}>
              <MapPin size={18} color="#0284C7" style={{ marginRight: 8, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.safeLocationTitle}>Anti-Triangulation Active</Text>
                <Text style={styles.safeLocationDesc}>
                  Your discovery marker is displayed as{' '}
                  <Text style={styles.safeLocationHighlight}>
                    {masterProfile?.location.safeDisplayArea || 'Thrissur / Kochi Area (3.5 km fuzzed buffer)'}
                  </Text>
                  . Exact street address and coordinates are permanently shielded on servers.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MAP & LOCATION DISCOVERY                                           */}
        {/* ========================================================================= */}
        {activeTab === 'map' && (
          <>
            {/* Map Anti-Triangulation Architecture Card */}
            <View style={styles.mapExplainerCard}>
              <View style={styles.mapExplainerIconCircle}>
                <Compass size={22} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mapExplainerTitle}>Anti-Triangulation Engine</Text>
                <Text style={styles.mapExplainerDesc}>
                  Margam uses mathematical non-deterministic fuzzing to ensure that your home or workplace coordinates cannot be deduced, even through multiple repeated corridor scans.
                </Text>
              </View>
            </View>

            {/* Map Discovery Visibility */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderCol}>
                <Text style={styles.sectionTitle}>Map Discovery Visibility</Text>
                <Text style={styles.sectionSubtitle}>
                  Determine who can see your anonymous presence indicator when searching along highway routes:
                </Text>
              </View>

              <View style={styles.cardsList}>
                {renderRadioCard(
                  'Everyone matching my criteria',
                  'Your approximate zone appears to all compatible candidates searching nearby routes.',
                  mapVisibility === 'all_criteria',
                  () => onChangeMapVisibility('all_criteria')
                )}

                {renderRadioCard(
                  'Only highly compatible users (90%+)',
                  'Limits map discovery markers strictly to top-tier algorithmic compatibility matches.',
                  mapVisibility === 'highly_compatible_only',
                  () => onChangeMapVisibility('highly_compatible_only'),
                  <Sparkles size={14} color="#D97706" />
                )}

                {renderRadioCard(
                  'Only users I have opted to interact with',
                  'Completely hidden until you initiate an introduction request or express mutual interest.',
                  mapVisibility === 'opted_interact_only',
                  () => onChangeMapVisibility('opted_interact_only')
                )}

                {renderRadioCard(
                  'Nobody (Incognito Mode)',
                  'Temporarily remove your presence from map discovery corridors entirely.',
                  mapVisibility === 'nobody',
                  () => onChangeMapVisibility('nobody'),
                  <Lock size={14} color="#64748B" />
                )}
              </View>
            </View>

            {/* Location Precision On Discovery */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderCol}>
                <Text style={styles.sectionTitle}>Location Precision On Discovery</Text>
                <Text style={styles.sectionSubtitle}>
                  Select how generalized your location appears on search cards and discovery maps:
                </Text>
              </View>

              <View style={styles.cardsList}>
                {renderRadioCard(
                  'Approximate Area (2.5 - 4.5 km zone)',
                  'Shows a generalized privacy circle (e.g. "Thrissur Cultural Belt"). Prevents exact location inference.',
                  locationMode === 'approximate_area',
                  () => onChangeLocationMode('approximate_area')
                )}

                {renderRadioCard(
                  'City Only',
                  'Shows only your city name ("Thrissur"). No map pin or route intersection.',
                  locationMode === 'city_only',
                  () => onChangeLocationMode('city_only')
                )}

                {renderRadioCard(
                  'Hidden',
                  'Location coordinates are never transmitted to discovery search clients.',
                  locationMode === 'hidden',
                  () => onChangeLocationMode('hidden')
                )}
              </View>
            </View>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FIELD VISIBILITY MATRIX                                            */}
        {/* ========================================================================= */}
        {activeTab === 'matrix' && (
          <>
            {/* Field Matrix Intro */}
            <View style={styles.matrixIntroCard}>
              <Text style={styles.matrixIntroTitle}>Profile Field Visibility Matrix</Text>
              <Text style={styles.matrixIntroDesc}>
                Configure default exposure rules for every profile field across the progressive matrimonial disclosure journey.
              </Text>

              <View style={styles.matrixLegendBar}>
                <Text style={styles.matrixLegendItem}>🔒 Private</Text>
                <Text style={styles.matrixLegendItem}>👤 Request Only</Text>
                <Text style={styles.matrixLegendItem}>🤝 Accepted</Text>
                <Text style={styles.matrixLegendItem}>🌐 Public</Text>
              </View>
            </View>

            {/* Level 1: Essential Identity */}
            <View style={styles.matrixLevelCard}>
              <View style={styles.matrixLevelHeader}>
                <View style={[styles.matrixLevelBadge, { backgroundColor: '#EFF6FF' }]}>
                  <User size={13} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.matrixLevelTitle}>Level 1: Essential Identity (Discovery)</Text>
                  <Text style={styles.matrixLevelSub}>Basic attributes shown on discovery cards</Text>
                </View>
              </View>

              <View style={styles.matrixList}>
                {renderMatrixRow('First Name', 'firstName', fieldPerms.firstName)}
                {renderMatrixRow('Full Legal Name', 'fullName', fieldPerms.fullName, false, 'Requires request by default')}
                {renderMatrixRow('Age', 'age', fieldPerms.age, false, 'Displayed as formatted age')}
                {renderMatrixRow('Primary Profile Photo', 'profilePhoto', fieldPerms.profilePhoto)}
                {renderMatrixRow('Additional Photos', 'additionalPhotos', fieldPerms.additionalPhotos)}
                {renderMatrixRow('Short Introduction', 'shortIntro', fieldPerms.shortIntro)}
                {renderMatrixRow('Profession & Industry', 'profession', fieldPerms.profession)}
              </View>
            </View>

            {/* Level 2: Background & Lifestyle */}
            <View style={styles.matrixLevelCard}>
              <View style={styles.matrixLevelHeader}>
                <View style={[styles.matrixLevelBadge, { backgroundColor: '#F0FDF4' }]}>
                  <Sparkles size={13} color="#16A34A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.matrixLevelTitle}>Level 2: Background & Lifestyle</Text>
                  <Text style={styles.matrixLevelSub}>Education, career, and personal pursuits</Text>
                </View>
              </View>

              <View style={styles.matrixList}>
                {renderMatrixRow('Full Biography', 'fullBio', fieldPerms.fullBio)}
                {renderMatrixRow('Education Degree', 'education', fieldPerms.education)}
                {renderMatrixRow('Company / Employer', 'company', fieldPerms.company)}
                {renderMatrixRow('City', 'city', fieldPerms.city)}
                {renderMatrixRow('Area / Sub-district', 'area', fieldPerms.area)}
              </View>
            </View>

            {/* Level 3: Sensitive Sections (Consent-Gated) */}
            <View style={styles.matrixLevelCard}>
              <View style={styles.matrixLevelHeader}>
                <View style={[styles.matrixLevelBadge, { backgroundColor: '#FDF4FF' }]}>
                  <Lock size={13} color="#9333EA" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.matrixLevelTitle}>Level 3: Sensitive Sections (Consent-Gated)</Text>
                  <Text style={styles.matrixLevelSub}>Protected biodata requiring explicit approval</Text>
                </View>
              </View>

              <View style={styles.matrixList}>
                {renderMatrixRow('Family Information & Siblings', 'familyOverview', fieldPerms.familyOverview, false, 'Protected family background')}
              </View>
            </View>

            {/* Level 4: Direct Contact (Strict Invariant) */}
            <View style={[styles.matrixLevelCard, styles.matrixLevelCardProtected]}>
              <View style={styles.matrixLevelHeader}>
                <View style={[styles.matrixLevelBadge, { backgroundColor: '#FEF2F2' }]}>
                  <ShieldAlert size={13} color="#DC2626" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.matrixLevelTitle, { color: '#991B1B' }]}>
                    Level 4: Direct Contact (Strictly Shielded Invariant)
                  </Text>
                  <Text style={styles.matrixLevelSub}>
                    Permanent platform security: Never shared prior to mutual connection acceptance
                  </Text>
                </View>
              </View>

              <View style={styles.matrixList}>
                {renderMatrixRow('Exact Residential Coordinates', 'exactLocation', 'private', true, 'Anti-triangulation protected')}
                {renderMatrixRow('Phone Number', 'phoneNumber', 'private', true, 'Locked to mutual connections')}
                {renderMatrixRow('Personal Email', 'email', 'private', true, 'Locked to mutual connections')}
              </View>
            </View>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SECTION ACCESS REQUESTS                                            */}
        {/* ========================================================================= */}
        {activeTab === 'requests' && (
          <View style={styles.requestsTabContainer}>
            <View style={styles.requestsHeaderBox}>
              <Text style={styles.requestsHeaderTitle}>Section Access Requests</Text>
              <Text style={styles.requestsHeaderSub}>
                Manage requests from candidates seeking permission to view your locked sections (Horoscope, Family details, Income).
              </Text>
            </View>

            {accessRequests.length === 0 ? (
              <View style={styles.emptyRequestsBox}>
                <ShieldCheck size={36} color="#94A3B8" />
                <Text style={styles.emptyRequestsTitle}>No Access Requests</Text>
                <Text style={styles.emptyRequestsSub}>
                  When matches request permission to view locked sections of your profile, their requests will appear here for your review.
                </Text>
              </View>
            ) : (
              <View style={styles.requestsList}>
                {accessRequests.map((req) => {
                  const isPending = req.status === 'pending';
                  const isAllowed = req.status === 'allowed';
                  const isDeclined = req.status === 'declined';

                  return (
                    <View key={req.id} style={styles.requestCard}>
                      <View style={styles.requestCardTop}>
                        {req.requesterAvatarUrl ? (
                          <Image source={{ uri: req.requesterAvatarUrl }} style={styles.requesterAvatar} />
                        ) : (
                          <View style={styles.requesterAvatarFallback}>
                            <User size={18} color="#2563EB" />
                          </View>
                        )}
                        <View style={styles.requestInfoCol}>
                          <View style={styles.requesterNameRow}>
                            <Text style={styles.requesterName}>{req.requesterName}</Text>
                            <View style={styles.sectionRequestedPill}>
                              <Lock size={10} color="#6D28D9" style={{ marginRight: 3 }} />
                              <Text style={styles.sectionRequestedText}>
                                {req.section.toUpperCase()}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.requestTimeText}>
                            Requested on {new Date(req.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>

                      {req.note && (
                        <View style={styles.requestNoteBox}>
                          <Text style={styles.requestNoteText}>"{req.note}"</Text>
                        </View>
                      )}

                      <View style={styles.requestActionsRow}>
                        {isPending ? (
                          <>
                            <TouchableOpacity
                              style={styles.declineBtn}
                              onPress={() => handleRespondAccessRequest(req.id, 'declined')}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.declineBtnText}>Decline</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.allowBtn}
                              onPress={() => handleRespondAccessRequest(req.id, 'allowed')}
                              activeOpacity={0.85}
                            >
                              <Check size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                              <Text style={styles.allowBtnText}>Grant Access</Text>
                            </TouchableOpacity>
                          </>
                        ) : isAllowed ? (
                          <View style={styles.resolvedStatusPillSuccess}>
                            <Check size={13} color="#059669" style={{ marginRight: 4 }} />
                            <Text style={styles.resolvedStatusTextSuccess}>Access Granted</Text>
                          </View>
                        ) : (
                          <View style={styles.resolvedStatusPillNeutral}>
                            <Text style={styles.resolvedStatusTextNeutral}>Declined</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabNavContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 6,
  },
  tabNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  tabNavBtnActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tabNavText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  tabNavTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  unreadCounterBadge: {
    backgroundColor: '#E11D48',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 4,
  },
  unreadCounterText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },

  // 1. Executive Shield Banner
  shieldBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  shieldBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  shieldBannerTextCol: {
    flex: 1,
  },
  shieldTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  shieldBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  activeGuaranteePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  activeGuaranteePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#166534',
  },
  shieldBannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  guaranteeDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  guaranteeGrid: {
    gap: 8,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guaranteeItemText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  viewAsOthersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  viewAsOthersBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },

  // Sections & Cards
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionHeaderCol: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  cardsList: {
    gap: 8,
  },
  radioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  radioCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderWidth: 1.5,
  },
  radioCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: '#2563EB',
  },
  radioCircleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  radioTextCol: {
    flex: 1,
  },
  radioTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 3,
  },
  radioTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  radioTitleSelected: {
    color: '#1D4ED8',
  },
  radioBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 4,
  },
  radioBadgeSelected: {
    backgroundColor: '#DBEAFE',
  },
  radioBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  radioBadgeTextSelected: {
    color: '#1E40AF',
  },
  radioDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },

  safeLocationBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  safeLocationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 2,
  },
  safeLocationDesc: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  safeLocationHighlight: {
    fontWeight: '700',
    color: '#0284C7',
  },

  // Map Tab Explainer
  mapExplainerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 12,
    alignItems: 'center',
  },
  mapExplainerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapExplainerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 2,
  },
  mapExplainerDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },

  // Field Matrix Tab
  matrixIntroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  matrixIntroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  matrixIntroDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  matrixLegendBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  matrixLegendItem: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  matrixLevelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  matrixLevelCardProtected: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFBFB',
  },
  matrixLevelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  matrixLevelBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixLevelTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  matrixLevelSub: {
    fontSize: 11,
    color: '#64748B',
  },
  matrixList: {
    gap: 8,
  },
  matrixRowCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  matrixRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matrixFieldName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  matrixFieldHelper: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  invariantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  invariantBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B91C1C',
  },
  matrixPillsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  matrixPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 2,
  },
  matrixPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  matrixPillDisabled: {
    opacity: 0.35,
    backgroundColor: '#F1F5F9',
  },
  matrixPillIcon: {
    fontSize: 9,
  },
  matrixPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  matrixPillTextActive: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  matrixPillTextDisabled: {
    color: '#94A3B8',
  },

  // Access Requests Tab
  requestsTabContainer: {
    gap: 12,
  },
  requestsHeaderBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  requestsHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  requestsHeaderSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  emptyRequestsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyRequestsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginTop: 4,
  },
  emptyRequestsSub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 17,
    maxWidth: 260,
  },
  requestsList: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 10,
  },
  requestCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requesterAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  requesterAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  requestInfoCol: {
    flex: 1,
  },
  requesterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  requesterName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionRequestedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  sectionRequestedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6D28D9',
  },
  requestTimeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  requestNoteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  requestNoteText: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
  },
  requestActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 2,
  },
  declineBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  declineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  allowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#059669',
  },
  allowBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resolvedStatusPillSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  resolvedStatusTextSuccess: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  resolvedStatusPillNeutral: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  resolvedStatusTextNeutral: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
});
