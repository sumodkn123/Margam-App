// MARGAM — Custom Brand Shapes & Floating Feature Nodes
// Directly mirrors MargamBrandShapes.swift from the production SwiftUI reference:
// - Vector Location-Pin + Heart Emblem
// - Subtle Curved Discovery Route Line with animated trim
// - 11 Floating 3D Feature Elements with polar coordinates and tints

import React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  G,
  Circle,
} from 'react-native-svg';

export interface MargamFloatingElementConfig {
  id: string;
  icon: string;
  label: string;
  angleDegrees: number;
  orbitRadius: number;
  tint: string;
  isProfileCard: boolean;
}

// 11 Floating Feature Elements matching MargamFloatingElement.allElements in SwiftUI
export const MARGAM_FLOATING_ELEMENTS: MargamFloatingElementConfig[] = [
  // Left & Right Sliding Profile Cards
  {
    id: 'discovery',
    icon: 'user-check',
    label: 'Discovery',
    angleDegrees: 195,
    orbitRadius: 145,
    tint: '#FA94AD',
    isProfileCard: true,
  },
  {
    id: 'compatible',
    icon: 'users',
    label: 'Compatible',
    angleDegrees: 15,
    orbitRadius: 145,
    tint: '#F5C273',
    isProfileCard: true,
  },
  // Meaningful Relationships & Location Discovery
  {
    id: 'match',
    icon: 'heart',
    label: 'Match',
    angleDegrees: 315,
    orbitRadius: 125,
    tint: '#F06185',
    isProfileCard: false,
  },
  {
    id: 'vows',
    icon: 'rings',
    label: 'Vows',
    angleDegrees: 140,
    orbitRadius: 130,
    tint: '#FCD16B',
    isProfileCard: false,
  },
  {
    id: 'nearby',
    icon: 'map-pin',
    label: 'Nearby',
    angleDegrees: 245,
    orbitRadius: 135,
    tint: '#8CADFA',
    isProfileCard: false,
  },
  // Core Margam Interest Badges & AI Life Map
  {
    id: 'business',
    icon: 'briefcase',
    label: 'Business',
    angleDegrees: 65,
    orbitRadius: 150,
    tint: '#A68CF2',
    isProfileCard: false,
  },
  {
    id: 'travel',
    icon: 'plane',
    label: 'Travel',
    angleDegrees: 105,
    orbitRadius: 155,
    tint: '#6BC0F2',
    isProfileCard: false,
  },
  {
    id: 'fitness',
    icon: 'activity',
    label: 'Fitness',
    angleDegrees: 280,
    orbitRadius: 155,
    tint: '#FA9E7A',
    isProfileCard: false,
  },
  {
    id: 'nature',
    icon: 'leaf',
    label: 'Nature',
    angleDegrees: 345,
    orbitRadius: 160,
    tint: '#73D1A6',
    isProfileCard: false,
  },
  {
    id: 'food',
    icon: 'utensils',
    label: 'Food',
    angleDegrees: 218,
    orbitRadius: 165,
    tint: '#F5B861',
    isProfileCard: false,
  },
  {
    id: 'lifemap',
    icon: 'sparkles',
    label: 'Life Map',
    angleDegrees: 42,
    orbitRadius: 118,
    tint: '#FCDC85',
    isProfileCard: false,
  },
];

// MARK: - Official Margam Pin + Heart Emblem Shape Component
interface MargamPinHeartShapeProps {
  width: number;
  height: number;
  strokeWidth?: number;
}

export const MargamPinHeartShape: React.FC<MargamPinHeartShapeProps> = ({
  width,
  height,
  strokeWidth = 1.5,
}) => {
  const w = width;
  const h = height;

  // Exact Bézier path formula matching MargamPinHeartShape.swift
  const pinPath = `
    M ${w * 0.5} ${h * 0.98}
    C ${w * 0.30} ${h * 0.78}, ${w * 0.12} ${h * 0.58}, ${w * 0.12} ${h * 0.40}
    A ${w * 0.38} ${w * 0.38} 0 0 1 ${w * 0.88} ${h * 0.40}
    C ${w * 0.88} ${h * 0.58}, ${w * 0.70} ${h * 0.78}, ${w * 0.5} ${h * 0.98}
    Z
  `;

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <LinearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F43F5E" />
          <Stop offset="50%" stopColor="#C026D3" />
          <Stop offset="100%" stopColor="#F97316" />
        </LinearGradient>
        <LinearGradient id="emblemStrokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.85} />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.15} />
        </LinearGradient>
        <LinearGradient id="innerHeartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#FDE68A" />
        </LinearGradient>
      </Defs>

      {/* Outer Location Pin Silhouette */}
      <Path
        d={pinPath}
        fill="url(#emblemGrad)"
        stroke="url(#emblemStrokeGrad)"
        strokeWidth={strokeWidth}
      />

      {/* Inner Heart Core */}
      <G transform={`translate(${w * 0.5 - 14}, ${h * 0.40 - 18})`}>
        <Path
          d="M 14 6 C 14 2.5 10 0 7 0 C 3 0 0 3 0 7 C 0 13 8 18 14 22 C 20 18 28 13 28 7 C 28 3 25 0 21 0 C 18 0 14 2.5 14 6 Z"
          fill="url(#innerHeartGrad)"
        />
      </G>
    </Svg>
  );
};

// MARK: - Subtle Curved Discovery Route Line
interface DiscoveryRoutePathProps {
  width: number;
  height: number;
  strokeDashoffset?: number;
}

export const DiscoveryRoutePath: React.FC<DiscoveryRoutePathProps> = ({
  width,
  height,
  strokeDashoffset = 0,
}) => {
  const d = `
    M 0 ${height * 0.75}
    C ${width * 0.35} ${height * 0.10}, ${width * 0.65} ${height * 0.90}, ${width} ${height * 0.25}
  `;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.0} />
          <Stop offset="30%" stopColor="#FFFFFF" stopOpacity={0.45} />
          <Stop offset="65%" stopColor="#FDE68A" stopOpacity={0.70} />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.0} />
        </LinearGradient>
      </Defs>
      <Path
        d={d}
        stroke="url(#routeGrad)"
        strokeWidth={2}
        strokeDasharray="6, 6"
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
};
