// MARGAM — Short, restrained brand handoff on a white canvas.
// The bundled logo includes the Margam wordmark; show it once with the official tagline.

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
  // Keep cold starts brief. The coordinator's older 2.8s cinematic timing made
  // every fresh process wait too long before the actual app became available.
  const effectiveDuration = Math.min(minDurationMs ?? targetAnimationDuration, 900);
  const timeScale = effectiveDuration / 900;

  // Animation Drivers (Native Driver GPU-accelerated)
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.90)).current;
  const taglineOpacityAnim = useRef(new Animated.Value(0)).current;
  const taglineTranslateYAnim = useRef(new Animated.Value(10)).current;
  const screenOpacityAnim = useRef(new Animated.Value(1)).current;

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
      onAnimationCompleteRef.current();
    };

    // Failsafe in case the accessibility query or animation callback stalls.
    const failSafeTimer = setTimeout(complete, effectiveDuration + 250);

    const runReducedMotionSequence = () => {
      if (isDisposed || hasCompleted) return;
      // Present the brand immediately and use only a very short handoff fade.
      logoOpacityAnim.setValue(1);
      logoScaleAnim.setValue(1);
      taglineOpacityAnim.setValue(1);
      taglineTranslateYAnim.setValue(0);
      activeAnimation = Animated.timing(screenOpacityAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      });
      activeAnimation.start(({ finished }) => {
        if (finished) complete();
      });
    };

    const runRefinedLaunchSequence = () => {
      if (isDisposed || hasCompleted) return;
      // Logo first, tagline second, then a quick crossfade into the live app.
      activeAnimation = Animated.sequence([
        Animated.parallel([
          Animated.timing(logoOpacityAnim, {
            toValue: 1,
            duration: 280 * timeScale,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(logoScaleAnim, {
            toValue: 1,
            duration: 280 * timeScale,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(70 * timeScale),
        Animated.parallel([
          Animated.timing(taglineOpacityAnim, {
            toValue: 1,
            duration: 190 * timeScale,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(taglineTranslateYAnim, {
            toValue: 0,
            duration: 190 * timeScale,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(180 * timeScale),
        Animated.timing(screenOpacityAnim, {
          toValue: 0,
          duration: 180 * timeScale,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]);
      activeAnimation.start(({ finished }) => {
        if (finished) complete();
      });
    };

    // Respect the OS preference; fall back to the short standard reveal if the
    // platform query is unavailable.
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
      taglineOpacityAnim.stopAnimation();
      taglineTranslateYAnim.stopAnimation();
      screenOpacityAnim.stopAnimation();
    };
  }, [
    coordinator,
    effectiveDuration,
    logoOpacityAnim,
    logoScaleAnim,
    screenOpacityAnim,
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
