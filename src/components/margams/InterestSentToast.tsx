import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Heart, Star, User, ChevronRight, X } from 'lucide-react-native';
import { MargamProfileCandidate } from '../../types';

const { width } = Dimensions.get('window');

interface InterestSentToastProps {
  visible: boolean;
  candidate: MargamProfileCandidate | null;
  onContinueExploring: () => void;
  onViewProfile: (candidate: MargamProfileCandidate) => void;
  onSaveProfile: (candidate: MargamProfileCandidate) => void;
}

export const InterestSentToast: React.FC<InterestSentToastProps> = ({
  visible,
  candidate,
  onContinueExploring,
  onViewProfile,
  onSaveProfile,
}) => {
  if (!candidate) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onContinueExploring}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          <View style={styles.topHandleBar} />

          <View style={styles.headerRow}>
            <View style={styles.heartIconWrap}>
              <Heart size={20} color="#2563EB" fill="#2563EB" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.titleText}>Interest Sent</Text>
              <Text style={styles.subtitleText}>
                You've shown interest in {candidate.name}, {candidate.age}
              </Text>
            </View>
            <TouchableOpacity onPress={onContinueExploring} style={styles.closeBtn}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Candidate preview row */}
          <View style={styles.candidatePreviewCard}>
            <Image source={{ uri: candidate.photoUrl }} style={styles.candidateThumb} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.candidateName}>{candidate.name}, {candidate.age}</Text>
              <Text style={styles.candidateMeta}>{candidate.profession} • {candidate.area}</Text>
              <Text style={styles.candidateMargams} numberOfLines={1}>
                Shared: {candidate.sharedMargams.map((m) => m.name).join(' • ')}
              </Text>
            </View>
          </View>

          {/* Three action buttons */}
          <View style={styles.actionButtonsCol}>
            <TouchableOpacity
              style={styles.continueBtn}
              activeOpacity={0.85}
              onPress={onContinueExploring}
            >
              <Text style={styles.continueBtnText}>Continue Exploring</Text>
            </TouchableOpacity>

            <View style={styles.secondaryRow}>
              <TouchableOpacity
                style={styles.actionPillBtn}
                activeOpacity={0.8}
                onPress={() => onViewProfile(candidate)}
              >
                <User size={15} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.actionPillBtnText}>View Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionPillBtn}
                activeOpacity={0.8}
                onPress={() => onSaveProfile(candidate)}
              >
                <Star size={15} color="#F59E0B" fill="#F59E0B" style={{ marginRight: 6 }} />
                <Text style={styles.actionPillBtnText}>Save for Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  topHandleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heartIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  titleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitleText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  candidatePreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 18,
  },
  candidateThumb: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  candidateName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  candidateMeta: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
  },
  candidateMargams: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 3,
  },
  actionButtonsCol: {
    gap: 10,
  },
  continueBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionPillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 11,
  },
  actionPillBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
});
