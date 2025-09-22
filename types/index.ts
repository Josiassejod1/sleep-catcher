
// Core types for Sleep Catcher app

export interface User {
  id: string;
  email: string;
  displayName?: string;
  isPremium: boolean;
  createdAt: Date;
}

export interface SleepLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  score: number; // 1-5 mood/quality score
  hours: number; // Hours slept
  bedtime?: Date;
  wakeTime?: Date;
  journal?: string;
  prompt?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AIPrompt {
  id: string;
  type: 'stress' | 'neutral' | 'gratitude';
  text: string;
  createdAt: Date;
}

export interface HealthData {
  bedtime?: Date;
  wakeTime?: Date;
  hoursSlept?: number;
  source: 'apple_health' | 'google_fit' | 'manual';
}

export interface SubscriptionStatus {
  isActive: boolean;
  productId?: string;
  expirationDate?: Date;
  originalPurchaseDate?: Date;
}

export interface AppSettings {
  notifications: {
    morningReminder: boolean;
    morningReminderTime: string; // HH:MM format
    bedtimeReminder: boolean;
    bedtimeReminderTime: string;
    customReminders: CustomReminder[];
  };
  health: {
    syncEnabled: boolean;
    lastSyncDate?: Date;
  };
  privacy: {
    shareDataForResearch: boolean;
  };
}

export interface CustomReminder {
  id: string;
  title: string;
  time: string; // HH:MM format
  enabled: boolean;
  days: number[]; // 0-6 for Sunday-Saturday
}

export interface ChartData {
  date: string;
  score: number;
  hours: number;
}

export interface ExportData {
  dateRange: {
    start: string;
    end: string;
  };
  format: 'pdf' | 'csv';
  includeJournals: boolean;
  includeInsights: boolean;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
  Paywall: undefined;
};

export type TabParamList = {
  Home: undefined;
  Log: undefined;
  Trends: undefined;
  Profile: undefined;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface OpenAIResponse {
  prompt: string;
  type: 'stress' | 'neutral' | 'gratitude';
}
