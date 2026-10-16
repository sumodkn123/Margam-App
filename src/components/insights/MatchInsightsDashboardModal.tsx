import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Users,
  Car,
  MapPin,
  Sparkles,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import { MatchInsightsSummary } from '../../types';
import { getTodayMatchInsights } from '../../services/insightsService';
import { THEME } from '../../constants/theme';

interface MatchInsightsDashboardModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenNewMatches: () => void;
  onOpenAlongRoute: () => void;
  onOpenAtDestination: () => void;
  onOpenHighCompatibility: () => void;
}

export const MatchInsightsDashboardModal: React.FC<MatchInsightsDashboardModalProps> = ({
  visible,
  onClose,
  onOpenNewMatches,
  onOpenAlongRoute,
  onOpenAtDestination,
  onOpenHighCompatibility,
}) => {
  const [summary, setSummary] = useState<MatchInsightsSummary>(() => getTodayMatchInsights());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedText, setLastRefreshedText] = useState<string>('Updated just now');

  useEffect(() => {
    if (visible) {
      const s = getTodayMatchInsights();
      setSummary(s);
      setLastRefreshedText('Updated just now');
    }
  }, [visible]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const refreshed = getTodayMatchInsights(undefined, true);
      setSummary(refreshed);
      setIsRefreshing(false);
      setLastRefreshedText('Updated just now');
    }, 400);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <X size={20} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Match Insights Dashboard</Text>
            <Text style={styles.headerSubTitle}>Daily matrimonial discovery summary</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {/* Freshness & Refresh Strip */}
          <View style={styles.freshnessStrip}>
            <View style={styles.freshnessLeft}>
              <Clock size={13} color="#64748B" />
              <Text style={styles.freshnessText}>{lastRefreshedText}</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={handleManualRefresh}
              activeOpacity={0.7}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color="#E11D48" />
              ) : (
                <>
                  <RefreshCw size={13} color="#E11D48" style={{ marginRight: 4 }} />
                  <Text style={styles.refreshBtnText}>Refresh Insights</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Executive KPI Overview Grid */}
          <View style={styles.kpiGrid}>
            {/* KPI 1: New Matches */}
            <TouchableOpacity
              style={[styles.kpiCard, { backgroundColor: '#FFF1F2', borderColor: '#FFE4E6' }]}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onOpenNewMatches();
              }}
            >
              <View style={[styles.kpiIconWrap, { backgroundColor: '#F43F5E' }]}>
                <Users size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.kpiCount}>{summary.newMatchesCount}</Text>
              <Text style={styles.kpiLabel}>New Matches</Text>
              <Text style={styles.kpiSub}>In your area</Text>
            </TouchableOpacity>

            {/* KPI 2: Along Route */}
            <TouchableOpacity
              style={[styles.kpiCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onOpenAlongRoute();
              }}
            >
              <View style={[styles.kpiIconWrap, { backgroundColor: '#3B82F6' }]}>
                <Car size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.kpiCount}>{summary.routeMatchesCount}</Text>
              <Text style={styles.kpiLabel}>Along Route</Text>
              <Text style={styles.kpiSub}>{summary.routeSummary}</Text>
            </TouchableOpacity>

            {/* KPI 3: At Destination */}
            <TouchableOpacity
              style={[styles.kpiCard, { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' }]}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onOpenAtDestination();
              }}
            >
              <View style={[styles.kpiIconWrap, { backgroundColor: '#10B981' }]}>
                <MapPin size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.kpiCount}>{summary.destinationMatchesCount}</Text>
              <Text style={styles.kpiLabel}>At Destination</Text>
              <Text style={styles.kpiSub}>{summary.destinationName} area</Text>
            </TouchableOpacity>

            {/* KPI 4: High Compatibility */}
            <TouchableOpacity
              style={[styles.kpiCard, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onOpenHighCompatibility();
              }}
            >
              <View style={[styles.kpiIconWrap, { backgroundColor: '#F59E0B' }]}>
                <Sparkles size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.kpiCount}>{summary.highCompatibilityCount}</Text>
              <Text style={styles.kpiLabel}>High Alignment</Text>
              <Text style={styles.kpiSub}>{summary.highCompatThreshold}%+ match</Text>
            </TouchableOpacity>
          </View>

          {/* Section 1: Detailed Dimension Breakdown */}
          <Text style={styles.sectionHeaderTitle}>Discovery Dimensions Today</Text>

          {/* Card 1 Detail: New Matches */}
          <View style={styles.dimensionCard}>
            <View style={styles.dimCardHeader}>
              <View style={[styles.dimBadgeIcon, { backgroundColor: '#FFF1F2' }]}>
                <Users size={16} color="#F43F5E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dimTitle}>New Matches This Week</Text>
                <Text style={styles.dimDesc}>
                  {summary.newMatchesCount} profiles became newly eligible matching your active age, timeline, and lifestyle preferences.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.dimActionBtn}
              activeOpacity={0.8}
              onPress={() => {
                onClose();
                onOpenNewMatches();
              }}
            >
              <Text style={styles.dimActionText}>Explore New Matches ({summary.newMatchesCount})</Text>
              <ArrowRight size={14} color="#E11D48" />
            </TouchableOpacity>
          </View>

          {/* Card 2 Detail: Along Route */}
          <View style={styles.dimensionCard}>
            <View style={styles.dimCardHeader}>
              <View style={[styles.dimBadgeIcon, { backgroundColor: '#EFF6FF' }]}>
                <Car size={16} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dimTitle}>Transit Corridor ({summary.routeSummary})</Text>
                <Text style={styles.dimDesc}>
                  {summary.routeMatchesCount} compatible profiles live within ≤{summary.detourFilterMinutes}m of your highway path with verified meeting venues.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.dimActionBtn}
              activeOpacity={0.8}
              onPress={() => {
                onClose();
                onOpenAlongRoute();
              }}
            >
              <Text style={[styles.dimActionText, { color: '#2563EB' }]}>
                Explore Route Matches ({summary.routeMatchesCount})
              </Text>
              <ArrowRight size={14} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* Card 3 Detail: Destination */}
          <View style={styles.dimensionCard}>
            <View style={styles.dimCardHeader}>
              <View style={[styles.dimBadgeIcon, { backgroundColor: '#ECFDF5' }]}>
                <MapPin size={16} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dimTitle}>Destination ({summary.destinationName})</Text>
                <Text style={styles.dimDesc}>
                  {summary.destinationMatchesCount} profiles within {summary.destinationRadiusKm} km of {summary.destinationName} with verified public cafe meeting spots.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.dimActionBtn}
              activeOpacity={0.8}
              onPress={() => {
                onClose();
                onOpenAtDestination();
              }}
            >
              <Text style={[styles.dimActionText, { color: '#059669' }]}>
                Explore Destination ({summary.destinationMatchesCount})
              </Text>
              <ArrowRight size={14} color="#059669" />
            </TouchableOpacity>
          </View>

          {/* Card 4 Detail: High Compatibility */}
          <View style={styles.dimensionCard}>
            <View style={styles.dimCardHeader}>
              <View style={[styles.dimBadgeIcon, { backgroundColor: '#FFFBEB' }]}>
                <Sparkles size={16} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dimTitle}>Top Compatibility ({summary.highCompatThreshold}%+)</Text>
                <Text style={styles.dimDesc}>
                  {summary.highCompatibilityCount} profiles with exceptional marriage goal, dietary, and career alignment across Kerala.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.dimActionBtn}
              activeOpacity={0.8}
              onPress={() => {
                onClose();
                onOpenHighCompatibility();
              }}
            >
              <Text style={[styles.dimActionText, { color: '#D97706' }]}>
                Explore Top Alignment ({summary.highCompatibilityCount})
              </Text>
              <ArrowRight size={14} color="#D97706" />
            </TouchableOpacity>
          </View>

          {/* Contextual Discovery Tips */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeaderRow}>
              <Sparkles size={16} color="#D97706" />
              <Text style={styles.tipsHeaderTitle}>Smart Discovery Recommendations</Text>
            </View>

            <View style={styles.tipRow}>
              <CheckCircle2 size={14} color="#059669" style={{ marginTop: 2 }} />
              <Text style={styles.tipText}>
                {summary.newMatchesCount} new candidates joined your discovery radius recently — sending early introductions yields higher acceptance.
              </Text>
            </View>

            <View style={styles.tipRow}>
              <CheckCircle2 size={14} color="#2563EB" style={{ marginTop: 2 }} />
              <Text style={styles.tipText}>
                Expanding your highway detour from 10m to 20m connects you with up to 4 more verified profiles on your route.
              </Text>
            </View>

            <View style={styles.tipRow}>
              <CheckCircle2 size={14} color="#D97706" style={{ marginTop: 2 }} />
              <Text style={styles.tipText}>
                Your marriage timeline ("Within 1 year") matches {summary.highCompatibilityCount} high-compatibility profiles.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
  },
  freshnessStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  freshnessLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  freshnessText: {
    fontSize: 12,
    color: '#64748B',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  refreshBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  kpiCard: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  kpiIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  kpiSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  dimensionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dimCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  dimBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  dimDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 17,
  },
  dimActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dimActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E11D48',
  },
  tipsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  tipsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  tipsHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#78350F',
    lineHeight: 17,
  },
});
