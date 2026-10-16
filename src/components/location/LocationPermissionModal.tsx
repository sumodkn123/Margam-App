import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MapPin, ShieldCheck, Navigation, Settings, ArrowRight } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { openDeviceSettings } from '../../services/locationService';

interface LocationPermissionModalProps {
  visible: boolean;
  isPermanentlyDenied: boolean;
  onRequestPermission: () => void;
  onExploreWithoutLocation: () => void;
  onDismiss: () => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  visible,
  isPermanentlyDenied,
  onRequestPermission,
  onExploreWithoutLocation,
  onDismiss,
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Icon Graphic */}
          <View style={styles.iconCircle}>
            {isPermanentlyDenied ? (
              <Settings size={30} color={THEME.colors.primary} />
            ) : (
              <Navigation size={30} color={THEME.colors.primary} />
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {isPermanentlyDenied
              ? 'Location Access Is Off'
              : 'Find Matches on Your Path'}
          </Text>

          {/* Description */}
          <Text style={styles.subtitle}>
            {isPermanentlyDenied
              ? 'Location access was turned off in device settings. You can still search any destination or enable access to see matches nearby.'
              : 'Margam uses your location to discover compatible marriage candidates around you and along your daily routes.'}
          </Text>

          {/* Privacy Guarantee Banner */}
          <View style={styles.privacyBanner}>
            <ShieldCheck size={18} color={THEME.colors.success} style={styles.shieldIcon} />
            <Text style={styles.privacyBannerText}>
              <Text style={styles.privacyBold}>Zero-Location Leak Guarantee: </Text>
              Your exact address, workplace, and live coordinates are never shown to other users.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {isPermanentlyDenied ? (
              <>
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: THEME.colors.primary }]}
                  activeOpacity={0.88}
                  onPress={() => {
                    openDeviceSettings();
                  }}
                >
                  <Settings size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Open Device Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  activeOpacity={0.7}
                  onPress={onExploreWithoutLocation}
                >
                  <Text style={styles.secondaryButtonText}>Explore Without Location</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: THEME.colors.primary }]}
                  activeOpacity={0.88}
                  onPress={onRequestPermission}
                >
                  <MapPin size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Allow Location</Text>
                  <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  activeOpacity={0.7}
                  onPress={onDismiss}
                >
                  <Text style={styles.secondaryButtonText}>Not Now</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 23, 44, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  shieldIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  privacyBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#166534',
  },
  privacyBold: {
    fontWeight: '700',
    color: '#15803D',
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    width: '100%',
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
