// MARGAM - Brand Header Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MargamLogo } from './MargamLogo';
import { COLORS, SPACING } from '../../constants/theme';
import { ShieldCheck } from 'lucide-react-native';

interface MargamBrandHeaderProps {
  showTagline?: boolean;
  rightAction?: React.ReactNode;
}

export const MargamBrandHeader: React.FC<MargamBrandHeaderProps> = ({
  showTagline = true,
  rightAction,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <MargamLogo size={36} showGlow={false} />
        <View style={styles.titleContainer}>
          <Text style={styles.brandName}>MARGAM</Text>
          {showTagline && (
            <Text style={styles.tagline}>YOUR MATCH. YOUR MARGAM.</Text>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        {rightAction ? (
          rightAction
        ) : (
          <View style={styles.privacyShieldBadge}>
            <ShieldCheck size={14} color={COLORS.primary} />
            <Text style={styles.privacyShieldText}>Request-First</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    color: COLORS.textPrimary,
  },
  tagline: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyShieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(229, 139, 88, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 139, 88, 0.3)',
  },
  privacyShieldText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
});
