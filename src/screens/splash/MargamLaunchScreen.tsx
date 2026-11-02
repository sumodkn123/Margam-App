// MARGAM — Minimalist, Pure White Canvas Splash Screen (#FFFFFF)
// Official Margam 3D Retina Brand Mark • Single Exact Tagline • 5-Stage Choreographed Flow
// Stages (Total ~2.75s – 3.1s):
//   Stage A (0.0s – 0.35s): Pure white canvas hold (#FFFFFF). Zero distractions.
//   Stage B (0.35s – 1.15s): Official 3D Margam logo enters with smooth opacity & subtle scale (0.90 -> 1.0) via cubic easing.
//   Stage C (1.10s – 1.70s): Tagline reveals below logo with gentle upward glide & fade-in.
//   Stage D (1.65s – 2.45s): Subtle breathing pulse (1.0 -> 1.025 -> 1.0) & gentle luminous ambient shimmer aura.
//   Stage E (2.45s – 2.85s): Seamless crossfade and soft depth zoom (1.0 -> 1.03) directly into genuine Margam app.
//
// Features:
// - GPU-accelerated 60fps Native Driver transitions
// - Integrated AppStartupCoordinator parallel state preloading
// - Native accessibility reduced-motion check
// - Guaranteed failsafe timeout (never hangs)

import React, { useEffect, useRef } from 'react';
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
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  onAnimationCompleteRef.current = onAnimationComplete;

  // 2.5s - 3.2s choreographed sequence on standard launch
  const baseDuration = minDurationMs ?? targetAnimationDuration ?? 2800;
  const effectiveDuration = minDurationMs ? minDurationMs : Math.max(baseDuration, 2750);
  const timeScale = effectiveDuration / 2800;

  // Animation Drivers (Native Driver GPU-accelerated)
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.90)).current;
  const shimmerOpacityAnim = useRef(new Animated.Value(0)).current;
  const taglineOpacityAnim = useRef(new Animated.Value(0)).current;
  const taglineTranslateYAnim = useRef(new Animated.Value(12)).current;
  const screenOpacityAnim = useRef(new Animated.Value(1)).current;
  const screenScaleAnim = useRef(new Animated.Value(1.0)).current;

  useEffect(() => {
    // Start parallel non-blocking application state preloading immediately
    coordinator.loadEssentialAppState();

    let isDisposed = false;
    let hasCompleted = false;
    let activeAnimation: Animated.CompositeAnimation | null = null;

    const complete = () => {
      if (isDisposed || hasCompleted) return;
      hasCompleted = true;
      coordinator.markLaunchComplete();
      onAnimationComplete();
      onAnimationCompleteRef.current();
    };

    // Failsafe in case accessibility query or animation callback stalls
    const failSafeTimer = setTimeout(complete, effectiveDuration + 500);

    const runReducedMotionSequence = () => {
      if (isDisposed || hasCompleted) return;
      // Present brand immediately with short, gentle 200ms handoff fade
      logoOpacityAnim.setValue(1);
      logoScaleAnim.setValue(1);
      taglineOpacityAnim.setValue(1);
      taglineTranslateYAnim.setValue(0);
      activeAnimation = Animated.timing(screenOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      });
      activeAnimation.start(({ finished }) => {
        if (finished) complete();
      });
    };

    const runRefinedLaunchSequence = () => {
      if (isDisposed || hasCompleted) return;

      // 5-Stage Choreography:
      // Stage A (0 - 350ms): Pure white canvas hold
      // Stage B (350 - 1100ms): Logo entrance with smooth scale & opacity
      // Stage C (1150 - 1700ms): Tagline upward slide & fade-in
      // Stage D (1700 - 2450ms): Subtle breathing pulse & luminous ambient shimmer
      // Stage E (2450 - 2850ms): Seamless crossfade & soft zoom into genuine app
      activeAnimation = Animated.sequence([
        // Stage A: Pure White Canvas Hold
        Animated.delay(350 * timeScale),

        // Stage B: Logo Entrance
        Animated.parallel([
          Animated.timing(logoOpacityAnim, {
            toValue: 1,
            duration: 700 * timeScale,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(logoScaleAnim, {
            toValue: 1,
            duration: 750 * timeScale,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),

        // Brief settling beat
        Animated.delay(80 * timeScale),

        // Stage C: Tagline Reveal
        Animated.parallel([
          Animated.timing(taglineOpacityAnim, {
            toValue: 1,
            duration: 550 * timeScale,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(taglineTranslateYAnim, {
            toValue: 0,
            duration: 600 * timeScale,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),

        // Stage D: Subtle Breathing Pulse & Luminous Shimmer
        Animated.parallel([
          Animated.sequence([
            Animated.timing(logoScaleAnim, {
              toValue: 1.025,
              duration: 380 * timeScale,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(logoScaleAnim, {
              toValue: 1.0,
              duration: 400 * timeScale,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(shimmerOpacityAnim, {
              toValue: 0.45,
              duration: 380 * timeScale,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(shimmerOpacityAnim, {
              toValue: 0,
              duration: 420 * timeScale,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ]),

        // Elegant hold before transition
        Animated.delay(120 * timeScale),

        // Stage E: Smooth Transition into Real Application
        Animated.parallel([
          Animated.timing(screenOpacityAnim, {
            toValue: 0,
            duration: 380 * timeScale,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(screenScaleAnim, {
            toValue: 1.03,
            duration: 380 * timeScale,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]);

      activeAnimation.start(({ finished }) => {
        if (finished) complete();
      });
    };

    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduceMotion) => {
        if (reduceMotion) runReducedMotionSequence();
        else runRefinedLaunchSequence();
      })
      .catch(runRefinedLaunchSequence);

    return () => {
      isDisposed = true;
      clearTimeout(failSafeTimer);
      activeAnimation?.stop();
      logoOpacityAnim.stopAnimation();
      logoScaleAnim.stopAnimation();
      shimmerOpacityAnim.stopAnimation();
      taglineOpacityAnim.stopAnimation();
      taglineTranslateYAnim.stopAnimation();
      screenOpacityAnim.stopAnimation();
      screenScaleAnim.stopAnimation();
    };
  }, [
    coordinator,
    effectiveDuration,
    logoOpacityAnim,
    logoScaleAnim,
    screenOpacityAnim,
    screenScaleAnim,
    shimmerOpacityAnim,
    taglineOpacityAnim,
    taglineTranslateYAnim,
    timeScale,
  ]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: screenOpacityAnim,
          transform: [{ scale: screenScaleAnim }],
        },
      ]}
      pointerEvents="box-none"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Centered Brand Presentation Container */}
      <View style={styles.brandContentContainer}>
        {/* Stage D: Luminous Ambient Shimmer Aura */}
        <Animated.View
          style={[
            styles.logoGlowAura,
            {
              opacity: shimmerOpacityAnim,
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
        />

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
            accessibilityLabel="Margam"
            accessible
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
  logoGlowAura: {
    position: 'absolute',
    width: LOGO_WIDTH * 1.25,
    height: LOGO_HEIGHT * 1.25,
    borderRadius: (LOGO_WIDTH * 1.25) / 2,
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
    elevation: 6,
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
