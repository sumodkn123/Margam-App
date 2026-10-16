import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Sparkles, X, ChevronRight, Check, Compass, ShieldCheck } from 'lucide-react-native';
import { MargamProfileCandidate } from '../../types';
import { CURRENT_USER } from '../../constants/mockData';

const { width } = Dimensions.get('window');

interface ComparePathsModalProps {
  visible: boolean;
  candidate: MargamProfileCandidate | null;
  onClose: () => void;
  onRequestIntroduction: (candidate: MargamProfileCandidate) => void;
}

export const ComparePathsModal: React.FC<ComparePathsModalProps> = ({
  visible,
  candidate,
  onClose,
  onRequestIntroduction,
}) => {
  if (!candidate) return null;

  // Mock user paths vs candidate paths
  const userMargams = [
    { name: 'Café Business', emoji: '☕', type: 'shared' },
    { name: 'Travel', emoji: '✈', type: 'shared' },
    { name: 'Fitness & Gym', emoji: '🏋', type: 'user_only' },
  ];

  const candidateMargams = candidate.sharedMargams.map((m) => ({
    name: m.name,
    emoji: m.emoji,
    type: m.name.toLowerCase().includes('fitness') ? 'candidate_only' : 'shared',
  }));

  const sharedPaths = candidate.sharedMargams.slice(0, 2);
  const complementaryPaths = [
    { title: 'Morning Fitness & Mindfulness', desc: 'Adds structured healthy daily habits to your routine' },
    { title: 'Creative Photography', desc: 'Captures and documents your joint travels & café journey' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Compass size={20} color="#7C3AED" style={{ marginRight: 8 }} />
            <Text style={styles.headerTitle}>Life Paths Overlap</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.bodyScroll} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Comparison Header Card */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>
              You & {candidate.name}
            </Text>
            <Text style={styles.introDesc}>
              A deep look at where your life ambitions intersect, and where your distinct habits complement each other.
            </Text>

            <View style={styles.avatarsCompareRow}>
              <View style={styles.personCol}>
                <Image source={{ uri: CURRENT_USER.profilePhotoUrl }} style={styles.avatar} />
                <Text style={styles.personName}>You</Text>
                <Text style={styles.personRole}>Kochi</Text>
              </View>

              <View style={styles.synergyBadgeWrap}>
                <Text style={styles.synergyScoreText}>{candidate.compatibilityPercentage}%</Text>
                <Text style={styles.synergySubLabel}>Overlap</Text>
              </View>

              <View style={styles.personCol}>
                <Image source={{ uri: candidate.photoUrl }} style={styles.avatar} />
                <Text style={styles.personName}>{candidate.name}, {candidate.age}</Text>
                <Text style={styles.personRole}>{candidate.area}</Text>
              </View>
            </View>
          </View>

          {/* Section 1: Shared Margams */}
          <View style={styles.sectionCard}>
            <View style={styles.secTitleRow}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>🤝</Text>
              <Text style={styles.sectionHeaderTitle}>Direct Shared Paths ({sharedPaths.length})</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Life goals and interests you both explicitly declared in your Margams profile.
            </Text>

            <View style={styles.sharedList}>
              {sharedPaths.map((item, idx) => (
                <View key={idx} style={styles.sharedItemCard}>
                  <View style={styles.sharedItemIcon}>
                    <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.sharedItemTitle}>{item.name}</Text>
                    <Text style={styles.sharedItemSubtitle}>
                      Both aiming for active future realization
                    </Text>
                  </View>
                  <View style={styles.alignedCheckBadge}>
                    <Check size={14} color="#059669" />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Section 2: Complementary Angles */}
          <View style={styles.sectionCard}>
            <View style={styles.secTitleRow}>
              <Sparkles size={16} color="#7C3AED" style={{ marginRight: 6 }} />
              <Text style={styles.sectionHeaderTitle}>Complementary Synergies</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Different passions that enrich and support a balanced partnership.
            </Text>

            <View style={styles.compList}>
              {complementaryPaths.map((comp, idx) => (
                <View key={idx} style={styles.compItem}>
                  <View style={styles.compBullet} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.compTitle}>{comp.title}</Text>
                    <Text style={styles.compDesc}>{comp.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Collaborative Dream Vision */}
          <View style={[styles.sectionCard, { backgroundColor: '#F5F3FF', borderColor: '#EDE9FE' }]}>
            <Text style={[styles.sectionHeaderTitle, { color: '#6D28D9' }]}>
              Joint Life Vision
            </Text>
            <Text style={[styles.sectionDesc, { color: '#5B21B6' }]}>
              "{candidate.lookingToBuild}"
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.requestIntroBtn}
            activeOpacity={0.88}
            onPress={() => {
              onClose();
              onRequestIntroduction(candidate);
            }}
          >
            <Text style={styles.requestIntroBtnText}>
              Request Introduction
            </Text>
            <ChevronRight size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyScroll: {
    flex: 1,
    padding: 16,
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  introDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  avatarsCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  personCol: {
    alignItems: 'center',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 6,
  },
  personName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  personRole: {
    fontSize: 11,
    color: '#64748B',
  },
  synergyBadgeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF2F8',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  synergyScoreText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EC4899',
  },
  synergySubLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#BE185D',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  secTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 14,
  },
  sharedList: {
    gap: 10,
  },
  sharedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sharedItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sharedItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  sharedItemSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  alignedCheckBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compList: {
    gap: 10,
  },
  compItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  compBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
    marginTop: 5,
    marginRight: 10,
  },
  compTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  compDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  requestIntroBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EC4899',
    borderRadius: 16,
    paddingVertical: 14,
  },
  requestIntroBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
