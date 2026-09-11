import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { completionsPath, routinesPath } from '../data/paths';
import type { DailyCompletion, RoutineGoal } from '../data/schema';

export async function listRoutines(uid: string) {
  const snap = await getDocs(query(collection(db, routinesPath(uid)), orderBy('order')));
  return snap.docs.map(item => item.data() as RoutineGoal);
}
export async function saveRoutine(uid: string, goal: RoutineGoal) { await setDoc(doc(db, routinesPath(uid), goal.id), goal); }
export async function removeRoutine(uid: string, id: string) { await deleteDoc(doc(db, routinesPath(uid), id)); }
export async function getDailyCompletion(uid: string, dateKey: string): Promise<DailyCompletion> {
  const snap = await getDoc(doc(db, completionsPath(uid), dateKey));
  return snap.exists() ? snap.data() as DailyCompletion : { dateKey, completedGoalIds: [], updatedAt: new Date().toISOString() };
}
export async function saveDailyCompletion(uid: string, value: DailyCompletion) { await setDoc(doc(db, completionsPath(uid), value.dateKey), value, { merge: true }); }
