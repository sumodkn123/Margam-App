import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Sparkles, Send, CheckCircle2, ArrowRight, Navigation, Car, MapPin, Calendar } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { DiscoveryFilterParams, DiscoveryMode, TripPlan } from '../../types';

interface AIMatchAssistantModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyIntent: (intent: {
    filters?: Partial<DiscoveryFilterParams>;
    mode?: DiscoveryMode;
    destinationName?: string;
    tripPlan?: TripPlan;
  }) => void;
}

const PRESET_PROMPTS = [
  'Find someone near me',
  'I am going to Kochi tomorrow',
  'Find someone within 5km of Lulu Mall',
  'Show matches along my route',
  'Find people who are available Saturday',
  'Software Engineers with 85%+ compatibility',
];

export const AIMatchAssistantModal: React.FC<AIMatchAssistantModalProps> = ({
  visible,
  onClose,
  onApplyIntent,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedSummary, setParsedSummary] = useState<string | null>(null);
  const [pendingChoice, setPendingChoice] = useState<{
    prompt: string;
    destName: string;
    filters: Partial<DiscoveryFilterParams>;
  } | null>(null);

  const handleSendQuery = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    setIsProcessing(true);
    setParsedSummary(null);
    setPendingChoice(null);

    setTimeout(() => {
      setIsProcessing(false);
      const lower = query.toLowerCase();

      let targetProfession: string | undefined;
      let targetTimeline: string | undefined;
      let minCompat = 75;
      let mode: DiscoveryMode = 'around_me';
      let destName: string | undefined;
      let weekendOnly = false;
      let maxDist = 25;

      if (lower.includes('software') || lower.includes('engineer') || lower.includes('tech')) {
        targetProfession = 'Tech';
      } else if (lower.includes('doctor') || lower.includes('physician') || lower.includes('health')) {
        targetProfession = 'Healthcare';
      }

      if (lower.includes('85') || lower.includes('high')) {
        minCompat = 85;
      } else if (lower.includes('90')) {
        minCompat = 90;
      }

      if (lower.includes('saturday') || lower.includes('weekend')) {
        weekendOnly = true;
      }

      if (lower.includes('lulu mall')) {
        mode = 'destination';
        destName = 'Lulu Mall';
        maxDist = 5;
      } else if (lower.includes('kochi')) {
        destName = 'Kochi';
      } else if (lower.includes('thrissur')) {
        destName = 'Thrissur';
      } else if (lower.includes('bangalore') || lower.includes('bengaluru')) {
        destName = 'Bangalore';
      }

      if (lower.includes('tomorrow') || lower.includes('trip') || lower.includes('going to')) {
        // Multi-option flow: ask user if destination, route, or trip
        setPendingChoice({
          prompt: `Got it! Do you want to discover compatible people around ${destName || 'your destination'}, along your route, or as a planned trip?`,
          destName: destName || 'Kochi',
          filters: {
            minCompatibility: minCompat,
            professionCategory: targetProfession || 'All',
            marriageTimeline: targetTimeline || 'All',
            availableOnWeekendOnly: weekendOnly,
          },
        });
        return;
      }

      if (lower.includes('route') || lower.includes('nh 544') || lower.includes('way') || lower.includes('drive')) {
        mode = 'along_route';
      } else if (destName) {
        mode = 'destination';
      } else if (lower.includes('near') || lower.includes('around')) {
        mode = 'around_me';
      }

      setParsedSummary(
        `Understood! Filter set to ${targetProfession ? targetProfession + ' profiles' : 'all profiles'} with ${minCompat}%+ compatibility ${
          mode === 'along_route'
            ? 'along your route'
            : mode === 'destination'
            ? `around ${destName}`
            : 'nearby'
        }.`
      );

      onApplyIntent({
        filters: {
          minCompatibility: minCompat,
          professionCategory: targetProfession || 'All',
          marriageTimeline: targetTimeline || 'All',
          availableOnWeekendOnly: weekendOnly,
          maxDistanceKm: maxDist,
        },
        mode,
        destinationName: destName,
      });
    }, 400);
  };

  const handleSelectChoiceMode = (selectedMode: DiscoveryMode) => {
    if (!pendingChoice) return;
    const dest = pendingChoice.destName;
    const filters = pendingChoice.filters;
    setPendingChoice(null);

    setParsedSummary(`Launching ${selectedMode.replace('_', ' ')} with ${dest}!`);

    let tripPlan: TripPlan | undefined;
    if (selectedMode === 'plan_trip') {
      tripPlan = {
        id: `trip_ai_${Date.now()}`,
        userId: 'usr-current-sumod',
        origin: 'Thrissur',
        destination: dest,
        departureDate: 'Upcoming Saturday',
        returnDate: 'Upcoming Sunday',
        transportMode: 'car',
        visibility: 'active',
        createdAt: new Date().toISOString(),
      };
    }

    onApplyIntent({
      filters,
      mode: selectedMode,
      destinationName: dest,
      tripPlan,
    });
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.robotAvatarCircle}>
                <Text style={{ fontSize: 20 }}>🤖</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Margam AI Assistant</Text>
                <Text style={styles.headerSubtitle}>Natural Language Match Discovery</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* AI Welcome Box */}
            <View style={styles.aiGreetingBox}>
              <Sparkles size={16} color="#E58B58" style={{ marginTop: 2, marginRight: 8 }} />
              <Text style={styles.aiGreetingText}>
                Hello Sumod! Tell me where you are traveling, who you want to meet, or your lifestyle preferences. I will tune your map and filter eligible candidates.
              </Text>
            </View>

            {/* Quick Prompts */}
            <Text style={styles.sectionLabel}>Quick Suggestions</Text>
            <View style={styles.promptList}>
              {PRESET_PROMPTS.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptChip}
                  activeOpacity={0.8}
                  onPress={() => {
                    setInputQuery(p);
                    handleSendQuery(p);
                  }}
                >
                  <Sparkles size={12} color="#7C3AED" style={{ marginRight: 6 }} />
                  <Text style={styles.promptChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Interactive Mode Choice if prompt asks about travel */}
            {pendingChoice && (
              <View style={styles.choiceCard}>
                <Sparkles size={16} color="#7C3AED" style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.choicePrompt}>{pendingChoice.prompt}</Text>
                  <View style={styles.choiceButtonsRow}>
                    <TouchableOpacity
                      style={styles.choiceBtn}
                      onPress={() => handleSelectChoiceMode('destination')}
                    >
                      <MapPin size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.choiceBtnText}>At Destination</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.choiceBtn}
                      onPress={() => handleSelectChoiceMode('along_route')}
                    >
                      <Car size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.choiceBtnText}>Along Route</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.choiceBtnSecondary}
                      onPress={() => handleSelectChoiceMode('plan_trip')}
                    >
                      <Calendar size={13} color="#3B82F6" style={{ marginRight: 4 }} />
                      <Text style={styles.choiceBtnSecondaryText}>Plan a Trip</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Success Summary if processed */}
            {parsedSummary && (
              <View style={styles.summaryCard}>
                <CheckCircle2 size={16} color="#10B981" style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryText}>{parsedSummary}</Text>
                  <TouchableOpacity
                    style={styles.discoverBtn}
                    onPress={onClose}
                  >
                    <Text style={styles.discoverBtnText}>Explore On Map</Text>
                    <ArrowRight size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Find doctors near Edappally..."
              placeholderTextColor="#94A3B8"
              value={inputQuery}
              onChangeText={setInputQuery}
              onSubmitEditing={() => handleSendQuery()}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendBtn, !inputQuery.trim() && { opacity: 0.5 }]}
              onPress={() => handleSendQuery()}
              disabled={!inputQuery.trim()}
              activeOpacity={0.85}
            >
              <Send size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 32 : 18,
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
  robotAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: 340,
  },
  aiGreetingBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  aiGreetingText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  promptList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  promptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B21A8',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 13,
    color: '#065F46',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  discoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  discoverBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0F172A',
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: 16,
  },
  choicePrompt: {
    fontSize: 13,
    color: '#4C1D95',
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 10,
  },
  choiceButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  choiceBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  choiceBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  choiceBtnSecondaryText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
});
