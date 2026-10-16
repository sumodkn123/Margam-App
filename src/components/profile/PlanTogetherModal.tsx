import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  Coffee,
  Plane,
  Compass,
  Dumbbell,
  Calendar,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';

interface PlanTogetherModalProps {
  visible: boolean;
  userName: string;
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

const PLAN_OPTIONS = [
  {
    id: 'cafe',
    title: 'Explore a Specialty Café',
    subtitle: 'Public artisan coffee shop or bakery meetup',
    emoji: '☕',
    iconColor: '#EA580C',
    bgColor: '#FFEDD5',
  },
  {
    id: 'trip',
    title: 'Plan a Weekend Expedition',
    subtitle: 'Collaborative itinerary for Wayanad, Munnar, or Coorg',
    emoji: '✈',
    iconColor: '#2563EB',
    bgColor: '#EFF6FF',
  },
  {
    id: 'activity',
    title: 'Try a Shared Activity',
    subtitle: 'Outdoor photography walk, pottery class, or cycling',
    emoji: '🎨',
    iconColor: '#7C3AED',
    bgColor: '#F3E8FF',
  },
  {
    id: 'business',
    title: 'Collaborate on a Life Dream',
    subtitle: 'Co-create a draft vision or cafe concept space',
    emoji: '💡',
    iconColor: '#059669',
    bgColor: '#D1FAE5',
  },
];

export const PlanTogetherModal: React.FC<PlanTogetherModalProps> = ({
  visible,
  userName,
  onClose,
  onSelectOption,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Sparkles size={18} color="#A855F7" style={{ marginRight: 6 }} />
                    <Text style={styles.title}>Plan Something Together</Text>
                  </View>
                  <Text style={styles.subtitle}>
                    Build joint memories and explore shared paths with {userName}
                  </Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {PLAN_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={styles.optionCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      onClose();
                      onSelectOption(opt.title);
                    }}
                  >
                    <View style={[styles.iconWrap, { backgroundColor: opt.bgColor }]}>
                      <Text style={{ fontSize: 24 }}>{opt.emoji}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.optionTitle}>{opt.title}</Text>
                      <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
                    </View>
                    <ChevronRight size={18} color="#94A3B8" />
                  </TouchableOpacity>
                ))}

                {/* Safety Note */}
                <View style={styles.safetyBox}>
                  <Text style={styles.safetyText}>
                    🛡️ All meetups should take place in verified public venues (cafes, malls, public galleries). Private residences are strictly excluded.
                  </Text>
                </View>
              </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'android' ? 24 : 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingTop: 14,
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  safetyBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginTop: 6,
  },
  safetyText: {
    fontSize: 11,
    color: '#15803D',
    lineHeight: 15,
  },
});
