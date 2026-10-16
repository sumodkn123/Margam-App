import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  Users,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Coffee,
  Plane,
} from 'lucide-react-native';
import { SAMPLE_SHARED_PLANS } from '../../services/margamService';
import { MargamCollaborativePlan } from '../../types';

export const SharedPlansTab: React.FC = () => {
  const [plans, setPlans] = useState<MargamCollaborativePlan[]>(SAMPLE_SHARED_PLANS);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(SAMPLE_SHARED_PLANS[0].id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Intro Banner */}
      <View style={styles.bannerCard}>
        <View style={styles.badgeRow}>
          <Users size={14} color="#2563EB" />
          <Text style={styles.badgeText}>Collaborative Life Planning</Text>
        </View>
        <Text style={styles.bannerTitle}>Shared Margam Plans</Text>
        <Text style={styles.bannerSub}>
          When you connect on shared dreams, build ideas together before taking your next step towards marriage.
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Active Collaborative Spaces ({plans.length})</Text>

      {plans.map((plan) => {
        const isExpanded = expandedPlanId === plan.id;

        return (
          <View key={plan.id} style={styles.planCard}>
            <TouchableOpacity
              style={styles.planHeader}
              activeOpacity={0.8}
              onPress={() => setExpandedPlanId(isExpanded ? null : plan.id)}
            >
              <View style={styles.partnerAvatarWrap}>
                <Image source={{ uri: plan.partnerPhotoUrl }} style={styles.partnerAvatar} />
                <View style={styles.avatarTypeBadge}>
                  <Text style={{ fontSize: 10 }}>{plan.emoji}</Text>
                </View>
              </View>

              <View style={styles.planTitleCol}>
                <Text style={styles.planTitleText}>{plan.title}</Text>
                <Text style={styles.planSubtitleText}>{plan.subtitle}</Text>
                <Text style={styles.planTimeText}>Updated {plan.lastUpdatedAt}</Text>
              </View>

              <ChevronRight
                size={18}
                color="#64748B"
                style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.expandedContent}>
                {/* AI Overlap & Suggestion Box */}
                {plan.aiSuggestions.map((sug, i) => (
                  <View key={`sug-${i}`} style={styles.aiSuggestionBox}>
                    <Sparkles size={14} color="#7C3AED" style={{ marginTop: 2 }} />
                    <Text style={styles.aiSuggestionText}>{sug}</Text>
                  </View>
                ))}

                {/* Plan Sections */}
                {plan.sections.map((sec, idx) => (
                  <View key={`sec-${idx}`} style={styles.sectionItem}>
                    <Text style={styles.secTitle}>{sec.title}</Text>
                    <Text style={styles.secContent}>{sec.content}</Text>

                    {sec.userNote && (
                      <View style={styles.noteBubbleUser}>
                        <Text style={styles.noteAuthor}>You:</Text>
                        <Text style={styles.noteText}>{sec.userNote}</Text>
                      </View>
                    )}

                    {sec.partnerNote && (
                      <View style={styles.noteBubblePartner}>
                        <Text style={styles.noteAuthor}>{plan.partnerName}:</Text>
                        <Text style={styles.noteText}>{sec.partnerNote}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  bannerCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 17,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerAvatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  partnerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  avatarTypeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitleCol: {
    flex: 1,
  },
  planTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  planSubtitleText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  planTimeText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  expandedContent: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  aiSuggestionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 10,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  aiSuggestionText: {
    flex: 1,
    fontSize: 11,
    color: '#6D28D9',
    lineHeight: 16,
  },
  sectionItem: {
    marginBottom: 12,
  },
  secTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  secContent: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 6,
  },
  noteBubbleUser: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 8,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  noteBubblePartner: {
    backgroundColor: '#FFF1F2',
    borderRadius: 10,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F43F5E',
  },
  noteAuthor: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  noteText: {
    fontSize: 11,
    color: '#334155',
  },
});
