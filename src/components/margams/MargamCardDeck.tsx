// MARGAM — Card Deck Component
// High-performance, 60fps physics-driven swipe deck
// Matches the reference design with 3D Red Love button, responsive page fitting,
// and fluid spring gesture tracking.

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  Pressable,
} from 'react-native';
import {
  X,
  Heart,
  Star,
  RotateCcw,
  CheckCircle2,
  Briefcase,
  MapPin,
  Sparkles,
  ChevronRight,
  Camera,
  Map as MapIcon,
} from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const TargetIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);
import { ThreeDActionButtonsRow } from './ThreeDActionButtons';
import { MargamProfileCandidate } from '../../types';
import {
  recordSwipeAction,
  undoLastSwipeAction,
  toggleSaveCandidate,
  isCandidateSaved,
} from '../../services/swipeDiscoveryService';
import {
  createCardStackInterpolations,
  triggerHaptic,
  GESTURE_CONSTANTS,
  SPRING_CONFIGS,
  ANIMATION_TIMINGS,
} from '../../utils/swipeAnimationEngine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, 410);

// Responsive dimensioning so the card and all controls fit inside the viewport
const isCompactScreen = SCREEN_HEIGHT < 780;
const CARD_HEIGHT = isCompactScreen ? 365 : Math.min(410, Math.round(SCREEN_HEIGHT * 0.48));
const PHOTO_HEIGHT = Math.round(CARD_HEIGHT * 0.54);
const INFO_HEIGHT = CARD_HEIGHT - PHOTO_HEIGHT;

interface MargamCardDeckProps {
  candidates: MargamProfileCandidate[];
  selectedMargam: string;
  onSelectCandidate: (candidate: MargamProfileCandidate) => void;
  onWhyThisMatch: (candidate: MargamProfileCandidate) => void;
  onShowInterest: (candidate: MargamProfileCandidate) => void;
  onPassCandidate: (candidate: MargamProfileCandidate) => void;
  onOpenCandidateProfile?: (candidate: MargamProfileCandidate) => void;
  onOpenPhotoViewer?: (candidate: MargamProfileCandidate) => void;
  onOpenMargamDetail?: (margamName: string) => void;
  onOpenComparePaths?: (candidate: MargamProfileCandidate) => void;
  onOpenSavedProfiles?: () => void;
  onOpenFilterPanel?: () => void;
  onMoreOptions?: (candidate: MargamProfileCandidate) => void;
  onChangeMargam?: () => void;
}

