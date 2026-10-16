import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Send,
  Star,
  Share2,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export interface ProfileMoreActionSheetProps {
  visible: boolean;
  isSaved: boolean;
  userName: string;
  onClose: () => void;
  onSendRequest?: () => void;
  onToggleSave: () => void;
  onShare: () => void;
  onReport: () => void;
  onBlock: () => void;
  onHide?: () => void;
  onNotInterested?: () => void;
  onManageNotifications?: () => void;
}

export const ProfileMoreActionSheet: React.FC<ProfileMoreActionSheetProps> = ({
  visible,
  isSaved,
  userName,
  onClose,
  onSendRequest,
  onToggleSave,
  onShare,
  onReport,
  onBlock,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetContainer}>
              {/* Drag Handle */}
              <View style={styles.dragHandle} />

              <Text style={styles.sheetTitle}>Options for {userName}</Text>

              {/* Main Actions List matching Screen 1 Reference */}
              <View style={styles.actionsList}>
                {/* 1. Send Request */}
                <TouchableOpacity
                  style={styles.actionRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();
                    if (onSendRequest) {
                      onSendRequest();
                    }
                  }}
                >
                  <View style={styles.iconSquare}>
                    <Svg width={40} height={40} style={StyleSheet.absoluteFill}>
                      <Defs>
                        <LinearGradient id="sendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <Stop offset="0%" stopColor="#FB7185" />
                          <Stop offset="100%" stopColor="#E11D48" />
                        </LinearGradient>
                      </Defs>
                      <Rect width="40" height="40" rx="12" fill="url(#sendGrad)" />
                    </Svg>
                    <Send size={18} color="#FFFFFF" strokeWidth={2.2} />
                  </View>

                  <View style={styles.actionTexts}>
                    <Text style={styles.actionTitle}>Send Request</Text>
                    <Text style={styles.actionSubtitle}>Express your interest with a personal message</Text>
                  </View>

                  <ChevronRight size={18} color="#94A3B8" />
                </TouchableOpacity>

                {/* 2. Save Profile */}
                <TouchableOpacity
                  style={styles.actionRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();
                    onToggleSave();
                  }}
                >
                  <View style={[styles.iconSquare, { backgroundColor: isSaved ? '#EC4899' : '#F59E0B' }]}>
                    <Star size={18} color="#FFFFFF" fill={isSaved ? '#FFFFFF' : 'none'} strokeWidth={2.2} />
                  </View>

                  <View style={styles.actionTexts}>
                    <Text style={styles.actionTitle}>
                      {isSaved ? 'Saved Profile' : 'Save Profile'}
                    </Text>
                    <Text style={styles.actionSubtitle}>
                      {isSaved ? 'In your saved profiles list' : 'Add to your saved profiles'}
                    </Text>
                  </View>

                  <ChevronRight size={18} color="#94A3B8" />
                </TouchableOpacity>

                {/* 3. Share Profile */}
                <TouchableOpacity
                  style={styles.actionRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();
                    onShare();
                  }}
                >
                  <View style={[styles.iconSquare, { backgroundColor: '#3B82F6' }]}>
                    <Share2 size={18} color="#FFFFFF" strokeWidth={2.2} />
                  </View>

                  <View style={styles.actionTexts}>
                    <Text style={styles.actionTitle}>Share Profile</Text>
                    <Text style={styles.actionSubtitle}>Share with a friend or family</Text>
                  </View>

                  <ChevronRight size={18} color="#94A3B8" />
                </TouchableOpacity>

                {/* 4. Report / Block */}
                <TouchableOpacity
                  style={[styles.actionRow, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();
                    onReport();
                  }}
                >
                  <View style={[styles.iconSquare, { backgroundColor: '#1E293B' }]}>
                    <ShieldAlert size={18} color="#FFFFFF" strokeWidth={2.2} />
                  </View>

                  <View style={styles.actionTexts}>
                    <Text style={styles.actionTitle}>Report / Block</Text>
                    <Text style={styles.actionSubtitle}>Not interested or inappropriate</Text>
                  </View>

                  <ChevronRight size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Cancel Pill Button */}
              <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18,
  },
  actionsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    gap: 14,
  },
  iconSquare: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  actionTexts: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
});
