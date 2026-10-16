import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  CheckCircle,
  MapPin,
  Briefcase,
  Lock,
  ChevronRight,
  Plus,
  Smile,
  Image as ImageIcon,
  Mic,
  Send,
  Calendar,
  Building2,
  CheckCheck,
  ShieldCheck,
  Heart,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { SafeCallModal } from '../components/chat/SafeCallModal';

export interface ChatConversationScreenProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  compatibilityPercentage: number;
  area: string;
  profession: string;
  onBack: () => void;
  onOpenProfile?: () => void;
}

interface MessageItem {
  id: string;
  sender: 'partner' | 'user';
  text?: string;
  photos?: { title: string; uri: string }[];
  isMeetRequest?: boolean;
  meetDetails?: {
    venue: string;
    dateTime: string;
    isAccepted?: boolean;
  };
  time: string;
  isRead?: boolean;
}

export const ChatConversationScreen: React.FC<ChatConversationScreenProps> = ({
  recipientId,
  recipientName = 'Ananya',
  recipientAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
  compatibilityPercentage = 91,
  area = 'Kochi area',
  profession = 'Product Manager',
  onBack,
  onOpenProfile,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCallModal, setActiveCallModal] = useState<'voice' | 'video' | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Initial messages customized to active recipient
  const [messages, setMessages] = useState<MessageItem[]>(() => {
    if (recipientName && recipientName !== 'Ananya') {
      return [
        {
          id: `msg-welcome-${recipientId}`,
          sender: 'partner',
          text: `Hi Sumod! 👋\nThank you for the introduction request. I’m happy to connect with you here on Margam.`,
          time: 'Just now',
        },
      ];
    }
    return [
      {
        id: 'msg-1',
        sender: 'partner',
        text: 'Hi Sumod! 👋\nThank you for the introduction request. I’m happy to connect here.',
        time: '9:12 AM',
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'Hi Ananya! Thank you for accepting. I saw we both love travelling. Which places do you enjoy the most? 🌅',
        time: '9:15 AM',
        isRead: true,
      },
      {
        id: 'msg-3',
        sender: 'partner',
        text: 'I love hill stations and beaches. Munnar, Vagamon and Varkala are some of my favorites. How about you?',
        time: '9:18 AM',
      },
      {
        id: 'msg-4',
        sender: 'user',
        photos: [
          {
            title: 'Munnar',
            uri: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=500&auto=format&fit=crop&q=80',
          },
          {
            title: 'Varkala',
            uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
          },
        ],
        text: 'Same here! These are my recent photos from last month. 😄',
        time: '9:20 AM',
        isRead: true,
      },
      {
        id: 'msg-5',
        sender: 'partner',
        text: 'Wow! Amazing photos! 😍\nI’m planning a trip to Munnar next month. Would be great to connect more and maybe plan a coffee meeting sometime.',
        time: '9:22 AM',
      },
      {
        id: 'msg-6',
        sender: 'partner',
        isMeetRequest: true,
        meetDetails: {
          venue: 'Cafe near Lulu Mall, Kochi',
          dateTime: 'Sat, 5 Oct • 5:00 PM',
          isAccepted: false,
        },
        time: '9:24 AM',
      },
      {
        id: 'msg-7',
        sender: 'user',
        text: 'That sounds great! I’ll book the table and share the details here. Looking forward! 😊',
        time: '9:26 AM',
        isRead: true,
      },
    ];
  });

  // Auto-scroll to bottom on mount or new message
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, [messages, isTyping]);

  const replyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Trigger realistic simulated typing response
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(true);
    }, 800);

    replyTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);

      // Contextual response based on keywords
      const lower = userText.toLowerCase();
      let replyText = 'That sounds wonderful! Looking forward to discovering more Margams together. Have a great day! ✨';
      if (lower.includes('coffee') || lower.includes('meet') || lower.includes('table') || lower.includes('weekend')) {
        replyText = 'Sounds perfect! Let’s definitely meet for coffee this weekend. Looking forward! ☕✨';
      } else if (lower.includes('travel') || lower.includes('trip') || lower.includes('munnar') || lower.includes('place')) {
        replyText = 'I love that! Kerala has so many breathtaking spots. We should definitely plan a road trip! 🌴🚗';
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        replyText = `Hi Sumod! So glad we connected. How is your day going? 😊`;
      }

      const replyMsg: MessageItem = {
        id: `msg-reply-${Date.now()}`,
        sender: 'partner',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 2600);
  };

  // Handle accepting the public meet request
  const handleAcceptMeetRequest = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.meetDetails
          ? {
              ...m,
              meetDetails: { ...m.meetDetails, isAccepted: true },
            }
          : m
      )
    );

    const confMsg: MessageItem = {
      id: `msg-conf-${Date.now()}`,
      sender: 'user',
      text: 'Public coffee meeting confirmed for Sat, 5 Oct at Cafe near Lulu Mall! ☕ See you there!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };
    setMessages((prev) => [...prev, confMsg]);
  };

  return (
    <View style={styles.container}>
      {/* 1. Chat Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>

        {/* Avatar + Match Info */}
        <TouchableOpacity
          style={styles.headerUserSection}
          onPress={onOpenProfile}
          activeOpacity={0.85}
        >
          <View style={styles.headerAvatarContainer}>
            <Image source={{ uri: recipientAvatar }} style={styles.headerAvatar} />
            <View style={styles.headerOnlineDot} />
          </View>

          <View style={styles.headerTextCol}>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerName}>{recipientName}</Text>
              <CheckCircle size={15} color="#10B981" fill="#10B981" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.headerMatchMeta}>
              {compatibilityPercentage}% match • {area}
            </Text>
            <View style={styles.onlineStatusRow}>
              <View style={styles.greenPulseDot} />
              <Text style={styles.onlineStatusText}>Online now</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Action Buttons: Voice Call, Video Call, Menu */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => setActiveCallModal('voice')}
            activeOpacity={0.8}
          >
            <Phone size={18} color="#1E293B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => setActiveCallModal('video')}
            activeOpacity={0.8}
          >
            <Video size={18} color="#1E293B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => {
              Alert.alert(
                `${recipientName}'s Profile`,
                'Verified connection on Margam.\n\n• Approximate Area: ' + area + '\n• Profession: ' + profession + '\n• Safety Level: Encrypted Connection',
                [{ text: 'Close', style: 'cancel' }]
              );
            }}
            activeOpacity={0.8}
          >
            <MoreVertical size={18} color="#1E293B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Pinned Profile Insights Strip */}
      <View style={styles.pinnedStripContainer}>
        <View style={styles.pinnedPill}>
          <View style={[styles.pinnedIconCircle, { backgroundColor: '#FCE7F3' }]}>
            <Text style={{ fontSize: 11 }}>💍</Text>
          </View>
          <View>
            <Text style={styles.pinnedPillVal}>{compatibilityPercentage}%</Text>
            <Text style={styles.pinnedPillSub}>Compatibility</Text>
          </View>
        </View>

        <View style={styles.pinnedDivider} />

        <View style={styles.pinnedPill}>
          <View style={[styles.pinnedIconCircle, { backgroundColor: '#E0F2FE' }]}>
            <MapPin size={13} color="#0284C7" />
          </View>
          <View>
            <Text style={styles.pinnedPillVal}>{area}</Text>
            <Text style={styles.pinnedPillSub}>Approximate location</Text>
          </View>
        </View>

        <View style={styles.pinnedDivider} />

        <TouchableOpacity
          style={[styles.pinnedPill, { flex: 1.1 }]}
          onPress={onOpenProfile}
          activeOpacity={0.7}
        >
          <View style={[styles.pinnedIconCircle, { backgroundColor: '#F1F5F9' }]}>
            <Briefcase size={13} color="#475569" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pinnedPillVal} numberOfLines={1}>{profession}</Text>
            <Text style={styles.pinnedPillSub}>Profession (shared)</Text>
          </View>
          <ChevronRight size={13} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* 3. Safety / Connection Status Banner */}
      <View style={styles.safetyBanner}>
        <View style={styles.safetyLockCircle}>
          <Lock size={15} color="#D97706" />
        </View>
        <View style={styles.safetyTextCol}>
          <Text style={styles.safetyTitle}>You’re connected on Margam</Text>
          <Text style={styles.safetySubtitle}>
            You can now chat and share more information at your comfort level.
          </Text>
        </View>
        <ChevronRight size={14} color="#94A3B8" />
      </View>

      {/* 4. Chat Messages Scroll Area with Watermark Wallpaper */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Date Separator */}
          <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>Today</Text>
          </View>

          {/* Messages */}
          {messages.map((msg) => {
            const isMe = msg.sender === 'user';

            if (msg.isMeetRequest && msg.meetDetails) {
              // Interactive Meet Request Card
              return (
                <View key={msg.id} style={styles.meetRequestRow}>
                  <Image source={{ uri: recipientAvatar }} style={styles.bubbleAvatar} />
                  <View style={styles.meetRequestCard}>
                    {/* Header */}
                    <View style={styles.meetCardHeader}>
                      <View style={styles.meetCardHeaderLeft}>
                        <View style={styles.meetIconBox}>
                          <Calendar size={16} color="#7C3AED" />
                        </View>
                        <Text style={styles.meetTitle}>Meet Request</Text>
                      </View>
                      <View style={styles.publicPlaceBadge}>
                        <Text style={styles.publicPlaceText}>PUBLIC PLACE</Text>
                      </View>
                    </View>

                    {/* Venue & Time Row with Map Thumbnail */}
                    <View style={styles.meetBodyRow}>
                      <View style={styles.meetDetailsCol}>
                        <View style={styles.meetDetailItem}>
                          <Building2 size={14} color="#64748B" style={{ marginRight: 6 }} />
                          <Text style={styles.meetDetailText}>{msg.meetDetails.venue}</Text>
                        </View>
                        <View style={styles.meetDetailItem}>
                          <Calendar size={14} color="#64748B" style={{ marginRight: 6 }} />
                          <Text style={styles.meetDetailText}>{msg.meetDetails.dateTime}</Text>
                        </View>
                      </View>

                      {/* Map Thumbnail */}
                      <View style={styles.meetMapThumb}>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: '#1E293B' }}>📍 Lulu Mall 🛍️</Text>
                        <ChevronRight size={12} color="#64748B" style={{ marginLeft: 2 }} />
                      </View>
                    </View>

                    {/* Action Buttons */}
                    {msg.meetDetails.isAccepted ? (
                      <View style={styles.meetAcceptedNotice}>
                        <ShieldCheck size={16} color="#10B981" style={{ marginRight: 6 }} />
                        <Text style={styles.meetAcceptedText}>Accepted & Confirmed on Calendar</Text>
                      </View>
                    ) : (
                      <View style={styles.meetActionsRow}>
                        <TouchableOpacity
                          style={styles.meetAcceptBtn}
                          activeOpacity={0.85}
                          onPress={() => handleAcceptMeetRequest(msg.id)}
                        >
                          <Heart size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 5 }} />
                          <Text style={styles.meetAcceptBtnText}>Accept 💖</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.meetRescheduleBtn}
                          activeOpacity={0.8}
                          onPress={() => {
                            Alert.alert('Suggest Time', 'You can suggest an alternative time in the message input below.');
                            setInputText('Would 6:30 PM on Saturday work better for you?');
                          }}
                        >
                          <Text style={styles.meetRescheduleBtnText}>Suggest Another Time</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <Text style={styles.meetTimestamp}>{msg.time}</Text>
                  </View>
                </View>
              );
            }

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isMe ? styles.messageRowMe : styles.messageRowPartner,
                ]}
              >
                {!isMe && (
                  <Image source={{ uri: recipientAvatar }} style={styles.bubbleAvatar} />
                )}

                <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubblePartner]}>
                  {/* Embedded Photos if present */}
                  {msg.photos && msg.photos.length > 0 && (
                    <View style={styles.photoGrid}>
                      {msg.photos.map((p, idx) => (
                        <View key={idx} style={styles.photoContainer}>
                          <Image source={{ uri: p.uri }} style={styles.embeddedPhoto} />
                          <View style={styles.photoCaptionTag}>
                            <Text style={styles.photoCaptionText}>{p.title}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Message Text */}
                  {msg.text && (
                    <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextPartner]}>
                      {msg.text}
                    </Text>
                  )}

                  {/* Bubble Timestamp & Status */}
                  <View style={styles.bubbleFooter}>
                    <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextPartner]}>
                      {msg.time}
                    </Text>
                    {isMe && (
                      <CheckCheck size={14} color={msg.isRead ? '#93C5FD' : '#BFDBFE'} style={{ marginLeft: 4 }} />
                    )}
                  </View>
                </View>
              </View>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageRow, styles.messageRowPartner]}>
              <Image source={{ uri: recipientAvatar }} style={styles.bubbleAvatar} />
              <View style={[styles.bubble, styles.bubblePartner, styles.typingBubble]}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, { opacity: 0.7 }]} />
                <View style={[styles.typingDot, { opacity: 0.4 }]} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* 5. Bottom Message Input Bar */}
        <View
          style={[
            styles.inputBarContainer,
            {
              paddingBottom: Platform.OS === 'ios' ? (isKeyboardVisible ? 10 : 34) : 14,
            },
          ]}
        >
          {/* Plus / Attachments Button */}
          <TouchableOpacity
            style={styles.attachBtn}
            activeOpacity={0.8}
            onPress={() => {
              Alert.alert(
                'Share with ' + recipientName,
                'Choose what you would like to share:',
                [
                  {
                    text: 'Share Travel Photos',
                    onPress: () => {
                      setInputText('Here are my favorite travel moments from Wayanad!');
                    },
                  },
                  {
                    text: 'Suggest Public Cafe',
                    onPress: () => {
                      setInputText('Would you like to meet at Starbucks Panampilly Nagar this weekend?');
                    },
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          >
            <Plus size={20} color="#64748B" />
          </TouchableOpacity>

          {/* Text Input Container */}
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              multiline={false}
            />

            {/* Inner action buttons */}
            <TouchableOpacity
              style={styles.inputInnerIcon}
              onPress={() => setInputText((prev) => prev + ' 😊')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Smile size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputInnerIcon}
              onPress={() => {
                setInputText('Sharing recent travel photos from Kerala backwaters! 📸');
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ImageIcon size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputInnerIcon}
              onPress={() => {
                Alert.alert('Voice Note', 'Hold to record private voice note for ' + recipientName);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Mic size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Send Button if text entered */}
          {inputText.trim() ? (
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSendMessage}
              activeOpacity={0.85}
            >
              <Send size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </KeyboardAvoidingView>

      {/* Private Voice / Video Call Modal */}
      {activeCallModal && (
        <SafeCallModal
          visible={!!activeCallModal}
          type={activeCallModal}
          recipientName={recipientName}
          recipientAvatar={recipientAvatar}
          onEndCall={() => setActiveCallModal(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8', // Subtle background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 6,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  headerUserSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTextCol: {
    flex: 1,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerMatchMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  onlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  onlineStatusText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinnedStripContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
    gap: 8,
  },
  pinnedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinnedIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinnedPillVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  pinnedPillSub: {
    fontSize: 9,
    color: '#64748B',
  },
  pinnedDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  safetyLockCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyTextCol: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  safetySubtitle: {
    fontSize: 11,
    color: '#B45309',
    lineHeight: 14,
  },
  chatScroll: {
    flex: 1,
  },
  chatScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  dateSeparatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
  },
  messageRowPartner: {
    justifyContent: 'flex-start',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  bubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  bubblePartner: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleMe: {
    backgroundColor: '#2563EB',
    borderTopRightRadius: 6,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  messageTextPartner: {
    color: '#0F172A',
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
  },
  timeTextPartner: {
    color: '#94A3B8',
  },
  timeTextMe: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  photoContainer: {
    width: 110,
    height: 80,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  embeddedPhoto: {
    width: '100%',
    height: '100%',
  },
  photoCaptionTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  photoCaptionText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  meetRequestRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  meetRequestCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  meetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  meetCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meetIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  meetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  publicPlaceBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  publicPlaceText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  meetBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  meetDetailsCol: {
    flex: 1,
    gap: 6,
  },
  meetDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetDetailText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  meetMapThumb: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  meetActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  meetAcceptBtn: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  meetAcceptBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  meetRescheduleBtn: {
    flex: 1.3,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  meetRescheduleBtnText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  meetAcceptedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
  },
  meetAcceptedText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '700',
  },
  meetTimestamp: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748B',
  },
  inputBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 42,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  inputInnerIcon: {
    padding: 4,
    marginLeft: 6,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
});
