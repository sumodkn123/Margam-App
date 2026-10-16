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
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Sparkles,
  CheckCircle,
  RefreshCw,
  Heart,
} from 'lucide-react-native';
import { generateAiAboutMeDraft, approveAiAboutMeDraft } from '../../services/advancedProfileEngine';

interface AiAboutMeModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  currentBio?: string;
  onBioSaved: (newBio: string) => void;
}

export const AiAboutMeModal: React.FC<AiAboutMeModalProps> = ({
  visible,
  onClose,
  userId,
  currentBio = '',
  onBioSaved,
}) => {
  // 5 Guided questions
  const [answers, setAnswers] = useState({
    whatYouEnjoy: 'Exploring specialty coffee, reading books in quiet cafes, weekend cycling',
    whatPassionateAbout: 'Building thoughtful digital products and experimenting with artisanal coffee roasting',
    lifeYouWant: 'A peaceful, purposeful balance between ambitious creative work and serene family life in Kerala',
    importantValues: 'Honesty, continuous self-improvement, warmth, and mutual respect',
    partnerLookingFor: 'An authentic, curious partner who loves deep conversations, laughing easily, and building a cozy home together',
  });

  const [draftBio, setDraftBio] = useState<string>(currentBio);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [step, setStep] = useState<'questionnaire' | 'draft_review'>('questionnaire');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateAiAboutMeDraft(userId, answers);
      setDraftBio(generated);
      setIsGenerating(false);
      setStep('draft_review');
    }, 600);
  };

  const handleApprove = () => {
    approveAiAboutMeDraft(userId, draftBio);
    onBioSaved(draftBio);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.sparkleBadge}>
                <Sparkles size={18} color="#7C3AED" />
              </View>
              <View>
                <Text style={styles.title}>AI About-Me Studio</Text>
                <Text style={styles.subtitle}>Craft an authentic, warm bio effortlessly</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Stepper Tabs */}
          <View style={styles.stepTabsRow}>
            <TouchableOpacity
              style={[styles.stepTab, step === 'questionnaire' && styles.stepTabActive]}
              onPress={() => setStep('questionnaire')}
            >
              <Text
                style={[
                  styles.stepTabText,
                  step === 'questionnaire' && styles.stepTabTextActive,
                ]}
              >
                1. Guided Questions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepTab, step === 'draft_review' && styles.stepTabActive]}
              onPress={() => setStep('draft_review')}
            >
              <Text
                style={[
                  styles.stepTabText,
                  step === 'draft_review' && styles.stepTabTextActive,
                ]}
              >
                2. AI Draft & Edit
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {step === 'questionnaire' ? (
              <View style={styles.formContainer}>
                <View style={styles.tipsBanner}>
                  <Sparkles size={16} color="#0D9488" style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={styles.tipsText}>
                    Answer these 5 quick questions in simple words. Our AI will synthesize them into a warm, natural personal statement without clichés.
                  </Text>
                </View>

                {/* Question 1 */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>1. What do you enjoy most in everyday life?</Text>
                  <TextInput
                    style={styles.textInput}
                    value={answers.whatYouEnjoy}
                    onChangeText={(val) => setAnswers((prev) => ({ ...prev, whatYouEnjoy: val }))}
                    placeholder="e.g. Cooking on weekends, morning walks, reading..."
                    multiline
                  />
                </View>

                {/* Question 2 */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>2. What are you passionate about building or exploring?</Text>
                  <TextInput
                    style={styles.textInput}
                    value={answers.whatPassionateAbout}
                    onChangeText={(val) => setAnswers((prev) => ({ ...prev, whatPassionateAbout: val }))}
                    placeholder="e.g. My startup, specialty coffee, photography, travel..."
                    multiline
                  />
                </View>

                {/* Question 3 */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>3. What kind of life do you envision in the next 3–5 years?</Text>
                  <TextInput
                    style={styles.textInput}
                    value={answers.lifeYouWant}
                    onChangeText={(val) => setAnswers((prev) => ({ ...prev, lifeYouWant: val }))}
                    placeholder="e.g. Balanced home life, travel together, building ventures..."
                    multiline
                  />
                </View>

                {/* Question 4 */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>4. What values matter most to you?</Text>
                  <TextInput
                    style={styles.textInput}
                    value={answers.importantValues}
                    onChangeText={(val) => setAnswers((prev) => ({ ...prev, importantValues: val }))}
                    placeholder="e.g. Kindness, openness, mutual respect, family..."
                    multiline
                  />
                </View>

                {/* Question 5 */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>5. What kind of partner are you hoping to find?</Text>
                  <TextInput
                    style={styles.textInput}
                    value={answers.partnerLookingFor}
                    onChangeText={(val) => setAnswers((prev) => ({ ...prev, partnerLookingFor: val }))}
                    placeholder="e.g. An authentic friend with shared aspirations..."
                    multiline
                  />
                </View>

                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  onPress={handleGenerate}
                  activeOpacity={0.85}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Heart size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={styles.primaryActionBtnText}>Generate with Margam AI 💖</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.draftContainer}>
                <View style={styles.draftBanner}>
                  <Sparkles size={16} color="#2563EB" style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={styles.draftBannerText}>
                    Feel free to personalize and edit the generated draft below. You remain in complete control before publishing.
                  </Text>
                </View>

                <View style={styles.draftBox}>
                  <TextInput
                    style={styles.draftInput}
                    value={draftBio}
                    onChangeText={setDraftBio}
                    multiline
                    numberOfLines={8}
                    placeholder="Your generated bio will appear here..."
                  />
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.secondaryActionBtn}
                    onPress={handleGenerate}
                    activeOpacity={0.8}
                    disabled={isGenerating}
                  >
                    <RefreshCw size={15} color="#475569" style={{ marginRight: 6 }} />
                    <Text style={styles.secondaryActionBtnText}>Regenerate</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveApproveBtn}
                    onPress={handleApprove}
                    activeOpacity={0.85}
                  >
                    <Heart size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.saveApproveBtnText}>Save to Profile 💖</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkleBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
  },
  stepTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  stepTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  stepTabActive: {
    borderBottomColor: '#7C3AED',
  },
  stepTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  stepTabTextActive: {
    color: '#7C3AED',
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  formContainer: {
    paddingBottom: 24,
  },
  tipsBanner: {
    flexDirection: 'row',
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  tipsText: {
    fontSize: 12,
    color: '#0F766E',
    flex: 1,
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: '#1E293B',
    minHeight: 52,
    textAlignVertical: 'top',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  draftContainer: {
    paddingBottom: 24,
  },
  draftBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  draftBannerText: {
    fontSize: 12,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 18,
  },
  draftBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  draftInput: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 22,
    minHeight: 160,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 13,
    borderRadius: 12,
  },
  secondaryActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  saveApproveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  saveApproveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
