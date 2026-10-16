import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { CheckCircle2, ShieldCheck, X } from 'lucide-react-native';

interface VerificationInfoModalProps {
  visible: boolean;
  userName: string;
  onClose: () => void;
}

export const VerificationInfoModal: React.FC<VerificationInfoModalProps> = ({
  visible,
  userName,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.card}>
              <View style={styles.header}>
                <View style={styles.badgeRow}>
                  <CheckCircle2 size={24} color="#3B82F6" fill="#3B82F6" />
                  <Text style={styles.title}>Profile Verification</Text>
                </View>
                <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                {userName}'s identity has been verified through Margam's multi-step authentication process:
              </Text>

              <View style={styles.itemRow}>
                <ShieldCheck size={18} color="#16A34A" style={styles.itemIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>Government ID Verified</Text>
                  <Text style={styles.itemDesc}>Aadhaar / Passport verified against official records.</Text>
                </View>
              </View>

              <View style={styles.itemRow}>
                <ShieldCheck size={18} color="#16A34A" style={styles.itemIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>Live Selfie Liveness Check</Text>
                  <Text style={styles.itemDesc}>Biometric facial match confirms profile photos are genuine.</Text>
                </View>
              </View>

              <View style={styles.itemRow}>
                <ShieldCheck size={18} color="#16A34A" style={styles.itemIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>Employment & Education Review</Text>
                  <Text style={styles.itemDesc}>Professional credentials verified via corporate email/document.</Text>
                </View>
              </View>

              <View style={styles.disclaimerBox}>
                <Text style={styles.disclaimerText}>
                  Note: Verification confirms identity and authentic documents. It does not certify character or relationship compatibility.
                </Text>
              </View>

              <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
                <Text style={styles.doneBtnText}>Understood</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  itemDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  disclaimerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginVertical: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#94A3B8',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  doneBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
