// MARGAM — Partner Matchmaking Preferences Editor
// Executive matrimonial search criteria matching premier matrimonial platforms
// Includes Demographics, Religion/Caste, Locations/Corridors, Education/Career,
// Lifestyle/Habits, Shared Margams & Marriage Horizons.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {
  Sliders,
  User,
  Heart,
  MapPin,
  GraduationCap,
  Briefcase,
  Coffee,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Compass,
  Calendar,
  Zap,
  Globe,
  RotateCcw,
} from 'lucide-react-native';
import {
  AdvancedMatrimonialProfile,
  PartnerPreferencesData,
  PreferenceImportance,
  PreferenceFlexibility,
} from '../../types/profile';
import { updateMasterProfile } from '../../services/advancedProfileEngine';

export interface PartnerPreferencesEditorProps {
  masterProfile: AdvancedMatrimonialProfile;
  onSavePreferences?: (updatedPrefs: PartnerPreferencesData) => void;
}

export const PartnerPreferencesEditor: React.FC<PartnerPreferencesEditorProps> = ({
  masterProfile,
  onSavePreferences,
}) => {
  const initialPrefs = masterProfile.partnerPreferences;

  // 1. Demographics State
  const [minAge, setMinAge] = useState(initialPrefs.ageRange.value.min || 24);
  const [maxAge, setMaxAge] = useState(initialPrefs.ageRange.value.max || 31);
  const [minHeight, setMinHeight] = useState(initialPrefs.heightRangeCm.value.min || 155);
  const [maxHeight, setMaxHeight] = useState(initialPrefs.heightRangeCm.value.max || 175);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<string[]>(['Never Married']);
  const [selectedMotherTongues, setSelectedMotherTongues] = useState<string[]>(['Malayalam', 'English']);

  // 2. Religion & Community State
  const [selectedReligions, setSelectedReligions] = useState<string[]>(
    initialPrefs.religions.value || ['Hindu', 'Spiritual']
  );
  const [casteNoBar, setCasteNoBar] = useState(true);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(
    initialPrefs.communities.value || ['Nair', 'Caste No Bar']
  );
  const [horoscopeMatchRequired, setHoroscopeMatchRequired] = useState<'must_match' | 'preferred' | 'not_required'>('preferred');
  const [manglikPreference, setManglikPreference] = useState<'non_manglik' | 'manglik' | 'does_not_matter'>('does_not_matter');

  // 3. Location & Travel Corridors State
  const [preferredCountries, setPreferredCountries] = useState<string[]>(['India', 'UAE / Middle East']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialPrefs.locations.value || ['Kochi', 'Thrissur', 'Ernakulam', 'Bangalore']
  );
  const [relocationOpen, setRelocationOpen] = useState<boolean>(initialPrefs.relocationAcceptance.value ?? true);
  const [selectedCorridors, setSelectedCorridors] = useState<string[]>([
    'NH 544 (Kochi — Thrissur)',
    'MC Road (Central Kerala)',
  ]);

  // 4. Education, Career & Income State
  const [selectedEducation, setSelectedEducation] = useState<string[]>(
    initialPrefs.educationLevels.value || ["Bachelor's Degree", "Master's Degree"]
  );
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>(
    initialPrefs.professions.value || ['Software / Tech', 'Creative / Design', 'Entrepreneur', 'Healthcare']
  );
  const [employmentSectors, setEmploymentSectors] = useState<string[]>([
    'Private Sector / MNC',
    'Tech & Startups',
    'Business Owner / Entrepreneur',
  ]);
  const [incomeRequirement, setIncomeRequirement] = useState<string>('₹10+ LPA');

  // 5. Lifestyle & Habits State
  const [selectedDiets, setSelectedDiets] = useState<string[]>(
    initialPrefs.dietaryPreferences.value || ['Vegetarian', 'Eggetarian', 'Non-Vegetarian (Flexible)']
  );
  const [smokingHabit, setSmokingHabit] = useState<string>(initialPrefs.smoking.value || 'Non-Smoker');
  const [alcoholHabit, setAlcoholHabit] = useState<string>(initialPrefs.alcohol.value || 'Non-Drinker / Occasional');
  const [selectedFamilyTypes, setSelectedFamilyTypes] = useState<string[]>(
    initialPrefs.familyTypes.value || ['Nuclear', 'Joint', 'Any']
  );
  const [familyValues, setFamilyValues] = useState<string>('Moderate / Balanced');

  // 6. Margam Exclusives (Shared Passions & Horizons)
  const [wantedMargams, setWantedMargams] = useState<string[]>(
    initialPrefs.coreMargamsWanted.value || ['Café Business', 'International Travel', 'Mindful Living & Fitness']
  );
  const [marriageTimeline, setMarriageTimeline] = useState<string>('Within 1–2 Years');
  const [familyPlanning, setFamilyPlanning] = useState<string>('Want children in future');

  // Section Accordion Collapsed States
  const [expandedSections, setExpandedSections] = useState({
    demographics: true,
    religion: true,
    location: true,
    career: true,
    lifestyle: true,
    margams: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const cmToFeetInches = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  const toggleMultiSelect = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter((x) => x !== item));
      }
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = () => {
    const updatedPrefs: PartnerPreferencesData = {
      ...initialPrefs,
      ageRange: {
        value: { min: minAge, max: maxAge },
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      heightRangeCm: {
        value: { min: minHeight, max: maxHeight },
        importance: 'preference',
        flexibility: 'open',
      },
      locations: {
        value: selectedLocations,
        importance: 'preference',
        flexibility: 'open',
      },
      religions: {
        value: selectedReligions,
        importance: 'preference',
        flexibility: 'open',
      },
      communities: {
        value: casteNoBar ? ['Caste No Bar', ...selectedCommunities] : selectedCommunities,
        importance: casteNoBar ? 'open' : 'preference',
        flexibility: 'open',
      },
      educationLevels: {
        value: selectedEducation,
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      professions: {
        value: selectedProfessions,
        importance: 'preference',
        flexibility: 'open',
      },
      dietaryPreferences: {
        value: selectedDiets,
        importance: 'nice_to_have',
        flexibility: 'open',
      },
      smoking: {
        value: smokingHabit,
        importance: 'deal_breaker',
        flexibility: 'required',
      },
      alcohol: {
        value: alcoholHabit,
        importance: 'preference',
        flexibility: 'open',
      },
      familyTypes: {
        value: selectedFamilyTypes,
        importance: 'nice_to_have',
        flexibility: 'open',
      },
      relocationAcceptance: {
        value: relocationOpen,
        importance: 'preference',
        flexibility: 'open',
      },
      coreMargamsWanted: {
        value: wantedMargams,
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      lifeGoalsAlignment: {
        value: [marriageTimeline, familyPlanning],
        importance: 'preference',
        flexibility: 'open',
      },
    };

    updateMasterProfile('usr-current-sumod', {
      partnerPreferences: updatedPrefs,
    });

    onSavePreferences?.(updatedPrefs);
    Alert.alert(
      'Preferences Saved',
      'Your partner match criteria have been updated. Candidate discovery, route corridors, and daily compatibility recommendations have been refreshed.'
    );
  };

  const handleResetDefaults = () => {
    setMinAge(24);
    setMaxAge(31);
    setMinHeight(155);
    setMaxHeight(175);
    setSelectedMaritalStatus(['Never Married']);
    setSelectedReligions(['Hindu', 'Spiritual']);
    setCasteNoBar(true);
    setSelectedLocations(['Kochi', 'Thrissur', 'Ernakulam', 'Bangalore']);
    setRelocationOpen(true);
    setSelectedEducation(["Bachelor's Degree", "Master's Degree"]);
    setSelectedProfessions(['Software / Tech', 'Creative / Design', 'Entrepreneur', 'Healthcare']);
    setIncomeRequirement('₹10+ LPA');
    setSmokingHabit('Non-Smoker');
    setWantedMargams(['Café Business', 'International Travel', 'Mindful Living & Fitness']);
    Alert.alert('Reset', 'Restored balanced default criteria.');
  };

  return (
    <View style={styles.container}>
      {/* 1. MATCH INTELLIGENCE BANNER */}
      <View style={styles.intelligenceBanner}>
        <View style={styles.bannerTopRow}>
          <View style={styles.bannerBadge}>
            <Sparkles size={13} color="#2563EB" />
            <Text style={styles.bannerBadgeText}>AI Match Engine</Text>
          </View>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleResetDefaults}
            activeOpacity={0.7}
          >
            <RotateCcw size={13} color="#64748B" style={{ marginRight: 4 }} />
            <Text style={styles.resetBtnText}>Reset Defaults</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.bannerTitle}>58 Compatible Candidates Match</Text>
        <Text style={styles.bannerSub}>
          Profiles actively matching your age, community, location corridors, and core Margams.
        </Text>

        <View style={styles.matchScoreBar}>
          <View style={styles.matchBarFill} />
        </View>
        <View style={styles.barLabelsRow}>
          <Text style={styles.barLabelText}>Selective</Text>
          <Text style={[styles.barLabelText, styles.barLabelActive]}>Balanced Match Pool (Optimal)</Text>
          <Text style={styles.barLabelText}>Broad</Text>
        </View>
      </View>

      {/* 2. SECTION 1: DEMOGRAPHICS & BASIC DETAILS */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('demographics')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <User size={16} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Age, Height & Demographics</Text>
              <Text style={styles.sectionSub}>
                {minAge}–{maxAge} yrs • {cmToFeetInches(minHeight)}–{cmToFeetInches(maxHeight)}
              </Text>
            </View>
          </View>
          {expandedSections.demographics ? (
            <ChevronUp size={18} color="#64748B" />
          ) : (
            <ChevronDown size={18} color="#64748B" />
          )}
        </TouchableOpacity>

        {expandedSections.demographics && (
          <View style={styles.sectionBody}>
            {/* Age Range Slider Controls */}
            <View style={styles.controlGroup}>
              <View style={styles.controlLabelRow}>
                <Text style={styles.controlLabel}>Age Preference</Text>
                <Text style={styles.highlightVal}>
                  {minAge} — {maxAge} years ({maxAge - minAge + 1} yrs span)
                </Text>
              </View>

              <View style={styles.stepperRow}>
                <View style={styles.stepperCol}>
                  <Text style={styles.stepperLabel}>Min Age</Text>
                  <View style={styles.stepperBtns}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setMinAge((p) => Math.max(20, p - 1))}
                    >
                      <Text style={styles.stepBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepValText}>{minAge} yrs</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setMinAge((p) => Math.min(maxAge - 1, p + 1))}
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.stepperDivider} />

                <View style={styles.stepperCol}>
                  <Text style={styles.stepperLabel}>Max Age</Text>
                  <View style={styles.stepperBtns}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setMaxAge((p) => Math.max(minAge + 1, p - 1))}
                    >
                      <Text style={styles.stepBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepValText}>{maxAge} yrs</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setMaxAge((p) => Math.min(48, p + 1))}
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Quick Age Span Chips */}
              <View style={styles.quickChipsRow}>
                {['22–27', '24–30', '25–32', '27–34'].map((chip) => {
                  const [qMin, qMax] = chip.split('–').map(Number);
                  const isCur = minAge === qMin && maxAge === qMax;
                  return (
                    <TouchableOpacity
                      key={chip}
                      style={[styles.quickChip, isCur && styles.quickChipActive]}
                      onPress={() => {
                        setMinAge(qMin);
                        setMaxAge(qMax);
                      }}
                    >
                      <Text style={[styles.quickChipText, isCur && styles.quickChipTextActive]}>
                        {chip} yrs
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Height Range Controls */}
            <View style={styles.controlGroup}>
              <View style={styles.controlLabelRow}>
                <Text style={styles.controlLabel}>Height Range</Text>
                <Text style={styles.highlightVal}>
                  {cmToFeetInches(minHeight)} ({minHeight} cm) — {cmToFeetInches(maxHeight)} ({maxHeight} cm)
                </Text>
              </View>

              <View style={styles.stepperRow}>
                <View style={styles.stepperCol}>
                  <Text style={styles.stepperLabel}>Min Height</Text>
                  <View style={styles.stepperBtns}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setMinHeight((p) => Math.max(140, p - 2))}
                    >
                      <Text style={styles.stepBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepValText}>{cmToFeetInches(minHeight)}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setMinHeight((p) => Math.min(maxHeight - 2, p + 2))}
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.stepperDivider} />

                <View style={styles.stepperCol}>
                  <Text style={styles.stepperLabel}>Max Height</Text>
                  <View style={styles.stepperBtns}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setMaxHeight((p) => Math.max(minHeight + 2, p - 2))}
                    >
                      <Text style={styles.stepBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepValText}>{cmToFeetInches(maxHeight)}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setMaxHeight((p) => Math.min(205, p + 2))}
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Marital Status Multi-Select */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Marital Status</Text>
              <View style={styles.pillsWrap}>
                {['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed', 'Open to Any'].map((st) => {
                  const sel = selectedMaritalStatus.includes(st);
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(selectedMaritalStatus, setSelectedMaritalStatus, st)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{st}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Mother Tongue */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Mother Tongue</Text>
              <View style={styles.pillsWrap}>
                {['Malayalam', 'English', 'Tamil', 'Hindi', 'Kannada', 'Open to Any'].map((lang) => {
                  const sel = selectedMotherTongues.includes(lang);
                  return (
                    <TouchableOpacity
                      key={lang}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(selectedMotherTongues, setSelectedMotherTongues, lang)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{lang}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 3. SECTION 2: RELIGION, CASTE & HOROSCOPE */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('religion')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.iconCircle, { backgroundColor: '#FDF4FF' }]}>
              <Sparkles size={16} color="#9333EA" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Religion, Caste & Horoscope</Text>
              <Text style={styles.sectionSub}>
                {selectedReligions.join(', ')} • {casteNoBar ? 'Caste No Bar ⭐' : selectedCommunities.join(', ')}
              </Text>
            </View>
          </View>
          {expandedSections.religion ? (
            <ChevronUp size={18} color="#64748B" />
          ) : (
            <ChevronDown size={18} color="#64748B" />
          )}
        </TouchableOpacity>

        {expandedSections.religion && (
          <View style={styles.sectionBody}>
            {/* Religion Multi-Select */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Religion</Text>
              <View style={styles.pillsWrap}>
                {['Hindu', 'Christian', 'Muslim', 'Spiritual', 'Open to Any'].map((rel) => {
                  const sel = selectedReligions.includes(rel);
                  return (
                    <TouchableOpacity
                      key={rel}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(selectedReligions, setSelectedReligions, rel)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{rel}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Caste No Bar Toggle Card */}
            <TouchableOpacity
              style={[styles.highlightOptionCard, casteNoBar && styles.highlightOptionCardActive]}
              onPress={() => setCasteNoBar(!casteNoBar)}
              activeOpacity={0.8}
            >
              <View style={styles.checkboxCircle}>
                {casteNoBar && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightOptionTitle}>Caste No Bar (Recommended ⭐)</Text>
                <Text style={styles.highlightOptionSub}>
                  Values, mutual alignment, and education are prioritized over traditional community borders.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Specific Community / Caste */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Preferred Communities in Kerala</Text>
              <View style={styles.pillsWrap}>
                {['Nair', 'Ezhava', 'Menon', 'Brahmin', 'Vishwakarma', 'Syrian Catholic', 'Latin Catholic', 'Open to All'].map((comm) => {
                  const sel = selectedCommunities.includes(comm);
                  return (
                    <TouchableOpacity
                      key={comm}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(selectedCommunities, setSelectedCommunities, comm)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{comm}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Horoscope / Jathakam Matching Requirement */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Astrological / Horoscope Match</Text>
              <View style={styles.segmentedTrio}>
                <TouchableOpacity
                  style={[styles.trioSegment, horoscopeMatchRequired === 'must_match' && styles.trioSegmentActive]}
                  onPress={() => setHoroscopeMatchRequired('must_match')}
                >
                  <Text style={[styles.trioText, horoscopeMatchRequired === 'must_match' && styles.trioTextActive]}>
                    Must Match
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.trioSegment, horoscopeMatchRequired === 'preferred' && styles.trioSegmentActive]}
                  onPress={() => setHoroscopeMatchRequired('preferred')}
                >
                  <Text style={[styles.trioText, horoscopeMatchRequired === 'preferred' && styles.trioTextActive]}>
                    Preferred ⭐
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.trioSegment, horoscopeMatchRequired === 'not_required' && styles.trioSegmentActive]}
                  onPress={() => setHoroscopeMatchRequired('not_required')}
                >
                  <Text style={[styles.trioText, horoscopeMatchRequired === 'not_required' && styles.trioTextActive]}>
                    Not Required
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Kuja Dosha / Manglik */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Kuja Dosha / Manglik</Text>
              <View style={styles.segmentedTrio}>
                <TouchableOpacity
                  style={[styles.trioSegment, manglikPreference === 'non_manglik' && styles.trioSegmentActive]}
                  onPress={() => setManglikPreference('non_manglik')}
                >
                  <Text style={[styles.trioText, manglikPreference === 'non_manglik' && styles.trioTextActive]}>
                    Non-Manglik
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.trioSegment, manglikPreference === 'manglik' && styles.trioSegmentActive]}
                  onPress={() => setManglikPreference('manglik')}
                >
                  <Text style={[styles.trioText, manglikPreference === 'manglik' && styles.trioTextActive]}>
                    Manglik
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.trioSegment, manglikPreference === 'does_not_matter' && styles.trioSegmentActive]}
                  onPress={() => setManglikPreference('does_not_matter')}
                >
                  <Text style={[styles.trioText, manglikPreference === 'does_not_matter' && styles.trioTextActive]}>
                    Doesn't Matter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 4. SECTION 3: LOCATION & TRAVEL CORRIDORS */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('location')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.iconCircle, { backgroundColor: '#F0FDF4' }]}>
              <MapPin size={16} color="#16A34A" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Location, Cities & Corridors</Text>
              <Text style={styles.sectionSub}>
                {selectedLocations.slice(0, 3).join(', ')} • {relocationOpen ? 'Open to Relocation' : 'Kerala Only'}
              </Text>
            </View>
          </View>
          {expandedSections.location ? (
            <ChevronUp size={18} color="#64748B" />
          ) : (
            <ChevronDown size={18} color="#64748B" />
          )}
        </TouchableOpacity>

        {expandedSections.location && (
          <View style={styles.sectionBody}>
            {/* Preferred Country / Scope */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Country / International Scope</Text>
              <View style={styles.pillsWrap}>
                {['India', 'UAE / Middle East', 'USA / Canada', 'UK / Europe', 'Open Worldwide'].map((country) => {
                  const sel = preferredCountries.includes(country);
                  return (
                    <TouchableOpacity
                      key={country}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(preferredCountries, setPreferredCountries, country)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{country}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Preferred Cities in Kerala / South India */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Preferred Hubs & Districts</Text>
              <View style={styles.pillsWrap}>
                {['Kochi / Ernakulam', 'Thrissur', 'Trivandrum', 'Kozhikode', 'Kottayam', 'Palakkad', 'Bangalore', 'All Kerala'].map((loc) => {
                  const sel = selectedLocations.includes(loc);
                  return (
                    <TouchableOpacity
                      key={loc}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(selectedLocations, setSelectedLocations, loc)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{loc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Highway Route Corridors (Margam Special) */}
            <View style={styles.controlGroup}>
              <View style={styles.controlLabelRow}>
                <Text style={styles.controlLabel}>Highway Route Corridors (Margams Map)</Text>
                <Text style={styles.corridorTag}>Along Route Matching</Text>
              </View>
              <View style={styles.pillsWrap}>
                {[
                  'NH 544 (Kochi — Thrissur)',
                  'MC Road (Central Kerala)',
                  'NH 66 (Coastal Calicut)',
                  'Bangalore — Kerala Corridor',
                ].map((corr) => {
                  const sel = selectedCorridors.includes(corr);
                  return (
                    <TouchableOpacity
                      key={corr}
                      style={[styles.corridorPill, sel && styles.corridorPillActive]}
                      onPress={() => toggleMultiSelect(selectedCorridors, setSelectedCorridors, corr)}
                      activeOpacity={0.8}
                    >
                      <Compass size={12} color={sel ? '#0284C7' : '#64748B'} style={{ marginRight: 5 }} />
                      <Text style={[styles.corridorPillText, sel && styles.corridorPillTextActive]}>{corr}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Open to Relocation Toggle */}
            <TouchableOpacity
              style={[styles.highlightOptionCard, relocationOpen && styles.highlightOptionCardActive]}
              onPress={() => setRelocationOpen(!relocationOpen)}
              activeOpacity={0.8}
            >
              <View style={styles.checkboxCircle}>
                {relocationOpen && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightOptionTitle}>Open to Relocation after Marriage</Text>
                <Text style={styles.highlightOptionSub}>
                  Willing to consider partner's base across Kerala cities, Bangalore, or abroad.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 5. SECTION 4: EDUCATION, CAREER & INCOME */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('career')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.iconCircle, { backgroundColor: '#F0F9FF' }]}>
              <GraduationCap size={16} color="#0284C7" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Education, Career & Income</Text>
              <Text style={styles.sectionSub}>
                {selectedEducation[0] || 'Graduates'} • {incomeRequirement}
              </Text>
            </View>
          </View>
          {expandedSections.career ? (
            <ChevronUp size={18} color="#64748B" />
          ) : (
            <ChevronDown size={18} color="#64748B" />
          )}
        </TouchableOpacity>

        {expandedSections.career && (
          <View style={styles.sectionBody}>
            {/* Highest Education */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Highest Education Qualification</Text>
              <View style={styles.pillsWrap}>
                {[
                  "Master's Degree",
                  "Bachelor's Degree",
                  'Doctorate / Ph.D',
                  'Chartered Accountant (CA/CFA)',
                  'Medicine & Healthcare (MBBS/MD)',
                  'Engineering / Tech',
                  'Any Graduate',
                ].map((edu) => {
                  const sel = selectedEducation.includes(edu);
                  return (
                    <TouchableOpacity
                      key={edu}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(selectedEducation, setSelectedEducation, edu)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{edu}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Profession Categories */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Profession / Industry Domains</Text>
              <View style={styles.pillsWrap}>
                {[
                  'Software / Tech',
                  'Creative / Design',
                  'Entrepreneur',
                  'Healthcare & Medicine',
                  'Finance & Banking',
                  'Management / Consulting',
                  'Civil / Govt Services',
                  'Open to Any',
                ].map((prof) => {
                  const sel = selectedProfessions.includes(prof);
                  return (
                    <TouchableOpacity
                      key={prof}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(selectedProfessions, setSelectedProfessions, prof)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{prof}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Working Sector */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Employment Sector</Text>
              <View style={styles.pillsWrap}>
                {[
                  'Private Sector / MNC',
                  'Tech & Startups',
                  'Business Owner / Entrepreneur',
                  'Govt / Public Sector',
                  'Healthcare Practice',
                  'Open to Any',
                ].map((sec) => {
                  const sel = employmentSectors.includes(sec);
                  return (
                    <TouchableOpacity
                      key={sec}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(employmentSectors, setEmploymentSectors, sec)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{sec}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Annual Income Expectation */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Annual Income Preference</Text>
              <View style={styles.incomeChipsRow}>
                {['No Constraint', '₹5+ LPA', '₹10+ LPA', '₹15+ LPA', '₹25+ LPA', '₹50+ LPA'].map((inc) => {
                  const isSel = incomeRequirement === inc;
                  return (
                    <TouchableOpacity
                      key={inc}
                      style={[styles.incomeChip, isSel && styles.incomeChipActive]}
                      onPress={() => setIncomeRequirement(inc)}
                    >
                      <Text style={[styles.incomeChipText, isSel && styles.incomeChipTextActive]}>
                        {inc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 6. SECTION 5: LIFESTYLE, HABITS & VALUES */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('lifestyle')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Coffee size={16} color="#D97706" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Diet, Habits & Lifestyle</Text>
              <Text style={styles.sectionSub}>
                {selectedDiets[0]} • {smokingHabit} • {alcoholHabit}
              </Text>
            </View>
          </View>
          {expandedSections.lifestyle ? (
            <ChevronUp size={18} color="#64748B" />
          ) : (
            <ChevronDown size={18} color="#64748B" />
          )}
        </TouchableOpacity>

        {expandedSections.lifestyle && (
          <View style={styles.sectionBody}>
            {/* Food / Diet */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Dietary Preference</Text>
              <View style={styles.pillsWrap}>
                {['Vegetarian', 'Eggetarian', 'Non-Vegetarian (Flexible)', 'Vegan', 'Any'].map((diet) => {
                  const sel = selectedDiets.includes(diet);
                  return (
                    <TouchableOpacity
                      key={diet}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(selectedDiets, setSelectedDiets, diet)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{diet}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Smoking Habit (Deal Breaker) */}
            <View style={styles.controlGroup}>
              <View style={styles.controlLabelRow}>
                <Text style={styles.controlLabel}>Smoking Habit</Text>
                <View style={styles.dealBreakerBadge}>
                  <Zap size={10} color="#DC2626" style={{ marginRight: 3 }} />
                  <Text style={styles.dealBreakerText}>Strict Deal Breaker</Text>
                </View>
              </View>
              <View style={styles.segmentedTrio}>
                {['Non-Smoker', 'Occasional', 'Does Not Matter'].map((sm) => {
                  const isSel = smokingHabit === sm;
                  return (
                    <TouchableOpacity
                      key={sm}
                      style={[styles.trioSegment, isSel && styles.trioSegmentActive]}
                      onPress={() => setSmokingHabit(sm)}
                    >
                      <Text style={[styles.trioText, isSel && styles.trioTextActive]}>{sm}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Drinking Habit */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Drinking Habit</Text>
              <View style={styles.segmentedTrio}>
                {['Non-Drinker', 'Social Drinker', 'Does Not Matter'].map((alc) => {
                  const isSel = alcoholHabit === alc;
                  return (
                    <TouchableOpacity
                      key={alc}
                      style={[styles.trioSegment, isSel && styles.trioSegmentActive]}
                      onPress={() => setAlcoholHabit(alc)}
                    >
                      <Text style={[styles.trioText, isSel && styles.trioTextActive]}>{alc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Family Type & Values */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Family Background Preference</Text>
              <View style={styles.pillsWrap}>
                {['Nuclear Family', 'Joint Family', 'Open to Both'].map((fam) => {
                  const sel = selectedFamilyTypes.includes(fam);
                  return (
                    <TouchableOpacity
                      key={fam}
                      style={[styles.pillBtn, sel && styles.pillBtnActive]}
                      onPress={() => toggleMultiSelect(selectedFamilyTypes, setSelectedFamilyTypes, fam)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, sel && styles.pillBtnTextActive]}>{fam}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 7. SECTION 6: CORE MARGAMS & MARRIAGE HORIZONS (MARGAM SPECIAL) */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('margams')}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFF1F2' }]}>
              <Heart size={16} color="#E11D48" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Shared Margams & Life Vision</Text>
              <Text style={styles.sectionSub}>
                {wantedMargams.slice(0, 2).join(' • ')} • {marriageTimeline}
              </Text>
            </View>
          </View>
          {expandedSections.margams ? (
            <ChevronUp size={18} color="#64748B" />
          ) : (
            <ChevronDown size={18} color="#64748B" />
          )}
        </TouchableOpacity>

        {expandedSections.margams && (
          <View style={styles.sectionBody}>
            {/* Core Margams Desired in Partner */}
            <View style={styles.controlGroup}>
              <View style={styles.controlLabelRow}>
                <Text style={styles.controlLabel}>Core Margams Desired in Partner</Text>
                <Text style={styles.corridorTag}>High Compatibility Weight</Text>
              </View>
              <Text style={styles.controlHint}>
                Candidates who share or want to build these pathways together receive prioritized ranking:
              </Text>
              <View style={styles.pillsWrap}>
                {[
                  'Café Business',
                  'International Travel',
                  'Mindful Living & Fitness',
                  'Photography & Visual Arts',
                  'Tech & Entrepreneurship',
                  'Sustainable Living',
                  'Literature & Books',
                  'Weekend Road Trips',
                ].map((mrg) => {
                  const sel = wantedMargams.includes(mrg);
                  return (
                    <TouchableOpacity
                      key={mrg}
                      style={[styles.margamPill, sel && styles.margamPillActive]}
                      onPress={() => toggleMultiSelect(wantedMargams, setWantedMargams, mrg)}
                      activeOpacity={0.8}
                    >
                      {sel && <Check size={12} color="#E11D48" style={{ marginRight: 4 }} />}
                      <Text style={[styles.margamPillText, sel && styles.margamPillTextActive]}>
                        {mrg}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Marriage Timeline Horizon */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Marriage Timeline Expectations</Text>
              <View style={styles.pillsWrap}>
                {['Within 6 Months', 'Within 1 Year', 'Within 1–2 Years', 'Flexible / When Right'].map((tm) => {
                  const isSel = marriageTimeline === tm;
                  return (
                    <TouchableOpacity
                      key={tm}
                      style={[styles.pillBtn, isSel && styles.pillBtnActive]}
                      onPress={() => setMarriageTimeline(tm)}
                    >
                      {isSel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, isSel && styles.pillBtnTextActive]}>{tm}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Family Planning */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Family Planning & Children</Text>
              <View style={styles.pillsWrap}>
                {['Want children in future', 'Undecided / Open to discuss', 'Do not want children'].map((fp) => {
                  const isSel = familyPlanning === fp;
                  return (
                    <TouchableOpacity
                      key={fp}
                      style={[styles.pillBtn, isSel && styles.pillBtnActive]}
                      onPress={() => setFamilyPlanning(fp)}
                    >
                      {isSel && <Check size={12} color="#2563EB" style={{ marginRight: 4 }} />}
                      <Text style={[styles.pillBtnText, isSel && styles.pillBtnTextActive]}>{fp}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 8. SAVE PREFERENCES ACTION BUTTON */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.88}
        >
          <Heart size={18} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.saveBtnText}>Save Matchmaking Preferences 💖</Text>
        </TouchableOpacity>
        <Text style={styles.saveFootnote}>
          🔒 Your preferences are strictly private and used only by Margam's AI engine to discover compatible matrimonial partners along your routes.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
  },

  // Match Intelligence Banner
  intelligenceBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  bannerSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  matchScoreBar: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  matchBarFill: {
    width: '68%',
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  barLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabelText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  barLabelActive: {
    color: '#2563EB',
    fontWeight: '800',
  },

  // Section Cards
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  sectionBody: {
    padding: 16,
    paddingTop: 0,
    gap: 18,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },

  // Control Groups
  controlGroup: {
    gap: 8,
  },
  controlLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  controlHint: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  highlightVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },

  // Steppers (Age, Height)
  stepperRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  stepperCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  stepperLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  stepperBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepValText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 50,
    textAlign: 'center',
  },
  stepperDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#CBD5E1',
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  quickChipActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  quickChipTextActive: {
    color: '#1D4ED8',
    fontWeight: '800',
  },

  // Pills (Multi-Select)
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  pillBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  pillBtnTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },

  // Highway Corridor Pills
  corridorTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  corridorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  corridorPillActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#38BDF8',
  },
  corridorPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  corridorPillTextActive: {
    color: '#0369A1',
    fontWeight: '700',
  },

  // Margam Pills
  margamPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  margamPillActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FB7185',
  },
  margamPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  margamPillTextActive: {
    color: '#BE123C',
    fontWeight: '700',
  },

  // Trios (Segmented 3-Way Buttons)
  segmentedTrio: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  trioSegment: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  trioSegmentActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trioText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  trioTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },

  // Deal Breaker Badge
  dealBreakerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dealBreakerText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B91C1C',
  },

  // Income Chips Row
  incomeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  incomeChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  incomeChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  incomeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  incomeChipTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },

  // Highlight Option Cards (e.g. Caste No Bar)
  highlightOptionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  highlightOptionCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  checkboxCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  highlightOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  highlightOptionSub: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },

  // Action Container
  actionContainer: {
    gap: 8,
    marginTop: 4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  saveFootnote: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 15,
  },
});
