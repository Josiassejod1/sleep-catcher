import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validation';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsEmailSent(true);
      Alert.alert(
        'Reset Email Sent',
        'We\'ve sent you a password reset link. Please check your email and follow the instructions.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/auth/sign-in'),
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a few minutes before trying again.';
      }
      
      Alert.alert('Reset Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    router.push('/auth/sign-in');
  };

  if (isEmailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <Card style={styles.successCard}>
            <View style={styles.successContent}>
              <Text style={styles.successIcon}>📧</Text>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successText}>
                We've sent a password reset link to:
              </Text>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.successText}>
                Click the link in your email to reset your password.
              </Text>
              
              <Button
                title="Back to Sign In"
                onPress={handleBackToSignIn}
                size="large"
                style={styles.backButton}
              />
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          <Card style={styles.formCard}>
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={isLoading}
                disabled={isLoading}
                size="large"
                style={styles.resetButton}
              />
            </View>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Remember your password?{' '}
              <TouchableOpacity onPress={handleBackToSignIn} disabled={isLoading}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.offWhite,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  formCard: {
    marginBottom: 30,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  resetButton: {
    marginTop: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  signInLink: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.primary.lavender,
    fontWeight: '600',
  },
  successCard: {
    alignItems: 'center',
  },
  successContent: {
    alignItems: 'center',
    gap: 16,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  successText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
    minWidth: 200,
  },
});

