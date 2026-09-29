// MARGAM - Interactive Cartography & Anonymous Discovery Canvas
// Works seamlessly on Android, iOS, and Web with zero external native binary crashes

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Rect,
  Text as SvgText,
  Line,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { AnonymousCandidate, RouteCorridor } from '../../types';
import { Shield, Navigation, Compass, Layers, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = 380;

interface MargamInteractiveMapProps {
  candidates: AnonymousCandidate[];
  activeRoute: RouteCorridor;
  selectedCandidate: AnonymousCandidate | null;
  onSelectCandidate: (candidate: AnonymousCandidate) => void;
  showPrivacyZones?: boolean;
}

export const MargamInteractiveMap: React.FC<MargamInteractiveMapProps> = ({
  candidates,
  activeRoute,
  selectedCandidate,
  onSelectCandidate,
  showPrivacyZones = true,
}) => {
  const [activeLayer, setActiveLayer] = useState<'corridor' | 'all'>('corridor');

  // Coordinate projection mapping for Kerala Corridor (Thrissur ~ 10.52 to Kochi ~ 9.93)
  // Maps Lat/Lng to SVG coordinate system [X: 20 -> 360, Y: 40 -> 340]
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 9.85;
    const maxLat = 10.65;
    const minLng = 76.15;
    const maxLng = 76.45;

    // Invert Lat for Y (North is up)
    const normY = (maxLat - lat) / (maxLat - minLat);
    const normX = (lng - minLng) / (maxLng - minLng);

    const x = Math.max(30, Math.min(width - 30, normX * (width - 40) + 20));
    const y = Math.max(30, Math.min(MAP_HEIGHT - 30, normY * (MAP_HEIGHT - 60) + 30));

    return { x, y };
  };

  // Convert waypoints into SVG path string
  const routePathString = activeRoute.waypoints.reduce((acc, wp, index) => {
    const { x, y } = projectCoords(wp.lat, wp.lng);
    return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <View style={styles.mapContainer}>
      {/* Top Map Status Bar */}
      <View style={styles.topControlOverlay}>
        <View style={styles.routePill}>
          <Navigation size={12} color={COLORS.routeCyan} />
          <Text style={styles.routePillText}>
            {activeRoute.origin.name} &rarr; {activeRoute.destination.name}
          </Text>
          <Text style={styles.distanceBadge}>{activeRoute.durationLabel}</Text>
        </View>

        <TouchableOpacity
          style={[styles.layerToggle, activeLayer === 'corridor' && styles.layerToggleActive]}
          onPress={() => setActiveLayer(activeLayer === 'corridor' ? 'all' : 'corridor')}
          activeOpacity={0.8}
        >
          <Layers size={12} color={activeLayer === 'corridor' ? COLORS.primary : COLORS.textMuted} />
          <Text
            style={[
              styles.layerToggleText,
              activeLayer === 'corridor' && styles.layerToggleTextActive,
            ]}
          >
            {activeLayer === 'corridor' ? 'Corridor (5km)' : 'All Areas'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SVG Vector Map Rendering Canvas */}
      <Svg width={width} height={MAP_HEIGHT} style={styles.svgCanvas}>
        <Defs>
          {/* Subtle Cartographic Background Mesh */}
          <RadialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#16202C" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#0B0F14" stopOpacity="1" />
          </RadialGradient>

          {/* Route Glow & Dash */}
          <LinearGradient id="routeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.primary} />
            <Stop offset="50%" stopColor={COLORS.routeAmber} />
            <Stop offset="100%" stopColor={COLORS.routeCyan} />
          </LinearGradient>

          {/* Privacy Zone Gradient */}
          <RadialGradient id="privacyZoneGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.25" />
            <Stop offset="80%" stopColor={COLORS.primary} stopOpacity="0.05" />
            <Stop offset="100%" stopColor={COLORS.primary} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Map Background Surface */}
        <Rect width={width} height={MAP_HEIGHT} fill="url(#mapGlow)" />

        {/* Topographic Cartographic Grid Lines */}
        {[80, 160, 240, 320].map((coordY) => (
          <Line
            key={`grid_h_${coordY}`}
            x1="0"
            y1={coordY}
            x2={width}
            y2={coordY}
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}
        {[80, 180, 280].map((coordX) => (
          <Line
            key={`grid_v_${coordX}`}
            x1={coordX}
            y1="0"
            x2={coordX}
            y2={MAP_HEIGHT}
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}

        {/* Active Route Buffer Corridor (5 km privacy buffer envelope) */}
        <Path
          d={routePathString}
          stroke="rgba(56, 189, 248, 0.15)"
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Outer Route Glow */}
        <Path
          d={routePathString}
          stroke="rgba(245, 158, 11, 0.35)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Core Route Polyline */}
        <Path
          d={routePathString}
          stroke="url(#routeGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Route Origin (Thrissur) & Destination (Kochi) Endpoints */}
        {(() => {
          const originPt = projectCoords(activeRoute.origin.lat, activeRoute.origin.lng);
          const destPt = projectCoords(activeRoute.destination.lat, activeRoute.destination.lng);
          return (
            <G>
              {/* Origin Circle */}
              <Circle cx={originPt.x} cy={originPt.y} r="7" fill={COLORS.primary} />
              <Circle cx={originPt.x} cy={originPt.y} r="3" fill="#FFF" />
              <SvgText
                x={originPt.x + 12}
                y={originPt.y + 4}
                fill={COLORS.textPrimary}
                fontSize="11"
                fontWeight="700"
              >
                Thrissur (Start)
              </SvgText>

              {/* Destination Circle */}
              <Circle cx={destPt.x} cy={destPt.y} r="7" fill={COLORS.routeCyan} />
              <Circle cx={destPt.x} cy={destPt.y} r="3" fill="#FFF" />
              <SvgText
                x={destPt.x - 85}
                y={destPt.y + 16}
                fill={COLORS.textPrimary}
                fontSize="11"
                fontWeight="700"
              >
                Kochi (Destination)
              </SvgText>
            </G>
          );
        })()}

        {/* Privacy Zones (Anti-Triangulation Visualizer) */}
        {showPrivacyZones &&
          candidates.map((candidate) => {
            const pt = projectCoords(
              candidate.fuzzedCoordinate.latitude,
              candidate.fuzzedCoordinate.longitude
            );
            const isSelected = selectedCandidate?.id === candidate.id;
            return (
              <G key={`zone_${candidate.id}`}>
                <Circle
                  cx={pt.x}
                  cy={pt.y}
                  r={candidate.clusterCount ? 38 : 28}
                  fill="url(#privacyZoneGrad)"
                />
                <Circle
                  cx={pt.x}
                  cy={pt.y}
                  r={candidate.clusterCount ? 38 : 28}
                  stroke={isSelected ? COLORS.primary : 'rgba(229, 139, 88, 0.2)'}
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              </G>
            );
          })}
      </Svg>

      {/* Interactive Anonymous Markers Overlay */}
      {candidates.map((candidate) => {
        const pt = projectCoords(
          candidate.fuzzedCoordinate.latitude,
          candidate.fuzzedCoordinate.longitude
        );
        const isSelected = selectedCandidate?.id === candidate.id;

        // Render Cluster Marker if multiple profiles exist in area (e.g. 7 or 4 matches)
        if (candidate.clusterCount && candidate.clusterCount > 1) {
          return (
            <TouchableOpacity
              key={`marker_${candidate.id}`}
              style={[
                styles.clusterMarker,
                { left: pt.x - 30, top: pt.y - 18 },
                isSelected && styles.markerSelected,
              ]}
              onPress={() => onSelectCandidate(candidate)}
              activeOpacity={0.85}
            >
              <View style={styles.clusterInner}>
                <Text style={styles.clusterCountText}>{candidate.clusterCount}</Text>
                <Text style={styles.clusterSubText}>matches</Text>
              </View>
            </TouchableOpacity>
          );
        }

        // Render Anonymous Single Marker: 💍 92%
        return (
          <TouchableOpacity
            key={`marker_${candidate.id}`}
            style={[
              styles.anonymousMarker,
              { left: pt.x - 36, top: pt.y - 18 },
              isSelected && styles.markerSelected,
              candidate.isAlongRoute && styles.markerRouteSynergy,
            ]}
            onPress={() => onSelectCandidate(candidate)}
            activeOpacity={0.85}
          >
            <View style={styles.markerBadge}>
              <Text style={styles.markerRingIcon}>💍</Text>
              <Text style={styles.markerCompatPercent}>
                {candidate.compatibilityPercentage}%
              </Text>
            </View>
            {candidate.isAlongRoute && (
              <View style={styles.alongRouteIndicator}>
                <Text style={styles.alongRouteIndicatorText}>Route</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Bottom Privacy Assurance Banner */}
      <View style={styles.bottomPrivacyNotice}>
        <Shield size={12} color={COLORS.primary} />
        <Text style={styles.bottomPrivacyNoticeText}>
          Coordinates fuzzed (2.5–4.5 km). Direct profiles remain anonymous until requested.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: MAP_HEIGHT,
    backgroundColor: COLORS.background,
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  svgCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topControlOverlay: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  routePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(18, 24, 32, 0.92)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  routePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  distanceBadge: {
    fontSize: 10,
    color: COLORS.routeCyan,
    fontWeight: '600',
    marginLeft: 4,
  },
  layerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(18, 24, 32, 0.92)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  layerToggleActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(229, 139, 88, 0.15)',
  },
  layerToggleText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  layerToggleTextActive: {
    color: COLORS.primary,
  },
  anonymousMarker: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 35, 46, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 5,
  },
  markerRouteSynergy: {
    borderColor: COLORS.routeAmber,
  },
  markerSelected: {
    borderColor: '#FFF',
    backgroundColor: COLORS.surfaceHover,
    transform: [{ scale: 1.15 }],
    zIndex: 9,
  },
  markerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  markerRingIcon: {
    fontSize: 12,
  },
  markerCompatPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  alongRouteIndicator: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 4,
  },
  alongRouteIndicatorText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.routeAmber,
    textTransform: 'uppercase',
  },
  clusterMarker: {
    position: 'absolute',
    backgroundColor: 'rgba(229, 139, 88, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 6,
  },
  clusterInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clusterCountText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0B0F14',
  },
  clusterSubText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0B0F14',
  },
  bottomPrivacyNotice: {
    position: 'absolute',
    bottom: 6,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(11, 15, 20, 0.85)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  bottomPrivacyNoticeText: {
    fontSize: 10,
    color: COLORS.textMuted,
    flex: 1,
  },
});
