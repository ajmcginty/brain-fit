# BrainFit

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.11-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

BrainFit is a comprehensive mobile application that empowers adults aged 50 and above to maintain and enhance their cognitive health. Through evidence-based habit tracking and educational resources, the platform delivers a personalized approach to cognitive wellness.

## Overview

The application focuses on five essential pillars of cognitive health:

**Exercise**
- Physical activity monitoring
- Customized exercise recommendations
- Activity intensity tracking

**Cognitive Stimulation**
- Brain training exercises
- Mental wellness activities
- Cognitive performance tracking

**Social Engagement**
- Social activity monitoring
- Community interaction tracking
- Social wellness metrics

**Sleep Quality**
- Sleep pattern analysis
- Duration monitoring
- Quality assessment

**Nutrition**
- Dietary habit tracking
- Hydration monitoring
- Nutritional guidance

## Core Capabilities

**Goal Management and Analytics**
- Comprehensive daily goal tracking across all health pillars
- Advanced progress visualization with interactive dashboards
- Detailed trend analysis and performance metrics

**Educational Resources**
- Curated, evidence-based articles on cognitive health
- Personalized content recommendations
- Expert-reviewed health resources

**Technical Features**
- Secure email/password authentication
- Robust offline functionality with cloud sync
- Personalized user profiles and progress tracking
- Optimized performance and response times
- Secure data handling and storage

## Getting Started

### Prerequisites
- Node.js (v19 or higher)
- npm (v9 or higher) or yarn (v4 or higher)
- Expo CLI (`npm install -g expo-cli`)
- For iOS development:
  - macOS
  - Xcode (latest version)
  - iOS Simulator
- For Android development:
  - Android Studio
  - Android SDK
  - Android Emulator

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/ajmcginty/brain-fit.git
   cd brain-fit
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Set up Firebase**
   
   a. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   b. Enable Email/Password authentication:
      - Go to Authentication → Sign-in method
      - Enable "Email/Password" provider
   
   c. Set up Firestore database:
      - Create a Firestore database
      - Apply the security rules from `docs/technical/firebase-rules.md`
   
   d. Set environment variables (before running the app):
      ```bash
      export EXPO_PUBLIC_FIREBASE_API_KEY="your-api-key"
      export EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
      export EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
      export EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
      export EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
      export EXPO_PUBLIC_FIREBASE_APP_ID="your-app-id"
      ```
      
      Get these values from Firebase Console (Project Settings → Web App).

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

6. **Create your account**
   - On first launch, you'll see the sign-in screen
   - Tap "Sign Up" to create a new account
   - Enter your email, password, and optional name
   - Start tracking your cognitive wellness journey!

## Project Structure

```
BrainFit/
├── app/                          # Main application code
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── screens/              # App screens
│   │   ├── navigation/           # Navigation configuration
│   │   ├── services/             # Business logic and API calls
│   │   ├── store/                # State management (Zustand)
│   │   ├── types/                # TypeScript type definitions
│   │   ├── utils/                # Utility functions
│   │   └── constants/            # App constants and theme
│   ├── assets/                   # Images, fonts, and static files
│   └── package.json
├── docs/                         # Project documentation
└── README.md
```

## Technology Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation v7
- **Local Storage**: AsyncStorage
- **Backend**: Firebase (Email/Password Auth + Firestore)
- **UI Components**: Custom components with consistent theming
- **Build Tool**: Expo CLI

## Application Architecture

### **Core Components**
- **Authentication**: Email/password authentication with Firebase Auth
- **Profile System**: User profiles with cloud sync and preferences
- **Goal Tracking**: Daily goal management across 5 health pillars with cloud sync
- **Progress Visualization**: Interactive progress rings and calendars
- **Content Management**: Curated article links to external health resources
- **Storage Service**: AsyncStorage for local data with Firebase Firestore backup

### **State Management**
- **Zustand Stores**: Separate stores for authentication, profiles, goals, and articles
- **Auth State**: Real-time authentication state management with Firebase listeners
- **Persistent State**: Automatic state persistence across app sessions
- **Cloud Sync**: Bi-directional sync between local storage and Firestore

## Development

### **Available Scripts**
```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

### **Code Style**
- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Comprehensive error handling

## Implementation Status

- **MVP Completion**: ✅ Complete
- **Current Phase**: Testing and refinement

### Completed Features
- ✅ Core infrastructure (Expo, TypeScript, Navigation)
- ✅ Email/password authentication with sign up, sign in, and password reset
- ✅ Authentication gating (must sign in to access app)
- ✅ Goal tracking system with progress visualization
- ✅ Educational content with external article links
- ✅ Profile screen with user stats and settings
- ✅ Firestore cloud sync for goals and profiles
- ✅ UI/UX with consistent theming

### Future Enhancements
- Add retry/backoff for failed syncs
- Manual "Sync Now" button
- Toast notifications for sync status
- Unit tests for stores and sync logic
- Consider MMKV migration for performance

## Firebase Configuration

### Firestore Security Rules

Apply these rules in the Firebase Console (Firestore → Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /goals/{uid}/daily/{date} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

See `docs/technical/firebase-rules.md` for more details.

## Testing

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Navigation and state management testing
- **Performance Testing**: Storage operations and app responsiveness
- **User Testing**: Real-world usage validation

## Performance Targets

- **App Launch**: < 2 seconds
- **Profile Operations**: < 1 second
- **Data Sync**: < 5 seconds
- **Storage Migration**: < 5 seconds per profile

## Security

- Firebase email/password authentication
- Per-user data isolation with Firestore security rules
- Secure password handling (minimum 6 characters)
- Password reset functionality via email
- Firestore security rules enforcing user ownership
- Offline-first architecture with secure cloud sync
- Privacy-first design approach

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Native community for the excellent framework
- Expo team for the amazing development platform
- All contributors and testers who helped shape this app

## Support

- **Issues**: [GitHub Issues](https://github.com/ajmcginty/brain-fit/issues)
- **Documentation**: See `docs/technical/firebase-rules.md` for Firebase configuration

---

*Dedicated to advancing cognitive health and wellness.*

*Last Updated: November 2025*
