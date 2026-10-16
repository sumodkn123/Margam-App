// MARGAM — Full-Page Notifications Screen
// Matches Screen 1 in reference image:
// - Back button, "Notifications" title, More menu
// - Category filter pills: All, Requests (3), Messages (2), Updates
// - Section 1: New Requests (3) with Accept & View buttons
// - Section 2: Request Updates with Start Chat, View Profile, Declined
// - Section 3: Messages (2) with unread indicator and preview
// - Section 4: Profile Views with eye badges

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  MoreVertical,
  Heart,
  CheckCircle2,
  Clock,
  X,
  Eye,
  ChevronRight,
  MessageCircle,
  Sparkles,
} from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import {
  NotificationItem,
  useNotifications,
} from '../services/notificationService';

interface NotificationsScreenProps {
  onBack: () => void;
  onOpenDetail: (item: NotificationItem) => void;
  onAcceptRequest: (item: NotificationItem) => void;
  onViewCandidateProfile: (item: NotificationItem, requestStatus?: 'pending' | 'accepted' | 'declined') => void;
  onOpenChat: (item?: NotificationItem) => void;
}

type FilterTab = 'all' | 'requests' | 'messages' | 'updates';

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  onOpenDetail,
  onAcceptRequest,
  onViewCandidateProfile,
  onOpenChat,
}) => {
  const {
    notifications,
    unreadRequestsCount,
    unreadMessagesCount,
    markAsRead,
    markAllAsRead,
    acceptRequest,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Group notifications into the 4 design sections
  const newRequests = notifications.filter((n) => n.category === 'request');
  const requestUpdates = notifications.filter((n) => n.category === 'update');
  const messagesList = notifications.filter((n) => n.category === 'message');
  const profileViews = notifications.filter((n) => n.category === 'view');

  const handleAccept = (item: NotificationItem) => {
    acceptRequest(item.id);
    onAcceptRequest(item);
  };

  const handleItemPress = (item: NotificationItem) => {
    markAsRead(item.id);
    if (item.category === 'request') {
      onOpenDetail(item);
    } else if (item.category === 'message') {
      onOpenChat(item);
    } else if (item.category === 'update') {
      if (item.requestStatus === 'accepted') {
        onOpenChat(item);
      } else {
        onViewCandidateProfile(item);
      }
    } else if (item.category === 'view') {
      onViewCandidateProfile(item);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => setShowMoreMenu(!showMoreMenu)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreVertical size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* MORE MENU DROPDOWN */}
      {showMoreMenu && (
        <View style={styles.moreDropdown}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              markAllAsRead();
              setShowMoreMenu(false);
            }}
          >
            <CheckCircle2 size={16} color="#2563EB" style={{ marginRight: 8 }} />
            <Text style={styles.dropdownText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CATEGORY FILTER PILLS */}
      <View style={styles.filterPillsContainer}>
        {/* All */}
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
          onPress={() => setActiveFilter('all')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterPillText,
              activeFilter === 'all' && styles.filterPillTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* Requests with badge */}
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'requests' && styles.filterPillActive]}
          onPress={() => setActiveFilter('requests')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterPillText,
              activeFilter === 'requests' && styles.filterPillTextActive,
            ]}
          >
            Requests
          </Text>
          {unreadRequestsCount > 0 && (
            <View style={styles.pillBadgeRed}>
              <Text style={styles.pillBadgeText}>{unreadRequestsCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Messages with badge */}
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'messages' && styles.filterPillActive]}
          onPress={() => setActiveFilter('messages')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterPillText,
              activeFilter === 'messages' && styles.filterPillTextActive,
            ]}
          >
            Messages
          </Text>
          {unreadMessagesCount > 0 && (
            <View style={styles.pillBadgeRed}>
              <Text style={styles.pillBadgeText}>{unreadMessagesCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Updates */}
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'updates' && styles.filterPillActive]}
          onPress={() => setActiveFilter('updates')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterPillText,
              activeFilter === 'updates' && styles.filterPillTextActive,
            ]}
          >
            Updates
          </Text>
        </TouchableOpacity>
      </View>

      {/* SCROLLABLE NOTIFICATION LIST */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================================================== */}
        {/* SECTION 1: NEW REQUESTS                              */}
        {/* ==================================================== */}
        {(activeFilter === 'all' || activeFilter === 'requests') && newRequests.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>New Requests</Text>
                <View style={styles.sectionTitleBadge}>
                  <Text style={styles.sectionTitleBadgeText}>{newRequests.length}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setActiveFilter('requests')}
                style={styles.viewAllRow}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={14} color="#7C3AED" />
              </TouchableOpacity>
            </View>

            {newRequests.map((item) => (
              <View key={item.id} style={styles.requestItemCard}>
                {/* Avatar with Heart Badge */}
                <TouchableOpacity
                  style={styles.avatarWrapper}
                  onPress={() => onOpenDetail(item)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: item.senderAvatar }} style={styles.avatarImg} />
                  <View style={styles.avatarBadgePink}>
                    <Heart size={11} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                {/* Details Column */}
                <TouchableOpacity
                  style={styles.cardContentCol}
                  onPress={() => onOpenDetail(item)}
                  activeOpacity={0.85}
                >
                  <View style={styles.nameRow}>
                    <Text style={styles.senderNameText}>
                      {item.senderName}, {item.senderAge}
                    </Text>
                    {item.senderVerified && (
                      <CheckCircle2 size={14} color="#2563EB" fill="#2563EB" style={{ marginLeft: 4 }} />
                    )}
                  </View>
                  <Text style={styles.requestSubtext}>{item.message}</Text>
                  <Text style={styles.timeAgoText}>{item.time}</Text>
                </TouchableOpacity>

                {/* Action Buttons: Accept & View */}
                <View style={styles.actionBtnsCol}>
                  {item.requestStatus === 'accepted' ? (
                    <View style={styles.acceptedTag}>
                      <Text style={styles.acceptedTagText}>Accepted ✓</Text>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => handleAccept(item)}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.acceptBtnText}>Accept</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() => onOpenDetail(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.viewBtnText}>View</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ==================================================== */}
        {/* SECTION 2: REQUEST UPDATES                           */}
        {/* ==================================================== */}
        {(activeFilter === 'all' || activeFilter === 'updates') && requestUpdates.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Request Updates</Text>
              <TouchableOpacity
                onPress={() => setActiveFilter('updates')}
                style={styles.viewAllRow}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={14} color="#7C3AED" />
              </TouchableOpacity>
            </View>

            {requestUpdates.map((item) => (
              <View key={item.id} style={styles.requestItemCard}>
                {/* Avatar with Status Badge */}
                <TouchableOpacity
                  style={styles.avatarWrapper}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: item.senderAvatar }} style={styles.avatarImg} />
                  {item.statusBadgeIcon === 'check' && (
                    <View style={[styles.avatarBadgeCircle, { backgroundColor: '#10B981' }]}>
                      <CheckCircle2 size={12} color="#FFFFFF" />
                    </View>
                  )}
                  {item.statusBadgeIcon === 'clock' && (
                    <View style={[styles.avatarBadgeCircle, { backgroundColor: '#F59E0B' }]}>
                      <Clock size={11} color="#FFFFFF" />
                    </View>
                  )}
                  {item.statusBadgeIcon === 'cross' && (
                    <View style={[styles.avatarBadgeCircle, { backgroundColor: '#EF4444' }]}>
                      <X size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>

                {/* Info */}
                <TouchableOpacity
                  style={styles.cardContentCol}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.85}
                >
                  <View style={styles.nameRow}>
                    <Text style={styles.senderNameText}>
                      {item.senderName}, {item.senderAge}
                    </Text>
                    {item.senderVerified && (
                      <CheckCircle2 size={14} color="#2563EB" fill="#2563EB" style={{ marginLeft: 4 }} />
                    )}
                  </View>
                  <Text style={styles.requestSubtext}>{item.message}</Text>
                  <Text style={styles.timeAgoText}>{item.time}</Text>
                </TouchableOpacity>

                {/* Right Action Button */}
                <View style={styles.actionBtnsCol}>
                  {item.requestStatus === 'accepted' ? (
                    <TouchableOpacity
                      style={styles.startChatBtn}
                      onPress={() => onOpenChat(item)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.startChatBtnText}>Start Chat</Text>
                    </TouchableOpacity>
                  ) : item.statusBadgeIcon === 'clock' ? (
                    <TouchableOpacity
                      style={styles.viewProfileOutlineBtn}
                      onPress={() => onViewCandidateProfile(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.viewProfileOutlineBtnText}>View Profile</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ==================================================== */}
        {/* SECTION 3: MESSAGES                                  */}
        {/* ==================================================== */}
        {(activeFilter === 'all' || activeFilter === 'messages') && messagesList.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Messages</Text>
                <View style={styles.sectionTitleBadge}>
                  <Text style={styles.sectionTitleBadgeText}>{messagesList.length}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setActiveFilter('messages')}
                style={styles.viewAllRow}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={14} color="#7C3AED" />
              </TouchableOpacity>
            </View>

            {messagesList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.messageItemCard}
                onPress={() => onOpenChat(item)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: item.senderAvatar }} style={styles.avatarImg} />

                <View style={styles.messageContentCol}>
                  <Text style={styles.senderNameText}>{item.senderName}</Text>
                  <Text style={styles.messageTitleLabel}>Sent you a message</Text>
                  <Text style={styles.messagePreviewText} numberOfLines={1}>
                    {item.message}
                  </Text>
                  <Text style={styles.timeAgoText}>{item.time}</Text>
                </View>

                <View style={styles.messageRightActions}>
                  {!item.isRead && <View style={styles.unreadBlueDot} />}
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ==================================================== */}
        {/* SECTION 4: PROFILE VIEWS                             */}
        {/* ==================================================== */}
        {(activeFilter === 'all' || activeFilter === 'updates') && profileViews.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Profile Views</Text>
              <TouchableOpacity style={styles.viewAllRow}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={14} color="#7C3AED" />
              </TouchableOpacity>
            </View>

            {profileViews.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.profileViewItemCard}
                onPress={() => onViewCandidateProfile(item)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: item.senderAvatar }} style={styles.avatarImg} />

                <View style={styles.cardContentCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.senderNameText}>
                      {item.senderName}, {item.senderAge}
                    </Text>
                    {item.senderVerified && (
                      <CheckCircle2 size={14} color="#2563EB" fill="#2563EB" style={{ marginLeft: 4 }} />
                    )}
                  </View>
                  <Text style={styles.requestSubtext}>{item.message}</Text>
                  <Text style={styles.timeAgoText}>{item.time}</Text>
                </View>

                <View style={styles.eyeIconWrap}>
                  <Eye size={17} color="#2563EB" />
                  <ChevronRight size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    backgroundColor: '#FFFFFF',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  moreDropdown: {
    position: 'absolute',
    top: 55,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 50,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  filterPillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 5,
  },
  filterPillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pillBadgeRed: {
    backgroundColor: '#E11D48',
    width: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionTitleBadge: {
    backgroundColor: '#E11D48',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#7C3AED',
  },
  requestItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
    width: 52,
    height: 52,
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F5F9',
  },
  avatarBadgePink: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarBadgeCircle: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardContentCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderNameText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  requestSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  timeAgoText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  actionBtnsCol: {
    gap: 6,
    alignItems: 'flex-end',
  },
  acceptBtn: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 14,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  viewBtn: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  acceptedTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  acceptedTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  startChatBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  startChatBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  viewProfileOutlineBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  viewProfileOutlineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  messageItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 12,
  },
  messageContentCol: {
    flex: 1,
  },
  messageTitleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginTop: 1,
  },
  messagePreviewText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  messageRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadBlueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  profileViewItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 12,
  },
  eyeIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
