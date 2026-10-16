import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Compass, Users, Sparkles, X, ChevronRight } from 'lucide-react-native';
import { ProfileMargamDisplayItem } from '../../types';

interface MargamDetailModalProps {
  visible: boolean;
  margam: ProfileMargamDisplayItem | null;
  userName: string;
  onClose: () => void;
  onExploreMargam: (margamName: string) => void;
}

export const MargamDetailModal: React.FC<MargamDetailModalProps> = ({
  visible,
  margam,
  userName,
  onClose,
  onExploreMargam,
}) => {
  if (!margam) return null;

  const isShared = margam.isShared;
  const isIdenticalIntent = margam.userIntent && margam.userIntent === margam.intentCategory;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <View style={[styles.iconWrap, { backgroundColor: margam.bgColor }]}>
                  <Text style={{ fontSize: 26 }}>{margam.emoji}</Text>
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.margamName}>{margam.name}</Text>
                  <View style={styles.badgeRow}>
                    <View style={[styles.categoryBadge, { backgroundColor: margam.bgColor }]}>
                      <Text style={[styles.categoryBadgeText, { color: margam.textColor }]}>
                        {margam.intentCategory}
                      </Text>
                    </View>
                    {isShared && (
                      <View style={styles.sharedBadge}>
                        <Text style={styles.sharedBadgeText}>✨ Shared Margam</Text>
                      </View>
                    )}
                  </View>
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
                {/* Comparison Card */}
                <View style={styles.comparisonCard}>
                  <Text style={styles.cardSectionLabel}>Margam Synergy</Text>

                  {isShared ? (
                    isIdenticalIntent ? (
                      <View style={styles.synergyRow}>
                        <View style={styles.synergyDot} />
                        <Text style={styles.synergyHighlight}>
                          Both of you selected {margam.name} as a {margam.intentCategory.toLowerCase()}!
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.synergyRow}>
                        <View style={[styles.synergyDot, { backgroundColor: '#F59E0B' }]} />
                        <Text style={styles.synergyHighlight}>
                          Shared interest with complementary intent: You marked this as "{margam.userIntent || 'Regular'}" while {userName} marked it as "{margam.intentCategory}".
                        </Text>
                      </View>
                    )
                  ) : (
                    <Text style={styles.synergyNote}>
                      This is one of {userName}'s key life interests and aspirations.
                    </Text>
                  )}

                  {/* Intent details */}
                  <View style={styles.intentBox}>
                    <Text style={styles.intentAuthor}>{userName}'s Vision:</Text>
                    <Text style={styles.intentQuote}>"{margam.intent}"</Text>
                  </View>

                  {margam.description && (
                    <Text style={styles.descText}>{margam.description}</Text>
                  )}
                </View>

                {/* Ecosystem Entry Action */}
                <TouchableOpacity
                  style={styles.exploreActionCard}
                  activeOpacity={0.85}
                  onPress={() => {
                    onClose();
                    onExploreMargam(margam.name);
                  }}
                >
                  <View style={styles.exploreLeft}>
                    <View style={styles.compassCircle}>
                      <Compass size={20} color="#7E22CE" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.exploreTitle}>Explore {margam.name}</Text>
                      <Text style={styles.exploreSubtitle}>
                        See compatible people, joint plans, and community ideas
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#7E22CE" />
                </TouchableOpacity>
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
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  margamName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sharedBadge: {
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  sharedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E22CE',
  },
  closeBtn: {
    padding: 6,
  },
  comparisonCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  synergyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  synergyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginTop: 6,
    marginRight: 8,
  },
  synergyHighlight: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 18,
  },
  synergyNote: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  intentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  intentAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  intentQuote: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#1E293B',
    lineHeight: 18,
  },
  descText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  exploreActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 16,
    padding: 14,
  },
  exploreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compassCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7E22CE',
  },
  exploreSubtitle: {
    fontSize: 11,
    color: '#6B21A8',
    marginTop: 2,
  },
});
