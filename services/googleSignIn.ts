import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

class GoogleSignInService {
  private isConfigured = false;

  async configure(): Promise<void> {
    if (this.isConfigured) return;

    try {
      GoogleSignin.configure({
        // Web client ID from Firebase Console -> Authentication -> Sign-in method -> Google
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'your-web-client-id',
        
        // iOS client ID (if different from web client ID)
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        
        // Request offline access (refresh token)
        offlineAccess: true,
        
        // Request user's profile info
        scopes: ['profile', 'email'],
        
        // Hosted domain (optional - for G Suite domains)
        hostedDomain: '',
        
        // Login hint (optional)
        loginHint: '',
        
        // Prompt user to select account (optional)
        forceCodeForRefreshToken: true,
      });

      this.isConfigured = true;
      console.log('Google Sign-In configured successfully');
    } catch (error) {
      console.error('Google Sign-In configuration error:', error);
      throw error;
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      await this.configure();
      return await GoogleSignin.isSignedIn();
    } catch (error) {
      console.error('Error checking Google Sign-In status:', error);
      return false;
    }
  }

  async getCurrentUser() {
    try {
      await this.configure();
      return await GoogleSignin.getCurrentUser();
    } catch (error) {
      console.error('Error getting current Google user:', error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.configure();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Error signing out from Google:', error);
      throw error;
    }
  }

  async revokeAccess(): Promise<void> {
    try {
      await this.configure();
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.error('Error revoking Google access:', error);
      throw error;
    }
  }

  getConfigurationStatus(): boolean {
    return this.isConfigured;
  }
}

export default new GoogleSignInService();
