import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { X, Sparkles, Star, MessageCircle, Coffee, Check, ArrowRight } from 'lucide-react-native';

interface ConversationTipsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIcebreaker: (text: string) => void;
}

const ICEBREAKERS = [
  {
    category: 'Shared Travel Interests',
    text: 'I saw we both love travelling! Have you explored Munnar or Wayanad recently?',
  },
  {
    category: 'Weekend & Lifestyle',
    text: 'How does your ideal Sunday usually look like? I usually enjoy a morning run and exploring cafes.',
  },
  {
    category: 'Career & Ambition',
    text: 'Your work in design/tech sounds really exciting! What inspired you to choose that field?',
  },
  {
    category: 'Coffee & Public Meetup',
    text: 'Would you be open to a casual coffee conversation at a public venue this weekend?',
  },
  {
    category: 'Light & Friendly',
    text: 'Hi! Loved reading your profile. What is something you are looking forward to this month?',
  },
];

export const ConversationTipsModal: React.FC<ConversationTipsModalProps> = ({
  visible,
  onClose,
  onSelectIcebreaker,
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.starCircle}>
                <Star size={18} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.title}>AI Conversation Assistant</Text>
                  <View style={styles.betaBadge}>
                    <Text style={styles.betaText}>BETA</Text>
                  </View>
                </View>
                <Text style={styles.subtitle}>Icebreakers, thoughtful prompts & meeting ideas</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* List of Icebreakers */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionHeader}>Recommended Starters</Text>
            {ICEBREAKERS.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => {
                  onSelectIcebreaker(item.text);
                  onClose();
                }}
              >
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.categoryLabel}>{item.category}</Text>
                  <View style={styles.useBtn}>
                    <Text style={styles.useBtnText}>Use</Text>
                    <ArrowRight size={12} color="#7C3AED" />
                  </View>
                </View>
                <Text style={styles.cardText}>“{item.text}”</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 23, 44, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 16,
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  starCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  betaBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  betaText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  useBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  useBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  cardText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
