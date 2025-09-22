// App configuration constants

export const APP_CONFIG = {
  name: 'Sleep Catcher',
  version: '1.0.0',
  description: 'A sleep journaling app with AI-powered reflection prompts',
  
  // API endpoints
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.sleepcatcher.app',
  
  // Environment
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
  isDevelopment: process.env.EXPO_PUBLIC_ENVIRONMENT === 'development',
  isProduction: process.env.EXPO_PUBLIC_ENVIRONMENT === 'production',
  
  // Feature flags
  features: {
    healthSync: true,
    aiPrompts: true,
    subscriptions: true,
    exports: true,
    notifications: true,
    googleSignIn: true,
    appleSignIn: false, // Will be enabled when implemented
  },
  
  // App Store/Play Store configuration
  stores: {
    ios: {
      appId: 'id123456789', // Replace with actual App Store ID
      url: 'https://apps.apple.com/app/sleep-catcher/id123456789',
    },
    android: {
      packageName: 'com.sleepcatcher.app', // Replace with actual package name
      url: 'https://play.google.com/store/apps/details?id=com.sleepcatcher.app',
    },
  },
  
  // Subscription configuration
  subscriptions: {
    products: {
      monthly: 'premium_monthly',
      yearly: 'premium_yearly',
    },
    entitlements: {
      premium: 'premium',
    },
  },
  
  // Free tier limitations
  freeTier: {
    maxHistoryDays: 7,
    maxJournalWords: 100,
    maxCustomReminders: 0,
  },
  
  // Premium features
  premium: {
    unlimitedHistory: true,
    unlimitedJournalWords: true,
    aiInsights: true,
    exportReports: true,
    customReminders: true,
    prioritySupport: true,
  },
  
  // Health data configuration
  health: {
    ios: {
      permissions: ['SleepAnalysis'],
    },
    android: {
      scopes: ['https://www.googleapis.com/auth/fitness.sleep.read'],
    },
  },
  
  // Notification configuration
  notifications: {
    defaultMorningTime: '08:00',
    defaultEveningTime: '22:00',
    channels: {
      reminders: 'reminders',
      updates: 'updates',
    },
  },
  
  // Analytics and tracking
  analytics: {
    enabled: true,
    crashlytics: true,
    performanceMonitoring: true,
  },
  
  // Support and feedback
  support: {
    email: 'support@sleepcatcher.app',
    website: 'https://sleepcatcher.app',
    privacyPolicy: 'https://sleepcatcher.app/privacy',
    termsOfService: 'https://sleepcatcher.app/terms',
    helpCenter: 'https://help.sleepcatcher.app',
  },
  
  // Social links
  social: {
    twitter: 'https://twitter.com/sleepcatcher',
    instagram: 'https://instagram.com/sleepcatcher',
    facebook: 'https://facebook.com/sleepcatcher',
  },
  
  // Rate limiting and quotas
  limits: {
    maxDailyLogs: 5, // Prevent spam
    maxJournalLength: 10000, // Characters
    maxPromptRetries: 3,
    apiTimeout: 30000, // 30 seconds
  },
  
  // Cache configuration
  cache: {
    sleepLogsExpiry: 24 * 60 * 60 * 1000, // 24 hours
    userDataExpiry: 60 * 60 * 1000, // 1 hour
    settingsExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  
  // Chart configuration
  charts: {
    defaultDays: 7,
    maxDataPoints: 30,
    animationDuration: 1000,
  },
};

// Environment-specific overrides
if (APP_CONFIG.isDevelopment) {
  // Development-specific settings
  APP_CONFIG.limits.apiTimeout = 60000; // Longer timeout for debugging
  APP_CONFIG.analytics.enabled = false; // Disable analytics in development
}

export default APP_CONFIG;
