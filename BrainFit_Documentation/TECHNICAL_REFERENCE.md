# BrainFit Technical Reference

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **Local Storage**: AsyncStorage → MMKV (planned migration)
- **Backend**: Firebase (planned)
- **Icons**: MaterialCommunityIcons
- **UI Framework**: Custom components with consistent theming

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ArticleCard.tsx        # Article preview
│   ├── ArticleDetail.tsx      # Full article view
│   ├── ArticleList.tsx        # Article listing with filters
│   ├── GoalCheckbox.tsx      # Individual goal toggle
│   ├── GoalForm.tsx          # Goal input form
│   ├── NotesHistory.tsx      # Goal notes history
│   ├── ProgressRing.tsx      # Daily progress indicator
│   ├── StatsSummary.tsx      # Statistics overview
│   └── WeeklyCalendar.tsx    # Weekly progress view
├── constants/           # App constants
│   ├── hybridArticles.ts     # Initial article data
│   └── theme.ts              # UI theme constants
├── navigation/          # Navigation configuration
│   ├── GoalsNavigator.tsx    # Goals stack navigation
│   ├── LearnNavigator.tsx    # Learn stack navigation
│   └── navigation.tsx        # Main navigation setup
├── screens/            # Main app screens
│   ├── ArticleDetailScreen.tsx  # Article reading view
│   ├── AuthScreen.tsx          # Authentication (demo)
│   ├── GoalsScreen.tsx         # Goals management
│   ├── HomeScreen.tsx          # Dashboard
│   └── InfoScreen.tsx          # Learning section
├── services/           # Data and API services
│   ├── profileService.ts      # Profile management
│   ├── storage.ts             # Storage wrapper
│   └── dataMigrationService.ts # Data migration utilities
├── store/              # State management stores
│   ├── articleStore.ts        # Article state
│   ├── authStore.ts           # Auth state (basic)
│   ├── goalsStore.ts          # Goals state
│   └── profileStore.ts        # Profile state
├── types/              # TypeScript definitions
│   ├── articles.ts            # Article types
│   ├── goals.ts               # Goal types
│   ├── navigation.ts          # Navigation types
│   ├── profile.ts             # Profile types
│   └── store.ts               # Store types
└── utils/              # Helper functions
    ├── articleUtils.ts        # Article helpers
    ├── errors.ts              # Error handling
    ├── goalUtils.ts           # Goal helpers
    ├── profileHealth.ts       # Profile health monitoring
    └── profileTest.ts         # Profile testing utilities
```

## 📊 Data Models

### Core Data Structures

#### DailyGoal Interface
```typescript
interface DailyGoal {
  id: string;
  date: string;
  exercise: boolean;
  cognitive: boolean;
  social: boolean;
  sleep: boolean;
  diet: boolean;
  notes?: string;
}
```

#### Article Interface
```typescript
interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  readTime: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  publishedDate: string;
  lastUpdated?: string;
  sourceUrl?: string;
  doi?: string;
  authors?: string[];
  journal?: string;
  publicationYear?: number;
  citation?: string;
  institution?: string;
}

type ArticleCategory = 
  | 'exercise'
  | 'cognitive'
  | 'social'
  | 'sleep'
  | 'diet'
  | 'general';
```

#### Profile Interface
```typescript
interface BasicProfile {
  deviceId: string;
  createdAt: string;
  lastActive: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

interface ProfileStore {
  getProfile: () => BasicProfile | null;
  initializeProfile: () => Promise<BasicProfile>;
  updateProfile: (updates: Partial<BasicProfile>) => Promise<void>;
  getUserData: (key: string) => any;
  setUserData: (key: string, data: any) => Promise<void>;
}
```

## 🔄 State Management

### Store Architecture
- **Zustand**: Lightweight state management
- **Store Structure**: Separate stores for different domains
- **State Persistence**: Local storage integration
- **Real-time Updates**: Automatic UI synchronization

### Store Implementation
```typescript
// Example store structure
interface GoalsStore {
  goals: DailyGoal[];
  currentDate: string;
  addGoal: (goal: DailyGoal) => void;
  updateGoal: (id: string, updates: Partial<DailyGoal>) => void;
  getGoalsForDate: (date: string) => DailyGoal[];
  getWeeklyStats: () => GoalStats;
}
```

## 👤 Profile System Architecture

### Profile Data Structure
```typescript
interface BasicProfile {
  deviceId: string;           // Unique device identifier
  createdAt: string;          // ISO timestamp
  lastActive: string;         // ISO timestamp
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

interface DeviceInfo {
  deviceId: string;           // Platform_UUID_Timestamp
  createdAt: string;          // ISO timestamp
}
```

### Profile Service Functions
```typescript
// Core profile operations
generateDeviceId(): Promise<DeviceInfo>
createProfile(): Promise<BasicProfile>
getProfile(): Promise<BasicProfile | null>
updateProfile(updates: Partial<BasicProfile>): Promise<BasicProfile>

// Profile validation and recovery
validateProfileIntegrity(profile: BasicProfile): Promise<boolean>
recoverProfile(): Promise<BasicProfile | null>

// Data restructuring and migration
restructureExistingData(deviceId: string): Promise<void>
needsDataRestructuring(): Promise<boolean>
cleanupLegacyStorage(): Promise<void>
getProfileStorageKey(deviceId: string, dataType: string): string
```

### Profile Store (Zustand)
```typescript
interface ProfileStore extends ProfileState {
  initializeProfile: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfileData: (updates: Partial<BasicProfile>) => Promise<void>;
  validateProfile: () => Promise<boolean>;
  migrateData: () => Promise<void>;
  recoverFromError: () => Promise<void>;
}
```

### Data Migration Service
```typescript
class DataMigrationService {
  constructor(deviceId: string);
  
