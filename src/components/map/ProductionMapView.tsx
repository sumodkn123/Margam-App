import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  Navigation,
  Plus,
  Minus,
  Maximize2,
  MapPin,
  Flag,
  Layers,
  Crosshair,
} from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { MapCluster, MapBounds, DiscoveryMode } from '../../types';
import { CalculatedRoute } from '../../services/routingService';
import { DeviceLocation } from '../../services/locationService';
import { DynamicClusterMarker } from './DynamicClusterMarker';

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

  const [region, setRegion] = useState({
    latitude: userLocation?.latitude ?? initialLatitude,
    longitude: userLocation?.longitude ?? initialLongitude,
    latitudeDelta: 0.18,
    longitudeDelta: 0.18,
  });

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

  // Web fallback view: Interactive Leaflet/OpenStreetMap canvas
  if (Platform.OS === 'web' || !MapView) {
    return (
      <View style={styles.webContainer}>
        {/* Real OpenStreetMap Tile Background Frame */}
        <iframe
          title="Margam OpenStreetMap"
          style={{ width: '100%', height: '100%', border: 'none' } as any}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${region.longitude - 0.08}%2C${region.latitude - 0.06}%2C${region.longitude + 0.08}%2C${region.latitude + 0.06}&layer=mapnik&marker=${region.latitude}%2C${region.longitude}`}
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

  // Native iOS (Apple MapKit) and Android (Google Maps) Real Map View
  return (
    <View style={styles.nativeContainer}>
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

        {/* Real OSRM Road Route Polyline */}
        {activeRoute && activeRoute.waypoints.length > 1 && (
          <Polyline
            coordinates={activeRoute.waypoints}
            strokeColor="#4F46E5"
            strokeWidth={4.5}
            lineDashPattern={[0]}
          />
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
        {/* Fit Route Button (Item 32) */}
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

        {/* Layers Button (Item 29) */}
        {onRequestLayers && (
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={onRequestLayers}
            activeOpacity={0.8}
          >
            <Layers size={18} color="#1E293B" />
          </TouchableOpacity>
        )}

        {/* Locate Me Floating Action Button (matching design image media_1790678412884.png) */}
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
