// MARGAM - Screen 2: Share Selection Screen ("What would you like to share?")
// Granular consent selection + Request Type picker + AI intro assistant + Consent checkpoint preview

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { FieldShareSelector } from '../components/privacy/FieldShareSelector';
import { RequestPreviewModal } from '../components/privacy/RequestPreviewModal';
import {
  AnonymousCandidate,
  RouteCorridor,
  RequestType,
  UserShareSelection,
  RouteShareSelection,
} from '../types';
import {
  generateDefaultIntroduction,
  improveIntroductionWithAi,
} from '../services/aiService';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Send,
  Eye,
  Car,
  MessageSquare,
  Compass,
} from 'lucide-react-native';

interface ShareSelectionScreenProps {
  candidate: AnonymousCandidate;
  route?: RouteCorridor;
  onBack: () => void;
  onSubmitRequest: (payload: {
    requestType: RequestType;
    message: string;
    shareSelection: UserShareSelection;
    routeSelection?: RouteShareSelection;
  }) => void;
}

export const ShareSelectionScreen: React.FC<ShareSelectionScreenProps> = ({
  candidate,
  route,
  onBack,
  onSubmitRequest,
}) => {
  const [requestType, setRequestType] = useState<RequestType>(
    candidate.isAlongRoute ? 'route_meet' : 'introduction'
  );

  // Default sharing state: Basic safe fields checked, Contact/Fullname/Family unchecked
  const [shareSelection, setShareSelection] = useState<UserShareSelection>({
    firstName: true,
    age: true,
    gender: true,
    fullName: false,
    profilePhoto: true,
    additionalPhotos: false,
    shortIntro: true,
    fullBio: false,
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
  });

  const [routeSelection, setRouteSelection] = useState<RouteShareSelection>({
    destinationCity: true,
    approximateArrivalArea: true,
    approximateArrivalTime: true,
    exactRoute: false,
    liveLocation: false,
  });

  const [message, setMessage] = useState<string>(() =>
    generateDefaultIntroduction(requestType, {
      originCity: route?.origin.name || 'Thrissur',
      destinationCity: route?.destination.name || 'Kochi',
      travelDate: 'this weekend',
    })
  );

  const [isImprovingAi, setIsImprovingAi] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handleTypeChange = (newType: RequestType) => {
    setRequestType(newType);
    setMessage(
      generateDefaultIntroduction(newType, {
        originCity: route?.origin.name || 'Thrissur',
        destinationCity: route?.destination.name || 'Kochi',
        travelDate: 'this weekend',
      })
    );
  };

  const handleImproveWithAi = async () => {
    setIsImprovingAi(true);
    try {
      const enhanced = await improveIntroductionWithAi({
        userDraft: message,
        requestType,
        tone: 'respectful_warm',
        routeContext: {
          originCity: route?.origin.name || 'Thrissur',
          destinationCity: route?.destination.name || 'Kochi',
          travelDate: 'this weekend',
        },
      });
      setMessage(enhanced);
    } finally {
      setIsImprovingAi(false);
    }
  };

  const handleConfirmSend = () => {
    setIsPreviewVisible(false);
    onSubmitRequest({
      requestType,
      message,
      shareSelection,
      routeSelection: requestType === 'route_meet' ? routeSelection : undefined,
    });
  };

  const requestTypeButtons: { type: RequestType; label: string; icon: string }[] = [
    { type: 'introduction', label: 'Introduction', icon: '👋' },
    { type: 'route_meet', label: 'Route Meet', icon: '🚗' },
    { type: 'destination', label: 'Destination', icon: '📍' },
    { type: 'future_trip', label: 'Future Trip', icon: '🗓' },
    { type: 'conversation', label: 'Chat First', icon: '💬' },
  ];

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>What would you like to share?</Text>
          <Text style={styles.headerSubtitle}>
            Candidate in {candidate.approximateZone} ({candidate.compatibilityPercentage}%)
          </Text>
        </View>
        <ShieldCheck size={20} color={COLORS.primary} />
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Request Type Selector (Section 10) */}
        <View style={styles.typeSelectorCard}>
          <Text style={styles.sectionHeading}>1. Select Request Type</Text>
          <View style={styles.typeChipsRow}>
            {requestTypeButtons.map((btn) => (
              <TouchableOpacity
                key={btn.type}
                style={[
                  styles.typeChip,
                  requestType === btn.type && styles.typeChipActive,
                ]}
                onPress={() => handleTypeChange(btn.type)}
                activeOpacity={0.8}
              >
                <Text style={styles.typeChipIcon}>{btn.icon}</Text>
                <Text
                  style={[
                    styles.typeChipLabel,
                    requestType === btn.type && styles.typeChipLabelActive,
                  ]}
                >
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Introduction Message & AI Assist (Section 9) */}
        <View style={styles.messageCard}>
          <View style={styles.messageHeaderRow}>
            <Text style={styles.sectionHeading}>2. Introduction Message</Text>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={handleImproveWithAi}
              disabled={isImprovingAi}
              activeOpacity={0.7}
            >
              {isImprovingAi ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <>
                  <Sparkles size={12} color={COLORS.primary} />
                  <Text style={styles.aiButtonText}>Improve with AI</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholder="Type your introduction note here..."
            placeholderTextColor={COLORS.textMuted}
          />
          <Text style={styles.aiNotice}>
            AI respects your intent and never fabricates personal or career claims.
          </Text>
        </View>

        {/* Granular Field Share Toggles (Section 3 & 12) */}
        <View style={styles.fieldsContainer}>
          <Text style={styles.sectionHeading}>3. Choose Profile Disclosures</Text>
          <Text style={styles.fieldsSubtext}>
            Only checked fields will be transmitted to this candidate.
          </Text>
          <FieldShareSelector
            shareSelection={shareSelection}
            onChangeShareSelection={setShareSelection}
            requestType={requestType}
            routeSelection={requestType === 'route_meet' ? routeSelection : undefined}
            onChangeRouteSelection={setRouteSelection}
          />
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.previewBtn}
          onPress={() => setIsPreviewVisible(true)}
          activeOpacity={0.85}
        >
          <Eye size={16} color="#0B0F14" />
          <Text style={styles.previewBtnText}>Review Disclosures & Preview</Text>
        </TouchableOpacity>
      </View>

      {/* Explicit Consent Checkpoint Modal (Section 4) */}
      <RequestPreviewModal
        visible={isPreviewVisible}
        recipient={candidate}
        requestType={requestType}
        shareSelection={shareSelection}
        customMessage={message}
        onConfirmSend={handleConfirmSend}
        onEditShare={() => setIsPreviewVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    gap: SPACING.sm,
  },
  backBtn: {
    padding: 6,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.md,
    paddingBottom: 90,
  },
  typeSelectorCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 8,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  typeChipActive: {
    backgroundColor: 'rgba(229, 139, 88, 0.2)',
    borderColor: COLORS.primary,
  },
  typeChipIcon: {
    fontSize: 12,
  },
  typeChipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  typeChipLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  messageCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 8,
  },
  messageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(229, 139, 88, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  aiButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  messageInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: SPACING.sm,
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  aiNotice: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  fieldsContainer: {
    gap: 4,
  },
  fieldsSubtext: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 15, 20, 0.95)',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  previewBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  previewBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0F14',
  },
});
