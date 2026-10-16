// MARGAM — Universal Red Love Action Button
// Styled in vibrant matrimonial scarlet red with 3D tactile depth,
// specular highlight, and integrated Love Heart icons.

import React, { useRef } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
  StyleProp,
} from 'react-native';
import { Heart, ArrowRight } from 'lucide-react-native';

export interface MargamButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  showHeart?: boolean;
  heartPosition?: 'left' | 'right';
  arrowRight?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const MargamButton: React.FC<MargamButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  showHeart = true,
  heartPosition = 'left',
  arrowRight = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const depressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(depressAnim, { toValue: 2, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
      Animated.spring(depressAnim, { toValue: 0, friction: 4, tension: 50, useNativeDriver: true }),
    ]).start();
  };

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGlass = variant === 'glass';

  const heartIconSize = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }, { translateY: depressAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.baseButton,
          size === 'sm' && styles.sizeSm,
          size === 'md' && styles.sizeMd,
          size === 'lg' && styles.sizeLg,
          isPrimary && styles.primaryButton,
          isOutline && styles.outlineButton,
          isGlass && styles.glassButton,
          disabled && styles.disabledButton,
          style,
        ]}
      >
        {/* Specular Highlight Arc for 3D Luster */}
        {isPrimary && !disabled && <View style={styles.specularHighlight} />}

        {loading ? (
          <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#EF4444'} size="small" />
        ) : (
          <View style={styles.contentRow}>
            {/* Custom Icon or Left Love Heart */}
            {icon ? (
              <View style={styles.iconMargin}>{icon}</View>
            ) : showHeart && heartPosition === 'left' ? (
              <Heart
                size={heartIconSize}
                color={isPrimary ? '#FFFFFF' : '#EF4444'}
                fill={isPrimary ? '#FFFFFF' : '#EF4444'}
                style={styles.heartLeft}
              />
            ) : null}

            <Text
              style={[
                styles.baseText,
                size === 'sm' && styles.textSm,
                size === 'md' && styles.textMd,
                size === 'lg' && styles.textLg,
                isPrimary && styles.primaryText,
                isOutline && styles.outlineText,
                isGlass && styles.glassText,
                disabled && styles.disabledText,
                textStyle,
              ]}
            >
              {title}
            </Text>

            {/* Right Love Heart */}
            {showHeart && heartPosition === 'right' && !arrowRight && (
              <Heart
                size={heartIconSize}
                color={isPrimary ? '#FFFFFF' : '#EF4444'}
                fill={isPrimary ? '#FFFFFF' : '#EF4444'}
                style={styles.heartRight}
              />
            )}

            {/* Right Chevron / Arrow */}
            {arrowRight && (
              <ArrowRight
                size={heartIconSize + 1}
                color={isPrimary ? '#FFFFFF' : '#EF4444'}
                strokeWidth={2.4}
                style={styles.arrowRight}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  sizeMd: {
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 26,
  },
  sizeLg: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  primaryButton: {
    backgroundColor: '#E11D48', // Kerala Sunset Rose Primary
    borderWidth: 1,
    borderColor: '#FB7185',
    // 3D Shadow depth
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 6,
  },
  outlineButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  glassButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  disabledButton: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  specularHighlight: {
    position: 'absolute',
    top: 1,
    left: 12,
    right: 12,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 12.5,
  },
  textMd: {
    fontSize: 14.5,
  },
  textLg: {
    fontSize: 16,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#E11D48',
  },
  glassText: {
    color: '#DC2626',
  },
  disabledText: {
    color: '#94A3B8',
  },
  heartLeft: {
    marginRight: 7,
  },
  heartRight: {
    marginLeft: 7,
  },
  arrowRight: {
    marginLeft: 6,
  },
  iconMargin: {
    marginRight: 6,
  },
});
