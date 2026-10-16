// MARGAM - Google Maps Kochi Cartography & Interactive Cluster Canvas
// Replicates the exact Kochi, Kerala map layout, water bodies, road shields, and glowing cluster markers

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Rect,
  Text as SvgText,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { Navigation } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = 440;

export interface MapCluster {
  id: string;
  name: string;
  count: number;
  lat: number;
  lng: number;
  colorType: 'blue' | 'purple' | 'green' | 'magenta' | 'darkblue';
  areaName: string;
  distanceLabel: string;
  compatTier: string;
}

export const KOCHI_CLUSTERS: MapCluster[] = [
  {
    id: 'cluster_kalamassery',
    name: 'Kalamassery / Edappally',
    count: 8,
    lat: 10.045,
    lng: 76.315,
    colorType: 'blue',
    areaName: 'Within 5 km',
    distanceLabel: 'Edappally - Kalamassery',
    compatTier: '85%+',
  },
  {
    id: 'cluster_edappally_north',
    name: 'Edappally North',
    count: 3,
    lat: 10.038,
    lng: 76.368,
    colorType: 'purple',
    areaName: 'Along your route',
    distanceLabel: 'Edappally Bypass',
    compatTier: '80%+',
  },
  {
    id: 'cluster_kakkanad',
    name: 'Kakkanad Infopark',
    count: 5,
    lat: 10.012,
    lng: 76.388,
    colorType: 'green',
    areaName: '5 - 10 km',
    distanceLabel: 'Kakkanad IT Zone',
    compatTier: '75%+',
  },
  {
    id: 'cluster_mattancherry',
    name: 'Mattancherry / West Kochi',
    count: 4,
    lat: 9.955,
    lng: 76.258,
    colorType: 'magenta',
    areaName: 'Within 8 km',
    distanceLabel: 'Heritage Belt',
    compatTier: '80%+',
  },
  {
    id: 'cluster_vyttila',
    name: 'Vyttila / South Hub',
    count: 6,
    lat: 9.968,
    lng: 76.328,
    colorType: 'darkblue',
    areaName: 'At destination',
    distanceLabel: 'Vyttila Junction',
    compatTier: '70%+',
  },
];

interface KochiGoogleMapViewProps {
  selectedClusterId: string | null;
  onSelectCluster: (cluster: MapCluster) => void;
  onCenterLocation?: () => void;
}

