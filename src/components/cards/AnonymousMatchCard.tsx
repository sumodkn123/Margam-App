// MARGAM - Anonymous Match Card (Discovery Stage 1)
// Core Rule: Zero PII displayed before introduction request.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { AnonymousCandidate } from '../../types';
import {
  MapPin,
  CheckCircle2,
  Car,
  Clock,
  Send,
  EyeOff,
  Sparkles,
  Users,
  Heart,
} from 'lucide-react-native';

interface AnonymousMatchCardProps {
  candidate: AnonymousCandidate;
  onSendIntroduction: (candidate: AnonymousCandidate) => void;
  onViewProfile?: (candidate: AnonymousCandidate) => void;
  onClose?: () => void;
}

export const AnonymousMatchCard: React.FC<AnonymousMatchCardProps> = ({
  candidate,
  onSendIntroduction,
  onViewProfile,
  onClose,
}) => {
  const isCluster = candidate.clusterCount && candidate.clusterCount > 1;

  return (
    <View style={styles.cardContainer}>
      {/* Anonymous Header */}
      <View style={styles.cardHeader}>
        <View style={styles.badgeRow}>
          <View style={styles.compatBadge}>
            <Text style={styles.compatRing}>💍</Text>
            <Text style={styles.compatPercent}>
              {candidate.compatibilityPercentage}% Match
            </Text>
          </View>

          {candidate.isAlongRoute && (
            <View style={styles.routeTag}>
              <Car size={12} color={COLORS.routeAmber} />
              <Text style={styles.routeTagText}>Along Your Route</Text>
            </View>
          )}

          <View style={styles.privacyLockBadge}>
            <EyeOff size={11} color={COLORS.textMuted} />
            <Text style={styles.privacyLockText}>Anonymous Discovery</Text>
          </View>
        </View>

        {onClose && (
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.closeBtn}>&times;</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Title & Approximate Zone */}
      <View style={styles.bodySection}>
        <Text style={styles.matchTitle}>
          {isCluster ? `${candidate.clusterCount} Compatible Profiles` : 'Compatible Match'}
        </Text>
        <Text style={styles.discoveryQuote}>
          {isCluster
            ? 'Multiple individuals matching your criteria are active in this corridor.'
            : 'Someone matching your marriage preferences is available in this area.'}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={13} color={COLORS.primary} />
            <Text style={styles.metaText}>{candidate.approximateZone}</Text>
          </View>

          <View style={styles.metaItem}>
            <Clock size={13} color={COLORS.routeCyan} />
            <Text style={styles.metaText}>{candidate.distanceLabel}</Text>
          </View>
        </View>
      </View>

      {/* Compatibility Reasoning Grid */}
      <View style={styles.reasoningSection}>
        <View style={styles.reasoningHeader}>
          <Sparkles size={13} color={COLORS.primary} />
          <Text style={styles.reasoningHeaderText}>Why Margam Suggests Compatibility</Text>
        </View>

        <View style={styles.reasonsList}>
          {candidate.compatibilityReasons.slice(0, 3).map((reason, idx) => (
            <View key={`reason_${idx}`} style={styles.reasonItem}>
              <CheckCircle2 size={13} color={COLORS.privacyAccepted} />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Privacy Guarantee Note */}
      <View style={styles.privacyNoticeBox}>
        <Text style={styles.privacyNoticeText}>
          Personal details (name, photo, workplace, contact) remain strictly private until mutual introduction request.
        </Text>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionButtonsRow}>
        {onViewProfile && (
          <TouchableOpacity
            style={styles.viewProfileBtn}
            onPress={() => onViewProfile(candidate)}
            activeOpacity={0.85}
          >
            <Text style={styles.viewProfileBtnText}>View Profile</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, onViewProfile ? { flex: 1.4 } : { width: '100%' }]}
          onPress={() => onSendIntroduction(candidate)}
          activeOpacity={0.85}
        >
          <Heart size={15} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.actionButtonText}>
            {isCluster ? 'Browse Anonymous Area 💖' : 'Request Intro 💖'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  compatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  compatRing: {
    fontSize: 12,
  },
  compatPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  routeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  routeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  privacyLockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  privacyLockText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  closeBtn: {
    fontSize: 22,
    color: '#64748B',
    lineHeight: 22,
  },
  bodySection: {
    marginVertical: 4,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  discoveryQuote: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  reasoningSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  reasoningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  reasoningHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonsList: {
    gap: 4,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reasonText: {
    fontSize: 12,
    color: '#166534',
    flex: 1,
  },
  privacyNoticeBox: {
    paddingVertical: 4,
    marginBottom: 10,
  },
  privacyNoticeText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  viewProfileBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfileBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
});
