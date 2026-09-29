// MARGAM - Screen 3: Recipient Requests Screen (Sections 5, 6, 7)
// Reviews incoming introduction requests with selective disclosures and compatibility reasons

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { RecipientRequestCard } from '../components/cards/RecipientRequestCard';
import { MargamBrandHeader } from '../components/brand/MargamBrandHeader';
import { IntroductionRequest } from '../types';
import { ShieldCheck, Inbox, CheckCircle, Clock } from 'lucide-react-native';

interface IncomingRequestsScreenProps {
  incomingRequests: IntroductionRequest[];
  onAcceptRequest: (request: IntroductionRequest) => void;
  onDeclineRequest: (requestId: string) => void;
  onAskMoreInfo: (requestId: string) => void;
}

export const IncomingRequestsScreen: React.FC<IncomingRequestsScreenProps> = ({
  incomingRequests,
  onAcceptRequest,
  onDeclineRequest,
  onAskMoreInfo,
}) => {
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleAccept = (requestId: string) => {
    const req = incomingRequests.find((r) => r.id === requestId);
    if (req) {
      onAcceptRequest(req);
      setSuccessToast(
        `Introduction with ${req.requesterRevealedData.firstName || 'Candidate'} accepted! Stage 3 permissions unlocked.`
      );
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleDecline = (requestId: string) => {
    onDeclineRequest(requestId);
    setSuccessToast('Request politely declined.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleAskMore = (requestId: string) => {
    onAskMoreInfo(requestId);
    setSuccessToast('Requested additional information from candidate.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <View style={styles.container}>
      <MargamBrandHeader />

      {/* Screen Subheader */}
      <View style={styles.subheader}>
        <View style={styles.titleRow}>
          <Inbox size={18} color={COLORS.primary} />
          <Text style={styles.screenTitle}>Introduction Requests</Text>
        </View>
        <Text style={styles.screenDesc}>
          Review who wants to connect. Each person shares only what they have explicitly chosen.
        </Text>
      </View>

      {/* Success Notification Banner */}
      {successToast && (
        <View style={styles.toast}>
          <CheckCircle size={15} color={COLORS.privacyAccepted} />
          <Text style={styles.toastText}>{successToast}</Text>
        </View>
      )}

      {/* List of Incoming Requests */}
      <ScrollView style={styles.scrollList} contentContainerStyle={styles.scrollContent}>
        {incomingRequests.length > 0 ? (
          incomingRequests.map((request) => (
            <RecipientRequestCard
              key={request.id}
              request={request}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onAskMoreInfo={handleAskMore}
              onBlock={() => handleDecline(request.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Clock size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Pending Requests</Text>
            <Text style={styles.emptyDesc}>
              When someone matching your criteria along your travel routes sends an introduction request, it will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  subheader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  screenDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.privacyAccepted,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.privacyAccepted,
    flex: 1,
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xxl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginTop: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptyDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
