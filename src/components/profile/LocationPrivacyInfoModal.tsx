import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { MapPin, ShieldCheck, Navigation, X } from 'lucide-react-native';

interface LocationPrivacyInfoModalProps {
  visible: boolean;
  areaName: string;
  onClose: () => void;
  onExploreMap: () => void;
}

export const LocationPrivacyInfoModal: React.FC<LocationPrivacyInfoModalProps> = ({
  visible,
  areaName,
  onClose,
  onExploreMap,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.card}>
              <View style={styles.header}>
                <View style={styles.badgeRow}>
                  <View style={styles.pinCircle}>
                    <MapPin size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.title}>Privacy-Safe Location</Text>
                </View>
                <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.areaHeadline}>{areaName}</Text>

              <Text style={styles.explanationText}>
                Margam never shows another user's exact home address, precise coordinates, workplace coordinates, or live location.
              </Text>

              <View style={styles.guaranteeBox}>
                <ShieldCheck size={18} color="#16A34A" style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.guaranteeTitle}>Anti-Triangulation Guarantee</Text>
                  <Text style={styles.guaranteeDesc}>
                    This profile is aggregated within a randomized 3–5 km regional buffer to prevent triangulation while preserving meaningful local discovery.
                  </Text>
                </View>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.exploreBtn}
                  onPress={() => {
                    onClose();
                    onExploreMap();
                  }}
                  activeOpacity={0.85}
                >
                  <Navigation size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.exploreBtnText}>Explore Area on Map</Text>
                </TouchableOpacity>
              </View>
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
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  areaHeadline: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  guaranteeBox: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  guaranteeDesc: {
    fontSize: 11,
    color: '#166534',
    lineHeight: 15,
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  exploreBtn: {
    flex: 1.6,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
