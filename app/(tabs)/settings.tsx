import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [isPremium, setIsPremium] = useState(user?.isPremium || false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [healthSyncEnabled, setHealthSyncEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleUpgradeToPremium = async () => {
    try {
      // Navigate to paywall or trigger purchase flow
      Alert.alert(
        'Upgrade to Premium',
        'Premium features include unlimited history, unlimited journaling, AI insights, and export reports.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Learn More', onPress: () => {
            // TODO: Navigate to paywall screen
            console.log('Navigate to paywall');
          }},
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to load premium options. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your sleep data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'This will permanently delete your account and all data.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete Forever', 
                  style: 'destructive',
                  onPress: () => {
                    // TODO: Implement account deletion
                    Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update.');
                  }
                },
              ]
            );
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Account Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.accountInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.displayName || 'Sleep User'}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.statusBadge}>
                <Text style={[styles.statusText, isPremium && styles.premiumText]}>
                  {isPremium ? '✨ Premium' : '🆓 Free'}
                </Text>
              </View>
            </View>
          </View>

          {!isPremium && (
            <Button
              title="Upgrade to Premium"
              onPress={handleUpgradeToPremium}
              style={styles.upgradeButton}
            />
          )}
        </Card>

        {/* Preferences Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Get reminders to log your sleep
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ 
                false: theme.colors.primary.offWhite, 
                true: theme.colors.primary.lavender 
              }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Health Data Sync</Text>
              <Text style={styles.settingDescription}>
                Automatically import sleep data from Apple Health or Google Fit
              </Text>
            </View>
            <Switch
              value={healthSyncEnabled}
              onValueChange={setHealthSyncEnabled}
              trackColor={{ 
                false: theme.colors.primary.offWhite, 
                true: theme.colors.primary.lavender 
              }}
              thumbColor={healthSyncEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </Card>

        {/* Data & Privacy Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Export Data</Text>
            <Text style={styles.actionDescription}>
              Download your sleep data as CSV or PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Privacy Policy</Text>
            <Text style={styles.actionDescription}>
              Learn how we protect your data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Terms of Service</Text>
            <Text style={styles.actionDescription}>
              View our terms and conditions
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Support Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Help Center</Text>
            <Text style={styles.actionDescription}>
              Get answers to common questions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Contact Support</Text>
            <Text style={styles.actionDescription}>
              Get help with your account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Rate App</Text>
            <Text style={styles.actionDescription}>
              Leave a review on the App Store
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Account Actions */}
        <Card style={styles.section}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            style={styles.signOutButton}
          />

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Sleep Catcher v1.0.0
          </Text>
          <Text style={styles.footerText}>
            Made with 💜 for better sleep
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.offWhite,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary.lavender,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.inverse,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.primary.offWhite,
    borderRadius: 12,
    overflow: 'hidden',
  },
  premiumText: {
    color: theme.colors.primary.lavender,
    backgroundColor: theme.colors.primary.lavender + '20',
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary.lavender,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary.offWhite,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  actionRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary.offWhite,
  },
  actionLabel: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  signOutButton: {
    marginBottom: 16,
    borderColor: theme.colors.primary.lavender,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteButtonText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: '#E57373',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
});
