// MARGAM - Screen 1: Map Discovery Screen
// Discovers compatible marriage candidates along routes anonymously

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { MargamInteractiveMap } from '../components/map/MargamInteractiveMap';
import { AnonymousMatchCard } from '../components/cards/AnonymousMatchCard';
import { MargamBrandHeader } from '../components/brand/MargamBrandHeader';
import { ANONYMOUS_MATCHES, POPULAR_ROUTES } from '../constants/mockData';
import { AnonymousCandidate, RouteCorridor } from '../types';
import {
  Navigation,
  Search,
  Filter,
  Car,
  Compass,
  Sparkles,
  MapPin,
} from 'lucide-react-native';

interface MapDiscoveryScreenProps {
  onStartRequest: (candidate: AnonymousCandidate, route: RouteCorridor) => void;
  onOpenPrivacy: () => void;
}

export const MapDiscoveryScreen: React.FC<MapDiscoveryScreenProps> = ({
  onStartRequest,
  onOpenPrivacy,
}) => {
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const activeRoute = POPULAR_ROUTES[activeRouteIndex];
  const [selectedCandidate, setSelectedCandidate] = useState<AnonymousCandidate | null>(
    ANONYMOUS_MATCHES[0]
  );
  const [filterMode, setFilterMode] = useState<'all' | 'along_route' | 'high_compat'>('along_route');

  const filteredCandidates = ANONYMOUS_MATCHES.filter((c) => {
    if (filterMode === 'along_route') return c.isAlongRoute;
    if (filterMode === 'high_compat') return c.compatibilityPercentage >= 90;
    return true;
  });

  return (
    <View style={styles.container}>
      <MargamBrandHeader
        rightAction={
          <TouchableOpacity
            style={styles.privacyHeaderBtn}
            onPress={onOpenPrivacy}
            activeOpacity={0.8}
          >
            <Text style={styles.privacyHeaderBtnText}>Privacy</Text>
          </TouchableOpacity>
        }
      />

      {/* Corridor Route Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.routeSelectorRow}>
          <View style={styles.routeIconBox}>
            <Navigation size={14} color={COLORS.primary} />
          </View>
          <View style={styles.routeEndpoints}>
            <Text style={styles.routeEndpointsTitle}>Active Route Corridor:</Text>
            <Text style={styles.routeEndpointsName}>{activeRoute.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.switchRouteBtn}
            onPress={() =>
              setActiveRouteIndex(
                activeRouteIndex === 0 ? 1 : 0
              )
            }
          >
            <Text style={styles.switchRouteBtnText}>Switch</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[styles.filterChip, filterMode === 'along_route' && styles.filterChipActive]}
            onPress={() => setFilterMode('along_route')}
          >
            <Car size={12} color={filterMode === 'along_route' ? '#0B0F14' : COLORS.textMuted} />
            <Text
              style={[
                styles.filterChipText,
                filterMode === 'along_route' && styles.filterChipTextActive,
              ]}
            >
              Along Route (3)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterMode === 'high_compat' && styles.filterChipActive]}
            onPress={() => setFilterMode('high_compat')}
          >
            <Sparkles size={12} color={filterMode === 'high_compat' ? '#0B0F14' : COLORS.textMuted} />
            <Text
              style={[
                styles.filterChipText,
                filterMode === 'high_compat' && styles.filterChipTextActive,
              ]}
            >
              90%+ Match
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterMode === 'all' && styles.filterChipActive]}
            onPress={() => setFilterMode('all')}
          >
            <Text
              style={[
                styles.filterChipText,
                filterMode === 'all' && styles.filterChipTextActive,
              ]}
            >
              All Zones ({ANONYMOUS_MATCHES.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Interactive Map */}
      <MargamInteractiveMap
        candidates={filteredCandidates}
        activeRoute={activeRoute}
        selectedCandidate={selectedCandidate}
        onSelectCandidate={(cand) => setSelectedCandidate(cand)}
        showPrivacyZones={true}
      />

      {/* Selected Anonymous Match Bottom Card */}
      <ScrollView style={styles.bottomScroll} contentContainerStyle={styles.bottomScrollContent}>
        {selectedCandidate ? (
          <AnonymousMatchCard
            candidate={selectedCandidate}
            onSendIntroduction={(c) => onStartRequest(c, activeRoute)}
            onClose={() => setSelectedCandidate(null)}
          />
        ) : (
          <View style={styles.emptyCard}>
            <Compass size={24} color={COLORS.textMuted} />
            <Text style={styles.emptyCardText}>
              Tap an anonymous marker (💍 92%) on the map to inspect route compatibility.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  privacyHeaderBtn: {
    backgroundColor: 'rgba(229, 139, 88, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  privacyHeaderBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  searchBarContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    gap: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  routeSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  routeIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(229, 139, 88, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeEndpoints: {
    flex: 1,
  },
  routeEndpointsTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  routeEndpointsName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  switchRouteBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
  },
  switchRouteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.routeCyan,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#0B0F14',
    fontWeight: '800',
  },
  bottomScroll: {
    flex: 1,
  },
  bottomScrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  emptyCardText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
