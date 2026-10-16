// MARGAM — Photorealistic 3D Skeuomorphic / Claymorphic Action Buttons
// Hand-crafted multi-stop radial & linear gradients with volumetric lighting,
// torus collars, specular curved highlights, puffy 3D candy glyphs,
// and floating atmospheric hearts. Exactly matches the reference design.

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Platform } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Circle,
  Path,
  G,
  Ellipse,
} from 'react-native-svg';

// ============================================================================
// 1. REWIND 3D BUTTON (56px)
// ============================================================================
export const ThreeDRewindGlyph: React.FC<{ size?: number; disabled?: boolean }> = ({
  size = 56,
  disabled = false,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56">
      <Defs>
        {/* Soft Ambient Floor Drop Shadow */}
        <RadialGradient id="rewindFloorShadow" cx="50%" cy="55%" rx="50%" ry="45%">
          <Stop offset="0%" stopColor="#64748B" stopOpacity="0.22" />
          <Stop offset="70%" stopColor="#94A3B8" stopOpacity="0.08" />
          <Stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
        </RadialGradient>

        {/* 3D Torus Collar Gradient */}
        <LinearGradient id="rewindTorusGrad" x1="0.3" y1="0" x2="0.7" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <Stop offset="25%" stopColor="#F1F5F9" />
          <Stop offset="70%" stopColor="#CBD5E1" />
          <Stop offset="100%" stopColor="#94A3B8" />
        </LinearGradient>

        {/* Sunken Dish Bevel */}
        <LinearGradient id="rewindDishGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.7" />
          <Stop offset="40%" stopColor="#E2E8F0" />
          <Stop offset="100%" stopColor="#FFFFFF" />
        </LinearGradient>

        {/* Raised Domed Convex Face */}
        <RadialGradient id="rewindDomeGrad" cx="38%" cy="32%" rx="65%" ry="65%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="55%" stopColor="#F8FAFC" />
          <Stop offset="85%" stopColor="#E2E8F0" />
          <Stop offset="100%" stopColor="#CBD5E1" />
        </RadialGradient>

        {/* Volumetric Glyph Gradient */}
        <LinearGradient id="rewindIconGrad" x1="0.2" y1="0" x2="0.8" y2="1">
          <Stop offset="0%" stopColor={disabled ? '#94A3B8' : '#64748B'} />
          <Stop offset="100%" stopColor={disabled ? '#CBD5E1' : '#475569'} />
        </LinearGradient>
      </Defs>

      {/* 1. Floor Ambient Shadow */}
      <Circle cx="28" cy="30" r="24" fill="url(#rewindFloorShadow)" />

      {/* 2. Outer 3D Torus Collar */}
      <Circle cx="28" cy="27" r="23" fill="url(#rewindTorusGrad)" />

      {/* 3. Inset Dish Shelf */}
      <Circle cx="28" cy="27.5" r="20" fill="url(#rewindDishGrad)" />

      {/* 4. Raised Domed White-Silver Face */}
      <Circle cx="28" cy="27" r="18.5" fill="url(#rewindDomeGrad)" />

      {/* 5. Specular Curved Gloss Highlight Arc */}
      <Path
        d="M 18 17 C 23 12.5, 33 12.5, 38 17 C 34 14.5, 22 14.5, 18 17 Z"
        fill="#FFFFFF"
        fillOpacity={0.85}
      />

      {/* 6. 3D Embossed Rewind Circular Arrow (↺) */}
      <G opacity={disabled ? 0.45 : 1}>
        {/* Soft shadow under arrow */}
        <Path
          d="M 21.5 21.5 L 21.5 17 M 21.5 21.5 L 26 21.5 M 22.5 22.5 A 8.5 8.5 0 1 1 20.5 28.5"
          stroke="#94A3B8"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          transform="translate(0, 1.2)"
        />
        {/* Main Volumetric Arrow */}
        <Path
          d="M 21.5 21.5 L 21.5 17 M 21.5 21.5 L 26 21.5 M 22.5 22.5 A 8.5 8.5 0 1 1 20.5 28.5"
          stroke="url(#rewindIconGrad)"
          strokeWidth="3.0"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Upper Specular Gleam on Arrow Arc */}
        <Path
          d="M 26 19.5 A 8.5 8.5 0 0 1 34 22"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />
      </G>
    </Svg>
  );
};

