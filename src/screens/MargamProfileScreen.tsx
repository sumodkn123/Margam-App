import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { MargamLogoNew } from '../components/brand/MargamLogoNew';
import { ProfileCreationWizard } from './wizard/ProfileCreationWizard';
import {
  Bell,
  Settings,
  CheckCircle,
  MapPin,
  Camera,
  Crown,
  ChevronRight,
  User,
  Sliders,
  Lock,
  Shield,
  BarChart2,
  Eye,
  Plus,
  Pencil,
  Briefcase,
  GraduationCap,
  Home,
  Globe,
  Dumbbell,
  Plane,
  Utensils,
  Leaf,
  Coffee,
  Users,
  Heart,
  Baby,
  Music,
  Laptop,
  Gamepad2,
  Mountain,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { CURRENT_USER } from '../constants/mockData';
import { MargamButton } from '../components/common/MargamButton';
import {
  MapVisibilityOption,
  LocationDisplayMode,
  AvailabilityStatus,
  ProfileFieldPerms,
  VisibilityState,
} from '../types';
import { PrivacyDashboard } from '../components/privacy/PrivacyDashboard';
import { EditProfileModal, ProfileFormData } from '../components/profile/EditProfileModal';
import { PremiumPlansModal } from '../components/profile/PremiumPlansModal';
import { ViewAsOthersModal } from '../components/profile/ViewAsOthersModal';
import { PreviewWhatOthersSeeModal } from '../components/profile/PreviewWhatOthersSeeModal';
import { AiAboutMeModal } from '../components/profile/AiAboutMeModal';
import { AdvancedProfileSections } from '../components/profile/AdvancedProfileSections';
import { PartnerPreferencesEditor } from '../components/profile/PartnerPreferencesEditor';
import {
  getMasterProfile,
  updateMasterProfile,
  setPrivacyPreset,
  calculateProfileCompleteness,
} from '../services/advancedProfileEngine';
import { AdvancedMatrimonialProfile, PrivacyPreset } from '../types/profile';
import { EditTagsModal } from '../components/profile/EditTagsModal';
import { SettingsModal } from '../components/profile/SettingsModal';
import { NotificationsModal } from '../components/profile/NotificationsModal';
import { useNotifications } from '../services/notificationService';

export interface MargamProfileScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
  mapVisibility: MapVisibilityOption;
  onChangeMapVisibility: (option: MapVisibilityOption) => void;
  locationMode: LocationDisplayMode;
  onChangeLocationMode: (mode: LocationDisplayMode) => void;
  availability: AvailabilityStatus;
  onChangeAvailability: (status: AvailabilityStatus) => void;
  fieldPerms: ProfileFieldPerms;
  onChangeFieldPerm: (field: keyof ProfileFieldPerms, state: VisibilityState) => void;
  onNavigateToHome?: () => void;
  onNavigateToMap?: () => void;
  onNavigateToRequests?: () => void;
  onOpenConversation?: (conversationId: string, recipientName?: string) => void;
  onOpenPrivacyCenter?: () => void;
  onReplayLaunchAnimation?: () => void;
}

export type ProfileTabKey = 'profile' | 'preferences' | 'privacy' | 'activity';

