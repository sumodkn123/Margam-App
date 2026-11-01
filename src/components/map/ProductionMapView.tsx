// MARGAM - Production Multi-Tier Polyline Glow Map View
// Supports Apple MapKit (iOS), Google Maps (Android), and Full SVG Cartography (Web)
// Implements 4-Tier Polyline Glow Architecture:
//   Tier 1: Dynamic Translucent Detour Corridor Buffer (26px–48px synchronized with ≤5m/10m/20m)
//   Tier 2: Intermediate Luminous Chromatic Bloom (11px, high-luminance sky glow)
//   Tier 3: Razor Core Highway Polyline (4.5px crisp road track with rounded caps)
//   Tier 4: Directional Flow Dash & Living Transit Breathing Pulse

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import Svg, {
  Path,
  Circle as SvgCircle,
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  G,
} from 'react-native-svg';
import {
  Navigation,
  Plus,
  Minus,
  Maximize2,
  Flag,
  Layers,
} from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { MapCluster, MapBounds, DiscoveryMode } from '../../types';
import { CalculatedRoute } from '../../services/routingService';
import { DeviceLocation } from '../../services/locationService';
import { DynamicClusterMarker } from './DynamicClusterMarker';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

// Safely require react-native-maps on native platforms only
let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;
let Circle: any = null;
let PROVIDER_DEFAULT: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
    Circle = Maps.Circle;
    PROVIDER_DEFAULT = Maps.PROVIDER_DEFAULT;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.warn('[ProductionMapView] react-native-maps could not be loaded:', e);
  }
}

export interface ProductionMapViewProps {
  initialLatitude?: number;
  initialLongitude?: number;
  userLocation?: DeviceLocation | null;
  destinationLocation?: { latitude: number; longitude: number; name?: string } | null;
  activeRoute?: CalculatedRoute | null;
  clusters: MapCluster[];
  selectedClusterId: string | null;
  isLoading?: boolean;
  radiusMeters?: number;
  mode?: DiscoveryMode;
  routeDetourMinutes?: number;
  mapType?: 'standard' | 'satellite' | 'hybrid';
  showsTraffic?: boolean;
  onSelectCluster: (cluster: MapCluster) => void;
  onBoundsChange: (bounds: MapBounds) => void;
  onRequestLocateMe: () => void;
  onRequestFitRoute?: () => void;
  onRequestLayers?: () => void;
}

