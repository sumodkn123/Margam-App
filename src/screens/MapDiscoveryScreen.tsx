import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MargamLogoNew } from '../components/brand/MargamLogoNew';
import { ProductionMapView } from '../components/map/ProductionMapView';
import { PlaceSearchBar } from '../components/search/PlaceSearchBar';
import { LocationPermissionModal } from '../components/location/LocationPermissionModal';
import { DiscoveryFilterModal, DEFAULT_FILTERS } from '../components/filters/DiscoveryFilterModal';
import { TripPlannerModal } from '../components/trip/TripPlannerModal';
import { AnonymousMatchCard } from '../components/cards/AnonymousMatchCard';
import { CURRENT_USER } from '../constants/mockData';
import { THEME } from '../constants/theme';
import {
  Bell,
  SlidersHorizontal,
  Navigation,
  Car,
  MapPin,
  Calendar,
  Flame,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Crosshair,
  Shield,
  Coffee,
  CheckCircle2,
  Clock,
  Sparkles,
  Pencil,
  Users,
  Compass,
  Layers,
  RotateCcw,
  Check,
  X,
  Maximize2,
} from 'lucide-react-native';
import {
  MapCluster,
  MapBounds,
  DiscoveryFilterParams,
  DiscoveryQueryResult,
  DiscoveryMode,
  PlaceSearchResult,
  AnonymousCandidate,
  RouteCorridor,
  TripPlan,
  PublicVenue,
} from '../types';
import {
  checkLocationPermission,
  requestLocationPermission,
  getCurrentDeviceLocation,
  DeviceLocation,
} from '../services/locationService';
import {
  queryDiscoveryEngine,
  getNearbyMatchClusters,
  getRouteMatchClusters,
  getDestinationMatchClusters,
  getTripPlanMatchClusters,
  DEFAULT_CURRENT_USER,
  SAFE_PUBLIC_VENUES,
  resolveCityCoordinates,
} from '../services/discoveryEngine';
import { calculateDrivingRoute, CalculatedRoute } from '../services/routingService';

interface MapDiscoveryScreenProps {
  initialMode?: DiscoveryMode;
  initialDestinationName?: string;
  initialTripPlan?: TripPlan | null;
  onBack?: () => void;
  onStartRequest: (candidate: AnonymousCandidate, route?: RouteCorridor) => void;
  onOpenPrivacy: () => void;
  onOpenProfile: () => void;
  onOpenCandidateProfile?: (candidate: AnonymousCandidate) => void;
}

