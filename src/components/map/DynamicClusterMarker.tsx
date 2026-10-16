import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { MapCluster } from '../../types';

interface DynamicClusterMarkerProps {
  cluster: MapCluster;
  isSelected: boolean;
  onPress: () => void;
}

export const DynamicClusterMarker: React.FC<DynamicClusterMarkerProps> = ({
  cluster,
  isSelected,
  onPress,
}) => {
  // Theme color based on cluster id or count to match diverse visual palette in design image
  const hash = Math.abs(
    cluster.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  const colorIndex = (cluster.count + hash) % 4;

  let badgeColor = '#2563EB'; // Blue (as seen on 8 matches & 6 matches)
  let haloBg = 'rgba(37, 99, 235, 0.18)';
  let haloBorder = 'rgba(37, 99, 235, 0.4)';

  if (colorIndex === 1) {
    badgeColor = '#7C3AED'; // Purple (as seen on 3 matches)
    haloBg = 'rgba(124, 58, 237, 0.18)';
    haloBorder = 'rgba(124, 58, 237, 0.4)';
  } else if (colorIndex === 2) {
    badgeColor = '#059669'; // Emerald (as seen on 5 matches)
    haloBg = 'rgba(5, 150, 105, 0.18)';
    haloBorder = 'rgba(5, 150, 105, 0.4)';
  } else if (colorIndex === 3) {
    badgeColor = '#8B5CF6'; // Violet (as seen on 4 matches)
    haloBg = 'rgba(139, 92, 246, 0.18)';
    haloBorder = 'rgba(139, 92, 246, 0.4)';
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.touchable}
    >
      {/* Outer Glowing Radar Halo */}
      <View
        style={[
          styles.radarHalo,
          {
            borderColor: haloBorder,
            backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.28)' : haloBg,
            transform: [{ scale: isSelected ? 1.15 : 1.0 }],
          },
        ]}
      >
        {/* Top Dot Marker (12 o'clock indicator in design image) */}
        <View style={[styles.topDot, { backgroundColor: badgeColor }]} />

        {/* Circular Core Badge */}
        <View
          style={[
            styles.circularBadge,
            {
              backgroundColor: badgeColor,
              borderWidth: isSelected ? 2.5 : 2,
            },
          ]}
        >
          <Text style={styles.countNumber}>{cluster.count}</Text>
          <Text style={styles.countLabel}>
            {cluster.count === 1 ? 'match' : 'matches'}
          </Text>
        </View>
      </View>

      {/* Approximate Zone Label Pill */}
      {cluster.approximateZoneName ? (
        <View style={styles.zoneTag}>
          <Text style={styles.zoneText} numberOfLines={1}>
            {cluster.approximateZoneName}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarHalo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  topDot: {
    position: 'absolute',
    top: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  circularBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  countNumber: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 15,
  },
  countLabel: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 8.5,
    fontWeight: '700',
    lineHeight: 10,
    marginTop: 1,
  },
  zoneTag: {
    marginTop: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    maxWidth: 96,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  zoneText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
});
