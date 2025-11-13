## Firestore security rules (starter)

Apply these in the Firebase Console under Firestore Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /goals/{uid}/daily/{date} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /articles/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

This restricts each user to their own documents. Tighten further as needed.