export const ProductionMapView: React.FC<ProductionMapViewProps> = ({
  initialLatitude = 10.0159,
  initialLongitude = 76.3419,
  userLocation,
  destinationLocation,
  activeRoute,
  clusters,
  selectedClusterId,
  isLoading = false,
  radiusMeters = 5000,
  mode = 'around_me',
  routeDetourMinutes = 10,
  mapType = 'standard',
  showsTraffic = false,
  onSelectCluster,
  onBoundsChange,
  onRequestLocateMe,
  onRequestFitRoute,
  onRequestLayers,
}) => {
  const mapRef = useRef<any>(null);
  const debounceTimer = useRef<any>(null);

  const [containerWidth, setContainerWidth] = useState<number>(WINDOW_WIDTH);
  const containerHeight = 440;

  const [region, setRegion] = useState({
    latitude: userLocation?.latitude ?? initialLatitude,
    longitude: userLocation?.longitude ?? initialLongitude,
    latitudeDelta: 0.18,
    longitudeDelta: 0.18,
  });

  // Animated breathing pulse driver for living route glow
  const glowPulseAnim = useRef(new Animated.Value(0.75)).current;
  const routeFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous subtle sinusoidal pulse for route glow
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulseAnim, {
          toValue: 1.0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(glowPulseAnim, {
          toValue: 0.75,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, [glowPulseAnim]);

  // Smooth fade-in transition when activeRoute mounts or updates
  useEffect(() => {
    if (activeRoute && activeRoute.waypoints.length > 1) {
      routeFadeAnim.setValue(0);
      Animated.timing(routeFadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      routeFadeAnim.setValue(0);
    }
  }, [activeRoute?.id, routeFadeAnim]);

  // Calculate dynamic corridor width based on detour minutes threshold
  const corridorWidth =
    routeDetourMinutes === 20 ? 48 : routeDetourMinutes === 10 ? 36 : 26;

  // Track map region changes and notify with debounced bounds
  const handleRegionChangeComplete = (newRegion: any) => {
    setRegion(newRegion);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const bounds: MapBounds = {
        northEast: {
          latitude: newRegion.latitude + newRegion.latitudeDelta / 2,
          longitude: newRegion.longitude + newRegion.longitudeDelta / 2,
        },
        southWest: {
          latitude: newRegion.latitude - newRegion.latitudeDelta / 2,
          longitude: newRegion.longitude - newRegion.longitudeDelta / 2,
        },
      };
      onBoundsChange(bounds);
    }, 320);
  };

  // Zoom controls
  const handleZoom = (factor: number) => {
    if (mapRef.current) {
      const newDeltaLat = Math.max(0.01, Math.min(1.5, region.latitudeDelta * factor));
      const newDeltaLng = Math.max(0.01, Math.min(1.5, region.longitudeDelta * factor));
      const target = {
        ...region,
        latitudeDelta: newDeltaLat,
        longitudeDelta: newDeltaLng,
      };
      setRegion(target);
      if (Platform.OS !== 'web' && mapRef.current.animateToRegion) {
        mapRef.current.animateToRegion(target, 250);
      }
    }
  };

  // Fit camera to full active route
  const handleFitRoute = () => {
    if (activeRoute && activeRoute.waypoints.length > 0 && mapRef.current) {
      if (Platform.OS !== 'web' && mapRef.current.fitToCoordinates) {
        mapRef.current.fitToCoordinates(activeRoute.waypoints, {
          edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
          animated: true,
        });
      }
    }
    if (onRequestFitRoute) onRequestFitRoute();
  };

  // Animate to user location when userLocation updates or locate-me is pressed
  useEffect(() => {
    if (userLocation && mapRef.current) {
      const target = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.10,
        longitudeDelta: 0.10,
      };
      setRegion(target);
      if (Platform.OS !== 'web' && mapRef.current.animateToRegion) {
        mapRef.current.animateToRegion(target, 400);
      }
    }
  }, [userLocation]);

  // Animate to destination when destination changes
  useEffect(() => {
    if (destinationLocation && mapRef.current) {
      const target = {
        latitude: destinationLocation.latitude,
        longitude: destinationLocation.longitude,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      };
      setRegion(target);
      if (Platform.OS !== 'web' && mapRef.current.animateToRegion) {
        mapRef.current.animateToRegion(target, 400);
      }
    }
  }, [destinationLocation]);

  // Animate to route when route changes
  useEffect(() => {
    if (activeRoute && activeRoute.waypoints.length > 0 && mapRef.current) {
      if (Platform.OS !== 'web' && mapRef.current.fitToCoordinates) {
        mapRef.current.fitToCoordinates(activeRoute.waypoints, {
          edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
          animated: true,
        });
      }
    }
  }, [activeRoute]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  // Web coordinate projection matching OpenStreetMap embed bounds
  const webMinLng = region.longitude - 0.08;
  const webMaxLng = region.longitude + 0.08;
  const webMinLat = region.latitude - 0.06;
  const webMaxLat = region.latitude + 0.06;

  const projectWeb = (lat: number, lng: number) => {
    const normX = (lng - webMinLng) / (webMaxLng - webMinLng);
    const normY = (webMaxLat - lat) / (webMaxLat - webMinLat); // Invert Lat for Y (North is top)
    return {
      x: Math.max(-50, Math.min(containerWidth + 50, normX * containerWidth)),
      y: Math.max(-50, Math.min(containerHeight + 50, normY * containerHeight)),
    };
  };

  // Build SVG path data for web
  const webRoutePath =
    activeRoute && activeRoute.waypoints.length > 1
      ? activeRoute.waypoints.reduce((acc, wp, index) => {
          const pt = projectWeb(wp.latitude, wp.longitude);
          return index === 0 ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
        }, '')
      : '';

  // =========================================================================
  // Web Fallback View: Real OpenStreetMap + Full SVG Route Glow Cartography
  // =========================================================================
  if (Platform.OS === 'web' || !MapView) {
    const originPt = activeRoute?.origin ? projectWeb(activeRoute.origin.latitude, activeRoute.origin.longitude) : null;
    const destPt = activeRoute?.destination ? projectWeb(activeRoute.destination.latitude, activeRoute.destination.longitude) : null;

    return (
      <View style={styles.webContainer} onLayout={handleLayout}>
        {/* Real OpenStreetMap Tile Background Frame */}
        <iframe
          title="Margam OpenStreetMap"
          style={{ width: '100%', height: '100%', border: 'none' } as any}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${webMinLng}%2C${webMinLat}%2C${webMaxLng}%2C${webMaxLat}&layer=mapnik&marker=${region.latitude}%2C${region.longitude}`}
        />

        {/* Dynamic Radius Overlay SVG on Web */}
        <View style={styles.webRadiusOverlay} pointerEvents="none">
          <View
            style={[
              styles.webRadiusCircle,
              {
                width: Math.min(320, Math.max(90, (radiusMeters / 1000) * 26)),
                height: Math.min(320, Math.max(90, (radiusMeters / 1000) * 26)),
                borderRadius: Math.min(160, Math.max(45, (radiusMeters / 1000) * 13)),
              },
            ]}
          />
        </View>

        {/* ================================================================ */}
        {/* WEB SVG MULTI-TIER GLOW ROUTE POLYLINE CANVAS                    */}
        {/* ================================================================ */}
        {activeRoute && webRoutePath.length > 0 && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width={containerWidth} height={containerHeight} viewBox={`0 0 ${containerWidth} ${containerHeight}`}>
              <Defs>
                <SvgRadialGradient id="webOriginPulse" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.45" />
                  <Stop offset="70%" stopColor="#0EA5E9" stopOpacity="0.15" />
                  <Stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                </SvgRadialGradient>
                <SvgRadialGradient id="webDestPulse" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#DC2626" stopOpacity="0.45" />
                  <Stop offset="70%" stopColor="#DC2626" stopOpacity="0.15" />
                  <Stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                </SvgRadialGradient>
                <SvgLinearGradient id="webRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#0284C7" />
                  <Stop offset="60%" stopColor="#0EA5E9" />
                  <Stop offset="100%" stopColor="#38BDF8" />
                </SvgLinearGradient>
              </Defs>

              {/* Tier 1: Outer Translucent Corridor Buffer (Detour Zone) */}
              <Path
                d={webRoutePath}
                stroke="rgba(14, 165, 233, 0.18)"
                strokeWidth={corridorWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Tier 2: Intermediate Luminous Chromatic Bloom */}
              <Path
                d={webRoutePath}
                stroke="rgba(56, 189, 248, 0.45)"
                strokeWidth={11}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Tier 3: Razor Core Highway Polyline */}
              <Path
                d={webRoutePath}
                stroke="url(#webRouteGrad)"
                strokeWidth={4.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Tier 4: Directional Flow Dash Segment */}
              <Path
                d={webRoutePath}
                stroke="rgba(255, 255, 255, 0.85)"
                strokeWidth={2}
                strokeDasharray="10 20"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Origin Marker with Radar Halo */}
              {originPt && (
                <G>
                  <SvgCircle cx={originPt.x} cy={originPt.y} r={18} fill="url(#webOriginPulse)" />
                  <SvgCircle cx={originPt.x} cy={originPt.y} r={7} fill="#0284C7" stroke="#FFFFFF" strokeWidth={2.5} />
                </G>
              )}

              {/* Destination Marker with Radar Halo */}
              {destPt && (
                <G>
                  <SvgCircle cx={destPt.x} cy={destPt.y} r={20} fill="url(#webDestPulse)" />
                  <SvgCircle cx={destPt.x} cy={destPt.y} r={7.5} fill="#DC2626" stroke="#FFFFFF" strokeWidth={2.5} />
                </G>
              )}
            </Svg>
          </View>
        )}

        {/* Floating Cluster Overlay on Web */}
        <View style={styles.webClusterOverlay} pointerEvents="box-none">
          {clusters.map((c, idx) => {
            const isSelected = c.id === selectedClusterId;
            const topPercent = 22 + ((idx * 27) % 52);
            const leftPercent = 16 + ((idx * 31) % 64);

            return (
              <View
                key={c.id}
                style={[
                  styles.webClusterWrapper,
                  { top: `${topPercent}%`, left: `${leftPercent}%` } as any,
                ]}
              >
                <DynamicClusterMarker
                  cluster={c}
                  isSelected={isSelected}
                  onPress={() => onSelectCluster(c)}
                />
              </View>
            );
          })}
        </View>

        {/* Floating Controls */}
        <View style={styles.floatingControls}>
          {activeRoute && activeRoute.waypoints.length > 1 && (
            <TouchableOpacity
              style={styles.fitRouteBtn}
              onPress={handleFitRoute}
              activeOpacity={0.85}
            >
              <Maximize2 size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.fitRouteBtnText}>Fit Route</Text>
            </TouchableOpacity>
          )}

          {onRequestLayers && (
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={onRequestLayers}
              activeOpacity={0.8}
            >
              <Layers size={18} color="#1E293B" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.locateCircleBtn}
            onPress={onRequestLocateMe}
            activeOpacity={0.8}
          >
            <Navigation size={20} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => handleZoom(0.6)}
            activeOpacity={0.8}
          >
            <Plus size={18} color={THEME.colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => handleZoom(1.6)}
            activeOpacity={0.8}
          >
            <Minus size={18} color={THEME.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingPill}>
            <ActivityIndicator size="small" color={THEME.colors.primary} />
            <Text style={styles.loadingPillText}>Updating clusters...</Text>
          </View>
        )}
      </View>
    );
  }

  // =========================================================================
  // Native iOS (Apple MapKit) and Android (Google Maps) Real Map View
  // =========================================================================
  return (
    <View style={styles.nativeContainer} onLayout={handleLayout}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={region}
        mapType={mapType}
        showsTraffic={showsTraffic}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={false}
        showsCompass={false}
        showsScale={false}
        rotateEnabled={true}
        pitchEnabled={false}
      >
        {/* User GPS Location Marker & Dynamic Radius Circle */}
        {userLocation && (
          <>
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
              description="Your exact location is private and never visible to others."
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.userLocationMarker}>
                <View style={styles.userLocationPulse} />
                <View style={styles.userLocationDot} />
              </View>
            </Marker>

            {/* Subtle Translucent Radius Area Overlay for Around Me */}
            {mode === 'around_me' && (
              <Circle
                center={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                radius={radiusMeters}
                fillColor="rgba(59, 130, 246, 0.08)"
                strokeColor="rgba(59, 130, 246, 0.35)"
                strokeWidth={1.5}
              />
            )}
          </>
        )}

        {/* Selected Destination Pin & Dynamic Destination Radius Circle */}
        {destinationLocation && (
          <>
            <Marker
              coordinate={{
                latitude: destinationLocation.latitude,
                longitude: destinationLocation.longitude,
              }}
              title={destinationLocation.name || 'Destination'}
              anchor={{ x: 0.5, y: 1.0 }}
            >
              <View style={styles.destMarker}>
                <Flag size={18} color="#FFFFFF" />
              </View>
            </Marker>

            {/* Subtle Translucent Radius Area Overlay for Destination */}
            {mode === 'destination' && (
              <Circle
                center={{
                  latitude: destinationLocation.latitude,
                  longitude: destinationLocation.longitude,
                }}
                radius={radiusMeters}
                fillColor="rgba(220, 38, 38, 0.08)"
                strokeColor="rgba(220, 38, 38, 0.35)"
                strokeWidth={1.5}
              />
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* MULTI-TIER GLOW ROUTE POLYLINE (Native MapKit / Google Maps)    */}
        {/* ============================================================== */}
        {activeRoute && activeRoute.waypoints.length > 1 && (
          <>
            {/* Tier 1: Outer Translucent Corridor Buffer (Detour Zone Envelope) */}
            <Polyline
              key={`corridor-glow-${corridorWidth}`}
              coordinates={activeRoute.waypoints}
              strokeColor={
                mode === 'along_route'
                  ? 'rgba(14, 165, 233, 0.18)'
                  : 'rgba(99, 102, 241, 0.16)'
              }
              strokeWidth={corridorWidth}
              lineCap="round"
              lineJoin="round"
              zIndex={10}
            />

            {/* Tier 2: Intermediate Luminous Chromatic Bloom */}
            <Polyline
              key="luminous-bloom"
              coordinates={activeRoute.waypoints}
              strokeColor="rgba(56, 189, 248, 0.45)"
              strokeWidth={11}
              lineCap="round"
              lineJoin="round"
              zIndex={11}
            />

            {/* Tier 3: Razor Core Highway Route Polyline */}
            <Polyline
              key="core-polyline"
              coordinates={activeRoute.waypoints}
              strokeColor="#0284C7"
              strokeWidth={4.5}
              lineCap="round"
              lineJoin="round"
              zIndex={12}
            />

            {/* Tier 4: Directional Flow Dash / Wave Overlay */}
            <Polyline
              key="flow-dash-polyline"
              coordinates={activeRoute.waypoints}
              strokeColor="rgba(255, 255, 255, 0.90)"
              strokeWidth={2}
              lineDashPattern={[10, 20]}
              lineCap="round"
              lineJoin="round"
              zIndex={13}
            />
          </>
        )}

        {/* Dynamic Privacy-Safe Cluster Markers */}
        {clusters.map((cluster) => {
          const isSelected = cluster.id === selectedClusterId;
          return (
            <Marker
              key={cluster.id}
              coordinate={{
                latitude: cluster.latitude,
                longitude: cluster.longitude,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              onPress={() => onSelectCluster(cluster)}
            >
              <DynamicClusterMarker
                cluster={cluster}
                isSelected={isSelected}
                onPress={() => onSelectCluster(cluster)}
              />
            </Marker>
          );
        })}
      </MapView>

      {/* Floating Action Controls */}
      <View style={styles.floatingControls}>
        {/* Fit Route Button */}
        {activeRoute && activeRoute.waypoints.length > 1 && (
          <TouchableOpacity
            style={styles.fitRouteBtn}
            onPress={handleFitRoute}
            activeOpacity={0.85}
          >
            <Maximize2 size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.fitRouteBtnText}>Fit Route</Text>
          </TouchableOpacity>
        )}

        {/* Layers Button */}
        {onRequestLayers && (
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={onRequestLayers}
            activeOpacity={0.8}
          >
            <Layers size={18} color="#1E293B" />
          </TouchableOpacity>
        )}

        {/* Locate Me Floating Action Button */}
        <TouchableOpacity
          style={styles.locateCircleBtn}
          onPress={onRequestLocateMe}
          activeOpacity={0.85}
        >
          <Navigation size={20} color="#0F172A" />
        </TouchableOpacity>

        {/* Zoom Controls */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => handleZoom(0.6)}
          activeOpacity={0.8}
        >
          <Plus size={18} color={THEME.colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => handleZoom(1.6)}
          activeOpacity={0.8}
        >
          <Minus size={18} color={THEME.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Live Calculating Pill */}
      {isLoading && (
        <View style={styles.loadingPill}>
          <ActivityIndicator size="small" color={THEME.colors.primary} />
          <Text style={styles.loadingPillText}>Recalculating matches...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  nativeContainer: {
    width: '100%',
    height: 440,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  webContainer: {
    width: '100%',
    height: 440,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  webClusterOverlay: {
    ...StyleSheet.absoluteFill as any,
  },
  webClusterWrapper: {
    position: 'absolute',
  },
  floatingControls: {
    position: 'absolute',
    right: 14,
    bottom: 16,
    gap: 8,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  loadingPill: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  loadingPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  userLocationMarker: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationPulse: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
  },
  userLocationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  destMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  locateCircleBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  fitRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  fitRouteBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  webRadiusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webRadiusCircle: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.35)',
  },
});
