// MARGAM — Profile Creation Wizard (Progressive 8-Step Profile Builder)
// Replaces one enormous form with a thoughtful, delightful progressive flow.
// Every button is in vibrant red with Love Hearts matching the user's requirements.

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Platform,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Heart,
  Camera,
  X,
  Check,
  ShieldCheck,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Users,
  Compass,
  Calendar,
  Smile,
  Coffee,
  Plane,
  Leaf,
  Dumbbell,
  Utensils,
  Mountain,
  Laptop,
} from 'lucide-react-native';
import { MargamLogoNew } from '../../components/brand/MargamLogoNew';
import { MargamButton } from '../../components/common/MargamButton';
import { WizardFormData, INITIAL_WIZARD_DATA } from './ProfileWizardTypes';
import { updateMasterProfile } from '../../services/advancedProfileEngine';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileCreationWizardProps {
  onComplete: (data: WizardFormData) => void;
  onExit?: () => void;
  initialData?: Partial<WizardFormData>;
}

export const ProfileCreationWizard: React.FC<ProfileCreationWizardProps> = ({
  onComplete,
  onExit,
  initialData,
}) => {
  // Step 0 = Intro, Steps 1-8 = Wizard Steps, Step 9 = Review & Complete
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<WizardFormData>({
    ...INITIAL_WIZARD_DATA,
    ...initialData,
  });

  const [activeMargamsExpanded, setActiveMargamsExpanded] = useState<boolean>(false);

  // Navigation Handlers
  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else if (onExit) {
      onExit();
    }
  };

  const handleJumpToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const handleFinalSubmit = () => {
    // Synchronize to Master Profile Engine for Sumod / Current User
    try {
      updateMasterProfile('usr-current-sumod', {
        aboutMe: {
          bio: formData.bio,
          visibility: 'matches',
        },
        basicDetails: {
          fullName: formData.firstName,
          displayName: formData.firstName,
          age: formData.age,
          gender: formData.gender === 'Non-binary' ? 'Other' : (formData.gender as 'Female' | 'Male' | 'Other'),
          maritalStatus: formData.maritalStatus === 'Single' ? 'Never Married' : (formData.maritalStatus as any),
          heightCm: 168,
          heightDisplayMode: 'cm',
          physicalStatus: 'Normal',
          motherTongue: 'Malayalam',
          birthDate: '1999-04-15',
          birthYear: 1999,
          dobDisplayMode: 'age_only',
        } as any,
        educationCareer: {
          highestEducation: formData.educationLevel,
          degree: formData.educationLevel,
          fieldOfStudy: formData.fieldOfStudy,
          professionCategory: 'Corporate',
          jobTitle: formData.profession,
          employedIn: 'Private Company',
          incomeRange: '₹10–15 LPA',
          incomeVisibility: 'visible_as_range',
          workLocation: formData.location,
        } as any,
        family: {
          familyType: formData.familyType === 'Not Sure' ? 'Nuclear' : (formData.familyType as any),
          familyValues: 'Moderate',
          fatherOccupation: 'Retired Government Officer',
          motherOccupation: 'Homemaker',
          brothersCount: formData.hasSiblings ? 1 : 0,
          familyLocation: formData.location,
          visibility: {
            parents: formData.showFamilyToOthers ? 'matches' : 'request_access',
            siblings: formData.showFamilyToOthers ? 'matches' : 'request_access',
            familyBackground: formData.showFamilyToOthers ? 'matches' : 'request_access',
            familyValues: formData.showFamilyToOthers ? 'matches' : 'request_access',
          },
        } as any,
        religionCulture: {
          religion: formData.religion,
          communityCaste: formData.community,
          religiousPractice: 'Practicing',
          visibility: {
            religion: formData.showReligionToOthers ? 'matches' : 'private',
            communityCaste: formData.showReligionToOthers ? 'matches' : 'private',
            subCommunity: formData.showReligionToOthers ? 'matches' : 'private',
            religiousPractice: formData.showReligionToOthers ? 'matches' : 'private',
            dietaryPreference: formData.showReligionToOthers ? 'matches' : 'private',
          },
        } as any,
      });
    } catch (e) {
      console.warn('[ProfileCreationWizard] updateMasterProfile error:', e);
    }

    Alert.alert(
      'Profile Created! 💖',
      'Your profile has been saved. Welcome to Margam discovery!',
      [
        {
          text: 'Start Matching 💖',
          onPress: () => onComplete(formData),
        },
      ]
    );
  };

  // Helper to toggle multi-select traits
  const toggleTrait = (trait: string) => {
    setFormData((prev) => {
      const exists = prev.personalityTraits.includes(trait);
      if (exists) {
        return {
          ...prev,
          personalityTraits: prev.personalityTraits.filter((t) => t !== trait),
        };
      } else {
        if (prev.personalityTraits.length >= 5) {
          Alert.alert('Maximum 5 Traits', 'You can select up to 5 personality traits.');
          return prev;
        }
        return {
          ...prev,
          personalityTraits: [...prev.personalityTraits, trait],
        };
      }
    });
  };

  // Helper to toggle languages
  const toggleLanguage = (lang: string) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(lang);
      if (exists) {
        return {
          ...prev,
          languages: prev.languages.filter((l) => l !== lang),
        };
      } else {
        return {
          ...prev,
          languages: [...prev.languages, lang],
        };
      }
    });
  };

  // Helper to toggle Margams
  const toggleMargam = (margamName: string) => {
    setFormData((prev) => {
      const exists = prev.selectedMargams.includes(margamName);
      if (exists) {
        return {
          ...prev,
          selectedMargams: prev.selectedMargams.filter((m) => m !== margamName),
        };
      } else {
        return {
          ...prev,
          selectedMargams: [...prev.selectedMargams, margamName],
        };
      }
    });
  };

  // Helper to remove photo
  const handleRemovePhoto = (index: number) => {
    if (formData.photos.length <= 1) {
      Alert.alert('Minimum Photo Required', 'You need at least 1 photo for your profile.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== index),
    }));
  };

  // Helper to add photo
  const handleAddPhoto = () => {
    Alert.alert(
      'Add Photo',
      'Select a photo from your library or take a new one.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Choose from Gallery 💖',
          onPress: () => {
            const newPhoto =
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
            setFormData((prev) => ({
              ...prev,
              photos: [...prev.photos, newPhoto],
            }));
          },
        },
      ]
    );
  };

  // Available Margams Catalog for Step 7
  const ALL_MARGAMS = [
    { name: 'Café Business', emoji: '☕', bgColor: '#FEF3C7', color: '#D97706' },
    { name: 'Travel', emoji: '✈️', bgColor: '#EFF6FF', color: '#2563EB' },
    { name: 'Photography', emoji: '📷', bgColor: '#FDF4FF', color: '#9333EA' },
    { name: 'Food', emoji: '🍽️', bgColor: '#FFF1F2', color: '#E11D48' },
    { name: 'Fitness', emoji: '🏋️', bgColor: '#ECFDF5', color: '#059669' },
    { name: 'Lifestyle', emoji: '🍃', bgColor: '#F0FDF4', color: '#16A34A' },
    { name: 'Adventure', emoji: '🧗', bgColor: '#F5F3FF', color: '#7C3AED' },
    { name: 'Arts & Culture', emoji: '🎭', bgColor: '#FFF7ED', color: '#EA580C' },
    { name: 'Technology', emoji: '💻', bgColor: '#E0F2FE', color: '#0284C7' },
    { name: 'Music & Concerts', emoji: '🎵', bgColor: '#FCE7F3', color: '#DB2777' },
    { name: 'Mindful Living', emoji: '🧘', bgColor: '#ECFDF5', color: '#047857' },
    { name: 'Reading & Literature', emoji: '📚', bgColor: '#FEF9C3', color: '#CA8A04' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ============================================================== */}
      {/* TOP HEADER (Present on steps 1-9)                               */}
      {/* ============================================================== */}
      {currentStep > 0 && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeft size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            {/* Step 1 to 8 Progress Bars */}
            {currentStep <= 8 ? (
              <>
                <View style={styles.progressBarRow}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((stepNum) => (
                    <View
                      key={stepNum}
                      style={[
                        styles.progressSegment,
                        currentStep >= stepNum && styles.progressSegmentFilled,
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.stepCounterText}>Step {currentStep} of 8</Text>
              </>
            ) : (
              <View style={styles.reviewHeaderBadge}>
                <Sparkles size={18} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.reviewHeaderText}>Almost Done! 🎉</Text>
              </View>
            )}
          </View>

          <View style={{ width: 36 }} />
        </View>
      )}

      {/* ============================================================== */}
      {/* STEP CONTENT BODY                                              */}
      {/* ============================================================== */}
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={[
          styles.mainScrollContent,
          currentStep === 0 && styles.introScrollContent,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ============================================================ */}
        {/* STEP 0: INTRO HERO SCREEN                                    */}
        {/* ============================================================ */}
        {currentStep === 0 && (
          <View style={styles.introContainer}>
            {/* Margam Top Branding */}
            <View style={styles.introBrandBox}>
              <MargamLogoNew size={52} />
              <Text style={styles.introBrandTitle}>Margam</Text>
              <Text style={styles.introBrandTagline}>
                Shared interests. Meaningful connections.
              </Text>
            </View>

            {/* Scenic Nature Couple Visual */}
            <View style={styles.introVisualCard}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
                }}
                style={styles.introCouplePhoto}
              />
            </View>

            {/* Floating Card with 4 Icon Chips & CTA */}
            <View style={styles.introCard}>
              <View style={styles.introChipsRow}>
                <View style={styles.introMiniChip}>
                  <Coffee size={15} color="#D97706" />
                </View>
                <View style={styles.introMiniChip}>
                  <Leaf size={15} color="#059669" />
                </View>
                <View style={styles.introMiniChip}>
                  <ShieldCheck size={15} color="#2563EB" />
                </View>
                <View style={styles.introMiniChip}>
                  <Utensils size={15} color="#E11D48" />
                </View>
              </View>

              <Text style={styles.introCardTitle}>Create your profile in a few steps</Text>
              <Text style={styles.introCardSubtitle}>
                Help us understand you better so we can find meaningful matches who share your lifestyle.
              </Text>

              <MargamButton
                title="Let's Get Started"
                onPress={handleNext}
                size="lg"
                showHeart={true}
                arrowRight={true}
                style={styles.introCtaBtn}
              />

              <View style={styles.introLockRow}>
                <Lock size={12} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.introLockText}>
                  Your information stays private and secure.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 1: BASIC INFORMATION                                    */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Basic Information</Text>
            <Text style={styles.stepSubtitle}>Let's start with the essentials.</Text>

            {/* First Name */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.firstName}
                onChangeText={(val) => setFormData((p) => ({ ...p, firstName: val }))}
                placeholder="Enter your first name"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Age Dropdown */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Age</Text>
              <TouchableOpacity
                style={styles.selectorInput}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert(
                    'Select Age',
                    'Choose your age in years',
                    [
                      { text: '25 years', onPress: () => setFormData((p) => ({ ...p, age: 25 })) },
                      { text: '26 years', onPress: () => setFormData((p) => ({ ...p, age: 26 })) },
                      { text: '27 years', onPress: () => setFormData((p) => ({ ...p, age: 27 })) },
                      { text: '28 years', onPress: () => setFormData((p) => ({ ...p, age: 28 })) },
                      { text: '29 years', onPress: () => setFormData((p) => ({ ...p, age: 29 })) },
                      { text: '30+ years', onPress: () => setFormData((p) => ({ ...p, age: 31 })) },
                    ]
                  );
                }}
              >
                <Text style={styles.selectorText}>{formData.age} years</Text>
                <ChevronDown size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Gender Segmented Options */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.segmentedOptionsRow}>
                {(['Female', 'Male', 'Non-binary'] as const).map((genderOption) => {
                  const isSelected = formData.gender === genderOption;
                  return (
                    <TouchableOpacity
                      key={genderOption}
                      style={[
                        styles.segmentPill,
                        isSelected && styles.segmentPillSelected,
                      ]}
                      onPress={() => setFormData((p) => ({ ...p, gender: genderOption }))}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <Heart size={13} color="#EF4444" fill="#EF4444" style={{ marginRight: 5 }} />
                      )}
                      <Text
                        style={[
                          styles.segmentPillText,
                          isSelected && styles.segmentPillTextSelected,
                        ]}
                      >
                        {genderOption}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Looking For Segmented Options */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Looking for</Text>
              <View style={styles.segmentedOptionsRow}>
                {(['Male', 'Female', 'Open'] as const).map((lookOption) => {
                  const isSelected = formData.lookingFor === lookOption;
                  return (
                    <TouchableOpacity
                      key={lookOption}
                      style={[
                        styles.segmentPill,
                        isSelected && styles.segmentPillSelected,
                      ]}
                      onPress={() => setFormData((p) => ({ ...p, lookingFor: lookOption }))}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <Heart size={13} color="#EF4444" fill="#EF4444" style={{ marginRight: 5 }} />
                      )}
                      <Text
                        style={[
                          styles.segmentPillText,
                          isSelected && styles.segmentPillTextSelected,
                        ]}
                      >
                        {lookOption}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Current Location */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Current Location</Text>
              <TouchableOpacity
                style={styles.selectorInput}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert(
                    'Select Location in Kerala',
                    'Choose your home base',
                    [
                      { text: 'Kochi, Kerala', onPress: () => setFormData((p) => ({ ...p, location: 'Kochi, Kerala' })) },
                      { text: 'Thrissur, Kerala', onPress: () => setFormData((p) => ({ ...p, location: 'Thrissur, Kerala' })) },
                      { text: 'Kozhikode, Kerala', onPress: () => setFormData((p) => ({ ...p, location: 'Kozhikode, Kerala' })) },
                      { text: 'Trivandrum, Kerala', onPress: () => setFormData((p) => ({ ...p, location: 'Trivandrum, Kerala' })) },
                    ]
                  );
                }}
              >
                <View style={styles.locationSelectorRow}>
                  <MapPin size={16} color="#EF4444" style={{ marginRight: 6 }} />
                  <Text style={styles.selectorText}>{formData.location}</Text>
                </View>
                <ChevronDown size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Willing to Relocate Switch & Options */}
            <View style={styles.formFieldGroup}>
              <View style={styles.relocateHeaderRow}>
                <Text style={styles.fieldLabel}>Willing to Relocate?</Text>
                <Switch
                  value={formData.willingToRelocate}
                  onValueChange={(val) => setFormData((p) => ({ ...p, willingToRelocate: val }))}
                  trackColor={{ false: '#E2E8F0', true: '#FECDD3' }}
                  thumbColor={formData.willingToRelocate ? '#EF4444' : '#FFFFFF'}
                />
              </View>

              {formData.willingToRelocate && (
                <View style={styles.segmentedOptionsRow}>
                  {(['Within India', 'Abroad', 'Not Sure'] as const).map((reOption) => {
                    const isSelected = formData.relocationPreference === reOption;
                    return (
                      <TouchableOpacity
                        key={reOption}
                        style={[
                          styles.segmentPill,
                          isSelected && styles.segmentPillSelected,
                        ]}
                        onPress={() => setFormData((p) => ({ ...p, relocationPreference: reOption }))}
                        activeOpacity={0.8}
                      >
                        {isSelected && (
                          <Check size={13} color="#EF4444" strokeWidth={3} style={{ marginRight: 5 }} />
                        )}
                        <Text
                          style={[
                            styles.segmentPillText,
                            isSelected && styles.segmentPillTextSelected,
                          ]}
                        >
                          {reOption}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 2: ADD PHOTOS                                           */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Add Photos</Text>
            <Text style={styles.stepSubtitle}>A genuine photo helps build trust.</Text>

            {/* Photos Grid */}
            <View style={styles.photosGridWrapper}>
              <View style={styles.photoTopRow}>
                {/* Main Photo Card */}
                {formData.photos[0] ? (
                  <View style={styles.mainPhotoCard}>
                    <Image source={{ uri: formData.photos[0] }} style={styles.mainPhotoImg} />
                    <View style={styles.mainPhotoPill}>
                      <Text style={styles.mainPhotoPillText}>Main Photo</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.photoDeleteBtn}
                      onPress={() => handleRemovePhoto(0)}
                    >
                      <X size={13} color="#FFFFFF" strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* Dashed Add Photo Box */}
                <TouchableOpacity
                  style={styles.addPhotoCardDashed}
                  activeOpacity={0.75}
                  onPress={handleAddPhoto}
                >
                  <View style={styles.addPhotoCameraCircle}>
                    <Camera size={22} color="#EF4444" />
                  </View>
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Lower Row of Photos */}
              <View style={styles.photoLowerRow}>
                {formData.photos.slice(1).map((photoUrl, idx) => (
                  <View key={idx} style={styles.smallPhotoCard}>
                    <Image source={{ uri: photoUrl }} style={styles.smallPhotoImg} />
                    <TouchableOpacity
                      style={styles.photoDeleteBtn}
                      onPress={() => handleRemovePhoto(idx + 1)}
                    >
                      <X size={12} color="#FFFFFF" strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Photo Tips Guidance Card */}
            <View style={styles.photoTipsCard}>
              <View style={styles.photoTipsTitleRow}>
                <ShieldCheck size={18} color="#059669" style={{ marginRight: 6 }} />
                <Text style={styles.photoTipsTitle}>Photo Tips</Text>
              </View>
              <View style={styles.photoTipsList}>
                <Text style={styles.tipItem}>✓ Use clear, recent photos</Text>
                <Text style={styles.tipItem}>✓ Include at least 3 photos</Text>
                <Text style={styles.tipItem}>✓ Show your real self (no heavy filters)</Text>
                <Text style={styles.tipItem}>✓ Photos are verified and kept private</Text>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 3: ABOUT YOU                                            */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>About You</Text>
            <Text style={styles.stepSubtitle}>Tell us a bit about yourself.</Text>

            {/* Write a short bio */}
            <View style={styles.formFieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>Write a short bio</Text>
                <Text style={styles.counterText}>{formData.bio.length}/300</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                value={formData.bio}
                onChangeText={(val) => setFormData((p) => ({ ...p, bio: val.slice(0, 300) }))}
                multiline
                numberOfLines={4}
                placeholder="For example: I love good food, meaningful conversations and exploring new places. I'm looking for a partner who shares similar interests and life goals."
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* What makes you, you? (Select up to 5) */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>What makes you, you? (Select up to 5)</Text>
              <View style={styles.traitsGrid}>
                {[
                  { name: 'Kind', emoji: '💖' },
                  { name: 'Ambitious', emoji: '🦁' },
                  { name: 'Fun-loving', emoji: '😄' },
                  { name: 'Calm', emoji: '🧘' },
                  { name: 'Family-oriented', emoji: '👨‍👩‍👧' },
                  { name: 'Independent', emoji: '🗽' },
                  { name: 'Spiritual', emoji: '🕊️' },
                  { name: 'Creative', emoji: '🎨' },
                  { name: 'Adventurous', emoji: '🧗' },
                ].map((item) => {
                  const isSelected = formData.personalityTraits.includes(item.name);
                  return (
                    <TouchableOpacity
                      key={item.name}
                      style={[styles.traitChip, isSelected && styles.traitChipSelected]}
                      onPress={() => toggleTrait(item.name)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.traitEmoji}>{item.emoji}</Text>
                      <Text
                        style={[
                          styles.traitChipText,
                          isSelected && styles.traitChipTextSelected,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Languages you speak */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Languages you speak</Text>
              <View style={styles.languagesRow}>
                {['Malayalam', 'English', 'Hindi', 'Tamil'].map((lang) => {
                  const isSelected = formData.languages.includes(lang);
                  return (
                    <TouchableOpacity
                      key={lang}
                      style={[styles.langChip, isSelected && styles.langChipSelected]}
                      onPress={() => toggleLanguage(lang)}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <Check size={12} color="#EF4444" strokeWidth={3} style={{ marginRight: 4 }} />
                      )}
                      <Text
                        style={[
                          styles.langChipText,
                          isSelected && styles.langChipTextSelected,
                        ]}
                      >
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 4: EDUCATION & CAREER                                   */}
        {/* ============================================================ */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Education & Career</Text>
            <Text style={styles.stepSubtitle}>Help others understand your background.</Text>

            {/* Education Level */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Education Level</Text>
              <TouchableOpacity
                style={styles.selectorInput}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Select Education', 'Select your highest degree', [
                    { text: "Bachelor's Degree", onPress: () => setFormData((p) => ({ ...p, educationLevel: "Bachelor's" })) },
                    { text: "Master's Degree", onPress: () => setFormData((p) => ({ ...p, educationLevel: 'Masters' })) },
                    { text: 'Doctorate / PhD', onPress: () => setFormData((p) => ({ ...p, educationLevel: 'PhD' })) },
                  ]);
                }}
              >
                <Text style={styles.selectorText}>{formData.educationLevel}</Text>
                <ChevronDown size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Field of Study */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Field of Study</Text>
              <TextInput
                style={styles.textInput}
                value={formData.fieldOfStudy}
                onChangeText={(val) => setFormData((p) => ({ ...p, fieldOfStudy: val }))}
                placeholder="e.g. Marketing, Computer Science"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Profession */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Profession</Text>
              <TextInput
                style={styles.textInput}
                value={formData.profession}
                onChangeText={(val) => setFormData((p) => ({ ...p, profession: val }))}
                placeholder="e.g. Marketing Professional, Software Engineer"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Work Mode */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Work Mode</Text>
              <View style={styles.segmentedOptionsRow}>
                {(['Work from Office', 'Hybrid', 'Remote'] as const).map((mode) => {
                  const isSelected = formData.workMode === mode;
                  return (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.segmentPill, isSelected && styles.segmentPillSelected]}
                      onPress={() => setFormData((p) => ({ ...p, workMode: mode }))}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <Heart size={12} color="#EF4444" fill="#EF4444" style={{ marginRight: 4 }} />
                      )}
                      <Text
                        style={[
                          styles.segmentPillText,
                          isSelected && styles.segmentPillTextSelected,
                        ]}
                      >
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Annual Income Range */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Annual Income Range</Text>
              <TouchableOpacity
                style={styles.selectorInput}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Select Income Range', 'Kept confidential and private', [
                    { text: '₹7 - ₹15 Lakhs', onPress: () => setFormData((p) => ({ ...p, annualIncomeRange: '₹7 - ₹15 Lakhs' })) },
                    { text: '₹15 - ₹25 Lakhs', onPress: () => setFormData((p) => ({ ...p, annualIncomeRange: '₹15 - ₹25 Lakhs' })) },
                    { text: '₹25 - ₹40 Lakhs', onPress: () => setFormData((p) => ({ ...p, annualIncomeRange: '₹25 - ₹40 Lakhs' })) },
                    { text: '₹40+ Lakhs', onPress: () => setFormData((p) => ({ ...p, annualIncomeRange: '₹40+ Lakhs' })) },
                  ]);
                }}
              >
                <Text style={styles.selectorText}>{formData.annualIncomeRange}</Text>
                <ChevronDown size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 5: FAMILY & PERSONAL DETAILS                            */}
        {/* ============================================================ */}
        {currentStep === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Family & Personal Details</Text>
            <Text style={styles.stepSubtitle}>You can control the visibility of these details.</Text>

            {/* Marital Status */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Marital Status</Text>
              <View style={styles.segmentedOptionsRow}>
                {(['Single', 'Divorced', 'Widowed'] as const).map((mStatus) => {
                  const isSelected = formData.maritalStatus === mStatus;
                  return (
                    <TouchableOpacity
                      key={mStatus}
                      style={[styles.segmentPill, isSelected && styles.segmentPillSelected]}
                      onPress={() => setFormData((p) => ({ ...p, maritalStatus: mStatus }))}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <Heart size={13} color="#EF4444" fill="#EF4444" style={{ marginRight: 4 }} />
                      )}
                      <Text
                        style={[
                          styles.segmentPillText,
                          isSelected && styles.segmentPillTextSelected,
                        ]}
                      >
                        {mStatus}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Family Type */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Family Type</Text>
              <View style={styles.segmentedOptionsRow}>
                {(['Nuclear', 'Joint', 'Not Sure'] as const).map((fType) => {
                  const isSelected = formData.familyType === fType;
                  return (
                    <TouchableOpacity
                      key={fType}
                      style={[styles.segmentPill, isSelected && styles.segmentPillSelected]}
                      onPress={() => setFormData((p) => ({ ...p, familyType: fType }))}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <Heart size={13} color="#EF4444" fill="#EF4444" style={{ marginRight: 4 }} />
                      )}
                      <Text
                        style={[
                          styles.segmentPillText,
                          isSelected && styles.segmentPillTextSelected,
                        ]}
                      >
                        {fType}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Do you have siblings? */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Do you have siblings?</Text>
              <View style={styles.segmentedOptionsRow}>
                <TouchableOpacity
                  style={[styles.segmentPill, formData.hasSiblings && styles.segmentPillSelected]}
                  onPress={() => setFormData((p) => ({ ...p, hasSiblings: true }))}
                  activeOpacity={0.8}
                >
                  {formData.hasSiblings && (
                    <Heart size={13} color="#EF4444" fill="#EF4444" style={{ marginRight: 5 }} />
                  )}
                  <Text
                    style={[
                      styles.segmentPillText,
                      formData.hasSiblings && styles.segmentPillTextSelected,
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.segmentPill, !formData.hasSiblings && styles.segmentPillSelected]}
                  onPress={() => setFormData((p) => ({ ...p, hasSiblings: false }))}
                  activeOpacity={0.8}
                >
                  {!formData.hasSiblings && (
                    <Check size={13} color="#EF4444" strokeWidth={3} style={{ marginRight: 5 }} />
                  )}
                  <Text
                    style={[
                      styles.segmentPillText,
                      !formData.hasSiblings && styles.segmentPillTextSelected,
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Privacy Card Toggle */}
            <View style={styles.privacyOptionCard}>
              <View style={styles.privacyTextCol}>
                <View style={styles.privacyIconRow}>
                  <Lock size={15} color="#2563EB" style={{ marginRight: 6 }} />
                  <Text style={styles.privacyOptionTitle}>Show these details to others</Text>
                </View>
                <Text style={styles.privacyOptionSubtitle}>
                  You can change this anytime in privacy settings.
                </Text>
              </View>
              <Switch
                value={formData.showFamilyToOthers}
                onValueChange={(val) => setFormData((p) => ({ ...p, showFamilyToOthers: val }))}
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={formData.showFamilyToOthers ? '#2563EB' : '#FFFFFF'}
              />
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 6: RELIGION & HOROSCOPE (OPTIONAL)                      */}
        {/* ============================================================ */}
        {currentStep === 6 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Religion & Horoscope (Optional)</Text>
            <Text style={styles.stepSubtitle}>Share if you wish. You can keep this private.</Text>

            {/* Religion Dropdown */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Religion</Text>
              <TouchableOpacity
                style={styles.selectorInput}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Select Faith', 'Choose your religion', [
                    { text: 'Hindu', onPress: () => setFormData((p) => ({ ...p, religion: 'Hindu' })) },
                    { text: 'Christian', onPress: () => setFormData((p) => ({ ...p, religion: 'Christian' })) },
                    { text: 'Muslim', onPress: () => setFormData((p) => ({ ...p, religion: 'Muslim' })) },
                    { text: 'Spiritual / Other', onPress: () => setFormData((p) => ({ ...p, religion: 'Spiritual' })) },
                  ]);
                }}
              >
                <Text style={styles.selectorText}>{formData.religion}</Text>
                <ChevronDown size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Community Dropdown */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Community</Text>
              <TouchableOpacity
                style={styles.selectorInput}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Select Community', 'Choose your community or caste no bar', [
                    { text: 'Ezhava', onPress: () => setFormData((p) => ({ ...p, community: 'Ezhava' })) },
                    { text: 'Nair', onPress: () => setFormData((p) => ({ ...p, community: 'Nair' })) },
                    { text: 'Caste No Bar', onPress: () => setFormData((p) => ({ ...p, community: 'Caste No Bar' })) },
                    { text: 'Other', onPress: () => setFormData((p) => ({ ...p, community: 'Other' })) },
                  ]);
                }}
              >
                <Text style={styles.selectorText}>{formData.community}</Text>
                <ChevronDown size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Do you have a horoscope? */}
            <View style={styles.formFieldGroup}>
              <Text style={styles.fieldLabel}>Do you have a horoscope?</Text>
              <View style={styles.segmentedOptionsRow}>
                {(['Yes', 'No', 'Not sure'] as const).map((hOption) => {
                  const isSelected = formData.hasHoroscope === hOption;
                  return (
                    <TouchableOpacity
                      key={hOption}
                      style={[styles.segmentPill, isSelected && styles.segmentPillSelected]}
                      onPress={() => setFormData((p) => ({ ...p, hasHoroscope: hOption }))}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <Heart size={13} color="#EF4444" fill="#EF4444" style={{ marginRight: 5 }} />
                      )}
                      <Text
                        style={[
                          styles.segmentPillText,
                          isSelected && styles.segmentPillTextSelected,
                        ]}
                      >
                        {hOption}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Privacy Card Toggle */}
            <View style={styles.privacyOptionCard}>
              <View style={styles.privacyTextCol}>
                <View style={styles.privacyIconRow}>
                  <EyeOff size={15} color="#9333EA" style={{ marginRight: 6 }} />
                  <Text style={styles.privacyOptionTitle}>Show to others</Text>
                </View>
                <Text style={styles.privacyOptionSubtitle}>
                  Keep this private until you're comfortable.
                </Text>
              </View>
              <Switch
                value={formData.showReligionToOthers}
                onValueChange={(val) => setFormData((p) => ({ ...p, showReligionToOthers: val }))}
                trackColor={{ false: '#E2E8F0', true: '#E9D5FF' }}
                thumbColor={formData.showReligionToOthers ? '#9333EA' : '#FFFFFF'}
              />
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 7: YOUR MARGAMS (INTERESTS)                             */}
        {/* ============================================================ */}
        {currentStep === 7 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Your Margams (Interests)</Text>
            <Text style={styles.stepSubtitle}>Select your key interests and passions.</Text>

            {/* 3x3 Grid of Margam Cards */}
            <View style={styles.margamsGrid}>
              {(activeMargamsExpanded ? ALL_MARGAMS : ALL_MARGAMS.slice(0, 9)).map((m) => {
                const isSelected = formData.selectedMargams.includes(m.name);
                return (
                  <TouchableOpacity
                    key={m.name}
                    style={[
                      styles.margamTile,
                      isSelected && styles.margamTileSelected,
                    ]}
                    onPress={() => toggleMargam(m.name)}
                    activeOpacity={0.8}
                  >
                    {isSelected && (
                      <View style={styles.margamCheckedBadge}>
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                    <View style={[styles.margamEmojiBox, { backgroundColor: m.bgColor }]}>
                      <Text style={styles.margamTileEmoji}>{m.emoji}</Text>
                    </View>
                    <Text
                      style={[
                        styles.margamTileTitle,
                        isSelected && styles.margamTileTitleSelected,
                      ]}
                      numberOfLines={2}
                    >
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Show More Interests Link */}
            <TouchableOpacity
              style={styles.showMoreMargamsBtn}
              onPress={() => setActiveMargamsExpanded(!activeMargamsExpanded)}
              activeOpacity={0.75}
            >
              <Text style={styles.showMoreMargamsText}>
                {activeMargamsExpanded ? 'Show Less Interests ⌵' : 'Show More Interests +'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 8: LIFE MAP & PARTNER PREFERENCES                       */}
        {/* ============================================================ */}
        {currentStep === 8 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Life Map & Partner Preferences</Text>
            <Text style={styles.stepSubtitle}>Your journey and what you're looking for.</Text>

            {/* Segmented Tab Switcher */}
            <View style={styles.lifeMapTabsRow}>
              <TouchableOpacity
                style={[
                  styles.lifeMapTab,
                  formData.activeLifeMapTab === 'life_map' && styles.lifeMapTabActive,
                ]}
                onPress={() => setFormData((p) => ({ ...p, activeLifeMapTab: 'life_map' }))}
              >
                <Text
                  style={[
                    styles.lifeMapTabText,
                    formData.activeLifeMapTab === 'life_map' && styles.lifeMapTabTextActive,
                  ]}
                >
                  My Life Map
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.lifeMapTab,
                  formData.activeLifeMapTab === 'preferences' && styles.lifeMapTabActive,
                ]}
                onPress={() => setFormData((p) => ({ ...p, activeLifeMapTab: 'preferences' }))}
              >
                <Text
                  style={[
                    styles.lifeMapTabText,
                    formData.activeLifeMapTab === 'preferences' && styles.lifeMapTabTextActive,
                  ]}
                >
                  Partner Preferences
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content for My Life Map */}
            {formData.activeLifeMapTab === 'life_map' ? (
              <View style={styles.timelineCardsWrap}>
                {/* 1. Now Card */}
                <View style={styles.timelineItemCard}>
                  <View style={styles.timelineIconBoxNow}>
                    <Leaf size={16} color="#059669" />
                  </View>
                  <View style={styles.timelineTextCol}>
                    <Text style={styles.timelinePhaseTitle}>Now (1–2 years)</Text>
                    <TextInput
                      style={styles.timelineInput}
                      value={formData.lifeMapNow}
                      onChangeText={(val) => setFormData((p) => ({ ...p, lifeMapNow: val }))}
                      multiline
                    />
                  </View>
                </View>

                {/* 2. Next Card */}
                <View style={styles.timelineItemCard}>
                  <View style={styles.timelineIconBoxNext}>
                    <Compass size={16} color="#EA580C" />
                  </View>
                  <View style={styles.timelineTextCol}>
                    <Text style={styles.timelinePhaseTitle}>Next (3–5 years)</Text>
                    <TextInput
                      style={styles.timelineInput}
                      value={formData.lifeMapNext}
                      onChangeText={(val) => setFormData((p) => ({ ...p, lifeMapNext: val }))}
                      multiline
                    />
                  </View>
                </View>

                {/* 3. Future Card */}
                <View style={styles.timelineItemCard}>
                  <View style={styles.timelineIconBoxFuture}>
                    <Heart size={16} color="#EF4444" fill="#EF4444" />
                  </View>
                  <View style={styles.timelineTextCol}>
                    <Text style={styles.timelinePhaseTitle}>Future (5+ years)</Text>
                    <TextInput
                      style={styles.timelineInput}
                      value={formData.lifeMapFuture}
                      onChangeText={(val) => setFormData((p) => ({ ...p, lifeMapFuture: val }))}
                      multiline
                    />
                  </View>
                </View>
              </View>
            ) : (
              /* Content for Partner Preferences */
              <View style={styles.preferencesContentWrap}>
                <View style={styles.formFieldGroup}>
                  <Text style={styles.fieldLabel}>Preferred Age Range</Text>
                  <View style={styles.selectorInput}>
                    <Text style={styles.selectorText}>
                      {formData.partnerMinAge} – {formData.partnerMaxAge} years
                    </Text>
                    <Heart size={16} color="#EF4444" fill="#EF4444" />
                  </View>
                </View>

                <View style={styles.formFieldGroup}>
                  <Text style={styles.fieldLabel}>Preferred Location</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.partnerLocation}
                    onChangeText={(val) => setFormData((p) => ({ ...p, partnerLocation: val }))}
                    placeholder="e.g. Kerala or Open to Relocation"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 9: REVIEW & COMPLETE                                    */}
        {/* ============================================================ */}
        {currentStep === 9 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Review & Complete</Text>
            <Text style={styles.stepSubtitle}>Here's a summary of your profile.</Text>

            {/* Profile Summary Card */}
            <View style={styles.reviewProfileCard}>
              <View style={styles.reviewTopRow}>
                <Image
                  source={{ uri: formData.photos[0] }}
                  style={styles.reviewAvatar}
                />
                <View style={styles.reviewInfoCol}>
                  <View style={styles.reviewNameRow}>
                    <Text style={styles.reviewNameText}>
                      {formData.firstName}, {formData.age}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleJumpToStep(1)}
                      style={styles.reviewEditPencilBtn}
                    >
                      <Text style={{ fontSize: 13 }}>✏️</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.reviewSubDetailRow}>
                    <Briefcase size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.reviewSubDetailText}>{formData.profession}</Text>
                  </View>
                  <View style={styles.reviewSubDetailRow}>
                    <MapPin size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.reviewSubDetailText}>
                      {formData.location} ({formData.willingToRelocate ? 'Open to relocate' : 'Local'})
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.reviewBioQuote}>"{formData.bio}"</Text>

              {/* Margam Chips */}
              <View style={styles.reviewMargamsRow}>
                {formData.selectedMargams.map((mName, idx) => (
                  <View key={idx} style={styles.reviewMargamPill}>
                    <Text style={styles.reviewMargamText}>
                      {mName === 'Café Business' ? '☕ ' : mName === 'Travel' ? '✈️ ' : '📷 '}
                      {mName}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Summary Accordion List */}
            <View style={styles.reviewSectionsList}>
              {/* Education & Career */}
              <TouchableOpacity
                style={styles.reviewSectionItem}
                onPress={() => handleJumpToStep(4)}
                activeOpacity={0.8}
              >
                <View style={styles.reviewSectionLeft}>
                  <GraduationCap size={16} color="#2563EB" style={{ marginRight: 10 }} />
                  <Text style={styles.reviewSectionLabel}>Education & Career</Text>
                </View>
                <View style={styles.reviewSectionRight}>
                  <Text style={styles.reviewSectionValue}>
                    {formData.educationLevel} — {formData.fieldOfStudy}
                  </Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>

              {/* Family Details */}
              <TouchableOpacity
                style={styles.reviewSectionItem}
                onPress={() => handleJumpToStep(5)}
                activeOpacity={0.8}
              >
                <View style={styles.reviewSectionLeft}>
                  <Users size={16} color="#EA580C" style={{ marginRight: 10 }} />
                  <Text style={styles.reviewSectionLabel}>Family Details</Text>
                </View>
                <View style={styles.reviewSectionRight}>
                  <Text style={styles.reviewSectionValue}>
                    {formData.familyType} Family • {formData.hasSiblings ? '1 sibling' : 'Only child'}
                  </Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>

              {/* Religion */}
              <TouchableOpacity
                style={styles.reviewSectionItem}
                onPress={() => handleJumpToStep(6)}
                activeOpacity={0.8}
              >
                <View style={styles.reviewSectionLeft}>
                  <Sparkles size={16} color="#9333EA" style={{ marginRight: 10 }} />
                  <Text style={styles.reviewSectionLabel}>Religion</Text>
                </View>
                <View style={styles.reviewSectionRight}>
                  <Text style={styles.reviewSectionValue}>
                    {formData.religion} • {formData.community}{' '}
                    {!formData.showReligionToOthers ? '(Private)' : ''}
                  </Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>

              {/* Life Map */}
              <TouchableOpacity
                style={styles.reviewSectionItem}
                onPress={() => handleJumpToStep(8)}
                activeOpacity={0.8}
              >
                <View style={styles.reviewSectionLeft}>
                  <Compass size={16} color="#059669" style={{ marginRight: 10 }} />
                  <Text style={styles.reviewSectionLabel}>Life Map</Text>
                </View>
                <View style={styles.reviewSectionRight}>
                  <Text style={styles.reviewSectionValue}>3 milestones</Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>

              {/* Partner Preferences */}
              <TouchableOpacity
                style={styles.reviewSectionItem}
                onPress={() => handleJumpToStep(8)}
                activeOpacity={0.8}
              >
                <View style={styles.reviewSectionLeft}>
                  <Heart size={16} color="#EF4444" fill="#EF4444" style={{ marginRight: 10 }} />
                  <Text style={styles.reviewSectionLabel}>Partner Preferences</Text>
                </View>
                <View style={styles.reviewSectionRight}>
                  <Text style={styles.reviewSectionValue}>
                    Age {formData.partnerMinAge}–{formData.partnerMaxAge} • {formData.partnerLocation}
                  </Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ============================================================== */}
      {/* FIXED BOTTOM ACTION BAR (Present on steps 1-9)                 */}
      {/* Every button is red with love hearts as requested              */}
      {/* ============================================================== */}
      {currentStep > 0 && (
        <View style={styles.bottomBar}>
          <MargamButton
            title={currentStep === 9 ? 'Create My Profile' : 'Continue'}
            onPress={handleNext}
            size="lg"
            showHeart={true}
            heartPosition="left"
            arrowRight={true}
            style={styles.continueBtn}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  progressContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '100%',
    maxWidth: 240,
    marginBottom: 6,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  progressSegmentFilled: {
    backgroundColor: '#EF4444',
  },
  stepCounterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  reviewHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  introScrollContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  stepContainer: {
    flex: 1,
  },
  stepHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },
  formFieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  counterText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  textAreaInput: {
    minHeight: 110,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  selectorInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  locationSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentedOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  segmentPillSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: '#EF4444',
  },
  segmentPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  segmentPillTextSelected: {
    color: '#EF4444',
    fontWeight: '700',
  },
  relocateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Photos step styling
  photosGridWrapper: {
    marginBottom: 20,
  },
  photoTopRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  mainPhotoCard: {
    flex: 1.4,
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mainPhotoImg: {
    width: '100%',
    height: '100%',
  },
  mainPhotoPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mainPhotoPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  photoDeleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoCardDashed: {
    flex: 1,
    height: 180,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoCameraCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  photoLowerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  smallPhotoCard: {
    flex: 1,
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  smallPhotoImg: {
    width: '100%',
    height: '100%',
  },
  photoTipsCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  photoTipsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoTipsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  photoTipsList: {
    gap: 4,
  },
  tipItem: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '500',
  },
  // Step 3 Traits
  traitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  traitChipSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: '#EF4444',
  },
  traitEmoji: {
    fontSize: 13,
    marginRight: 6,
  },
  traitChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  traitChipTextSelected: {
    color: '#EF4444',
    fontWeight: '700',
  },
  languagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langChipSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: '#EF4444',
  },
  langChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  langChipTextSelected: {
    color: '#EF4444',
    fontWeight: '700',
  },
  // Privacy Card
  privacyOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  privacyTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  privacyIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  privacyOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  privacyOptionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  // Step 7 Margams
  margamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  margamTile: {
    width: (SCREEN_WIDTH - 60) / 3,
    height: 98,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  margamTileSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  margamCheckedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  margamEmojiBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  margamTileEmoji: {
    fontSize: 18,
  },
  margamTileTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 14,
  },
  margamTileTitleSelected: {
    color: '#EF4444',
    fontWeight: '800',
  },
  showMoreMargamsBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  showMoreMargamsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  // Step 8 Life Map
  lifeMapTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  lifeMapTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  lifeMapTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  lifeMapTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  lifeMapTabTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  timelineCardsWrap: {
    gap: 12,
  },
  timelineItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timelineIconBoxNow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  timelineIconBoxNext: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  timelineIconBoxFuture: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  timelineTextCol: {
    flex: 1,
  },
  timelinePhaseTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  timelineInput: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    padding: 0,
  },
  preferencesContentWrap: {
    gap: 12,
  },
  // Step 9 Review & Complete
  reviewProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  reviewInfoCol: {
    flex: 1,
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  reviewNameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 6,
  },
  reviewEditPencilBtn: {
    padding: 2,
  },
  reviewSubDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reviewSubDetailText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  reviewBioQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#334155',
    lineHeight: 18,
    marginBottom: 12,
  },
  reviewMargamsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  reviewMargamPill: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  reviewMargamText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  reviewSectionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  reviewSectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  reviewSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewSectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewSectionValue: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    maxWidth: 160,
    textAlign: 'right',
  },
  // Intro styling
  introContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  introBrandBox: {
    alignItems: 'center',
    marginBottom: 14,
  },
  introBrandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
    letterSpacing: -0.4,
  },
  introBrandTagline: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  introVisualCard: {
    width: SCREEN_WIDTH - 40,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  introCouplePhoto: {
    width: '100%',
    height: '100%',
  },
  introCard: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  introChipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  introMiniChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  introCardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  introCtaBtn: {
    width: '100%',
    marginBottom: 12,
  },
  introLockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  introLockText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 6,
  },
  continueBtn: {
    width: '100%',
  },
});