export const MargamCardDeck: React.FC<MargamCardDeckProps> = ({
  candidates,
  selectedMargam,
  onSelectCandidate,
  onWhyThisMatch,
  onShowInterest,
  onPassCandidate,
  onOpenCandidateProfile,
  onOpenPhotoViewer,
  onOpenMargamDetail,
  onOpenComparePaths,
  onOpenSavedProfiles,
  onOpenFilterPanel,
  onMoreOptions,
  onChangeMargam,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [historyStack, setHistoryStack] = useState<{ candidate: MargamProfileCandidate; action: 'PASS' | 'INTEREST' }[]>([]);
  const [saveToastText, setSaveToastText] = useState<string | null>(null);

  // Animation values
  const pan = useRef(new Animated.ValueXY()).current;
  const isTransitioning = useRef(false);
  const thresholdHapticTriggered = useRef(false);

  // Micro-interaction button scales & 3D depression physics
  const undoBtnScale = useRef(new Animated.Value(1)).current;
  const undoBtnDepress = useRef(new Animated.Value(0)).current;
  const passBtnScale = useRef(new Animated.Value(1)).current;
  const passBtnDepress = useRef(new Animated.Value(0)).current;
  const likeBtnScale = useRef(new Animated.Value(1)).current;
  const likeBtnDepress = useRef(new Animated.Value(0)).current; // 3D mechanical press down
  const saveBtnScale = useRef(new Animated.Value(1)).current;
  const saveBtnDepress = useRef(new Animated.Value(0)).current;

  // Save Toast floating animation
  const saveToastAnim = useRef(new Animated.Value(0)).current;
  const saveToastY = useRef(new Animated.Value(8)).current;

  // Active candidates list & stack cards
  const isEndOfQueue = candidates.length === 0 || currentIndex >= candidates.length;
  const currentCandidate = !isEndOfQueue ? candidates[currentIndex] : null;
  const nextCandidate =
    !isEndOfQueue && currentIndex + 1 < candidates.length
      ? candidates[currentIndex + 1]
      : null;
  const thirdCandidate =
    !isEndOfQueue && currentIndex + 2 < candidates.length
      ? candidates[currentIndex + 2]
      : null;

  const isCurrentSaved = currentCandidate ? isCandidateSaved(currentCandidate.id) : false;

  // Card stack interpolations
  const {
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
  } = createCardStackInterpolations(pan);

  // Reset pan on card index change
  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    isTransitioning.current = false;
  }, [currentIndex]);

  const handleCompleteSwipe = (isRightSwipe: boolean) => {
    if (!currentCandidate) {
      isTransitioning.current = false;
      return;
    }

    const cand = currentCandidate;
    setHistoryStack((prev) => [...prev, { candidate: cand, action: isRightSwipe ? 'INTEREST' : 'PASS' }]);

    setTimeout(() => {
      recordSwipeAction({
        profileId: cand.id,
        actionType: isRightSwipe ? 'INTEREST_SHOWN' : 'PASSED',
        source: 'MARGAMS_SWIPE',
        margamId: selectedMargam,
      });
    }, 0);

    pan.setValue({ x: 0, y: 0 });
    thresholdHapticTriggered.current = false;
    isTransitioning.current = false;
    setCurrentIndex((prev) => prev + 1);

    if (isRightSwipe) {
      onShowInterest(cand);
    } else {
      onPassCandidate(cand);
    }
  };

  // Fluid, responsive PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (isTransitioning.current) return false;
        return (
          Math.abs(gestureState.dx) > 7 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (isTransitioning.current) return;
        // Dampen Y tracking slightly so card feels physically guided
        pan.setValue({ x: gestureState.dx, y: gestureState.dy * 0.32 });

        const isPastThreshold = Math.abs(gestureState.dx) >= 85;
        if (isPastThreshold && !thresholdHapticTriggered.current) {
          triggerHaptic('threshold');
          thresholdHapticTriggered.current = true;
        } else if (!isPastThreshold && thresholdHapticTriggered.current) {
          thresholdHapticTriggered.current = false;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isTransitioning.current) return;

        const isDistance = Math.abs(gestureState.dx) > 85;
        const isFlick = Math.abs(gestureState.vx) > 0.4;

        if ((isDistance || isFlick) && gestureState.dx > 0) {
          // Swipe Right: Interest
          isTransitioning.current = true;
          triggerHaptic('swipeComplete');
          Animated.timing(pan, {
            toValue: { x: SCREEN_WIDTH * 1.35, y: gestureState.dy * 0.2 },
            duration: 210,
            useNativeDriver: false,
          }).start(() => handleCompleteSwipe(true));
        } else if ((isDistance || isFlick) && gestureState.dx < 0) {
          // Swipe Left: Pass
          isTransitioning.current = true;
          triggerHaptic('swipeComplete');
          Animated.timing(pan, {
            toValue: { x: -SCREEN_WIDTH * 1.35, y: gestureState.dy * 0.2 },
            duration: 210,
            useNativeDriver: false,
          }).start(() => handleCompleteSwipe(false));
        } else {
          // Snap back smoothly
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            tension: 50,
            useNativeDriver: false,
          }).start();
          thresholdHapticTriggered.current = false;
        }
      },
    })
  ).current;

  // 3D Red Love Button Trigger
  const triggerInterest = () => {
    if (!currentCandidate || isTransitioning.current) return;
    isTransitioning.current = true;
    triggerHaptic('buttonPress');

    // 3D mechanical press down & spring rebound
    Animated.parallel([
      Animated.sequence([
        Animated.timing(likeBtnDepress, { toValue: 3, duration: 60, useNativeDriver: false }),
        Animated.spring(likeBtnDepress, { toValue: 0, friction: 4, tension: 50, useNativeDriver: false }),
      ]),
      Animated.sequence([
        Animated.timing(likeBtnScale, { toValue: 0.90, duration: 60, useNativeDriver: false }),
        Animated.spring(likeBtnScale, { toValue: 1.05, friction: 4, tension: 50, useNativeDriver: false }),
        Animated.spring(likeBtnScale, { toValue: 1.0, friction: 4, tension: 50, useNativeDriver: false }),
      ]),
    ]).start();

    // Smooth card glide right
    Animated.timing(pan, {
      toValue: { x: SCREEN_WIDTH * 1.35, y: -20 },
      duration: 220,
      useNativeDriver: false,
    }).start(() => handleCompleteSwipe(true));
  };

  // Pass Button Trigger
  const triggerPass = () => {
    if (!currentCandidate || isTransitioning.current) return;
    isTransitioning.current = true;
    triggerHaptic('buttonPress');

    Animated.parallel([
      Animated.sequence([
        Animated.timing(passBtnDepress, { toValue: 2.5, duration: 60, useNativeDriver: false }),
        Animated.spring(passBtnDepress, { toValue: 0, friction: 4, tension: 50, useNativeDriver: false }),
      ]),
      Animated.sequence([
        Animated.timing(passBtnScale, { toValue: 0.90, duration: 60, useNativeDriver: false }),
        Animated.spring(passBtnScale, { toValue: 1.05, friction: 4, tension: 50, useNativeDriver: false }),
        Animated.spring(passBtnScale, { toValue: 1.0, friction: 4, tension: 50, useNativeDriver: false }),
      ]),
    ]).start();

    Animated.timing(pan, {
      toValue: { x: -SCREEN_WIDTH * 1.35, y: -20 },
      duration: 220,
      useNativeDriver: false,
    }).start(() => handleCompleteSwipe(false));
  };

  // Undo Button Trigger
  const triggerUndo = () => {
    if (historyStack.length === 0 || isTransitioning.current) return;
    isTransitioning.current = true;
    triggerHaptic('undo');

    Animated.parallel([
      Animated.sequence([
        Animated.timing(undoBtnDepress, { toValue: 2.5, duration: 60, useNativeDriver: false }),
        Animated.spring(undoBtnDepress, { toValue: 0, friction: 4, tension: 50, useNativeDriver: false }),
      ]),
      Animated.sequence([
        Animated.timing(undoBtnScale, { toValue: 0.90, duration: 60, useNativeDriver: false }),
        Animated.spring(undoBtnScale, { toValue: 1.05, friction: 4, tension: 50, useNativeDriver: false }),
        Animated.spring(undoBtnScale, { toValue: 1.0, friction: 4, tension: 50, useNativeDriver: false }),
      ]),
    ]).start();

    const lastEntry = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, prev.length - 1));
    undoLastSwipeAction('usr-current');

    pan.setValue({ x: lastEntry.action === 'INTEREST' ? SCREEN_WIDTH * 1.2 : -SCREEN_WIDTH * 1.2, y: 0 });
    setCurrentIndex((prev) => Math.max(0, prev - 1));

    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 6,
      tension: 45,
      useNativeDriver: false,
    }).start(() => {
      isTransitioning.current = false;
    });
  };

  // Save / Star Button Trigger
  const triggerSave = () => {
    if (!currentCandidate) return;
    triggerHaptic('save');

    Animated.parallel([
      Animated.sequence([
        Animated.timing(saveBtnDepress, { toValue: 2.5, duration: 60, useNativeDriver: false }),
        Animated.spring(saveBtnDepress, { toValue: 0, friction: 4, tension: 50, useNativeDriver: false }),
      ]),
      Animated.sequence([
        Animated.timing(saveBtnScale, { toValue: 0.88, duration: 60, useNativeDriver: false }),
        Animated.spring(saveBtnScale, { toValue: 1.15, friction: 3.5, tension: 50, useNativeDriver: false }),
        Animated.spring(saveBtnScale, { toValue: 1.0, friction: 4, tension: 50, useNativeDriver: false }),
      ]),
    ]).start();

    const wasSaved = isCurrentSaved;
    toggleSaveCandidate(currentCandidate, wasSaved ? 'DEFAULT' : 'MUST_CONNECT');

    setSaveToastText(wasSaved ? 'Removed from saved profiles' : 'Saved to favorites');
    saveToastAnim.setValue(0);
    saveToastY.setValue(8);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(saveToastAnim, { toValue: 1, duration: 180, useNativeDriver: false }),
        Animated.timing(saveToastY, { toValue: 0, duration: 180, useNativeDriver: false }),
      ]),
      Animated.delay(1600),
      Animated.timing(saveToastAnim, { toValue: 0, duration: 220, useNativeDriver: false }),
    ]).start(() => setSaveToastText(null));
  };

  // End of queue state
  if (isEndOfQueue || !currentCandidate) {
    return (
      <View style={styles.deckContainer}>
        <View style={[styles.endQueueCard, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
          <Text style={{ fontSize: 44, marginBottom: 12 }}>✨</Text>
          <Text style={styles.endTitle}>You're all caught up!</Text>
          <Text style={styles.endSub}>
            You've explored all available profiles for {selectedMargam}.
          </Text>
          <TouchableOpacity
            style={styles.resetQueueBtn}
            onPress={() => {
              setCurrentIndex(0);
              onChangeMargam?.();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.resetQueueBtnText}>Explore Other Margams</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.deckContainer}>
      {/* Save Notification Toast */}
      {saveToastText && (
        <Animated.View
          style={[
            styles.saveToastPill,
            {
              opacity: saveToastAnim,
              transform: [{ translateY: saveToastY }],
            },
          ]}
        >
          <Star size={12} color="#F59E0B" fill="#F59E0B" style={{ marginRight: 6 }} />
          <Text style={styles.saveToastText}>{saveToastText}</Text>
        </Animated.View>
      )}

      {/* Cards Stack Layer */}
      <View style={[styles.cardsStackWrapper, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
        {/* Tier 3: Third Card in Stack */}
        {thirdCandidate && (
          <Animated.View
            style={[
              styles.peekCard,
              styles.thirdCardTier,
              {
                width: CARD_WIDTH - 20,
                height: CARD_HEIGHT - 20,
                opacity: thirdCardOpacity,
                transform: [
                  { translateY: thirdCardTranslateY },
                  { scale: thirdCardScale },
                  { rotate: '-2.5deg' },
                ],
              },
            ]}
          >
            <Image source={{ uri: thirdCandidate.photoUrl }} style={styles.peekCardImage} />
            <View style={styles.peekOverlay} />
          </Animated.View>
        )}

        {/* Tier 2: Next Card in Stack */}
        {nextCandidate && (
          <Animated.View
            style={[
              styles.peekCard,
              styles.nextCardTier,
              {
                width: CARD_WIDTH - 14,
                height: CARD_HEIGHT - 14,
                opacity: nextCardOpacity,
                transform: [
                  { translateY: nextCardTranslateY },
                  { scale: nextCardScale },
                  { rotate: '2.5deg' },
                ],
              },
            ]}
          >
            <Image source={{ uri: nextCandidate.photoUrl }} style={styles.peekCardImage} />
            <View style={styles.peekOverlay} />
          </Animated.View>
        )}

        {/* ==================================================== */}
        {/* TIER 1: ACTIVE CURRENT CARD                         */}
        {/* ==================================================== */}
        <Animated.View
          style={[
            styles.activeCard,
            {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              opacity: cardOpacity,
              transform: [
                { translateX: pan.x },
                { translateY: verticalFollow },
                { rotate },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Swipe Left Overlay (PASS ✕) */}
          <Animated.View
            style={[
              styles.swipeOverlay,
              styles.passOverlay,
              {
                opacity: passOverlayOpacity,
                transform: [{ scale: passOverlayScale }],
              },
            ]}
          >
            <View style={styles.overlayBadgeBoxPass}>
              <X size={24} color="#EF4444" strokeWidth={3} />
              <Text style={styles.overlayBadgeTextPass}>PASS</Text>
            </View>
          </Animated.View>

          {/* Swipe Right Overlay (INTEREST 3D RED HEART) */}
          <Animated.View
            style={[
              styles.swipeOverlay,
              styles.likeOverlay,
              {
                opacity: likeOverlayOpacity,
                transform: [{ scale: likeOverlayScale }],
              },
            ]}
          >
            <View style={styles.overlayBadgeBoxLike}>
              <Heart size={24} color="#EF4444" fill="#EF4444" />
              <Text style={styles.overlayBadgeTextLike}>INTEREST</Text>
            </View>
          </Animated.View>

          {/* Card Photo Section */}
          <View style={[styles.cardImageContainer, { height: PHOTO_HEIGHT }]}>
            <Pressable
              style={{ width: '100%', height: '100%' }}
              onPress={() => {
                if (onOpenPhotoViewer) {
                  onOpenPhotoViewer(currentCandidate);
                } else if (onOpenCandidateProfile) {
                  onOpenCandidateProfile(currentCandidate);
                }
              }}
            >
              <Image source={{ uri: currentCandidate.photoUrl }} style={styles.cardMainPhoto} />
            </Pressable>

            {/* Top Left: 92% Compatible Badge */}
            <TouchableOpacity
              style={styles.compatPillBadge}
              activeOpacity={0.85}
              onPress={() => onWhyThisMatch(currentCandidate)}
            >
              <Text style={{ fontSize: 13, marginRight: 4 }}>💖</Text>
              <View>
                <Text style={styles.compatPercentText}>
                  {currentCandidate.compatibilityPercentage}%
                </Text>
                <Text style={styles.compatSubLabel}>Compatible</Text>
              </View>
            </TouchableOpacity>

            {/* Top Right: More Options (•••) */}
            <TouchableOpacity
              style={styles.cardMoreBtn}
              activeOpacity={0.8}
              onPress={() => onMoreOptions?.(currentCandidate)}
            >
              <Text style={styles.cardMoreDots}>···</Text>
            </TouchableOpacity>

            {/* Photo Counter: 1/6 */}
            <TouchableOpacity
              style={styles.photoCountBadge}
              activeOpacity={0.8}
              onPress={() => onOpenPhotoViewer?.(currentCandidate)}
            >
              <Camera size={11} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.photoCountText}>
                {`1/${currentCandidate.photoCount || 6}`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Card Info Sheet Content */}
          <Pressable
            style={[styles.cardInfoSheet, { height: INFO_HEIGHT }]}
            onPress={() => {
              if (onOpenCandidateProfile) {
                onOpenCandidateProfile(currentCandidate);
              } else {
                onSelectCandidate(currentCandidate);
              }
            }}
          >
            {/* Name, Age & Verified Checkmark */}
            <View style={styles.nameRow}>
              <Text style={styles.candidateNameText}>
                {currentCandidate.name}, {currentCandidate.age}
              </Text>
              <CheckCircle2 size={17} color="#2563EB" fill="#2563EB" style={{ marginLeft: 6 }} />
            </View>

            {/* Profession, Location & View on Map Row */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Briefcase size={12} color="#64748B" style={{ marginRight: 3 }} />
                <Text style={styles.metaText}>{currentCandidate.profession}</Text>
              </View>
              <Text style={styles.metaDivider}>|</Text>
              <View style={styles.metaItem}>
                <MapPin size={12} color="#64748B" style={{ marginRight: 3 }} />
                <Text style={styles.metaText}>{currentCandidate.area}</Text>
              </View>
              <Text style={styles.metaDivider}>|</Text>
              <TouchableOpacity
                style={styles.viewOnMapInlineBtn}
                activeOpacity={0.8}
                onPress={() => onOpenCandidateProfile?.(currentCandidate)}
              >
                <MapIcon size={12} color="#2563EB" style={{ marginRight: 3 }} />
                <Text style={styles.viewOnMapInlineText}>View on Map &gt;</Text>
              </TouchableOpacity>
            </View>

            {/* Bio Statement / Dream Quote */}
            <Text style={styles.bioStatementText} numberOfLines={2}>
              {currentCandidate.bio}
            </Text>

            {/* Her Margams Section */}
            <View style={styles.herMargamsContainer}>
              <View style={styles.herMargamsHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, marginRight: 5 }}>❤️</Text>
                  <Text style={styles.herMargamsTitle}>Her Margams</Text>
                </View>
                <TouchableOpacity
                  onPress={() => onOpenMargamDetail?.(selectedMargam)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewAllMargamsText}>View All &gt;</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tagsRow}>
                {currentCandidate.sharedMargams.slice(0, 3).map((tag, idx) => (
                  <TouchableOpacity
                    key={`tag-${idx}`}
                    style={[
                      styles.margamTagPill,
                      idx === 0 && styles.margamTagPeach,
                      idx === 1 && styles.margamTagBlue,
                      idx === 2 && styles.margamTagPurple,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => onOpenMargamDetail?.(tag.name)}
                  >
                    <Text style={styles.tagEmojiText}>{tag.emoji}</Text>
                    <Text
                      style={[
                        styles.tagLabelText,
                        idx === 0 && { color: '#EA580C' },
                        idx === 1 && { color: '#2563EB' },
                        idx === 2 && { color: '#9333EA' },
                      ]}
                    >
                      {tag.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.moreTagsPill}
                  activeOpacity={0.8}
                  onPress={() => onOpenMargamDetail?.(selectedMargam)}
                >
                  <Text style={styles.moreTagsText}>+3</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Two Bottom Attribute Cards */}
            <View style={styles.attributeCardsRow}>
              {/* Card 1: Future Goal */}
              <View style={styles.attrCard}>
                <View style={[styles.attrIconCircle, { backgroundColor: '#FEF2F2' }]}>
                  <TargetIcon size={14} color="#EF4444" />
                </View>
                <View style={styles.attrCol}>
                  <Text style={styles.attrLabel}>Future goal</Text>
                  <Text style={styles.attrValue} numberOfLines={1}>
                    {currentCandidate.lookingToBuild || 'Build a café'}
                  </Text>
                </View>
                <ChevronRight size={13} color="#94A3B8" />
              </View>

              {/* Card 2: Open to Relocation */}
              <View style={styles.attrCard}>
                <View style={[styles.attrIconCircle, { backgroundColor: '#ECFDF5' }]}>
                  <MapPin size={14} color="#10B981" />
                </View>
                <View style={styles.attrCol}>
                  <Text style={styles.attrLabel}>Open to relocation</Text>
                  <Text style={styles.attrValue} numberOfLines={1}>
                    {currentCandidate.openToRelocate || 'Within India / Abroad'}
                  </Text>
                </View>
                <ChevronRight size={13} color="#94A3B8" />
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {/* ==================================================== */}
      {/* 4 3D ACTION BUTTONS ROW (EXACT SCREENSHOT FIDELITY)  */}
      {/* Rewind, Pass, 3D RED LOVE (Show Interest), Super Like*/}
      {/* ==================================================== */}
      <ThreeDActionButtonsRow
        onUndo={triggerUndo}
        onPass={triggerPass}
        onInterest={triggerInterest}
        onSuperLike={triggerSave}
        isUndoDisabled={historyStack.length === 0}
        undoScale={undoBtnScale}
        undoDepress={undoBtnDepress}
        passScale={passBtnScale}
        passDepress={passBtnDepress}
        likeScale={likeBtnScale}
        likeDepress={likeBtnDepress}
        superLikeScale={saveBtnScale}
        superLikeDepress={saveBtnDepress}
      />

      {/* Swipe Helper Caption */}
      <Text style={styles.swipeCaptionText}>
        Swipe left to pass • Swipe right to show interest
      </Text>

      {/* "Why this match?" AI Suggestion Card */}
      <TouchableOpacity
        style={[styles.whyMatchCard, { width: CARD_WIDTH }]}
        activeOpacity={0.85}
        onPress={() => onWhyThisMatch(currentCandidate)}
      >
        <View style={styles.whyMatchIconBox}>
          <Sparkles size={16} color="#7C3AED" />
        </View>
        <View style={styles.whyMatchContent}>
          <Text style={styles.whyMatchTitle}>Why this match?</Text>
          <Text style={styles.whyMatchSub} numberOfLines={1}>
            {currentCandidate.whyThisMatchExplanation || 'You both want to build a café and enjoy travel.'}
          </Text>
        </View>
        <View style={styles.whyMatchBtnPill}>
          <Text style={styles.whyMatchBtnText}>Details &gt;</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  deckContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 2,
  },
  saveToastPill: {
    position: 'absolute',
    top: -12,
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  saveToastText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardsStackWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  peekCard: {
    position: 'absolute',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  thirdCardTier: {
    left: -12,
    zIndex: 1,
  },
  nextCardTier: {
    right: -12,
    zIndex: 2,
  },
  peekCardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  peekOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  },
  activeCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  swipeOverlay: {
    position: 'absolute',
    top: 18,
    zIndex: 25,
    pointerEvents: 'none',
  },
  passOverlay: {
    right: 18,
  },
  likeOverlay: {
    left: 18,
  },
  overlayBadgeBoxPass: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ rotate: '8deg' }],
  },
  overlayBadgeTextPass: {
    fontSize: 18,
    fontWeight: '900',
    color: '#EF4444',
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  overlayBadgeBoxLike: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(254, 242, 242, 0.95)',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ rotate: '-8deg' }],
  },
  overlayBadgeTextLike: {
    fontSize: 18,
    fontWeight: '900',
    color: '#DC2626',
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  cardImageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  cardMainPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  compatPillBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  compatPercentText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 14,
  },
  compatSubLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 11,
  },
  cardMoreBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMoreDots: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 18,
    marginTop: -2,
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  cardInfoSheet: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  candidateNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDivider: {
    fontSize: 11,
    color: '#CBD5E1',
    marginHorizontal: 4,
  },
  viewOnMapInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewOnMapInlineText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  bioStatementText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
    marginTop: 3,
  },
  herMargamsContainer: {
    marginTop: 4,
  },
  herMargamsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  herMargamsTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewAllMargamsText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  margamTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
  },
  margamTagPeach: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  margamTagBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  margamTagPurple: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  tagEmojiText: {
    fontSize: 11,
    marginRight: 4,
  },
  tagLabelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  moreTagsPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 3.5,
  },
  moreTagsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  attributeCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },
  attrCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 6,
  },
  attrIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attrCol: {
    marginLeft: 6,
    flex: 1,
  },
  attrLabel: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 13,
  },
  attrValue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 15,
  },
  swipeCaptionText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  whyMatchCard: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whyMatchIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  whyMatchContent: {
    flex: 1,
  },
  whyMatchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 1,
  },
  whyMatchSub: {
    fontSize: 11,
    color: '#64748B',
  },
  whyMatchBtnPill: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 6,
  },
  whyMatchBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#7C3AED',
  },
  endQueueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  endTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  endSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  resetQueueBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetQueueBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
