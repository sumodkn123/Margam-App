// MARGAM - Heart Pin Logo Component
// Matches the exact visual identity from the approved design:
// Vibrant gradient map pin with internal heart and path crest

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface MargamLogoNewProps {
  size?: number;
}

export const MargamLogoNew: React.FC<MargamLogoNewProps> = ({ size = 42 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          {/* Vibrant Pin Gradient: Purple to Pink to Blue */}
          <LinearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#8B5CF6" />
            <Stop offset="50%" stopColor="#EC4899" />
            <Stop offset="100%" stopColor="#3B82F6" />
          </LinearGradient>

          {/* Inner Heart Gradient */}
          <LinearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F472B6" />
            <Stop offset="100%" stopColor="#DB2777" />
          </LinearGradient>
        </Defs>

        {/* Outer Pin Body */}
        <Path
          d="M 50 8 C 30 8 16 23 16 42 C 16 63 42 86 48 91 C 49.2 92 50.8 92 52 91 C 58 86 84 63 84 42 C 84 23 70 8 50 8 Z"
          fill="url(#pinGrad)"
        />

        {/* Inner White Cutout Hole */}
        <Circle cx="50" cy="40" r="22" fill="#FFFFFF" />

        {/* Subtle Path Tails at Base */}
        <Path
          d="M 30 88 L 18 94"
          stroke="#8B5CF6"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Path
          d="M 70 88 L 82 94"
          stroke="#3B82F6"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Stylized Heart Center */}
        <Path
          d="M 50 49 C 50 49 39 42 39 35 C 39 30.5 42.5 27 47 27 C 49 27 50 28.5 50 28.5 C 50 28.5 51 27 53 27 C 57.5 27 61 30.5 61 35 C 61 42 50 49 50 49 Z"
          fill="url(#heartGrad)"
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
