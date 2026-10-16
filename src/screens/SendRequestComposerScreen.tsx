// MARGAM — Screen 2: Send Request Composer & Privacy Matrix
// Implements Screen 2 of the 3-screen reference design (media_1791092535059.jpg):
// - Header with Recipient avatar, floating paper plane & hearts
// - "Your Message (Optional)" with live 0/300 character counter & AI suggestions
// - "What caught your attention? (Select up to 3)" dynamic multi-select chips
// - "Show matching details (optional)" toggle with Match Highlights card
// - Granular Privacy Matrix (Level 1 Essential, Level 2 Alignment, Level 3 Sensitive, Group 4 Direct Contact strictly locked)
// - Top nav with "< Back" and "Preview" (Consent Checkpoint)
// - Gradient "✈ Send Request" CTA button

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Alert,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  Send,
  Heart,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Check,
  MapPin,
  Coffee,
  Briefcase,
  GraduationCap,
  Info,
} from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path } from 'react-native-svg';
import {
  AnonymousCandidate,
  UserShareSelection,
  DetailedOtherUserProfile,
} from '../types';
import { RequestPreviewModal } from '../components/privacy/RequestPreviewModal';
import { improveIntroductionWithAi } from '../services/aiService';

export interface SendRequestPayload {
  message: string;
  selectedInterestReasons: string[];
  shareSelection: UserShareSelection;
  includeMatchingDetails: boolean;
}

interface SendRequestComposerScreenProps {
  candidate: AnonymousCandidate;
  recipientProfile?: DetailedOtherUserProfile | null;
  initialMessage?: string;
  initialSelectedReasons?: string[];
  initialShareSelection?: UserShareSelection;
  initialIncludeMatchingDetails?: boolean;
  onBack: () => void;
  onSendRequest: (payload: SendRequestPayload) => void;
}

const INTEREST_REASONS = [
  'Shared Margams',
  'Travel Interests',
  'Café Business',
  'Similar Values',
  'Location Proximity',
  'Education & Career',
  'Beautiful Profile',
  'Other',
];

