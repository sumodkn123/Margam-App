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
import { X, Sparkles } from 'lucide-react-native';
import { ProfileMargamDisplayItem } from '../../types';

interface AllMargamsSheetModalProps {
  visible: boolean;
  margams: ProfileMargamDisplayItem[];
  userName: string;
  onClose: () => void;
  onSelectMargam: (margam: ProfileMargamDisplayItem) => void;
}

export const AllMargamsSheetModal: React.FC<AllMargamsSheetModalProps> = ({
  visible,
  margams,
  userName,
  onClose,
  onSelectMargam,
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
                  <Text style={styles.title}>{userName}'s Margams</Text>
                  <Text style={styles.subtitle}>All active interests, goals and lifestyle paths</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {margams.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.margamCard, { backgroundColor: m.bgColor }]}
                    activeOpacity={0.8}
                    onPress={() => {
                      onClose();
                      onSelectMargam(m);
                    }}
                  >
                    <View style={styles.topRow}>
                      <View style={styles.iconNameRow}>
                        <Text style={{ fontSize: 24, marginRight: 8 }}>{m.emoji}</Text>
                        <View>
                          <Text style={styles.margamName}>{m.name}</Text>
                          <Text style={[styles.intentCategory, { color: m.textColor }]}>
                            {m.intentCategory}
                          </Text>
                        </View>
                      </View>
                      {m.isShared && (
                        <View style={styles.sharedBadge}>
                          <Sparkles size={11} color="#7E22CE" style={{ marginRight: 3 }} />
                          <Text style={styles.sharedBadgeText}>Shared</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.intentDescription}>"{m.intent}"</Text>
                  </TouchableOpacity>
                ))}
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
    maxHeight: '80%',
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
    gap: 12,
  },
  margamCard: {
    borderRadius: 16,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  margamName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  intentCategory: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  sharedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E22CE',
  },
  intentDescription: {
    fontSize: 13,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
