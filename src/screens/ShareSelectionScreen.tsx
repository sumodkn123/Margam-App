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
  Platform,
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
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>What would you like to share?</Text>
          <Text style={styles.headerSubtitle}>
            Candidate in {candidate.approximateZone} ({candidate.compatibilityPercentage}% match)
          </Text>
        </View>
        <ShieldCheck size={22} color="#10B981" />
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
                <ActivityIndicator size="small" color="#8B5CF6" />
              ) : (
                <>
                  <Sparkles size={13} color="#8B5CF6" />
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
            placeholderTextColor="#94A3B8"
          />
          <Text style={styles.aiNotice}>
            AI respects your privacy intent and never fabricates personal claims.
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
          <Eye size={18} color="#FFFFFF" />
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 42,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 110,
  },
  typeSelectorCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    gap: 10,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  typeChipIcon: {
    fontSize: 13,
  },
  typeChipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  typeChipLabelActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    gap: 10,
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
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  aiButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  messageInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    color: '#0F172A',
    fontSize: 13,
    lineHeight: 18,
    textAlignVertical: 'top',
    minHeight: 88,
  },
  aiNotice: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
  },
  fieldsContainer: {
    gap: 4,
  },
  fieldsSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 4,
  },
  previewBtn: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  previewBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