// ============================================================================
// 2. PASS 3D BUTTON (64px) — Rose Torus with Plump Candy "✕"
// ============================================================================
export const ThreeDPassGlyph: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        {/* Soft Rose-Tinted Floor Halo */}
        <RadialGradient id="passFloorShadow" cx="50%" cy="55%" rx="50%" ry="45%">
          <Stop offset="0%" stopColor="#F43F5E" stopOpacity="0.28" />
          <Stop offset="65%" stopColor="#FB7185" stopOpacity="0.10" />
          <Stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
        </RadialGradient>

        {/* 3D Blushing Rose Torus Collar */}
        <LinearGradient id="passTorusGrad" x1="0.3" y1="0" x2="0.7" y2="1">
          <Stop offset="0%" stopColor="#FFF1F2" stopOpacity="0.95" />
          <Stop offset="25%" stopColor="#FFE4E6" />
          <Stop offset="65%" stopColor="#FDA4AF" />
          <Stop offset="90%" stopColor="#F43F5E" />
          <Stop offset="100%" stopColor="#E11D48" />
        </LinearGradient>

        {/* Inset Dish Bevel */}
        <LinearGradient id="passDishGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.65" />
          <Stop offset="40%" stopColor="#FECDD3" />
          <Stop offset="100%" stopColor="#FFF1F2" />
        </LinearGradient>

        {/* Raised Domed Porcelain Rose-White Face */}
        <RadialGradient id="passDomeGrad" cx="38%" cy="32%" rx="65%" ry="65%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="55%" stopColor="#FFF5F5" />
          <Stop offset="85%" stopColor="#FFE4E6" />
          <Stop offset="100%" stopColor="#FECDD3" />
        </RadialGradient>

        {/* Plump Candy Cross Gradient */}
        <LinearGradient id="passCrossGrad" x1="0.2" y1="0" x2="0.8" y2="1">
          <Stop offset="0%" stopColor="#FF4365" />
          <Stop offset="60%" stopColor="#F43F5E" />
          <Stop offset="100%" stopColor="#E11D48" />
        </LinearGradient>
      </Defs>

      {/* 1. Floor Ambient Shadow */}
      <Circle cx="32" cy="35" r="28" fill="url(#passFloorShadow)" />

      {/* 2. Outer 3D Rose Torus Collar */}
      <Circle cx="32" cy="31" r="27" fill="url(#passTorusGrad)" />

      {/* 3. Inset Dish Shelf */}
      <Circle cx="32" cy="31.5" r="23.5" fill="url(#passDishGrad)" />

      {/* 4. Raised Domed Face */}
      <Circle cx="32" cy="31" r="21.5" fill="url(#passDomeGrad)" />

      {/* 5. Specular Curved Gloss Highlight Arc */}
      <Path
        d="M 19 19 C 25 13.5, 39 13.5, 45 19 C 40 16.5, 24 16.5, 19 19 Z"
        fill="#FFFFFF"
        fillOpacity={0.88}
      />

      {/* 6. Plump 3D Candy "✕" Cross */}
      <G>
        {/* Soft Drop Shadow under Cross */}
        <Path
          d="M 23.5 22.5 L 40.5 39.5 M 40.5 22.5 L 23.5 39.5"
          stroke="#FDA4AF"
          strokeWidth="5.6"
          strokeLinecap="round"
          fill="none"
          transform="translate(0, 1.8)"
        />
        {/* Deep Ambient Occlusion Rim */}
        <Path
          d="M 23.5 22.5 L 40.5 39.5 M 40.5 22.5 L 23.5 39.5"
          stroke="#9F1239"
          strokeOpacity={0.25}
          strokeWidth="5.2"
          strokeLinecap="round"
          fill="none"
          transform="translate(0, 1.0)"
        />
        {/* Main Plump Candy Cross */}
        <Path
          d="M 23.5 22.5 L 40.5 39.5 M 40.5 22.5 L 23.5 39.5"
          stroke="url(#passCrossGrad)"
          strokeWidth="5.0"
          strokeLinecap="round"
          fill="none"
        />
        {/* Top Volumetric Highlight Glint */}
        <Path
          d="M 25 24 L 31 30 M 39 24 L 33 30"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity={0.65}
          fill="none"
        />
      </G>
    </Svg>
  );
};

