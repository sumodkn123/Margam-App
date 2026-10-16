import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Path,
  Circle,
  G,
  Polygon,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface KeralaSunriseBackdropProps {
  width?: number;
  height?: number;
  showRoute?: boolean;
}

export const KeralaSunriseBackdrop: React.FC<KeralaSunriseBackdropProps> = ({
  width = SCREEN_WIDTH,
  height = SCREEN_HEIGHT,
  showRoute = true,
}) => {
  // Proportional horizon positioning
  const horizonY = height * 0.60;
  const sunY = height * 0.50;
  const sunX = width * 0.5;

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      {/* 1. Photorealistic Base Photographic Layer (Scenic Kerala Sunrise Backwaters) */}
      <Image
        source={require('../../../assets/splash/bg_kerala_clean.png')}
        style={[styles.backdropImage, { width, height }]}
        resizeMode="cover"
      />

      {/* 2. Route & Terrain Transition Overlay when in Phase 2 & 3 */}
      {showRoute && (
        <Image
          source={require('../../../assets/splash/bg_kerala_route_panel2.png')}
          style={[styles.backdropImage, styles.routeImageOverlay, { width, height }]}
          resizeMode="cover"
        />
      )}
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={styles.svgOverlay}>
        <Defs>
          {/* 1. Cinematic Kerala Dawn Sky Gradient */}
          <LinearGradient id="dawnSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#110E2E" stopOpacity={1} />
            <Stop offset="20%" stopColor="#241442" stopOpacity={1} />
            <Stop offset="38%" stopColor="#4A154B" stopOpacity={1} />
            <Stop offset="55%" stopColor="#7E1D4A" stopOpacity={0.98} />
            <Stop offset="72%" stopColor="#B91C1C" stopOpacity={0.95} />
            <Stop offset="86%" stopColor="#F43F5E" stopOpacity={0.92} />
            <Stop offset="94%" stopColor="#FB923C" stopOpacity={0.95} />
            <Stop offset="100%" stopColor="#FDE68A" stopOpacity={1} />
          </LinearGradient>

          {/* 2. Volumetric Sunbeams Radial Gradient */}
          <RadialGradient id="sunburstGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFBEB" stopOpacity={0.98} />
            <Stop offset="25%" stopColor="#FDE68A" stopOpacity={0.80} />
            <Stop offset="55%" stopColor="#FB7185" stopOpacity={0.40} />
            <Stop offset="85%" stopColor="#9D174D" stopOpacity={0.15} />
            <Stop offset="100%" stopColor="#4A154B" stopOpacity={0} />
          </RadialGradient>

          {/* 3. Mountain Ridge Gradients */}
          <LinearGradient id="farMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#581C87" stopOpacity={0.50} />
            <Stop offset="100%" stopColor="#831843" stopOpacity={0.80} />
          </LinearGradient>

          <LinearGradient id="midMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#2E1065" stopOpacity={0.75} />
            <Stop offset="100%" stopColor="#4A044E" stopOpacity={0.92} />
          </LinearGradient>

          <LinearGradient id="nearRidgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1E1B4B" stopOpacity={0.90} />
            <Stop offset="100%" stopColor="#18181B" stopOpacity={1} />
          </LinearGradient>

          {/* 4. Tranquil Backwaters Reflection Gradient */}
          <LinearGradient id="backwatersGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FDE68A" stopOpacity={0.75} />
            <Stop offset="12%" stopColor="#FB7185" stopOpacity={0.65} />
            <Stop offset="30%" stopColor="#831843" stopOpacity={0.80} />
            <Stop offset="60%" stopColor="#241442" stopOpacity={0.92} />
            <Stop offset="100%" stopColor="#09090B" stopOpacity={0.99} />
          </LinearGradient>

          {/* 5. Glowing Serpentine Margam Pathway Ribbon */}
          <LinearGradient id="serpentineRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FECDD3" stopOpacity={1} />
            <Stop offset="40%" stopColor="#F43F5E" stopOpacity={1} />
            <Stop offset="75%" stopColor="#E11D48" stopOpacity={0.95} />
            <Stop offset="100%" stopColor="#FDA4AF" stopOpacity={0.85} />
          </LinearGradient>

          {/* 6. Soft Cloud Highlights */}
          <LinearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FDE68A" stopOpacity={0.35} />
            <Stop offset="100%" stopColor="#FB7185" stopOpacity={0.05} />
          </LinearGradient>

          {/* 7. Palm Foliage Silhouette Gradient */}
          <LinearGradient id="palmSilhouetteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#09090B" stopOpacity={0.98} />
            <Stop offset="100%" stopColor="#18181B" stopOpacity={0.92} />
          </LinearGradient>
        </Defs>

        {/* ========================================================= */}
        {/* 1. SKY BASE LAYER                                         */}
        {/* ========================================================= */}
        <Rect x="0" y="0" width={width} height={horizonY} fill="url(#dawnSkyGrad)" />

        {/* Volumetric Sunrise Light Fan (Sunbeams piercing through dawn haze) */}
        <G opacity={0.38}>
          <Polygon points={`${sunX},${sunY + 12} ${sunX - 180},0 ${sunX - 110},0`} fill="#FFFBEB" />
          <Polygon points={`${sunX},${sunY + 12} ${sunX - 80},0 ${sunX - 10},0`} fill="#FDE68A" />
          <Polygon points={`${sunX},${sunY + 12} ${sunX + 30},0 ${sunX + 110},0`} fill="#FDE68A" />
          <Polygon points={`${sunX},${sunY + 12} ${sunX + 140},0 ${sunX + 220},0`} fill="#FFFBEB" />
          <Polygon points={`${sunX},${sunY + 12} ${width},${horizonY * 0.25} ${width},${horizonY * 0.45}`} fill="#FDE68A" />
          <Polygon points={`${sunX},${sunY + 12} 0,${horizonY * 0.25} 0,${horizonY * 0.45}`} fill="#FDE68A" />
        </G>

        {/* Radiant Rising Sun Halo */}
        <Circle cx={sunX} cy={sunY + 12} r={width * 0.48} fill="url(#sunburstGrad)" />
        <Circle cx={sunX} cy={sunY + 12} r={34} fill="#FFFBEB" opacity={0.96} />
        <Circle cx={sunX} cy={sunY + 12} r={46} stroke="#FDE68A" strokeWidth="2.5" fill="none" opacity={0.7} />

        {/* Soft Drifting Morning Clouds */}
        <Path
          d={`M ${width * 0.1} ${horizonY - 95}
              Q ${width * 0.25} ${horizonY - 115} ${width * 0.4} ${horizonY - 98}
              Q ${width * 0.55} ${horizonY - 120} ${width * 0.7} ${horizonY - 92}
              Q ${width * 0.85} ${horizonY - 105} ${width * 0.95} ${horizonY - 88}
              L ${width * 0.95} ${horizonY - 78} L ${width * 0.1} ${horizonY - 78} Z`}
          fill="url(#cloudGrad)"
        />

        {/* ========================================================= */}
        {/* 2. LAYERED MOUNTAIN RIDGES (Western Ghats Silhouette)     */}
        {/* ========================================================= */}
        {/* Far Ridge */}
        <Path
          d={`M 0 ${horizonY - 30}
              Q ${width * 0.18} ${horizonY - 85} ${width * 0.35} ${horizonY - 45}
              Q ${width * 0.52} ${horizonY - 95} ${width * 0.70} ${horizonY - 50}
              Q ${width * 0.85} ${horizonY - 80} ${width} ${horizonY - 35}
              L ${width} ${horizonY} L 0 ${horizonY} Z`}
          fill="url(#farMountainGrad)"
        />

        {/* Mid Ridge */}
        <Path
          d={`M 0 ${horizonY - 18}
              Q ${width * 0.14} ${horizonY - 55} ${width * 0.28} ${horizonY - 26}
              Q ${width * 0.46} ${horizonY - 65} ${width * 0.62} ${horizonY - 22}
              Q ${width * 0.80} ${horizonY - 50} ${width} ${horizonY - 16}
              L ${width} ${horizonY} L 0 ${horizonY} Z`}
          fill="url(#midMountainGrad)"
        />

        {/* Low Foothills & Distant Island Shoreline */}
        <Path
          d={`M 0 ${horizonY - 8}
              Q ${width * 0.25} ${horizonY - 24} ${width * 0.5} ${horizonY - 8}
              Q ${width * 0.75} ${horizonY - 22} ${width} ${horizonY - 6}
              L ${width} ${horizonY} L 0 ${horizonY} Z`}
          fill="url(#nearRidgeGrad)"
        />

        {/* ========================================================= */}
        {/* 3. CALM BACKWATERS WATER WITH SUNRISE REFLECTIONS        */}
        {/* ========================================================= */}
        <Rect x="0" y={horizonY} width={width} height={height - horizonY} fill="url(#backwatersGrad)" />

        {/* Luminous Sun Column Reflection */}
        <Polygon
          points={`${sunX - 22},${horizonY} ${sunX + 22},${horizonY} ${sunX + 55},${horizonY + 85} ${sunX - 55},${horizonY + 85}`}
          fill="#FFFBEB"
          opacity={0.42}
        />
        <Polygon
          points={`${sunX - 48},${horizonY + 85} ${sunX + 48},${horizonY + 85} ${sunX + 90},${height} ${sunX - 90},${height}`}
          fill="#FDE68A"
          opacity={0.25}
        />

        {/* Delicate Horizontal Water Ripples */}
        <Path
          d={`M ${sunX - 60} ${horizonY + 18} Q ${sunX} ${horizonY + 22} ${sunX + 60} ${horizonY + 18}`}
          stroke="#FFFBEB"
          strokeWidth="1.5"
          opacity={0.55}
        />
        <Path
          d={`M ${sunX - 95} ${horizonY + 44} Q ${sunX} ${horizonY + 49} ${sunX + 95} ${horizonY + 44}`}
          stroke="#FDE68A"
          strokeWidth="1.8"
          opacity={0.45}
        />
        <Path
          d={`M ${sunX - 130} ${horizonY + 76} Q ${sunX} ${horizonY + 82} ${sunX + 130} ${horizonY + 76}`}
          stroke="#FB7185"
          strokeWidth="2.2"
          opacity={0.38}
        />
        <Path
          d={`M ${sunX - 160} ${horizonY + 115} Q ${sunX} ${horizonY + 122} ${sunX + 160} ${horizonY + 115}`}
          stroke="#C084FC"
          strokeWidth="2.0"
          opacity={0.30}
        />

        {/* ========================================================= */}
        {/* 4. TRADITIONAL KERALA KETTUVALLAM (HOUSEBOAT) SILHOUETTE  */}
        {/* ========================================================= */}
        <G transform={`translate(${width * 0.24}, ${horizonY + 22})`}>
          {/* Curved Houseboat Hull with upswept ends */}
          <Path
            d="M 4 20 C 25 32 75 32 98 24 C 104 18 108 12 110 8 C 100 12 88 15 50 16 C 14 15 2 12 4 20 Z"
            fill="#09090B"
            opacity={0.96}
          />
          {/* Thatched Woven Bamboo Roof Structure */}
          <Path
            d="M 18 15 C 22 2 40 0 62 0 C 84 0 94 4 96 15 Z"
            fill="#09090B"
            opacity={0.96}
          />
          {/* Window & door cutouts with warm interior lantern glow */}
          <Rect x="36" y="5" width="8" height="6" rx="1.5" fill="#FDE68A" opacity={0.88} />
          <Rect x="54" y="5" width="8" height="6" rx="1.5" fill="#FDE68A" opacity={0.88} />
          <Rect x="72" y="5" width="8" height="6" rx="1.5" fill="#FDE68A" opacity={0.88} />

          {/* Houseboat mast/pole */}
          <Path d="M 98 15 L 106 5" stroke="#09090B" strokeWidth="2" strokeLinecap="round" />

          {/* Water reflection of the houseboat */}
          <Path
            d="M 10 26 C 30 36 75 36 96 30 L 90 38 C 70 42 30 42 16 32 Z"
            fill="#09090B"
            opacity={0.28}
          />
        </G>

        {/* ========================================================= */}
        {/* 5. COCONUT PALM TREES (Left & Right Shorelines)           */}
        {/* ========================================================= */}
        {/* Left Palm Cluster */}
        <G transform="translate(-15, 0)">
          {/* Tall curved trunk */}
          <Path
            d={`M 18 ${horizonY + 80}
                Q 52 ${horizonY - 30} 46 ${horizonY - 145}
                Q 54 ${horizonY - 145} 26 ${horizonY + 80} Z`}
            fill="url(#palmSilhouetteGrad)"
          />
          {/* Palm Fronds radiating gracefully */}
          <G stroke="#09090B" strokeWidth="3.6" strokeLinecap="round" opacity={0.96}>
            <Path d={`M 46 ${horizonY - 145} Q 80 ${horizonY - 190} 118 ${horizonY - 165}`} />
            <Path d={`M 46 ${horizonY - 145} Q 68 ${horizonY - 215} 80 ${horizonY - 238}`} />
            <Path d={`M 46 ${horizonY - 145} Q 32 ${horizonY - 225} 12 ${horizonY - 245}`} />
            <Path d={`M 46 ${horizonY - 145} Q 10 ${horizonY - 195} -14 ${horizonY - 180}`} />
            <Path d={`M 46 ${horizonY - 145} Q 5 ${horizonY - 140} -20 ${horizonY - 125}`} />
            <Path d={`M 46 ${horizonY - 145} Q 72 ${horizonY - 150} 98 ${horizonY - 135}`} />
          </G>

          {/* Secondary smaller leaning palm */}
          <Path
            d={`M 2 ${horizonY + 55}
                Q 28 ${horizonY - 10} 24 ${horizonY - 95}
                Q 30 ${horizonY - 95} 8 ${horizonY + 55} Z`}
            fill="url(#palmSilhouetteGrad)"
          />
          <G stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" opacity={0.92}>
            <Path d={`M 24 ${horizonY - 95} Q 52 ${horizonY - 135} 82 ${horizonY - 120}`} />
            <Path d={`M 24 ${horizonY - 95} Q 40 ${horizonY - 152} 48 ${horizonY - 170}`} />
            <Path d={`M 24 ${horizonY - 95} Q 8 ${horizonY - 148} -16 ${horizonY - 138}`} />
            <Path d={`M 24 ${horizonY - 95} Q 45 ${horizonY - 100} 70 ${horizonY - 88}`} />
          </G>
        </G>

        {/* Right Palm Cluster */}
        <G transform={`translate(${width - 45}, 0)`}>
          <Path
            d={`M 38 ${horizonY + 70}
                Q 0 ${horizonY - 20} 8 ${horizonY - 135}
                Q 16 ${horizonY - 135} 46 ${horizonY + 70} Z`}
            fill="url(#palmSilhouetteGrad)"
          />
          <G stroke="#09090B" strokeWidth="3.4" strokeLinecap="round" opacity={0.96}>
            <Path d={`M 8 ${horizonY - 135} Q -24 ${horizonY - 180} -58 ${horizonY - 158}`} />
            <Path d={`M 8 ${horizonY - 135} Q -12 ${horizonY - 205} -22 ${horizonY - 228}`} />
            <Path d={`M 8 ${horizonY - 135} Q 22 ${horizonY - 215} 42 ${horizonY - 232}`} />
            <Path d={`M 8 ${horizonY - 135} Q 44 ${horizonY - 178} 68 ${horizonY - 165}`} />
            <Path d={`M 8 ${horizonY - 135} Q -18 ${horizonY - 145} -42 ${horizonY - 130}`} />
          </G>
        </G>

        {/* ========================================================= */}
        {/* 6. GLOWING 3D SERPENTINE MARGAM PATHWAY (Ribbon of Light) */}
        {/* ========================================================= */}
        {showRoute && (
          <G>
            {/* Ambient Ground Glow Spread */}
            <Path
              d={`M ${width * 0.10} ${height * 0.98}
                  C ${width * 0.42} ${height * 0.92}, ${width * 0.24} ${height * 0.82}, ${width * 0.54} ${height * 0.77}
                  C ${width * 0.82} ${height * 0.72}, ${width * 0.68} ${height * 0.67}, ${width * 0.50} ${horizonY + 28}`}
              stroke="#F43F5E"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              opacity={0.24}
            />

            {/* Glowing Outer Neon Halo */}
            <Path
              d={`M ${width * 0.10} ${height * 0.98}
                  C ${width * 0.42} ${height * 0.92}, ${width * 0.24} ${height * 0.82}, ${width * 0.54} ${height * 0.77}
                  C ${width * 0.82} ${height * 0.72}, ${width * 0.68} ${height * 0.67}, ${width * 0.50} ${horizonY + 28}`}
              stroke="#FB7185"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              opacity={0.65}
            />

            {/* Radiant Core Ribbon Line */}
            <Path
              d={`M ${width * 0.10} ${height * 0.98}
                  C ${width * 0.42} ${height * 0.92}, ${width * 0.24} ${height * 0.82}, ${width * 0.54} ${height * 0.77}
                  C ${width * 0.82} ${height * 0.72}, ${width * 0.68} ${height * 0.67}, ${width * 0.50} ${horizonY + 28}`}
              stroke="url(#serpentineRibbonGrad)"
              strokeWidth="3.8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="8, 5"
              opacity={0.98}
            />

            {/* Glowing Map Waypoint Pins along the Path */}
            {/* Waypoint 1 (Near foreground) */}
            <Circle cx={width * 0.24} cy={height * 0.94} r="5.5" fill="#EF4444" />
            <Circle cx={width * 0.24} cy={height * 0.94} r="9" stroke="#FECDD3" strokeWidth="1.8" fill="none" opacity={0.88} />
            <Circle cx={width * 0.24} cy={height * 0.94} r="14" stroke="#FB7185" strokeWidth="1.0" fill="none" opacity={0.45} />

            {/* Waypoint 2 (Mid ground) */}
            <Circle cx={width * 0.45} cy={height * 0.81} r="5.0" fill="#EF4444" />
            <Circle cx={width * 0.45} cy={height * 0.81} r="8.5" stroke="#FECDD3" strokeWidth="1.8" fill="none" opacity={0.88} />

            {/* Waypoint 3 (Far background towards horizon) */}
            <Circle cx={width * 0.51} cy={horizonY + 44} r="4.2" fill="#F43F5E" />
            <Circle cx={width * 0.51} cy={horizonY + 44} r="7.0" stroke="#FDE68A" strokeWidth="1.4" fill="none" opacity={0.90} />
          </G>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  routeImageOverlay: {
    opacity: 0.95,
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.22,
  },
});
