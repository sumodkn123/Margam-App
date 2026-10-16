import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export type PermissionState = 'undetermined' | 'granted' | 'denied';

/**
 * Check existing foreground location permissions without prompting.
 */
export async function checkLocationPermission(): Promise<PermissionState> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === Location.PermissionStatus.GRANTED) return 'granted';
    if (status === Location.PermissionStatus.DENIED) return 'denied';
    return 'undetermined';
  } catch (error) {
    console.warn('[LocationService] checkLocationPermission error:', error);
    return 'undetermined';
  }
}

/**
 * Request foreground location permissions from the OS.
 */
export async function requestLocationPermission(): Promise<PermissionState> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === Location.PermissionStatus.GRANTED) return 'granted';
    return 'denied';
  } catch (error) {
    console.warn('[LocationService] requestLocationPermission error:', error);
    return 'denied';
  }
}

/**
 * Fetch the real device GPS coordinates with balanced accuracy.
 * Never fabricates coordinates if unavailable.
 */
export async function getCurrentDeviceLocation(): Promise<DeviceLocation | null> {
  try {
    const hasPerms = await Location.getForegroundPermissionsAsync();
    if (hasPerms.status !== Location.PermissionStatus.GRANTED) {
      return null;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy ?? undefined,
    };
  } catch (error) {
    console.warn('[LocationService] getCurrentDeviceLocation error:', error);
    return null;
  }
}

/**
 * Reverse geocode a coordinate into a human-readable city/area name.
 */
export async function reverseGeocodeLocation(lat: number, lng: number): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (results && results.length > 0) {
      const first = results[0];
      const parts = [first.district || first.subregion || first.name, first.city || first.region]
        .filter(Boolean);
      return parts.join(', ') || 'Current Area';
    }
  } catch (err) {
    // Fallback if offline
  }
  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
}

/**
 * Open the native device system settings if permission was permanently denied.
 */
export async function openDeviceSettings(): Promise<void> {
  try {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  } catch (err) {
    console.warn('[LocationService] Could not open settings:', err);
  }
}
