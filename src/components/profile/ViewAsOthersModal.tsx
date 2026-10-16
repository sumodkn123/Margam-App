import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  Lock,
  Sparkles,
  Send,
  Heart,
} from 'lucide-react-native';

interface ViewAsOthersModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  bio: string;
  avatarUrl: string;
}

export const ViewAsOthersModal: React.FC<ViewAsOthersModalProps> = ({
  visible,
  onClose,
  name,
  age,
  location,
  profession,
  education,
  bio,
  avatarUrl,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.eyeIconCircle}>
                <ShieldCheck size={18} color="#059669" />
              </View>
              <View>
                <Text style={styles.title}>Public Discovery Preview</Text>
                <Text style={styles.subtitle}>How other verified users see your card</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Privacy Invariant Banner */}
            <View style={styles.privacyNotice}>
              <Lock size={15} color="#059669" style={{ marginRight: 8 }} />
              <Text style={styles.privacyNoticeText}>
                Zero-PII Active: Your phone, email, and exact street coordinates are never visible
                to anyone on the map.
              </Text>
            </View>

            {/* Profile Discovery Card Preview */}
            <View style={styles.cardPreview}>
              {/* Photo */}
              <View style={styles.photoContainer}>
                <Image source={{ uri: avatarUrl }} style={styles.previewImage} />
                <View style={styles.compatBadge}>
                  <Sparkles size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.compatText}>91% Match</Text>
                </View>
                <View style={styles.fuzzNoticeTag}>
                  <Text style={styles.fuzzNoticeText}>📍 Fuzzed Zone: ~3.2km radius</Text>
                </View>
              </View>

              {/* Info */}
              <View style={styles.cardContent}>
                <View style={styles.nameRow}>
                  <Text style={styles.nameText}>{name}, {age}</Text>
                  <CheckCircle size={17} color="#059669" fill="#059669" style={{ marginLeft: 6 }} />
                </View>

                <View style={styles.metaRow}>
                  <MapPin size={13} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.metaText}>{location} (Approximate area)</Text>
                </View>

                <View style={styles.chipsRow}>
                  <View style={styles.chip}>
                    <Briefcase size={12} color="#475569" style={{ marginRight: 4 }} />
                    <Text style={styles.chipText}>{profession}</Text>
                  </View>
                  <View style={styles.chip}>
                    <GraduationCap size={12} color="#475569" style={{ marginRight: 4 }} />
                    <Text style={styles.chipText}>{education}</Text>
                  </View>
                </View>

                <Text style={styles.bioText} numberOfLines={3}>
                  "{bio}"
                </Text>

                {/* Simulated Request Button */}
                <View style={styles.simulatedActionBtn}>
                  <Heart size={15} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.simulatedActionText}>Request Introduction 💖</Text>
                </View>
              </View>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Close Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.doneBtnText}>Back to My Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eyeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  privacyNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#065F46',
    lineHeight: 15,
  },
  cardPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  photoContainer: {
    position: 'relative',
    height: 220,
    backgroundColor: '#1E293B',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  compatBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compatText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  fuzzNoticeTag: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  fuzzNoticeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  bioText: {
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 16,
  },
  simulatedActionBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 14,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  simulatedActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  doneBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
});
