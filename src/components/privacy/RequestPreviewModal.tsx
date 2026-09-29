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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.surfaceLight,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '90%',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderActive,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  compatPill: {
    backgroundColor: 'rgba(229, 139, 88, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  compatPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  scrollContent: {
    marginBottom: SPACING.md,
  },
  recipientCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.sm,
  },
  recipientLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  recipientArea: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  messageBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.routeCyan,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
  },
  messageBoxTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.routeCyan,
    marginBottom: 2,
  },
  messageBoxContent: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  seeSection: {
    backgroundColor: 'rgba(52, 211, 153, 0.05)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    marginBottom: SPACING.sm,
  },
  notSeeSection: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: SPACING.sm,
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
    color: COLORS.privacyAccepted,
  },
  notSeeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.error,
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
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  itemTextMuted: {
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(229, 139, 88, 0.08)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(229, 139, 88, 0.2)',
    marginTop: 4,
  },
  guaranteeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  buttonFooter: {
    gap: 8,
    paddingTop: SPACING.sm,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0F14',
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
    color: COLORS.textSecondary,
  },
});
