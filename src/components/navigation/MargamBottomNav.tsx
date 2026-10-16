import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, Map as MapIcon, Inbox, MessageCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

export type TabKey = 'home' | 'margams' | 'map' | 'requests' | 'chat' | 'profile';

interface MargamBottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onRequestPress?: () => void;
  unreadCount?: number;
  requestsCount?: number;
}

export const MargamBottomNav: React.FC<MargamBottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
  requestsCount = 0,
}) => {
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 8);

  const activeColor = COLORS.primary; // #E11D48 (Kerala Sunset Rose)
  const inactiveColor = '#94A3B8';    // Slate 400

  return (
    <View style={[styles.navBar, { paddingBottom: safeBottom, height: 58 + safeBottom }]}>
      {/* 1. Home Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('home')}
        activeOpacity={0.75}
        accessibilityRole="tab"
        accessibilityLabel="Home tab"
        accessibilityState={{ selected: activeTab === 'home' }}
      >
        <View style={styles.iconContainer}>
          <Home
            size={22}
            color={activeTab === 'home' ? activeColor : inactiveColor}
            strokeWidth={activeTab === 'home' ? 2.4 : 1.9}
          />
          {activeTab === 'home' && <View style={styles.activePill} />}
        </View>
        <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* 2. Margams Tab (Compass icon) */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('margams')}
        activeOpacity={0.75}
        accessibilityRole="tab"
        accessibilityLabel="Margams tab"
        accessibilityState={{ selected: activeTab === 'margams' }}
      >
        <View style={styles.iconContainer}>
          <Compass
            size={23}
            color={activeTab === 'margams' ? activeColor : inactiveColor}
            strokeWidth={activeTab === 'margams' ? 2.4 : 1.9}
          />
          {activeTab === 'margams' && <View style={styles.activePill} />}
        </View>
        <Text style={[styles.navLabel, activeTab === 'margams' && styles.navLabelActive]}>
          Margams
        </Text>
      </TouchableOpacity>

      {/* 3. Map Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('map')}
        activeOpacity={0.75}
        accessibilityRole="tab"
        accessibilityLabel="Map discovery tab"
        accessibilityState={{ selected: activeTab === 'map' }}
      >
        <View style={styles.iconContainer}>
          <MapIcon
            size={22}
            color={activeTab === 'map' ? activeColor : inactiveColor}
            strokeWidth={activeTab === 'map' ? 2.4 : 1.9}
          />
          {activeTab === 'map' && <View style={styles.activePill} />}
        </View>
        <Text style={[styles.navLabel, activeTab === 'map' && styles.navLabelActive]}>
          Map
        </Text>
      </TouchableOpacity>

      {/* 4. Requests Tab with Badge */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('requests')}
        activeOpacity={0.75}
        accessibilityRole="tab"
        accessibilityLabel="Requests tab"
        accessibilityState={{ selected: activeTab === 'requests' }}
      >
        <View style={styles.iconContainer}>
          <Inbox
            size={22}
            color={activeTab === 'requests' ? activeColor : inactiveColor}
            strokeWidth={activeTab === 'requests' ? 2.4 : 1.9}
          />
          {requestsCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {requestsCount > 9 ? '9+' : requestsCount}
              </Text>
            </View>
          )}
          {activeTab === 'requests' && <View style={styles.activePill} />}
        </View>
        <Text style={[styles.navLabel, activeTab === 'requests' && styles.navLabelActive]}>
          Requests
        </Text>
      </TouchableOpacity>

      {/* 5. Chat Tab with Unread Indicator */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('chat')}
        activeOpacity={0.75}
        accessibilityRole="tab"
        accessibilityLabel="Chat tab"
        accessibilityState={{ selected: activeTab === 'chat' }}
      >
        <View style={styles.iconContainer}>
          <MessageCircle
            size={22}
            color={activeTab === 'chat' ? activeColor : inactiveColor}
            strokeWidth={activeTab === 'chat' ? 2.4 : 1.9}
          />
          {unreadCount > 0 && (
            <View style={styles.unreadDot} />
          )}
          {activeTab === 'chat' && <View style={styles.activePill} />}
        </View>
        <Text style={[styles.navLabel, activeTab === 'chat' && styles.navLabelActive]}>
          Chat
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 26,
  },
  navLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 3,
    letterSpacing: -0.1,
  },
  navLabelActive: {
    color: '#E11D48',
    fontWeight: '700',
  },
  activePill: {
    position: 'absolute',
    bottom: -6,
    width: 14,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#E11D48',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E11D48',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  countBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
    textAlign: 'center',
  },
});
