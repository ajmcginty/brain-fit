import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { generateDeviceId } from '../services/profileService';

let currentUid: string | null = null;

export function getCurrentUid(): string | null {
  return currentUid;
}

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

export function subscribeAuth(callback: (uid: string | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    currentUid = user?.uid ?? null;
    callback(currentUid);
  });
}


