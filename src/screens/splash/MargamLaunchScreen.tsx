// MARGAM — Minimalist Premium Splash Screen & App Opening Animation
// Pure White Canvas (#FFFFFF) • Official Margam Logo • Refined Tagline Motion
// Sequence (Total ~2.8s):
//   Stage A (0.0s – 0.4s): Pure white canvas
//   Stage B (0.35s – 1.2s): Subtle, smooth scale & opacity entrance of the official Margam logo
//   Stage C (0.9s – 1.7s): Tagline reveals below logo with gentle upward movement & fade-in
//   Stage D (1.7s – 2.8s): Brief hold and seamless crossfade dissolve directly into live application
//
// Integrated with AppStartupCoordinator for non-blocking parallel service preloading (auth, profile, matches)
// and repeat-launch fast entrance (2.8s initial vs 1.2s repeat launch).

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  AccessibilityInfo,
  StatusBar,
  Easing,
  Platform,
} from 'react-native';
import { useAppStartupCoordinator } from '../../services/startupCoordinator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Proportional dimensions matching official 1024x948 retina asset
const LOGO_WIDTH = Math.min(SCREEN_WIDTH * 0.38, 154);
const LOGO_HEIGHT = Math.round(LOGO_WIDTH * (948 / 1024)); // ~142.5px

interface MargamLaunchScreenProps {
  onAnimationComplete: () => void;
  minDurationMs?: number;
}

export const MargamLaunchScreen: React.FC<MargamLaunchScreenProps> = ({
  onAnimationComplete,
  minDurationMs,
}) => {
  const { coordinator, targetAnimationDuration } = useAppStartupCoordinator();
  const effectiveDuration = minDurationMs ?? targetAnimationDuration;
  const timeScale = effectiveDuration / 2800;

  const [_reduceMotion, setReduceMotion] = useState<boolean>(false);

  // Animation Drivers (Native Driver GPU-accelerated)
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.90)).current;
  const taglineOpacityAnim = useRef(new Animated.Value(0)).current;
  const taglineTranslateYAnim = useRef(new Animated.Value(10)).current;
  const screenOpacityAnim = useRef(new Animated.Value(1)).current;

  // Master Timer References for Safe Cleanup
  const stageBTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stageCTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stageDTimerRef = useRef<NodeJS.Timeout | null>(null);
  const failSafeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start parallel non-blocking application state preloading immediately
    coordinator.loadEssentialAppState();

    // Query iOS & Android Reduced Motion Accessibility Setting
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
      if (enabled) {
        runReducedMotionSequence();
      } else {
        runRefinedLaunchSequence();
      }
    });

    // Fail-safe insurance to guarantee the splash screen never gets stuck
    failSafeTimerRef.current = setTimeout(() => {
      exitToApp();
    }, effectiveDuration + 500);

    return () => {
      if (stageBTimerRef.current) clearTimeout(stageBTimerRef.current);
      if (stageCTimerRef.current) clearTimeout(stageCTimerRef.current);
      if (stageDTimerRef.current) clearTimeout(stageDTimerRef.current);
      if (failSafeTimerRef.current) clearTimeout(failSafeTimerRef.current);
      logoOpacityAnim.stopAnimation();
      logoScaleAnim.stopAnimation();
      taglineOpacityAnim.stopAnimation();
      taglineTranslateYAnim.stopAnimation();
      screenOpacityAnim.stopAnimation();
    };
  }, []);

  const runReducedMotionSequence = () => {
    Animated.parallel([
      Animated.timing(logoOpacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacityAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(taglineTranslateYAnim, {
        toValue: 0,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    stageDTimerRef.current = setTimeout(() => {
      exitToApp();
    }, 1200);
  };

  const runRefinedLaunchSequence = () => {
    // -------------------------------------------------------------
    // STAGE B: Logo Entrance (0.35s – 1.2s)
    // -------------------------------------------------------------
    stageBTimerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacityAnim, {
          toValue: 1,
          duration: 700 * timeScale,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleAnim, {
          toValue: 1.0,
          duration: 800 * timeScale,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 350 * timeScale);

    // -------------------------------------------------------------
    // STAGE C: Tagline Reveal (0.9s – 1.7s)
    // -------------------------------------------------------------
    stageCTimerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineOpacityAnim, {
          toValue: 1,
          duration: 650 * timeScale,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateYAnim, {
          toValue: 0,
          duration: 650 * timeScale,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 900 * timeScale);

    // -------------------------------------------------------------
    // STAGE D: Transition into the Real Application (1.7s – 2.8s)
    // -------------------------------------------------------------
    stageDTimerRef.current = setTimeout(() => {
      exitToApp();
    }, effectiveDuration - 350);
  };

  const exitToApp = () => {
    coordinator.markLaunchComplete();
    Animated.timing(screenOpacityAnim, {
      toValue: 0,
      duration: 350,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      onAnimationComplete();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: screenOpacityAnim,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Centered Brand Presentation Container */}
      <View style={styles.brandContentContainer}>
        {/* Stage B: Official 3D Margam Logo Asset */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacityAnim,
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../../../assets/images/margam_logo_3d.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Stage C: Exact Tagline Reveal */}
        <Animated.View
          style={[
            styles.taglineWrapper,
            {
              opacity: taglineOpacityAnim,
              transform: [{ translateY: taglineTranslateYAnim }],
            },
          ]}
        >
          <Text style={styles.taglineText}>
            Shared journeys. Meaningful life partners.
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  brandContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoWrapper: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle, soft, restrained elevation on pure white
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  logoImage: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  taglineWrapper: {
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineText: {
    fontSize: 15.5,
    fontWeight: '500',
    color: '#475569', // Clean slate-gray, superior contrast and elegance on #FFFFFF
    letterSpacing: 0.35,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
});
