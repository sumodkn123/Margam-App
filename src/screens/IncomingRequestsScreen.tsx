// MARGAM - Requests Hub Screen (Received & Sent Requests)
// Reviews incoming introduction requests with selective disclosures & allows managing sent requests

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { RecipientRequestCard } from '../components/cards/RecipientRequestCard';
import { MargamBrandHeader } from '../components/brand/MargamBrandHeader';
import { IntroductionRequest } from '../types';
import {
  ShieldCheck,
  Inbox,
  Send,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Heart,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { DETAILED_PROFILES } from '../services/profileService';
import { MARGAM_CANDIDATES } from '../services/margamService';

interface IncomingRequestsScreenProps {
  incomingRequests: IntroductionRequest[];
  sentRequests?: IntroductionRequest[];
  onAcceptRequest: (request: IntroductionRequest) => void;
  onDeclineRequest: (requestId: string) => void;
  onAskMoreInfo: (requestId: string) => void;
  onWithdrawRequest?: (requestId: string) => void;
}

export const IncomingRequestsScreen: React.FC<IncomingRequestsScreenProps> = ({
  incomingRequests,
  sentRequests = [],
  onAcceptRequest,
  onDeclineRequest,
  onAskMoreInfo,
  onWithdrawRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
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

  const handleWithdraw = (requestId: string) => {
    Alert.alert(
      'Withdraw Introduction Request',
      'Are you sure you want to withdraw this introduction request? The recipient will no longer be able to accept it.',
      [
        { text: 'Keep Request', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: () => {
            if (onWithdrawRequest) {
              onWithdrawRequest(requestId);
            }
            setSuccessToast('Introduction request withdrawn.');
            setTimeout(() => setSuccessToast(null), 3000);
          },
        },
      ]
    );
  };

  // Helper to resolve recipient information for sent requests
  const resolveRecipientMeta = (recipientId: string) => {
    const detailed = DETAILED_PROFILES[recipientId];
    if (detailed) {
      return {
        name: detailed.name,
        photo: detailed.photos[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        area: detailed.area,
        profession: detailed.profession,
      };
    }
    const margamCand = MARGAM_CANDIDATES.find((c) => c.id === recipientId);
    if (margamCand) {
      return {
        name: margamCand.name,
        photo: margamCand.photoUrl,
        area: margamCand.area,
        profession: margamCand.profession,
      };
    }
    return {
      name: 'Ananya',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      area: 'Kochi area',
      profession: 'Marketing Professional',
    };
  };

  return (
    <View style={styles.container}>
      <MargamBrandHeader />

      {/* Screen Subheader */}
      <View style={styles.subheader}>
        <View style={styles.titleRow}>
          <Inbox size={20} color={COLORS.primary} />
          <Text style={styles.screenTitle}>Introduction Requests</Text>
        </View>
        <Text style={styles.screenDesc}>
          Privacy-first matchmaking connections. Review incoming introductions or track requests you have sent.
        </Text>

        {/* Segmented Tab Switcher (Received vs Sent) */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'received' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('received')}
            activeOpacity={0.8}
          >
            <Inbox size={15} color={activeTab === 'received' ? '#0F172A' : '#64748B'} />
            <Text style={[styles.segmentText, activeTab === 'received' && styles.segmentTextActive]}>
              Received ({incomingRequests.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'sent' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('sent')}
            activeOpacity={0.8}
          >
            <Send size={14} color={activeTab === 'sent' ? '#0F172A' : '#64748B'} />
            <Text style={[styles.segmentText, activeTab === 'sent' && styles.segmentTextActive]}>
              Sent ({sentRequests.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Notification Banner */}
      {successToast && (
        <View style={styles.toast}>
          <CheckCircle size={15} color={COLORS.privacyAccepted} />
          <Text style={styles.toastText}>{successToast}</Text>
        </View>
      )}

      {/* List Content */}
      <ScrollView style={styles.scrollList} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'received' ? (
          incomingRequests.length > 0 ? (
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
              <Text style={styles.emptyTitle}>No Received Requests</Text>
              <Text style={styles.emptyDesc}>
                When someone matching your criteria along your travel routes sends an introduction request, it will appear here.
              </Text>
            </View>
          )
        ) : sentRequests.length > 0 ? (
          sentRequests.map((req) => {
            const recipient = resolveRecipientMeta(req.recipientId);
            return (
              <View key={req.id} style={styles.sentCard}>
                {/* Header Row */}
                <View style={styles.sentCardHeader}>
                  <Image source={{ uri: recipient.photo }} style={styles.sentAvatar} />
                  <View style={styles.sentHeaderInfo}>
                    <View style={styles.sentNameRow}>
                      <Text style={styles.sentName}>{recipient.name}</Text>
                      <View style={styles.sentStatusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.sentStatusText}>
                          {req.status === 'pending'
                            ? 'Pending Review'
                            : req.status === 'accepted'
                            ? 'Accepted'
                            : req.status === 'declined'
                            ? 'Declined'
                            : 'Withdrawn'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.sentSub}>{recipient.profession} • {recipient.area}</Text>
                    <Text style={styles.sentTimestamp}>Sent {req.createdAt}</Text>
                  </View>
                </View>

                {/* Message Quote */}
                {req.customMessage ? (
                  <View style={styles.sentMsgBox}>
                    <Text style={styles.sentMsgLabel}>Your message:</Text>
                    <Text style={styles.sentMsgText}>"{req.customMessage}"</Text>
                  </View>
                ) : null}

                {/* Reasons Chips */}
                {req.selectedInterestReasons && req.selectedInterestReasons.length > 0 ? (
                  <View style={styles.reasonsWrap}>
                    {req.selectedInterestReasons.map((reason, idx) => (
                      <View key={idx} style={styles.reasonChip}>
                        <Sparkles size={11} color="#C2410C" />
                        <Text style={styles.reasonChipText}>{reason}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                {/* Privacy Safeguard Notice */}
                <View style={styles.privacySafeNotice}>
                  <ShieldCheck size={13} color="#059669" />
                  <Text style={styles.privacySafeText}>
                    Disclosed under your explicit consent. No contact or exact coordinates shared.
                  </Text>
                </View>

                {/* Actions */}
                {req.status === 'pending' && onWithdrawRequest && (
                  <View style={styles.sentCardActions}>
                    <TouchableOpacity
                      style={styles.withdrawBtn}
                      activeOpacity={0.8}
                      onPress={() => handleWithdraw(req.id)}
                    >
                      <RotateCcw size={13} color="#EF4444" />
                      <Text style={styles.withdrawBtnText}>Withdraw Request</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Send size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Sent Requests</Text>
            <Text style={styles.emptyDesc}>
              You haven't sent any introduction requests yet. Discover compatible profiles on Home, Margams, or Map to connect.
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
    backgroundColor: '#F8FAFC',
  },
  subheader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  screenDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginTop: 8,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 110,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  sentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E2E8F0',
  },
  sentHeaderInfo: {
    flex: 1,
    gap: 2,
  },
  sentNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sentName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
  },
  sentStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  sentSub: {
    fontSize: 12,
    color: '#64748B',
  },
  sentTimestamp: {
    fontSize: 11,
    color: '#94A3B8',
  },
  sentMsgBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F43F5E',
    gap: 2,
  },
  sentMsgLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  sentMsgText: {
    fontSize: 12,
    color: '#1E293B',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  reasonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  reasonChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9A3412',
  },
  privacySafeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
  },
  privacySafeText: {
    fontSize: 11,
    color: '#166534',
    flex: 1,
  },
  sentCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  withdrawBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
});