// ============================================================================
// 3. SHOW INTEREST 3D BUTTON (84px) — The Red Love Centerpiece with Floating Hearts
// ============================================================================
export const ThreeDShowInterestGlyph: React.FC<{ size?: number }> = ({ size = 84 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 84 84">
      <Defs>
        {/* Radiant Ruby Flare Halo */}
        <RadialGradient id="loveRadialHalo" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor="#FF2D55" stopOpacity="0.42" />
          <Stop offset="45%" stopColor="#EF4444" stopOpacity="0.22" />
          <Stop offset="80%" stopColor="#E11D48" stopOpacity="0.06" />
          <Stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
        </RadialGradient>

        {/* 3D Deep Crimson Torus Collar */}
        <LinearGradient id="loveTorusGrad" x1="0.3" y1="0" x2="0.7" y2="1">
          <Stop offset="0%" stopColor="#FF758F" />
          <Stop offset="22%" stopColor="#FF3366" />
          <Stop offset="50%" stopColor="#EF4444" />
          <Stop offset="78%" stopColor="#DC2626" />
          <Stop offset="92%" stopColor="#991B1B" />
          <Stop offset="100%" stopColor="#7F1D1D" />
        </LinearGradient>

        {/* Inset Dish Bevel */}
        <LinearGradient id="loveDishGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#991B1B" stopOpacity="0.7" />
          <Stop offset="30%" stopColor="#B91C1C" />
          <Stop offset="100%" stopColor="#EF4444" />
        </LinearGradient>

        {/* Raised Radiant Scarlet Domed Face */}
        <RadialGradient id="loveDomeGrad" cx="36%" cy="30%" rx="65%" ry="65%">
          <Stop offset="0%" stopColor="#FF4D6D" />
          <Stop offset="40%" stopColor="#EF4444" />
          <Stop offset="80%" stopColor="#DC2626" />
          <Stop offset="100%" stopColor="#B91C1C" />
        </RadialGradient>

        {/* Puffy 3D Porcelain White Heart Gradient */}
        <LinearGradient id="puffyHeartGrad" x1="0" y1="0" x2="0.2" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="45%" stopColor="#FFFFFF" />
          <Stop offset="75%" stopColor="#F8FAFC" />
          <Stop offset="100%" stopColor="#E2E8F0" />
        </LinearGradient>

        {/* Mini Floating Heart Gradient */}
        <LinearGradient id="miniHeartGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FF4D6D" />
          <Stop offset="100%" stopColor="#C9184A" />
        </LinearGradient>
      </Defs>

      {/* 1. Large Ambient Ruby Flare Halo */}
      <Circle cx="42" cy="44" r="40" fill="url(#loveRadialHalo)" />

      {/* 2. Floating Mini 3D Hearts (💕) */}
      {/* Left Shoulder Floating Heart (tilted -20°) */}
      <G transform="translate(13, 9) rotate(-20 6 6)">
        <Path
          d="M 6 3 C 6 1.2, 1.5 1, 1.5 5 C 1.5 8, 4.5 10.5, 6 12 C 7.5 10.5, 10.5 8, 10.5 5 C 10.5 1, 6 1.2, 6 3 Z"
          fill="#991B1B"
          opacity={0.4}
          transform="translate(0, 1.5)"
        />
        <Path
          d="M 6 3 C 6 1.2, 1.5 1, 1.5 5 C 1.5 8, 4.5 10.5, 6 12 C 7.5 10.5, 10.5 8, 10.5 5 C 10.5 1, 6 1.2, 6 3 Z"
          fill="url(#miniHeartGrad)"
        />
        <Ellipse cx="4" cy="3.8" rx="1.5" ry="0.8" fill="#FFFFFF" opacity={0.8} />
      </G>

      {/* Right Shoulder Floating Heart (tilted +20°) */}
      <G transform="translate(61, 9) rotate(20 6 6)">
        <Path
          d="M 6 3 C 6 1.2, 1.5 1, 1.5 5 C 1.5 8, 4.5 10.5, 6 12 C 7.5 10.5, 10.5 8, 10.5 5 C 10.5 1, 6 1.2, 6 3 Z"
          fill="#991B1B"
          opacity={0.4}
          transform="translate(0, 1.5)"
        />
        <Path
          d="M 6 3 C 6 1.2, 1.5 1, 1.5 5 C 1.5 8, 4.5 10.5, 6 12 C 7.5 10.5, 10.5 8, 10.5 5 C 10.5 1, 6 1.2, 6 3 Z"
          fill="url(#miniHeartGrad)"
        />
        <Ellipse cx="8" cy="3.8" rx="1.5" ry="0.8" fill="#FFFFFF" opacity={0.8} />
      </G>

      {/* 3. Outer 3D Crimson Torus Collar */}
      <Circle cx="42" cy="45" r="34" fill="url(#loveTorusGrad)" />

      {/* 4. Inset Dish Shelf */}
      <Circle cx="42" cy="45.5" r="29.5" fill="url(#loveDishGrad)" />

      {/* 5. Raised Domed Radiant Red Face */}
      <Circle cx="42" cy="45" r="27" fill="url(#loveDomeGrad)" />

      {/* 6. Specular Curved Gloss Arc Along Upper Dome Rim */}
      <Path
        d="M 26 29 C 34 22.5, 50 22.5, 58 29 C 52 26, 32 26, 26 29 Z"
        fill="#FFFFFF"
        fillOpacity={0.45}
      />

      {/* 7. Puffy 3D Porcelain White Heart */}
      <G>
        {/* Soft Drop Shadow under Heart */}
        <Path
          d="M 42 35 C 42 29, 27 28, 27 39 C 27 47, 36 54, 42 60 C 48 54, 57 47, 57 39 C 57 28, 42 29, 42 35 Z"
          fill="#7F1D1D"
          opacity={0.48}
          transform="translate(0, 2.5)"
        />
        {/* Ambient Occlusion Crease */}
        <Path
          d="M 42 35 C 42 29, 27 28, 27 39 C 27 47, 36 54, 42 60 C 48 54, 57 47, 57 39 C 57 28, 42 29, 42 35 Z"
          fill="#991B1B"
          opacity={0.3}
          transform="translate(0, 1.2)"
        />
        {/* Volumetric White Body */}
        <Path
          d="M 42 35 C 42 29, 27 28, 27 39 C 27 47, 36 54, 42 60 C 48 54, 57 47, 57 39 C 57 28, 42 29, 42 35 Z"
          fill="url(#puffyHeartGrad)"
        />
        {/* Top-Left Specular Lobe Gleam */}
        <Ellipse
          cx="35"
          cy="38.5"
          rx="4.8"
          ry="2.4"
          transform="rotate(-28 35 38.5)"
          fill="#FFFFFF"
          opacity={0.92}
        />
        {/* Top-Right Lobe Highlight */}
        <Ellipse
          cx="49"
          cy="38.5"
          rx="3.6"
          ry="1.8"
          transform="rotate(28 49 38.5)"
          fill="#FFFFFF"
          opacity={0.75}
        />
      </G>
    </Svg>
  );
};

