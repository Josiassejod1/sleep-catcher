import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import authService from '@/services/auth';
import revenuecat from '@/services/revenuecat';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
      
      // Initialize RevenueCat when user signs in
      if (user) {
        revenuecat.initialize(user.id);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithEmail(email, password);
      setUser(user);
      await revenuecat.initialize(user.id);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    try {
      const user = await authService.signUpWithEmail(email, password, displayName);
      setUser(user);
      await revenuecat.initialize(user.id);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      setUser(user);
      await revenuecat.initialize(user.id);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithApple();
      setUser(user);
      await revenuecat.initialize(user.id);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const refreshUser = async () => {
    if (user) {
      // Refresh user data from Firestore to get updated isPremium status
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
