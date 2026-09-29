// MARGAM - Public Meeting Coordinator & Safe Venues (Section 13 & 14)
// Core Invariant: Strictly enforces public locations (Cafes, Malls, Parks). Never private residences.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { PublicVenue, MeetingProposal } from '../../types';
import { VERIFIED_PUBLIC_VENUES } from '../../constants/mockData';
import {
  Coffee,
  ShoppingBag,
  Hotel,
  Calendar,
  Clock,
  Navigation,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';

interface PublicMeetingCoordinatorProps {
  partnerName: string;
  onProposeMeeting: (proposal: Omit<MeetingProposal, 'id' | 'status'>) => void;
  existingProposal?: MeetingProposal;
  onAcceptProposal?: (proposalId: string) => void;
  onSuggestAlternative?: (proposalId: string) => void;
}

export const PublicMeetingCoordinator: React.FC<PublicMeetingCoordinatorProps> = ({
  partnerName,
  onProposeMeeting,
  existingProposal,
  onAcceptProposal,
  onSuggestAlternative,
}) => {
  const [selectedVenue, setSelectedVenue] = useState<PublicVenue>(VERIFIED_PUBLIC_VENUES[0]);
  const [selectedDate, setSelectedDate] = useState('This Saturday');
  const [selectedTime, setSelectedTime] = useState('5:30 PM');
  const [note, setNote] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredVenues = VERIFIED_PUBLIC_VENUES.filter((v) => {
    if (activeCategory === 'all') return true;
    return v.category === activeCategory;
  });

  const getVenueIcon = (category: string) => {
    switch (category) {
      case 'cafe':
        return <Coffee size={14} color={COLORS.primary} />;
      case 'mall':
        return <ShoppingBag size={14} color={COLORS.routeAmber} />;
      case 'hotel_lobby':
        return <Hotel size={14} color={COLORS.routeCyan} />;
      default:
        return <MapPin size={14} color={COLORS.textPrimary} />;
    }
  };

  const handleSendProposal = () => {
    onProposeMeeting({
      connectionId: 'conn_active_01',
      proposerId: 'user_sumod_01',
      date: selectedDate,
      time: selectedTime,
      venue: selectedVenue,
      detourMinutes: 5,
      note: note || `Looking forward to meeting at ${selectedVenue.name} for a comfortable public introduction.`,
    });
  };

  return (
    <View style={styles.container}>
      {/* Existing Proposal Display if Active */}
      {existingProposal && (
        <View style={styles.activeProposalCard}>
          <View style={styles.proposalHeader}>
            <Calendar size={15} color={COLORS.primary} />
            <Text style={styles.proposalTitle}>Proposed Public Meetup</Text>
          </View>

          <Text style={styles.proposalPartner}>
            With {partnerName}
          </Text>

          <View style={styles.proposalDetailsGrid}>
            <View style={styles.proposalDetailRow}>
              <Clock size={13} color={COLORS.routeCyan} />
              <Text style={styles.proposalDetailText}>
                {existingProposal.date} at {existingProposal.time}
              </Text>
            </View>

            <View style={styles.proposalDetailRow}>
              <MapPin size={13} color={COLORS.primary} />
              <Text style={styles.proposalDetailText}>
                {existingProposal.venue.name} ({existingProposal.venue.area})
              </Text>
            </View>

            <View style={styles.proposalDetailRow}>
              <Navigation size={13} color={COLORS.routeAmber} />
              <Text style={styles.proposalDetailText}>
                {existingProposal.detourMinutes} min detour from NH 544 route
              </Text>
            </View>
          </View>

          <Text style={styles.proposalNote}>"{existingProposal.note}"</Text>

          {existingProposal.status === 'proposed' && (
            <View style={styles.proposalActionsRow}>
              <TouchableOpacity
                style={styles.proposalAcceptBtn}
                onPress={() => onAcceptProposal && onAcceptProposal(existingProposal.id)}
              >
                <Check size={14} color="#0B0F14" strokeWidth={3} />
                <Text style={styles.proposalAcceptBtnText}>Accept Meetup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.proposalAltBtn}
                onPress={() => onSuggestAlternative && onSuggestAlternative(existingProposal.id)}
              >
                <Text style={styles.proposalAltBtnText}>Suggest Another Time/Place</Text>
              </TouchableOpacity>
            </View>
          )}

          {existingProposal.status === 'accepted' && (
            <View style={styles.confirmedBadge}>
              <Check size={14} color={COLORS.privacyAccepted} />
              <Text style={styles.confirmedBadgeText}>Meetup Confirmed at Public Venue</Text>
            </View>
          )}
        </View>
      )}

      {/* Public Meeting Safety Banner */}
      <View style={styles.safetyCallout}>
        <ShieldCheck size={16} color={COLORS.primary} />
        <View style={styles.safetyCalloutTextContainer}>
          <Text style={styles.safetyCalloutTitle}>Margam Public Safety Standard</Text>
          <Text style={styles.safetyCalloutBody}>
            For your first meeting, Margam exclusively supports verified public venues (cafes, malls, hotel lounges) where both people are completely comfortable. Private residences are never permitted.
          </Text>
        </View>
      </View>

      {/* Select Venue Category Filter */}
      <View style={styles.categoryFilterRow}>
        {['all', 'cafe', 'mall', 'hotel_lobby'].map((cat) => (
          <TouchableOpacity
            key={`cat_${cat}`}
            style={[
              styles.categoryChip,
              activeCategory === cat && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text
              style={[
                styles.categoryChipText,
                activeCategory === cat && styles.categoryChipTextActive,
              ]}
            >
              {cat === 'all'
                ? 'All Venues'
                : cat === 'hotel_lobby'
                ? 'Hotel Lounges'
                : `${cat.charAt(0).toUpperCase() + cat.slice(1)}s`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Venues List */}
      <Text style={styles.sectionHeader}>Verified Safe Venues Nearby</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.venuesScroll}
        contentContainerStyle={{ gap: SPACING.sm }}
      >
        {filteredVenues.map((v) => {
          const isSelected = selectedVenue.id === v.id;
          return (
            <TouchableOpacity
              key={v.id}
              style={[
                styles.venueCard,
                isSelected && styles.venueCardSelected,
              ]}
              onPress={() => setSelectedVenue(v)}
              activeOpacity={0.8}
            >
              <View style={styles.venueHeaderRow}>
                <View style={styles.venueIconCircle}>{getVenueIcon(v.category)}</View>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>Verified Public</Text>
                </View>
              </View>

              <Text style={styles.venueName} numberOfLines={2}>
                {v.name}
              </Text>
              <Text style={styles.venueArea}>
                {v.area}, {v.city}
              </Text>
              <Text style={styles.venueRating}>Rating: {v.rating} ★</Text>

              {isSelected && (
                <View style={styles.selectedPill}>
                  <Check size={11} color="#0B0F14" strokeWidth={3} />
                  <Text style={styles.selectedPillText}>Selected</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Schedule Picker */}
      <View style={styles.scheduleCard}>
        <Text style={styles.sectionHeader}>Schedule & Time</Text>
        <View style={styles.timeInputsRow}>
          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={() =>
              setSelectedDate(
                selectedDate === 'This Saturday' ? 'This Sunday' : 'This Saturday'
              )
            }
          >
            <Calendar size={13} color={COLORS.primary} />
            <Text style={styles.datePickerText}>{selectedDate}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={() =>
              setSelectedTime(
                selectedTime === '5:30 PM' ? '6:30 PM' : '5:30 PM'
              )
            }
          >
            <Clock size={13} color={COLORS.routeCyan} />
            <Text style={styles.datePickerText}>{selectedTime}</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.noteInput}
          placeholder="Optional note: e.g., 'Will be driving back from Kochi, happy to meet for coffee.'"
          placeholderTextColor={COLORS.textMuted}
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>

      {/* Propose Button */}
      <TouchableOpacity
        style={styles.proposeBtn}
        onPress={handleSendProposal}
        activeOpacity={0.85}
      >
        <Coffee size={16} color="#0B0F14" />
        <Text style={styles.proposeBtnText}>
          Propose Meetup at {selectedVenue.name.split(' ')[0]}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  activeProposalCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 8,
  },
  proposalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  proposalTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  proposalPartner: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  proposalDetailsGrid: {
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  proposalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  proposalDetailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  proposalNote: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
  },
  proposalActionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 4,
  },
  proposalAcceptBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  proposalAcceptBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B0F14',
  },
  proposalAltBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  proposalAltBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    padding: 8,
    borderRadius: RADIUS.sm,
  },
  confirmedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.privacyAccepted,
  },
  safetyCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: 'rgba(229, 139, 88, 0.08)',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(229, 139, 88, 0.25)',
  },
  safetyCalloutTextContainer: {
    flex: 1,
  },
  safetyCalloutTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  safetyCalloutBody: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  categoryFilterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  categoryChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(229, 139, 88, 0.15)',
  },
  categoryChipText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: COLORS.primary,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  venuesScroll: {
    paddingVertical: 4,
  },
  venueCard: {
    width: 170,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 4,
  },
  venueCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceLight,
  },
  venueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  venueIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.privacyAccepted,
  },
  venueName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  venueArea: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  venueRating: {
    fontSize: 10,
    color: COLORS.routeAmber,
    fontWeight: '700',
    marginTop: 2,
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  selectedPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0B0F14',
  },
  scheduleCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: SPACING.sm,
  },
  timeInputsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  datePickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  datePickerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  noteInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: SPACING.sm,
    color: COLORS.textPrimary,
    fontSize: 12,
    minHeight: 50,
  },
  proposeBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
  },
  proposeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0F14',
  },
});