export const SendRequestComposerScreen: React.FC<SendRequestComposerScreenProps> = ({
  candidate,
  recipientProfile,
  initialMessage = '',
  initialSelectedReasons = ['Shared Margams', 'Similar Values'],
  initialShareSelection,
  initialIncludeMatchingDetails = true,
  onBack,
  onSendRequest,
}) => {
  const recipientName = recipientProfile?.name || candidate.approximateZone.split(' ')[0] || 'Ananya';
  const recipientAvatar =
    recipientProfile?.photos.find((p) => p.isPrimary)?.url ||
    recipientProfile?.photos[0]?.url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const [message, setMessage] = useState<string>(initialMessage);
  const [selectedReasons, setSelectedReasons] = useState<string[]>(initialSelectedReasons);
  const [showMatchingDetails, setShowMatchingDetails] = useState<boolean>(initialIncludeMatchingDetails);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Granular Profile Disclosure State
  const [shareSelection, setShareSelection] = useState<UserShareSelection>(
    initialShareSelection || {
      firstName: true,
      age: true,
      gender: true,
      fullName: false,
      profilePhoto: true,
      additionalPhotos: false,
      shortIntro: true,
      fullBio: true,
      education: true,
      institution: false,
      profession: true,
      company: false,
      workplaceLocation: false,
      city: true,
      area: true,
      exactLocation: false,
      lifestylePreferences: true,
      detailedLifestyle: false,
      familyOverview: false,
      detailedFamily: false,
      phoneNumber: false,
      email: false,
    }
  );

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons((prev) => prev.filter((r) => r !== reason));
    } else {
      if (selectedReasons.length >= 3) {
        Alert.alert(
          'Maximum 3 Selections',
          'You can select up to 3 reasons that caught your attention.'
        );
        return;
      }
      setSelectedReasons((prev) => [...prev, reason]);
    }
  };

  const handleAiSuggest = async () => {
    setIsGeneratingAi(true);
    try {
      const generated = await improveIntroductionWithAi({
        userDraft: message || `Hello ${recipientName}, I felt an authentic connection viewing your profile and shared aspirations.`,
        requestType: 'introduction',
        tone: 'respectful_warm',
      });
      setMessage(generated.slice(0, 300));
    } catch {
      setMessage(
        `Hello ${recipientName}, I noticed we share mutual life goals in our Margams and lifestyle values. I would love to connect and get to know each other better.`
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSend = () => {
    onSendRequest({
      message: message.trim(),
      selectedInterestReasons: selectedReasons,
      shareSelection,
      includeMatchingDetails: showMatchingDetails,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 1. TOP NAVIGATION BAR */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.navBackBtn} onPress={onBack} activeOpacity={0.7}>
          <ArrowLeft size={22} color="#0F172A" />
          <Text style={styles.navBackText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.navTitle}>Send Request</Text>

        <TouchableOpacity
          style={styles.navPreviewBtn}
          onPress={() => setIsPreviewOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.navPreviewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 2. RECIPIENT HEADER CARD */}
        <View style={styles.heroCard}>
          <View style={styles.avatarGlowContainer}>
            <Image source={{ uri: recipientAvatar }} style={styles.recipientAvatar} />
            {/* Floating Paper Plane & Heart Deco */}
            <View style={styles.floatingPlaneIcon}>
              <Send size={15} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={styles.floatingHeartIcon}>
              <Heart size={14} color="#E11D48" fill="#E11D48" />
            </View>
          </View>

          <Text style={styles.heroTitle}>Show Your Interest</Text>
          <Text style={styles.heroSubtitle}>
            Send a request to {recipientName}. A thoughtful message helps you stand out.
          </Text>
        </View>

        {/* 3. YOUR MESSAGE (OPTIONAL) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Your Message (Optional)</Text>
            <Text
              style={[
                styles.charCounter,
                message.length >= 280 && { color: '#E11D48', fontWeight: '700' },
              ]}
            >
              {message.length}/300
            </Text>
          </View>

          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={(txt) => setMessage(txt.slice(0, 300))}
            placeholder="Write a message introducing yourself and why you'd like to connect..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* AI Thoughtful Message Suggestion */}
          <TouchableOpacity
            style={styles.aiSuggestBtn}
            onPress={handleAiSuggest}
            activeOpacity={0.8}
            disabled={isGeneratingAi}
          >
            <Sparkles size={14} color="#E11D48" />
            <Text style={styles.aiSuggestText}>
              {isGeneratingAi ? 'Drafting thoughtful note...' : '✨ Suggest a thoughtful message'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. WHAT CAUGHT YOUR ATTENTION? (SELECT UP TO 3) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>What caught your attention?</Text>
            <Text style={styles.selectionLimitHint}>(Select up to 3)</Text>
          </View>

          <View style={styles.chipsWrap}>
            {INTEREST_REASONS.map((reason) => {
              const isSelected = selectedReasons.includes(reason);
              return (
                <TouchableOpacity
                  key={reason}
                  style={[styles.reasonChip, isSelected && styles.reasonChipSelected]}
                  onPress={() => toggleReason(reason)}
                  activeOpacity={0.75}
                >
                  {isSelected && (
                    <View style={styles.chipCheckCircle}>
                      <Check size={11} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                  <Text style={[styles.reasonChipText, isSelected && styles.reasonChipTextSelected]}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. SHOW MATCHING DETAILS (OPTIONAL) */}
        <View style={styles.sectionCard}>
          <View style={styles.toggleHeaderRow}>
            <View style={styles.toggleTitleGroup}>
              <Sparkles size={16} color="#E11D48" />
              <Text style={styles.toggleLabel}>Show matching details (optional)</Text>
            </View>
            <Switch
              value={showMatchingDetails}
              onValueChange={setShowMatchingDetails}
              trackColor={{ false: '#CBD5E1', true: '#FECDD3' }}
              thumbColor={showMatchingDetails ? '#E11D48' : '#F1F5F9'}
            />
          </View>

          {showMatchingDetails && (
            <View style={styles.highlightsCard}>
              <Text style={styles.highlightsHeader}>Your Match Highlights</Text>
              <View style={styles.highlightsGrid}>
                <View style={styles.highlightPill}>
                  <Heart size={13} color="#E11D48" fill="#E11D48" />
                  <Text style={styles.highlightPillText}>
                    {candidate.compatibilityPercentage || 92}% Compatible
                  </Text>
                </View>

                <View style={styles.highlightPill}>
                  <Coffee size={13} color="#059669" />
                  <Text style={styles.highlightPillText}>
                    {candidate.sharedInterestsCount || 5} Common Margams
                  </Text>
                </View>

                <View style={styles.highlightPill}>
                  <Sparkles size={13} color="#2563EB" />
                  <Text style={styles.highlightPillText}>3 Shared Goals</Text>
                </View>

                <View style={styles.highlightPill}>
                  <MapPin size={13} color="#D97706" />
                  <Text style={styles.highlightPillText}>Similar Location</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 6. GRANULAR PRIVACY & PROFILE SHARING MATRIX */}
        <View style={styles.sectionCard}>
          <View style={styles.privacyHeaderGroup}>
            <View style={styles.shieldTitleRow}>
              <ShieldCheck size={18} color="#2563EB" />
              <Text style={styles.privacySectionTitle}>
                Choose what to share with {recipientName}
              </Text>
            </View>
            <Text style={styles.privacySectionDesc}>
              You decide what parts of your profile are revealed with this request.
            </Text>
          </View>

          {/* Level 1: Essential Identity (Always Included) */}
          <View style={styles.privacyLevelBox}>
            <View style={styles.levelTitleRow}>
              <View style={[styles.levelBadge, { backgroundColor: '#ECFDF5' }]}>
                <Check size={12} color="#059669" strokeWidth={3} />
              </View>
              <Text style={styles.levelName}>Level 1: Essential Identity</Text>
              <Text style={styles.includedDefaultTag}>Always Included</Text>
            </View>
            <View style={styles.safeAttributesList}>
              <Text style={styles.safeAttributeItem}>• First Name</Text>
              <Text style={styles.safeAttributeItem}>• Age</Text>
              <Text style={styles.safeAttributeItem}>• Display Photo</Text>
              <Text style={styles.safeAttributeItem}>• Profession</Text>
              <Text style={styles.safeAttributeItem}>• Core Margams</Text>
            </View>
          </View>

          {/* Level 2: Personal Alignment (Toggles) */}
          <View style={styles.privacyLevelBox}>
            <View style={styles.levelTitleRow}>
              <View style={[styles.levelBadge, { backgroundColor: '#EFF6FF' }]}>
                <Sparkles size={12} color="#2563EB" />
              </View>
              <Text style={styles.levelName}>Level 2: Personal Alignment</Text>
            </View>

            <View style={styles.disclosureToggleRow}>
              <Text style={styles.disclosureLabel}>Full Bio & Introduction</Text>
              <Switch
                value={shareSelection.fullBio}
                onValueChange={(val) => setShareSelection((p) => ({ ...p, fullBio: val }))}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={shareSelection.fullBio ? '#2563EB' : '#F1F5F9'}
              />
            </View>

            <View style={styles.disclosureToggleRow}>
              <Text style={styles.disclosureLabel}>Education & Degree</Text>
              <Switch
                value={shareSelection.education}
                onValueChange={(val) => setShareSelection((p) => ({ ...p, education: val }))}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={shareSelection.education ? '#2563EB' : '#F1F5F9'}
              />
            </View>

            <View style={styles.disclosureToggleRow}>
              <Text style={styles.disclosureLabel}>Lifestyle Preferences</Text>
              <Switch
                value={shareSelection.lifestylePreferences}
                onValueChange={(val) => setShareSelection((p) => ({ ...p, lifestylePreferences: val }))}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={shareSelection.lifestylePreferences ? '#2563EB' : '#F1F5F9'}
              />
            </View>
          </View>

          {/* Level 3: Sensitive Data (Default Off) */}
          <View style={styles.privacyLevelBox}>
            <View style={styles.levelTitleRow}>
              <View style={[styles.levelBadge, { backgroundColor: '#FDF4FF' }]}>
                <Lock size={12} color="#9333EA" />
              </View>
              <Text style={styles.levelName}>Level 3: Sensitive Data</Text>
              <Text style={styles.optionalTag}>Explicit Opt-in</Text>
            </View>

            <View style={styles.disclosureToggleRow}>
              <Text style={styles.disclosureLabel}>Family Details & Siblings</Text>
              <Switch
                value={shareSelection.familyOverview}
                onValueChange={(val) => setShareSelection((p) => ({ ...p, familyOverview: val }))}
                trackColor={{ false: '#CBD5E1', true: '#E9D5FF' }}
                thumbColor={shareSelection.familyOverview ? '#9333EA' : '#F1F5F9'}
              />
            </View>
          </View>

          {/* Group 4: Direct Contact (Strictly Protected Invariant) */}
          <View style={[styles.privacyLevelBox, styles.protectedInvariantBox]}>
            <View style={styles.levelTitleRow}>
              <View style={[styles.levelBadge, { backgroundColor: '#FEF2F2' }]}>
                <ShieldAlert size={12} color="#DC2626" />
              </View>
              <Text style={[styles.levelName, { color: '#991B1B' }]}>
                🔒 Direct Contact (Strictly Protected)
              </Text>
            </View>
            <Text style={styles.protectedDesc}>
              Phone number, email, and exact coordinates are NEVER shared with introduction requests.
              They remain private until mutual connection acceptance.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 7. FIXED BOTTOM ACTION BAR */}
      <View style={styles.fixedBottomContainer}>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.88}>
          <Svg width="100%" height={54} style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="ctaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FF4D6D" />
                <Stop offset="50%" stopColor="#EF4444" />
                <Stop offset="100%" stopColor="#DC2626" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height={54} rx={16} fill="url(#ctaGrad)" />
          </Svg>

          <View style={styles.sendBtnContent}>
            <Heart size={18} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.sendBtnText}>Send Introduction Request 💖</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.footnote}>
          🔒 Private & Secure. {recipientName} can accept, decline, or ask for more info.
        </Text>
      </View>
    </KeyboardAvoidingView>

      {/* Explicit Consent Checkpoint Modal (Preview Button) */}
      <RequestPreviewModal
        visible={isPreviewOpen}
        recipient={candidate}
        requestType="introduction"
        shareSelection={shareSelection}
        customMessage={message || 'No custom message included.'}
        onConfirmSend={() => {
          setIsPreviewOpen(false);
          handleSend();
        }}
        onEditShare={() => setIsPreviewOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 8,
  },
  navBackText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
    marginLeft: 2,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  navPreviewBtn: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  navPreviewText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E11D48',
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 140 : 124,
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarGlowContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  recipientAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#FB7185',
  },
  floatingPlaneIcon: {
    position: 'absolute',
    top: -4,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingHeartIcon: {
    position: 'absolute',
    bottom: -2,
    left: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  charCounter: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  selectionLimitHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  messageInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 90,
    lineHeight: 20,
  },
  aiSuggestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
  },
  aiSuggestText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E11D48',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  reasonChipSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: '#F43F5E',
  },
  chipCheckCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  reasonChipTextSelected: {
    color: '#E11D48',
    fontWeight: '700',
  },
  toggleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  highlightsCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 10,
    marginTop: 4,
  },
  highlightsHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9F1239',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 6,
  },
  highlightPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  privacyHeaderGroup: {
    gap: 4,
  },
  shieldTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacySectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  privacySectionDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  privacyLevelBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  includedDefaultTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  optionalTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9333EA',
  },
  safeAttributesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  safeAttributeItem: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  disclosureToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  disclosureLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  protectedInvariantBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  protectedDesc: {
    fontSize: 11,
    color: '#7F1D1D',
    lineHeight: 16,
  },
  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 10,
  },
  sendButton: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  sendBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  footnote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
