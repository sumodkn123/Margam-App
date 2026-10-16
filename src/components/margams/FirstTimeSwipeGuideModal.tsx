import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ArrowLeft, ArrowRight, Star, User, Sparkles, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface FirstTimeSwipeGuideModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export const FirstTimeSwipeGuideModal: React.FC<FirstTimeSwipeGuideModalProps> = ({
  visible,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.contentCard}>
          {/* Top Badge */}
          <View style={styles.badgeWrap}>
            <Sparkles size={20} color="#7C3AED" />
          </View>

          <Text style={styles.title}>Discover Through Shared Paths</Text>
          <Text style={styles.subtitle}>
            Margam connects you with people walking similar life trajectories, ambitions, and values.
          </Text>

          {/* Guide items */}
          <View style={styles.guidesContainer}>
            {/* 1. Swipe Left */}
            <View style={styles.guideRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FFE4E6' }]}>
                <ArrowLeft size={16} color="#E11D48" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.guideTitle}>Swipe Left to Pass</Text>
                <Text style={styles.guideDesc}>
                  Polite and completely private. No notification is ever sent.
                </Text>
              </View>
            </View>

            {/* 2. Swipe Right */}
            <View style={styles.guideRow}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <ArrowRight size={16} color="#2563EB" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.guideTitle}>Swipe Right to Show Interest</Text>
                <Text style={styles.guideDesc}>
                  Indicates intent to explore. Mutual interest unlocks introduction requests.
                </Text>
              </View>
            </View>

            {/* 3. Star Button */}
            <View style={styles.guideRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Star size={16} color="#D97706" fill="#D97706" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.guideTitle}>Tap Star (⭐) to Bookmark</Text>
                <Text style={styles.guideDesc}>
                  Private save for later review. Does not reveal interest to the user.
                </Text>
              </View>
            </View>

            {/* 4. Tap Card */}
            <View style={styles.guideRow}>
              <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                <User size={16} color="#0F172A" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.guideTitle}>Tap Card for Full Profile</Text>
                <Text style={styles.guideDesc}>
                  Understand why Margam recommended them and inspect shared goals.
                </Text>
              </View>
            </View>
          </View>

          {/* Dismiss Action */}
          <TouchableOpacity
            style={styles.startBtn}
            activeOpacity={0.88}
            onPress={onDismiss}
          >
            <Text style={styles.startBtnText}>Start Exploring</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentCard: {
    width: Math.min(width - 40, 380),
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  badgeWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  guidesContainer: {
    width: '100%',
    gap: 14,
    marginBottom: 22,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  guideDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 1,
  },
  startBtn: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
