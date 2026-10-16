// MARGAM - Request Preview / Consent Checkpoint Modal (Section 4)
// Explicit Consent Checkpoint: Clearly segregates "They will see" from "They will NOT see"

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { UserShareSelection, AnonymousCandidate, RequestType } from '../../types';
import { Check, X, ShieldAlert, Send, ArrowLeft } from 'lucide-react-native';

interface RequestPreviewModalProps {
  visible: boolean;
  recipient: AnonymousCandidate;
  requestType: RequestType;
  shareSelection: UserShareSelection;
  customMessage: string;
  onConfirmSend: () => void;
  onEditShare: () => void;
}

export const RequestPreviewModal: React.FC<RequestPreviewModalProps> = ({
  visible,
  recipient,
  requestType,
  shareSelection,
  customMessage,
  onConfirmSend,
  onEditShare,
}) => {
  // Compute visible items
  const willSee: string[] = [];
  const willNotSee: string[] = [];

  if (shareSelection.firstName) willSee.push('First name');
  else willNotSee.push('First name');

  if (shareSelection.age) willSee.push('Age');
  else willNotSee.push('Age');

  if (shareSelection.profilePhoto) willSee.push('Profile photograph');
  else willNotSee.push('Profile photograph');

  if (shareSelection.city) willSee.push('City');
  else willNotSee.push('City');

  if (shareSelection.profession) willSee.push('Profession & Role');
  else willNotSee.push('Profession');

  if (shareSelection.shortIntro) willSee.push('Short introduction note');
  else willNotSee.push('Short introduction note');

  if (shareSelection.education) willSee.push('Education degree');
  else willNotSee.push('Education');

  if (shareSelection.lifestylePreferences) willSee.push('Lifestyle preferences');
  else willNotSee.push('Lifestyle preferences');

  // Hardcoded Protected Invariants
  willNotSee.push('Phone number');
  willNotSee.push('Personal Email');
  willNotSee.push('Exact residential coordinates (Never shared)');
  if (!shareSelection.fullName) willNotSee.push('Full legal name');
  if (!shareSelection.company) willNotSee.push('Current employer / Company');
  if (!shareSelection.familyOverview) willNotSee.push('Family details');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.headerSubtitle}>Explicit Consent Checkpoint</Text>
              <Text style={styles.headerTitle}>Your Introduction Request</Text>
            </View>
            <View style={styles.compatPill}>
              <Text style={styles.compatPillText}>
                {recipient.compatibilityPercentage}% Match
              </Text>
            </View>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Recipient Anonymity Banner */}
            <View style={styles.recipientCard}>
              <Text style={styles.recipientLabel}>Recipient</Text>
              <Text style={styles.recipientName}>Compatible Match</Text>
              <Text style={styles.recipientArea}>
                Area: {recipient.approximateZone}
              </Text>
            </View>

            {/* Introductory Message Preview */}
            <View style={styles.messageBox}>
              <Text style={styles.messageBoxTitle}>Your Custom Message:</Text>
              <Text style={styles.messageBoxContent}>"{customMessage}"</Text>
            </View>

            {/* "They will see" Checklist */}
            <View style={styles.seeSection}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
                  <Check size={14} color={COLORS.privacyAccepted} strokeWidth={3} />
                </View>
                <Text style={styles.seeTitle}>They will see:</Text>
              </View>

              <View style={styles.itemsList}>
                {willSee.map((item, idx) => (
                  <View key={`will_see_${idx}`} style={styles.itemRow}>
                    <Check size={13} color={COLORS.privacyAccepted} strokeWidth={2.5} />
                    <Text style={styles.itemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* "They will NOT see" Checklist */}
            <View style={styles.notSeeSection}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <X size={14} color={COLORS.error} strokeWidth={3} />
                </View>
                <Text style={styles.notSeeTitle}>They will NOT see:</Text>
              </View>

              <View style={styles.itemsList}>
                {willNotSee.map((item, idx) => (
                  <View key={`will_not_${idx}`} style={styles.itemRow}>
                    <X size={13} color={COLORS.error} strokeWidth={2.5} />
                    <Text style={[styles.itemText, styles.itemTextMuted]}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Privacy Guarantee Note */}
            <View style={styles.guaranteeBox}>
              <ShieldAlert size={14} color={COLORS.primary} />
              <Text style={styles.guaranteeText}>
                No extra information becomes public merely because a match exists. You retain 100% control at every stage.
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonFooter}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={onConfirmSend}
              activeOpacity={0.85}
            >
              <Send size={15} color="#0B0F14" />
              <Text style={styles.sendButtonText}>Send Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editButton}
              onPress={onEditShare}
              activeOpacity={0.8}
            >
              <ArrowLeft size={14} color={COLORS.textSecondary} />
              <Text style={styles.editButtonText}>Edit what I share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  compatPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  compatPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  scrollContent: {
    marginBottom: 16,
  },
  recipientCard: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  recipientLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  recipientArea: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  messageBox: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  messageBoxTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 2,
  },
  messageBoxContent: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  seeSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 10,
  },
  notSeeSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  notSeeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
  },
  itemsList: {
    gap: 6,
    paddingLeft: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  itemTextMuted: {
    color: '#64748B',
    fontWeight: '400',
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 4,
  },
  guaranteeText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
  buttonFooter: {
    gap: 8,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sendButton: {
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
  sendButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
