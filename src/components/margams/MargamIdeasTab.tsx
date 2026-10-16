import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  Sparkles,
  Heart,
  MessageSquare,
  Send,
  Plus,
} from 'lucide-react-native';
import { SAMPLE_MARGAM_IDEAS } from '../../services/margamService';
import { MargamIdeaPost } from '../../types';
import { THEME } from '../../constants/theme';

interface MargamIdeasTabProps {
  onRequestConnect: (idea: MargamIdeaPost) => void;
}

export const MargamIdeasTab: React.FC<MargamIdeasTabProps> = ({ onRequestConnect }) => {
  const [ideas, setIdeas] = useState<MargamIdeaPost[]>(SAMPLE_MARGAM_IDEAS);

  const handleToggleLike = (id: string) => {
    setIdeas((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isLiked: !item.isLiked,
              likesCount: item.isLiked ? item.likesCount - 1 : item.likesCount + 1,
            }
          : item
      )
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Banner */}
      <View style={styles.bannerCard}>
        <View style={styles.badgeRow}>
          <Sparkles size={14} color="#D97706" />
          <Text style={styles.badgeText}>Matrimonial Life Visions</Text>
        </View>
        <Text style={styles.bannerTitle}>Ideas & Life Discussions</Text>
        <Text style={styles.bannerSub}>
          Discover how others envision their future — from destination cafés to sustainable living — and connect organically.
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Shared Life Concepts ({ideas.length})</Text>

      {ideas.map((idea) => (
        <View key={idea.id} style={styles.ideaCard}>
          {/* Author Header */}
          <View style={styles.authorRow}>
            <Image source={{ uri: idea.authorPhotoUrl }} style={styles.authorAvatar} />
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{idea.authorName}</Text>
              <Text style={styles.authorZone}>{idea.authorZone} • {idea.createdAt}</Text>
            </View>
            <View style={styles.margamTag}>
              <Text style={styles.margamTagText}>{idea.emoji} {idea.margamName}</Text>
            </View>
          </View>

          {/* Title & Concept */}
          <Text style={styles.ideaTitle}>{idea.title}</Text>
          <Text style={styles.ideaConcept}>{idea.concept}</Text>

          {/* Card Footer: Likes, Comments & Connect Button */}
          <View style={styles.footerRow}>
            <View style={styles.socialCounts}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleToggleLike(idea.id)}
                activeOpacity={0.7}
              >
                <Heart
                  size={16}
                  color={idea.isLiked ? '#E11D48' : '#64748B'}
                  fill={idea.isLiked ? '#E11D48' : 'none'}
                />
                <Text style={[styles.socialText, idea.isLiked && { color: '#E11D48' }]}>
                  {idea.likesCount}
                </Text>
              </TouchableOpacity>

              <View style={[styles.socialBtn, { marginLeft: 12 }]}>
                <MessageSquare size={16} color="#64748B" />
                <Text style={styles.socialText}>{idea.commentsCount}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.connectBtn}
              activeOpacity={0.88}
              onPress={() => onRequestConnect(idea)}
            >
              <Send size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.connectBtnText}>Connect via Dream</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
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
    color: '#B45309',
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  ideaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  authorZone: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  margamTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  margamTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  ideaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 20,
  },
  ideaConcept: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  socialCounts: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  socialText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  connectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