export const MapDiscoveryScreen: React.FC<MapDiscoveryScreenProps> = ({
  initialMode = 'around_me',
  initialDestinationName,
  initialTripPlan,
  onBack,
  onStartRequest,
  onOpenPrivacy,
  onOpenProfile,
  onOpenCandidateProfile,
}) => {
  // 1. Discovery Mode & Filter State
  const [mode, setMode] = useState<DiscoveryMode>(initialMode);
  const [filters, setFilters] = useState<DiscoveryFilterParams>(DEFAULT_FILTERS);

  // 2. Spatial & Route State
  const [userLocation, setUserLocation] = useState<DeviceLocation | null>(null);
  const [destination, setDestination] = useState<PlaceSearchResult | null>(() => {
    if (initialDestinationName) {
      const coords = resolveCityCoordinates(initialDestinationName);
      return {
        id: `dest-${initialDestinationName.toLowerCase()}`,
        name: initialDestinationName,
        subtext: 'Kerala, India',
        latitude: coords.lat,
        longitude: coords.lng,
      };
    }
    return null;
  });
  const [activeRoute, setActiveRoute] = useState<CalculatedRoute | null>(null);
  const [currentBounds, setCurrentBounds] = useState<MapBounds | null>(null);

  // Mode Specific Options
  const [aroundMeRadiusKm, setAroundMeRadiusKm] = useState<number>(5);
  const [destinationRadiusKm, setDestinationRadiusKm] = useState<number>(5);
  const [routeCorridorKm, setRouteCorridorKm] = useState<number>(3);
  const [routeDetourThreshold, setRouteDetourThreshold] = useState<number>(10); // mins

  // Map Display & Layer State
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [showsTraffic, setShowsTraffic] = useState<boolean>(false);
  const [layersModalVisible, setLayersModalVisible] = useState<boolean>(false);
  const [notificationsModalVisible, setNotificationsModalVisible] = useState<boolean>(false);
  const [viewAllModalVisible, setViewAllModalVisible] = useState<boolean>(false);

  // 3. Trip Planner State
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(() => {
    if (initialTripPlan) return initialTripPlan;
    if (initialMode === 'plan_trip') {
      return {
        id: 'trip-current',
        userId: 'usr-current-sumod',
        origin: 'Thrissur',
        destination: initialDestinationName || 'Kochi',
        departureDate: '24 Dec',
        returnDate: '26 Dec',
        transportMode: 'car',
        visibility: 'active',
        createdAt: new Date().toISOString(),
      };
    }
    return null;
  });
  const [tripPlannerVisible, setTripPlannerVisible] = useState(false);

  // 4. Modals & Sheet State
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<MapCluster | null>(null);
  const [activeCandidateModal, setActiveCandidateModal] = useState<AnonymousCandidate | null>(null);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [isPermanentlyDenied, setIsPermanentlyDenied] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Update mode if initialMode prop changes
  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  // Handle initial destination or trip plan
  useEffect(() => {
    if (initialDestinationName && !destination) {
      const coords = resolveCityCoordinates(initialDestinationName);
      setDestination({
        id: `dest-${initialDestinationName.toLowerCase()}`,
        name: initialDestinationName,
        subtext: 'Kerala, India',
        latitude: coords.lat,
        longitude: coords.lng,
      });
    }
    if (initialTripPlan) {
      setTripPlan(initialTripPlan);
    }
  }, [initialDestinationName, initialTripPlan]);

  // 5. Native Location Permission Initialization
  useEffect(() => {
    async function initLocation() {
      const state = await checkLocationPermission();
      if (state === 'granted') {
        const loc = await getCurrentDeviceLocation();
        if (loc) {
          setUserLocation(loc);
        }
      } else if (state === 'undetermined') {
        setPermissionModalVisible(true);
      } else if (state === 'denied') {
        setIsPermanentlyDenied(true);
      }
    }
    initLocation();
  }, []);

  // 6. Route Auto-Calculation when userLocation or destination changes
  useEffect(() => {
    async function updateRoute() {
      if ((mode === 'along_route' || mode === 'plan_trip') && destination) {
        const originCoords = userLocation
          ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
          : { latitude: 10.5276, longitude: 76.2144 }; // Thrissur reference origin

        const route = await calculateDrivingRoute(originCoords, {
          latitude: destination.latitude,
          longitude: destination.longitude,
        });
        setActiveRoute(route);
      }
    }
    updateRoute();
  }, [mode, destination, userLocation]);

  // 7. Query Discovery Engine (Strict Zero Hardcoded Numbers Invariant)
  const queryResult: DiscoveryQueryResult = useMemo(() => {
    const queryFilters: DiscoveryFilterParams = {
      ...filters,
      maxDistanceKm:
        mode === 'destination'
          ? destinationRadiusKm
          : mode === 'around_me'
          ? aroundMeRadiusKm
          : filters.maxDistanceKm,
      maxDetourMinutes: mode === 'along_route' ? routeDetourThreshold : undefined,
    };

    if (mode === 'around_me') {
      return getNearbyMatchClusters({
        currentLatitude: userLocation?.latitude,
        currentLongitude: userLocation?.longitude,
        radius: aroundMeRadiusKm,
        preferences: queryFilters,
        minimumCompatibility: filters.minCompatibility,
      });
    }

    if (mode === 'along_route') {
      return getRouteMatchClusters({
        origin: userLocation ? { latitude: userLocation.latitude, longitude: userLocation.longitude } : undefined,
        destination: destination ? { latitude: destination.latitude, longitude: destination.longitude, name: destination.name } : undefined,
        routeGeometry: activeRoute,
        routeCorridor: routeCorridorKm,
        preferences: queryFilters,
      });
    }

    if (mode === 'destination') {
      const destCoords = destination
        ? { lat: destination.latitude, lng: destination.longitude }
        : resolveCityCoordinates(tripPlan?.destination || 'Kochi');

      return getDestinationMatchClusters({
        destinationLatitude: destCoords.lat,
        destinationLongitude: destCoords.lng,
        destinationName: destination?.name || tripPlan?.destination || 'Kochi',
        radius: destinationRadiusKm,
        preferences: queryFilters,
        compatibilityThreshold: filters.minCompatibility,
      });
    }

    if (mode === 'plan_trip') {
      const planToUse: TripPlan = tripPlan || {
        id: 'trip-active-fallback',
        userId: 'usr-current-sumod',
        origin: 'Thrissur',
        destination: destination?.name || 'Kochi',
        departureDate: '24 Dec',
        returnDate: '26 Dec',
        transportMode: 'car',
        visibility: 'active',
        createdAt: new Date().toISOString(),
      };

      return getTripPlanMatchClusters({
        tripPlan: planToUse,
        preferences: queryFilters,
      });
    }

    return queryDiscoveryEngine({
      currentUser: DEFAULT_CURRENT_USER,
      mode,
      userLocation,
      destinationLocation: destination
        ? { latitude: destination.latitude, longitude: destination.longitude, name: destination.name }
        : null,
      activeRoute,
      bounds: currentBounds,
      filters: queryFilters,
      tripPlan,
    });
  }, [
    mode,
    userLocation,
    destination,
    activeRoute,
    currentBounds,
    filters,
    tripPlan,
    aroundMeRadiusKm,
    destinationRadiusKm,
    routeCorridorKm,
    routeDetourThreshold,
  ]);

  // Request native OS location permission
  const handleAllowLocation = async () => {
    setPermissionModalVisible(false);
    const state = await requestLocationPermission();
    if (state === 'granted') {
      const loc = await getCurrentDeviceLocation();
      if (loc) {
        setUserLocation(loc);
      }
    } else {
      setIsPermanentlyDenied(true);
      setPermissionModalVisible(true);
    }
  };

  // Recenter on user's live device coordinates
  const handleLocateMe = async () => {
    const state = await checkLocationPermission();
    if (state !== 'granted') {
      setPermissionModalVisible(true);
      return;
    }
    const loc = await getCurrentDeviceLocation();
    if (loc) {
      setUserLocation(loc);
    }
  };

  // Handle selecting a destination place from real geocoding search
  const handleSelectPlace = async (place: PlaceSearchResult) => {
    setDestination(place);
    if (mode === 'around_me') {
      setMode('destination');
    }

    const originCoords = userLocation
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
      : { latitude: 10.5276, longitude: 76.2144 };

    const route = await calculateDrivingRoute(originCoords, {
      latitude: place.latitude,
      longitude: place.longitude,
    });
    setActiveRoute(route);
  };

  const handleClearDestination = () => {
    setDestination(null);
    setActiveRoute(null);
    if (mode === 'destination') {
      setMode('around_me');
    }
  };

  // State-Preserving Mode Switcher
  const handleSwitchMode = (newMode: DiscoveryMode) => {
    setMode(newMode);
    setSelectedCluster(null);

    // Context preservation logic:
    // If destination is set and user switches to plan_trip, initialize tripPlan with destination
    if (newMode === 'plan_trip' && !tripPlan) {
      setTripPlan({
        id: `trip_${Date.now()}`,
        userId: 'usr-current-sumod',
        origin: 'Thrissur',
        destination: destination?.name || 'Kochi',
        departureDate: '24 Dec',
        returnDate: '26 Dec',
        transportMode: 'car',
        visibility: 'active',
        createdAt: new Date().toISOString(),
      });
    }
  };

  // Handle cluster pin click on map
  const handleSelectCluster = (cluster: MapCluster) => {
    setSelectedCluster(cluster);
  };

  // Handle exploring candidates from a cluster modal
  const handleExploreClusterCandidates = (cluster: MapCluster) => {
    const candidate = queryResult.candidates.find((c) => cluster.candidateIds.includes(c.id));
    setSelectedCluster(null);
    if (candidate) {
      setActiveCandidateModal({
        ...candidate,
        clusterCount: cluster.count,
      });
    }
  };

  // Dynamic Header Titles
  const getHeaderTitle = () => {
    switch (mode) {
      case 'around_me':
        return 'Matches Around You';
      case 'along_route':
        return 'Matches Along Route';
      case 'destination':
        return destination ? `Matches at ${destination.name}` : 'Matches at Destination';
      case 'plan_trip':
        return tripPlan ? `Trip to ${tripPlan.destination}` : 'Your Travel Plan';
    }
  };

  const getHeaderSubtitle = () => {
    if (queryResult.totalMatches === 0) {
      switch (mode) {
        case 'around_me':
          return 'No compatible profiles found nearby';
        case 'along_route':
          return 'No compatible profiles found along this route';
        case 'destination':
          return 'No compatible profiles found around this destination';
        case 'plan_trip':
          return 'No potential matches found for these trip dates';
      }
    }
    if (mode === 'plan_trip') {
      return `${queryResult.totalMatches} potential profiles discoverable around trip dates`;
    }
    if (mode === 'along_route' && activeRoute) {
      return `${queryResult.totalMatches} profiles • ${activeRoute.distanceLabel} (${activeRoute.durationLabel})`;
    }
    return `${queryResult.totalMatches} compatible profiles found`;
  };

  // Safe Public Meeting Recommendations
  const publicVenues = useMemo(() => {
    return SAFE_PUBLIC_VENUES.slice(0, 3);
  }, []);

  return (
    <View style={styles.container}>
      {/* 1. Header Bar: Margam Brand, Notifications Bell, Filters & Profile */}
      <View style={styles.header}>
        <View style={styles.headerLeftCol}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.75}>
              <ArrowLeft size={22} color="#1E293B" />
            </TouchableOpacity>
          )}
          <MargamLogoNew size={38} />
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerModeTitle}>Margam</Text>
            <Text style={styles.headerModeSubtitle} numberOfLines={1}>
              Your Match. Your Margam.
            </Text>
          </View>
        </View>

        <View style={styles.headerActionsRow}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setNotificationsModalVisible(true)}
            activeOpacity={0.8}
          >
            <Bell size={19} color="#1E293B" />
            <View style={styles.unreadBadgeDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={19} color="#1E293B" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onOpenProfile} activeOpacity={0.85}>
            <Image
              source={{ uri: CURRENT_USER.profilePhotoUrl }}
              style={styles.avatarImg}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 2. Real Places Search & GPS Locate Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <PlaceSearchBar
              placeholder="Search destination or area"
              userLocation={
                userLocation
                  ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
                  : undefined
              }
              selectedPlaceName={destination?.name}
              onSelectPlace={handleSelectPlace}
              onClear={handleClearDestination}
            />
          </View>

          <TouchableOpacity
            style={styles.locateBtn}
            activeOpacity={0.8}
            onPress={handleLocateMe}
          >
            <Crosshair size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* 3. Top Mode Switcher Bar (State Preserving) */}
        <View style={styles.modeSwitcherContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modeSwitcherRow}
          >
            {/* Mode 1: Around Me */}
            <TouchableOpacity
              style={[styles.modeTab, mode === 'around_me' && styles.modeTabActive]}
              onPress={() => handleSwitchMode('around_me')}
              activeOpacity={0.85}
            >
              <Navigation
                size={14}
                color={mode === 'around_me' ? '#3B82F6' : '#64748B'}
              />
              <Text
                style={[
                  styles.modeTabText,
                  mode === 'around_me' && styles.modeTabTextActive,
                ]}
              >
                Around Me
              </Text>
            </TouchableOpacity>

            {/* Mode 2: Along Route */}
            <TouchableOpacity
              style={[styles.modeTab, mode === 'along_route' && styles.modeTabActive]}
              onPress={() => handleSwitchMode('along_route')}
              activeOpacity={0.85}
            >
              <Car
                size={14}
                color={mode === 'along_route' ? '#3B82F6' : '#64748B'}
              />
              <Text
                style={[
                  styles.modeTabText,
                  mode === 'along_route' && styles.modeTabTextActive,
                ]}
              >
                Along Route
              </Text>
            </TouchableOpacity>

            {/* Mode 3: At Destination */}
            <TouchableOpacity
              style={[styles.modeTab, mode === 'destination' && styles.modeTabActive]}
              onPress={() => handleSwitchMode('destination')}
              activeOpacity={0.85}
            >
              <MapPin
                size={14}
                color={mode === 'destination' ? '#3B82F6' : '#64748B'}
              />
              <Text
                style={[
                  styles.modeTabText,
                  mode === 'destination' && styles.modeTabTextActive,
                ]}
              >
                At Destination
              </Text>
            </TouchableOpacity>

            {/* Mode 4: Plan a Trip */}
            <TouchableOpacity
              style={[styles.modeTab, mode === 'plan_trip' && styles.modeTabActive]}
              onPress={() => handleSwitchMode('plan_trip')}
              activeOpacity={0.85}
            >
              <Calendar
                size={14}
                color={mode === 'plan_trip' ? '#3B82F6' : '#64748B'}
              />
              <Text
                style={[
                  styles.modeTabText,
                  mode === 'plan_trip' && styles.modeTabTextActive,
                ]}
              >
                Plan a Trip
              </Text>
            </TouchableOpacity>

            {/* Map Layers Modal Trigger Button */}
            <TouchableOpacity
              style={styles.layersBtn}
              onPress={() => setLayersModalVisible(true)}
              activeOpacity={0.85}
            >
              <Layers size={16} color="#475569" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 4. Distance Radius Selector Chips (Mode: Around Me) */}
        {mode === 'around_me' && (
          <View style={styles.subControlsBar}>
            <Text style={styles.subControlLabel}>Radius:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.radiusPillsRow}
            >
              {[1, 3, 5, 10, 25, 50, 100].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.radiusPill,
                    aroundMeRadiusKm === r && styles.radiusPillActive,
                  ]}
                  onPress={() => setAroundMeRadiusKm(r)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.radiusPillText,
                      aroundMeRadiusKm === r && styles.radiusPillTextActive,
                    ]}
                  >
                    {r} km
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 4. Mode-Specific Sub-Controls Bar */}
        {mode === 'destination' && (
          <View style={styles.subControlsBar}>
            <Text style={styles.subControlLabel}>Search Radius:</Text>
            <View style={styles.radiusPillsRow}>
              {[1, 3, 5, 10, 25].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.radiusPill,
                    destinationRadiusKm === r && styles.radiusPillActive,
                  ]}
                  onPress={() => setDestinationRadiusKm(r)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.radiusPillText,
                      destinationRadiusKm === r && styles.radiusPillTextActive,
                    ]}
                  >
                    {r} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {mode === 'along_route' && activeRoute && (
          <View style={styles.routeSummaryBanner}>
            <View style={styles.routeSummaryLeft}>
              <View style={styles.highwayBadge}>
                <Text style={styles.highwayBadgeText}>NH 544</Text>
              </View>
              <View>
                <Text style={styles.routeEndpointsText}>
                  {userLocation ? 'Current Location' : 'Thrissur'} → {destination?.name || 'Kochi'}
                </Text>
                <Text style={styles.routeMetaText}>
                  {activeRoute.distanceLabel} • {activeRoute.durationLabel}
                </Text>
              </View>
            </View>

            <View style={styles.corridorFilterPills}>
              {[5, 10, 20].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.detourPill,
                    routeDetourThreshold === mins && styles.detourPillActive,
                  ]}
                  onPress={() => setRouteDetourThreshold(mins)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.detourPillText,
                      routeDetourThreshold === mins && styles.detourPillTextActive,
                    ]}
                  >
                    ≤{mins}m detour
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {mode === 'plan_trip' && tripPlan && (
          <View style={styles.tripSummaryHeaderCard}>
            <View style={styles.tripHeaderTopRow}>
              <View style={styles.tripLocationRow}>
                <Navigation size={13} color="#3B82F6" style={{ marginRight: 4 }} />
                <Text style={styles.tripEndpointText}>{tripPlan.origin}</Text>
                <ArrowRight size={12} color="#94A3B8" style={{ marginHorizontal: 6 }} />
                <MapPin size={13} color="#DC2626" style={{ marginRight: 4 }} />
                <Text style={styles.tripEndpointText}>{tripPlan.destination}</Text>
              </View>

              <TouchableOpacity
                style={styles.editTripBtn}
                onPress={() => setTripPlannerVisible(true)}
                activeOpacity={0.8}
              >
                <Pencil size={12} color="#3B82F6" style={{ marginRight: 4 }} />
                <Text style={styles.editTripBtnText}>Edit Trip</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tripDatesMetaRow}>
              <View style={styles.tripDateBadge}>
                <Calendar size={12} color="#10B981" style={{ marginRight: 4 }} />
                <Text style={styles.tripDateBadgeText}>
                  {tripPlan.departureDate} – {tripPlan.returnDate}
                </Text>
              </View>

              <View style={styles.tripTransportBadge}>
                <Text style={styles.tripTransportBadgeText}>
                  {tripPlan.transportMode === 'car' ? '🚗 By Car' : tripPlan.transportMode === 'train' ? '🚆 By Train' : tripPlan.transportMode === 'flight' ? '✈️ By Flight' : '🚌 By Bus'}
                </Text>
              </View>

              <View style={styles.tripStatusBadge}>
                <Text style={styles.tripStatusBadgeText}>Active Planner</Text>
              </View>
            </View>
          </View>
        )}

        {/* 5. Real Interactive Map Canvas */}
        <View style={styles.mapContainer}>
          <ProductionMapView
            initialLatitude={
              mode === 'destination' && destination
                ? destination.latitude
                : userLocation?.latitude ?? 10.0159
            }
            initialLongitude={
              mode === 'destination' && destination
                ? destination.longitude
                : userLocation?.longitude ?? 76.3419
            }
            userLocation={userLocation}
            destinationLocation={
              destination
                ? {
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                    name: destination.name,
                  }
                : null
            }
            activeRoute={activeRoute}
            clusters={queryResult.clusters}
            selectedClusterId={selectedCluster?.id || null}
            isLoading={isLoading}
            radiusMeters={mode === 'destination' ? destinationRadiusKm * 1000 : aroundMeRadiusKm * 1000}
            mode={mode}
            mapType={mapType}
            showsTraffic={showsTraffic}
            onSelectCluster={handleSelectCluster}
            onBoundsChange={(bounds) => setCurrentBounds(bounds)}
            onRequestLocateMe={handleLocateMe}
            onRequestLayers={() => setLayersModalVisible(true)}
          />
        </View>

        {/* 6. Mode-Specific Bottom Sheet Drawer */}
        <View style={styles.bottomDrawer}>
          <View style={styles.drawerHandle} />

          {/* Drawer Mode Header */}
          <View style={styles.drawerHeader}>
            <View>
              <Text style={styles.drawerTitle}>
                {mode === 'around_me'
                  ? 'Nearby Matches'
                  : mode === 'along_route'
                  ? 'Matches Along Your Route'
                  : mode === 'destination'
                  ? `Matches Around ${destination?.name || 'Destination'}`
                  : `Trip to ${tripPlan?.destination || 'Destination'}`}
              </Text>
              <Text style={styles.drawerSubtitle}>
                {mode === 'plan_trip'
                  ? `${queryResult.totalMatches} potential matches discoverable around your dates`
                  : queryResult.totalMatches === 0
                  ? 'No compatible profiles found in this area'
                  : `${queryResult.totalMatches} privacy-protected matches found`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setViewAllModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllLink}>
                {queryResult.totalMatches > 0 ? `View All (${queryResult.totalMatches}) >` : 'View All >'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Empty State Handler */}
          {queryResult.totalMatches === 0 ? (
            <View style={styles.emptyAreaBox}>
              <Shield size={26} color="#94A3B8" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyAreaTitle}>
                {mode === 'around_me'
                  ? 'No compatible profiles found nearby'
                  : mode === 'along_route'
                  ? 'No compatible profiles found along this route'
                  : mode === 'destination'
                  ? 'No compatible profiles found around this destination'
                  : 'No potential matches found for these trip dates'}
              </Text>
              <Text style={styles.emptyAreaSub}>
                Try lowering the compatibility threshold, expanding the search radius, or selecting another destination.
              </Text>
              <View style={styles.emptyActionsRow}>
                <TouchableOpacity
                  style={styles.adjustFilterBtn}
                  onPress={() => setFilterModalVisible(true)}
                >
                  <Text style={styles.adjustFilterBtnText}>Adjust Filters</Text>
                </TouchableOpacity>

                {mode === 'destination' && (
                  <TouchableOpacity
                    style={styles.expandRadiusBtn}
                    onPress={() => setDestinationRadiusKm(25)}
                  >
                    <Text style={styles.expandRadiusBtnText}>Expand to 25 km</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <>
              {/* MODE 1: AROUND ME 4 DISCOVERY CARDS (Matches media_1790678412884.png) */}
              {mode === 'around_me' && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.matchCardsCarousel}
                >
                  {/* Card 1: Within 5 km */}
                  <TouchableOpacity
                    style={[styles.matchCard, styles.matchCardPink]}
                    onPress={() => {
                      setAroundMeRadiusKm(5);
                      const cand = queryResult.candidates.find((c) => c.distanceLabel.includes('Within 5'));
                      if (cand) setActiveCandidateModal(cand);
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.ringCircle, { backgroundColor: '#F43F5E' }]}>
                      <Text style={styles.ringEmoji}>💍</Text>
                    </View>
                    <Text style={styles.matchCountTitle}>
                      {queryResult.availabilitySummary?.within5km ?? queryResult.within5km}{' '}
                      {(queryResult.availabilitySummary?.within5km ?? queryResult.within5km) === 1 ? 'match' : 'matches'}
                    </Text>
                    <Text style={styles.matchAreaSubtitle}>Within 5 km</Text>
                    <View style={styles.matchCardFooter}>
                      <Flame size={12} color="#F43F5E" />
                      <Text style={[styles.flameText, { color: '#F43F5E' }]}>
                        {filters.minCompatibility}%+
                      </Text>
                      <ChevronRight size={14} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>

                  {/* Card 2: 5 - 10 km */}
                  <TouchableOpacity
                    style={[styles.matchCard, styles.matchCardBlue]}
                    onPress={() => {
                      setAroundMeRadiusKm(10);
                      const cand = queryResult.candidates.find((c) => !c.distanceLabel.includes('Within 5'));
                      if (cand) setActiveCandidateModal(cand);
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.ringCircle, { backgroundColor: '#3B82F6' }]}>
                      <Text style={styles.ringEmoji}>💍</Text>
                    </View>
                    <Text style={styles.matchCountTitle}>
                      {queryResult.availabilitySummary?.fiveToTenKm ?? queryResult.fiveToTenKm}{' '}
                      {(queryResult.availabilitySummary?.fiveToTenKm ?? queryResult.fiveToTenKm) === 1 ? 'match' : 'matches'}
                    </Text>
                    <Text style={styles.matchAreaSubtitle}>5 – 10 km</Text>
                    <View style={styles.matchCardFooter}>
                      <Flame size={12} color="#3B82F6" />
                      <Text style={[styles.flameText, { color: '#3B82F6' }]}>
                        {filters.minCompatibility}%+
                      </Text>
                      <ChevronRight size={14} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>

                  {/* Card 3: Along your route */}
                  <TouchableOpacity
                    style={[styles.matchCard, styles.matchCardGreen]}
                    onPress={() => handleSwitchMode('along_route')}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.ringCircle, { backgroundColor: '#10B981' }]}>
                      <Text style={styles.ringEmoji}>💍</Text>
                    </View>
                    <Text style={styles.matchCountTitle}>
                      {queryResult.availabilitySummary?.alongRoute ?? queryResult.alongRoute}{' '}
                      {(queryResult.availabilitySummary?.alongRoute ?? queryResult.alongRoute) === 1 ? 'match' : 'matches'}
                    </Text>
                    <Text style={styles.matchAreaSubtitle}>Along your route</Text>
                    <View style={styles.matchCardFooter}>
                      <Flame size={12} color="#10B981" />
                      <Text style={[styles.flameText, { color: '#10B981' }]}>
                        {filters.minCompatibility}%+
                      </Text>
                      <ChevronRight size={14} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>

                  {/* Card 4: At destination */}
                  <TouchableOpacity
                    style={[styles.matchCard, styles.matchCardAmber]}
                    onPress={() => handleSwitchMode('destination')}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.ringCircle, { backgroundColor: '#F59E0B' }]}>
                      <Text style={styles.ringEmoji}>💍</Text>
                    </View>
                    <Text style={styles.matchCountTitle}>
                      {queryResult.availabilitySummary?.nearDestination ?? (queryResult.availabilitySummary?.tenToTwentyFiveKm ?? 0)}{' '}
                      {(queryResult.availabilitySummary?.nearDestination ?? (queryResult.availabilitySummary?.tenToTwentyFiveKm ?? 0)) === 1 ? 'match' : 'matches'}
                    </Text>
                    <Text style={styles.matchAreaSubtitle}>At destination</Text>
                    <View style={styles.matchCardFooter}>
                      <Flame size={12} color="#F59E0B" />
                      <Text style={[styles.flameText, { color: '#F59E0B' }]}>
                        {filters.minCompatibility}%+
                      </Text>
                      <ChevronRight size={14} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              )}

              {/* MODE 2: ALONG ROUTE BREAKDOWN & SMART DETOUR */}
              {mode === 'along_route' && (
                <View style={styles.routeBreakdownContainer}>
                  {/* Metric Chips Row */}
                  <View style={styles.routeMetricRow}>
                    <View style={styles.routeMetricChip}>
                      <Text style={styles.routeMetricVal}>{queryResult.availabilitySummary?.strongMatches ?? 0}</Text>
                      <Text style={styles.routeMetricLabel}>Strong Matches</Text>
                    </View>
                    <View style={styles.routeMetricChip}>
                      <Text style={styles.routeMetricVal}>{queryResult.availabilitySummary?.alongRoute ?? queryResult.alongRoute}</Text>
                      <Text style={styles.routeMetricLabel}>Near Route</Text>
                    </View>
                    <View style={styles.routeMetricChip}>
                      <Text style={styles.routeMetricVal}>{queryResult.availabilitySummary?.nearDestination ?? 0}</Text>
                      <Text style={styles.routeMetricLabel}>Near Destination</Text>
                    </View>
                    <View style={styles.routeMetricChip}>
                      <Text style={styles.routeMetricVal}>{queryResult.availabilitySummary?.potentialMeetingAreas ?? 0}</Text>
                      <Text style={styles.routeMetricLabel}>Meeting Areas</Text>
                    </View>
                  </View>

                  {/* Smart Detour Card Section */}
                  <Text style={styles.smartDetourHeader}>Smart Detour & Public Meeting Venues</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.detourCardsRow}
                  >
                    {publicVenues.map((venue) => (
                      <View key={venue.id} style={styles.detourCard}>
                        <View style={styles.detourTopRow}>
                          <View style={styles.cafeIconCircle}>
                            <Coffee size={16} color="#B45309" />
                          </View>
                          <View style={styles.detourTimeBadge}>
                            <Clock size={11} color="#059669" style={{ marginRight: 3 }} />
                            <Text style={styles.detourTimeText}>+4 min detour</Text>
                          </View>
                        </View>
                        <Text style={styles.detourVenueName} numberOfLines={1}>{venue.name}</Text>
                        <Text style={styles.detourAddress} numberOfLines={1}>{venue.area}, {venue.city}</Text>
                        <TouchableOpacity
                          style={styles.suggestMeetingBtn}
                          activeOpacity={0.85}
                          onPress={() => {
                            if (queryResult.candidates.length > 0) {
                              setActiveCandidateModal({
                                ...queryResult.candidates[0],
                                suggestedVenue: venue,
                              });
                            }
                          }}
                        >
                          <Text style={styles.suggestMeetingBtnText}>Suggest Meeting</Text>
                          <ChevronRight size={13} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* MODE 3: AT DESTINATION BREAKDOWN & VENUES */}
              {mode === 'destination' && (
                <View style={styles.destinationBreakdownContainer}>
                  {/* Distance Breakdown Pills */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.matchCardsCarousel}
                  >
                    <View style={[styles.destMetricCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                      <Text style={[styles.destMetricVal, { color: '#16A34A' }]}>
                        {queryResult.availabilitySummary?.within1km ?? 0}
                      </Text>
                      <Text style={styles.destMetricLabel}>Within 1 km</Text>
                    </View>
                    <View style={[styles.destMetricCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                      <Text style={[styles.destMetricVal, { color: '#2563EB' }]}>
                        {queryResult.availabilitySummary?.within3km ?? 0}
                      </Text>
                      <Text style={styles.destMetricLabel}>1 – 3 km</Text>
                    </View>
                    <View style={[styles.destMetricCard, { backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }]}>
                      <Text style={[styles.destMetricVal, { color: '#7C3AED' }]}>
                        {queryResult.availabilitySummary?.within5km ?? queryResult.within5km}
                      </Text>
                      <Text style={styles.destMetricLabel}>3 – 5 km</Text>
                    </View>
                    <View style={[styles.destMetricCard, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                      <Text style={[styles.destMetricVal, { color: '#D97706' }]}>
                        {queryResult.availabilitySummary?.fiveToTenKm ?? queryResult.fiveToTenKm}
                      </Text>
                      <Text style={styles.destMetricLabel}>5 – 10 km</Text>
                    </View>
                  </ScrollView>

                  {/* Public Meeting Recommendations near Destination */}
                  <Text style={styles.smartDetourHeader}>Safe Public Meeting Options Near Destination</Text>
                  <View style={styles.destinationVenuesList}>
                    {publicVenues.map((venue) => (
                      <View key={venue.id} style={styles.venueListItem}>
                        <View style={styles.venueListLeft}>
                          <MapPin size={18} color="#2563EB" style={{ marginRight: 10 }} />
                          <View>
                            <Text style={styles.venueListTitle}>{venue.name}</Text>
                            <Text style={styles.venueListSub}>{venue.address}</Text>
                          </View>
                        </View>
                        <View style={styles.ratingBadge}>
                          <Text style={styles.ratingBadgeText}>★ {venue.rating}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* MODE 4: PLAN A TRIP BREAKDOWN & CONTROLS */}
              {mode === 'plan_trip' && tripPlan && (
                <View style={styles.tripBreakdownContainer}>
                  {/* 3 Metric Cards */}
                  <View style={styles.tripMetricsGrid}>
                    <View style={[styles.tripMetricCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                      <Text style={[styles.tripMetricVal, { color: '#059669' }]}>
                        {queryResult.availabilitySummary?.nearDestination ?? queryResult.totalMatches}
                      </Text>
                      <Text style={styles.tripMetricSub}>Around Destination</Text>
                    </View>

                    <View style={[styles.tripMetricCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                      <Text style={[styles.tripMetricVal, { color: '#2563EB' }]}>
                        {queryResult.availabilitySummary?.availableDuringDates ?? Math.ceil(queryResult.totalMatches * 0.4)}
                      </Text>
                      <Text style={styles.tripMetricSub}>Available During Dates</Text>
                    </View>

                    <View style={[styles.tripMetricCard, { backgroundColor: '#FFF1F2', borderColor: '#FFE4E6' }]}>
                      <Text style={[styles.tripMetricVal, { color: '#E11D48' }]}>
                        {queryResult.availabilitySummary?.strongMatches ?? Math.ceil(queryResult.totalMatches * 0.5)}
                      </Text>
                      <Text style={styles.tripMetricSub}>Strong Compatibility</Text>
                    </View>
                  </View>

                  {/* Trip Candidate Preview with Availability Tag */}
                  <View style={styles.tripCandidatePreview}>
                    <Text style={styles.smartDetourHeader}>Discoverable Around Your Trip</Text>
                    {queryResult.candidates.slice(0, 2).map((cand) => (
                      <TouchableOpacity
                        key={cand.id}
                        style={styles.tripCandidateCard}
                        onPress={() => setActiveCandidateModal(cand)}
                        activeOpacity={0.85}
                      >
                        <View style={styles.tripCandidateLeft}>
                          <View style={styles.ringCircleSmall}>
                            <Text style={{ fontSize: 14 }}>💍</Text>
                          </View>
                          <View>
                            <View style={styles.tripCandTopRow}>
                              <Text style={styles.tripCandZone}>{cand.approximateZone}</Text>
                              <View style={styles.candAvailBadge}>
                                <CheckCircle2 size={10} color="#059669" style={{ marginRight: 3 }} />
                                <Text style={styles.candAvailText}>
                                  {cand.availabilityNote || 'Available on Saturday'}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.tripCandSub}>
                              {cand.compatibilityPercentage}% Compatible • {cand.distanceLabel}
                            </Text>
                          </View>
                        </View>
                        <ChevronRight size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Trip Management Controls */}
                  <View style={styles.tripMgmtActionsRow}>
                    <TouchableOpacity
                      style={styles.tripMgmtBtn}
                      onPress={() => setTripPlannerVisible(true)}
                      activeOpacity={0.8}
                    >
                      <Pencil size={13} color="#1E293B" style={{ marginRight: 6 }} />
                      <Text style={styles.tripMgmtBtnText}>Change Dates</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.tripMgmtBtn}
                      onPress={() => {
                        setTripPlan((prev) =>
                          prev
                            ? {
                                ...prev,
                                visibility: prev.visibility === 'active' ? 'paused' : 'active',
                              }
                            : null
                        );
                      }}
                      activeOpacity={0.8}
                    >
                      {tripPlan.visibility === 'active' ? (
                        <>
                          <Text style={{ fontSize: 13, marginRight: 6 }}>⏸️</Text>
                          <Text style={[styles.tripMgmtBtnText, { color: '#D97706' }]}>Pause Discovery</Text>
                        </>
                      ) : (
                        <>
                          <Text style={{ fontSize: 13, marginRight: 6 }}>▶️</Text>
                          <Text style={[styles.tripMgmtBtnText, { color: '#16A34A' }]}>Resume Discovery</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}

          {/* Planning a Trip Banner (Matches media_1790678412884.png) */}
          {mode === 'around_me' && (
            <View style={styles.tripBannerCard}>
              <View style={styles.tripIllustrationCol}>
                <View style={styles.carRoadIllustration}>
                  <Text style={styles.pinHeartEmoji}>📍❤️</Text>
                  <Text style={styles.carEmoji}>🚗</Text>
                </View>
              </View>

              <View style={styles.tripTextCol}>
                <Text style={styles.tripTitle}>Planning a trip?</Text>
                <Text style={styles.tripSubtitle}>
                  Discover matches along your travel dates and route.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.planRouteBtn}
                onPress={() => setTripPlannerVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.planRouteBtnText}>Plan a Route →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Cluster Summary Drilldown Modal */}
      {selectedCluster && (
        <Modal
          transparent
          animationType="fade"
          visible={!!selectedCluster}
          onRequestClose={() => setSelectedCluster(null)}
        >
          <View style={styles.clusterSummaryOverlay}>
            <View style={styles.clusterSummaryCard}>
              <View style={styles.clusterSummaryIconBox}>
                <Users size={22} color="#3B82F6" />
              </View>
              <Text style={styles.clusterSummaryTitle}>
                {selectedCluster.count} compatible people
              </Text>
              <Text style={styles.clusterSummaryZone}>
                {selectedCluster.approximateZoneName}
              </Text>
              <Text style={styles.clusterSummarySub}>
                Strong compatibility available in this area. Exact locations are protected to ensure total privacy.
              </Text>
              <View style={styles.clusterSummaryButtonsRow}>
                <TouchableOpacity
                  style={styles.exploreClusterBtn}
                  activeOpacity={0.85}
                  onPress={() => handleExploreClusterCandidates(selectedCluster)}
                >
                  <Text style={styles.exploreClusterBtnText}>Explore Matches</Text>
                  <ArrowRight size={15} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeClusterBtn}
                  onPress={() => setSelectedCluster(null)}
                >
                  <Text style={styles.closeClusterBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Location Permission Modal */}
      <LocationPermissionModal
        visible={permissionModalVisible}
        isPermanentlyDenied={isPermanentlyDenied}
        onRequestPermission={handleAllowLocation}
        onExploreWithoutLocation={() => setPermissionModalVisible(false)}
        onDismiss={() => setPermissionModalVisible(false)}
      />

      {/* Discovery Filters Modal */}
      <DiscoveryFilterModal
        visible={filterModalVisible}
        filters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
        onClose={() => setFilterModalVisible(false)}
      />

      {/* Trip Planner Full Modal */}
      <TripPlannerModal
        visible={tripPlannerVisible}
        initialTrip={tripPlan}
        onClose={() => setTripPlannerVisible(false)}
        onPlanTrip={(updatedTrip) => {
          setTripPlan(updatedTrip);
          setMode('plan_trip');
          setTripPlannerVisible(false);
        }}
        onDeleteTrip={() => {
          setTripPlan(null);
          setMode('around_me');
        }}
      />

      {/* Anonymous Match Card Inspection Modal */}
      {activeCandidateModal && (
        <Modal
          transparent
          animationType="slide"
          visible={!!activeCandidateModal}
          onRequestClose={() => setActiveCandidateModal(null)}
        >
          <View style={styles.anonymousModalOverlay}>
            <View style={styles.anonymousModalContent}>
              <AnonymousMatchCard
                candidate={activeCandidateModal}
                onViewProfile={(cand) => {
                  setActiveCandidateModal(null);
                  if (onOpenCandidateProfile) {
                    onOpenCandidateProfile(cand);
                  }
                }}
                onSendIntroduction={(cand) => {
                  setActiveCandidateModal(null);
                  onStartRequest(cand);
                }}
                onClose={() => setActiveCandidateModal(null)}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Map Layers & View Style Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={layersModalVisible}
        onRequestClose={() => setLayersModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.layersModalContent}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Layers size={18} color="#0F172A" />
                <Text style={styles.modalTitleText}>Map Layers & Style</Text>
              </View>
              <TouchableOpacity onPress={() => setLayersModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.layerSectionLabel}>MAP TYPE</Text>
            <View style={styles.layerOptionGrid}>
              {[
                { id: 'standard', label: 'Standard', desc: 'Default vector street view' },
                { id: 'satellite', label: 'Satellite', desc: 'High-res aerial imagery' },
                { id: 'hybrid', label: 'Hybrid', desc: 'Satellite with street labels' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.layerOptionCard,
                    mapType === item.id && styles.layerOptionCardActive,
                  ]}
                  onPress={() => setMapType(item.id as any)}
                  activeOpacity={0.8}
                >
                  <View style={styles.layerRadioCircle}>
                    {mapType === item.id && <View style={styles.layerRadioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.layerOptionTitle, mapType === item.id && styles.layerOptionTitleActive]}>
                      {item.label}
                    </Text>
                    <Text style={styles.layerOptionDesc}>{item.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.layerSectionLabel, { marginTop: 16 }]}>REAL-TIME OVERLAYS</Text>
            <TouchableOpacity
              style={[styles.layerOptionCard, showsTraffic && styles.layerOptionCardActive]}
              onPress={() => setShowsTraffic((prev) => !prev)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkboxBox, showsTraffic && styles.checkboxBoxActive]}>
                {showsTraffic && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.layerOptionTitle, showsTraffic && styles.layerOptionTitleActive]}>
                  Real-time Highway Traffic
                </Text>
                <Text style={styles.layerOptionDesc}>
                  Live Kerala highway traffic delays & flow speeds along NH 544 & MC Road
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyLayersBtn}
              onPress={() => setLayersModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.applyLayersBtnText}>Apply Layers</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Match Alerts & Notifications Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={notificationsModalVisible}
        onRequestClose={() => setNotificationsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.notificationsModalContent}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Bell size={18} color="#0F172A" />
                <Text style={styles.modalTitleText}>Discovery Updates</Text>
              </View>
              <TouchableOpacity onPress={() => setNotificationsModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              <View style={styles.notifItem}>
                <View style={[styles.notifIconCircle, { backgroundColor: '#FFF1F2' }]}>
                  <Text style={{ fontSize: 16 }}>💍</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>
                    {queryResult.availabilitySummary?.within5km ?? queryResult.within5km} New Matches Nearby
                  </Text>
                  <Text style={styles.notifBody}>
                    Fresh profiles within 5 km align with your preferred Margams and marriage timeline.
                  </Text>
                  <Text style={styles.notifTime}>Updated today</Text>
                </View>
              </View>

              <View style={styles.notifItem}>
                <View style={[styles.notifIconCircle, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={{ fontSize: 16 }}>🚗</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>
                    {queryResult.availabilitySummary?.alongRoute ?? queryResult.alongRoute} Matches Along Highway Corridor
                  </Text>
                  <Text style={styles.notifBody}>
                    Compatible profiles active along the NH 544 transit corridor.
                  </Text>
                  <Text style={styles.notifTime}>Active route discovery</Text>
                </View>
              </View>

              <View style={styles.notifItem}>
                <View style={[styles.notifIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Sparkles size={16} color="#3B82F6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>High Compatibility Discovery</Text>
                  <Text style={styles.notifBody}>
                    {queryResult.availabilitySummary?.strongMatches ?? 0} profiles found with 85%+ compatibility.
                  </Text>
                  <Text style={styles.notifTime}>Real-time matching</Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.applyLayersBtn}
              onPress={() => setNotificationsModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.applyLayersBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View All Matches Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={viewAllModalVisible}
        onRequestClose={() => setViewAllModalVisible(false)}
      >
        <View style={styles.viewAllModalOverlay}>
          <View style={styles.viewAllModalContent}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitleText}>
                  All Discovered Matches ({queryResult.candidates.length})
                </Text>
                <Text style={styles.viewAllSub}>
                  Privacy-protected profiles matching your selected criteria
                </Text>
              </View>
              <TouchableOpacity onPress={() => setViewAllModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.viewAllCandidatesList} showsVerticalScrollIndicator={false}>
              {queryResult.candidates.map((cand) => (
                <View key={cand.id} style={styles.viewAllCard}>
                  <View style={styles.viewAllCardTop}>
                    <View style={styles.viewAllAvatarPlaceholder}>
                      <Text style={{ fontSize: 18 }}>💍</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.viewAllNameRow}>
                        <Text style={styles.viewAllZoneText}>{cand.approximateZone}</Text>
                        <View style={styles.viewAllCompatBadge}>
                          <Flame size={11} color="#F43F5E" style={{ marginRight: 2 }} />
                          <Text style={styles.viewAllCompatText}>
                            {cand.compatibilityPercentage}% Compatible
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.viewAllMetaText}>
                        {cand.availability} • {cand.distanceLabel}
                      </Text>
                      {cand.compatibilityReasons && cand.compatibilityReasons.length > 0 && (
                        <View style={styles.viewAllMargamsRow}>
                          {cand.compatibilityReasons.slice(0, 2).map((reason: string, idx: number) => (
                            <View key={idx} style={styles.viewAllMargamChip}>
                              <Text style={styles.viewAllMargamChipText}>{reason}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.viewAllCardActions}>
                    <TouchableOpacity
                      style={styles.viewProfileBtn}
                      onPress={() => {
                        setViewAllModalVisible(false);
                        if (onOpenCandidateProfile) onOpenCandidateProfile(cand);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.viewProfileBtnText}>View Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.requestIntroBtn}
                      onPress={() => {
                        setViewAllModalVisible(false);
                        onStartRequest(cand);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.requestIntroBtnText}>Request Intro</Text>
                      <ArrowRight size={13} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 42,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  backBtn: {
    padding: 6,
    marginRight: 2,
  },
  headerTitleCol: {
    marginLeft: 6,
    flex: 1,
  },
  headerModeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerModeSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  avatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 40,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: '#FFFFFF',
    zIndex: 10000,
    elevation: 10,
  },
  searchBarWrapper: {
    flex: 1,
    zIndex: 10000,
    elevation: 10,
  },
  locateBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeSwitcherContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 1,
  },
  modeSwitcherRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  subControlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  subControlLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  radiusPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  radiusPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  radiusPillActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  radiusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  radiusPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  routeSummaryBanner: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  routeSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  highwayBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  highwayBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  routeEndpointsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  routeMetaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  corridorFilterPills: {
    flexDirection: 'row',
    gap: 8,
  },
  detourPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detourPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  detourPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  detourPillTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  tripSummaryHeaderCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
    zIndex: 1,
  },
  tripHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripEndpointText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  editTripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  editTripBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  tripDatesMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tripDateBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  tripTransportBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tripTransportBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  tripStatusBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tripStatusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  mapContainer: {
    height: 380,
    width: '100%',
    backgroundColor: '#E2E8F0',
    zIndex: 1,
  },
  bottomDrawer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 8,
  },
  drawerHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  drawerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  viewAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
    marginTop: 2,
  },
  emptyAreaBox: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  emptyAreaTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyAreaSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  emptyActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  adjustFilterBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  adjustFilterBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  expandRadiusBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  expandRadiusBtnText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  matchCardsCarousel: {
    gap: 12,
    paddingBottom: 10,
  },
  matchCard: {
    width: 144,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  matchCardPink: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
  },
  matchCardBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  matchCardPurple: {
    backgroundColor: '#FAF5FF',
    borderColor: '#F3E8FF',
  },
  ringCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  ringEmoji: {
    fontSize: 15,
  },
  matchCountTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  matchAreaSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  matchCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  flameText: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    marginLeft: 4,
  },
  routeBreakdownContainer: {
    gap: 14,
  },
  routeMetricRow: {
    flexDirection: 'row',
    gap: 8,
  },
  routeMetricChip: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  routeMetricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  routeMetricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  smartDetourHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 6,
  },
  detourCardsRow: {
    gap: 12,
    paddingBottom: 8,
  },
  detourCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detourTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cafeIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detourTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  detourTimeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  detourVenueName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  detourAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  suggestMeetingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  suggestMeetingBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  destinationBreakdownContainer: {
    gap: 14,
  },
  destMetricCard: {
    width: 110,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  destMetricVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  destMetricLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  destinationVenuesList: {
    gap: 8,
  },
  venueListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  venueListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  venueListTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  venueListSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  tripBreakdownContainer: {
    gap: 14,
  },
  tripMetricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  tripMetricCard: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  tripMetricVal: {
    fontSize: 17,
    fontWeight: '800',
  },
  tripMetricSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
    textAlign: 'center',
  },
  tripCandidatePreview: {
    gap: 8,
  },
  tripCandidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tripCandidateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  ringCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripCandTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripCandZone: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  candAvailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  candAvailText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
  },
  tripCandSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  tripMgmtActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  tripMgmtBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 12,
  },
  tripMgmtBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  tripBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    marginTop: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tripIllustrationCol: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carRoadIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHeartEmoji: {
    fontSize: 11,
  },
  carEmoji: {
    fontSize: 14,
    marginTop: -2,
  },
  tripTextCol: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  tripSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  planRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 4,
  },
  planRouteBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  clusterSummaryOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  clusterSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 12,
  },
  clusterSummaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  clusterSummaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  clusterSummaryZone: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 2,
  },
  clusterSummarySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 18,
  },
  clusterSummaryButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  exploreClusterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    height: 46,
    borderRadius: 14,
  },
  exploreClusterBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  closeClusterBtn: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeClusterBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  anonymousModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  anonymousModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  layersBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  matchCardGreen: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  matchCardAmber: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  layersModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 12,
  },
  notificationsModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  modalTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 6,
  },
  layerSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  layerOptionGrid: {
    gap: 8,
  },
  layerOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  layerOptionCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  layerRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layerRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  layerOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  layerOptionTitleActive: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  layerOptionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxBoxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  applyLayersBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  applyLayersBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  notifItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  notifIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  notifBody: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  notifTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '600',
  },
  viewAllModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  viewAllModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
  },
  viewAllSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  viewAllCandidatesList: {
    marginTop: 12,
    marginBottom: 16,
  },
  viewAllCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  viewAllCardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  viewAllAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllZoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewAllCompatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  viewAllCompatText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F43F5E',
  },
  viewAllMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  viewAllMargamsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  viewAllMargamChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  viewAllMargamChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#334155',
  },
  viewAllCardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  viewProfileBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfileBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  requestIntroBtn: {
    flex: 1.2,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  requestIntroBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
