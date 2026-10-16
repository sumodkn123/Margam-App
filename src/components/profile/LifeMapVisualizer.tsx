import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Clock,
  Lock,
} from 'lucide-react-native';
import { LifeMapTimeline, LockedSectionState } from '../../types/profile';

interface LifeMapVisualizerProps {
  lifeMap?: LifeMapTimeline | LockedSectionState;
  partnerLifeMap?: LifeMapTimeline;
  onRequestAccess?: () => void;
  isOwner?: boolean;
  onEdit?: () => void;
}

export const LifeMapVisualizer: React.FC<LifeMapVisualizerProps> = ({
  lifeMap,
  partnerLifeMap,
  onRequestAccess,
  isOwner = false,
  onEdit,
}) => {
  // If locked
  if (!lifeMap || ('isLocked' in lifeMap && lifeMap.isLocked)) {
    const lockedState = lifeMap as LockedSectionState | undefined;
    return (
      <View style={styles.lockedContainer}>
        <View style={styles.lockIconCircle}>
          <Lock size={20} color="#D97706" />
        </View>
        <Text style={styles.lockedTitle}>Life Map is Protected</Text>
        <Text style={styles.lockedDescription}>
          {lockedState?.message || 'This user has reserved their future journey timeline for accepted connections.'}
        </Text>
        {lockedState?.canRequestAccess && onRequestAccess && (
          <TouchableOpacity
            style={styles.requestAccessBtn}
            onPress={onRequestAccess}
            activeOpacity={0.8}
          >
            <Sparkles size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.requestAccessBtnText}>Request Access to Life Map</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const timeline = lifeMap as LifeMapTimeline;

  const horizons = [
    {
      key: 'now',
      label: 'NOW',
      sublabel: 'Where I am right now',
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      icon: <Clock size={16} color="#2563EB" />,
      items: timeline.now || [],
    },
    {
      key: 'next',
      label: 'NEXT',
      sublabel: 'Next 1–2 years',
      color: '#7C3AED',
      bgColor: '#FAF5FF',
      borderColor: '#E9D5FF',
      icon: <ArrowRight size={16} color="#7C3AED" />,
      items: timeline.next || [],
    },
    {
      key: 'threeToFiveYears',
      label: '3–5 YEARS',
      sublabel: 'Medium term goals',
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: <Sparkles size={16} color="#059669" />,
      items: timeline.threeToFiveYears || [],
    },
    {
      key: 'future',
      label: 'FUTURE',
      sublabel: 'Long term vision',
      color: '#EA580C',
      bgColor: '#FFF7ED',
      borderColor: '#FED7AA',
      icon: <Compass size={16} color="#EA580C" />,
      items: timeline.future || [],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Compass size={18} color="#2563EB" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Life Map & Journey</Text>
        </View>
        {isOwner && onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
            <Text style={styles.editText}>Edit Timeline</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.subtitle}>
        A vision of paths, goals, and values across life horizons.
      </Text>

      {/* Stepper Timeline */}
      <View style={styles.timelineList}>
        {horizons.map((horizon, index) => {
          const isLast = index === horizons.length - 1;
          return (
            <View key={horizon.key} style={styles.horizonRow}>
              {/* Stepper indicator line */}
              <View style={styles.stepIndicatorCol}>
                <View
                  style={[
                    styles.stepBadge,
                    { backgroundColor: horizon.bgColor, borderColor: horizon.borderColor },
                  ]}
                >
                  {horizon.icon}
                </View>
                {!isLast && <View style={styles.stepVerticalLine} />}
              </View>

              {/* Content Card */}
              <View style={[styles.contentCard, { borderLeftColor: horizon.color }]}>
                <View style={styles.horizonHeader}>
                  <Text style={[styles.horizonLabel, { color: horizon.color }]}>
                    {horizon.label}
                  </Text>
                  <Text style={styles.horizonSublabel}>{horizon.sublabel}</Text>
                </View>

                {horizon.items.length === 0 ? (
                  <Text style={styles.emptyItemsText}>No milestones added yet</Text>
                ) : (
                  <View style={styles.itemsList}>
                    {horizon.items.map((item, itemIdx) => (
                      <View key={itemIdx} style={styles.itemBubble}>
                        <View style={[styles.itemDot, { backgroundColor: horizon.color }]} />
                        <Text style={styles.itemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Partner Comparison Notice if available */}
      {partnerLifeMap && (
        <View style={styles.comparisonBanner}>
          <Sparkles size={16} color="#7C3AED" style={{ marginRight: 8 }} />
          <Text style={styles.comparisonText}>
            High alignment with your 3–5 year vision of shared travel and balanced career growth.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  editBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  timelineList: {
    marginTop: 4,
  },
  horizonRow: {
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 12,
  },
  stepIndicatorCol: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepVerticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
    marginBottom: -4,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3.5,
    marginBottom: 4,
  },
  horizonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  horizonLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  horizonSublabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  emptyItemsText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  itemsList: {
    gap: 6,
  },
  itemBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  itemText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
    flex: 1,
  },
  comparisonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  comparisonText: {
    fontSize: 12,
    color: '#6B21A8',
    fontWeight: '500',
    flex: 1,
    lineHeight: 17,
  },
  lockedContainer: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  lockIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  lockedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 6,
  },
  lockedDescription: {
    fontSize: 13,
    color: '#B45309',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  requestAccessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D97706',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  requestAccessBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
