import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import type { DailyCompletion, RoutineGoal } from '../data/schema';
import { toDateKey, weekdayIndex } from '../../lib/dates';
import { createDefaultGoals } from './defaultGoals';
import { getDailyCompletion, listRoutines, removeRoutine, saveDailyCompletion, saveRoutine } from './routineRepository';
import { goalForToday, moveGoal, orderedGoals } from './routineService';
import { calculateDailyConsistency } from './consistency';

export function useRoutines() {
  const { user } = useAuth();
  const [goals,setGoals] = useState<RoutineGoal[]>([]); const [completion,setCompletion] = useState<DailyCompletion>({dateKey:toDateKey(),completedGoalIds:[],updatedAt:new Date().toISOString()});
  const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  const load=useCallback(async()=>{if(!user)return;setLoading(true);try{let values=await listRoutines(user.uid);if(values.length===0){values=createDefaultGoals();await Promise.all(values.map(g=>saveRoutine(user.uid,g)));}setGoals(orderedGoals(values));setCompletion(await getDailyCompletion(user.uid,toDateKey()));setError('');}catch{setError('Could not load your routine. Check your connection and try again.');}finally{setLoading(false)}},[user]);
  useEffect(()=>{void load()},[load]);
  const todayGoals=useMemo(()=>goals.filter(g=>goalForToday(g,weekdayIndex())),[goals]);
  const score=calculateDailyConsistency(todayGoals.map(g=>g.id),completion.completedGoalIds);
  async function upsert(goal:RoutineGoal){if(!user)return;await saveRoutine(user.uid,goal);setGoals(prev=>orderedGoals([...prev.filter(g=>g.id!==goal.id),goal]));}
  async function add(title:string,category:'deen'|'dunya'){const now=new Date().toISOString();await upsert({id:crypto.randomUUID(),title:title.trim(),category,enabled:true,order:goals.length,scheduleDays:[0,1,2,3,4,5,6],createdAt:now,updatedAt:now});}
  async function remove(id:string){if(!user)return;await removeRoutine(user.uid,id);setGoals(prev=>prev.filter(g=>g.id!==id));}
  async function toggleGoal(id:string){if(!user)return;const ids=completion.completedGoalIds.includes(id)?completion.completedGoalIds.filter(x=>x!==id):[...completion.completedGoalIds,id];const next={...completion,completedGoalIds:ids,updatedAt:new Date().toISOString()};setCompletion(next);await saveDailyCompletion(user.uid,next);}
  async function reorder(id:string,direction:-1|1){if(!user)return;const next=moveGoal(goals,id,direction);setGoals(next);await Promise.all(next.map(g=>saveRoutine(user.uid,g)));}
  return {goals,todayGoals,completion,score,loading,error,add,upsert,remove,toggleGoal,reorder,reload:load};
}
