import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  Plus,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe,
  SlidersHorizontal,
  X,
  Heart,
} from 'lucide-react-native';
import { UserMargamSelection, MargamIntent, MargamPriority } from '../../types';
import { getUserMargams, saveUserMargams } from '../../services/margamService';
import { THEME } from '../../constants/theme';

export const MyMargamsTab: React.FC = () => {
  const [margams, setMargams] = useState<UserMargamSelection[]>(() => getUserMargams());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customEmoji, setCustomEmoji] = useState('✨');
  const [customGoal, setCustomGoal] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<MargamIntent>('want_to_build');
  const [selectedPriority, setSelectedPriority] = useState<MargamPriority>('core');

  const getIntentLabel = (intent: MargamIntent) => {
    switch (intent) {
      case 'want_to_build':
        return 'I want to build this';
      case 'want_partner_who_likes':
        return 'I want a partner who likes this';
      case 'regularly_do':
        return 'I regularly do this';
      case 'love_this':
        return 'I love this';
      case 'want_to_try':
        return 'I want to try this';
      case 'want_to_learn':
        return 'I want to learn this';
      default:
        return 'I want to travel for this';
    }
  };

  const getPriorityBadgeStyle = (priority: MargamPriority) => {
    switch (priority) {
      case 'core':
        return { bg: '#FFE4E6', text: '#E11D48', label: 'CORE MARGAM' };
      case 'important':
        return { bg: '#EFF6FF', text: '#2563EB', label: 'IMPORTANT' };
      case 'future_goal':
        return { bg: '#FFFBEB', text: '#D97706', label: 'FUTURE GOAL' };
      default:
        return { bg: '#F1F5F9', text: '#475569', label: 'CASUAL' };
    }
  };

  const handleSaveCustomMargam = () => {
    if (!customTitle.trim()) {
      Alert.alert('Title Required', 'Please enter a name for your Margam.');
      return;
    }
    const newMargam: UserMargamSelection = {
      interestId: `custom-${Date.now()}`,
      interestName: customTitle.trim(),
      emoji: customEmoji || '✨',
      intent: selectedIntent,
      priority: selectedPriority,
      customGoalText: customGoal.trim(),
      visibility: 'public',
    };
    const updated = [newMargam, ...margams];
    setMargams(updated);
    saveUserMargams(updated);
    setIsAddModalOpen(false);
    setCustomTitle('');
    setCustomGoal('');
    Alert.alert('Margam Added', `"${newMargam.interestName}" is now active in your matrimonial discovery profile.`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Intro Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.heroBadgeRow}>
          <Sparkles size={14} color="#7C3AED" />
          <Text style={styles.heroBadgeText}>Life Path Representation</Text>
        </View>
        <Text style={styles.heroTitle}>Your Matrimonial Margams</Text>
        <Text style={styles.heroSub}>
          These define the shared experiences, ambitions, and daily habits you want to build with your future partner.
        </Text>

        <TouchableOpacity
          style={styles.addMargamBtn}
          activeOpacity={0.88}
          onPress={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.addMargamBtnText}>Add a Life Margam</Text>
        </TouchableOpacity>
      </View>

      {/* User's Selected Margams List */}
      <Text style={styles.sectionTitle}>Active Margams ({margams.length})</Text>

      {margams.map((item, idx) => {
        const badge = getPriorityBadgeStyle(item.priority);

        return (
          <View key={`my-margam-${idx}`} style={styles.margamCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.nameRow}>
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <Text style={styles.cardName}>{item.interestName}</Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.priorityText, { color: badge.text }]}>
                  {badge.label}
                </Text>
              </View>
            </View>

            {/* Intent Pill */}
            <View style={styles.intentPillRow}>
              <View style={styles.intentPill}>
                <Text style={styles.intentPillText}>🎯 {getIntentLabel(item.intent)}</Text>
              </View>
              <View style={styles.visPill}>
                <Globe size={11} color="#059669" />
                <Text style={styles.visText}>Public in Discovery</Text>
              </View>
            </View>

            {/* Custom Goal or Statement */}
            {item.customGoalText ? (
              <Text style={styles.goalText}>"{item.customGoalText}"</Text>
            ) : null}
          </View>
        );
      })}

      {/* Custom Margam Modal */}
      <Modal visible={isAddModalOpen} animationType="slide" transparent onRequestClose={() => setIsAddModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create a Custom Margam</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <X size={20} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Margam Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Farm-to-Table Café, Japan Hiking"
              value={customTitle}
              onChangeText={setCustomTitle}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Emoji / Icon</Text>
            <TextInput
              style={[styles.textInput, { width: 80, textAlign: 'center' }]}
              value={customEmoji}
              onChangeText={setCustomEmoji}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Your Intent with a Partner</Text>
            <View style={styles.intentOptionsWrap}>
              {[
                { id: 'want_to_build', label: 'I want to build this' },
                { id: 'want_partner_who_likes', label: 'Partner who likes this' },
                { id: 'regularly_do', label: 'I regularly do this' },
                { id: 'want_to_try', label: 'I want to try this' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.intentOptionChip, selectedIntent === opt.id && styles.intentOptionActive]}
                  onPress={() => setSelectedIntent(opt.id as MargamIntent)}
                >
                  <Text style={[styles.intentOptionText, selectedIntent === opt.id && styles.intentOptionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Personal Vision / Goal</Text>
            <TextInput
              style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
              placeholder="What does building or experiencing this look like for you?"
              multiline
              value={customGoal}
              onChangeText={setCustomGoal}
            />

            <TouchableOpacity style={styles.saveBtn} activeOpacity={0.88} onPress={handleSaveCustomMargam}>
              <Text style={styles.saveBtnText}>Save to My Margams</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  heroBanner: {
    backgroundColor: '#FAF5FF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  addMargamBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMargamBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  margamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  intentPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  intentPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  intentPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  visPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  visText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '500',
  },
  goalText: {
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  intentOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intentOptionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  intentOptionActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  intentOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  intentOptionTextActive: {
    color: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
