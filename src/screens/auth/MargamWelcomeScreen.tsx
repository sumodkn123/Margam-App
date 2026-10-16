// MARGAM — Screen 1: Welcome & Onboarding Hero Screen ($10M Redesign)
// Warm editorial minimalism, tactile glassmorphism, interactive category marquee,
// immersive dynamic photography with live social proof badges, and tactile $10M CTA.

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
  Circle,
  RadialGradient,
} from 'react-native-svg';
import {
  Coffee,
  Plane,
  Leaf,
  Dumbbell,
  Utensils,
  Globe,
  SlidersHorizontal,
  Heart,
  ArrowRight,
  Sparkles,
  MapPin,
  X,
  Check,
  ChevronDown,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface MargamWelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

interface StorySlide {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  image: string;
  headline: string;
  subtext: string;
  liveBadge: string;
  gradientColors: [string, string];
  avatars: string[];
}

const SLIDES: StorySlide[] = [
  {
    id: 'cafe',
    label: 'Café & Work',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85',
    headline: 'People who share your world, not just a profile.',
    subtext: 'Co-work, brainstorm, or grab artisanal coffee with founders & creators nearby.',
    liveBadge: '18 founders & creatives at local cafés',
    gradientColors: ['#F43F5E', '#F97316'],
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    ],
  },
  {
    id: 'travel',
    label: 'Travel',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1000&q=85',
    headline: 'Turn spontaneous weekend plans into core memories.',
    subtext: 'Find verified travel companions heading to the same hills, beaches, and trails.',
    liveBadge: '12 weekend roadtrips forming near you',
    gradientColors: ['#7C3AED', '#6366F1'],
    avatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    ],
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=85',
    headline: 'Curated circles built around your everyday rhythm.',
    subtext: 'From sunset walks to book clubs and art galleries—connect effortlessly.',
    liveBadge: '32 active lifestyle circles this evening',
    gradientColors: ['#10B981', '#0D9488'],
    avatars: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    ],
  },
  {
    id: 'fitness',
    label: 'Fitness',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1000&q=85',
    headline: 'Never hit a morning run or gym session solo again.',
    subtext: 'Match with accountability partners who match your pace, split, and goals.',
    liveBadge: '9 morning run clubs & gym partners active',
    gradientColors: ['#F97316', '#F59E0B'],
    avatars: [
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    ],
  },
  {
    id: 'food',
    label: 'Food & Dining',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85',
    headline: 'Great conversations start over unforgettable tables.',
    subtext: 'Explore hidden local gems, supper clubs, and late-night food trails together.',
    liveBadge: '15 supper tables open for tonight',
    gradientColors: ['#E11D48', '#EC4899'],
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    ],
  },
];

const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'ML', name: 'മലയാളം' },
  { code: 'HI', name: 'हिन्दी' },
  { code: 'TA', name: 'தமிழ்' },
];

