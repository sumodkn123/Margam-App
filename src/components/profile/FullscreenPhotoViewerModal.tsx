import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { X, ChevronRight, Lock, Heart, CheckCircle2 } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { ProfilePhotoItem } from '../../types';

const { width, height } = Dimensions.get('window');

interface FullscreenPhotoViewerModalProps {
  visible: boolean;
  photos: ProfilePhotoItem[];
  initialIndex?: number;
  userName: string;
  isVerified?: boolean;
  compatibilityPercentage?: number;
  onClose: () => void;
  onRequestIntroduction: () => void;
}

export const FullscreenPhotoViewerModal: React.FC<FullscreenPhotoViewerModalProps> = ({
  visible,
  photos,
  initialIndex = 0,
  userName,
  isVerified,
  compatibilityPercentage,
  onClose,
  onRequestIntroduction,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const currentPhoto = photos[activeIndex] || photos[0];
  const isLocked = currentPhoto?.visibility === 'connections_only' || currentPhoto?.visibility === 'request_only';

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeContainer}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{userName}</Text>
                {isVerified && (
                  <CheckCircle2 size={16} color="#3B82F6" fill="#3B82F6" style={{ marginLeft: 6 }} />
                )}
              </View>
              <Text style={styles.counterText}>
                {activeIndex + 1} of {photos.length}
              </Text>
            </View>

            {compatibilityPercentage && (
              <View style={styles.compatPill}>
                <Heart size={12} color="#EC4899" fill="#EC4899" style={{ marginRight: 4 }} />
                <Text style={styles.compatText}>{compatibilityPercentage}%</Text>
              </View>
            )}
          </View>

          {/* Main Photo Area */}
          <View style={styles.photoContainer}>
            {isLocked ? (
              <View style={styles.lockedContainer}>
                <View style={styles.lockCircle}>
                  <Lock size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.lockedTitle}>Visible after connection</Text>
                <Text style={styles.lockedDesc}>
                  {userName} keeps additional personal photos private until an introduction is mutually accepted.
                </Text>
                <TouchableOpacity
                  style={styles.unlockBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    onClose();
                    onRequestIntroduction();
                  }}
                >
                  <Text style={styles.unlockBtnText}>Connect to unlock</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Image
                source={{ uri: currentPhoto?.url }}
                style={styles.mainImage}
                resizeMode="contain"
              />
            )}

            {/* Left & Right Chevron Nav */}
            {photos.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.navArrow, styles.navArrowLeft]}
                  onPress={handlePrev}
                  activeOpacity={0.7}
                >
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M15 18l-6-6 6-6"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navArrow, styles.navArrowRight]}
                  onPress={handleNext}
                  activeOpacity={0.7}
                >
                  <ChevronRight size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Caption & Thumbnail Strip */}
          <View style={styles.bottomSection}>
            {currentPhoto?.caption && !isLocked && (
              <Text style={styles.captionText}>{currentPhoto.caption}</Text>
            )}

            {/* Thumbnail dots/pills */}
            <View style={styles.thumbnailsRow}>
              {photos.map((p, idx) => {
                const lockedThumb = p.visibility === 'connections_only' || p.visibility === 'request_only';
                const isActive = idx === activeIndex;
                return (
                  <TouchableOpacity
                    key={p.id || idx}
                    style={[styles.thumbnailWrap, isActive && styles.thumbnailWrapActive]}
                    onPress={() => setActiveIndex(idx)}
                    activeOpacity={0.8}
                  >
                    {lockedThumb ? (
                      <View style={styles.lockedThumb}>
                        <Lock size={12} color="#94A3B8" />
                      </View>
                    ) : (
                      <Image source={{ uri: p.url }} style={styles.thumbImage} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 24 : 10,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  counterText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  compatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compatText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  photoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: height * 0.65,
  },
  lockedContainer: {
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  lockCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  lockedDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  unlockBtn: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  unlockBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navArrow: {
    position: 'absolute',
    top: '45%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowLeft: {
    left: 12,
  },
  navArrowRight: {
    right: 12,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  captionText: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  thumbnailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thumbnailWrap: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailWrapActive: {
    borderColor: '#EC4899',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  lockedThumb: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