  // Migration operations
  migrateAllData(): Promise<void>;
  validateMigrationSuccess(): Promise<boolean>;
  rollbackMigration(): Promise<void>;
  getMigrationStatus(): Promise<MigrationStatus>;
  
  // Private methods
  private migrateGoalsData(): Promise<void>;
  private migrateArticlesData(): Promise<void>;
  private hasLegacyData(): Promise<boolean>;
}
```

### Profile Health Monitoring
```typescript
interface ProfileHealthStatus {
  isHealthy: boolean;
  profileExists: boolean;
  profileValid: boolean;
  storageInitialized: boolean;
  dataAccessible: boolean;
  issues: string[];
  recommendations: string[];
}

// Health check functions
checkProfileHealth(): Promise<ProfileHealthStatus>
getProfileDebugInfo(): Promise<DebugInfo>
generateHealthReport(status: ProfileHealthStatus): string
```

### Profile-Aware Storage
```typescript
// Storage keys are dynamically generated based on device ID
const profileKey = `profile_${deviceId}_${dataType}`;

// Examples:
// profile_ios_uuid123_1234567890_daily_goals
// profile_ios_uuid123_1234567890_goal_stats
// profile_ios_uuid123_1234567890_articles
```

## 💾 Storage Architecture

### Current Implementation (AsyncStorage)
```typescript
interface LocalStorage {
  // Basic operations
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  
  // Data structure
  goals: { [date: string]: DailyGoal };
  articles: Article[];
  userPreferences: UserPreferences;
}
```

### Planned Migration (MMKV)
```typescript
interface MMKVStorage {
  // Profile operations
  getProfile: () => BasicProfile | null;
  setProfile: (profile: BasicProfile) => void;
  
  // User data with profile context
  setUserData: (deviceId: string, key: string, data: any) => void;
  getUserData: (deviceId: string, key: string) => any;
  getAllUserData: (deviceId: string) => Record<string, any>;
  
  // Offline queue
  addToQueue: (operation: SyncOperation) => void;
  processQueue: () => Promise<void>;
  
