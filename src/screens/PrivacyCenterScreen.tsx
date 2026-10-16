// MARGAM — Privacy & Visibility Center Screen
// Dedicated hub where users control profile visibility, photos, personal details,
// family/religion/horoscope permissions, per-request sharing, location discovery,
// live preview as approved vs other users, granted access management, and privacy templates.
// Matches the exact 10-screen design architecture word-for-word.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  Camera,
  User,
  MapPin,
  Send,
  Users,
  Sliders,
  Globe,
  Lock,
  Check,
  Plus,
  X,
  Briefcase,
  GraduationCap,
  Home,
  Heart,
  Sparkles,
  Compass,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react-native';
import {
  privacyCenterService,
  PrivacyCenterState,
  DefaultProfileVisibility,
  FieldVisibilityOption,
  PersonalDetailsVisibility,
  PrivacyTemplateKey,
  GrantedAccessUser,
} from '../services/privacyCenterService';

export type PrivacyViewKey =
  | 'hub'
  | 'profile_visibility'
  | 'photos_media'
  | 'personal_details'
  | 'location_discovery'
  | 'request_sharing'
  | 'granted_access'
  | 'preview_profile'
  | 'privacy_templates';

interface PrivacyCenterScreenProps {
  onBack: () => void;
  initialView?: PrivacyViewKey;
}

