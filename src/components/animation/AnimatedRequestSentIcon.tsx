import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import { Heart } from 'lucide-react-native';

export interface AnimatedRequestSentIconProps {
  /** Size multiplier or width override (default: 140) */
  size?: number;
  /** Whether the user can tap the icon to trigger an extra celebration bounce */
  interactive?: boolean;
  /** Optional callback fired when the icon is tapped */
  onTap?: () => void;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * AnimatedRequestSentIcon
 *
 * A multi-layered celebration icon featured on the Request Sent Successfully screen:
 * 1. Swoop Flight Entrance: The paper airplane swoops in with an elastic spring launch.
 * 2. Aerodynamic Breeze Float: Fluid looping bobbing, banking tilt, and drift on a gentle breeze.
 * 3. Radiant Pulse Halo: Expanding and fading soft circular aura waves behind the plane.
 * 4. Rhythmic Heartbeat: The floating heart badge pulses with an organic dual-beat rhythm.
 * 5. Gleaming Sparkle Twinkle: Diamond stars and confetti particles shimmering along the flight trail.
 * 6. Interactive Tap Bounce: Playful tactile spring feedback if tapped.
 */
export const AnimatedRequestSentIcon: React.FC<AnimatedRequestSentIconProps> = ({
  size = 140,
  interactive = true,
  onTap,
  style,
}) => {
  // 1. Airplane Flight Entrance Animation Values
  const planeEntrance = useRef(new Animated.Value(0)).current;

  // 2. Ambient Aerodynamic Breeze Float Loop
  const floatAnim = useRef(new Animated.Value(0)).current;

  // 3. Radiant Aura Pulse Wave
  const auraPulseAnim = useRef(new Animated.Value(0)).current;

  // 4. Heart Badge Entrance & Heartbeat Rhythm
  const heartEntranceAnim = useRef(new Animated.Value(0)).current;
  const heartbeatAnim = useRef(new Animated.Value(1)).current;

  // 5. Sparkle Twinkle Animations (staggered phases)
  const sparkle1Anim = useRef(new Animated.Value(0)).current;
  const sparkle2Anim = useRef(new Animated.Value(0)).current;
  const sparkle3Anim = useRef(new Animated.Value(0)).current;

  // 6. Interactive Tap Spring Feedback
  const tapScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // A. Master Entrance Sequence
    const entranceAnimation = Animated.parallel([
      // Airplane swoops up along flight path
      Animated.timing(planeEntrance, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.back(1.4)), // Gentle elastic overshoot
        useNativeDriver: true,
      }),
      // Heart badge pops in with a bouncy spring right after plane reaches apex
      Animated.sequence([
        Animated.delay(350),
        Animated.spring(heartEntranceAnim, {
          toValue: 1,
          friction: 4,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // B. Continuous Aerodynamic Breeze Float Loop (Paper plane glides gracefully)
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // C. Continuous Aura Radiance Pulse (Broadcast signal effect)
    const auraLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(auraPulseAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(auraPulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // D. Continuous Heartbeat Rhythm (lub-dub... lub-dub...)
    const heartbeatLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        // Beat 1 (lub)
        Animated.timing(heartbeatAnim, {
          toValue: 1.22,
          duration: 130,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1.04,
          duration: 110,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        // Beat 2 (dub)
        Animated.timing(heartbeatAnim, {
          toValue: 1.15,
          duration: 120,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1.0,
          duration: 180,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        // Rest interval
        Animated.delay(1500),
      ])
    );

    // E. Continuous Sparkle Twinkle Loops (staggered)
    const sparkle1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkle1Anim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sparkle1Anim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const sparkle2Loop = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(sparkle2Anim, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sparkle2Anim, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const sparkle3Loop = Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(sparkle3Anim, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sparkle3Anim, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Start all animations
    entranceAnimation.start();
    floatLoop.start();
    auraLoop.start();
    heartbeatLoop.start();
    sparkle1Loop.start();
    sparkle2Loop.start();
    sparkle3Loop.start();

    return () => {
      entranceAnimation.stop();
      floatLoop.stop();
      auraLoop.stop();
      heartbeatLoop.stop();
      sparkle1Loop.stop();
      sparkle2Loop.stop();
      sparkle3Loop.stop();
    };
  }, []);

  // Handle optional interactive tap
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(tapScale, {
        toValue: 1.12,
        duration: 110,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(tapScale, {
        toValue: 1.0,
        friction: 3.5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onTap?.();
  };

  // Interpolations:
  // 1. Swoop Flight Entrance
  const planeTranslateX = planeEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [-36, 0],
  });
  const planeTranslateY = planeEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });
  const planeScale = planeEntrance.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.2, 0.7, 1.0],
  });
  const planeRotate = planeEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: ['-25deg', '0deg'],
  });
  const planeOpacity = planeEntrance.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.9, 1],
  });

  // 2. Aerodynamic Breeze Float
  const breezeY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -7],
  });
  const breezeX = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2.5],
  });
  const breezeRotate = floatAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '-3.5deg', '2.5deg'],
  });

  // 3. Radiant Aura Waves
  const auraScale = auraPulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 1.4],
  });
  const auraOpacity = auraPulseAnim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 0.65, 0.25, 0],
  });

  // 4. Heart Badge Entrance & Combined Scale
  const heartEntranceScale = heartEntranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const combinedHeartScale = Animated.multiply(heartEntranceScale, heartbeatAnim);

  // 5. Sparkles
  const sparkle1Scale = sparkle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 1.3],
  });
  const sparkle1Opacity = sparkle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 1],
  });

  const sparkle2Scale = sparkle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.25],
  });
  const sparkle2Opacity = sparkle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.95],
  });

  const sparkle3Scale = sparkle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1.2],
  });
  const sparkle3Opacity = sparkle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.85],
  });

  const scaleFactor = size / 140;

  return (
    <TouchableOpacity
      activeOpacity={interactive ? 0.92 : 1}
      onPress={interactive ? handlePress : undefined}
      disabled={!interactive}
      style={[styles.wrapper, { transform: [{ scale: scaleFactor }] }, style]}
    >
      <Animated.View style={[styles.container, { transform: [{ scale: tapScale }] }]}>
        {/* Layer 1: Soft Glowing Radiant Aura Wave */}
        <Animated.View
          style={[
            styles.auraRing,
            {
              transform: [{ scale: auraScale }],
              opacity: auraOpacity,
            },
          ]}
        />
        <View style={styles.ambientCoreGlow} />

        {/* Layer 2: Curved Flight Path & Trail */}
        <Svg width={140} height={120} viewBox="0 0 140 120" style={styles.svgLayer}>
          <Defs>
            <LinearGradient id="heroTrailGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.4" />
              <Stop offset="50%" stopColor="#FB7185" stopOpacity="0.75" />
              <Stop offset="100%" stopColor="#E11D48" stopOpacity="0.9" />
            </LinearGradient>
          </Defs>

          {/* Dotted Flight Trajectory */}
          <Path
            d="M 18 95 Q 52 52 86 56 T 122 30"
            stroke="url(#heroTrailGrad)"
            strokeWidth={2.4}
            strokeDasharray="4,4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Static Waypoint Dots along Trail */}
          <Circle cx={24} cy={88} r={3} fill="#FB7185" opacity={0.65} />
          <Circle cx={54} cy={54} r={3.5} fill="#F43F5E" opacity={0.75} />
          <Circle cx={82} cy={44} r={3} fill="#E11D48" opacity={0.8} />
          <Circle cx={18} cy={45} r={2} fill="#FDA4AF" opacity={0.5} />
        </Svg>

        {/* Layer 3: Twinkling Sparkle Stars */}
        {/* Sparkle 1: Top-Right Radiant Gold Diamond Star */}
        <Animated.View
          style={[
            styles.sparkle1Pos,
            {
              transform: [{ scale: sparkle1Scale }],
              opacity: sparkle1Opacity,
            },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24">
            <Path
              d="M 12 0 Q 12 12 24 12 Q 12 12 12 24 Q 12 12 0 12 Q 12 12 12 0 Z"
              fill="#F59E0B"
            />
          </Svg>
        </Animated.View>

        {/* Sparkle 2: Mid-Left Soft Rose Twinkle */}
        <Animated.View
          style={[
            styles.sparkle2Pos,
            {
              transform: [{ scale: sparkle2Scale }],
              opacity: sparkle2Opacity,
            },
          ]}
        >
          <Svg width={12} height={12} viewBox="0 0 24 24">
            <Path
              d="M 12 0 Q 12 12 24 12 Q 12 12 12 24 Q 12 12 0 12 Q 12 12 12 0 Z"
              fill="#FB7185"
            />
          </Svg>
        </Animated.View>

        {/* Sparkle 3: Bottom-Right Magenta Accent Dot */}
        <Animated.View
          style={[
            styles.sparkle3Pos,
            {
              transform: [{ scale: sparkle3Scale }],
              opacity: sparkle3Opacity,
            },
          ]}
        >
          <View style={styles.magentaAccentDot} />
        </Animated.View>

        {/* Layer 4: The Paper Airplane (Double Animated Hierarchy) */}
        {/* Outer view: Swoop entrance trajectory */}
        <Animated.View
          style={[
            styles.planePositioner,
            {
              opacity: planeOpacity,
              transform: [
                { translateX: planeTranslateX },
                { translateY: planeTranslateY },
                { scale: planeScale },
                { rotate: planeRotate },
              ],
            },
          ]}
        >
          {/* Inner view: Continuous aerodynamic glide on breeze */}
          <Animated.View
            style={{
              transform: [
                { translateX: breezeX },
                { translateY: breezeY },
                { rotate: breezeRotate },
              ],
            }}
          >
            <Svg width={70} height={70} viewBox="0 0 70 70">
              <Defs>
                <LinearGradient id="paperPlaneWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#FB7185" />
                  <Stop offset="45%" stopColor="#F43F5E" />
                  <Stop offset="100%" stopColor="#E11D48" />
                </LinearGradient>
              </Defs>

              {/* Central Main Paper Plane Fuselage & Wings */}
              <Path
                d="M 14 50 L 64 12 L 44 58 L 32 44 L 22 53 Z"
                fill="url(#paperPlaneWingGrad)"
              />

              {/* Upper Fold Highlight (adds 3D realistic lighting) */}
              <Path
                d="M 64 12 L 32 44 L 14 50 Z"
                fill="#FDA4AF"
                opacity={0.82}
              />

              {/* Crisp Crease Line Accent */}
              <Path
                d="M 64 12 L 32 44"
                stroke="#FFFFFF"
                strokeWidth={1}
                opacity={0.65}
              />
            </Svg>
          </Animated.View>
        </Animated.View>

        {/* Layer 5: Floating Heart Badge with Heartbeat Rhythm */}
        <Animated.View
          style={[
            styles.floatingHeartBadge,
            {
              opacity: heartEntranceAnim,
              transform: [{ scale: combinedHeartScale }],
            },
          ]}
        >
          <Heart size={14} color="#E11D48" fill="#E11D48" />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: 140,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  ambientCoreGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFE4E6',
    opacity: 0.45,
  },
  auraRing: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1.5,
    borderColor: '#FB7185',
    backgroundColor: 'rgba(254, 205, 211, 0.28)',
  },
  planePositioner: {
    position: 'absolute',
    left: 44,
    top: 22,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  floatingHeartBadge: {
    position: 'absolute',
    top: 8,
    right: 14,
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
  sparkle1Pos: {
    position: 'absolute',
    top: 10,
    right: 32,
    zIndex: 15,
  },
  sparkle2Pos: {
    position: 'absolute',
    top: 38,
    left: 20,
    zIndex: 15,
  },
  sparkle3Pos: {
    position: 'absolute',
    bottom: 24,
    right: 34,
    zIndex: 15,
  },
  magentaAccentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EC4899',
    opacity: 0.85,
  },
});
