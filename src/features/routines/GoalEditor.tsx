import { useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
export function GoalEditor({ onAdd }:{ onAdd:(title:string,category:'deen'|'dunya')=>Promise<void> }) {
  const [title,setTitle]=useState(''); const [category,setCategory]=useState<'deen'|'dunya'>('dunya'); const [saving,setSaving]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();if(!title.trim())return;setSaving(true);try{await onAdd(title,category);setTitle('')}finally{setSaving(false)}}
  return <form className="goal-editor" onSubmit={submit}><label><span>Goal title</span><input value={title} maxLength={120} onChange={e=>setTitle(e.target.value)} placeholder="Study 45 minutes"/></label><label><span>Category</span><select value={category} onChange={e=>setCategory(e.target.value as 'deen'|'dunya')}><option value="deen">Deen</option><option value="dunya">Dunya</option></select></label><Button disabled={saving||!title.trim()}>{saving?'Saving…':'Add goal'}</Button></form>;
}
