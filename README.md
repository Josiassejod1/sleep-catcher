# Sleep Catcher 😴

A React Native sleep journaling app that helps users track sleep quality, reflect through AI-powered prompts, and visualize trends over time. Built with Expo, Firebase, and OpenAI.

## 🌟 Features

### Core Features
- **Daily Sleep Logging**: Track sleep quality scores (1-5), hours slept, bedtime, and wake time
- **AI-Powered Reflection**: Personalized journal prompts based on sleep quality
- **Health Integration**: Automatic sleep data sync from Apple Health and Google Fit
- **Trend Visualization**: Beautiful charts showing sleep patterns over time
- **Streak Tracking**: Motivation through logging streaks and statistics

### Premium Features
- **Unlimited History**: Access to all historical sleep data
- **Unlimited Journaling**: No word limits on journal entries
- **AI Insights**: Personalized sleep analysis and recommendations
- **Export Reports**: PDF/CSV exports for healthcare providers
- **Custom Reminders**: Multiple bedtime and morning reminders

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Emulator
- Firebase project with Firestore enabled
- OpenAI API key (optional, for AI prompts)
- RevenueCat account (optional, for subscriptions)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd sleep-catcher
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual API keys
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Open the app**
   - iOS: Press `i` or scan QR code with Camera
   - Android: Press `a` or scan QR code with Expo Go
   - Web: Press `w`

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password, Google, Apple)
3. Create a Firestore database
4. Add your config to `.env.local`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   ```

### OpenAI Setup (Optional)
1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Add to `.env.local`:
   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your_openai_key
   ```

### RevenueCat Setup (Optional)
1. Create account at [revenuecat.com](https://revenuecat.com)
2. Configure products and entitlements
3. Add to `.env.local`:
   ```env
   EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_key
   ```

## 📱 App Structure

```
app/
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Home/Dashboard
│   └── explore.tsx   # Trends/Analytics
├── _layout.tsx       # Root layout
└── modal.tsx         # Modal screens

components/
├── ui/              # Reusable UI components
└── ...              # Feature-specific components

services/
├── auth.ts          # Firebase Authentication
├── sleepLog.ts      # Sleep data operations
├── openai.ts        # AI prompt generation
├── health.ts        # Health data integration
└── revenuecat.ts    # Subscription management

config/
├── firebase.ts      # Firebase configuration
└── constants.ts     # App configuration

types/
└── index.ts         # TypeScript type definitions

utils/
├── date.ts          # Date utilities
└── validation.ts    # Input validation
```

## 🎨 Design System

The app uses a sleep-focused design system with:
- **Colors**: Calming blues, purples, and night-themed colors
- **Typography**: Clean, readable font hierarchy
- **Components**: Consistent spacing, shadows, and animations
- **Dark Mode**: Full support for light and dark themes

Access the design tokens in `constants/theme.ts`:
```typescript
import { Colors, Typography, Spacing } from '@/constants/theme';
```

## 📊 Data Model

### Sleep Log Schema
```typescript
interface SleepLog {
  id: string;
  userId: string;
  date: string;        // YYYY-MM-DD
  score: number;       // 1-5
  hours: number;       // Hours slept
  bedtime?: Date;
  wakeTime?: Date;
  journal?: string;
  prompt?: string;
  createdAt: Date;
}
```

### User Schema
```typescript
interface User {
  id: string;
  email: string;
  displayName?: string;
  isPremium: boolean;
  createdAt: Date;
}
```

## 🔒 Privacy & Security

- **Local Storage**: Sensitive data cached securely
- **Encryption**: All API communications use HTTPS
- **Authentication**: Firebase handles secure auth flows
- **Data Minimization**: Only collect necessary sleep data
- **User Control**: Users can export or delete their data

## 🚢 Deployment

### Development Build
```bash
# iOS
npx eas build --platform ios --profile development

# Android
npx eas build --platform android --profile development
```

### Production Build
```bash
# iOS App Store
npx eas build --platform ios --profile production
npx eas submit --platform ios

# Google Play Store
npx eas build --platform android --profile production
npx eas submit --platform android
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit

# Unit tests (when added)
npm test
```

## 📈 Analytics & Monitoring

The app includes optional analytics via Firebase:
- **Crashlytics**: Crash reporting and debugging
- **Performance**: App performance monitoring
- **Analytics**: User engagement metrics (privacy-compliant)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Ask questions in GitHub Discussions
- **Email**: support@sleepcatcher.app

## 🗺️ Roadmap

- [ ] Apple Watch integration
- [ ] Sleep coaching recommendations
- [ ] Social features (optional sharing)
- [ ] Integration with more health platforms
- [ ] Advanced analytics and insights
- [ ] Multi-language support

---

Built with ❤️ using React Native, Expo, and Firebase
