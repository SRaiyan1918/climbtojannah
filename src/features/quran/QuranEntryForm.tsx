import { useState,type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import type { QuranActivityKind,QuranEntry } from '../data/schema';
import { toDateKey } from '../../lib/dates';

export function QuranEntryForm({onSave,disabled=false}:{onSave:(entry:Omit<QuranEntry,'id'>)=>Promise<void>;disabled?:boolean}){
  const[kind,setKind]=useState<QuranActivityKind>('reading');
  const[pages,setPages]=useState('');
  const[ayah,setAyah]=useState('');
  const[minutes,setMinutes]=useState('');
  const[note,setNote]=useState('');
  const[error,setError]=useState('');
  const[submitting,setSubmitting]=useState(false);

  async function submit(e:FormEvent){
    e.preventDefault();
    if(disabled||submitting)return;
    try{
      setSubmitting(true);
      setError('');
      await onSave({dateKey:toDateKey(),kind,pages:pages?Number(pages):undefined,ayah:ayah?Number(ayah):undefined,minutes:minutes?Number(minutes):undefined,note:note.trim()||undefined,createdAt:new Date().toISOString()});
      setPages('');setAyah('');setMinutes('');setNote('');
    }catch(err){setError(err instanceof Error?err.message:'Could not save activity.');}
    finally{setSubmitting(false);}
  }

  const locked=disabled||submitting;
  return <form className="quran-form" onSubmit={submit}>
    <label>Activity<select disabled={locked} value={kind} onChange={e=>setKind(e.target.value as QuranActivityKind)}><option value="reading">Reading</option><option value="memorization">Memorization</option><option value="revision">Revision</option><option value="tafsir">Tafsir / study</option></select></label>
    <div className="metric-grid"><label>Pages<input disabled={locked} type="number" min="0" value={pages} onChange={e=>setPages(e.target.value)}/></label><label>Ayah<input disabled={locked} type="number" min="0" value={ayah} onChange={e=>setAyah(e.target.value)}/></label><label>Minutes<input disabled={locked} type="number" min="0" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label></div>
    <label>Private note<textarea disabled={locked} rows={3} value={note} onChange={e=>setNote(e.target.value)} placeholder="What did you read or revise?"/></label>
    {error&&<p className="form-error" role="alert">{error}</p>}
    <Button disabled={locked}>{submitting?'Saving…':'Add activity'}</Button>
  </form>;
}
