import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {
  X,
  Eye,
  ShieldCheck,
  Lock,
  CheckCircle,
  Briefcase,
  MapPin,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
} from 'lucide-react-native';
import {
  simulateWhatOthersSee,
  getMasterProfile,
} from '../../services/advancedProfileEngine';
import { FilteredDisplayProfile } from '../../types/profile';

interface PreviewWhatOthersSeeModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

export type PreviewSimulatorMode =
  | 'stranger'
  | 'match'
  | 'mutual_interest'
  | 'connection'
  | 'request_granted';

export const PreviewWhatOthersSeeModal: React.FC<PreviewWhatOthersSeeModalProps> = ({
  visible,
  onClose,
  userId,
}) => {
  const [selectedMode, setSelectedMode] = useState<PreviewSimulatorMode>('stranger');

  // Generate simulated profile on the fly
  const simulated: FilteredDisplayProfile = simulateWhatOthersSee(
    userId,
    selectedMode === 'request_granted' ? 'connection' : selectedMode,
    selectedMode === 'request_granted' ? ['family', 'horoscope', 'income'] : []
  );

  const modes: { key: PreviewSimulatorMode; label: string; badge: string; description: string }[] = [
    {
      key: 'stranger',
      label: 'Public / Map',
      badge: 'Discovery',
      description: 'Browsing on the map or swipe stack before any interaction.',
    },
    {
      key: 'match',
      label: 'Match',
      badge: 'Algorithm Match',
      description: 'Profiles that share high compatibility and mutual search criteria.',
    },
    {
      key: 'mutual_interest',
      label: 'Mutual Like',
      badge: 'Interested',
      description: 'Both profiles have expressed mutual interest.',
    },
    {
      key: 'connection',
      label: 'Connected',
      badge: 'Introduced',
      description: 'Introduction request accepted by both individuals.',
    },
    {
      key: 'request_granted',
      label: 'Access Granted',
      badge: 'Approved',
      description: 'Viewer specifically requested and was approved to see Family & Horoscope.',
    },
  ];

  const currentModeInfo = modes.find((m) => m.key === selectedMode)!;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.eyeBadge}>
                <Eye size={18} color="#E11D48" />
              </View>
              <View>
                <Text style={styles.title}>What Others See</Text>
                <Text style={styles.subtitle}>Live Privacy & Disclosure Simulator</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Mode Selector Horizontal Tabs */}
          <View style={styles.selectorWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeTabsRow}>
              {modes.map((mode) => {
                const isActive = selectedMode === mode.key;
                return (
                  <TouchableOpacity
                    key={mode.key}
                    style={[styles.modeTab, isActive && styles.modeTabActive]}
                    onPress={() => setSelectedMode(mode.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.modeTabText, isActive && styles.modeTabTextActive]}>
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Mode Description Banner */}
          <View style={styles.modeNoticeBanner}>
            <Info size={15} color="#E11D48" style={{ marginRight: 8, marginTop: 1 }} />
            <Text style={styles.modeNoticeText}>
              <Text style={{ fontWeight: '700' }}>{currentModeInfo.badge}: </Text>
              {currentModeInfo.description}
            </Text>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Zero PII Guarantee Banner */}
            <View style={styles.invariantCard}>
              <ShieldCheck size={16} color="#059669" style={{ marginRight: 8 }} />
              <Text style={styles.invariantCardText}>
                Anti-Triangulation Active: Raw coordinates, home addresses, phone numbers, and full date of birth are strictly protected.
              </Text>
            </View>

            {/* Profile Simulated Card */}
            <View style={styles.profileCard}>
              {/* Photo & Badge */}
              <View style={styles.photoRow}>
                <Image
                  source={{ uri: simulated.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' }}
                  style={styles.avatarImg}
                />
                <View style={styles.nameCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.profileName}>{simulated.displayName}</Text>
                    {simulated.isVerified && (
                      <CheckCircle size={16} color="#059669" fill="#059669" style={{ marginLeft: 6 }} />
                    )}
                  </View>
                  <View style={styles.metaRow}>
                    <MapPin size={13} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.metaText}>{simulated.approximateLocation}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Briefcase size={13} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.metaText}>{simulated.professionSummary || 'Professional'}</Text>
                  </View>
                </View>
              </View>

              {/* Basic Details Section */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionHeading}>Basic Details</Text>
                {simulated.basicDetails && !('isLocked' in simulated.basicDetails) ? (
                  <View style={styles.pillGrid}>
                    <View style={styles.pillItem}>
                      <Text style={styles.pillLabel}>Age</Text>
                      <Text style={styles.pillValue}>{simulated.basicDetails.ageDisplay}</Text>
                    </View>
                    <View style={styles.pillItem}>
                      <Text style={styles.pillLabel}>Height</Text>
                      <Text style={styles.pillValue}>{simulated.basicDetails.heightDisplay}</Text>
                    </View>
                    <View style={styles.pillItem}>
                      <Text style={styles.pillLabel}>Status</Text>
                      <Text style={styles.pillValue}>{simulated.basicDetails.maritalStatus}</Text>
                    </View>
                    <View style={styles.pillItem}>
                      <Text style={styles.pillLabel}>Language</Text>
                      <Text style={styles.pillValue}>{simulated.basicDetails.motherTongue}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.lockedBlock}>
                    <Lock size={14} color="#D97706" style={{ marginRight: 6 }} />
                    <Text style={styles.lockedBlockText}>Basic details locked for this stage</Text>
                  </View>
                )}
              </View>

              {/* About Me */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionHeading}>About Me</Text>
                {simulated.aboutMe && !('isLocked' in simulated.aboutMe) ? (
                  <Text style={styles.bioText}>{simulated.aboutMe.bio}</Text>
                ) : (
                  <View style={styles.lockedBlock}>
                    <Lock size={14} color="#D97706" style={{ marginRight: 6 }} />
                    <Text style={styles.lockedBlockText}>About Me hidden</Text>
                  </View>
                )}
              </View>

              {/* Family Details */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeadingRow}>
                  <Text style={styles.sectionHeading}>Family Details</Text>
                  {simulated.family && !('isLocked' in simulated.family) ? (
                    <View style={styles.statusUnlocked}>
                      <CheckCircle size={12} color="#059669" style={{ marginRight: 4 }} />
                      <Text style={styles.statusUnlockedText}>Unlocked</Text>
                    </View>
                  ) : (
                    <View style={styles.statusLocked}>
                      <Lock size={12} color="#D97706" style={{ marginRight: 4 }} />
                      <Text style={styles.statusLockedText}>Request Only</Text>
                    </View>
                  )}
                </View>

                {simulated.family && !('isLocked' in simulated.family) ? (
                  <View style={styles.detailsBox}>
                    <Text style={styles.detailRowText}>
                      <Text style={{ fontWeight: '600' }}>Family Type: </Text>
                      {simulated.family.familyType} ({simulated.family.familyValues})
                    </Text>
                    <Text style={styles.detailRowText}>
                      <Text style={{ fontWeight: '600' }}>Father: </Text>
                      {simulated.family.fatherSummary}
                    </Text>
                    <Text style={styles.detailRowText}>
                      <Text style={{ fontWeight: '600' }}>Mother: </Text>
                      {simulated.family.motherSummary}
                    </Text>
                    <Text style={styles.detailRowText}>
                      <Text style={{ fontWeight: '600' }}>Siblings: </Text>
                      {simulated.family.siblingSummary}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.lockedCard}>
                    <Lock size={16} color="#D97706" style={{ marginBottom: 6 }} />
                    <Text style={styles.lockedCardTitle}>Family Information is Protected</Text>
                    <Text style={styles.lockedCardSub}>
                      Requires viewer to send an access request and owner's consent.
                    </Text>
                  </View>
                )}
              </View>

              {/* Horoscope */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeadingRow}>
                  <Text style={styles.sectionHeading}>Horoscope & Jathakam</Text>
                  {simulated.horoscope && !('isLocked' in simulated.horoscope) ? (
                    <View style={styles.statusUnlocked}>
                      <CheckCircle size={12} color="#059669" style={{ marginRight: 4 }} />
                      <Text style={styles.statusUnlockedText}>Unlocked</Text>
                    </View>
                  ) : (
                    <View style={styles.statusLocked}>
                      <Lock size={12} color="#D97706" style={{ marginRight: 4 }} />
                      <Text style={styles.statusLockedText}>Protected</Text>
                    </View>
                  )}
                </View>

                {simulated.horoscope && !('isLocked' in simulated.horoscope) ? (
                  <View style={styles.detailsBox}>
                    <Text style={styles.detailRowText}>
                      <Text style={{ fontWeight: '600' }}>Nakshatra: </Text>
                      {simulated.horoscope.nakshatra}
                    </Text>
                    <Text style={styles.detailRowText}>
                      <Text style={{ fontWeight: '600' }}>Rasi: </Text>
                      {simulated.horoscope.rasi}
                    </Text>
                    <Text style={styles.detailRowText}>
                      <Text style={{ fontWeight: '600' }}>Compatibility Match: </Text>
                      Available
                    </Text>
                  </View>
                ) : (
                  <View style={styles.lockedCard}>
                    <Lock size={16} color="#D97706" style={{ marginBottom: 6 }} />
                    <Text style={styles.lockedCardTitle}>Horoscope Chart Protected</Text>
                    <Text style={styles.lockedCardSub}>
                      AI Compatibility calculation is enabled, but raw birth chart requires approved access request.
                    </Text>
                  </View>
                )}
              </View>

              {/* Margams */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionHeading}>Top Margams & Life Intent</Text>
                {simulated.margams && !('isLocked' in simulated.margams) ? (
                  <View style={styles.margamsWrap}>
                    {simulated.margams.coreMargams.map((m) => (
                      <View key={m.id} style={styles.margamTag}>
                        <Text style={styles.margamEmoji}>{m.emoji}</Text>
                        <Text style={styles.margamName}>{m.name}</Text>
                        <View style={styles.coreBadge}>
                          <Text style={styles.coreBadgeText}>Core</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.lockedBlock}>
                    <Lock size={14} color="#D97706" style={{ marginRight: 6 }} />
                    <Text style={styles.lockedBlockText}>Margams locked</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
  },
  selectorWrapper: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  modeTabsRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  modeTab: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeTabActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  modeNoticeBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FECDD3',
  },
  modeNoticeText: {
    fontSize: 12,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 17,
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  invariantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  invariantCardText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1,
    lineHeight: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
  },
  nameCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  sectionBlock: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  statusUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusUnlockedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  statusLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusLockedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: '45%',
  },
  pillLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  pillValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 2,
  },
  bioText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  detailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailRowText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  lockedBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  lockedBlockText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  lockedCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  lockedCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  lockedCardSub: {
    fontSize: 11,
    color: '#B45309',
    textAlign: 'center',
    lineHeight: 16,
  },
  margamsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  margamTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  margamEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  margamName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 6,
  },
  coreBadge: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  coreBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1D4ED8',
  },
});