// ============================================================================
// 4. SUPER LIKE 3D BUTTON (64px) — Golden Torus with Plump Clay Star
// ============================================================================
export const ThreeDSuperLikeGlyph: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        {/* Soft Golden Ambient Floor Halo */}
        <RadialGradient id="starFloorShadow" cx="50%" cy="55%" rx="50%" ry="45%">
          <Stop offset="0%" stopColor="#F59E0B" stopOpacity="0.28" />
          <Stop offset="65%" stopColor="#FCD34D" stopOpacity="0.10" />
          <Stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
        </RadialGradient>

        {/* 3D Warm Golden Torus Collar */}
        <LinearGradient id="starTorusGrad" x1="0.3" y1="0" x2="0.7" y2="1">
          <Stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.95" />
          <Stop offset="25%" stopColor="#FEF3C7" />
          <Stop offset="65%" stopColor="#FDE68A" />
          <Stop offset="90%" stopColor="#F59E0B" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>

        {/* Inset Dish Bevel */}
        <LinearGradient id="starDishGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FCD34D" stopOpacity="0.65" />
          <Stop offset="40%" stopColor="#FDE68A" />
          <Stop offset="100%" stopColor="#FFFBEB" />
        </LinearGradient>

        {/* Raised Domed Cream-White Face */}
        <RadialGradient id="starDomeGrad" cx="38%" cy="32%" rx="65%" ry="65%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="55%" stopColor="#FFFDF5" />
          <Stop offset="85%" stopColor="#FEF3C7" />
          <Stop offset="100%" stopColor="#FDE68A" />
        </RadialGradient>

        {/* Volumetric Plump Gold Star Gradient */}
        <LinearGradient id="plumpStarGrad" x1="0.2" y1="0" x2="0.8" y2="1">
          <Stop offset="0%" stopColor="#FDE047" />
          <Stop offset="35%" stopColor="#FBBF24" />
          <Stop offset="75%" stopColor="#F59E0B" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>
      </Defs>

      {/* 1. Floor Ambient Shadow */}
      <Circle cx="32" cy="35" r="28" fill="url(#starFloorShadow)" />

      {/* 2. Outer 3D Golden Torus Collar */}
      <Circle cx="32" cy="31" r="27" fill="url(#starTorusGrad)" />

      {/* 3. Inset Dish Shelf */}
      <Circle cx="32" cy="31.5" r="23.5" fill="url(#starDishGrad)" />

      {/* 4. Raised Domed Cream-White Face */}
      <Circle cx="32" cy="31" r="21.5" fill="url(#starDomeGrad)" />

      {/* 5. Specular Curved Gloss Highlight Arc */}
      <Path
        d="M 19 19 C 25 13.5, 39 13.5, 45 19 C 40 16.5, 24 16.5, 19 19 Z"
        fill="#FFFFFF"
        fillOpacity={0.88}
      />

      {/* 6. Plump 3D Golden Clay Star */}
      <G>
        {/* Soft Drop Shadow under Star */}
        <Path
          d="M 32 17.5 C 32.5 17.5, 33 18, 33.3 18.8 L 35.8 24.3 C 36 24.8, 36.5 25.1, 37.1 25.2 L 43.1 25.8 C 44 25.9, 44.4 27, 43.7 27.6 L 39.2 31.7 C 38.7 32.1, 38.5 32.7, 38.7 33.3 L 40 39.2 C 40.2 40.1, 39.2 40.8, 38.4 40.3 L 33.2 37.3 C 32.7 37, 32.1 37, 31.6 37.3 L 26.4 40.3 C 25.6 40.8, 24.6 40.1, 24.8 39.2 L 26.1 33.3 C 26.3 32.7, 26.1 32.1, 25.6 31.7 L 21.1 27.6 C 20.4 27, 20.8 25.9, 21.7 25.8 L 27.7 25.2 C 28.3 25.1, 28.8 24.8, 29 24.3 L 31.5 18.8 C 31.8 18, 32.3 17.5, 32 17.5 Z"
          fill="#B45309"
          opacity={0.35}
          transform="translate(0, 1.8)"
        />
        {/* Volumetric Plump Star Body */}
        <Path
          d="M 32 17.5 C 32.5 17.5, 33 18, 33.3 18.8 L 35.8 24.3 C 36 24.8, 36.5 25.1, 37.1 25.2 L 43.1 25.8 C 44 25.9, 44.4 27, 43.7 27.6 L 39.2 31.7 C 38.7 32.1, 38.5 32.7, 38.7 33.3 L 40 39.2 C 40.2 40.1, 39.2 40.8, 38.4 40.3 L 33.2 37.3 C 32.7 37, 32.1 37, 31.6 37.3 L 26.4 40.3 C 25.6 40.8, 24.6 40.1, 24.8 39.2 L 26.1 33.3 C 26.3 32.7, 26.1 32.1, 25.6 31.7 L 21.1 27.6 C 20.4 27, 20.8 25.9, 21.7 25.8 L 27.7 25.2 C 28.3 25.1, 28.8 24.8, 29 24.3 L 31.5 18.8 C 31.8 18, 32.3 17.5, 32 17.5 Z"
          fill="url(#plumpStarGrad)"
        />
        {/* Top Tip Volumetric Highlight Gleam */}
        <Path
          d="M 32 19 L 34.5 24.5 L 36 25"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity={0.75}
          fill="none"
        />
      </G>
    </Svg>
  );
};

