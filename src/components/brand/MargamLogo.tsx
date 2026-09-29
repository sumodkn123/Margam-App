// MARGAM - Brand Symbol Component
// Concept: "M + Location Pin + Converging Paths + Subtle Heart Geometry"
// Represents: Technology + Journey + Human Connection

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface MargamLogoProps {
  size?: number;
  showGlow?: boolean;
}

export const MargamLogo: React.FC<MargamLogoProps> = ({ size = 48, showGlow = true }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          {/* Pathway Gold Gradient */}
          <LinearGradient id="margamGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#C86E3C" />
            <Stop offset="50%" stopColor="#E58B58" />
            <Stop offset="100%" stopColor="#F5A374" />
          </LinearGradient>

          {/* Route Guidance Line Gradient */}
          <LinearGradient id="margamRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#38BDF8" />
            <Stop offset="100%" stopColor="#818CF8" />
          </LinearGradient>
        </Defs>

        {/* Ambient Path Glow */}
        {showGlow && (
          <Circle
            cx="50"
            cy="52"
            r="38"
            fill="rgba(229, 139, 88, 0.08)"
          />
        )}

        {/* Left Converging Path: Rises from bottom left, curves inward to form left leg of M */}
        <Path
          d="M 18 84 C 20 62 30 42 42 34 L 50 48"
          stroke="url(#margamGoldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Converging Path: Rises from bottom right, curves inward to form right leg of M */}
        <Path
          d="M 82 84 C 80 62 70 42 58 34 L 50 48"
          stroke="url(#margamGoldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Convergence & Minimal Map Pin / Heart Crest */}
        {/* Outer subtle heart arch formed at the junction apex */}
        <Path
          d="M 50 18 C 42 18 36 24 36 32 C 36 43 50 56 50 56 C 50 56 64 43 64 32 C 64 24 58 18 50 18 Z"
          fill="url(#margamGoldGrad)"
        />

        {/* Pin Center Core (The Destination Aperture) */}
        <Circle cx="50" cy="31" r="5" fill="#0B0F14" />
        <Circle cx="50" cy="31" r="2.5" fill="#38BDF8" />

        {/* Subtle dynamic path intersection lines (The 'Way') */}
        <Path
          d="M 28 88 L 72 88"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
