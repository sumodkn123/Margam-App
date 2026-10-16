import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Phone, Video, Mic, MicOff, Volume2, ShieldCheck, X } from 'lucide-react-native';

interface SafeCallModalProps {
  visible: boolean;
  type: 'voice' | 'video';
  recipientName: string;
  recipientAvatar: string;
  onEndCall: () => void;
}

export const SafeCallModal: React.FC<SafeCallModalProps> = ({
  visible,
  type,
  recipientName,
  recipientAvatar,
  onEndCall,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (visible) {
      setCallDuration(0);
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visible]);

  if (!visible) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <Modal
      transparent={false}
      animationType="slide"
      visible={visible}
      onRequestClose={onEndCall}
    >
      <View style={styles.container}>
        {/* Background / Video Preview Layer */}
        {type === 'video' ? (
          <Image
            source={{ uri: recipientAvatar }}
            style={StyleSheet.absoluteFill as any}
            blurRadius={10}
          />
        ) : null}

        <View style={styles.contentOverlay}>
          {/* Top Privacy Guarantee Notice */}
          <View style={styles.privacyBadge}>
            <ShieldCheck size={14} color="#34D399" style={{ marginRight: 6 }} />
            <Text style={styles.privacyBadgeText}>
              Margam Encrypted In-App {type === 'voice' ? 'Voice' : 'Video'} Call
            </Text>
          </View>
          <Text style={styles.privacySub}>Phone number & personal contacts stay 100% private</Text>

          {/* Caller Profile */}
          <View style={styles.callerContainer}>
            <Image source={{ uri: recipientAvatar }} style={styles.callerAvatar} />
            <Text style={styles.callerName}>{recipientName}</Text>
            <Text style={styles.callTimer}>
              {callDuration === 0 ? 'Connecting...' : formatDuration(callDuration)}
            </Text>
          </View>

          {/* Controls Bar */}
          <View style={styles.controlsBar}>
            {/* Mute Button */}
            <TouchableOpacity
              style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
              onPress={() => setIsMuted(!isMuted)}
              activeOpacity={0.8}
            >
              {isMuted ? <MicOff size={22} color="#EF4444" /> : <Mic size={22} color="#FFFFFF" />}
            </TouchableOpacity>

            {/* Speaker Button */}
            <TouchableOpacity
              style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
              onPress={() => setIsSpeaker(!isSpeaker)}
              activeOpacity={0.8}
            >
              <Volume2 size={22} color={isSpeaker ? '#38BDF8' : '#FFFFFF'} />
            </TouchableOpacity>

            {/* End Call Button */}
            <TouchableOpacity
              style={styles.endCallBtn}
              onPress={onEndCall}
              activeOpacity={0.85}
            >
              <Phone size={24} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contentOverlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 48,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  privacyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
  },
  privacySub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  callerContainer: {
    alignItems: 'center',
  },
  callerAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 18,
  },
  callerName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  callTimer: {
    fontSize: 16,
    color: '#38BDF8',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  controlBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  endCallBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
