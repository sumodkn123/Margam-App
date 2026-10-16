// MARGAM — Screen 3: Verify Your Number (OTP Verification)
// Exactly matches the reference design with editable phone number,
// 6-digit OTP code input boxes, live resend timer, red love Verify & Continue button,
// security assurance pill card, and Kerala houseboat scenic backdrop.

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { MargamButton } from '../../components/common/MargamButton';
import { ChevronLeft, Pencil, Lock, ShieldCheck } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MargamOtpScreenProps {
  phoneNumber?: string;
  onBack: () => void;
  onVerifySuccess: () => void;
}

export const MargamOtpScreen: React.FC<MargamOtpScreenProps> = ({
  phoneNumber = '+91 98765 43210',
  onBack,
  onVerifySuccess,
}) => {
  // 6-digit OTP state
  const [otp, setOtp] = useState<string[]>(['4', '8', '2', '', '', '']);
  const [activeInputIdx, setActiveInputIdx] = useState<number>(3);
  const [countdown, setCountdown] = useState<number>(28);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Hidden text input ref for reliable keyboard handling
  const hiddenInputRef = useRef<TextInput>(null);

  // Live Resend Timer Countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (val: string) => {
    // Keep only numbers up to 6 digits
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 6);
    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < cleaned.length; i++) {
      newOtp[i] = cleaned[i];
    }
    setOtp(newOtp);
    setActiveInputIdx(Math.min(5, cleaned.length));

    // Auto verify if 6 digits entered
    if (cleaned.length === 6) {
      handleVerify(newOtp);
    }
  };

  const handleVerify = (digitsToVerify: string[] = otp) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess();
    }, 600);
  };

  const handleAutoFill = () => {
    const fullCode = ['4', '8', '2', '9', '1', '0'];
    setOtp(fullCode);
    setActiveInputIdx(5);
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every((d) => d !== '');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Row with Back Button */}
      <View style={styles.topHeaderRow}>
        <TouchableOpacity
          style={styles.backCircleBtn}
          activeOpacity={0.8}
          onPress={onBack}
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Title & Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Verify Your Number</Text>
          <Text style={styles.subtitleText}>We've sent a 6-digit code to</Text>

          {/* Phone Number with Pink Edit Pencil */}
          <TouchableOpacity
            style={styles.phoneEditRow}
            activeOpacity={0.8}
            onPress={onBack}
          >
            <Text style={styles.phoneText}>{phoneNumber}</Text>
            <View style={styles.pencilCircle}>
              <Pencil size={12} color="#EF4444" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 6-Digit OTP Boxes */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => hiddenInputRef.current?.focus()}
          style={styles.otpBoxesRow}
        >
          {otp.map((digit, idx) => {
            const isCurrent = activeInputIdx === idx;
            const hasValue = digit !== '';
            return (
              <View
                key={idx}
                style={[
                  styles.otpBox,
                  isCurrent && styles.otpBoxActive,
                  hasValue && styles.otpBoxFilled,
                ]}
              >
                <Text style={styles.otpDigitText}>{digit}</Text>
                {/* Blinking cursor emulation if current and empty */}
                {isCurrent && !digit && <View style={styles.cursorBlink} />}
              </View>
            );
          })}
        </TouchableOpacity>

        {/* Hidden Real TextInput for Native Virtual Keyboard */}
        <TextInput
          ref={hiddenInputRef}
          value={otp.join('')}
          onChangeText={handleDigitChange}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.hiddenInput}
          autoFocus={Platform.OS !== 'web'}
        />

        {/* Quick Test Auto-Fill Helper */}
        <TouchableOpacity
          onPress={handleAutoFill}
          style={styles.autoFillPill}
          activeOpacity={0.8}
        >
          <Text style={styles.autoFillText}>⚡ Tap to auto-fill code (482910)</Text>
        </TouchableOpacity>

        {/* Resend Prompt with Live Countdown */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive the code? </Text>
          {countdown > 0 ? (
            <Text style={styles.resendCountdown}>
              Resend in {formatCountdown(countdown)}
            </Text>
          ) : (
            <TouchableOpacity onPress={() => setCountdown(30)}>
              <Text style={styles.resendAction}>Resend Now</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Primary CTA Red Love Button */}
        <MargamButton
          title={isVerifying ? 'Verifying...' : 'Verify & Continue'}
          onPress={() => handleVerify()}
          size="lg"
          loading={isVerifying}
          disabled={!isOtpComplete}
          style={[
            styles.verifyBtn,
            !isOtpComplete && styles.verifyBtnDisabled,
          ]}
        />

        {/* Security Assurance Card */}
        <View style={styles.securityCard}>
          <View style={styles.securityIconBox}>
            <Lock size={15} color="#EF4444" />
          </View>
          <View style={styles.securityTextBox}>
            <Text style={styles.securityTitle}>Your number is safe with us</Text>
            <Text style={styles.securitySub}>
              We use it only for account verification and account security.
            </Text>
          </View>
        </View>
      </View>

      {/* Scenic Kerala Houseboat on Backwaters Photo Backdrop */}
      <View style={styles.houseboatContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&auto=format&fit=crop&q=80',
          }}
          style={styles.houseboatImage}
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  subtitleText: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 4,
  },
  phoneEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  phoneText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  pencilCircle: {
    marginLeft: 6,
    padding: 3,
    backgroundColor: '#FFF1F2',
    borderRadius: 8,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  otpBox: {
    width: 48,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  otpBoxActive: {
    borderColor: '#EF4444', // Active pink/red border matching design
    backgroundColor: '#FFF5F5',
  },
  otpBoxFilled: {
    borderColor: '#CBD5E1',
  },
  otpDigitText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  cursorBlink: {
    width: 2,
    height: 22,
    backgroundColor: '#EF4444',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  autoFillPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 2,
    marginBottom: 8,
  },
  autoFillText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resendLabel: {
    fontSize: 12.5,
    color: '#64748B',
  },
  resendCountdown: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#EF4444',
  },
  resendAction: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#EF4444',
  },
  verifyBtn: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: '#EF4444',
  },
  verifyBtnDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 16,
    width: SCREEN_WIDTH - 40,
  },
  securityIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  securityTextBox: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 1,
  },
  securitySub: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
  },
  houseboatContainer: {
    height: 180,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  houseboatImage: {
    width: '100%',
    height: '100%',
  },
});
