import { Platform, Vibration, Dimensions, Animated, AccessibilityInfo } from 'react-native';

const { width } = Dimensions.get('window');

// -------------------------------------------------------------
// 1. Centralized Animation Timings (in milliseconds)
// -------------------------------------------------------------
export const ANIMATION_TIMINGS = {
  FAST: 140, // Button compress, icon toggles, quick opacity
  MEDIUM: 260, // Navigation, modal transitions, card exits
  SLOW: 380, // Screen entry, spring settling
} as const;

// -------------------------------------------------------------
// 2. Spring Physics Configurations
// -------------------------------------------------------------
export const SPRING_CONFIGS = {
  SWIPE_EXIT: {
    friction: 6,
    tension: 45,
    useNativeDriver: false,
  },
  SNAP_BACK: {
    friction: 7,
    tension: 40,
    useNativeDriver: false,
  },
  NEXT_CARD: {
    friction: 8,
    tension: 35,
    useNativeDriver: false,
  },
  BUTTON_PRESS: {
    friction: 4,
    tension: 55,
    useNativeDriver: false,
  },
  REDUCE_MOTION: {
    duration: 180,
    useNativeDriver: false,
  },
} as const;

// -------------------------------------------------------------
// 3. Gesture Physics Constants
// -------------------------------------------------------------
export const GESTURE_CONSTANTS = {
  CARD_WIDTH: width - 40,
  SWIPE_DISTANCE_THRESHOLD: 110, // ~30-35% of card width
  SWIPE_VELOCITY_THRESHOLD: 0.65, // Fast flick velocity
  MAX_ROTATION_DEG: 12, // Maximum subtle tilt angle
  VERTICAL_DRAG_FACTOR: 0.08, // Subtle vertical follow
} as const;

// -------------------------------------------------------------
// 4. Animation State Machine
// -------------------------------------------------------------
export type SwipeAnimationState =
  | 'IDLE'
  | 'DRAGGING'
  | 'THRESHOLD_REACHED'
  | 'SWIPING_LEFT'
  | 'SWIPING_RIGHT'
  | 'RETURNING'
  | 'SAVING'
  | 'UNDOING'
  | 'LOADING_NEXT'
  | 'EMPTY';

// -------------------------------------------------------------
// 5. Tactile Haptic Feedback (Platform-adaptive)
// -------------------------------------------------------------
export type HapticType =
  | 'threshold'
  | 'swipeComplete'
  | 'save'
  | 'undo'
  | 'mutualInterest'
  | 'buttonPress';

export function triggerHaptic(type: HapticType): void {
  try {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      switch (type) {
        case 'threshold':
          // Crisp, subtle micro-tick when crossing the swipe threshold
          Vibration.vibrate(10);
          break;
        case 'swipeComplete':
          // Subtle completion feedback
          Vibration.vibrate(14);
          break;
        case 'save':
          // Gentle confirmation tap
          Vibration.vibrate(12);
          break;
        case 'undo':
          // Subtle rewind tap
          Vibration.vibrate(12);
          break;
        case 'mutualInterest':
          // Two-stage celebration pulse
          Vibration.vibrate([0, 16, 50, 22]);
          break;
        case 'buttonPress':
          Vibration.vibrate(8);
          break;
      }
    }
  } catch (_e) {
    // Graceful fallback on environments without vibration support
  }
}

// -------------------------------------------------------------
// 6. Reduce Motion Checker Hook
// -------------------------------------------------------------
let isReduceMotionActive = false;
AccessibilityInfo.isReduceMotionEnabled()
  .then((enabled) => {
    isReduceMotionActive = enabled;
  })
  .catch(() => {
    isReduceMotionActive = false;
  });

AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
  isReduceMotionActive = enabled;
});

export function getIsReduceMotionActive(): boolean {
  return isReduceMotionActive;
}

