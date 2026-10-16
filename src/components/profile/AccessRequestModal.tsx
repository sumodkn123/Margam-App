import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import {
  X,
  Lock,
  Send,
  Shield,
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import { AccessRequestSection, SectionAccessRequest } from '../../types/profile';
import {
  requestSectionAccess,
  respondToSectionAccessRequest,
} from '../../services/advancedProfileEngine';

interface AccessRequestModalProps {
  visible: boolean;
  onClose: () => void;
  section: AccessRequestSection;
  targetUserId: string;
  targetUserName: string;
  requesterId: string;
  onRequestSubmitted: (request: SectionAccessRequest) => void;
}

export const AccessRequestModal: React.FC<AccessRequestModalProps> = ({
  visible,
  onClose,
  section,
  targetUserId,
  targetUserName,
  requesterId,
  onRequestSubmitted,
}) => {
  const sectionLabels: Record<AccessRequestSection, { title: string; desc: string }> = {
    family: {
      title: 'Family Details',
      desc: 'Parents, siblings, and family values are private until granted.',
    },
    horoscope: {
      title: 'Horoscope & Jathakam',
      desc: 'Birth time, chart details, and Nakshatra require explicit access.',
    },
    income: {
      title: 'Annual Income',
      desc: 'Specific compensation range is protected.',
    },
    contact: {
      title: 'Direct Contact Information',
      desc: 'Phone number and direct communication channel.',
    },
    religion: {
      title: 'Community & Sub-caste',
      desc: 'Detailed community and lineage background.',
    },
    full_bio: {
      title: 'Extended Personal Statement',
      desc: 'Deeper personal essays and reflections.',
    },
    photos: {
      title: 'Private Photo Album',
      desc: 'Additional personal and family photographs.',
    },
  };

  const currentSection = sectionLabels[section] || {
    title: 'Protected Information',
    desc: 'This section is private.',
  };

  const [note, setNote] = useState<string>(
    `Hello ${targetUserName}, I am genuinely interested in your profile and would love to view your ${currentSection.title.toLowerCase()} to check our alignment.`
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    try {
      const newReq = requestSectionAccess(requesterId, targetUserId, section, note);
      onRequestSubmitted(newReq);
      Alert.alert(
        'Request Sent',
        `Your request to view ${currentSection.title} has been forwarded to ${targetUserName}. You will be notified when they approve.`
      );
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not send request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.lockBadge}>
                <Lock size={18} color="#D97706" />
              </View>
              <View>
                <Text style={styles.title}>Request Access</Text>
                <Text style={styles.subtitle}>{currentSection.title}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Privacy Context Banner */}
          <View style={styles.contentWrap}>
            <View style={styles.infoBanner}>
              <Shield size={16} color="#2563EB" style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={styles.infoBannerText}>
                {targetUserName} has kept their {currentSection.title.toLowerCase()} private for safety and selective disclosure. They will review your request before granting access.
              </Text>
            </View>

            {/* Note text field */}
            <Text style={styles.inputLabel}>Personal Note (Recommended)</Text>
            <TextInput
              style={styles.textInput}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              placeholder="Add a polite, respectful note..."
            />

            <View style={styles.assuranceRow}>
              <CheckCircle2 size={14} color="#059669" style={{ marginRight: 6 }} />
              <Text style={styles.assuranceText}>
                Consent-Based: Access can be revoked by the owner at any time.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
                activeOpacity={0.75}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={isSubmitting}
              >
                <Send size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.sendBtnText}>
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  lockBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
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
    color: '#D97706',
    fontWeight: '600',
  },
  closeBtn: {
    padding: 6,
  },
  contentWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoBannerText: {
    fontSize: 12,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#1E293B',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  assuranceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  assuranceText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  sendBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    borderRadius: 12,
  },
  sendBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
