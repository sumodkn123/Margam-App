import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Home, Compass, Map as MapIcon, MessageCircle, User } from 'lucide-react-native';

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
  unreadCount = 1,
  requestsCount = 1,
}) => {
  return (
    <View style={styles.navBar}>
      {/* 1. Home Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('home')}
        activeOpacity={0.8}
        accessibilityLabel="Home"
      >
        <Home
          size={22}
          color={activeTab === 'home' ? '#2563EB' : '#94A3B8'}
          strokeWidth={activeTab === 'home' ? 2.5 : 2}
        />
        <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* 2. Margams Tab (Compass icon matching design) */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('margams')}
        activeOpacity={0.8}
        accessibilityLabel="Margams"
      >
        <Compass
          size={23}
          color={activeTab === 'margams' ? '#2563EB' : '#94A3B8'}
          fill={activeTab === 'margams' ? '#2563EB' : 'none'}
          strokeWidth={activeTab === 'margams' ? 2.2 : 2}
        />
        <Text style={[styles.navLabel, activeTab === 'margams' && styles.navLabelActive]}>
          Margams
        </Text>
      </TouchableOpacity>

      {/* 3. Map Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('map')}
        activeOpacity={0.8}
        accessibilityLabel="Map"
      >
        <MapIcon
          size={22}
          color={activeTab === 'map' ? '#2563EB' : '#94A3B8'}
          strokeWidth={activeTab === 'map' ? 2.5 : 2}
        />
        <Text style={[styles.navLabel, activeTab === 'map' && styles.navLabelActive]}>
          Map
        </Text>
      </TouchableOpacity>

      {/* 4. Chat Tab with Unread Indicator */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('chat')}
        activeOpacity={0.8}
        accessibilityLabel="Chat"
      >
        <View style={styles.iconWithBadge}>
          <MessageCircle
            size={22}
            color={activeTab === 'chat' ? '#2563EB' : '#94A3B8'}
            strokeWidth={activeTab === 'chat' ? 2.5 : 2}
          />
          {unreadCount > 0 && <View style={styles.unreadBadge} />}
        </View>
        <Text style={[styles.navLabel, activeTab === 'chat' && styles.navLabelActive]}>
          Chat
        </Text>
      </TouchableOpacity>

      {/* 5. Profile Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('profile')}
        activeOpacity={0.8}
        accessibilityLabel="Profile"
      >
        <User
          size={22}
          color={activeTab === 'profile' ? '#2563EB' : '#94A3B8'}
          strokeWidth={activeTab === 'profile' ? 2.5 : 2}
        />
        <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
          Profile
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
    height: Platform.OS === 'ios' ? 78 : 66,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 18 : 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 3,
  },
  navLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  iconWithBadge: {
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F43F5E',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
