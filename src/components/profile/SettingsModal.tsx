import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import {
  X,
  Bell,
  Lock,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Smartphone,
  Mail,
  Sliders,
  Heart,
} from 'lucide-react-native';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenPrivacyTab?: () => void;
  onSignOut?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onOpenPrivacyTab,
  onSignOut,
}) => {
  const [pushNotifs, setPushNotifs] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [routeCorridorAlerts, setRouteCorridorAlerts] = useState(true);
  const [hideReadReceipts, setHideReadReceipts] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out of Margam',
      'Are you sure you want to sign out? You will be returned to the Welcome & Sign In experience.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out 💖',
          style: 'destructive',
          onPress: () => {
            onClose();
            onSignOut?.();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings & Account</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Account Info */}
            <Text style={styles.sectionHeader}>ACCOUNT</Text>
            <View style={styles.cardGroup}>
              <View style={styles.rowItem}>
                <View style={styles.rowIconCircle}>
                  <Smartphone size={16} color="#2563EB" />
                </View>
                <View style={styles.rowTextCol}>
                  <Text style={styles.rowTitle}>Phone Number</Text>
                  <Text style={styles.rowSub}>+91 98470 12345 (Verified)</Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </View>

              <View style={styles.divider} />

              <View style={styles.rowItem}>
                <View style={styles.rowIconCircle}>
                  <Mail size={16} color="#2563EB" />
                </View>
                <View style={styles.rowTextCol}>
                  <Text style={styles.rowTitle}>Email Address</Text>
                  <Text style={styles.rowSub}>sumod.connect@margam.app</Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </View>
            </View>

            {/* Notifications */}
            <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
            <View style={styles.cardGroup}>
              <View style={styles.switchRow}>
                <View style={styles.rowIconCircle}>
                  <Bell size={16} color="#8B5CF6" />
                </View>
                <View style={styles.rowTextCol}>
                  <Text style={styles.rowTitle}>Push Notifications</Text>
                  <Text style={styles.rowSub}>Instant introduction & chat alerts</Text>
                </View>
                <Switch
                  value={pushNotifs}
                  onValueChange={setPushNotifs}
                  trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                  thumbColor={pushNotifs ? '#2563EB' : '#FFFFFF'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.switchRow}>
                <View style={styles.rowIconCircle}>
                  <Sliders size={16} color="#8B5CF6" />
                </View>
                <View style={styles.rowTextCol}>
                  <Text style={styles.rowTitle}>Highway Route Matches</Text>
                  <Text style={styles.rowSub}>Notify when compatible user is along route</Text>
                </View>
                <Switch
                  value={routeCorridorAlerts}
                  onValueChange={setRouteCorridorAlerts}
                  trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                  thumbColor={routeCorridorAlerts ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            </View>

            {/* Privacy & Security */}
            <Text style={styles.sectionHeader}>PRIVACY & SAFETY</Text>
            <View style={styles.cardGroup}>
              <TouchableOpacity
                style={styles.rowItem}
                activeOpacity={0.7}
                onPress={() => {
                  onClose();
                  if (onOpenPrivacyTab) onOpenPrivacyTab();
                }}
              >
                <View style={styles.rowIconCircle}>
                  <Lock size={16} color="#059669" />
                </View>
                <View style={styles.rowTextCol}>
                  <Text style={styles.rowTitle}>Privacy & Discovery Matrix</Text>
                  <Text style={styles.rowSub}>Control map fuzzing and field permissions</Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <View style={styles.switchRow}>
                <View style={styles.rowIconCircle}>
                  <Shield size={16} color="#059669" />
                </View>
                <View style={styles.rowTextCol}>
                  <Text style={styles.rowTitle}>Incognito Discovery</Text>
                  <Text style={styles.rowSub}>Hide online and read receipts in chat</Text>
                </View>
                <Switch
                  value={hideReadReceipts}
                  onValueChange={setHideReadReceipts}
                  trackColor={{ false: '#E2E8F0', true: '#A7F3D0' }}
                  thumbColor={hideReadReceipts ? '#10B981' : '#FFFFFF'}
                />
              </View>
            </View>

            {/* Help & Support */}
            <Text style={styles.sectionHeader}>SUPPORT</Text>
            <View style={styles.cardGroup}>
              <TouchableOpacity
                style={styles.rowItem}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Margam Concierge', 'Help & 24/7 Safety Hotline: support@margam.app')}
              >
                <View style={styles.rowIconCircle}>
                  <HelpCircle size={16} color="#64748B" />
                </View>
                <View style={styles.rowTextCol}>
                  <Text style={styles.rowTitle}>Help & Safety Guidelines</Text>
                  <Text style={styles.rowSub}>Rules for public meetings and privacy</Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            {/* Sign Out Button */}
            <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.85} onPress={handleSignOut}>
              <Heart size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.signOutText}>Sign Out of Account 💖</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Margam iOS v1.0.0 (Build 2026.10)</Text>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 8,
  },
  cardGroup: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowTextCol: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  rowSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
    marginBottom: 12,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
  },
});