export const MargamProfileScreen: React.FC<MargamProfileScreenProps> = ({
  onBack,
  onLogout,
  onReplayLaunchAnimation,
  mapVisibility,
  onChangeMapVisibility,
  locationMode,
  onChangeLocationMode,
  availability,
  onChangeAvailability,
  fieldPerms,
  onChangeFieldPerm,
  onNavigateToHome,
  onNavigateToMap,
  onNavigateToRequests,
  onOpenConversation,
  onOpenPrivacyCenter,
}) => {
  // Active Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState<ProfileTabKey>('profile');

  // Modals state
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [viewAsOthersVisible, setViewAsOthersVisible] = useState(false);
  const [aiStudioVisible, setAiStudioVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [wizardModalVisible, setWizardModalVisible] = useState(false);
  const { unreadCount } = useNotifications();
  const [editingTagSection, setEditingTagSection] = useState<'lifestyle' | 'family' | 'interests' | null>(null);

  // Master Matrimonial Profile engine state
  const [masterProfile, setMasterProfile] = useState<AdvancedMatrimonialProfile>(() =>
    getMasterProfile('usr-current-sumod')
  );

  const completeness = calculateProfileCompleteness(masterProfile);

  const handleSelectPrivacyPreset = (preset: PrivacyPreset) => {
    const updated = setPrivacyPreset('usr-current-sumod', preset);
    setMasterProfile({ ...updated });
    Alert.alert(
      'Privacy Preset Updated',
      `Applied ${preset.replace(/_/g, ' ').toUpperCase()} preset. Your profile disclosure rules have been updated.`
    );
  };

  // User Profile Editable Data State (Synchronized with CURRENT_USER)
  const [profileData, setProfileData] = useState<ProfileFormData>({
    fullName: 'Sumod Nandan',
    age: 33,
    gender: 'Male',
    location: 'Thrissur, Kerala',
    profession: 'Website Designer Entrepreneur',
    education: "Bachelor's Degree",
    languages: 'Malayalam, English',
    bio: "I'm a creative and curious person who enjoys building products, travelling, exploring new places and staying active. I value meaningful conversations, good food, and a balanced lifestyle. Looking for a partner to share life's journey with.",
  });

  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  );

  // Profile Preview Photos matching the screenshot
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
  ]);

  // Lifestyle Tags
  const [lifestyleTags, setLifestyleTags] = useState<string[]>([
    'Fitness',
    'Travel',
    'Food Lover',
    'Non-smoker',
    'Occasional Drinker',
  ]);

  // Family & Values Tags
  const [familyTags, setFamilyTags] = useState<string[]>([
    'Joint Family',
    'Family Oriented',
    'Open to Relocation',
    'Prefer Children',
  ]);

  // Interests Tags
  const [interestTags, setInterestTags] = useState<string[]>([
    'Photography',
    'Nature',
    'Music',
    'Technology',
    'Gaming',
  ]);

  // Partner Preferences State
  const [partnerMinAge, setPartnerMinAge] = useState(25);
  const [partnerMaxAge, setPartnerMaxAge] = useState(32);
  const [partnerLocation, setPartnerLocation] = useState('Thrissur, Kochi, Kozhikode');
  const [partnerEducation, setPartnerEducation] = useState('Graduate / Post Graduate');
  const [partnerProfession, setPartnerProfession] = useState('Professional / Tech / Healthcare');

  // Section minimization state
  const [isProfilePreviewExpanded, setIsProfilePreviewExpanded] = useState(true);
  const [isAboutMeExpanded, setIsAboutMeExpanded] = useState(true);
  const [isLifestyleExpanded, setIsLifestyleExpanded] = useState(true);
  const [isFamilyExpanded, setIsFamilyExpanded] = useState(true);
  const [isInterestsExpanded, setIsInterestsExpanded] = useState(true);
  const [isPartnerCriteriaExpanded, setIsPartnerCriteriaExpanded] = useState(true);
  const [isDiscoveryInsightsExpanded, setIsDiscoveryInsightsExpanded] = useState(true);

  const renderMinimizeBtn = (expanded: boolean, onToggle: () => void) => (
    <TouchableOpacity
      style={[
        styles.minimizeBtn,
        expanded ? styles.minimizeBtnActive : styles.minimizeBtnInactive,
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityLabel={expanded ? 'Minimize section' : 'Expand section'}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: expanded ? '-90deg' : '90deg' }],
        }}
      >
        <ChevronRight size={16} color={expanded ? '#0F172A' : '#64748B'} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );

  // Handle Photo Upload
  const handlePhotoUploadPrompt = () => {
    Alert.alert(
      'Update Profile Photos',
      'Choose an option to add photos to your Margam profile:',
      [
        {
          text: 'Choose from Photo Library',
          onPress: () => {
            const newPhoto =
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
            setPhotos((prev) => [...prev, newPhoto]);
            Alert.alert('Photo Added', 'New profile photo successfully uploaded to your gallery.');
          },
        },
        {
          text: 'Take New Photo',
          onPress: () => {
            Alert.alert('Camera Ready', 'Camera captured new portrait.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Bar: Margam Logo, Brand Text, Bell with Dot, Settings Cog */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <MargamLogoNew size={44} />
          <View style={styles.brandTextCol}>
            <Text style={styles.brandTitle}>Margam</Text>
            <Text style={styles.brandTagline}>Your Match. Your Margam.</Text>
          </View>
        </View>

        <View style={styles.headerActionsRow}>
          {/* Notification Bell with red unread dot */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setNotificationsModalVisible(true)}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Bell size={20} color="#1E293B" />
            {unreadCount > 0 && <View style={styles.unreadBadgeDot} />}
          </TouchableOpacity>

          {/* Settings Cog Button */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setSettingsModalVisible(true)}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Settings size={20} color="#1E293B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Profile Card: Circular Avatar + Name + Edit Profile + Stats Row */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            {/* Avatar with Camera Overlay Button */}
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: photos[0] || avatarUrl }} style={styles.avatarImage} />
              <TouchableOpacity
                style={styles.cameraOverlayBtn}
                onPress={handlePhotoUploadPrompt}
                activeOpacity={0.85}
              >
                <Camera size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Name, Age, Location Info */}
            <View style={styles.profileInfoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{profileData.fullName}</Text>
                <CheckCircle size={18} color="#059669" fill="#059669" style={{ marginLeft: 6 }} />
              </View>

              <Text style={styles.ageGenderText}>
                {profileData.age} years • {profileData.gender}
              </Text>

              <View style={styles.locationRow}>
                <MapPin size={13} color="#64748B" style={{ marginRight: 4 }} />
                <Text style={styles.locationText}>{profileData.location}</Text>
              </View>
            </View>

            {/* Edit Profile Pill Button */}
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => setEditProfileVisible(true)}
              activeOpacity={0.85}
            >
              <Heart size={13} color="#E11D48" fill="#E11D48" style={{ marginRight: 4 }} />
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Strength & Verification Status Row */}
          <View style={styles.strengthRow}>
            {/* Profile Strength Bar */}
            <View style={styles.strengthCol}>
              <Text style={styles.strengthLabel}>Profile Strength</Text>
              <View style={styles.strengthBarContainer}>
                <View style={[styles.strengthBarFill, { width: '86%' }]} />
              </View>
            </View>
            <Text style={styles.strengthPct}>86%</Text>

            {/* Verified Badge */}
            <View style={styles.verifiedBadge}>
              <CheckCircle size={13} color="#059669" fill="#059669" style={{ marginRight: 4 }} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>

            {/* Active Status Badge */}
            <View style={styles.activeBadge}>
              <View style={styles.activeGreenDot} />
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>
        </View>

        {/* 3. Upgrade to Premium Banner */}
        <View style={styles.premiumBanner}>
          <View style={styles.crownCircle}>
            <Crown size={22} color="#F59E0B" fill="#F59E0B" />
          </View>

          <View style={styles.premiumTextCol}>
            <Text style={styles.premiumTitle}>
              Upgrade <Text style={styles.premiumTitleAccent}>to Premium</Text>
            </Text>
            <Text style={styles.premiumSubtitle}>
              Unlock advanced filters, route matching and more.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.viewPlansBtn}
            onPress={() => setPremiumModalVisible(true)}
            activeOpacity={0.85}
          >
            <Heart size={12} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.viewPlansBtnText}>View Plans 💖</Text>
            <ChevronRight size={14} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        {/* 4. 4-Segmented Control (Horizontal Tabs) */}
        <View style={styles.segmentedControl}>
          {/* Tab 1: My Profile */}
          <TouchableOpacity
            style={[styles.segmentTab, activeSubTab === 'profile' && styles.segmentTabActive]}
            onPress={() => setActiveSubTab('profile')}
            activeOpacity={0.8}
          >
            <User
              size={15}
              color={activeSubTab === 'profile' ? '#E11D48' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.segmentTabText,
                activeSubTab === 'profile' && styles.segmentTabTextActive,
              ]}
            >
              My Profile
            </Text>
          </TouchableOpacity>

          {/* Tab 2: Preferences */}
          <TouchableOpacity
            style={[styles.segmentTab, activeSubTab === 'preferences' && styles.segmentTabActive]}
            onPress={() => setActiveSubTab('preferences')}
            activeOpacity={0.8}
          >
            <Sliders
              size={15}
              color={activeSubTab === 'preferences' ? '#E11D48' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.segmentTabText,
                activeSubTab === 'preferences' && styles.segmentTabTextActive,
              ]}
            >
              Preferences
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Privacy */}
          <TouchableOpacity
            style={[styles.segmentTab, activeSubTab === 'privacy' && styles.segmentTabActive]}
            onPress={() => setActiveSubTab('privacy')}
            activeOpacity={0.8}
          >
            <Lock
              size={15}
              color={activeSubTab === 'privacy' ? '#E11D48' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.segmentTabText,
                activeSubTab === 'privacy' && styles.segmentTabTextActive,
              ]}
            >
              Privacy
            </Text>
          </TouchableOpacity>

          {/* Tab 4: Activity */}
          <TouchableOpacity
            style={[styles.segmentTab, activeSubTab === 'activity' && styles.segmentTabActive]}
            onPress={() => setActiveSubTab('activity')}
            activeOpacity={0.8}
          >
            <BarChart2
              size={15}
              color={activeSubTab === 'activity' ? '#E11D48' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.segmentTabText,
                activeSubTab === 'activity' && styles.segmentTabTextActive,
              ]}
            >
              Activity
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================================= */}
        {/* TAB 1: MY PROFILE (Exact UI from Screenshot)                               */}
        {/* ========================================================================= */}
        {activeSubTab === 'profile' && (
          <View style={styles.subTabContent}>
            {/* Profile Depth & Completeness Progress */}
            <View style={styles.completenessCard}>
              <View style={styles.completenessTopRow}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.completenessTitle}>Profile Depth: {completeness.percentage}%</Text>
                  <Text style={styles.completenessSub}>
                    {completeness.recommendations[0] || 'Complete profiles receive 3x more meaningful connections'}
                  </Text>
                </View>
                <View style={styles.completenessPercentBadge}>
                  <Sparkles size={13} color="#E11D48" style={{ marginRight: 4 }} />
                  <Text style={styles.completenessPercentText}>{completeness.percentage}%</Text>
                </View>
              </View>
              <View style={styles.completenessTrack}>
                <View style={[styles.completenessFill, { width: `${completeness.percentage}%` }]} />
              </View>
            </View>

            {/* Progressive 8-Step Profile Creation Wizard Banner */}
            <View style={styles.wizardPromoCard}>
              <View style={styles.wizardPromoHeader}>
                <View style={styles.wizardPromoBadge}>
                  <Sparkles size={12} color="#EF4444" style={{ marginRight: 4 }} />
                  <Text style={styles.wizardPromoBadgeText}>Guided 8-Step Flow</Text>
                </View>
                <Text style={styles.wizardPromoTitle}>Profile Creation Wizard 💖</Text>
                <Text style={styles.wizardPromoSub}>
                  Collect your authentic details progressively across 8 focused steps instead of a giant form.
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <MargamButton
                  title="Launch Profile Wizard 💖"
                  onPress={() => setWizardModalVisible(true)}
                  size="md"
                  showHeart={true}
                  arrowRight={true}
                />
              </View>
            </View>

            {/* Quick Privacy Preset Selector */}
            <View style={styles.presetCard}>
              <View style={styles.presetHeader}>
                <Lock size={14} color="#E11D48" style={{ marginRight: 6 }} />
                <Text style={styles.presetTitle}>Quick Privacy Preset</Text>
              </View>
              <View style={styles.presetButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.presetBtn,
                    masterProfile.privacyPreset === 'maximum_privacy' && styles.presetBtnActive,
                  ]}
                  onPress={() => handleSelectPrivacyPreset('maximum_privacy')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.presetBtnText,
                      masterProfile.privacyPreset === 'maximum_privacy' && styles.presetBtnTextActive,
                    ]}
                  >
                    Maximum
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.presetBtn,
                    masterProfile.privacyPreset === 'balanced' && styles.presetBtnActive,
                  ]}
                  onPress={() => handleSelectPrivacyPreset('balanced')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.presetBtnText,
                      masterProfile.privacyPreset === 'balanced' && styles.presetBtnTextActive,
                    ]}
                  >
                    Balanced ⭐
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.presetBtn,
                    masterProfile.privacyPreset === 'open' && styles.presetBtnActive,
                  ]}
                  onPress={() => handleSelectPrivacyPreset('open')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.presetBtnText,
                      masterProfile.privacyPreset === 'open' && styles.presetBtnTextActive,
                    ]}
                  >
                    Open
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 1. Profile Preview Section */}
            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeaderRow, !isProfilePreviewExpanded && { marginBottom: 0 }]}>
                <Text style={styles.sectionTitle}>Profile Preview</Text>
                <View style={styles.headerRightControls}>
                  <TouchableOpacity
                    style={styles.viewAsOthersBtn}
                    onPress={() => setViewAsOthersVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Eye size={14} color="#E11D48" style={{ marginRight: 4 }} />
                    <Text style={styles.viewAsOthersText}>View as Others See</Text>
                  </TouchableOpacity>
                  {renderMinimizeBtn(isProfilePreviewExpanded, () =>
                    setIsProfilePreviewExpanded(!isProfilePreviewExpanded)
                  )}
                </View>
              </View>

              {/* Photo Cards Row */}
              {isProfilePreviewExpanded && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.photosScrollContainer}
                >
                  {photos.map((photoUri, index) => (
                    <View key={index} style={styles.photoItemCard}>
                      <Image source={{ uri: photoUri }} style={styles.previewThumb} />
                      {index === 0 && (
                        <View style={styles.mainPhotoBadge}>
                          <Text style={styles.mainPhotoText}>Main Photo</Text>
                        </View>
                      )}
                    </View>
                  ))}

                  {/* 5th Card: Add Photos (Dashed border) */}
                  <TouchableOpacity
                    style={styles.addPhotosCard}
                    onPress={handlePhotoUploadPrompt}
                    activeOpacity={0.75}
                  >
                    <View style={styles.addPlusCircle}>
                      <Plus size={18} color="#64748B" />
                    </View>
                    <Text style={styles.addPhotosText}>Add Photos</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>

            {/* 2. About Me Section */}
            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeaderRow, !isAboutMeExpanded && { marginBottom: 0 }]}>
                <Text style={styles.sectionTitle}>About Me</Text>
                <View style={styles.headerRightControls}>
                  <TouchableOpacity
                    style={styles.pencilBtn}
                    onPress={() => setEditProfileVisible(true)}
                    activeOpacity={0.7}
                  >
                    <Pencil size={15} color="#E11D48" />
                  </TouchableOpacity>
                  {renderMinimizeBtn(isAboutMeExpanded, () =>
                    setIsAboutMeExpanded(!isAboutMeExpanded)
                  )}
                </View>
              </View>

              {isAboutMeExpanded && (
                <>
                  <Text style={styles.bioParagraph}>{profileData.bio}</Text>

                  {/* 4 Info Pills */}
                  <View style={styles.infoPillsWrap}>
                    <View style={styles.infoPill}>
                      <Briefcase size={14} color="#64748B" style={{ marginRight: 6 }} />
                      <Text style={styles.infoPillText}>{profileData.profession}</Text>
                    </View>

                    <View style={styles.infoPill}>
                      <GraduationCap size={14} color="#64748B" style={{ marginRight: 6 }} />
                      <Text style={styles.infoPillText}>{profileData.education}</Text>
                    </View>

                    <View style={styles.infoPill}>
                      <Home size={14} color="#64748B" style={{ marginRight: 6 }} />
                      <Text style={styles.infoPillText}>{profileData.location}</Text>
                    </View>

                    <View style={styles.infoPill}>
                      <Globe size={14} color="#64748B" style={{ marginRight: 6 }} />
                      <Text style={styles.infoPillText}>{profileData.languages}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* 3. Lifestyle Section */}
            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeaderRow, !isLifestyleExpanded && { marginBottom: 0 }]}>
                <Text style={styles.sectionTitle}>Lifestyle</Text>
                <View style={styles.headerRightControls}>
                  <TouchableOpacity
                    style={styles.pencilBtn}
                    onPress={() => setEditingTagSection('lifestyle')}
                    activeOpacity={0.7}
                  >
                    <Pencil size={15} color="#E11D48" />
                  </TouchableOpacity>
                  {renderMinimizeBtn(isLifestyleExpanded, () =>
                    setIsLifestyleExpanded(!isLifestyleExpanded)
                  )}
                </View>
              </View>

              {/* Colored Pills */}
              {isLifestyleExpanded && (
                <View style={styles.tagsWrap}>
                  {lifestyleTags.map((tag) => {
                    let bgColor = '#F8FAFC';
                    let textColor = '#334155';
                    let icon = <Dumbbell size={14} color="#EF4444" style={{ marginRight: 6 }} />;

                    if (tag === 'Fitness') {
                      bgColor = '#FEF2F2';
                      textColor = '#EF4444';
                      icon = <Dumbbell size={14} color="#EF4444" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Travel') {
                      bgColor = '#EFF6FF';
                      textColor = '#2563EB';
                      icon = <Plane size={14} color="#2563EB" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Food Lover') {
                      bgColor = '#FAF5FF';
                      textColor = '#9333EA';
                      icon = <Utensils size={14} color="#9333EA" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Non-smoker') {
                      bgColor = '#F0FDF4';
                      textColor = '#16A34A';
                      icon = <Leaf size={14} color="#16A34A" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Occasional Drinker') {
                      bgColor = '#FAF5FF';
                      textColor = '#7C3AED';
                      icon = <Coffee size={14} color="#7C3AED" style={{ marginRight: 6 }} />;
                    }

                    return (
                      <View key={tag} style={[styles.coloredPill, { backgroundColor: bgColor }]}>
                        {icon}
                        <Text style={[styles.coloredPillText, { color: textColor }]}>{tag}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            {/* 4. Family & Values Section */}
            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeaderRow, !isFamilyExpanded && { marginBottom: 0 }]}>
                <Text style={styles.sectionTitle}>Family & Values</Text>
                <View style={styles.headerRightControls}>
                  <TouchableOpacity
                    style={styles.pencilBtn}
                    onPress={() => setEditingTagSection('family')}
                    activeOpacity={0.7}
                  >
                    <Pencil size={15} color="#E11D48" />
                  </TouchableOpacity>
                  {renderMinimizeBtn(isFamilyExpanded, () =>
                    setIsFamilyExpanded(!isFamilyExpanded)
                  )}
                </View>
              </View>

              {/* Colored Pills */}
              {isFamilyExpanded && (
                <View style={styles.tagsWrap}>
                  {familyTags.map((tag) => {
                    let bgColor = '#FFF7ED';
                    let textColor = '#EA580C';
                    let icon = <Users size={14} color="#EA580C" style={{ marginRight: 6 }} />;

                    if (tag === 'Joint Family') {
                      bgColor = '#FFF7ED';
                      textColor = '#EA580C';
                      icon = <Users size={14} color="#EA580C" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Family Oriented') {
                      bgColor = '#FEF2F2';
                      textColor = '#E11D48';
                      icon = <Heart size={14} color="#E11D48" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Open to Relocation') {
                      bgColor = '#ECFDF5';
                      textColor = '#059669';
                      icon = <Home size={14} color="#059669" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Prefer Children') {
                      bgColor = '#F0FDFA';
                      textColor = '#0D9488';
                      icon = <Baby size={14} color="#0D9488" style={{ marginRight: 6 }} />;
                    }

                    return (
                      <View key={tag} style={[styles.coloredPill, { backgroundColor: bgColor }]}>
                        {icon}
                        <Text style={[styles.coloredPillText, { color: textColor }]}>{tag}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            {/* 5. Interests Section */}
            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeaderRow, !isInterestsExpanded && { marginBottom: 0 }]}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <View style={styles.headerRightControls}>
                  <TouchableOpacity
                    style={styles.pencilBtn}
                    onPress={() => setEditingTagSection('interests')}
                    activeOpacity={0.7}
                  >
                    <Pencil size={15} color="#E11D48" />
                  </TouchableOpacity>
                  {renderMinimizeBtn(isInterestsExpanded, () =>
                    setIsInterestsExpanded(!isInterestsExpanded)
                  )}
                </View>
              </View>

              {/* Colored Pills */}
              {isInterestsExpanded && (
                <View style={styles.tagsWrap}>
                  {interestTags.map((tag) => {
                    let bgColor = '#FAF5FF';
                    let textColor = '#7C3AED';
                    let icon = <Camera size={14} color="#7C3AED" style={{ marginRight: 6 }} />;

                    if (tag === 'Photography') {
                      bgColor = '#FAF5FF';
                      textColor = '#7C3AED';
                      icon = <Camera size={14} color="#7C3AED" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Nature') {
                      bgColor = '#F0F9FF';
                      textColor = '#0284C7';
                      icon = <Mountain size={14} color="#0284C7" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Music') {
                      bgColor = '#EEF2FF';
                      textColor = '#4F46E5';
                      icon = <Music size={14} color="#4F46E5" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Technology') {
                      bgColor = '#F8FAFC';
                      textColor = '#475569';
                      icon = <Laptop size={14} color="#475569" style={{ marginRight: 6 }} />;
                    } else if (tag === 'Gaming') {
                      bgColor = '#F5F3FF';
                      textColor = '#6D28D9';
                      icon = <Gamepad2 size={14} color="#6D28D9" style={{ marginRight: 6 }} />;
                    }

                    return (
                      <View key={tag} style={[styles.coloredPill, { backgroundColor: bgColor }]}>
                        {icon}
                        <Text style={[styles.coloredPillText, { color: textColor }]}>{tag}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            {/* 5. 17 Structured Matrimonial Biodata Sections */}
            <View style={{ marginTop: 14 }}>
              <Text style={styles.sectionDividerTitle}>Comprehensive Matrimonial Biodata</Text>
              <Text style={styles.sectionDividerSub}>
                17 structured sections with field-level privacy controls & progressive disclosure
              </Text>
              <AdvancedProfileSections
                isOwner={true}
                ownerProfile={masterProfile}
                onOpenAiStudio={() => setAiStudioVisible(true)}
                onEditSection={(sectionKey) => {
                  if (sectionKey === 'aboutMe') {
                    setAiStudioVisible(true);
                  } else if (sectionKey === 'lifestyle') {
                    setEditingTagSection('lifestyle');
                  } else if (sectionKey === 'family' || sectionKey === 'familyOverview') {
                    setEditingTagSection('family');
                  } else if (sectionKey === 'interests') {
                    setEditingTagSection('interests');
                  } else if (sectionKey === 'partnerPreferences') {
                    setActiveSubTab('preferences');
                  } else if (sectionKey === 'privacySettings') {
                    setActiveSubTab('privacy');
                  } else {
                    setEditProfileVisible(true);
                  }
                }}
              />
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PREFERENCES (Partner Search Preferences)                           */}
        {/* ========================================================================= */}
        {activeSubTab === 'preferences' && (
          <View style={styles.subTabContent}>
            <PartnerPreferencesEditor
              masterProfile={masterProfile}
              onSavePreferences={(updatedPrefs) => {
                setMasterProfile((prev) => ({ ...prev, partnerPreferences: updatedPrefs }));
              }}
            />
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PRIVACY (Complete Privacy & Discovery Dashboard)                   */}
        {/* ========================================================================= */}
        {activeSubTab === 'privacy' && (
          <View style={styles.subTabContent}>
            {/* Dedicated Privacy & Visibility Center Launch Card */}
            {onOpenPrivacyCenter && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FAF5FF',
                  borderRadius: 18,
                  borderWidth: 1.5,
                  borderColor: '#E9D5FF',
                  padding: 16,
                  marginBottom: 16,
                  shadowColor: '#A855F7',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 2,
                }}
                activeOpacity={0.85}
                onPress={onOpenPrivacyCenter}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: '#A855F7',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 14,
                  }}
                >
                  <Shield size={24} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 2 }}>
                    Privacy &amp; Visibility Center
                  </Text>
                  <Text style={{ fontSize: 12.5, color: '#7E22CE', lineHeight: 17 }}>
                    Manage default profile visibility, photos, personal details, location, per-request sharing &amp; granted access.
                  </Text>
                </View>
                <ChevronRight size={20} color="#A855F7" />
              </TouchableOpacity>
            )}

            <PrivacyDashboard
              mapVisibility={mapVisibility}
              onChangeMapVisibility={onChangeMapVisibility}
              locationMode={locationMode}
              onChangeLocationMode={onChangeLocationMode}
              availability={availability}
              onChangeAvailability={onChangeAvailability}
              fieldPerms={fieldPerms}
              onChangeFieldPerm={onChangeFieldPerm}
              masterProfile={masterProfile}
              onSelectPrivacyPreset={handleSelectPrivacyPreset}
              onOpenViewAsOthers={() => setViewAsOthersVisible(true)}
            />
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ACTIVITY (Profile Analytics & Stats)                               */}
        {/* ========================================================================= */}
        {activeSubTab === 'activity' && (
          <View style={styles.subTabContent}>
            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeaderRow, !isDiscoveryInsightsExpanded && { marginBottom: 0 }]}>
                <Text style={styles.sectionTitle}>Discovery Insights</Text>
                <View style={styles.headerRightControls}>
                  <View style={styles.verifiedBadge}>
                    <TrendingUp size={13} color="#059669" style={{ marginRight: 4 }} />
                    <Text style={styles.verifiedText}>+18% this week</Text>
                  </View>
                  {renderMinimizeBtn(isDiscoveryInsightsExpanded, () =>
                    setIsDiscoveryInsightsExpanded(!isDiscoveryInsightsExpanded)
                  )}
                </View>
              </View>

              {isDiscoveryInsightsExpanded && (
                <>
                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Text style={styles.statNum}>142</Text>
                      <Text style={styles.statLabel}>Anonymous Map Views</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.statBox}
                      activeOpacity={0.8}
                      onPress={onNavigateToRequests}
                    >
                      <Text style={styles.statNum}>18</Text>
                      <Text style={styles.statLabel}>Requests Received</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.statBox}
                      activeOpacity={0.8}
                      onPress={onNavigateToMap}
                    >
                      <Text style={styles.statNum}>6</Text>
                      <Text style={styles.statLabel}>Route Corridor Matches</Text>
                    </TouchableOpacity>

                    <View style={styles.statBox}>
                      <Text style={styles.statNum}>84%</Text>
                      <Text style={styles.statLabel}>Match Compatibility</Text>
                    </View>
                  </View>

                  <View style={{ marginTop: 16 }}>
                    <Text style={styles.prefLabel}>Recent Interactions</Text>
                    <TouchableOpacity
                      style={styles.activityItem}
                      activeOpacity={0.8}
                      onPress={() => onOpenConversation?.('thread-ananya', 'Ananya')}
                    >
                      <View style={styles.activityDot} />
                      <Text style={styles.activityText}>Ananya accepted your introduction request</Text>
                      <Text style={styles.activityTime}>2h ago</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.activityItem}
                      activeOpacity={0.8}
                      onPress={onNavigateToMap}
                    >
                      <View style={styles.activityDot} />
                      <Text style={styles.activityText}>Compatible match discovered near Chalakudy corridor</Text>
                      <Text style={styles.activityTime}>5h ago</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.activityItem}
                      activeOpacity={0.8}
                      onPress={() =>
                        Alert.alert(
                          'Verification Approved',
                          'Your Government ID verification was reviewed and approved by the Margam Trust Team.'
                        )
                      }
                    >
                      <View style={styles.activityDot} />
                      <Text style={styles.activityText}>Govt. ID Verification badge approved by Trust Team</Text>
                      <Text style={styles.activityTime}>1d ago</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {/* Replay Cinematic Launch Screen Button */}
        {onReplayLaunchAnimation && (
          <View style={{ marginTop: 12, marginBottom: 8 }}>
            <MargamButton
              title="Watch App Launch Animation 💖"
              onPress={onReplayLaunchAnimation}
              size="md"
              showHeart={true}
              heartPosition="left"
              arrowRight={true}
            />
          </View>
        )}

        {/* Quick Auth Testing & Sign Out Button */}
        {onLogout && (
          <View style={{ marginTop: 6, marginBottom: 8 }}>
            <MargamButton
              title="Sign Out / Switch Account"
              onPress={onLogout}
              size="md"
              showHeart={true}
              heartPosition="left"
              arrowRight={true}
            />
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ========================================================================= */}
      {/* MODALS                                                                     */}
      {/* ========================================================================= */}

      {/* 1. Edit Profile Modal */}
      <EditProfileModal
        visible={editProfileVisible}
        initialData={profileData}
        onClose={() => setEditProfileVisible(false)}
        onSave={(updated) => {
          setProfileData(updated);
          Alert.alert('Profile Updated', 'Your profile details have been successfully saved.');
        }}
      />

      {/* 2. Premium Plans Modal */}
      <PremiumPlansModal
        visible={premiumModalVisible}
        onClose={() => setPremiumModalVisible(false)}
        onSelectPlan={(planId) => {
          setPremiumModalVisible(false);
        }}
      />

      {/* 3. View As Others See Modal (Multi-Stage Live Simulator) */}
      <PreviewWhatOthersSeeModal
        visible={viewAsOthersVisible}
        onClose={() => setViewAsOthersVisible(false)}
        userId="usr-current-sumod"
      />

      {/* AI About-Me Studio Modal */}
      <AiAboutMeModal
        visible={aiStudioVisible}
        onClose={() => setAiStudioVisible(false)}
        userId="usr-current-sumod"
        currentBio={masterProfile.aboutMe.bio}
        onBioSaved={(newBio) => {
          const updated = updateMasterProfile('usr-current-sumod', {
            aboutMe: { ...masterProfile.aboutMe, bio: newBio },
          });
          setMasterProfile({ ...updated });
          setProfileData((prev) => ({ ...prev, bio: newBio }));
          Alert.alert('Bio Updated', 'Your authentic personal statement has been updated.');
        }}
      />

      {/* 4. Settings & Account Modal */}
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        onOpenPrivacyTab={() => setActiveSubTab('privacy')}
        onSignOut={onLogout}
      />

      {/* 5. Notifications Modal */}
      <NotificationsModal
        visible={notificationsModalVisible}
        onClose={() => setNotificationsModalVisible(false)}
      />

      {/* 6. Edit Section Tags Modal (Lifestyle, Family, Interests) */}
      {editingTagSection && (
        <EditTagsModal
          visible={!!editingTagSection}
          title={
            editingTagSection === 'lifestyle'
              ? 'Edit Lifestyle'
              : editingTagSection === 'family'
              ? 'Edit Family & Values'
              : 'Edit Interests'
          }
          subtitle="Select tags that best reflect you"
          availableTags={
            editingTagSection === 'lifestyle'
              ? [
                  'Fitness',
                  'Travel',
                  'Food Lover',
                  'Non-smoker',
                  'Occasional Drinker',
                  'Vegetarian',
                  'Early Riser',
                  'Pet Lover',
                  'Yoga',
                  'Active Runner',
                ]
              : editingTagSection === 'family'
              ? [
                  'Joint Family',
                  'Family Oriented',
                  'Open to Relocation',
                  'Prefer Children',
                  'Nuclear Family',
                  'Progressive Values',
                  'Spiritual',
                  'Culturally Rooted',
                ]
              : [
                  'Photography',
                  'Nature',
                  'Music',
                  'Technology',
                  'Gaming',
                  'Road Trips',
                  'Reading',
                  'Art & Architecture',
                  'Coffee Brewing',
                  'Cinema',
                ]
          }
          selectedTags={
            editingTagSection === 'lifestyle'
              ? lifestyleTags
              : editingTagSection === 'family'
              ? familyTags
              : interestTags
          }
          onClose={() => setEditingTagSection(null)}
          onSave={(updatedTags) => {
            if (editingTagSection === 'lifestyle') setLifestyleTags(updatedTags);
            else if (editingTagSection === 'family') setFamilyTags(updatedTags);
            else if (editingTagSection === 'interests') setInterestTags(updatedTags);
          }}
        />
      )}

      {/* 7. Progressive Profile Creation Wizard Modal */}
      <Modal
        visible={wizardModalVisible}
        animationType="slide"
        onRequestClose={() => setWizardModalVisible(false)}
      >
        <ProfileCreationWizard
          onComplete={(wizardData) => {
            setWizardModalVisible(false);
            const updated = getMasterProfile('usr-current-sumod');
            setMasterProfile({ ...updated });
            setProfileData((prev) => ({
              ...prev,
              fullName: wizardData.firstName || prev.fullName,
              age: wizardData.age || prev.age,
              gender: (wizardData.gender as any) || prev.gender,
              location: wizardData.location || prev.location,
              profession: wizardData.profession || prev.profession,
              education: wizardData.educationLevel || prev.education,
              bio: wizardData.bio || prev.bio,
            }));
            Alert.alert('Profile Complete! 🎉', 'Your 8-step progressive profile has been saved.');
          }}
          onExit={() => setWizardModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  completenessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completenessTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  completenessTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  completenessSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  completenessPercentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  completenessPercentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E11D48',
  },
  completenessTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  completenessFill: {
    height: '100%',
    backgroundColor: '#E11D48',
    borderRadius: 3,
  },
  wizardPromoCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  wizardPromoHeader: {
    marginBottom: 4,
  },
  wizardPromoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFE4E6',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  wizardPromoBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wizardPromoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 2,
  },
  wizardPromoSub: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 16,
  },
  presetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  presetTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  presetButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetBtnActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#E11D48',
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  presetBtnTextActive: {
    color: '#E11D48',
    fontWeight: '700',
  },
  sectionDividerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  sectionDividerSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 4,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTextCol: {
    marginLeft: 10,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  brandTagline: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  cameraOverlayBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  ageGenderText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  editProfileBtnText: {
    color: '#E11D48',
    fontSize: 11,
    fontWeight: '700',
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  strengthCol: {
    flex: 1,
  },
  strengthLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  strengthBarContainer: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    backgroundColor: '#E11D48',
    borderRadius: 3,
  },
  strengthPct: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
    marginRight: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: 12,
    marginBottom: 14,
  },
  crownCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  premiumTextCol: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  premiumTitleAccent: {
    color: '#7C3AED',
  },
  premiumSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  viewPlansBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  viewPlansBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 14,
  },
  segmentTabActive: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  segmentTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTabTextActive: {
    color: '#E11D48',
    fontWeight: '800',
  },
  subTabContent: {
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  minimizeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  minimizeBtnActive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  minimizeBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAsOthersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  viewAsOthersText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48',
  },
  pencilBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photosScrollContainer: {
    gap: 10,
    paddingVertical: 4,
  },
  photoItemCard: {
    width: 90,
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  previewThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainPhotoBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mainPhotoText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addPhotosCard: {
    width: 90,
    height: 120,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  addPlusCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotosText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  bioParagraph: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  infoPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  infoPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  coloredPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  coloredPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subTextMuted: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  prefGroup: {
    marginBottom: 14,
  },
  prefLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  rangeButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  rangeBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rangeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  prefInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  prefInputVal: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  savePrefsBtn: {
    backgroundColor: '#EF4444',
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  savePrefsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  statBox: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  activityText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
  },
  activityTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
