import { useCallback,useEffect,useState } from 'react';
import { Card } from '../../components/ui/Card';
import { StatusBanner } from '../../components/ui/StatusBanner';
import { toDateKey } from '../../lib/dates';
import { useAuth } from '../auth/AuthProvider';
import type { QuranEntry } from '../data/schema';
import { addQuranEntry,listQuranEntries } from './quranRepository';
import { summarizeQuranDay } from './quranSummary';
import { QuranEntryForm } from './QuranEntryForm';
import './quran.css';

export function QuranPage(){
  const{user}=useAuth();
  const[entries,setEntries]=useState<QuranEntry[]>([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState<string|null>(null);

  const load=useCallback(async()=>{
    if(!user)return;
    setError(null);
    try{setEntries(await listQuranEntries(user.uid,toDateKey()));}
    catch(cause){setError(cause instanceof Error?cause.message:'Could not load today’s Qur’an activity.');}
    finally{setLoading(false);}
  },[user]);

  useEffect(()=>{void load()},[load]);
  const summary=summarizeQuranDay(entries);

  async function save(value:Omit<QuranEntry,'id'>){
    if(!user)throw new Error('Sign in to save activity.');
    const saved=await addQuranEntry(user.uid,value);
    setEntries(current=>[saved,...current.filter(entry=>entry.id!==saved.id)]);
  }

  return <main className="page">
    <div className="page-heading"><div><span className="eyebrow">Qur’an</span><h1>Read. Revise. Understand.</h1><p>A simple daily surface, with enough detail when you want it.</p></div></div>
    {error&&<StatusBanner tone="danger">{error}</StatusBanner>}
    {loading&&<p role="status">Loading today’s Qur’an activity…</p>}
    <div className="summary-strip"><div><strong>{summary.sessions}</strong><span>sessions</span></div><div><strong>{summary.pages}</strong><span>pages</span></div><div><strong>{summary.ayah}</strong><span>ayah</span></div><div><strong>{summary.minutes}</strong><span>minutes</span></div></div>
    <div className="grid-2"><Card><h2>Add today’s activity</h2><QuranEntryForm onSave={save} disabled={loading}/></Card><Card><h2>Today</h2><div className="quran-history">{entries.map(entry=><article key={entry.id}><strong>{entry.kind}</strong><p>{[entry.pages&&`${entry.pages} pages`,entry.ayah&&`${entry.ayah} ayah`,entry.minutes&&`${entry.minutes} min`].filter(Boolean).join(' · ')||'Reflection note'}</p>{entry.note&&<small>{entry.note}</small>}</article>)}{!loading&&entries.length===0&&<p className="muted">No Qur’an activity recorded today.</p>}</div></Card></div>
  </main>;
}
