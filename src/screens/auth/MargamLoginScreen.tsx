// MARGAM — Screen 2: Welcome to Margam (Sign In / Register)
// Exactly matches the reference design with Phone/Email tabs,
// country code selector, Continue button with red love heart,
// Apple/Google/Facebook social login, and 3 trust badges.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { MargamButton } from '../../components/common/MargamButton';
import {
  ChevronLeft,
  Globe,
  ChevronDown,
  Lock,
  Mail,
  ShieldCheck,
  EyeOff,
  Users,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Organic Foliage Leaf SVG illustration in top-right corner
const FoliageLeaves: React.FC<{ size?: number }> = ({ size = 68 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Path
      d="M 100 0 C 70 20, 50 60, 40 100 C 60 70, 80 50, 100 40 Z"
      fill="#4D7C0F"
      fillOpacity={0.16}
    />
    <Path
      d="M 100 0 C 80 10, 60 40, 55 70 C 70 50, 85 30, 100 20 Z"
      fill="#15803D"
      fillOpacity={0.22}
    />
    <Path
      d="M 85 0 C 65 30, 50 60, 45 90 C 58 65, 75 40, 90 20 Z"
      fill="#16A34A"
      fillOpacity={0.18}
    />
  </Svg>
);

// Apple Logo Vector
const AppleLogo: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.11.64-2.77 1.41-.58.67-1.09 1.74-.98 2.79 1.07.08 2.14-.58 2.74-1.33z" />
  </Svg>
);

// Google 4-Color Logo Vector
const GoogleLogo: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

// Facebook Blue Logo Vector
const FacebookLogo: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

interface MargamLoginScreenProps {
  onBack: () => void;
  onContinue: (identifier: string) => void;
  onSocialLogin: (provider: 'apple' | 'google' | 'facebook') => void;
  mode?: 'signin' | 'signup';
  onSwitchMode?: (mode: 'signin' | 'signup') => void;
}

export const MargamLoginScreen: React.FC<MargamLoginScreenProps> = ({
  onBack,
  onContinue,
  onSocialLogin,
  mode = 'signin',
  onSwitchMode,
}) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [emailAddress, setEmailAddress] = useState('sumod.dev@example.com');
  const [selectedLang, setSelectedLang] = useState('English');

  const toggleLanguage = () => {
    const langs = ['English', 'മലയാളം', 'हिन्दी', 'தமிழ்'];
    const nextIdx = (langs.indexOf(selectedLang) + 1) % langs.length;
    setSelectedLang(langs[nextIdx]);
  };

  const handlePressContinue = () => {
    const id = activeTab === 'phone' ? phoneNumber : emailAddress;
    onContinue(id);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Decorative Foliage Leaves in Top Right */}
      <View style={styles.foliageContainer} pointerEvents="none">
        <FoliageLeaves size={85} />
      </View>

      {/* Top Header Row with Back Button and Language Pill */}
      <View style={styles.topHeaderRow}>
        <TouchableOpacity
          style={styles.backCircleBtn}
          activeOpacity={0.8}
          onPress={onBack}
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color="#0F172A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.langPill}
          activeOpacity={0.8}
          onPress={toggleLanguage}
          accessibilityLabel="Select language"
        >
          <Globe size={14} color="#0F172A" style={{ marginRight: 4 }} />
          <Text style={styles.langText}>{selectedLang}</Text>
          <ChevronDown size={14} color="#64748B" style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title & Subtitle */}
        {/* Title & Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {mode === 'signin' ? 'Welcome Back' : 'Welcome to Margam'}
          </Text>
          <Text style={styles.subtitleText}>
            {mode === 'signin'
              ? 'Sign in to continue to your account'
              : "Let's get you started!"}
          </Text>
        </View>

        {/* Segmented Phone Number / Email Address Tabs */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'phone' ? styles.activeTabBtn : styles.inactiveTabBtn,
            ]}
            activeOpacity={0.85}
            onPress={() => setActiveTab('phone')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'phone' ? styles.activeTabBtnText : styles.inactiveTabBtnText,
              ]}
            >
              Phone Number
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'email' ? styles.activeTabBtn : styles.inactiveTabBtn,
            ]}
            activeOpacity={0.85}
            onPress={() => setActiveTab('email')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'email' ? styles.activeTabBtnText : styles.inactiveTabBtnText,
              ]}
            >
              Email Address
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Field Container */}
        {activeTab === 'phone' ? (
          <View style={styles.inputContainer}>
            <View style={styles.countryCodeBox}>
              <Text style={{ fontSize: 16, marginRight: 4 }}>🇮🇳</Text>
              <Text style={styles.countryCodeText}>+91</Text>
              <ChevronDown size={13} color="#64748B" style={{ marginLeft: 2 }} />
            </View>
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.inputField}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <View style={[styles.countryCodeBox, { paddingHorizontal: 10 }]}>
              <Mail size={16} color="#64748B" />
            </View>
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.inputField}
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholder="Enter your email address"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        )}

        {/* Security / Verification Helper Text */}
        <View style={styles.helperRow}>
          <Lock size={12} color="#64748B" style={{ marginRight: 5 }} />
          <Text style={styles.helperText}>
            We'll send you a verification code
          </Text>
        </View>

        {/* Primary CTA Red Love Button */}
        <MargamButton
          title={mode === 'signin' ? 'Sign In' : 'Continue'}
          onPress={handlePressContinue}
          size="lg"
          arrowRight
          style={styles.continueBtn}
        />

        {/* Mode Switch Link (Sign In <-> Get Started) */}
        {onSwitchMode && (
          <View style={styles.switchModeRow}>
            <Text style={styles.switchModePrompt}>
              {mode === 'signin'
                ? "Don't have an account? "
                : 'Already have an account? '}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSwitchMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              <Text style={styles.switchModeLink}>
                {mode === 'signin' ? 'Get Started' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* OR Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* 3 Social Login Buttons */}
        <View style={styles.socialButtonsContainer}>
          {/* 1. Continue with Apple */}
          <TouchableOpacity
            style={styles.socialBtn}
            activeOpacity={0.8}
            onPress={() => onSocialLogin('apple')}
          >
            <AppleLogo size={18} />
            <Text style={styles.socialBtnText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* 2. Continue with Google */}
          <TouchableOpacity
            style={styles.socialBtn}
            activeOpacity={0.8}
            onPress={() => onSocialLogin('google')}
          >
            <GoogleLogo size={18} />
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* 3. Continue with Facebook */}
          <TouchableOpacity
            style={styles.socialBtn}
            activeOpacity={0.8}
            onPress={() => onSocialLogin('facebook')}
          >
            <FacebookLogo size={18} />
            <Text style={styles.socialBtnText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom 3 Trust & Privacy Pillars */}
        <View style={styles.trustPillarsRow}>
          <View style={styles.trustPillarCol}>
            <View style={styles.trustIconCircle}>
              <ShieldCheck size={18} color="#2563EB" />
            </View>
            <Text style={styles.trustTitle}>Safe &amp; Secure</Text>
          </View>

          <View style={styles.trustPillarCol}>
            <View style={styles.trustIconCircle}>
              <EyeOff size={18} color="#E11D48" />
            </View>
            <Text style={styles.trustTitle}>Your data stays private</Text>
          </View>

          <View style={styles.trustPillarCol}>
            <View style={styles.trustIconCircle}>
              <Users size={18} color="#2563EB" />
            </View>
            <Text style={styles.trustTitle}>Real people, real interests</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  foliageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    zIndex: 2,
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  langText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 30,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabBtn: {
    backgroundColor: '#EF4444', // Active red love gradient / solid
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  inactiveTabBtn: {
    backgroundColor: 'transparent',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  activeTabBtnText: {
    color: '#FFFFFF',
  },
  inactiveTabBtnText: {
    color: '#64748B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  countryCodeText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 2,
  },
  inputDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
  },
  continueBtn: {
    width: '100%',
    backgroundColor: '#EF4444',
  },
  switchModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  switchModePrompt: {
    fontSize: 13,
    color: '#64748B',
  },
  switchModeLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginHorizontal: 12,
  },
  socialButtonsContainer: {
    gap: 10,
    marginBottom: 24,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 10,
  },
  trustPillarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  trustPillarCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  trustIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  trustTitle: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
});
