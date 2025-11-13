import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { storage } from '../services/storage';
import { formatDate } from '../utils/goalUtils';
import { DailyGoal } from '../types/goals';

export async function syncTodayGoal(uid: string): Promise<void> {
  const today = formatDate(new Date());
  const goals = await storage.getDailyGoals();
  const todayGoal = goals?.find((g) => g.date === today);
  if (!todayGoal) return;
  await setDoc(doc(db, 'goals', uid, 'daily', today), todayGoal, { merge: true });
}

/**
 * Pull goals from Firestore and merge with local goals
 * Uses last-write-wins strategy based on updatedAt timestamp
 */
export async function pullAndMergeGoals(uid: string): Promise<DailyGoal[]> {
  try {
    console.log('[sync] Pulling goals from Firestore...');
    
    // Get local goals
    const localGoals = await storage.getDailyGoals() || [];
    
    // Get cloud goals
    const goalsRef = collection(db, 'goals', uid, 'daily');
    const snapshot = await getDocs(goalsRef);
    
    const cloudGoals: DailyGoal[] = [];
    snapshot.forEach((doc) => {
      cloudGoals.push(doc.data() as DailyGoal);
    });
    
    console.log(`[sync] Found ${localGoals.length} local goals, ${cloudGoals.length} cloud goals`);
    
    // Merge: last-write-wins by updatedAt
    const merged = mergeGoals(localGoals, cloudGoals);
    
    console.log(`[sync] Merged to ${merged.length} goals`);
    return merged;
  } catch (error) {
    console.error('[sync] Error pulling goals:', error);
    // Return local goals on error
    return await storage.getDailyGoals() || [];
  }
}

/**
 * Merge local and cloud goals using last-write-wins strategy
 */
function mergeGoals(localGoals: DailyGoal[], cloudGoals: DailyGoal[]): DailyGoal[] {
  const goalMap = new Map<string, DailyGoal>();
  
  // Add all local goals
  localGoals.forEach((goal) => {
    goalMap.set(goal.date, goal);
  });
  
  // Merge cloud goals (replace if newer)
  cloudGoals.forEach((cloudGoal) => {
    const localGoal = goalMap.get(cloudGoal.date);
    
    if (!localGoal) {
      // No local version, use cloud
      goalMap.set(cloudGoal.date, cloudGoal);
    } else {
      // Both exist, compare timestamps
      const localTime = localGoal.updatedAt ? new Date(localGoal.updatedAt).getTime() : 0;
      const cloudTime = cloudGoal.updatedAt ? new Date(cloudGoal.updatedAt).getTime() : 0;
      
      if (cloudTime > localTime) {
        // Cloud is newer
        goalMap.set(cloudGoal.date, cloudGoal);
      }
      // else keep local (it's newer or same)
    }
  });
  
  return Array.from(goalMap.values());
}
