import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {
  X,
  Crown,
  Check,
  Sparkles,
  Zap,
  Shield,
  Navigation,
  ChevronRight,
  Heart,
} from 'lucide-react-native';

interface PremiumPlansModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: string) => void;
}

interface PlanItem {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
  gradientColor: string;
}

const PLANS: PlanItem[] = [
  {
    id: 'gold',
    name: 'Margam Gold',
    price: '₹1,499',
    period: '/ 3 months',
    gradientColor: '#F59E0B',
    features: [
      'Unlimited Introduction Requests',
      'See who viewed your anonymous profile',
      'Advanced filters (Diet, Career, Horoscopes)',
      'Verified profile spotlight badge',
    ],
  },
  {
    id: 'platinum',
    name: 'Margam Platinum',
    badge: 'MOST POPULAR',
    price: '₹2,499',
    period: '/ 6 months',
    popular: true,
    gradientColor: '#8B5CF6',
    features: [
      'Everything in Gold tier',
      'Real-time Highway Route Corridor Matching (NH 544 & NH 66)',
      'Instant Public Safe Meetup Reservations',
      'Priority matching algorithm with 3x visibility',
      'Strict Zero-PII Anti-Triangulation guarantees',
    ],
  },
  {
    id: 'vip',
    name: 'Margam VIP Executive',
    badge: 'CONCIERGE',
    price: '₹4,999',
    period: '/ 12 months',
    gradientColor: '#EC4899',
    features: [
      'Everything in Platinum tier',
      'Dedicated Matrimonial Relationship Manager',
      'Family Background & Identity Verification Report',
      'Private offline introductions & venue curation',
      'Direct WhatsApp priority advisor access',
    ],
  },
];

export const PremiumPlansModal: React.FC<PremiumPlansModalProps> = ({
  visible,
  onClose,
  onSelectPlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('platinum');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Upgrade Successful! 🎉',
        'Welcome to Margam Platinum. Route corridor matching and priority discovery have been enabled for your account.',
        [{ text: 'Start Exploring', onPress: onClose }]
      );
      if (onSelectPlan) onSelectPlan(selectedPlan);
    }, 1200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.crownCircle}>
                <Crown size={20} color="#F59E0B" fill="#F59E0B" />
              </View>
              <View>
                <Text style={styles.title}>Margam Premium</Text>
                <Text style={styles.subtitle}>Supercharge your matrimonial discovery</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Feature Highlights Pills */}
            <View style={styles.highlightsRow}>
              <View style={styles.highlightPill}>
                <Navigation size={14} color="#2563EB" />
                <Text style={styles.highlightText}>Route Matching</Text>
              </View>
              <View style={styles.highlightPill}>
                <Shield size={14} color="#10B981" />
                <Text style={styles.highlightText}>100% Privacy</Text>
              </View>
              <View style={styles.highlightPill}>
                <Sparkles size={14} color="#8B5CF6" />
                <Text style={styles.highlightText}>3x More Matches</Text>
              </View>
            </View>

            {/* Plans List */}
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    isSelected && styles.planCardSelected,
                    plan.popular && styles.planCardPopular,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  {plan.badge && (
                    <View
                      style={[
                        styles.planBadge,
                        { backgroundColor: plan.popular ? '#8B5CF6' : '#EC4899' },
                      ]}
                    >
                      <Text style={styles.planBadgeText}>{plan.badge}</Text>
                    </View>
                  )}

                  <View style={styles.planHeader}>
                    <View style={styles.radioOuter}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.planName}>{plan.name}</Text>
                    </View>
                    <View style={styles.priceCol}>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                      <Text style={styles.planPeriod}>{plan.period}</Text>
                    </View>
                  </View>

                  <View style={styles.planFeaturesList}>
                    {plan.features.map((feat, idx) => (
                      <View key={idx} style={styles.featRow}>
                        <Check size={14} color="#10B981" style={{ marginRight: 6 }} />
                        <Text style={styles.featText}>{feat}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Bottom Action Button */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.upgradeBtn, isProcessing && { opacity: 0.7 }]}
              activeOpacity={0.85}
              onPress={handleSubscribe}
              disabled={isProcessing}
            >
              <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.upgradeBtnText}>
                {isProcessing ? 'Activating Premium...' : 'Upgrade Now 💖 • Risk Free'}
              </Text>
              {!isProcessing && <ChevronRight size={18} color="#FFFFFF" />}
            </TouchableOpacity>
            <Text style={styles.guaranteeText}>
              🔒 Secure payment with UPI, Cards, NetBanking. Cancel anytime.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crownCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
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
  highlightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  highlightPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  highlightText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#FAF5FF',
  },
  planCardPopular: {
    borderColor: '#8B5CF6',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  planBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },
  planName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  planPeriod: {
    fontSize: 11,
    color: '#64748B',
  },
  planFeaturesList: {
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featText: {
    fontSize: 12,
    color: '#475569',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  upgradeBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  guaranteeText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
  },
});
