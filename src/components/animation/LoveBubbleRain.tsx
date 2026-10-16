// MARGAM — Love Bubble Rain Animation Component
// Delicate romantic bubbles with tiny hearts raining gently in the top hero celebration area.
// Fully GPU-accelerated (60 FPS) with staggered sinusoidal sway, soft glass sheen, and fade cascades.

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Heart } from 'lucide-react-native';

export interface LoveBubbleRainProps {
  /** Height of the confined rain area in pixels (default: 200) */
  height?: number;
  /** Number of love bubbles in the cascade (default: 14) */
  bubbleCount?: number;
  /** Whether the rain animation is active (default: true) */
  active?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

interface BubbleConfig {
  id: number;
  xPercent: number; // 0 to 100%
  size: number; // 12 to 22px
  duration: number; // 2400 to 3800ms
  delay: number; // staggered entrance ms
  swayDistance: number; // horizontal drift amplitude
  heartColor: string;
  heartFill: string;
  bubbleBg: string;
  borderColor: string;
}

// Pre-configured diverse romantic bubbles with organic distribution around hero illustration
const DEFAULT_BUBBLES: BubbleConfig[] = [
  {
    id: 1,
    xPercent: 12,
    size: 16,
    duration: 3200,
    delay: 0,
    swayDistance: 8,
    heartColor: '#E11D48',
    heartFill: '#F43F5E',
    bubbleBg: 'rgba(255, 241, 242, 0.85)',
    borderColor: 'rgba(251, 113, 133, 0.45)',
  },
  {
    id: 2,
    xPercent: 24,
    size: 20,
    duration: 3600,
    delay: 450,
    swayDistance: -10,
    heartColor: '#BE123C',
    heartFill: '#FB7185',
    bubbleBg: 'rgba(255, 241, 242, 0.9)',
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
  {
    id: 3,
    xPercent: 35,
    size: 14,
    duration: 2800,
    delay: 200,
    swayDistance: 6,
    heartColor: '#E11D48',
    heartFill: '#F43F5E',
    bubbleBg: 'rgba(254, 205, 211, 0.75)',
    borderColor: 'rgba(251, 113, 133, 0.5)',
  },
  {
    id: 4,
    xPercent: 48,
    size: 18,
    duration: 3400,
    delay: 900,
    swayDistance: -8,
    heartColor: '#F43F5E',
    heartFill: '#FDA4AF',
    bubbleBg: 'rgba(255, 241, 242, 0.85)',
    borderColor: 'rgba(251, 113, 133, 0.45)',
  },
  {
    id: 5,
    xPercent: 62,
    size: 22,
    duration: 3900,
    delay: 150,
    swayDistance: 12,
    heartColor: '#E11D48',
    heartFill: '#F43F5E',
    bubbleBg: 'rgba(255, 245, 245, 0.9)',
    borderColor: 'rgba(244, 63, 94, 0.45)',
  },
  {
    id: 6,
    xPercent: 74,
    size: 15,
    duration: 3000,
    delay: 600,
    swayDistance: -7,
    heartColor: '#BE123C',
    heartFill: '#FB7185',
    bubbleBg: 'rgba(254, 205, 211, 0.75)',
    borderColor: 'rgba(251, 113, 133, 0.5)',
  },
  {
    id: 7,
    xPercent: 86,
    size: 17,
    duration: 3300,
    delay: 350,
    swayDistance: 9,
    heartColor: '#E11D48',
    heartFill: '#F43F5E',
    bubbleBg: 'rgba(255, 241, 242, 0.85)',
    borderColor: 'rgba(251, 113, 133, 0.45)',
  },
  {
    id: 8,
    xPercent: 8,
    size: 13,
    duration: 2700,
    delay: 1100,
    swayDistance: -6,
    heartColor: '#F43F5E',
    heartFill: '#FDA4AF',
    bubbleBg: 'rgba(255, 241, 242, 0.8)',
    borderColor: 'rgba(251, 113, 133, 0.4)',
  },
  {
    id: 9,
    xPercent: 28,
    size: 15,
    duration: 3100,
    delay: 1400,
    swayDistance: 7,
    heartColor: '#E11D48',
    heartFill: '#F43F5E',
    bubbleBg: 'rgba(255, 245, 245, 0.85)',
    borderColor: 'rgba(244, 63, 94, 0.45)',
  },
  {
    id: 10,
    xPercent: 42,
    size: 19,
    duration: 3700,
    delay: 1700,
    swayDistance: -11,
    heartColor: '#BE123C',
    heartFill: '#FB7185',
    bubbleBg: 'rgba(254, 205, 211, 0.8)',
    borderColor: 'rgba(251, 113, 133, 0.5)',
  },
  {
    id: 11,
    xPercent: 55,
    size: 14,
    duration: 2900,
    delay: 1250,
    swayDistance: 8,
    heartColor: '#E11D48',
    heartFill: '#F43F5E',
    bubbleBg: 'rgba(255, 241, 242, 0.85)',
    borderColor: 'rgba(251, 113, 133, 0.45)',
  },
  {
    id: 12,
    xPercent: 68,
    size: 17,
    duration: 3400,
    delay: 1950,
    swayDistance: -9,
    heartColor: '#F43F5E',
    heartFill: '#FDA4AF',
    bubbleBg: 'rgba(255, 241, 242, 0.85)',
    borderColor: 'rgba(251, 113, 133, 0.45)',
  },
  {
    id: 13,
    xPercent: 82,
    size: 13,
    duration: 2600,
    delay: 1600,
    swayDistance: 6,
    heartColor: '#BE123C',
    heartFill: '#FB7185',
    bubbleBg: 'rgba(255, 245, 245, 0.8)',
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
  {
    id: 14,
    xPercent: 92,
    size: 16,
    duration: 3100,
    delay: 800,
    swayDistance: -8,
    heartColor: '#E11D48',
    heartFill: '#F43F5E',
    bubbleBg: 'rgba(254, 205, 211, 0.8)',
    borderColor: 'rgba(251, 113, 133, 0.5)',
  },
];

interface SingleBubbleItemProps {
  config: BubbleConfig;
  totalHeight: number;
}

const SingleBubbleItem: React.FC<SingleBubbleItemProps> = ({ config, totalHeight }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const runLoop = () => {
      animValue.setValue(0);
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(animValue, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isMounted) {
          // Re-run with zero initial delay for continuous looping rain
          const continuousCycle = () => {
            animValue.setValue(0);
            Animated.timing(animValue, {
              toValue: 1,
              duration: config.duration,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start(() => {
              if (isMounted) continuousCycle();
            });
          };
          continuousCycle();
        }
      });
    };

    runLoop();

    return () => {
      isMounted = false;
      animValue.stopAnimation();
    };
  }, [animValue, config.delay, config.duration]);

  // Downward rain translation
  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-config.size - 10, totalHeight + 15],
  });

  // Soft horizontal sinusoidal sway drift
  const translateX = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, config.swayDistance, 0, -config.swayDistance, 0],
  });

  // Fade in at top, stay visible near airplane, fade out as it reaches bottom
  const opacity = animValue.interpolate({
    inputRange: [0, 0.12, 0.75, 1],
    outputRange: [0, 0.85, 0.85, 0],
  });

  // Gentle pop and breathing scale
  const scale = animValue.interpolate({
    inputRange: [0, 0.15, 0.8, 1],
    outputRange: [0.5, 1, 1, 0.65],
  });

  const heartSize = Math.max(6, Math.round(config.size * 0.44));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bubbleWrapper,
        {
          left: `${config.xPercent}%`,
          width: config.size,
          height: config.size,
          transform: [{ translateY }, { translateX }, { scale }],
          opacity,
        },
      ]}
    >
      <View
        style={[
          styles.bubbleDisc,
          {
            width: config.size,
            height: config.size,
            borderRadius: config.size / 2,
            backgroundColor: config.bubbleBg,
            borderColor: config.borderColor,
          },
        ]}
      >
        {/* Specular glass reflection highlight */}
        <View
          style={[
            styles.specularHighlight,
            {
              top: Math.max(1, Math.round(config.size * 0.14)),
              left: Math.max(2, Math.round(config.size * 0.18)),
              width: Math.max(3, Math.round(config.size * 0.28)),
              height: Math.max(2, Math.round(config.size * 0.18)),
              borderRadius: Math.round(config.size * 0.14),
            },
          ]}
        />

        {/* Floating Heart core */}
        <Heart size={heartSize} color={config.heartColor} fill={config.heartFill} />
      </View>
    </Animated.View>
  );
};

export const LoveBubbleRain: React.FC<LoveBubbleRainProps> = ({
  height = 190,
  bubbleCount = 14,
  active = true,
  style,
}) => {
  if (!active) return null;

  const bubbles = DEFAULT_BUBBLES.slice(0, bubbleCount);

  return (
    <View style={[styles.container, { height }, style]} pointerEvents="none">
      {bubbles.map((b) => (
        <SingleBubbleItem key={b.id} config={b} totalHeight={height} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1, // subtle background layer behind hero text and close to animation
    pointerEvents: 'none',
  },
  bubbleWrapper: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleDisc: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  specularHighlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});