// ============================================================================
// 5. UNIFIED 4 ACTION BUTTONS ROW COMPONENT
// ============================================================================
interface ThreeDActionButtonsRowProps {
  onUndo: () => void;
  onPass: () => void;
  onInterest: () => void;
  onSuperLike: () => void;
  isUndoDisabled?: boolean;
  undoScale?: Animated.Value;
  undoDepress?: Animated.Value;
  passScale?: Animated.Value;
  passDepress?: Animated.Value;
  likeScale?: Animated.Value;
  likeDepress?: Animated.Value;
  superLikeScale?: Animated.Value;
  superLikeDepress?: Animated.Value;
}

export const ThreeDActionButtonsRow: React.FC<ThreeDActionButtonsRowProps> = ({
  onUndo,
  onPass,
  onInterest,
  onSuperLike,
  isUndoDisabled = false,
  undoScale = new Animated.Value(1),
  undoDepress = new Animated.Value(0),
  passScale = new Animated.Value(1),
  passDepress = new Animated.Value(0),
  likeScale = new Animated.Value(1),
  likeDepress = new Animated.Value(0),
  superLikeScale = new Animated.Value(1),
  superLikeDepress = new Animated.Value(0),
}) => {
  return (
    <View style={styles.actionRowContainer}>
      {/* 1. Rewind Button */}
      <View style={styles.btnColumn}>
        <Animated.View
          style={{
            transform: [{ scale: undoScale }, { translateY: undoDepress }],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={onUndo}
            disabled={isUndoDisabled}
            accessibilityLabel="Rewind"
            style={styles.touchTarget}
          >
            <ThreeDRewindGlyph size={56} disabled={isUndoDisabled} />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.btnLabel}>Rewind</Text>
      </View>

      {/* 2. Pass Button */}
      <View style={styles.btnColumn}>
        <Animated.View
          style={{
            transform: [{ scale: passScale }, { translateY: passDepress }],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={onPass}
            accessibilityLabel="Pass"
            style={styles.touchTarget}
          >
            <ThreeDPassGlyph size={64} />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.btnLabel}>Pass</Text>
      </View>

      {/* 3. Show Interest Button (Center Red Masterpiece) */}
      <View style={styles.btnColumn}>
        <Animated.View
          style={{
            transform: [{ scale: likeScale }, { translateY: likeDepress }],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={onInterest}
            accessibilityLabel="Show Interest"
            style={styles.touchTargetLarge}
          >
            <ThreeDShowInterestGlyph size={84} />
          </TouchableOpacity>
        </Animated.View>
        <Text style={[styles.btnLabel, styles.interestLabel]}>Show Interest</Text>
      </View>

      {/* 4. Super Like Button */}
      <View style={styles.btnColumn}>
        <Animated.View
          style={{
            transform: [{ scale: superLikeScale }, { translateY: superLikeDepress }],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={onSuperLike}
            accessibilityLabel="Super Like"
            style={styles.touchTarget}
          >
            <ThreeDSuperLikeGlyph size={64} />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.btnLabel}>Super Like</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 2,
    gap: 8,
  },
  btnColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  touchTarget: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchTargetLarge: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -4, // Balances height of larger center button
  },
  btnLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
    textAlign: 'center',
  },
  interestLabel: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 11.5,
  },
});
