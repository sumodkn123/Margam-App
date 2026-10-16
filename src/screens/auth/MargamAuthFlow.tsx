// MARGAM — Complete Authentication & Onboarding Flow
// Coordinates the 3 screens (Welcome Hero -> Sign In/Up -> OTP Verification)
// Exactly matching the reference image.

import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MargamWelcomeScreen } from './MargamWelcomeScreen';
import { MargamLoginScreen } from './MargamLoginScreen';
import { MargamOtpScreen } from './MargamOtpScreen';
import { ProfileCreationWizard } from '../wizard/ProfileCreationWizard';
import { authService } from '../../services/authService';

export type AuthScreenStep = 'welcome' | 'login' | 'otp' | 'wizard';
export type AuthMode = 'signin' | 'signup';

interface MargamAuthFlowProps {
  onAuthenticated: () => void;
  initialStep?: AuthScreenStep;
  initialMode?: AuthMode;
}

export const MargamAuthFlow: React.FC<MargamAuthFlowProps> = ({
  onAuthenticated,
  initialStep = 'welcome',
  initialMode = 'signin',
}) => {
  const [currentStep, setCurrentStep] = useState<AuthScreenStep>(initialStep);
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [userIdentifier, setUserIdentifier] = useState<string>('+91 98765 43210');

  const handleGetStarted = () => {
    setAuthMode('signup');
    setCurrentStep('login');
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setCurrentStep('login');
  };

  const handleLoginContinue = (identifier: string) => {
    if (identifier) {
      setUserIdentifier(identifier);
    }
    setCurrentStep('otp');
  };

  const handleSocialLogin = (provider: 'apple' | 'google' | 'facebook') => {
    const socialUserId = `${provider}_user`;
    const isExistingUser = authService.hasCompletedOnboarding(socialUserId);

    if (authMode === 'signin' || isExistingUser) {
      authService.signIn(socialUserId);
      onAuthenticated();
    } else {
      authService.signUp(socialUserId);
      setCurrentStep('wizard');
    }
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
  };

  const handleVerifySuccess = () => {
    const isExistingUser = authService.hasCompletedOnboarding(userIdentifier);

    // If user chose signin OR already has an account with completed onboarding,
    // bypass wizard entirely and enter main application
    if (authMode === 'signin' || isExistingUser) {
      authService.signIn(userIdentifier);
      onAuthenticated();
    } else {
      // New member signup -> launch progressive profile wizard
      authService.signUp(userIdentifier);
      setCurrentStep('wizard');
    }
  };

  return (
    <View style={styles.container}>
      {currentStep === 'welcome' && (
        <MargamWelcomeScreen
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
      )}

      {currentStep === 'login' && (
        <MargamLoginScreen
          mode={authMode}
          onSwitchMode={setAuthMode}
          onBack={handleBackToWelcome}
          onContinue={handleLoginContinue}
          onSocialLogin={handleSocialLogin}
        />
      )}

      {currentStep === 'otp' && (
        <MargamOtpScreen
          phoneNumber={userIdentifier.startsWith('+') ? userIdentifier : `+91 ${userIdentifier}`}
          onBack={handleBackToLogin}
          onVerifySuccess={handleVerifySuccess}
        />
      )}

      {currentStep === 'wizard' && (
        <ProfileCreationWizard
          onComplete={(profileData) => {
            authService.completeOnboarding(userIdentifier, profileData);
            onAuthenticated();
          }}
          onExit={() => {
            authService.completeOnboarding(userIdentifier);
            onAuthenticated();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
