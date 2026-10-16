import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import {
  X,
  Send,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Lock,
  Sparkles,
  User,
  Heart,
  Phone,
} from 'lucide-react-native';
import { GranularIntroductionShareSelection } from '../../types/profile';
import { sendGranularIntroduction } from '../../services/advancedProfileEngine';

interface GranularIntroModalProps {
  visible: boolean;
  onClose: () => void;
  requesterId: string;
  recipientId: string;
  recipientName: string;
  onIntroSent: () => void;
}

export const GranularIntroModal: React.FC<GranularIntroModalProps> = ({
  visible,
  onClose,
  requesterId,
  recipientId,
  recipientName,
  onIntroSent,
}) => {
  const [selection, setSelection] = useState<GranularIntroductionShareSelection>({
    firstName: true,
    age: true,
    profilePhoto: true,
    profession: true,
    coreMargams: true,

    fullBio: true,
    educationDetails: true,
    lifestyleDetails: true,
    lifeMap: true,

    familyDetails: false,
    religionCommunity: false,
    horoscopeDetails: false,
    contactInformation: false, // Default strictly FALSE
  });

  const [message, setMessage] = useState<string>(
    `Hello ${recipientName}, I noticed we share mutual life aspirations in our Margams and values. I would love to connect and get to know each other better.`
  );

  const [isSending, setIsSending] = useState<boolean>(false);

  const toggleField = (key: keyof GranularIntroductionShareSelection) => {
    setSelection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSend = () => {
    setIsSending(true);
    try {
      sendGranularIntroduction(requesterId, recipientId, selection, message);
      Alert.alert(
        'Introduction Sent',
        `Your personalized introduction with selected profile sections was delivered to ${recipientName}.`
      );
      onIntroSent();
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to send introduction');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.brandBadge}>
                <Sparkles size={18} color="#EF4444" />
              </View>
              <View>
                <Text style={styles.title}>Send Introduction</Text>
                <Text style={styles.subtitle}>Choose what to share with {recipientName}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Introductory message */}
            <View style={styles.messageBox}>
              <Text style={styles.boxHeading}>Personalized Note</Text>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={3}
                placeholder="Write a courteous note..."
              />
            </View>

            {/* Level 1: Basics (Safe & Recommended) */}
            <View style={styles.sectionCard}>
              <View style={styles.levelHeader}>
                <ShieldCheck size={16} color="#059669" style={{ marginRight: 6 }} />
                <Text style={[styles.levelTitle, { color: '#065F46' }]}>
                  Level 1: Essential Identity (Recommended)
                </Text>
              </View>
              <Text style={styles.levelDesc}>
                Fundamental information for a warm and trustworthy first impression.
              </Text>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>First Name & Display Photo</Text>
                <Switch
                  value={selection.firstName && selection.profilePhoto}
                  onValueChange={() => {
                    const nextVal = !(selection.firstName && selection.profilePhoto);
                    setSelection((p) => ({ ...p, firstName: nextVal, profilePhoto: nextVal }));
                  }}
                  trackColor={{ false: '#CBD5E1', true: '#FECDD3' }}
                  thumbColor={selection.firstName ? '#EF4444' : '#F1F5F9'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Age & Approximate Location</Text>
                <Switch
                  value={selection.age}
                  onValueChange={() => toggleField('age')}
                  trackColor={{ false: '#CBD5E1', true: '#FECDD3' }}
                  thumbColor={selection.age ? '#EF4444' : '#F1F5F9'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Profession & Core Margams</Text>
                <Switch
                  value={selection.profession && selection.coreMargams}
                  onValueChange={() => {
                    const nextVal = !(selection.profession && selection.coreMargams);
                    setSelection((p) => ({ ...p, profession: nextVal, coreMargams: nextVal }));
                  }}
                  trackColor={{ false: '#CBD5E1', true: '#FECDD3' }}
                  thumbColor={selection.profession ? '#EF4444' : '#F1F5F9'}
                />
              </View>
            </View>

            {/* Level 2: Deeper Personal Alignment */}
            <View style={styles.sectionCard}>
              <View style={styles.levelHeader}>
                <User size={16} color="#E11D48" style={{ marginRight: 6 }} />
                <Text style={[styles.levelTitle, { color: '#BE123C' }]}>
                  Level 2: Deeper Personal Alignment
                </Text>
              </View>
              <Text style={styles.levelDesc}>
                Help them understand your character, daily habits, and aspirations.
              </Text>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Full About Me Statement</Text>
                <Switch
                  value={selection.fullBio}
                  onValueChange={() => toggleField('fullBio')}
                  trackColor={{ false: '#CBD5E1', true: '#FECDD3' }}
                  thumbColor={selection.fullBio ? '#EF4444' : '#F1F5F9'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Education & Lifestyle Details</Text>
                <Switch
                  value={selection.educationDetails && selection.lifestyleDetails}
                  onValueChange={() => {
                    const nextVal = !(selection.educationDetails && selection.lifestyleDetails);
                    setSelection((p) => ({ ...p, educationDetails: nextVal, lifestyleDetails: nextVal }));
                  }}
                  trackColor={{ false: '#CBD5E1', true: '#FECDD3' }}
                  thumbColor={selection.educationDetails ? '#EF4444' : '#F1F5F9'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Life Map (Timeline & Future Horizons)</Text>
                <Switch
                  value={selection.lifeMap}
                  onValueChange={() => toggleField('lifeMap')}
                  trackColor={{ false: '#CBD5E1', true: '#FECDD3' }}
                  thumbColor={selection.lifeMap ? '#EF4444' : '#F1F5F9'}
                />
              </View>
            </View>

            {/* Level 3: Sensitive Sections (Explicit Opt-In) */}
            <View style={styles.sectionCard}>
              <View style={styles.levelHeader}>
                <Lock size={16} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={[styles.levelTitle, { color: '#92400E' }]}>
                  Level 3: Sensitive & Protected Data
                </Text>
              </View>
              <Text style={styles.levelDesc}>
                Only share these if you wish to disclose family or astrological details upfront.
              </Text>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Family Details (Parents & Siblings)</Text>
                <Switch
                  value={selection.familyDetails}
                  onValueChange={() => toggleField('familyDetails')}
                  trackColor={{ false: '#CBD5E1', true: '#FED7AA' }}
                  thumbColor={selection.familyDetails ? '#EA580C' : '#F1F5F9'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Religion & Community Lineage</Text>
                <Switch
                  value={selection.religionCommunity}
                  onValueChange={() => toggleField('religionCommunity')}
                  trackColor={{ false: '#CBD5E1', true: '#FED7AA' }}
                  thumbColor={selection.religionCommunity ? '#EA580C' : '#F1F5F9'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Horoscope & Chart Details</Text>
                <Switch
                  value={selection.horoscopeDetails}
                  onValueChange={() => toggleField('horoscopeDetails')}
                  trackColor={{ false: '#CBD5E1', true: '#FED7AA' }}
                  thumbColor={selection.horoscopeDetails ? '#EA580C' : '#F1F5F9'}
                />
              </View>

              <View style={[styles.switchRow, { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={[styles.switchLabel, { color: '#DC2626' }]}>
                    Phone Number & Direct Contact
                  </Text>
                  <Text style={styles.warningSubtext}>
                    Recommended: Keep locked until safe chat conversation is established.
                  </Text>
                </View>
                <Switch
                  value={selection.contactInformation}
                  onValueChange={() => toggleField('contactInformation')}
                  trackColor={{ false: '#CBD5E1', true: '#FECACA' }}
                  thumbColor={selection.contactInformation ? '#DC2626' : '#F1F5F9'}
                />
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.sendIntroBtn}
              onPress={handleSend}
              activeOpacity={0.85}
              disabled={isSending}
            >
              <Heart size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.sendIntroBtnText}>
                {isSending ? 'Sending...' : 'Send Introduction Request 💖'}
              </Text>
            </TouchableOpacity>

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
  brandBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF1F2',
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
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  messageBox: {
    marginBottom: 16,
  },
  boxHeading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  messageInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#1E293B',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  sectionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  levelDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  warningSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  sendIntroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sendIntroBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
