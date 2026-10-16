import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { MargamLogoNew } from '../components/brand/MargamLogoNew';
import {
  Bell,
  MoreVertical,
  Search,
  SlidersHorizontal,
  Star,
  CheckCircle,
  ChevronRight,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { ChatConversationScreen } from './ChatConversationScreen';
import { ConversationTipsModal } from '../components/chat/ConversationTipsModal';
import { IntroductionRequest } from '../types';

export interface ChatThreadItem {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  hasSprout?: boolean;
  statusColor: 'green' | 'amber' | 'gray';
  time: string;
  compatibility: number;
  area: string;
  profession: string;
  lastMessage: string;
  unreadCount?: number;
  category: 'connection' | 'request' | 'meeting' | 'archived';
}

const CHAT_THREADS: ChatThreadItem[] = [
  {
    id: 'thread-ananya',
    name: 'Ananya',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
    isVerified: true,
    statusColor: 'green',
    time: '9:12 PM',
    compatibility: 91,
    area: 'Kochi area',
    profession: 'Product Manager',
    lastMessage: 'That sounds great! I’d love to meet at the cafe this...',
    unreadCount: 2,
    category: 'connection',
  },
  {
    id: 'thread-riya',
    name: 'Riya',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&h=300&fit=crop&crop=faces',
    isVerified: false,
    hasSprout: true,
    statusColor: 'amber',
    time: '6:45 PM',
    compatibility: 88,
    area: 'Thrissur area',
    profession: 'Doctor (Pediatrician)',
    lastMessage: 'Yes, I enjoy travelling too. Which places have you...',
    unreadCount: 1,
    category: 'connection',
  },
  {
    id: 'thread-meera',
    name: 'Meera',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces',
    isVerified: true,
    statusColor: 'gray',
    time: '2:30 PM',
    compatibility: 85,
    area: 'Ernakulam area',
    profession: 'Architectural Consultant',
    lastMessage: 'Thank you for the introduction request. I’d like to...',
    category: 'connection',
  },
  {
    id: 'thread-sneha',
    name: 'Sneha',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
    isVerified: false,
    statusColor: 'green',
    time: '11:20 AM',
    compatibility: 82,
    area: 'Kochi area',
    profession: 'Chartered Accountant',
    lastMessage: 'Have you visited Munnar? It’s one of my favorite...',
    category: 'request',
  },
  {
    id: 'thread-priya',
    name: 'Priya',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=faces',
    isVerified: false,
    statusColor: 'gray',
    time: 'Yesterday',
    compatibility: 78,
    area: 'Calicut area',
    profession: 'Assistant Professor',
    lastMessage: 'I’ll check my schedule and let you know.',
    category: 'request',
  },
  {
    id: 'thread-nandana',
    name: 'Nandana',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&crop=faces',
    isVerified: false,
    statusColor: 'green',
    time: 'Yesterday',
    compatibility: 76,
    area: 'Thrissur area',
    profession: 'UI/UX Designer',
    lastMessage: 'Sure! Saturday evening works for me.',
    category: 'meeting',
  },
  {
    id: 'thread-kavya',
    name: 'Kavya',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces',
    isVerified: false,
    statusColor: 'green',
    time: '25 Sep',
    compatibility: 73,
    area: 'Kochi area',
    profession: 'Civil Engineer',
    lastMessage: 'Same here! I enjoy photography as well.',
    category: 'archived',
  },
];

interface ConnectionsHubScreenProps {
  connections?: IntroductionRequest[];
  onOpenPrivacy?: () => void;
  onOpenCandidateProfile?: (candidateOrId: any) => void;
  onConversationActiveChange?: (isActive: boolean) => void;
  initialConversationId?: string;
  initialRecipient?: {
    id: string;
    name: string;
    avatar: string;
    area?: string;
    profession?: string;
    compatibility?: number;
  };
  onBack?: () => void;
}

export const ConnectionsHubScreen: React.FC<ConnectionsHubScreenProps> = ({
  connections = [],
  onOpenPrivacy,
  onOpenCandidateProfile,
  onConversationActiveChange,
  initialConversationId,
  initialRecipient,
  onBack,
}) => {
  // Navigation: Active Conversation vs Chat List
  const [activeConversation, setActiveConversation] = useState<ChatThreadItem | null>(null);

  // Notify parent whether inside active conversation
  React.useEffect(() => {
    if (onConversationActiveChange) {
      onConversationActiveChange(!!activeConversation);
    }
    return () => {
      if (onConversationActiveChange) {
        onConversationActiveChange(false);
      }
    };
  }, [activeConversation, onConversationActiveChange]);

  // Filter Pill state
  const [activeFilterPill, setActiveFilterPill] = useState<'all' | 'connections' | 'requests' | 'meetings' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversationTipsVisible, setConversationTipsVisible] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Auto-open requested conversation if provided by router
  React.useEffect(() => {
    if (initialConversationId) {
      const match =
        CHAT_THREADS.find(
          (t) =>
            t.id === initialConversationId ||
            t.name.toLowerCase() === initialConversationId.toLowerCase() ||
            t.id.includes(initialConversationId.toLowerCase())
        );

      if (match) {
        setActiveConversation(match);
      } else if (initialRecipient) {
        setActiveConversation({
          id: initialRecipient.id,
          name: initialRecipient.name,
          avatar: initialRecipient.avatar,
          isVerified: true,
          statusColor: 'green',
          time: 'Just now',
          compatibility: initialRecipient.compatibility || 91,
          area: initialRecipient.area || 'Kochi area',
          profession: initialRecipient.profession || 'Professional',
          lastMessage: 'Connected! Say hello and start discovering Margams.',
          category: 'connection',
        });
      }
    }
  }, [initialConversationId, initialRecipient]);

  // Dynamically map incoming accepted connections to chat thread items
  const dynamicConnectionThreads: ChatThreadItem[] = React.useMemo(() => {
    return connections.map((conn) => {
      const name = conn.requesterRevealedData?.firstName || 'Partner';
      const avatar =
        conn.requesterRevealedData?.profilePhotoUrl ||
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces';
      const area = conn.requesterRevealedData?.area || conn.requesterRevealedData?.city || 'Kochi area';
      const profession = conn.requesterRevealedData?.profession || 'Professional';
      const threadId = `thread-${conn.id}`;

      return {
        id: threadId,
        name,
        avatar,
        isVerified: true,
        statusColor: 'green',
        time: conn.createdAt || 'Just now',
        compatibility: conn.compatibilityPercentage || 92,
        area,
        profession,
        lastMessage: conn.customMessage || 'Introduction accepted. Safe chat unlocked!',
        unreadCount: 1,
        category: 'connection',
      };
    });
  }, [connections]);

  const allThreads = React.useMemo(() => {
    const existingIds = new Set(dynamicConnectionThreads.map((t) => t.id));
    const combined = [...dynamicConnectionThreads];
    CHAT_THREADS.forEach((ct) => {
      if (!existingIds.has(ct.id)) {
        combined.push(ct);
      }
    });
    return combined;
  }, [dynamicConnectionThreads]);

  // If a conversation is actively open, render ChatConversationScreen
  if (activeConversation) {
    return (
      <ChatConversationScreen
        recipientId={activeConversation.id}
        recipientName={activeConversation.name}
        recipientAvatar={activeConversation.avatar}
        compatibilityPercentage={activeConversation.compatibility}
        area={activeConversation.area}
        profession={activeConversation.profession}
        onBack={() => {
          setActiveConversation(null);
          if (onConversationActiveChange) onConversationActiveChange(false);
          if (onBack) onBack();
        }}
        onOpenProfile={() => {
          if (onOpenCandidateProfile) {
            onOpenCandidateProfile(activeConversation.id);
          } else if (onOpenPrivacy) {
            onOpenPrivacy();
          }
        }}
      />
    );
  }

  // Filter threads based on search and active pill
  const filteredThreads = allThreads.filter((thread) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = thread.name.toLowerCase().includes(q);
      const matchMsg = thread.lastMessage.toLowerCase().includes(q);
      const matchArea = thread.area.toLowerCase().includes(q);
      if (!matchName && !matchMsg && !matchArea) return false;
    }

    // Unread toggle
    if (unreadOnly && !thread.unreadCount) return false;

    // Filter pill match
    if (activeFilterPill === 'connections') return thread.category === 'connection';
    if (activeFilterPill === 'requests') return thread.category === 'request';
    if (activeFilterPill === 'meetings') return thread.category === 'meeting';
    if (activeFilterPill === 'archived') return thread.category === 'archived';
    return true; // 'all'
  });

  return (
    <View style={styles.container}>
      {/* 1. Header Bar: Margam Logo, Brand Text, Bell with Dot, More Icon */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <MargamLogoNew size={44} />
          <View style={styles.brandTextCol}>
            <Text style={styles.brandTitle}>Margam</Text>
            <Text style={styles.brandTagline}>Your Match. Your Margam.</Text>
          </View>
        </View>

        <View style={styles.headerActionsRow}>
          <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.8}>
            <Bell size={20} color="#1E293B" />
            <View style={styles.unreadBadgeDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              Alert.alert('Chat Options', 'Manage conversations, safety rules & archived chats.', [
                { text: 'Unread Only', onPress: () => setUnreadOnly(!unreadOnly) },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }}
            activeOpacity={0.8}
          >
            <MoreVertical size={20} color="#1E293B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Page Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Chat</Text>
        </View>

        {/* 3. Filter Pills Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsScroll}
        >
          {/* All */}
          <TouchableOpacity
            style={[styles.filterPill, activeFilterPill === 'all' && styles.filterPillActive]}
            onPress={() => setActiveFilterPill('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterPillText, activeFilterPill === 'all' && styles.filterPillTextActive]}>
              All
            </Text>
          </TouchableOpacity>

          {/* Connections */}
          <TouchableOpacity
            style={[styles.filterPill, activeFilterPill === 'connections' && styles.filterPillActive]}
            onPress={() => setActiveFilterPill('connections')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterPillText, activeFilterPill === 'connections' && styles.filterPillTextActive]}>
              Connections
            </Text>
          </TouchableOpacity>

          {/* Requests (3) */}
          <TouchableOpacity
            style={[styles.filterPill, activeFilterPill === 'requests' && styles.filterPillActive]}
            onPress={() => setActiveFilterPill('requests')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterPillText, activeFilterPill === 'requests' && styles.filterPillTextActive]}>
              Requests
            </Text>
            <View style={styles.pillCountBadgeRed}>
              <Text style={styles.pillCountText}>3</Text>
            </View>
          </TouchableOpacity>

          {/* Meetings (1) */}
          <TouchableOpacity
            style={[styles.filterPill, activeFilterPill === 'meetings' && styles.filterPillActive]}
            onPress={() => setActiveFilterPill('meetings')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterPillText, activeFilterPill === 'meetings' && styles.filterPillTextActive]}>
              Meetings
            </Text>
            <View style={styles.pillCountBadgeRed}>
              <Text style={styles.pillCountText}>1</Text>
            </View>
          </TouchableOpacity>

          {/* Archived */}
          <TouchableOpacity
            style={[styles.filterPill, activeFilterPill === 'archived' && styles.filterPillActive]}
            onPress={() => setActiveFilterPill('archived')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterPillText, activeFilterPill === 'archived' && styles.filterPillTextActive]}>
              Archived
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 4. Search & Filter Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations, names or messages..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>

          <TouchableOpacity
            style={[styles.filterBtn, unreadOnly && { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}
            activeOpacity={0.8}
            onPress={() => setUnreadOnly(!unreadOnly)}
          >
            <SlidersHorizontal size={18} color={unreadOnly ? '#2563EB' : '#1E293B'} />
          </TouchableOpacity>
        </View>

        {/* 5. AI Match Assistant Banner (Beta) */}
        <TouchableOpacity
          style={styles.aiBanner}
          activeOpacity={0.9}
          onPress={() => setConversationTipsVisible(true)}
        >
          <View style={styles.aiStarCircle}>
            <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View style={styles.aiTextCol}>
            <View style={styles.aiHeadingRow}>
              <Text style={styles.aiHeading}>AI Match Assistant</Text>
              <View style={styles.betaBadge}>
                <Text style={styles.betaText}>BETA</Text>
              </View>
            </View>
            <Text style={styles.aiSubtext}>
              Get conversation tips, icebreakers and meeting suggestions.
            </Text>
          </View>
          <ChevronRight size={16} color="#64748B" />
        </TouchableOpacity>

        {/* 6. Chat Conversations List */}
        <View style={styles.listContainer}>
          {filteredThreads.map((item) => {
            let dotColor = '#10B981'; // green
            if (item.statusColor === 'amber') dotColor = '#F59E0B';
            else if (item.statusColor === 'gray') dotColor = '#94A3B8';

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.chatItem}
                activeOpacity={0.75}
                onPress={() => setActiveConversation(item)}
              >
                {/* Avatar with Status Dot */}
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
                </View>

                {/* Details */}
                <View style={styles.detailsCol}>
                  {/* Top Line: Name + Badges + Time */}
                  <View style={styles.nameLine}>
                    <View style={styles.nameRow}>
                      <Text style={styles.nameText}>{item.name}</Text>
                      {item.isVerified && (
                        <CheckCircle size={14} color="#059669" fill="#059669" style={{ marginLeft: 4 }} />
                      )}
                      {item.hasSprout && (
                        <Text style={{ fontSize: 13, marginLeft: 4 }}>🌱</Text>
                      )}
                    </View>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>

                  {/* Compatibility & Area */}
                  <Text style={styles.metaText}>
                    {item.compatibility}% match • {item.area}
                  </Text>

                  {/* Last Message Snippet */}
                  <Text style={styles.snippetText} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                </View>

                {/* Right Column: Unread Counter + Chevron */}
                <View style={styles.rightCol}>
                  {item.unreadCount ? (
                    <View style={styles.unreadCircle}>
                      <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
                    </View>
                  ) : null}
                  <ChevronRight size={16} color="#CBD5E1" style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* AI Conversation Tips & Icebreakers Modal */}
      <ConversationTipsModal
        visible={conversationTipsVisible}
        onClose={() => setConversationTipsVisible(false)}
        onSelectIcebreaker={(starter) => {
          setConversationTipsVisible(false);
          // Open Ananya conversation and paste starter
          setActiveConversation(CHAT_THREADS[0]);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 4,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTextCol: {
    marginLeft: 10,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  brandTagline: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 110,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  filterPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  pillCountBadgeRed: {
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  pillCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiStarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  aiTextCol: {
    flex: 1,
  },
  aiHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  aiHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  betaBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  betaText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  aiSubtext: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  detailsCol: {
    flex: 1,
    marginRight: 8,
  },
  nameLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 3,
  },
  snippetText: {
    fontSize: 12,
    color: '#475569',
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadCircle: {
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