// -------------------------------------------------------------
// 7. Stack Interpolations Generator
// -------------------------------------------------------------
export function createCardStackInterpolations(pan: Animated.ValueXY) {
  const reduceMotion = getIsReduceMotionActive();
  const maxRotation = reduceMotion ? '1deg' : `${GESTURE_CONSTANTS.MAX_ROTATION_DEG}deg`;
  const minRotation = reduceMotion ? '-1deg' : `-${GESTURE_CONSTANTS.MAX_ROTATION_DEG}deg`;

  // Top Card: Rotation follows horizontal movement (smooth and subtle: 50px ≈ +2°, 150px ≈ +6°, max 12°)
  const rotate = pan.x.interpolate({
    inputRange: [-width * 0.75, 0, width * 0.75],
    outputRange: [minRotation, '0deg', maxRotation],
    extrapolate: 'clamp',
  });

  // Top Card: Vertical follow (subtle dragY * 0.08)
  const verticalFollow = pan.y.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [-300 * GESTURE_CONSTANTS.VERTICAL_DRAG_FACTOR, 0, 300 * GESTURE_CONSTANTS.VERTICAL_DRAG_FACTOR],
    extrapolate: 'clamp',
  });

  // Top Card: Subtle fade out near the screen edges
  const cardOpacity = pan.x.interpolate({
    inputRange: [-width * 0.9, -GESTURE_CONSTANTS.SWIPE_DISTANCE_THRESHOLD, 0, GESTURE_CONSTANTS.SWIPE_DISTANCE_THRESHOLD, width * 0.9],
    outputRange: [0.25, 0.96, 1.0, 0.96, 0.25],
    extrapolate: 'clamp',
  });

  // 2nd Card: Smoothly scales up (0.96 -> 1.0), lifts (y: 8 -> 0), and fades in (0.85 -> 1.0)
  const nextCardScale = pan.x.interpolate({
    inputRange: [-GESTURE_CONSTANTS.CARD_WIDTH * 0.7, 0, GESTURE_CONSTANTS.CARD_WIDTH * 0.7],
    outputRange: [1.0, 0.96, 1.0],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = pan.x.interpolate({
    inputRange: [-GESTURE_CONSTANTS.CARD_WIDTH * 0.7, 0, GESTURE_CONSTANTS.CARD_WIDTH * 0.7],
    outputRange: [1.0, 0.85, 1.0],
    extrapolate: 'clamp',
  });

  const nextCardTranslateY = pan.x.interpolate({
    inputRange: [-GESTURE_CONSTANTS.CARD_WIDTH * 0.7, 0, GESTURE_CONSTANTS.CARD_WIDTH * 0.7],
    outputRange: [0, 8, 0],
    extrapolate: 'clamp',
  });

  // 3rd Card: Shifts from 3rd tier into 2nd tier (scale: 0.92 -> 0.96, opacity: 0.50 -> 0.85, y: 16 -> 8)
  const thirdCardScale = pan.x.interpolate({
    inputRange: [-GESTURE_CONSTANTS.CARD_WIDTH * 0.7, 0, GESTURE_CONSTANTS.CARD_WIDTH * 0.7],
    outputRange: [0.96, 0.92, 0.96],
    extrapolate: 'clamp',
  });

  const thirdCardOpacity = pan.x.interpolate({
    inputRange: [-GESTURE_CONSTANTS.CARD_WIDTH * 0.7, 0, GESTURE_CONSTANTS.CARD_WIDTH * 0.7],
    outputRange: [0.85, 0.50, 0.85],
    extrapolate: 'clamp',
  });

  const thirdCardTranslateY = pan.x.interpolate({
    inputRange: [-GESTURE_CONSTANTS.CARD_WIDTH * 0.7, 0, GESTURE_CONSTANTS.CARD_WIDTH * 0.7],
    outputRange: [8, 16, 8],
    extrapolate: 'clamp',
  });

  // Swipe Left Overlay (PASS ✕): starts invisible at small movement, 0.35 at moderate, 0.92 at threshold
  const passOverlayOpacity = pan.x.interpolate({
    inputRange: [-GESTURE_CONSTANTS.SWIPE_DISTANCE_THRESHOLD, -45, -15, 0],
    outputRange: [0.92, 0.35, 0, 0],
    extrapolate: 'clamp',
  });

  const passOverlayScale = pan.x.interpolate({
    inputRange: [-GESTURE_CONSTANTS.SWIPE_DISTANCE_THRESHOLD, -20, 0],
    outputRange: [1.06, 0.92, 0.92],
    extrapolate: 'clamp',
  });

  // Swipe Right Overlay (INTEREST ❤️): starts invisible at small movement, 0.35 at moderate, 0.92 at threshold
  const likeOverlayOpacity = pan.x.interpolate({
    inputRange: [0, 15, 45, GESTURE_CONSTANTS.SWIPE_DISTANCE_THRESHOLD],
    outputRange: [0, 0, 0.35, 0.92],
    extrapolate: 'clamp',
  });

  const likeOverlayScale = pan.x.interpolate({
    inputRange: [0, 20, GESTURE_CONSTANTS.SWIPE_DISTANCE_THRESHOLD],
    outputRange: [0.92, 0.92, 1.06],
    extrapolate: 'clamp',
  });

  return {
    rotate,
    verticalFollow,
    cardOpacity,
    nextCardScale,
    nextCardOpacity,
    nextCardTranslateY,
    thirdCardScale,
    thirdCardOpacity,
    thirdCardTranslateY,
    passOverlayOpacity,
    passOverlayScale,
    likeOverlayOpacity,
    likeOverlayScale,
  };
}
