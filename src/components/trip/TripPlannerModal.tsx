import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import { X, Calendar, MapPin, Navigation, ArrowRight, Car, Plane } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { TripPlan, TransportMode } from '../../types';

interface TripPlannerModalProps {
  visible: boolean;
  initialTrip?: TripPlan | null;
  onClose: () => void;
  onPlanTrip: (trip: TripPlan) => void;
  onDeleteTrip?: (tripId: string) => void;
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  visible,
  initialTrip,
  onClose,
  onPlanTrip,
  onDeleteTrip,
}) => {
  const [origin, setOrigin] = useState('Thrissur');
  const [destination, setDestination] = useState('Kochi');
  const [departureDate, setDepartureDate] = useState('24 Dec');
  const [returnDate, setReturnDate] = useState('26 Dec');
  const [transportMode, setTransportMode] = useState<TransportMode>('car');

  useEffect(() => {
    if (initialTrip) {
      setOrigin(initialTrip.origin);
      setDestination(initialTrip.destination);
      setDepartureDate(initialTrip.departureDate);
      setReturnDate(initialTrip.returnDate);
      setTransportMode(initialTrip.transportMode);
    }
  }, [initialTrip, visible]);

  if (!visible) return null;

  const handleSubmit = () => {
    const trip: TripPlan = {
      id: initialTrip?.id || `trip_${Date.now()}`,
      userId: 'usr-current-sumod',
      origin: origin.trim() || 'Thrissur',
      destination: destination.trim() || 'Kochi',
      departureDate: departureDate.trim() || '24 Dec',
      returnDate: returnDate.trim() || '26 Dec',
      transportMode,
      visibility: initialTrip?.visibility || 'active',
      createdAt: initialTrip?.createdAt || new Date().toISOString(),
    };
    onPlanTrip(trip);
    onClose();
  };

  const transportOptions: { mode: TransportMode; label: string; iconEmoji?: string; iconComponent?: any }[] = [
    { mode: 'car', label: 'Car', iconComponent: Car },
    { mode: 'train', label: 'Train', iconEmoji: '🚆' },
    { mode: 'flight', label: 'Flight', iconComponent: Plane },
    { mode: 'bus', label: 'Bus', iconEmoji: '🚌' },
  ];

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Calendar size={20} color="#10B981" />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {initialTrip ? 'Edit Travel Plan' : 'Plan Your Trip'}
                </Text>
                <Text style={styles.headerSubtitle}>
                  Discover compatible people around your trip dates
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
            {/* Origin */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FROM (Current City / Location)</Text>
              <View style={styles.inputWrapper}>
                <Navigation size={16} color={THEME.colors.primary} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  value={origin}
                  onChangeText={setOrigin}
                  placeholder="e.g. Thrissur"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Destination */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TO (Destination)</Text>
              <View style={styles.inputWrapper}>
                <MapPin size={16} color="#DC2626" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="e.g. Kochi"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Travel Dates: Departure & Return */}
            <View style={styles.datesRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>DEPARTURE</Text>
                <View style={styles.inputWrapper}>
                  <Calendar size={15} color="#10B981" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.input}
                    value={departureDate}
                    onChangeText={setDepartureDate}
                    placeholder="24 Dec"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>RETURN</Text>
                <View style={styles.inputWrapper}>
                  <Calendar size={15} color="#6366F1" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.input}
                    value={returnDate}
                    onChangeText={setReturnDate}
                    placeholder="26 Dec"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            {/* Transport Mode Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TRANSPORT MODE (Optional)</Text>
              <View style={styles.transportRow}>
                {transportOptions.map((opt) => {
                  const IconComp = opt.iconComponent;
                  const isSelected = transportMode === opt.mode;
                  return (
                    <TouchableOpacity
                      key={opt.mode}
                      style={[styles.transportChip, isSelected && styles.transportChipActive]}
                      onPress={() => setTransportMode(opt.mode)}
                      activeOpacity={0.8}
                    >
                      {IconComp ? (
                        <IconComp
                          size={15}
                          color={isSelected ? '#3B82F6' : '#64748B'}
                          style={{ marginRight: 6 }}
                        />
                      ) : (
                        <Text style={{ fontSize: 14, marginRight: 6 }}>{opt.iconEmoji}</Text>
                      )}
                      <Text
                        style={[
                          styles.transportChipText,
                          isSelected && styles.transportChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsCol}>
              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.88}
                onPress={handleSubmit}
              >
                <Car size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>
                  {initialTrip ? 'Update Matches' : 'Find Matches'}
                </Text>
                <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>

              {initialTrip && onDeleteTrip && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  activeOpacity={0.8}
                  onPress={() => {
                    onDeleteTrip(initialTrip.id);
                    onClose();
                  }}
                >
                  <X size={16} color="#EF4444" style={{ marginRight: 6 }} />
                  <Text style={styles.deleteBtnText}>Delete Trip</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 23, 44, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
  },
  form: {
    paddingTop: 18,
    paddingBottom: 24,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  transportRow: {
    flexDirection: 'row',
    gap: 8,
  },
  transportChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
  },
  transportChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  transportChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  transportChipTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  actionButtonsCol: {
    marginTop: 8,
    gap: 10,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    height: 50,
    borderRadius: 14,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
});
