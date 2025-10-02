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
- Robust offline functionality
- Device-based profile management
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

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

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
- **Storage**: AsyncStorage (with MMKV migration planned)
- **UI Components**: Custom components with consistent theming
- **Build Tool**: Expo CLI

## Application Architecture

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

- **MVP Completion**: 95% ✅
- **Current Phase**: MMKV Integration & Performance Optimization
- **Target Completion**: 3 weeks to production-ready status

### Completed Features
- Core infrastructure implementation (Expo, TypeScript, Navigation)
- Goal tracking system with progress visualization
- Educational content management system
- Profile system foundation
- UI/UX implementation with consistent theming

### Current Development
- MMKV storage migration for enhanced performance
- Firebase integration for cloud synchronization
- Final optimization and testing phase

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation

- [Architecture](docs/technical/architecture.md) - System architecture and implementation
- [Performance](docs/technical/performance.md) - Performance guidelines and targets
- [Security](docs/technical/security.md) - Security measures and guidelines
- [Contributing](CONTRIBUTING.md) - How to contribute to BrainFit

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

- Device-based profile isolation
- Local data encryption (planned)
- Secure API communication (planned)
- Privacy-first design approach

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Native community for the excellent framework
- Expo team for the amazing development platform
- All contributors and testers who helped shape this app

## Support

- **Issues**: [GitHub Issues](https://github.com/ajmcginty/brain-fit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ajmcginty/brain-fit/discussions)
- **Documentation**: Check the [docs](docs/) folder for detailed technical documentation

---

*Dedicated to advancing cognitive health and wellness.*

*Last Updated: January 2025*