  // Cache management
  setCached: (key: string, data: any, ttl: number) => void;
  getCached: (key: string) => any | null;
}
```

### Firebase Schema (Planned)
```typescript
interface FirestoreSchema {
  profiles: {
    [deviceId: string]: BasicProfile;
  };
  users: {
    [deviceId: string]: {
      settings: UserSettings;
      lastSync: string;
    };
  };
  goals: {
    [deviceId: string]: {
      [date: string]: DailyGoal;
    };
  };
  articles: {
    [articleId: string]: Article;
  };
}
```

## 🚀 Development Phases

### Phase 1: Core Infrastructure ✅
- [x] Project setup with TypeScript and Expo
- [x] Basic navigation implementation
- [x] Zustand state management setup
- [x] AsyncStorage implementation
- [x] Error handling system

### Phase 2: Goal Tracking ✅
- [x] Daily goals data structure
- [x] Progress Ring implementation
- [x] Weekly calendar view
- [x] Basic statistics display
- [x] Notes feature implementation
- [x] Local storage integration
- [x] Error handling for storage operations

### Phase 3: Content & Education ✅
- [x] Article data structure and management
- [x] Article list with filtering
- [x] Category system with icons
- [x] Article detail view
- [x] Search functionality
- [x] Local storage for articles
- [x] Error handling for article operations

### Phase 4: Profile & Storage Migration 🚧
#### Step 1: Basic Profile System ✅ COMPLETED (1 week)
- ✅ Device ID generation
- ✅ Basic profile structure
- ✅ Profile storage service
- ✅ Data restructuring
- ✅ Profile validation and recovery
- ✅ Profile health monitoring
- ✅ Data migration service

#### Step 2: MMKV Integration (1 week)
- [ ] MMKV setup and configuration
- [ ] Profile-aware storage
- [ ] Data migration
- [ ] Performance optimization

#### Step 3: Firebase Integration (1 week)
- [ ] Firebase project setup
- [ ] Profile-based schema
- [ ] Security rules
- [ ] Sync implementation

### Phase 5: Polish & Testing 📋
- [x] UI/UX refinement
- [x] Basic performance optimization
- [ ] Bug fixing
- [ ] Testing implementation
- [ ] Security review
- [ ] Profile system validation
- [ ] Storage performance testing
- [ ] Sync system validation

## 🔒 Security Implementation

### Current Security
- Local data storage
- Basic error handling
- Essential accessibility features

### Planned Security Features
- **Data Encryption**: MMKV encryption for local storage
- **Profile Security**: Unique device ID generation
- **Data Isolation**: Profile-based access control
- **Cloud Security**: Firebase security rules
- **End-to-End Encryption**: For sensitive data

## 📈 Performance Targets

### App Performance
- **App Launch**: < 2 seconds
- **Profile Initialization**: < 1 second
- **Data Sync**: < 5 seconds
- **Offline Functionality**: 100% available

### Storage Performance
- **Profile Creation**: < 1 second
- **Data Restructuring**: < 2 seconds per profile
- **Migration Completion**: < 5 seconds per profile
- **Target Completion Rate**: > 99.9%

### Firebase Limits
- **Free Tier**: 50,000 reads/day, 20,000 writes/day, 1GB stored data
- **Growth Tier**: ~$25/month for 100k profiles
  - 250,000 reads/day, 100,000 writes/day, 5GB stored data

## 🧪 Testing Strategy

### Testing Focus Areas
1. **Profile System Implementation**
   - Device ID generation
   - Profile storage service
   - Data restructuring

2. **Storage Migration**
   - Profile-aware MMKV implementation
   - Data migration approach
   - Performance testing

3. **Accessibility**
   - Readable text sizes
   - Color contrast improvements
   - Touch target sizes
   - Screen reader support

4. **Content System**
   - Article system with larger datasets
   - Offline article access
   - Search performance

### Testing Metrics
- Profile creation success: 100%
- Data restructuring accuracy: 100%
- Migration completion rate: > 99.9%
- Data integrity: 100%
- Sync latency: < 5s
- Offline availability: 100%
- Error rate: < 0.1%

## 🔧 Migration Strategy

### Profile Creation
```typescript
async function initializeProfile() {
  const deviceId = await generateDeviceId();
  const profile: BasicProfile = {
    deviceId,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
  await storage.setProfile(profile);
  return profile;
}
```

### Data Restructuring
```typescript
async function restructureData(deviceId: string) {
  const oldData = await AsyncStorage.getAllKeys();
  for (const key of oldData) {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      await storage.setUserData(deviceId, key, value);
    }
  }
}
```

### MMKV Migration
```typescript
async function migrateToMMKV(profile: BasicProfile) {
  const userData = await storage.getAllUserData(profile.deviceId);
  for (const [key, value] of Object.entries(userData)) {
    await mmkv.set(`${profile.deviceId}:${key}`, value);
  }
}
```

### Firebase Setup
```typescript
async function initialSync(profile: BasicProfile) {
  const userData = await mmkv.getAllUserData(profile.deviceId);
  await firebase.batch().commit([
    {
      path: `profiles/${profile.deviceId}`,
      data: profile
    },
    ...Object.entries(userData).map(([key, value]) => ({
      path: `users/${profile.deviceId}/${key}`,
      data: value
    }))
  ]);
}
```

## 📚 Development Guidelines

### Code Standards
- Follow TypeScript best practices
- Maintain consistent UI/UX patterns
- Implement proper error handling
- Prioritize accessibility features
- Test thoroughly before deployment

### Error Handling
- Basic storage error handling
- User-friendly error messages
- Data persistence reliability
- Offline support
- State recovery

### Accessibility Requirements
- Readable text sizes
- Adequate color contrast
- Appropriate touch target sizes
- Essential screen reader support
- Clear visual feedback

---

**Last Updated**: Today  
**Current Version**: MVP Development  
**Next Milestone**: Profile System Implementation