export const MargamWelcomeScreen: React.FC<MargamWelcomeScreenProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isPaused, setIsPaused] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Discovery Preferences State
  const [discoveryDistance, setDiscoveryDistance] = useState('25 km');
  const [strictValuesMatch, setStrictValuesMatch] = useState(true);

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const zoomAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Pulsing Green Live Dot
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.45,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  // Carousel Auto-Advance (4.5s)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleSlideTransition((activeIndex + 1) % SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused]);

  // Smooth Slide Crossfade Transition
  const handleSlideTransition = (nextIndex: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.15,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(zoomAnim, {
        toValue: 1.04,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveIndex(nextIndex);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(zoomAnim, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleSelectSlide = (idx: number) => {
    if (idx === activeIndex) return;
    setIsPaused(true);
    handleSlideTransition(idx);
    // Resume auto-advance after 10 seconds of user inactivity
    setTimeout(() => setIsPaused(false), 10000);
  };

  // Button Press Animation
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const currentSlide = SLIDES[activeIndex];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      {/* Ambient Radial Background Mesh Glows */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="bgGlowTopLeft" cx="15%" cy="10%" r="45%">
              <Stop offset="0%" stopColor="#F43F5E" stopOpacity="0.10" />
              <Stop offset="100%" stopColor="#FAF9F6" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bgGlowMidRight" cx="90%" cy="40%" r="50%">
              <Stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#FAF9F6" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bgGlowBottom" cx="35%" cy="95%" r="45%">
              <Stop offset="0%" stopColor="#FB923C" stopOpacity="0.09" />
              <Stop offset="100%" stopColor="#FAF9F6" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgGlowTopLeft)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgGlowMidRight)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgGlowBottom)" />
        </Svg>
      </View>

      <View style={styles.contentWrapper}>
        {/* =========================================================================
            1. UNIFIED TOP NAVIGATION BAR
            Left: Brand Mark + Margam + Beta Tag + Subtitle
            Right: Clean Translucent Language Pill + Preferences Settings Icon
            ========================================================================= */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            {/* Custom Gradient Location-Pin Badge */}
            <View style={styles.brandIconContainer}>
              <Svg width={38} height={38} style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgLinearGradient id="brandLogoGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#F43F5E" />
                    <Stop offset="50%" stopColor="#D946EF" />
                    <Stop offset="100%" stopColor="#6366F1" />
                  </SvgLinearGradient>
                </Defs>
                <Rect width={38} height={38} rx={13} fill="url(#brandLogoGrad)" />
              </Svg>
              <View style={styles.brandIconInner}>
                <MapPin size={20} color="#FFFFFF" strokeWidth={2.4} />
              </View>
              {/* Online Green Indicator Dot */}
              <View style={styles.liveGreenDot} />
            </View>

            <View style={styles.brandTextCol}>
              <View style={styles.brandTitleRow}>
                <Text style={styles.brandTitleText}>Margam</Text>
                <View style={styles.betaBadge}>
                  <Text style={styles.betaBadgeText}>BETA</Text>
                </View>
              </View>
              <Text style={styles.brandTaglineText}>Shared interests. Real world.</Text>
            </View>
          </View>

          {/* Right Controls: Translucent Language Pill + Preferences Button */}
          <View style={styles.topRightControls}>
            <TouchableOpacity
              style={styles.langSelectorPill}
              activeOpacity={0.85}
              onPress={() => setIsLangMenuOpen(true)}
              accessibilityLabel="Select Language"
            >
              <Globe size={13.5} color="#475569" strokeWidth={2.2} />
              <Text style={styles.langSelectorText}>{selectedLang}</Text>
              <ChevronDown size={12} color="#64748B" strokeWidth={2.2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.preferencesIconButton}
              activeOpacity={0.85}
              onPress={() => setIsPreferencesOpen(true)}
              accessibilityLabel="Discovery Preferences"
            >
              <SlidersHorizontal size={15} color="#334155" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* =========================================================================
            2. INTERACTIVE CATEGORY PILL SELECTOR (Tappable tactile pills)
            ========================================================================= */}
        <View style={styles.marqueeContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.marqueeScrollContent}
          >
            {SLIDES.map((slide, idx) => {
              const IconComp = slide.icon;
              const isActive = idx === activeIndex;

              return (
                <TouchableOpacity
                  key={slide.id}
                  activeOpacity={0.88}
                  onPress={() => handleSelectSlide(idx)}
                  style={[
                    styles.categoryPill,
                    isActive ? styles.categoryPillActive : styles.categoryPillInactive,
                  ]}
                >
                  <View
                    style={[
                      styles.categoryIconCircle,
                      isActive
                        ? styles.categoryIconCircleActive
                        : styles.categoryIconCircleInactive,
                    ]}
                  >
                    {isActive && (
                      <Svg width={34} height={34} style={StyleSheet.absoluteFill}>
                        <Defs>
                          <SvgLinearGradient id={`pillGrad-${slide.id}`} x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0%" stopColor={slide.gradientColors[0]} />
                            <Stop offset="100%" stopColor={slide.gradientColors[1]} />
                          </SvgLinearGradient>
                        </Defs>
                        <Rect width={34} height={34} rx={11} fill={`url(#pillGrad-${slide.id})`} />
                      </Svg>
                    )}
                    <IconComp
                      size={16}
                      color={isActive ? '#FFFFFF' : '#475569'}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryLabelText,
                      isActive
                        ? styles.categoryLabelTextActive
                        : styles.categoryLabelTextInactive,
                    ]}
                  >
                    {slide.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* =========================================================================
            3. IMMERSIVE HERO SHOWCASE CARD
            Dynamic Photography + Live Activity Social Proof + Frosted Story Box
            ========================================================================= */}
        <View style={styles.heroCardContainer}>
          {/* Crossfading Background Photo with subtle Ken Burns zoom */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: fadeAnim,
                transform: [{ scale: zoomAnim }],
              },
            ]}
          >
            <Image
              source={{ uri: currentSlide.image }}
              style={styles.heroCardImage}
              resizeMode="cover"
            />
          </Animated.View>

          {/* Cinematic Vignette Overlay for Crisp Readability */}
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <SvgLinearGradient id="heroVignette" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
                <Stop offset="25%" stopColor="#000000" stopOpacity="0.08" />
                <Stop offset="55%" stopColor="#000000" stopOpacity="0.25" />
                <Stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#heroVignette)" />
          </Svg>

          {/* Top Floating Live Activity Badge (Stacked Avatars + Pulsing Dot) */}
          <View style={styles.liveBadgeOverlay}>
            <View style={styles.liveBadgeContainer}>
              {/* Stacked Member Avatars */}
              <View style={styles.stackedAvatarsRow}>
                {currentSlide.avatars.map((avatarUri, aIdx) => (
                  <Image
                    key={aIdx}
                    source={{ uri: avatarUri }}
                    style={[
                      styles.stackedAvatar,
                      { marginLeft: aIdx === 0 ? 0 : -8, zIndex: 3 - aIdx },
                    ]}
                  />
                ))}
              </View>

              {/* Pulsing Emerald Live Indicator */}
              <View style={styles.pulseContainer}>
                <Animated.View
                  style={[
                    styles.pulseRing,
                    {
                      transform: [{ scale: pulseAnim }],
                      opacity: pulseAnim.interpolate({
                        inputRange: [1, 1.45],
                        outputRange: [0.7, 0.1],
                      }),
                    },
                  ]}
                />
                <View style={styles.pulseCenterDot} />
              </View>

              <Text style={styles.liveBadgeLabel} numberOfLines={1}>
                {currentSlide.liveBadge}
              </Text>
            </View>
          </View>

          {/* Bottom Glassmorphic Story Card */}
          <View style={styles.bottomStoryCard}>
            {/* Sparkles Discovery Kicker */}
            <View style={styles.storyKickerRow}>
              <Sparkles size={13} color="#E11D48" strokeWidth={2.4} />
              <Text style={styles.storyKickerText}>REAL-WORLD DISCOVERY</Text>
            </View>

            {/* Headline */}
            <Text style={styles.storyHeadlineText} numberOfLines={2}>
              {currentSlide.headline}
            </Text>

            {/* Subtitle */}
            <Text style={styles.storySubtext} numberOfLines={2}>
              {currentSlide.subtext}
            </Text>

            {/* Segmented Progress Indicators */}
            <View style={styles.progressPillsRow}>
              {SLIDES.map((slide, pIdx) => {
                const isSelected = pIdx === activeIndex;
                return (
                  <TouchableOpacity
                    key={slide.id}
                    onPress={() => handleSelectSlide(pIdx)}
                    activeOpacity={0.8}
                    style={[
                      styles.progressPill,
                      isSelected ? styles.progressPillActive : styles.progressPillInactive,
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </View>

        {/* =========================================================================
            4. $10M CTA & FOOTER ARCHITECTURE
            Tactile Gradient Button (Rose-500 via Rose-600 to Orange-500)
            Heart Icon + Directional Arrow + Refined Sign In Link
            ========================================================================= */}
        <View style={styles.footerContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={onGetStarted}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.ctaButton}
              accessibilityRole="button"
              accessibilityLabel="Get Started with Margam"
            >
              {/* Rich Rose-Orange Linear Gradient */}
              <Svg width="100%" height={56} style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgLinearGradient id="ctaButtonGrad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0%" stopColor="#F43F5E" />
                    <Stop offset="55%" stopColor="#E11D48" />
                    <Stop offset="100%" stopColor="#F97316" />
                  </SvgLinearGradient>
                </Defs>
                <Rect width="100%" height={56} rx={18} fill="url(#ctaButtonGrad)" />
              </Svg>

              {/* Specular Inner Top Highlight Arc */}
              <View style={styles.buttonTopHighlight} />

              <View style={styles.buttonInnerContent}>
                <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.ctaButtonText}>Get Started</Text>
                <ArrowRight size={19} color="#FFFFFF" strokeWidth={2.4} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Secondary Action: Refined Sign In Link */}
          <View style={styles.signInRow}>
            <Text style={styles.signInPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={onSignIn} activeOpacity={0.75}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* =========================================================================
          LANGUAGE PICKER MODAL
          ========================================================================= */}
      <Modal
        visible={isLangMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLangMenuOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsLangMenuOpen(false)}>
          <View style={styles.langModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Choose Language</Text>
              <TouchableOpacity onPress={() => setIsLangMenuOpen(false)}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
            {LANGUAGES.map((lang) => {
              const isChosen = lang.code === selectedLang;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langOptionItem, isChosen && styles.langOptionItemActive]}
                  onPress={() => {
                    setSelectedLang(lang.code);
                    setIsLangMenuOpen(false);
                  }}
                >
                  <View>
                    <Text
                      style={[
                        styles.langOptionName,
                        isChosen && styles.langOptionNameActive,
                      ]}
                    >
                      {lang.name}
                    </Text>
                    <Text style={styles.langOptionCode}>{lang.code}</Text>
                  </View>
                  {isChosen && <Check size={18} color="#E11D48" strokeWidth={2.6} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* =========================================================================
          PREFERENCES MODAL
          ========================================================================= */}
      <Modal
        visible={isPreferencesOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPreferencesOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsPreferencesOpen(false)}>
          <View style={styles.prefModalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.prefTitleGroup}>
                <SlidersHorizontal size={18} color="#E11D48" strokeWidth={2.4} />
                <Text style={styles.modalTitle}>Discovery Preferences</Text>
              </View>
              <TouchableOpacity onPress={() => setIsPreferencesOpen(false)}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.prefSectionLabel}>MAX DISCOVERY DISTANCE</Text>
            <View style={styles.prefDistanceRow}>
              {['10 km', '25 km', '50 km', 'Any'].map((dist) => (
                <TouchableOpacity
                  key={dist}
                  style={[
                    styles.prefDistanceChip,
                    discoveryDistance === dist && styles.prefDistanceChipActive,
                  ]}
                  onPress={() => setDiscoveryDistance(dist)}
                >
                  <Text
                    style={[
                      styles.prefDistanceText,
                      discoveryDistance === dist && styles.prefDistanceTextActive,
                    ]}
                  >
                    {dist}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.prefToggleRow}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.prefToggleTitle}>Strict Value Compatibility</Text>
                <Text style={styles.prefToggleSubtext}>
                  Prioritize partners with shared lifestyle and family values
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.prefSwitch,
                  strictValuesMatch ? styles.prefSwitchOn : styles.prefSwitchOff,
                ]}
                onPress={() => setStrictValuesMatch(!strictValuesMatch)}
              >
                <View
                  style={[
                    styles.prefSwitchThumb,
                    strictValuesMatch ? styles.prefSwitchThumbOn : styles.prefSwitchThumbOff,
                  ]}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.prefDoneButton}
              onPress={() => setIsPreferencesOpen(false)}
            >
              <Text style={styles.prefDoneText}>Save & Continue</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 10 : 4,
    paddingBottom: Platform.OS === 'ios' ? 18 : 22,
  },

  // 1. Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 3,
  },
  brandIconInner: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveGreenDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FAF9F6',
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitleText: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  betaBadge: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  betaBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#E11D48',
    letterSpacing: 0.5,
  },
  brandTaglineText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: -1,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 11,
    paddingVertical: 6.5,
    borderRadius: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  langSelectorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  preferencesIconButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  // 2. Interactive Marquee
  marqueeContainer: {
    marginVertical: 4,
  },
  marqueeScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  categoryPill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 16,
    minWidth: 64,
  },
  categoryPillActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.07)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 3,
    transform: [{ scale: 1.02 }],
  },
  categoryPillInactive: {
    backgroundColor: 'transparent',
    opacity: 0.65,
  },
  categoryIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIconCircleActive: {
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryIconCircleInactive: {
    backgroundColor: '#E2E8F0',
  },
  categoryLabelText: {
    fontSize: 11,
    letterSpacing: -0.2,
  },
  categoryLabelTextActive: {
    fontWeight: '800',
    color: '#0F172A',
  },
  categoryLabelTextInactive: {
    fontWeight: '600',
    color: '#64748B',
  },

  // 3. Hero Showcase Card
  heroCardContainer: {
    flex: 1,
    minHeight: SCREEN_HEIGHT * 0.44,
    maxHeight: SCREEN_HEIGHT * 0.54,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    backgroundColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
    marginVertical: 4,
  },
  heroCardImage: {
    width: '100%',
    height: '100%',
  },

  // Floating Live Activity Badge
  liveBadgeOverlay: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
  },
  liveBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 5.5,
    paddingLeft: 7,
    paddingRight: 13,
    borderRadius: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  stackedAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  pulseContainer: {
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34D399',
  },
  pulseCenterDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.25,
    backgroundColor: '#10B981',
  },
  liveBadgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: -0.2,
  },

  // Bottom Glassmorphic Story Card
  bottomStoryCard: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.72)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 5,
  },
  storyKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  storyKickerText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#E11D48',
    letterSpacing: 0.8,
  },
  storyHeadlineText: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  storySubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 17,
    marginTop: 3,
  },
  progressPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5.5,
    marginTop: 12,
  },
  progressPill: {
    height: 5,
    borderRadius: 2.5,
  },
  progressPillActive: {
    width: 26,
    backgroundColor: '#E11D48',
  },
  progressPillInactive: {
    width: 7,
    backgroundColor: '#CBD5E1',
  },

  // 4. CTA & Footer
  footerContainer: {
    paddingTop: 8,
    alignItems: 'center',
    gap: 10,
  },
  ctaButton: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonTopHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  buttonInnerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  signInPrompt: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  signInLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E11D48',
  },

  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  langModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  prefModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
    paddingBottom: Platform.OS === 'ios' ? 38 : 26,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  prefTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  langOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
  },
  langOptionItemActive: {
    backgroundColor: '#FFF1F2',
  },
  langOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  langOptionNameActive: {
    color: '#E11D48',
    fontWeight: '700',
  },
  langOptionCode: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  prefSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 6,
  },
  prefDistanceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  prefDistanceChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  prefDistanceChipActive: {
    backgroundColor: '#E11D48',
  },
  prefDistanceText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  prefDistanceTextActive: {
    color: '#FFFFFF',
  },
  prefToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 18,
  },
  prefToggleTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  prefToggleSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  prefSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },
  prefSwitchOn: {
    backgroundColor: '#E11D48',
  },
  prefSwitchOff: {
    backgroundColor: '#CBD5E1',
  },
  prefSwitchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  prefSwitchThumbOn: {
    alignSelf: 'flex-end',
  },
  prefSwitchThumbOff: {
    alignSelf: 'flex-start',
  },
  prefDoneButton: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  prefDoneText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
