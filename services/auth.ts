import { firebaseAuth, firebaseFirestore } from '../config/firebase';
import { User } from '../types';

class AuthService {
  constructor() {
    // Google Sign-In configuration will be handled when the service is properly implemented
  }

  // Email/Password Authentication
  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;

      if (displayName && firebaseUser.updateProfile) {
        await firebaseUser.updateProfile({ displayName });
      }

      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: displayName || firebaseUser.displayName || undefined,
        isPremium: false,
        createdAt: new Date(),
      };

      // Create user document in Firestore
      await firebaseFirestore.collection('users').doc(firebaseUser.uid).set(user);

      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await firebaseFirestore.collection('users').doc(firebaseUser.uid).get();
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        // Create user document if it doesn't exist
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || undefined,
          isPremium: false,
          createdAt: new Date(),
        };
        await firebaseFirestore.collection('users').doc(firebaseUser.uid).set(user);
        return user;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Google Sign-In (placeholder - requires additional setup)
  async signInWithGoogle(): Promise<User> {
    try {
      // This would require @react-native-google-signin/google-signin
      // For now, throw an error indicating it's not implemented
      throw new Error('Google Sign-In not yet implemented. Please install and configure @react-native-google-signin/google-signin first.');
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  // Apple Sign-In (placeholder - requires additional setup)
  async signInWithApple(): Promise<User> {
    // This would require react-native-apple-authentication
    // For now, throw an error indicating it's not implemented
    throw new Error('Apple Sign-In not yet implemented');
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseAuth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const firebaseUser = firebaseAuth.currentUser;
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || undefined,
      isPremium: false, // This would be fetched from Firestore in a real implementation
      createdAt: new Date(), // This would be fetched from Firestore
    };
  }

  // Auth state change listener
  onAuthStateChanged(callback: (user: User | null) => void) {
    return firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await firebaseFirestore.collection('users').doc(firebaseUser.uid).get();
          if (userDoc.exists()) {
            callback(userDoc.data() as User);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

export default new AuthService();
