# BrainFit Technical Architecture

## Technology Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: Zustand
- **Local Storage**: AsyncStorage → MMKV (planned migration)
- **Backend**: Firebase (planned)
- **UI Components**: Custom components with consistent theming

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Main app screens
├── navigation/         # Navigation configuration
├── services/           # Business logic and API services
├── store/             # State management (Zustand)
├── types/             # TypeScript definitions
├── utils/             # Helper functions
└── constants/         # App constants and theme
```

## Core Components

### Profile System
- Device-based user profiles
- Data isolation per profile
- Profile health monitoring
- Migration utilities

### Goal Tracking
- Daily goals across 5 health pillars
- Progress visualization
- Notes and history
- Statistics and trends

### Content Management
- Article system with categories
- Search and filtering
- Offline availability
- Scientific article support

### Storage Architecture
- Profile-aware storage structure
- Efficient data persistence
- Migration capabilities
- Performance optimization

## State Management

### Store Architecture
- Zustand for lightweight state management
- Separate stores for different domains
- State persistence with storage
- Real-time UI synchronization

### Store Implementation
```typescript
interface Store {
  // Profile Store
  profile: BasicProfile | null;
  initializeProfile: () => Promise<void>;
  updateProfile: (updates: Partial<BasicProfile>) => Promise<void>;

  // Goals Store
  goals: DailyGoal[];
  addGoal: (goal: DailyGoal) => void;
  updateGoal: (id: string, updates: Partial<DailyGoal>) => void;

  // Articles Store
  articles: Article[];
  addArticle: (article: Article) => void;
  searchArticles: (query: string) => Article[];
}
```

## Data Models

### Core Interfaces

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

interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  content: string;
  summary?: string;
  authors?: string[];
  publishedDate: string;
  readTime: string;
}
```

## Services

### Profile Service
```typescript
class ProfileService {
  generateDeviceId(): Promise<string>;
  createProfile(): Promise<BasicProfile>;
  validateProfile(): Promise<boolean>;
  migrateProfileData(): Promise<void>;
}
```

### Storage Service
```typescript
class StorageService {
  getItem(key: string): Promise<any>;
  setItem(key: string, value: any): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
}
```

### Migration Service
```typescript
class MigrationService {
  migrateToMMKV(): Promise<void>;
  validateMigration(): Promise<boolean>;
  rollback(): Promise<void>;
}
```

## Error Handling

- Comprehensive error tracking
- Graceful degradation
- User-friendly error messages
- Automatic error recovery
- Debug logging system

## Performance Optimization

- Efficient data structures
- Lazy loading where appropriate
- Memoization for expensive operations
- Background processing for heavy tasks
- Storage operation batching

## Security Measures

- Data isolation per profile
- Local data encryption
- Secure storage practices
- Input validation
- Error sanitization

## Testing Strategy

- Unit tests for utilities
- Component testing
- Integration testing
- Performance benchmarking
- User acceptance testing

