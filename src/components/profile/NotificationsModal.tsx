import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  Bell,
  CheckCircle,
  Sparkles,
  MapPin,
  Clock,
  Heart,
  ChevronRight,
} from 'lucide-react-native';

import {
  NotificationItem,
  useNotifications,
} from '../../services/notificationService';

export type { NotificationItem };

export interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenItem?: (item: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
  onOpenItem,
}) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop tap to dismiss */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.bellIconCircle}>
                <Bell size={18} color="#2563EB" />
              </View>
              <Text style={styles.title}>Notifications</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.7} style={styles.markReadBtn}>
                <Text style={styles.markReadText}>Mark all read</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {notifications.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemCard, !item.isRead && styles.itemCardUnread]}
                activeOpacity={0.8}
                onPress={() => {
                  markAsRead(item.id);
                  if (onOpenItem) {
                    onOpenItem(item);
                  }
                }}
              >
                <View style={styles.iconCircle}>
                  {item.type === 'verification' && <CheckCircle size={18} color="#10B981" />}
                  {item.type === 'route' && <MapPin size={18} color="#2563EB" />}
                  {item.type === 'chat' && <Heart size={18} color="#EC4899" />}
                  {item.type === 'match' && <Sparkles size={18} color="#8B5CF6" />}
                </View>

                <View style={styles.contentCol}>
                  <View style={styles.itemTitleRow}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    {!item.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.itemMessage}>{item.message}</Text>
                  <View style={styles.timeRow}>
                    <Clock size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </View>

                <ChevronRight size={16} color="#CBD5E1" />
              </TouchableOpacity>
            ))}

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
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
    gap: 10,
  },
  bellIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  markReadBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  itemCardUnread: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCol: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 6,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  itemMessage: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