export const KochiGoogleMapView: React.FC<KochiGoogleMapViewProps> = ({
  selectedClusterId,
  onSelectCluster,
  onCenterLocation,
}) => {
  // Projects Kochi coordinates to SVG [0..width, 0..MAP_HEIGHT]
  const project = (lat: number, lng: number) => {
    const minLat = 9.91;
    const maxLat = 10.08;
    const minLng = 76.21;
    const maxLng = 76.42;

    const normY = (maxLat - lat) / (maxLat - minLat);
    const normX = (lng - minLng) / (maxLng - minLng);

    const x = Math.max(30, Math.min(width - 30, normX * (width - 40) + 20));
    const y = Math.max(30, Math.min(MAP_HEIGHT - 30, normY * (MAP_HEIGHT - 60) + 30));

    return { x, y };
  };

  // User current position (Kochi Center)
  const userPt = project(9.988, 76.305);

  return (
    <View style={styles.container}>
      <Svg width={width} height={MAP_HEIGHT} style={styles.svgMap}>
        <Defs>
          {/* Water Radial Gradient for Backwaters */}
          <LinearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#A5D4E6" />
            <Stop offset="100%" stopColor="#BCE3F1" />
          </LinearGradient>

          {/* User Radar Pulse */}
          <RadialGradient id="userPulseGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
            <Stop offset="70%" stopColor="#3B82F6" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </RadialGradient>

          {/* Cluster Gradients */}
          {/* Blue Cluster (8 matches) */}
          <LinearGradient id="blueClusterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#3B82F6" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </LinearGradient>
          <RadialGradient id="blueHalo" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </RadialGradient>

          {/* Purple Cluster (3 matches) */}
          <LinearGradient id="purpleClusterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#A855F7" />
            <Stop offset="100%" stopColor="#7E22CE" />
          </LinearGradient>
          <RadialGradient id="purpleHalo" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#A855F7" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </RadialGradient>

          {/* Green Cluster (5 matches) */}
          <LinearGradient id="greenClusterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#34D399" />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
          <RadialGradient id="greenHalo" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </RadialGradient>

          {/* Magenta Cluster (4 matches) */}
          <LinearGradient id="magentaClusterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#C084FC" />
            <Stop offset="100%" stopColor="#9333EA" />
          </LinearGradient>
          <RadialGradient id="magentaHalo" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#C084FC" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
          </RadialGradient>

          {/* Dark Blue Cluster (6 matches) */}
          <LinearGradient id="darkblueClusterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2563EB" />
            <Stop offset="100%" stopColor="#1E40AF" />
          </LinearGradient>
          <RadialGradient id="darkblueHalo" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* 1. Base Google Maps Land Surface (Warm Beige/Pastel Gray) */}
        <Rect width={width} height={MAP_HEIGHT} fill="#EDF1EA" />

        {/* 2. Kochi Backwaters & Water Channels (Arabian Sea / Vembanad Lake) */}
        {/* West Sea / Harbor Inlets */}
        <Path
          d={`M 0 0 L 80 0 C 70 80, 50 140, 65 200 C 80 260, 45 320, 20 440 L 0 440 Z`}
          fill="url(#waterGrad)"
        />
        {/* Vembanad Channel Inlets passing through Kochi */}
        <Path
          d={`M 65 140 Q 120 180 150 230 Q 180 280 140 360 Q 110 410 90 440 L 60 440 Q 90 380 120 310 Q 110 240 50 160 Z`}
          fill="url(#waterGrad)"
        />
        {/* Marine Drive Channel */}
        <Path
          d={`M 130 110 Q 165 170 190 250 Q 210 320 180 390 L 165 385 Q 195 320 175 250 Q 150 180 115 115 Z`}
          fill="url(#waterGrad)"
        />

        {/* 3. Park Greenery Zones (Subtle Google Maps Green) */}
        <Path
          d="M 50 80 Q 70 70 80 100 Q 65 130 45 110 Z"
          fill="#D6E8D5"
        />
        <Path
          d="M 280 40 Q 320 30 340 70 Q 310 90 270 70 Z"
          fill="#D6E8D5"
        />
        <Path
          d="M 260 200 Q 300 180 330 220 Q 300 250 250 230 Z"
          fill="#D6E8D5"
        />

        {/* 4. Local Road Grid (Clean White Lines) */}
        {[70, 130, 190, 250, 310, 370].map((ry) => (
          <Path
            key={`r_h_${ry}`}
            d={`M 0 ${ry} Q ${width * 0.4} ${ry + 15} ${width} ${ry - 10}`}
            stroke="#FFFFFF"
            strokeWidth="3.5"
            fill="none"
          />
        ))}
        {[80, 150, 220, 290, 350].map((rx) => (
          <Path
            key={`r_v_${rx}`}
            d={`M ${rx} 0 Q ${rx - 20} ${MAP_HEIGHT * 0.5} ${rx + 15} ${MAP_HEIGHT}`}
            stroke="#FFFFFF"
            strokeWidth="3.5"
            fill="none"
          />
        ))}

        {/* 5. Major Arterial Highways (Google Maps Golden Yellow - NH 66 & NH 544) */}
        {/* NH 66 (North to South through Edappally & Vyttila) */}
        <Path
          d={`M 170 0 Q 200 120 220 220 Q 240 320 260 440`}
          stroke="#FCD34D"
          strokeWidth="5"
          fill="none"
        />
        {/* NH 544 (East towards Aluva/Angamaly) */}
        <Path
          d={`M 200 120 Q 280 150 350 180 L ${width} 200`}
          stroke="#FCD34D"
          strokeWidth="5"
          fill="none"
        />
        {/* Seaport-Airport Road */}
        <Path
          d={`M 270 50 Q 300 170 330 300 L 350 440`}
          stroke="#FDE68A"
          strokeWidth="4"
          fill="none"
        />

        {/* Highway Shields: 66 and 544 */}
        <G transform="translate(178, 110)">
          <Rect width="18" height="15" rx="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="1" />
          <SvgText x="9" y="11" fontSize="9" fontWeight="800" fill="#92400E" textAnchor="middle">
            66
          </SvgText>
        </G>
        <G transform="translate(370, 200)">
          <Rect width="22" height="15" rx="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="1" />
          <SvgText x="11" y="11" fontSize="9" fontWeight="800" fill="#92400E" textAnchor="middle">
            544
          </SvgText>
        </G>

        {/* 6. City / Neighborhood Text Labels */}
        <SvgText x="60" y="200" fontSize="10" fontWeight="600" fill="#64748B">
          Fort Kochi
        </SvgText>
        <SvgText x="62" y="240" fontSize="10" fontWeight="600" fill="#64748B">
          Mattancherry
        </SvgText>
        <SvgText x="202" y="235" fontSize="14" fontWeight="800" fill="#1E293B">
          Kochi
        </SvgText>
        <SvgText x="206" y="145" fontSize="10" fontWeight="600" fill="#475569">
          Edappally
        </SvgText>
        <SvgText x="315" y="100" fontSize="10" fontWeight="600" fill="#475569">
          Kalamassery
        </SvgText>
        <SvgText x="315" y="148" fontSize="10" fontWeight="600" fill="#475569">
          Kakkanad
        </SvgText>
        <SvgText x="274" y="215" fontSize="10" fontWeight="600" fill="#475569">
          Vyttila
        </SvgText>

        {/* 7. Current User Pulsing Location Marker (Center Blue Dot + Radar Halo) */}
        <Circle cx={userPt.x} cy={userPt.y} r="28" fill="url(#userPulseGrad)" />
        <Circle cx={userPt.x} cy={userPt.y} r="8" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
      </Svg>

      {/* 8. Interactive Glowing Gradient Cluster Bubbles (Matches the screenshot precisely) */}
      {KOCHI_CLUSTERS.map((cluster) => {
        const pt = project(cluster.lat, cluster.lng);
        const isSelected = selectedClusterId === cluster.id;

        // Styling variants for each cluster
        let bgGrad = styles.clusterBlue;
        let haloColor = 'rgba(37, 99, 235, 0.25)';
        let dotColor = '#60A5FA';

        if (cluster.colorType === 'purple') {
          bgGrad = styles.clusterPurple;
          haloColor = 'rgba(168, 85, 247, 0.25)';
          dotColor = '#C084FC';
        } else if (cluster.colorType === 'green') {
          bgGrad = styles.clusterGreen;
          haloColor = 'rgba(16, 185, 129, 0.25)';
          dotColor = '#34D399';
        } else if (cluster.colorType === 'magenta') {
          bgGrad = styles.clusterMagenta;
          haloColor = 'rgba(192, 132, 252, 0.25)';
          dotColor = '#E879F9';
        } else if (cluster.colorType === 'darkblue') {
          bgGrad = styles.clusterDarkBlue;
          haloColor = 'rgba(30, 64, 175, 0.25)';
          dotColor = '#93C5FD';
        }

        return (
          <TouchableOpacity
            key={cluster.id}
            style={[
              styles.markerWrapper,
              { left: pt.x - 28, top: pt.y - 28 },
              isSelected && styles.markerWrapperSelected,
            ]}
            onPress={() => onSelectCluster(cluster)}
            activeOpacity={0.85}
          >
            {/* Outer Glowing Radar Halo */}
            <View style={[styles.haloRing, { borderColor: haloColor }]} />

            {/* Top Micro-Dot Indicator */}
            <View style={[styles.topMicroDot, { backgroundColor: dotColor }]} />

            {/* Main Gradient Bubble */}
            <View style={[styles.clusterCircle, bgGrad]}>
              <Text style={styles.clusterNumber}>{cluster.count}</Text>
              <Text style={styles.clusterLabel}>matches</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* 9. Floating Navigation Arrow FAB (Bottom-Right of Map) */}
      <TouchableOpacity
        style={styles.navFab}
        onPress={onCenterLocation}
        activeOpacity={0.85}
      >
        <Navigation size={20} color="#0F172A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: MAP_HEIGHT,
    backgroundColor: '#EDF1EA',
    position: 'relative',
    overflow: 'hidden',
  },
  svgMap: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  markerWrapper: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  markerWrapperSelected: {
    transform: [{ scale: 1.15 }],
    zIndex: 20,
  },
  haloRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  topMicroDot: {
    position: 'absolute',
    top: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    zIndex: 12,
  },
  clusterCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  clusterBlue: {
    backgroundColor: '#2563EB',
  },
  clusterPurple: {
    backgroundColor: '#9333EA',
  },
  clusterGreen: {
    backgroundColor: '#10B981',
  },
  clusterMagenta: {
    backgroundColor: '#A855F7',
  },
  clusterDarkBlue: {
    backgroundColor: '#1D4ED8',
  },
  clusterNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 15,
  },
  clusterLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'lowercase',
  },
  navFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 15,
  },
});
