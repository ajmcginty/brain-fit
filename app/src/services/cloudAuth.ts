import {
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { generateDeviceId } from '../services/profileService';

let currentUid: string | null = null;

export function getCurrentUid(): string | null {
  return currentUid;
}

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name?: string
): Promise<{ uid: string; email: string; name?: string }> {
  try {
    // Create user with email/password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name if provided
    if (name) {
      await updateProfile(user, { displayName: name });
    }
    
    const uid = user.uid;
    currentUid = uid;
    
    // Generate device ID for this user
    const device = await generateDeviceId();
    
    // Create profile document in Firestore
    await setDoc(doc(db, 'profiles', uid), {
      email,
      name: name || '',
      displayName: name || '',
      deviceId: device.deviceId,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: true,
      },
    });
    
    console.log('[auth] User signed up successfully:', uid);
    return { uid, email: user.email!, name };
  } catch (error: any) {
    console.error('[auth] Sign up error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ uid: string; email: string; name?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const uid = user.uid;
    currentUid = uid;
    
    // Update lastActive timestamp
    await setDoc(
      doc(db, 'profiles', uid),
      { lastActive: new Date().toISOString() },
      { merge: true }
    );
    
    // Fetch user profile to get name
    const profileDoc = await getDoc(doc(db, 'profiles', uid));
    const profileData = profileDoc.data();
    
    console.log('[auth] User signed in successfully:', uid);
    return {
      uid,
      email: user.email!,
      name: profileData?.name || profileData?.displayName || user.displayName || undefined,
    };
  } catch (error: any) {
    console.error('[auth] Sign in error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
    currentUid = null;
    console.log('[auth] User signed out successfully');
  } catch (error) {
    console.error('[auth] Sign out error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    await firebaseSendPasswordReset(auth, email);
    console.log('[auth] Password reset email sent to:', email);
  } catch (error: any) {
    console.error('[auth] Password reset error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Subscribe to authentication state changes
 */
export function subscribeAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    currentUid = user?.uid ?? null;
    callback(user);
  });
}

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'An error occurred. Please try again.';
  }
}

// Legacy function - kept for backward compatibility if needed
export async function ensureAuthWithDevice(): Promise<{ uid: string; deviceId: string }> {
  const device = await generateDeviceId();

  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  const uid = auth.currentUser!.uid;
  currentUid = uid;

  // Upsert profile doc with the local deviceId (best-effort with timeout)
  const writeProfile = setDoc(doc(db, 'profiles', uid), { deviceId: device.deviceId }, { merge: true });
  const withTimeout = <T,>(p: Promise<T>, ms = 4000) =>
    Promise.race<T>([
      p,
      new Promise<T>((_, rej) => setTimeout(() => rej(new Error('profile write timeout')), ms)) as Promise<T>,
    ]);
  try {
    await withTimeout(writeProfile, 4000);
  } catch (e) {
    console.warn('[auth] profile write failed/timeout (continuing)', e);
  }
  return { uid, deviceId: device.deviceId };
}


