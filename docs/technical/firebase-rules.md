## Firestore Security Rules

Apply these rules in the Firebase Console under **Firestore Database → Rules**.

### Production Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(uid) {
      return isAuthenticated() && request.auth.uid == uid;
    }
    
    // User profiles - users can only read/write their own profile
    match /profiles/{uid} {
      allow read: if isOwner(uid);
      allow write: if isOwner(uid);
    }
    
    // Daily goals - users can only access their own goals
    match /goals/{uid}/daily/{date} {
      allow read: if isOwner(uid);
      allow write: if isOwner(uid);
    }
    
    // Articles - users can only access their own articles
    match /articles/{uid} {
      allow read: if isOwner(uid);
      allow write: if isOwner(uid);
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Authentication Setup

The app uses **Firebase Email/Password Authentication**. To enable it:

1. Go to Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. (Optional) Enable **Email link (passwordless sign-in)** if desired

### Testing Rules

For testing in development, you can use these more permissive rules (NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Security Best Practices

1. **Always validate user ownership** - Users should only access their own data
2. **Require authentication** - No anonymous reads/writes in production
3. **Validate data structure** - Ensure required fields are present on write
4. **Test your rules** - Use the Firebase Rules Playground to test scenarios
5. **Monitor usage** - Check Firebase Console for unauthorized access attempts

### Data Structure

#### Profile Document (`/profiles/{uid}`)
```typescript
{
  email: string;
  name?: string;
  displayName?: string;
  deviceId: string;
  createdAt: string (ISO date);
  lastActive: string (ISO date);
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  }
}
```

#### Daily Goal Document (`/goals/{uid}/daily/{date}`)
```typescript
{
  id: string;
  date: string (YYYY-MM-DD);
  exercise: boolean;
  cognitive: boolean;
  social: boolean;
  sleep: boolean;
  diet: boolean;
  notes?: string;
  updatedAt?: string; // ISO timestamp for sync
}
```

### Rate Limiting

Consider implementing rate limiting for:
- Failed login attempts (handled by Firebase Auth)
- Excessive writes to prevent abuse
- API calls to external services

### Monitoring

Enable these Firebase features for better security:
1. **App Check** - Protect your backend from abuse
2. **Security Rules Logging** - Monitor rule violations
3. **Usage Monitoring** - Track read/write patterns


