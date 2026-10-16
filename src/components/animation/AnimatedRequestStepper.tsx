import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export interface AnimatedRequestStepperProps {
  /** Active stage index: 1 (Request Sent), 2 (Notified), 3 (They Review), 4 (Response). Defaults to 2 */
  currentStage?: number;
  /** Optional callback fired when any step is tapped */
  onStepPress?: (step: number) => void;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * AnimatedRequestStepper
 *
 * An animated 4-stage stepper timeline for the Request Sent Successfully screen:
 * - Step 1: Pop-in checkmark bounce with an expanding green completion ripple halo.
 * - Connector 1->2: Flowing emerald energy beam traveling from Step 1 into Step 2.
 * - Step 2 (Active - Notified): Dual continuous radar broadcast waves + breathing red beacon core dot.
 * - Steps 3 & 4 (Pending): Staggered cascade entrance and clean neutral styling.
 * - Interactive: Tactile spring tap response on each step.
 */
export const AnimatedRequestStepper: React.FC<AnimatedRequestStepperProps> = ({
  currentStage = 2,
  onStepPress,
  style,
}) => {
  // Step 1: Checkmark spring pop & completion ripple
  const step1Scale = useRef(new Animated.Value(0)).current;
  const step1Ripple = useRef(new Animated.Value(0)).current;

  // Connector 1->2: Flowing beam animation
  const beamAnim = useRef(new Animated.Value(0)).current;

  // Step 2: Radar pulse waves (dual offset) & breathing dot
  const radar1Anim = useRef(new Animated.Value(0)).current;
  const radar2Anim = useRef(new Animated.Value(0)).current;
  const dotPulseAnim = useRef(new Animated.Value(0)).current;

  // Steps 3 & 4: Staggered entry
  const step3Anim = useRef(new Animated.Value(0)).current;
  const step4Anim = useRef(new Animated.Value(0)).current;

  // Micro tap scale feedback per step
  const tapScale1 = useRef(new Animated.Value(1)).current;
  const tapScale2 = useRef(new Animated.Value(1)).current;
  const tapScale3 = useRef(new Animated.Value(1)).current;
  const tapScale4 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Step 1 Entrance Pop & Ripple
    const step1Entrance = Animated.sequence([
      Animated.timing(step1Scale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.6)),
        useNativeDriver: true,
      }),
      Animated.timing(step1Ripple, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    // 2. Connector Flowing Beam Loop
    const beamLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(beamAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(beamAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(400),
      ])
    );

    // 3. Step 2 Radar Wave 1 Loop
    const radar1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(radar1Anim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(radar1Anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // 4. Step 2 Radar Wave 2 Loop (offset by 800ms)
    const radar2Loop = Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(radar2Anim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(radar2Anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // 5. Step 2 Breathing Dot Loop
    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(dotPulseAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 6. Steps 3 & 4 Cascade Entrance
    const pendingEntrance = Animated.stagger(150, [
      Animated.timing(step3Anim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(step4Anim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    // Start all animations
    step1Entrance.start();
    beamLoop.start();
    radar1Loop.start();
    radar2Loop.start();
    dotLoop.start();
    pendingEntrance.start();

    return () => {
      step1Entrance.stop();
      beamLoop.stop();
      radar1Loop.stop();
      radar2Loop.stop();
      dotLoop.stop();
      pendingEntrance.stop();
    };
  }, []);

  const triggerStepTap = (stepNumber: number, animVal: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animVal, {
        toValue: 0.9,
        duration: 90,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(animVal, {
        toValue: 1.0,
        friction: 3.5,
        tension: 110,
        useNativeDriver: true,
      }),
    ]).start();

    onStepPress?.(stepNumber);
  };

  // Interpolations
  const step1CheckScale = step1Scale.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });

  const step1RippleScale = step1Ripple.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.65],
  });

  const step1RippleOpacity = step1Ripple.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.65, 0.35, 0],
  });

  const beamTranslateX = beamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-16, 16],
  });

  const radar1Scale = radar1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.75],
  });

  const radar1Opacity = radar1Anim.interpolate({
    inputRange: [0, 0.3, 0.8, 1],
    outputRange: [0.65, 0.45, 0.15, 0],
  });

  const radar2Scale = radar2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.75],
  });

  const radar2Opacity = radar2Anim.interpolate({
    inputRange: [0, 0.3, 0.8, 1],
    outputRange: [0.65, 0.45, 0.15, 0],
  });

  const dotScale = dotPulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.35],
  });

  const step3Opacity = step3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const step3TranslateY = step3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 0],
  });

  const step4Opacity = step4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const step4TranslateY = step4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 0],
  });

  return (
    <View style={[styles.stepperCard, style]}>
      <View style={styles.stepperContainer}>
        {/* STEP 1: Request Sent (Completed) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => triggerStepTap(1, tapScale1)}
          style={styles.stepItem}
        >
          <Animated.View style={{ transform: [{ scale: tapScale1 }], alignItems: 'center' }}>
            <View style={styles.circleAnchor}>
              {/* Expanding completion ripple */}
              <Animated.View
                style={[
                  styles.greenRippleRing,
                  {
                    transform: [{ scale: step1RippleScale }],
                    opacity: step1RippleOpacity,
                  },
                ]}
              />

              {/* Solid Green Completed Badge */}
              <Animated.View
                style={[
                  styles.stepCircle,
                  styles.stepCompleted,
                  { transform: [{ scale: step1CheckScale }] },
                ]}
              >
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
              </Animated.View>
            </View>

            <Text style={styles.stepTitleActive}>Request Sent</Text>
            <Text style={styles.stepTimeSub}>Just now</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* CONNECTOR 1 -> 2 (Active Flowing Beam Track) */}
        <View style={styles.connectorContainer}>
          <View style={styles.beamTrack}>
            <Animated.View
              style={[
                styles.beamLight,
                { transform: [{ translateX: beamTranslateX }] },
              ]}
            />
          </View>
        </View>

        {/* STEP 2: Notified (In Progress / Active Radar) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => triggerStepTap(2, tapScale2)}
          style={styles.stepItem}
        >
          <Animated.View style={{ transform: [{ scale: tapScale2 }], alignItems: 'center' }}>
            <View style={styles.circleAnchor}>
              {/* Radar Wave 1 */}
              <Animated.View
                style={[
                  styles.radarRing,
                  {
                    transform: [{ scale: radar1Scale }],
                    opacity: radar1Opacity,
                  },
                ]}
              />

              {/* Radar Wave 2 (offset) */}
              <Animated.View
                style={[
                  styles.radarRing,
                  {
                    transform: [{ scale: radar2Scale }],
                    opacity: radar2Opacity,
                  },
                ]}
              />

              {/* Active Badge Container */}
              <View style={[styles.stepCircle, styles.stepActive]}>
                {/* Breathing Core Red Beacon Dot */}
                <Animated.View
                  style={[
                    styles.innerDot,
                    { transform: [{ scale: dotScale }] },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.stepTitleActive}>Notified</Text>
            <Text style={styles.stepTimeSub}>We'll notify them</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* CONNECTOR 2 -> 3 (Muted Track) */}
        <View style={styles.connectorContainer}>
          <View style={styles.stepLineMuted} />
        </View>

        {/* STEP 3: They Review (Pending) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => triggerStepTap(3, tapScale3)}
          style={styles.stepItem}
        >
          <Animated.View
            style={{
              transform: [{ scale: tapScale3 }, { translateY: step3TranslateY }],
              opacity: step3Opacity,
              alignItems: 'center',
            }}
          >
            <View style={styles.circleAnchor}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
            </View>

            <Text style={styles.stepTitlePending}>They Review</Text>
            <Text style={styles.stepTimeSub}>Can view profile</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* CONNECTOR 3 -> 4 (Muted Track) */}
        <View style={styles.connectorContainer}>
          <View style={styles.stepLineMuted} />
        </View>

        {/* STEP 4: Response (Pending) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => triggerStepTap(4, tapScale4)}
          style={styles.stepItem}
        >
          <Animated.View
            style={{
              transform: [{ scale: tapScale4 }, { translateY: step4TranslateY }],
              opacity: step4Opacity,
              alignItems: 'center',
            }}
          >
            <View style={styles.circleAnchor}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
            </View>

            <Text style={styles.stepTitlePending}>Response</Text>
            <Text style={styles.stepTimeSub}>You'll be notified</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    width: (width - 64) / 4,
  },
  circleAnchor: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  stepCompleted: {
    backgroundColor: '#059669',
    borderColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  greenRippleRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#059669',
    backgroundColor: 'rgba(5, 150, 105, 0.2)',
    zIndex: 1,
  },
  stepActive: {
    borderColor: '#E11D48',
    borderWidth: 2,
    backgroundColor: '#FFF1F2',
  },
  radarRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E11D48',
    backgroundColor: 'rgba(254, 205, 211, 0.35)',
    zIndex: 1,
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E11D48',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  stepTitleActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 2,
  },
  stepTitlePending: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 2,
  },
  stepTimeSub: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 13,
  },
  connectorContainer: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beamTrack: {
    width: 14,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#A7F3D0',
    overflow: 'hidden',
    position: 'relative',
  },
  beamLight: {
    width: 8,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#059669',
  },
  stepLineMuted: {
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#E2E8F0',
  },
});
