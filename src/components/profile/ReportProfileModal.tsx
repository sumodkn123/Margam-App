import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from 'react-native';
import { X, Check, AlertTriangle } from 'lucide-react-native';

const REPORT_REASONS = [
  'Inappropriate content or photos',
  'Fake profile or impersonation',
  'Harassment or disrespectful behavior',
  'Scam or suspicious commercial activity',
  'Misleading matrimonial information',
  'Underage or ineligible profile',
  'Other concern',
];

interface ReportProfileModalProps {
  visible: boolean;
  userName: string;
  onClose: () => void;
  onSubmitReport: (reason: string, details: string) => void;
}

export const ReportProfileModal: React.FC<ReportProfileModalProps> = ({
  visible,
  userName,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmitReport(selectedReason, details);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDetails('');
      onClose();
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AlertTriangle size={20} color="#E11D48" style={{ marginRight: 8 }} />
                  <Text style={styles.headerTitle}>Report {userName}</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              {isSubmitted ? (
                <View style={styles.successState}>
                  <View style={styles.successIconCircle}>
                    <Check size={28} color="#16A34A" />
                  </View>
                  <Text style={styles.successTitle}>Report Submitted</Text>
                  <Text style={styles.successDesc}>
                    Thank you. We will review this report carefully to preserve a safe community. {userName} will not be notified of this report.
                  </Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.instructionText}>
                    Please select the reason for reporting this profile. Your report is completely confidential.
                  </Text>

                  {/* Reasons Radio List */}
                  <View style={styles.reasonsList}>
                    {REPORT_REASONS.map((reason) => {
                      const isSelected = selectedReason === reason;
                      return (
                        <TouchableOpacity
                          key={reason}
                          style={[styles.reasonRow, isSelected && styles.reasonRowSelected]}
                          onPress={() => setSelectedReason(reason)}
                          activeOpacity={0.8}
                        >
                          <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                            {isSelected && <View style={styles.radioInnerDot} />}
                          </View>
                          <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                            {reason}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Optional Details */}
                  <Text style={styles.inputLabel}>Additional Details (Optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Provide any context that will help our safety team..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                    value={details}
                    onChangeText={setDetails}
                  />

                  {/* Buttons */}
                  <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitBtn}
                      onPress={handleSubmit}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.submitBtnText}>Submit Report</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
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
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'android' ? 24 : 36,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  instructionText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginVertical: 14,
  },
  reasonsList: {
    gap: 8,
    marginBottom: 16,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reasonRowSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: '#E11D48',
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E11D48',
  },
  reasonText: {
    fontSize: 13,
    color: '#334155',
  },
  reasonTextSelected: {
    color: '#0F172A',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  submitBtn: {
    flex: 1.5,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#E11D48',
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