export const PrivacyCenterScreen: React.FC<PrivacyCenterScreenProps> = ({
  onBack,
  initialView = 'hub',
}) => {
  const [currentView, setCurrentView] = useState<PrivacyViewKey>(initialView);
  const [privacyState, setPrivacyState] = useState<PrivacyCenterState>(() =>
    privacyCenterService.getState()
  );

  // Subscribed live synchronization
  useEffect(() => {
    const unsub = privacyCenterService.subscribe((newState) => {
      setPrivacyState(newState);
    });
    return unsub;
  }, []);

  // Modal States
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [previewSegment, setPreviewSegment] = useState<'approved' | 'others'>('approved');
  const [grantedAccessFilter, setGrantedAccessFilter] = useState<'approved' | 'pending' | 'revoked'>('approved');
  const [selectedUserAction, setSelectedUserAction] = useState<GrantedAccessUser | null>(null);
  const [fieldPickerModal, setFieldPickerModal] = useState<{
    visible: boolean;
    fieldKey?: keyof PersonalDetailsVisibility;
    fieldLabel?: string;
  }>({ visible: false });

  // Handle Hardware / Back Button Navigation
  const handleBack = () => {
    if (currentView === 'hub') {
      onBack();
    } else {
      setCurrentView('hub');
    }
  };

  // Trigger Updated Success Dialog
  const triggerSuccessModal = () => {
    setSuccessModalVisible(true);
  };

  // =========================================================================
  // VIEW 1: HUB (Main Menu Navigation Screen)
  // =========================================================================
  const renderHub = () => (
    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Top Header Graphic Badge */}
      <View style={styles.hubHeaderContainer}>
        <View style={styles.shieldBadgeGradient}>
          <Shield size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.hubTitle}>Privacy &amp; Visibility Center</Text>
        <Text style={styles.hubTagline}>You're in control of what you share.</Text>
        <Text style={styles.hubDescription}>
          Manage your profile visibility, photos, personal details and location. Share only with
          people you trust.
        </Text>
      </View>

      {/* Menu Navigation Items */}
      <View style={styles.menuContainer}>
        {/* 1. Profile Visibility */}
        <TouchableOpacity
          style={styles.menuItemRow}
          activeOpacity={0.7}
          onPress={() => setCurrentView('profile_visibility')}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: '#E0F2FE' }]}>
            <Eye size={20} color="#0284C7" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>Profile Visibility</Text>
            <Text style={styles.menuItemSub}>Control who can see your profile</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* 2. Photos & Media */}
        <TouchableOpacity
          style={styles.menuItemRow}
          activeOpacity={0.7}
          onPress={() => setCurrentView('photos_media')}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: '#FCE7F3' }]}>
            <Camera size={20} color="#DB2777" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>Photos &amp; Media</Text>
            <Text style={styles.menuItemSub}>Manage your photos and albums</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* 3. Personal Details */}
        <TouchableOpacity
          style={styles.menuItemRow}
          activeOpacity={0.7}
          onPress={() => setCurrentView('personal_details')}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: '#FFE4E6' }]}>
            <User size={20} color="#E11D48" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>Personal Details</Text>
            <Text style={styles.menuItemSub}>Education, career, family, religion etc.</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* 4. Location & Discovery */}
        <TouchableOpacity
          style={styles.menuItemRow}
          activeOpacity={0.7}
          onPress={() => setCurrentView('location_discovery')}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: '#D1FAE5' }]}>
            <MapPin size={20} color="#059669" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>Location &amp; Discovery</Text>
            <Text style={styles.menuItemSub}>Control how you appear on map and in search</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* 5. Request Sharing Settings */}
        <TouchableOpacity
          style={styles.menuItemRow}
          activeOpacity={0.7}
          onPress={() => setCurrentView('request_sharing')}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: '#F3E8FF' }]}>
            <Send size={20} color="#9333EA" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>Request Sharing Settings</Text>
            <Text style={styles.menuItemSub}>Choose what to share per request</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* 6. Granted Access */}
        <TouchableOpacity
          style={styles.menuItemRow}
          activeOpacity={0.7}
          onPress={() => setCurrentView('granted_access')}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: '#DBEAFE' }]}>
            <Users size={20} color="#2563EB" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>Granted Access</Text>
            <Text style={styles.menuItemSub}>People who can see your full/partial profile</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* 7. Privacy Templates */}
        <TouchableOpacity
          style={[styles.menuItemRow, { borderBottomWidth: 0 }]}
          activeOpacity={0.7}
          onPress={() => setCurrentView('privacy_templates')}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: '#EDE9FE' }]}>
            <Sliders size={20} color="#6D28D9" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>Privacy Templates</Text>
            <Text style={styles.menuItemSub}>Quick settings for visibility</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );

  // =========================================================================
  // VIEW 2: PROFILE VISIBILITY SCREEN
  // =========================================================================
  const renderProfileVisibility = () => {
    const current = privacyState.profileVisibility;
    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.viewHeadline}>Profile Visibility</Text>
        <Text style={styles.viewSubheadline}>
          Choose who can see your profile and how you appear across Margam.
        </Text>

        {/* Option 1: Private (Recommended) */}
        <TouchableOpacity
          style={[styles.radioCard, current === 'private' && styles.radioCardSelected]}
          activeOpacity={0.8}
          onPress={() => privacyCenterService.setProfileVisibility('private')}
        >
          <View style={[styles.cardIconBox, { backgroundColor: '#FFE4E6' }]}>
            <Lock size={18} color="#E11D48" />
          </View>
          <View style={styles.cardTextCol}>
            <Text style={styles.cardTitle}>Private (Recommended)</Text>
            <Text style={styles.cardDesc}>Only people you approve can see your profile.</Text>
          </View>
          <View style={[styles.radioCircle, current === 'private' && styles.radioCircleSelected]}>
            {current === 'private' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        {/* Option 2: Limited */}
        <TouchableOpacity
          style={[styles.radioCard, current === 'limited' && styles.radioCardSelected]}
          activeOpacity={0.8}
          onPress={() => privacyCenterService.setProfileVisibility('limited')}
        >
          <View style={[styles.cardIconBox, { backgroundColor: '#DBEAFE' }]}>
            <Users size={18} color="#2563EB" />
          </View>
          <View style={styles.cardTextCol}>
            <Text style={styles.cardTitle}>Limited</Text>
            <Text style={styles.cardDesc}>
              Your profile is visible with basic info to matching people.
            </Text>
          </View>
          <View style={[styles.radioCircle, current === 'limited' && styles.radioCircleSelected]}>
            {current === 'limited' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        {/* Option 3: Public */}
        <TouchableOpacity
          style={[styles.radioCard, current === 'public' && styles.radioCardSelected]}
          activeOpacity={0.8}
          onPress={() => privacyCenterService.setProfileVisibility('public')}
        >
          <View style={[styles.cardIconBox, { backgroundColor: '#E0F2FE' }]}>
            <Globe size={18} color="#0284C7" />
          </View>
          <View style={styles.cardTextCol}>
            <Text style={styles.cardTitle}>Public</Text>
            <Text style={styles.cardDesc}>Your profile is visible to everyone on Margam.</Text>
          </View>
          <View style={[styles.radioCircle, current === 'public' && styles.radioCircleSelected]}>
            {current === 'public' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        {/* What others can see box */}
        <View style={styles.disclosureBox}>
          <Text style={styles.disclosureTitle}>
            What others can see ({current === 'private' ? 'in Private mode' : current === 'limited' ? 'in Limited mode' : 'in Public mode'})
          </Text>
          <View style={styles.checkItemRow}>
            <Check size={16} color="#059669" />
            <Text style={styles.checkItemText}>
              {current === 'private' ? 'Profile photo (blurred)' : 'Profile photo (clear)'}
            </Text>
          </View>
          <View style={styles.checkItemRow}>
            <Check size={16} color="#059669" />
            <Text style={styles.checkItemText}>First name and age</Text>
          </View>
          <View style={styles.checkItemRow}>
            <Check size={16} color="#059669" />
            <Text style={styles.checkItemText}>General location (city/area only)</Text>
          </View>
          <View style={styles.checkItemRow}>
            <Check size={16} color="#059669" />
            <Text style={styles.checkItemText}>Profession (if allowed)</Text>
          </View>
          <View style={styles.checkItemRow}>
            <Check size={16} color="#059669" />
            <Text style={styles.checkItemText}>Your Margams (interests)</Text>
          </View>
        </View>

        {/* Preview Your Profile Link Card */}
        <TouchableOpacity
          style={styles.previewActionCard}
          activeOpacity={0.8}
          onPress={() => setCurrentView('preview_profile')}
        >
          <View style={styles.previewIconBox}>
            <Eye size={18} color="#7C3AED" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewActionTitle}>Preview Your Profile</Text>
            <Text style={styles.previewActionSub}>See how others see your profile</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* Save Changes CTA */}
        <TouchableOpacity
          style={styles.gradientButton}
          activeOpacity={0.85}
          onPress={triggerSuccessModal}
        >
          <Text style={styles.gradientButtonText}>Save Changes</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  // =========================================================================
  // VIEW 3: PERSONAL DETAILS SCREEN
  // =========================================================================
  const renderPersonalDetails = () => {
    const details = privacyState.personalDetails;

    const formatOption = (opt: FieldVisibilityOption) => {
      switch (opt) {
        case 'approved_connections_only':
          return 'Visible to approved connections only';
        case 'matching_people':
          return 'Visible to matching people';
        case 'everyone':
          return 'Visible to everyone';
        case 'hidden':
          return 'Hidden';
      }
    };

    const getIconForOption = (opt: FieldVisibilityOption) => {
      switch (opt) {
        case 'approved_connections_only':
          return <Lock size={15} color="#E11D48" />;
        case 'matching_people':
          return <Users size={15} color="#2563EB" />;
        case 'everyone':
          return <Globe size={15} color="#059669" />;
        case 'hidden':
          return <Lock size={15} color="#64748B" />;
      }
    };

    const openFieldPicker = (key: keyof PersonalDetailsVisibility, label: string) => {
      setFieldPickerModal({
        visible: true,
        fieldKey: key,
        fieldLabel: label,
      });
    };

    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.viewHeadline}>Personal Details</Text>
        <Text style={styles.viewSubheadline}>
          Control visibility of each section. You can change this anytime.
        </Text>

        <View style={styles.detailsListCard}>
          {/* 1. Name & Age */}
          <TouchableOpacity
            style={styles.detailRowItem}
            activeOpacity={0.7}
            onPress={() => openFieldPicker('nameAge', 'Name & Age')}
          >
            <View style={[styles.detailIconBox, { backgroundColor: '#FFE4E6' }]}>
              <User size={18} color="#E11D48" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowTitle}>Name &amp; Age</Text>
              <Text style={styles.detailRowDesc}>{formatOption(details.nameAge)}</Text>
            </View>
            <View style={styles.detailStatusCol}>{getIconForOption(details.nameAge)}</View>
          </TouchableOpacity>

          {/* 2. Location */}
          <TouchableOpacity
            style={styles.detailRowItem}
            activeOpacity={0.7}
            onPress={() => openFieldPicker('location', 'Location')}
          >
            <View style={[styles.detailIconBox, { backgroundColor: '#D1FAE5' }]}>
              <MapPin size={18} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowTitle}>Location</Text>
              <Text style={styles.detailRowDesc}>City/area only</Text>
            </View>
            <View style={styles.detailStatusCol}>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          {/* 3. Profession */}
          <TouchableOpacity
            style={styles.detailRowItem}
            activeOpacity={0.7}
            onPress={() => openFieldPicker('profession', 'Profession')}
          >
            <View style={[styles.detailIconBox, { backgroundColor: '#DBEAFE' }]}>
              <Briefcase size={18} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowTitle}>Profession</Text>
              <Text style={styles.detailRowDesc}>{formatOption(details.profession)}</Text>
            </View>
            <View style={styles.detailStatusCol}>{getIconForOption(details.profession)}</View>
          </TouchableOpacity>

          {/* 4. Education */}
          <TouchableOpacity
            style={styles.detailRowItem}
            activeOpacity={0.7}
            onPress={() => openFieldPicker('education', 'Education')}
          >
            <View style={[styles.detailIconBox, { backgroundColor: '#FEF3C7' }]}>
              <GraduationCap size={18} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowTitle}>Education</Text>
              <Text style={styles.detailRowDesc}>{formatOption(details.education)}</Text>
            </View>
            <View style={styles.detailStatusCol}>{getIconForOption(details.education)}</View>
          </TouchableOpacity>

          {/* 5. Family Details */}
          <TouchableOpacity
            style={styles.detailRowItem}
            activeOpacity={0.7}
            onPress={() => openFieldPicker('familyDetails', 'Family Details')}
          >
            <View style={[styles.detailIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Home size={18} color="#DC2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowTitle}>Family Details</Text>
              <Text style={styles.detailRowDesc}>{formatOption(details.familyDetails)}</Text>
            </View>
            <View style={styles.detailStatusCol}>{getIconForOption(details.familyDetails)}</View>
          </TouchableOpacity>

          {/* 6. Religion */}
          <TouchableOpacity
            style={styles.detailRowItem}
            activeOpacity={0.7}
            onPress={() => openFieldPicker('religion', 'Religion')}
          >
            <View style={[styles.detailIconBox, { backgroundColor: '#FCE7F3' }]}>
              <Sparkles size={18} color="#DB2777" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowTitle}>Religion</Text>
              <Text style={styles.detailRowDesc}>{formatOption(details.religion)}</Text>
            </View>
            <View style={styles.detailStatusCol}>{getIconForOption(details.religion)}</View>
          </TouchableOpacity>

          {/* 7. Horoscope */}
          <TouchableOpacity
            style={styles.detailRowItem}
            activeOpacity={0.7}
            onPress={() => openFieldPicker('horoscope', 'Horoscope')}
          >
            <View style={[styles.detailIconBox, { backgroundColor: '#FFE4E6' }]}>
              <Compass size={18} color="#E11D48" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowTitle}>Horoscope</Text>
              <Text style={styles.detailRowDesc}>{formatOption(details.horoscope)}</Text>
            </View>
            <View style={styles.detailStatusCol}>{getIconForOption(details.horoscope)}</View>
          </TouchableOpacity>

          {/* 8. Marital Status */}
          <TouchableOpacity
            style={[styles.detailRowItem, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={() => openFieldPicker('maritalStatus', 'Marital Status')}
          >
            <View style={[styles.detailIconBox, { backgroundColor: '#FFF1F2' }]}>
              <Heart size={18} color="#E11D48" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowTitle}>Marital Status</Text>
              <Text style={styles.detailRowDesc}>{formatOption(details.maritalStatus)}</Text>
            </View>
            <View style={styles.detailStatusCol}>{getIconForOption(details.maritalStatus)}</View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.gradientButton}
          activeOpacity={0.85}
          onPress={triggerSuccessModal}
        >
          <Text style={styles.gradientButtonText}>Save Changes</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  // =========================================================================
  // VIEW 4: PHOTOS & MEDIA SCREEN
  // =========================================================================
  const renderPhotosMedia = () => {
    const photosState = privacyState.photosMedia;
    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.viewHeadline}>Photos &amp; Media</Text>
        <Text style={styles.viewSubheadline}>
          Choose which photos to show and who can see them.
        </Text>

        {/* Notice Card: Your photos are private */}
        <View style={styles.noticePurpleCard}>
          <View style={styles.noticeIconCircle}>
            <Lock size={16} color="#7C3AED" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.noticePurpleTitle}>Your photos are private</Text>
            <Text style={styles.noticePurpleSub}>
              Only people you approve can see your full photos.
            </Text>
          </View>
        </View>

        {/* Profile Photos Grid */}
        <View style={styles.photosSectionHeader}>
          <Text style={styles.sectionHeaderTitle}>Profile Photos</Text>
          <TouchableOpacity onPress={() => Alert.alert('Reorder Photos', 'Drag and drop photos to set your preferred order.')}>
            <Text style={styles.reorderLink}>Reorder</Text>
          </TouchableOpacity>
        </View>

        {/* Top 2 Photo Slots (Main Photo + Add Photo) */}
        <View style={styles.photoSlotsRow}>
          {/* Main Photo */}
          <View style={styles.mainPhotoWrapper}>
            <Image
              source={{ uri: photosState.photos[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500' }}
              style={styles.mainPhotoImg}
            />
            <View style={styles.mainPhotoBadge}>
              <Text style={styles.mainPhotoBadgeText}>Main Photo</Text>
            </View>
            <TouchableOpacity
              style={styles.photoCloseBtn}
              onPress={() => privacyCenterService.removePhoto(photosState.photos[0]?.id)}
            >
              <X size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Add Photo Slot */}
          <TouchableOpacity
            style={styles.addPhotoSlot}
            activeOpacity={0.8}
            onPress={() => {
              privacyCenterService.addPhoto(
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'
              );
              Alert.alert('Photo Added', 'New profile picture added to your private album.');
            }}
          >
            <View style={styles.addPhotoCameraCircle}>
              <Camera size={22} color="#64748B" />
            </View>
            <Text style={styles.addPhotoLabel}>Add Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Lower Thumbnails */}
        <View style={styles.thumbSlotsRow}>
          {photosState.photos.slice(1, 4).map((p, idx) => (
            <View key={p.id} style={styles.thumbWrapper}>
              <Image source={{ uri: p.url }} style={styles.thumbImg} />
              <TouchableOpacity
                style={styles.photoCloseBtn}
                onPress={() => privacyCenterService.removePhoto(p.id)}
              >
                <X size={10} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          {/* Fallback dummy placeholders if fewer than 4 */}
          {Array.from({ length: Math.max(0, 3 - photosState.photos.slice(1, 4).length) }).map((_, i) => (
            <View key={`placeholder-${i}`} style={styles.thumbPlaceholder}>
              <Camera size={16} color="#CBD5E1" />
            </View>
          ))}
        </View>

        {/* Toggle 1: Blur photos for non-approved users */}
        <View style={styles.toggleRowCard}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.toggleTitle}>Blur photos for non-approved users</Text>
            <Text style={styles.toggleSub}>
              Show blurred versions to people who haven't been approved yet.
            </Text>
          </View>
          <Switch
            value={photosState.blurPhotosNonApproved}
            onValueChange={(val) =>
              privacyCenterService.updatePhotosMediaSettings({ blurPhotosNonApproved: val })
            }
            trackColor={{ false: '#E2E8F0', true: '#9333EA' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        {/* Toggle 2: Hide photos in discovery */}
        <View style={styles.toggleRowCard}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.toggleTitle}>Hide photos in discovery</Text>
            <Text style={styles.toggleSub}>
              Your photos will only be visible after you approve a request.
            </Text>
          </View>
          <Switch
            value={photosState.hidePhotosInDiscovery}
            onValueChange={(val) =>
              privacyCenterService.updatePhotosMediaSettings({ hidePhotosInDiscovery: val })
            }
            trackColor={{ false: '#E2E8F0', true: '#9333EA' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        {/* Toggle 3: Allow photo download */}
        <View style={styles.toggleRowCard}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.toggleTitle}>Allow photo download</Text>
            <Text style={styles.toggleSub}>Prevent others from downloading your photos.</Text>
          </View>
          <Switch
            value={photosState.allowPhotoDownload}
            onValueChange={(val) =>
              privacyCenterService.updatePhotosMediaSettings({ allowPhotoDownload: val })
            }
            trackColor={{ false: '#E2E8F0', true: '#9333EA' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        <TouchableOpacity
          style={styles.gradientButton}
          activeOpacity={0.85}
          onPress={triggerSuccessModal}
        >
          <Text style={styles.gradientButtonText}>Save Changes</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  // =========================================================================
  // VIEW 5: LOCATION & DISCOVERY SCREEN
  // =========================================================================
  const renderLocationDiscovery = () => {
    const loc = privacyState.locationDiscovery;
    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.viewHeadline}>Location &amp; Discovery</Text>
        <Text style={styles.viewSubheadline}>Control how your location is used.</Text>

        {/* Top Master Toggle Card */}
        <View style={styles.locationMasterCard}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.locationMasterTitle}>Use my location for better matches</Text>
            <Text style={styles.locationMasterSub}>
              Find people near you, along your route or at your destination.
            </Text>
          </View>
          <Switch
            value={loc.useLocationForMatches}
            onValueChange={(val) =>
              privacyCenterService.updateLocationDiscoverySettings({ useLocationForMatches: val })
            }
            trackColor={{ false: '#E2E8F0', true: '#EC4899' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        {/* Location Visibility Section */}
        <Text style={styles.sectionHeaderTitle}>Location Visibility</Text>

        {/* Option 1: Exact location (not recommended) */}
        <TouchableOpacity
          style={[styles.radioCard, loc.locationVisibility === 'exact' && styles.radioCardSelected]}
          activeOpacity={0.8}
          onPress={() =>
            privacyCenterService.updateLocationDiscoverySettings({ locationVisibility: 'exact' })
          }
        >
          <View style={styles.cardTextCol}>
            <Text style={styles.cardTitle}>Exact location (not recommended)</Text>
            <Text style={styles.cardDesc}>
              Shows your exact location (only to approved connections).
            </Text>
          </View>
          <View style={[styles.radioCircle, loc.locationVisibility === 'exact' && styles.radioCircleSelected]}>
            {loc.locationVisibility === 'exact' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        {/* Option 2: City/Area only (Recommended) */}
        <TouchableOpacity
          style={[styles.radioCard, loc.locationVisibility === 'city_area' && styles.radioCardSelected]}
          activeOpacity={0.8}
          onPress={() =>
            privacyCenterService.updateLocationDiscoverySettings({ locationVisibility: 'city_area' })
          }
        >
          <View style={styles.cardTextCol}>
            <Text style={styles.cardTitle}>City/Area only (Recommended)</Text>
            <Text style={styles.cardDesc}>
              Shows approximate location (e.g., Kochi area).
            </Text>
          </View>
          <View style={[styles.radioCircle, loc.locationVisibility === 'city_area' && styles.radioCircleSelected]}>
            {loc.locationVisibility === 'city_area' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        {/* Option 3: Hide my location */}
        <TouchableOpacity
          style={[styles.radioCard, loc.locationVisibility === 'hidden' && styles.radioCardSelected]}
          activeOpacity={0.8}
          onPress={() =>
            privacyCenterService.updateLocationDiscoverySettings({ locationVisibility: 'hidden' })
          }
        >
          <View style={styles.cardTextCol}>
            <Text style={styles.cardTitle}>Hide my location</Text>
            <Text style={styles.cardDesc}>Don't show location in my profile.</Text>
          </View>
          <View style={[styles.radioCircle, loc.locationVisibility === 'hidden' && styles.radioCircleSelected]}>
            {loc.locationVisibility === 'hidden' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        {/* Map Discovery Section */}
        <Text style={[styles.sectionHeaderTitle, { marginTop: 20 }]}>Map Discovery</Text>

        {/* Toggle 1: Show me on map */}
        <View style={styles.toggleRowCard}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#D1FAE5', marginRight: 12 }]}>
            <MapPin size={18} color="#059669" />
          </View>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.toggleTitle}>Show me on map</Text>
            <Text style={styles.toggleSub}>Appear on the map for people with similar interests.</Text>
          </View>
          <Switch
            value={loc.showOnMap}
            onValueChange={(val) =>
              privacyCenterService.updateLocationDiscoverySettings({ showOnMap: val })
            }
            trackColor={{ false: '#E2E8F0', true: '#EC4899' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        {/* Toggle 2: Show when I'm travelling */}
        <View style={styles.toggleRowCard}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#DBEAFE', marginRight: 12 }]}>
            <Compass size={18} color="#2563EB" />
          </View>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.toggleTitle}>Show when I'm travelling</Text>
            <Text style={styles.toggleSub}>Appear along my travel route (approximate).</Text>
          </View>
          <Switch
            value={loc.showWhenTravelling}
            onValueChange={(val) =>
              privacyCenterService.updateLocationDiscoverySettings({ showWhenTravelling: val })
            }
            trackColor={{ false: '#E2E8F0', true: '#EC4899' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        {/* Toggle 3: Show at destinations */}
        <View style={styles.toggleRowCard}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#FEF3C7', marginRight: 12 }]}>
            <Building size={18} color="#D97706" />
          </View>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.toggleTitle}>Show at destinations</Text>
            <Text style={styles.toggleSub}>Appear in searched destination areas (approximate).</Text>
          </View>
          <Switch
            value={loc.showAtDestinations}
            onValueChange={(val) =>
              privacyCenterService.updateLocationDiscoverySettings({ showAtDestinations: val })
            }
            trackColor={{ false: '#E2E8F0', true: '#EC4899' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        <TouchableOpacity
          style={styles.gradientButton}
          activeOpacity={0.85}
          onPress={triggerSuccessModal}
        >
          <Text style={styles.gradientButtonText}>Save Changes</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  // =========================================================================
  // VIEW 6: REQUEST SHARING SETTINGS SCREEN
  // =========================================================================
  const renderRequestSharing = () => {
    const req = privacyState.requestSharing;
    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.viewHeadline}>Request Sharing Settings</Text>
        <Text style={styles.viewSubheadline}>
          Choose what information to share by default when you send an introduction request.
        </Text>

        <Text style={styles.sectionHeaderTitle}>Default Sharing Level</Text>

        {/* 3 Level Cards in Row */}
        <View style={styles.levelCardsRow}>
          {/* Card 1: Basic */}
          <TouchableOpacity
            style={[styles.levelCard, req.defaultSharingLevel === 'basic' && styles.levelCardSelected]}
            activeOpacity={0.8}
            onPress={() =>
              privacyCenterService.updateRequestSharingSettings({ defaultSharingLevel: 'basic' })
            }
          >
            <View style={styles.levelCardIconCircle}>
              <User size={18} color="#E11D48" />
            </View>
            <Text style={styles.levelCardTitle}>Basic</Text>
            <Text style={styles.levelCardDesc}>Name, age, profession, Margams</Text>
            <View style={[styles.radioCircleSmall, req.defaultSharingLevel === 'basic' && styles.radioCircleSelected]}>
              {req.defaultSharingLevel === 'basic' && <View style={styles.radioDotSmall} />}
            </View>
          </TouchableOpacity>

          {/* Card 2: Extended */}
          <TouchableOpacity
            style={[styles.levelCard, req.defaultSharingLevel === 'extended' && styles.levelCardSelected]}
            activeOpacity={0.8}
            onPress={() =>
              privacyCenterService.updateRequestSharingSettings({ defaultSharingLevel: 'extended' })
            }
          >
            <View style={[styles.levelCardIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Building size={18} color="#2563EB" />
            </View>
            <Text style={styles.levelCardTitle}>Extended</Text>
            <Text style={styles.levelCardDesc}>Basic + education, location, about me</Text>
            <View style={[styles.radioCircleSmall, req.defaultSharingLevel === 'extended' && styles.radioCircleSelected]}>
              {req.defaultSharingLevel === 'extended' && <View style={styles.radioDotSmall} />}
            </View>
          </TouchableOpacity>

          {/* Card 3: Custom */}
          <TouchableOpacity
            style={[styles.levelCard, req.defaultSharingLevel === 'custom' && styles.levelCardSelected]}
            activeOpacity={0.8}
            onPress={() =>
              privacyCenterService.updateRequestSharingSettings({ defaultSharingLevel: 'custom' })
            }
          >
            <View style={[styles.levelCardIconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Sliders size={18} color="#9333EA" />
            </View>
            <Text style={styles.levelCardTitle}>Custom</Text>
            <Text style={styles.levelCardDesc}>Choose manually each time</Text>
            <View style={[styles.radioCircleSmall, req.defaultSharingLevel === 'custom' && styles.radioCircleSelected]}>
              {req.defaultSharingLevel === 'custom' && <View style={styles.radioDotSmall} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Additional Sections to Share */}
        <Text style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>Additional Sections to Share</Text>

        <View style={styles.toggleCardStack}>
          {/* Photos */}
          <View style={styles.toggleInlineRow}>
            <Camera size={18} color="#0284C7" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleInlineTitle}>Photos</Text>
              <Text style={styles.toggleInlineSub}>Share selected photos</Text>
            </View>
            <Switch
              value={req.additionalSections.photos}
              onValueChange={(val) =>
                privacyCenterService.updateRequestSharingSettings({
                  additionalSections: { ...req.additionalSections, photos: val },
                })
              }
              trackColor={{ false: '#E2E8F0', true: '#EC4899' }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

          {/* Education & Career */}
          <View style={styles.toggleInlineRow}>
            <GraduationCap size={18} color="#2563EB" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleInlineTitle}>Education &amp; Career</Text>
            </View>
            <Switch
              value={req.additionalSections.educationCareer}
              onValueChange={(val) =>
                privacyCenterService.updateRequestSharingSettings({
                  additionalSections: { ...req.additionalSections, educationCareer: val },
                })
              }
              trackColor={{ false: '#E2E8F0', true: '#EC4899' }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

          {/* Location (City/Area) */}
          <View style={styles.toggleInlineRow}>
            <MapPin size={18} color="#059669" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleInlineTitle}>Location (City/Area)</Text>
            </View>
            <Switch
              value={req.additionalSections.locationCityArea}
              onValueChange={(val) =>
                privacyCenterService.updateRequestSharingSettings({
                  additionalSections: { ...req.additionalSections, locationCityArea: val },
                })
              }
              trackColor={{ false: '#E2E8F0', true: '#EC4899' }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

          {/* Family Details */}
          <View style={styles.toggleInlineRow}>
            <Home size={18} color="#DC2626" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleInlineTitle}>Family Details</Text>
            </View>
            <Switch
              value={req.additionalSections.familyDetails}
              onValueChange={(val) =>
                privacyCenterService.updateRequestSharingSettings({
                  additionalSections: { ...req.additionalSections, familyDetails: val },
                })
              }
              trackColor={{ false: '#E2E8F0', true: '#EC4899' }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

          {/* Religion & Horoscope */}
          <View style={styles.toggleInlineRow}>
            <Sparkles size={18} color="#DB2777" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleInlineTitle}>Religion &amp; Horoscope</Text>
            </View>
            <Switch
              value={req.additionalSections.religionHoroscope}
              onValueChange={(val) =>
                privacyCenterService.updateRequestSharingSettings({
                  additionalSections: { ...req.additionalSections, religionHoroscope: val },
                })
              }
              trackColor={{ false: '#E2E8F0', true: '#EC4899' }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

          {/* Life Map (Goals) */}
          <View style={[styles.toggleInlineRow, { borderBottomWidth: 0 }]}>
            <Compass size={18} color="#7C3AED" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleInlineTitle}>Life Map (Goals)</Text>
            </View>
            <Switch
              value={req.additionalSections.lifeMapGoals}
              onValueChange={(val) =>
                privacyCenterService.updateRequestSharingSettings({
                  additionalSections: { ...req.additionalSections, lifeMapGoals: val },
                })
              }
              trackColor={{ false: '#E2E8F0', true: '#EC4899' }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.gradientButton}
          activeOpacity={0.85}
          onPress={triggerSuccessModal}
        >
          <Text style={styles.gradientButtonText}>Save as Default</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  // =========================================================================
  // VIEW 7: GRANTED ACCESS SCREEN
  // =========================================================================
  const renderGrantedAccess = () => {
    const list = privacyState.grantedAccess;
    const approvedList = list.filter((u) => u.status === 'approved');
    const pendingList = list.filter((u) => u.status === 'pending');
    const revokedList = list.filter((u) => u.status === 'revoked');

    const activeList =
      grantedAccessFilter === 'approved'
        ? approvedList
        : grantedAccessFilter === 'pending'
        ? pendingList
        : revokedList;

    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.viewHeadline}>Granted Access</Text>
        <Text style={styles.viewSubheadline}>
          People who can see your full or partial profile.
        </Text>

        {/* Filter Tabs */}
        <View style={styles.filterTabsRow}>
          <TouchableOpacity
            style={[styles.filterTabBtn, grantedAccessFilter === 'approved' && styles.filterTabBtnActive]}
            onPress={() => setGrantedAccessFilter('approved')}
          >
            <Text
              style={[
                styles.filterTabBtnText,
                grantedAccessFilter === 'approved' && styles.filterTabBtnTextActive,
              ]}
            >
              Approved ({approvedList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTabBtn, grantedAccessFilter === 'pending' && styles.filterTabBtnActive]}
            onPress={() => setGrantedAccessFilter('pending')}
          >
            <Text
              style={[
                styles.filterTabBtnText,
                grantedAccessFilter === 'pending' && styles.filterTabBtnTextActive,
              ]}
            >
              Pending ({pendingList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTabBtn, grantedAccessFilter === 'revoked' && styles.filterTabBtnActive]}
            onPress={() => setGrantedAccessFilter('revoked')}
          >
            <Text
              style={[
                styles.filterTabBtnText,
                grantedAccessFilter === 'revoked' && styles.filterTabBtnTextActive,
              ]}
            >
              Revoked ({revokedList.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Items List */}
        <View style={styles.usersCardList}>
          {activeList.map((user) => (
            <View key={user.id} style={styles.userItemRow}>
              <Image source={{ uri: user.avatar }} style={styles.userItemAvatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.userItemName}>
                  {user.name}, {user.age}
                </Text>
                <Text style={styles.userItemDate}>{user.dateLabel}</Text>
              </View>

              {user.status === 'approved' && (
                <View
                  style={[
                    styles.accessLevelBadge,
                    {
                      backgroundColor: user.accessLevel === 'full' ? '#DCFCE7' : '#E0F2FE',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.accessLevelBadgeText,
                      { color: user.accessLevel === 'full' ? '#15803D' : '#0284C7' },
                    ]}
                  >
                    {user.accessLevel === 'full' ? 'Full Profile' : 'Partial Profile'}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.moreActionsBtn}
                onPress={() => setSelectedUserAction(user)}
              >
                <MoreVertical size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Recently Removed Access Section (shown on Approved tab) */}
        {grantedAccessFilter === 'approved' && revokedList.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionHeaderTitle}>Recently Removed Access</Text>
            <View style={styles.usersCardList}>
              {revokedList.slice(0, 2).map((user) => (
                <View key={user.id} style={styles.userItemRow}>
                  <Image source={{ uri: user.avatar }} style={styles.userItemAvatar} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.userItemName}>
                      {user.name}, {user.age}
                    </Text>
                    <Text style={styles.userItemDate}>{user.dateLabel}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.moreActionsBtn}
                    onPress={() => setSelectedUserAction(user)}
                  >
                    <MoreVertical size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  // =========================================================================
  // VIEW 8: PREVIEW YOUR PROFILE SCREEN
  // =========================================================================
  const renderPreviewProfile = () => {
    const preview = privacyCenterService.getPreviewData(previewSegment);

    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.viewHeadline}>Preview Your Profile</Text>
        <Text style={styles.viewSubheadline}>
          See how your profile looks to others based on your current privacy settings.
        </Text>

        {/* Segmented Control */}
        <View style={styles.previewSegmentContainer}>
          <TouchableOpacity
            style={[
              styles.previewSegmentBtn,
              previewSegment === 'approved' && styles.previewSegmentBtnActive,
            ]}
            onPress={() => setPreviewSegment('approved')}
          >
            <Text
              style={[
                styles.previewSegmentBtnText,
                previewSegment === 'approved' && styles.previewSegmentBtnTextActive,
              ]}
            >
              To Approved Connections
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.previewSegmentBtn,
              previewSegment === 'others' && styles.previewSegmentBtnActive,
            ]}
            onPress={() => setPreviewSegment('others')}
          >
            <Text
              style={[
                styles.previewSegmentBtnText,
                previewSegment === 'others' && styles.previewSegmentBtnTextActive,
              ]}
            >
              To Others (Not Approved)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card Preview Simulation */}
        <View style={styles.previewCardFrame}>
          {/* Hero Photo Carousel View */}
          <View style={styles.previewHeroPhotoBox}>
            <Image
              source={{ uri: preview.primaryPhoto }}
              style={styles.previewHeroPhoto}
              blurRadius={preview.isPhotoBlurred ? 18 : 0}
            />
            {preview.isPhotoBlurred && (
              <View style={styles.blurOverlayBadge}>
                <Lock size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.blurOverlayText}>Photo Blurred For Privacy</Text>
              </View>
            )}
            <View style={styles.photoCountPill}>
              <Text style={styles.photoCountText}>1/{preview.photosCount}</Text>
            </View>
          </View>

          {/* Profile Details Body */}
          <View style={styles.previewBodyPad}>
            <View style={styles.previewNameRow}>
              <Text style={styles.previewNameText}>
                {preview.name}{preview.age ? `, ${preview.age}` : ''}
              </Text>
              <View style={styles.verifiedDotCircle}>
                <Check size={12} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.previewMetaRow}>
              <Briefcase size={14} color="#64748B" />
              <Text style={styles.previewMetaText}>{preview.profession}</Text>
              <Text style={styles.metaDot}>•</Text>
              <MapPin size={14} color="#64748B" />
              <Text style={styles.previewMetaText}>{preview.location}</Text>
            </View>

            <Text style={styles.previewBioText}>{preview.bio}</Text>

            {/* Margams Chips */}
            <View style={styles.previewChipsRow}>
              {preview.margams.map((m, idx) => (
                <View key={idx} style={styles.previewMargamChip}>
                  <Text style={styles.previewChipEmoji}>{m.emoji}</Text>
                  <Text style={styles.previewChipLabel}>{m.label}</Text>
                </View>
              ))}
            </View>

            {/* Protected Sections Badges */}
            <View style={styles.protectedDetailsBox}>
              <View style={styles.protectedItemRow}>
                <Home size={14} color="#64748B" />
                <Text style={styles.protectedLabel}>Family Details:</Text>
                <Text
                  style={[
                    styles.protectedValue,
                    { color: preview.familyVisible ? '#059669' : '#E11D48' },
                  ]}
                >
                  {preview.familyVisible ? 'Visible (Nuclear family, Thrissur)' : 'Hidden'}
                </Text>
              </View>

              <View style={styles.protectedItemRow}>
                <Sparkles size={14} color="#64748B" />
                <Text style={styles.protectedLabel}>Religion &amp; Community:</Text>
                <Text
                  style={[
                    styles.protectedValue,
                    { color: preview.religionVisible ? '#059669' : '#E11D48' },
                  ]}
                >
                  {preview.religionVisible ? 'Visible (Hindu, Nair)' : 'Visible to approved connections'}
                </Text>
              </View>

              <View style={styles.protectedItemRow}>
                <Compass size={14} color="#64748B" />
                <Text style={styles.protectedLabel}>Horoscope:</Text>
                <Text
                  style={[
                    styles.protectedValue,
                    { color: preview.horoscopeVisible ? '#059669' : '#E11D48' },
                  ]}
                >
                  {preview.horoscopeVisible ? 'Visible (Rohini Nakshatra)' : 'Hidden'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notice Info Pill */}
        <View style={styles.previewNoticePill}>
          <Lock size={15} color="#7C3AED" style={{ marginRight: 8 }} />
          <Text style={styles.previewNoticeText}>{preview.noticeText}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  // =========================================================================
  // VIEW 9: PRIVACY TEMPLATES SCREEN
  // =========================================================================
  const renderPrivacyTemplates = () => {
    const active = privacyState.activeTemplate;

    const handleApply = (key: PrivacyTemplateKey) => {
      privacyCenterService.applyTemplate(key);
      triggerSuccessModal();
    };

    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.viewHeadline}>Privacy Templates</Text>
        <Text style={styles.viewSubheadline}>Quickly apply a recommended visibility setup.</Text>

        {/* Template 1: Standard (Recommended) */}
        <TouchableOpacity
          style={[styles.templateCard, active === 'standard' && styles.templateCardSelected]}
          activeOpacity={0.85}
          onPress={() => privacyCenterService.applyTemplate('standard')}
        >
          <View style={styles.templateCardHeader}>
            <View style={[styles.templateIconBox, { backgroundColor: '#EDE9FE' }]}>
              <ShieldCheck size={20} color="#7C3AED" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.templateTitle}>Standard (Recommended)</Text>
              <Text style={styles.templateDesc}>
                Most users prefer this. Balanced privacy with meaningful matches.
              </Text>
            </View>
            <View style={[styles.radioCircle, active === 'standard' && styles.radioCircleSelected]}>
              {active === 'standard' && <View style={styles.radioDot} />}
            </View>
          </View>

          <View style={styles.templateBulletsList}>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Photos visible to approved connections</Text>
            </View>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Profile visible to matching people</Text>
            </View>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Location as city/area only</Text>
            </View>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Sensitive details hidden</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Template 2: Open to New People */}
        <TouchableOpacity
          style={[styles.templateCard, active === 'open_to_new_people' && styles.templateCardSelected]}
          activeOpacity={0.85}
          onPress={() => privacyCenterService.applyTemplate('open_to_new_people')}
        >
          <View style={styles.templateCardHeader}>
            <View style={[styles.templateIconBox, { backgroundColor: '#E0F2FE' }]}>
              <Users size={20} color="#0284C7" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.templateTitle}>Open to New People</Text>
              <Text style={styles.templateDesc}>More visibility to get faster matches.</Text>
            </View>
            <View
              style={[
                styles.radioCircle,
                active === 'open_to_new_people' && styles.radioCircleSelected,
              ]}
            >
              {active === 'open_to_new_people' && <View style={styles.radioDot} />}
            </View>
          </View>

          <View style={styles.templateBulletsList}>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Profile visible to matching people</Text>
            </View>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Photos visible (blurred for others)</Text>
            </View>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Key details visible</Text>
            </View>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Location as city/area only</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Template 3: Maximum Privacy */}
        <TouchableOpacity
          style={[styles.templateCard, active === 'maximum_privacy' && styles.templateCardSelected]}
          activeOpacity={0.85}
          onPress={() => privacyCenterService.applyTemplate('maximum_privacy')}
        >
          <View style={styles.templateCardHeader}>
            <View style={[styles.templateIconBox, { backgroundColor: '#FFE4E6' }]}>
              <Lock size={20} color="#E11D48" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.templateTitle}>Maximum Privacy</Text>
              <Text style={styles.templateDesc}>
                Stay in full control. Visible only after you approve.
              </Text>
            </View>
            <View
              style={[
                styles.radioCircle,
                active === 'maximum_privacy' && styles.radioCircleSelected,
              ]}
            >
              {active === 'maximum_privacy' && <View style={styles.radioDot} />}
            </View>
          </View>

          <View style={styles.templateBulletsList}>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Profile hidden from discovery</Text>
            </View>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Photos hidden until approval</Text>
            </View>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Only basic info shown after approval</Text>
            </View>
            <View style={styles.bulletRow}>
              <Check size={14} color="#059669" />
              <Text style={styles.bulletText}>Location hidden</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gradientButton}
          activeOpacity={0.85}
          onPress={() => handleApply(active)}
        >
          <Text style={styles.gradientButtonText}>Apply Template</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.safeContainer}>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <ChevronLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        {currentView !== 'hub' && (
          <Text style={styles.topBarTitle}>
            {currentView === 'profile_visibility'
              ? 'Profile Visibility'
              : currentView === 'photos_media'
              ? 'Photos & Media'
              : currentView === 'personal_details'
              ? 'Personal Details'
              : currentView === 'location_discovery'
              ? 'Location & Discovery'
              : currentView === 'request_sharing'
              ? 'Request Sharing Settings'
              : currentView === 'granted_access'
              ? 'Granted Access'
              : currentView === 'preview_profile'
              ? 'Preview Your Profile'
              : 'Privacy Templates'}
          </Text>
        )}
        <View style={{ width: 40 }} />
      </View>

      {/* View Content Renderer */}
      <View style={{ flex: 1 }}>
        {currentView === 'hub' && renderHub()}
        {currentView === 'profile_visibility' && renderProfileVisibility()}
        {currentView === 'photos_media' && renderPhotosMedia()}
        {currentView === 'personal_details' && renderPersonalDetails()}
        {currentView === 'location_discovery' && renderLocationDiscovery()}
        {currentView === 'request_sharing' && renderRequestSharing()}
        {currentView === 'granted_access' && renderGrantedAccess()}
        {currentView === 'preview_profile' && renderPreviewProfile()}
        {currentView === 'privacy_templates' && renderPrivacyTemplates()}
      </View>

      {/* ========================================================================= */}
      {/* CONFIRMATION MODAL: "Privacy Settings Updated!"                           */}
      {/* ========================================================================= */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.successCard}>
            <View style={styles.successCheckCircle}>
              <Check size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Privacy Settings Updated!</Text>
            <Text style={styles.successSub}>
              Your profile visibility and sharing preferences have been saved.
            </Text>

            <View style={styles.successChecklist}>
              <View style={styles.successItemRow}>
                <Check size={16} color="#059669" />
                <Text style={styles.successItemText}>Profile visibility updated</Text>
              </View>
              <View style={styles.successItemRow}>
                <Check size={16} color="#059669" />
                <Text style={styles.successItemText}>Photo settings applied</Text>
              </View>
              <View style={styles.successItemRow}>
                <Check size={16} color="#059669" />
                <Text style={styles.successItemText}>Personal details updated</Text>
              </View>
              <View style={styles.successItemRow}>
                <Check size={16} color="#059669" />
                <Text style={styles.successItemText}>Location preferences saved</Text>
              </View>
              <View style={styles.successItemRow}>
                <Check size={16} color="#059669" />
                <Text style={styles.successItemText}>Request sharing settings applied</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.gradientButton}
              activeOpacity={0.85}
              onPress={() => {
                setSuccessModalVisible(false);
                setCurrentView('hub');
              }}
            >
              <Text style={styles.gradientButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Field Visibility Picker Modal */}
      {fieldPickerModal.visible && fieldPickerModal.fieldKey && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.sheetBackdrop}>
            <View style={styles.bottomSheetCard}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>{fieldPickerModal.fieldLabel} Visibility</Text>
              <Text style={styles.sheetSub}>Choose who is permitted to see this field.</Text>

              {[
                {
                  key: 'approved_connections_only' as FieldVisibilityOption,
                  title: 'Visible to Approved Connections Only',
                  icon: Lock,
                  color: '#E11D48',
                },
                {
                  key: 'matching_people' as FieldVisibilityOption,
                  title: 'Visible to Matching People',
                  icon: Users,
                  color: '#2563EB',
                },
                {
                  key: 'everyone' as FieldVisibilityOption,
                  title: 'Visible to Everyone',
                  icon: Globe,
                  color: '#059669',
                },
                {
                  key: 'hidden' as FieldVisibilityOption,
                  title: 'Hidden (Zero Disclosure)',
                  icon: EyeOff,
                  color: '#64748B',
                },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={styles.sheetOptionRow}
                  onPress={() => {
                    if (fieldPickerModal.fieldKey) {
                      privacyCenterService.updatePersonalDetailField(
                        fieldPickerModal.fieldKey,
                        opt.key
                      );
                    }
                    setFieldPickerModal({ visible: false });
                  }}
                >
                  <View style={[styles.sheetIconBox, { backgroundColor: `${opt.color}15` }]}>
                    <opt.icon size={18} color={opt.color} />
                  </View>
                  <Text style={styles.sheetOptionText}>{opt.title}</Text>
                  {fieldPickerModal.fieldKey &&
                    privacyState.personalDetails[fieldPickerModal.fieldKey] === opt.key && (
                      <Check size={18} color="#9333EA" />
                    )}
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.sheetCancelBtn}
                onPress={() => setFieldPickerModal({ visible: false })}
              >
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* User Granted Access Actions Modal */}
      {selectedUserAction && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.sheetBackdrop}>
            <View style={styles.bottomSheetCard}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>
                {selectedUserAction.name}, {selectedUserAction.age}
              </Text>
              <Text style={styles.sheetSub}>
                Current status: {selectedUserAction.status.toUpperCase()} (
                {selectedUserAction.accessLevel === 'full' ? 'Full Profile' : 'Partial Profile'})
              </Text>

              {selectedUserAction.status === 'approved' ? (
                <>
                  <TouchableOpacity
                    style={styles.sheetOptionRow}
                    onPress={() => {
                      const nextLevel =
                        selectedUserAction.accessLevel === 'full' ? 'partial' : 'full';
                      privacyCenterService.updateUserAccessLevel(selectedUserAction.id, nextLevel);
                      setSelectedUserAction(null);
                      Alert.alert(
                        'Access Level Updated',
                        `Switched to ${nextLevel === 'full' ? 'Full Profile' : 'Partial Profile'}.`
                      );
                    }}
                  >
                    <Sliders size={18} color="#2563EB" style={{ marginRight: 12 }} />
                    <Text style={styles.sheetOptionText}>
                      Switch to {selectedUserAction.accessLevel === 'full' ? 'Partial Profile' : 'Full Profile'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sheetOptionRow}
                    onPress={() => {
                      privacyCenterService.revokeUserAccess(selectedUserAction.id);
                      setSelectedUserAction(null);
                      Alert.alert('Access Revoked', `Revoked profile access for ${selectedUserAction.name}.`);
                    }}
                  >
                    <Lock size={18} color="#E11D48" style={{ marginRight: 12 }} />
                    <Text style={[styles.sheetOptionText, { color: '#E11D48' }]}>
                      Revoke Profile Access
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.sheetOptionRow}
                  onPress={() => {
                    privacyCenterService.restoreUserAccess(selectedUserAction.id, 'partial');
                    setSelectedUserAction(null);
                    Alert.alert('Access Restored', `Restored profile access for ${selectedUserAction.name}.`);
                  }}
                >
                  <Check size={18} color="#059669" style={{ marginRight: 12 }} />
                  <Text style={[styles.sheetOptionText, { color: '#059669' }]}>
                    Restore Profile Access
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.sheetCancelBtn}
                onPress={() => setSelectedUserAction(null)}
              >
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // View Headlines
  viewHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  viewSubheadline: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },

  // HUB STYLES
  hubHeaderContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  shieldBadgeGradient: {
    width: 60,
    height: 60,
    borderRadius: 22,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  hubTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  hubTagline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9333EA',
    marginBottom: 8,
    textAlign: 'center',
  },
  hubDescription: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  menuItemSub: {
    fontSize: 12,
    color: '#64748B',
  },

  // RADIO CARD STYLES
  radioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 12,
  },
  radioCardSelected: {
    borderColor: '#EC4899',
    backgroundColor: '#FDF2F8',
  },
  cardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#EC4899',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EC4899',
  },

  // DISCLOSURE BOX
  disclosureBox: {
    backgroundColor: '#FFF1F2',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  disclosureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9F1239',
    marginBottom: 12,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkItemText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 10,
    fontWeight: '500',
  },

  // PREVIEW ACTION CARD
  previewActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    padding: 14,
    marginBottom: 20,
  },
  previewIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6D28D9',
  },
  previewActionSub: {
    fontSize: 12,
    color: '#7C3AED',
  },

  // GRADIENT BUTTON
  gradientButton: {
    backgroundColor: '#9333EA',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  gradientButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // PERSONAL DETAILS LIST
  detailsListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  detailRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  detailRowDesc: {
    fontSize: 12,
    color: '#64748B',
  },
  detailStatusCol: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // PHOTOS & MEDIA
  noticePurpleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    padding: 14,
    marginBottom: 20,
  },
  noticeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticePurpleTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#581C87',
  },
  noticePurpleSub: {
    fontSize: 12,
    color: '#7E22CE',
  },
  photosSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  reorderLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9333EA',
  },
  photoSlotsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  mainPhotoWrapper: {
    flex: 1.2,
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  mainPhotoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainPhotoBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mainPhotoBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  photoCloseBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoSlot: {
    flex: 1,
    height: 180,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoCameraCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addPhotoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  thumbSlotsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  thumbWrapper: {
    flex: 1,
    height: 96,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbPlaceholder: {
    flex: 1,
    height: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  toggleRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 12,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  toggleSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },

  // LOCATION & DISCOVERY
  locationMasterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDF2F8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    padding: 16,
    marginBottom: 20,
  },
  locationMasterTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#9D174D',
    marginBottom: 3,
  },
  locationMasterSub: {
    fontSize: 12,
    color: '#BE185D',
    lineHeight: 17,
  },

  // REQUEST SHARING SETTINGS
  levelCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  levelCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    padding: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelCardSelected: {
    borderColor: '#EC4899',
    backgroundColor: '#FDF2F8',
  },
  levelCardIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  levelCardDesc: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 8,
  },
  radioCircleSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EC4899',
  },
  toggleCardStack: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  toggleInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  toggleInlineTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  toggleInlineSub: {
    fontSize: 11.5,
    color: '#64748B',
  },

  // GRANTED ACCESS
  filterTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  filterTabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: 8,
  },
  filterTabBtnActive: {
    borderBottomColor: '#EC4899',
  },
  filterTabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabBtnTextActive: {
    color: '#BE185D',
  },
  usersCardList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 16,
  },
  userItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  userItemAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  userItemName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  userItemDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  accessLevelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  accessLevelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  moreActionsBtn: {
    padding: 6,
  },

  // PREVIEW YOUR PROFILE
  previewSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3,
    marginBottom: 18,
  },
  previewSegmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
  },
  previewSegmentBtnActive: {
    backgroundColor: '#9333EA',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  previewSegmentBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  previewSegmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  previewCardFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 16,
  },
  previewHeroPhotoBox: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  previewHeroPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  blurOverlayBadge: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  blurOverlayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  photoCountPill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  photoCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewBodyPad: {
    padding: 16,
  },
  previewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  previewNameText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 6,
  },
  verifiedDotCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  previewMetaText: {
    fontSize: 12.5,
    color: '#64748B',
    marginLeft: 4,
  },
  metaDot: {
    marginHorizontal: 6,
    color: '#CBD5E1',
  },
  previewBioText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 12,
  },
  previewChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  previewMargamChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  previewChipEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  previewChipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  protectedDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  protectedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  protectedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
    marginRight: 4,
  },
  protectedValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  previewNoticePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    padding: 12,
    marginBottom: 20,
  },
  previewNoticeText: {
    fontSize: 12,
    color: '#7C3AED',
    flex: 1,
    lineHeight: 16,
  },

  // PRIVACY TEMPLATES
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 14,
  },
  templateCardSelected: {
    borderColor: '#9333EA',
    backgroundColor: '#FAF5FF',
  },
  templateCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  templateDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  templateBulletsList: {
    paddingLeft: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletText: {
    fontSize: 12.5,
    color: '#475569',
    marginLeft: 8,
  },

  // SUCCESS CONFIRMATION MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  successCheckCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  successChecklist: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  successItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  successItemText: {
    fontSize: 13,
    color: '#334155',
    marginLeft: 10,
    fontWeight: '500',
  },

  // BOTTOM SHEETS
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  bottomSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  sheetOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  sheetIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sheetOptionText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  sheetCancelBtn: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
  },
  sheetCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
});
