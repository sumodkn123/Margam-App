// MARGAM — Mutual Interest Celebration Modal
// Triggered when two candidates express mutual interest on a Margam path.
// Features:
// - 1-second top Love Bubble Rain burst with smooth fade-out
// - Center animated glowing Love Heart icon replacing the old AI sparkles glyph
// - Gliding dual profile avatars with physiological heartbeat and floating breath
// - Organized Synergy & Compatibility card with shared Margam tags and score
// - Protected privacy assurance pill
// - High-conversion gradient "Request Introduction" primary CTA and secondary actions

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import {
  Heart,
  ShieldCheck,
  ChevronRight,
  X,
  Send,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Circle,
  Rect,
} from 'react-native-svg';
import { MargamProfileCandidate } from '../../types';
import { CURRENT_USER } from '../../constants/mockData';
import { LoveBubbleRain } from '../animation/LoveBubbleRain';

const { width } = Dimensions.get('window');

export interface MutualInterestModalProps {
  visible: boolean;
  candidate: MargamProfileCandidate | null;
  onRequestIntroduction: (candidate: MargamProfileCandidate) => void;
  onViewProfile: (candidate: MargamProfileCandidate) => void;
  onClose: () => void;
}

export const MutualInterestModal: React.FC<MutualInterestModalProps> = ({
  visible,
  candidate,
  onRequestIntroduction,
  onViewProfile,
  onClose,
}) => {
  // ---------------------------------------------------------------------------
  // ANIMATION DRIVERS
  // ---------------------------------------------------------------------------
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.88)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;
  const avatarLeftX = useRef(new Animated.Value(-40)).current;
  const avatarRightX = useRef(new Animated.Value(40)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;
  const heartScaleAnim = useRef(new Animated.Value(0)).current;
  const heartbeatAnim = useRef(new Animated.Value(1)).current;
  const heartAuraScale = useRef(new Animated.Value(1)).current;
  const heartAuraOpacity = useRef(new Animated.Value(0.6)).current;
  const pingScaleAnim = useRef(new Animated.Value(1)).current;
  const pingOpacityAnim = useRef(new Animated.Value(0.8)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(18)).current;

  // Love Bubble Rain 1-second burst state & opacity
  const [showBubbleRain, setShowBubbleRain] = useState(false);
  const [isBubbleRainActive, setIsBubbleRainActive] = useState(false);
  const bubbleRainOpacity = useRef(new Animated.Value(0)).current;

  const heartbeatLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const auraLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const pingLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible && candidate) {
      // 1. Reset animation initial values
      backdropAnim.setValue(0);
      cardScaleAnim.setValue(0.88);
      cardTranslateY.setValue(30);
      avatarLeftX.setValue(-40);
      avatarRightX.setValue(40);
      avatarOpacity.setValue(0);
      heartScaleAnim.setValue(0);
      contentFadeAnim.setValue(0);
      contentTranslateY.setValue(18);

      // 2. Start 1-second Love Bubble Rain burst
      setShowBubbleRain(true);
      setIsBubbleRainActive(true);
      bubbleRainOpacity.setValue(0);

      // Fade in bubble rain quickly
      Animated.timing(bubbleRainOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // After 1000ms (1 sec), smoothly fade out the bubble rain over 400ms
      const rainTimer = setTimeout(() => {
        Animated.timing(bubbleRainOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          setIsBubbleRainActive(false);
          setShowBubbleRain(false);
        });
      }, 1000);

      // 3. Parallel entrance orchestration
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(cardScaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.spring(cardTranslateY, {
          toValue: 0,
          friction: 7,
          tension: 65,
          useNativeDriver: true,
        }),
        // Staggered avatars glide in with gentle spring
        Animated.spring(avatarLeftX, {
          toValue: 0,
          friction: 6,
          tension: 60,
          delay: 80,
          useNativeDriver: true,
        }),
        Animated.spring(avatarRightX, {
          toValue: 0,
          friction: 6,
          tension: 60,
          delay: 80,
          useNativeDriver: true,
        }),
        Animated.timing(avatarOpacity, {
          toValue: 1,
          duration: 240,
          delay: 80,
          useNativeDriver: true,
        }),
        // Center heart pop
        Animated.spring(heartScaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 90,
          delay: 180,
          useNativeDriver: true,
        }),
        // Content staggered entrance
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 320,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.spring(contentTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 50,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // 4. Continuous physiological Heartbeat rhythm (lub-dub)
      heartbeatLoopRef.current = Animated.loop(
        Animated.sequence([
          // Primary pulse (lub)
          Animated.timing(heartbeatAnim, {
            toValue: 1.24,
            duration: 140,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(heartbeatAnim, {
            toValue: 1.1,
            duration: 110,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          // Secondary pulse (dub)
          Animated.timing(heartbeatAnim, {
            toValue: 1.18,
            duration: 120,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(heartbeatAnim, {
            toValue: 1.0,
            duration: 220,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          // Resting pause
          Animated.delay(1200),
        ])
      );
      heartbeatLoopRef.current.start();

      // 5. Continuous Love Glow Aura Pulse
      auraLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(heartAuraScale, {
              toValue: 1.6,
              duration: 1200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(heartAuraOpacity, {
              toValue: 0,
              duration: 1200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(heartAuraScale, {
              toValue: 1.0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(heartAuraOpacity, {
              toValue: 0.65,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(600),
        ])
      );
      auraLoopRef.current.start();

      // 6. Celebration Pill Ping Dot
      pingLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pingScaleAnim, {
              toValue: 2.4,
              duration: 1100,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pingOpacityAnim, {
              toValue: 0,
              duration: 1100,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pingScaleAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(pingOpacityAnim, {
              toValue: 0.8,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(500),
        ])
      );
      pingLoopRef.current.start();

      return () => {
        clearTimeout(rainTimer);
        heartbeatLoopRef.current?.stop();
        auraLoopRef.current?.stop();
        pingLoopRef.current?.stop();
      };
    }
  }, [visible, candidate]);

  if (!candidate) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        {/* Animated Dim Backdrop */}
        <Animated.View
          style={[
            styles.backdropOverlay,
            { opacity: backdropAnim },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        {/* Celebratory Modal Card */}
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [
                { scale: cardScaleAnim },
                { translateY: cardTranslateY },
              ],
            },
          ]}
        >
          {/* 1-Second Top Love Bubble Rain Burst */}
          {showBubbleRain && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.bubbleRainLayer,
                { opacity: bubbleRainOpacity },
              ]}
            >
              <LoveBubbleRain height={165} bubbleCount={16} active={isBubbleRainActive} />
            </Animated.View>
          )}

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <X size={18} color="#64748B" strokeWidth={2.4} />
          </TouchableOpacity>

          {/* ==================================================== */}
          {/* 1. TOP CELEBRATION BADGE                             */}
          {/* ==================================================== */}
          <View style={styles.topBadgeRow}>
            <View style={styles.celebrationPill}>
              {/* Radar live pulsing beacon dot */}
              <View style={styles.pingDotContainer}>
                <Animated.View
                  style={[
                    styles.pingDotWave,
                    {
                      transform: [{ scale: pingScaleAnim }],
                      opacity: pingOpacityAnim,
                    },
                  ]}
                />
                <View style={styles.pingDotCore} />
              </View>
              <Text style={styles.celebrationPillText}>MUTUAL INTEREST</Text>
              <Heart size={12} color="#E11D48" fill="#E11D48" />
            </View>
          </View>

          {/* Header Typography */}
          <Text style={styles.headline}>It's a Mutual Interest!</Text>
          <Text style={styles.subheadline}>
            You and <Text style={styles.boldRecipientName}>{candidate.name}</Text> both showed interest in connecting on Margam.
          </Text>

          {/* ==================================================== */}
          {/* 2. DUAL GLIDING AVATARS & CENTER LOVE HEART          */}
          {/* ==================================================== */}
          <View style={styles.avatarsRow}>
            {/* Background subtle connection wave beam */}
            <View style={styles.connectionLineBackdrop} />

            {/* User Avatar (Left) */}
            <Animated.View
              style={[
                styles.avatarWrap,
                styles.avatarLeft,
                {
                  opacity: avatarOpacity,
                  transform: [{ translateX: avatarLeftX }],
                },
              ]}
            >
              <View style={styles.avatarBorderGlowUser}>
                <Image
                  source={{ uri: CURRENT_USER.profilePhotoUrl }}
                  style={styles.avatarImg}
                />
              </View>
              <View style={styles.userLabelBadge}>
                <Text style={styles.userLabelText}>You</Text>
              </View>
            </Animated.View>

            {/* CENTER LOVE HEART ICON (Replaces old AI sign) */}
            <Animated.View
              style={[
                styles.overlapLoveBadgeContainer,
                {
                  transform: [
                    { scale: Animated.multiply(heartScaleAnim, heartbeatAnim) },
                  ],
                },
              ]}
            >
              {/* Radiating love aura */}
              <Animated.View
                style={[
                  styles.heartAuraRing,
                  {
                    transform: [{ scale: heartAuraScale }],
                    opacity: heartAuraOpacity,
                  },
                ]}
              />

              {/* Modern Sleek Glowing Heart Badge */}
              <View style={styles.overlapLoveBadge}>
                <Svg width={42} height={42} style={StyleSheet.absoluteFill}>
                  <Defs>
                    <SvgGradient id="modalLoveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#FB7185" />
                      <Stop offset="50%" stopColor="#F43F5E" />
                      <Stop offset="100%" stopColor="#E11D48" />
                    </SvgGradient>
                  </Defs>
                  <Circle cx={21} cy={21} r={20} fill="url(#modalLoveGrad)" />
                </Svg>
                <Heart size={20} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
              </View>
            </Animated.View>

            {/* Candidate Avatar (Right) */}
            <Animated.View
              style={[
                styles.avatarWrap,
                styles.avatarRight,
                {
                  opacity: avatarOpacity,
                  transform: [{ translateX: avatarRightX }],
                },
              ]}
            >
              <View style={styles.avatarBorderGlowCandidate}>
                <Image
                  source={{ uri: candidate.photoUrl }}
                  style={styles.avatarImg}
                />
              </View>
              <View style={styles.candidateLabelBadge}>
                <Text style={styles.candidateLabelText} numberOfLines={1}>
                  {candidate.name.split(' ')[0]}
                </Text>
                {candidate.isVerified && (
                  <CheckCircle2 size={9} color="#FFFFFF" style={{ marginLeft: 3 }} />
                )}
              </View>
            </Animated.View>
          </View>

          {/* ==================================================== */}
          {/* 3. ORGANIZED SYNERGY & COMPATIBILITY CARD            */}
          {/* ==================================================== */}
          <Animated.View
            style={[
              styles.organizedContent,
              {
                opacity: contentFadeAnim,
                transform: [{ translateY: contentTranslateY }],
              },
            ]}
          >
            <View style={styles.synergyCard}>
              {/* Compatibility Stats Bar */}
              <View style={styles.synergyStatsRow}>
                <View style={styles.compatibilityPill}>
                  <Sparkles size={13} color="#E11D48" />
                  <Text style={styles.compatibilityPillText}>
                    {candidate.compatibilityPercentage}% Match Synergy
                  </Text>
                </View>

                <View style={styles.locationPill}>
                  <Text style={styles.locationPillText}>
                    📍 {candidate.area || candidate.city}
                  </Text>
                </View>
              </View>

              {/* Shared Margams Section */}
              <View style={styles.margamsBlock}>
                <Text style={styles.margamsBlockTitle}>Shared Margams</Text>
                <View style={styles.margamChipsRow}>
                  {candidate.sharedMargams && candidate.sharedMargams.length > 0 ? (
                    candidate.sharedMargams.map((m, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.margamChip,
                          { backgroundColor: m.tagColor || '#FFF1F2' },
                        ]}
                      >
                        <Text style={styles.margamEmoji}>{m.emoji || '✨'}</Text>
                        <Text
                          style={[
                            styles.margamChipName,
                            { color: m.textColor || '#9F1239' },
                          ]}
                          numberOfLines={1}
                        >
                          {m.name}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.margamChip}>
                      <Text style={styles.margamEmoji}>✨</Text>
                      <Text style={styles.margamChipName}>Life Goals & Lifestyle</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Candidate Highlight Quote / Goal */}
              {candidate.lookingToBuild ? (
                <View style={styles.lookingToBuildRow}>
                  <Text style={styles.lookingToBuildText} numberOfLines={2}>
                    <Text style={styles.lookingToBuildLabel}>Goal: </Text>
                    {candidate.lookingToBuild}
                  </Text>
                </View>
              ) : candidate.whyThisMatchExplanation ? (
                <View style={styles.lookingToBuildRow}>
                  <Text style={styles.lookingToBuildText} numberOfLines={2}>
                    {candidate.whyThisMatchExplanation}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Privacy Assurance Pill */}
            <View style={styles.privacyAssuranceBox}>
              <ShieldCheck size={15} color="#059669" style={{ marginRight: 6, flexShrink: 0 }} />
              <Text style={styles.privacyAssuranceText}>
                Private contact & exact coordinates remain locked until mutual introduction acceptance.
              </Text>
            </View>

            {/* ==================================================== */}
            {/* 4. MODERN SLEEK ACTION BUTTONS                       */}
            {/* ==================================================== */}
            {/* Primary Action Button: Request Introduction */}
            <TouchableOpacity
              style={styles.primarySendBtn}
              activeOpacity={0.88}
              onPress={() => {
                onClose();
                onRequestIntroduction(candidate);
              }}
            >
              <Svg width="100%" height={52} style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgGradient id="ctaBtnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FF4D6D" />
                    <Stop offset="50%" stopColor="#EF4444" />
                    <Stop offset="100%" stopColor="#DC2626" />
                  </SvgGradient>
                </Defs>
                <Rect width="100%" height={52} rx={16} fill="url(#ctaBtnGrad)" />
              </Svg>

              <View style={styles.primaryBtnInner}>
                <Heart size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Request Introduction 💖</Text>
                <ChevronRight size={17} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>

            {/* Secondary Action Buttons Row */}
            <View style={styles.secondaryActionsRow}>
              <TouchableOpacity
                style={styles.viewProfileBtn}
                activeOpacity={0.78}
                onPress={() => {
                  onClose();
                  onViewProfile(candidate);
                }}
              >
                <Eye size={14} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.viewProfileBtnText}>View Full Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.continueExploringBtn}
                activeOpacity={0.78}
                onPress={onClose}
              >
                <Text style={styles.continueExploringText}>Keep Exploring</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    position: 'relative',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.76)',
  },
  cardContainer: {
    width: Math.min(width - 32, 388),
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 30,
    elevation: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  bubbleRainLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 165,
    overflow: 'hidden',
    zIndex: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  topBadgeRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    zIndex: 2,
  },
  celebrationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pingDotContainer: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pingDotWave: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E11D48',
  },
  pingDotCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E11D48',
  },
  celebrationPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#E11D48',
    letterSpacing: 0.6,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: -0.3,
    zIndex: 2,
  },
  subheadline: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  boldRecipientName: {
    color: '#0F172A',
    fontWeight: '700',
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
    height: 94,
    width: 196,
    zIndex: 2,
  },
  connectionLineBackdrop: {
    position: 'absolute',
    height: 2,
    left: 40,
    right: 40,
    top: 40,
    backgroundColor: '#FCE7F3',
    zIndex: 0,
  },
  avatarWrap: {
    position: 'absolute',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLeft: {
    left: 10,
    zIndex: 2,
  },
  avatarRight: {
    right: 10,
    zIndex: 2,
  },
  avatarBorderGlowUser: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: '#3B82F6',
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarBorderGlowCandidate: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: '#FB7185',
    overflow: 'hidden',
    backgroundColor: '#FDF2F8',
    shadowColor: '#FB7185',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  userLabelBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  userLabelText: {
    fontSize: 9.5,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  candidateLabelBadge: {
    position: 'absolute',
    bottom: -6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E11D48',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    maxWidth: 82,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  candidateLabelText: {
    fontSize: 9.5,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  overlapLoveBadgeContainer: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  heartAuraRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(244, 63, 94, 0.35)',
  },
  overlapLoveBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  organizedContent: {
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  synergyCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  synergyStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  compatibilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  compatibilityPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#E11D48',
  },
  locationPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  locationPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  margamsBlock: {
    gap: 6,
  },
  margamsBlockTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  margamChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  margamChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  margamEmoji: {
    fontSize: 12,
  },
  margamChipName: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  lookingToBuildRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  lookingToBuildLabel: {
    fontWeight: '800',
    color: '#0F172A',
  },
  lookingToBuildText: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  privacyAssuranceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  privacyAssuranceText: {
    flex: 1,
    fontSize: 10.5,
    color: '#065F46',
    lineHeight: 14,
    fontWeight: '500',
  },
  primarySendBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 10,
  },
  primaryBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  viewProfileBtn: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  viewProfileBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  continueExploringBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  continueExploringText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
});
