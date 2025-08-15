# 🧠 BrainFit - Cognitive Health Mobile App

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.20-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **BrainFit** is a mobile application designed specifically for adults 50+ to maintain and improve cognitive health through daily habit tracking and educational content.

## 🎯 **Project Overview**

BrainFit focuses on five key pillars of cognitive health:
- 🏃‍♂️ **Exercise** - Physical activity tracking
- 🧩 **Cognitive Stimulation** - Brain training and mental exercises
- 👥 **Social Activity** - Social engagement monitoring
- 😴 **Sleep** - Sleep quality and duration tracking
- 🥗 **Diet** - Nutrition and hydration monitoring

## ✨ **Key Features**

- **Daily Goal Tracking** - Set and monitor daily goals across all 5 pillars
- **Progress Visualization** - Beautiful progress rings, weekly calendars, and trend analysis
- **Educational Content** - Curated articles and resources for cognitive health
- **Profile Management** - Personalized experience with device-based profiles
- **Offline-First** - Works seamlessly without internet connection
- **Performance Optimized** - Fast, responsive interface with efficient data storage

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

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

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## 🏗️ **Project Structure**

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
├── BrainFit_Documentation/       # Project documentation
└── README.md
```

## 🛠️ **Technology Stack**

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation v7
- **Storage**: AsyncStorage (with MMKV migration planned)
- **UI Components**: Custom components with consistent theming
- **Build Tool**: Expo CLI

## 📱 **App Architecture**

### **Core Components**
- **Profile System**: Device-based user profiles with data isolation
- **Goal Tracking**: Daily goal management across 5 health pillars
- **Progress Visualization**: Interactive progress rings and calendars
- **Content Management**: Article system with search and filtering
- **Storage Service**: Efficient local data persistence

### **State Management**
- **Zustand Stores**: Separate stores for profiles, goals, articles, and authentication
- **Persistent State**: Automatic state persistence across app sessions
- **Profile Isolation**: Data separation per user profile

## 🔧 **Development**

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

## 📊 **Current Status**

- **MVP Completion**: 95% ✅
- **Current Phase**: MMKV Integration & Performance Optimization
- **Target Completion**: 3 weeks to production-ready status

### **Completed Features**
- ✅ Core infrastructure (Expo, TypeScript, Navigation)
- ✅ Goal tracking system with progress visualization
- ✅ Educational content management
- ✅ Profile system foundation
- ✅ UI/UX foundation with consistent theming

### **In Progress**
- 🚧 MMKV storage migration for performance
- 🚧 Firebase integration for cloud sync
- 🚧 Final polish and testing

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 **Documentation**

- [Development Plan](BrainFit_Documentation/DEVELOPMENT_PLAN.md) - Detailed roadmap and progress
- [Technical Reference](BrainFit_Documentation/TECHNICAL_REFERENCE.md) - Technical implementation details
- [Current Status](BrainFit_Documentation/CURRENT_STATUS.md) - Real-time project status

## 🧪 **Testing**

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Navigation and state management testing
- **Performance Testing**: Storage operations and app responsiveness
- **User Testing**: Real-world usage validation

## 📈 **Performance Targets**

- **App Launch**: < 2 seconds
- **Profile Operations**: < 1 second
- **Data Sync**: < 5 seconds
- **Storage Migration**: < 5 seconds per profile

## 🔒 **Security**

- Device-based profile isolation
- Local data encryption (planned)
- Secure API communication (planned)
- Privacy-first design approach

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- React Native community for the excellent framework
- Expo team for the amazing development platform
- All contributors and testers who helped shape this app

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/ajmcginty/brain-fit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ajmcginty/brain-fit/discussions)
- **Documentation**: Check the [BrainFit_Documentation](BrainFit_Documentation/) folder

---

**Made with ❤️ for cognitive health and wellness**

*Last updated: January 2025*
