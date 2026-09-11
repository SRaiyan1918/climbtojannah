import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBanner } from '../../components/ui/StatusBanner';
import { toDateKey } from '../../lib/dates';
import { useAuth } from '../auth/AuthProvider';
import type { PrayerDay, PrayerName } from '../data/schema';
import { getPrayerDay, getPrayerSettings, savePrayerSettings, togglePrayer } from './salahRepository';
import { getPrayerTimes } from './prayerTimes';
import { PrayerSetup, type PrayerConfig } from './PrayerSetup';
import './salah.css';

const labels: Record<PrayerName, string> = { fajr:'Fajr', dhuhr:'Dhuhr', asr:'Asr', maghrib:'Maghrib', isha:'Isha' };
const prayerOrder: PrayerName[] = ['fajr','dhuhr','asr','maghrib','isha'];
const blankConfig: PrayerConfig = { latitude:0, longitude:0, method:'karachi', madhab:'hanafi' };

export function SalahPage(){
  const { user } = useAuth();
  const [day,setDay] = useState<PrayerDay|null>(null);
  const [config,setConfig] = useState<PrayerConfig|null>(null);
  const [showSetup,setShowSetup] = useState(false);
  const [loading,setLoading] = useState(true);
  const [savingPrayer,setSavingPrayer] = useState<PrayerName|null>(null);
  const [error,setError] = useState<string|null>(null);

  useEffect(()=>{
    if(!user)return;
    let active=true;
    setLoading(true);
    setError(null);
    void Promise.all([getPrayerDay(user.uid,toDateKey()),getPrayerSettings(user.uid)])
      .then(([d,s])=>{
        if(!active)return;
        setDay(d);
        if(s.prayerLocation){
          setConfig({ latitude:s.prayerLocation.latitude, longitude:s.prayerLocation.longitude, method:(s.prayerCalculationMethod as PrayerConfig['method'])||'karachi', madhab:s.prayerMadhab||'hanafi' });
        }
      })
      .catch(cause=>{if(active)setError(cause instanceof Error?cause.message:'Could not load today’s Salah data.');})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[user]);

  const times=useMemo(()=>config?getPrayerTimes({...config,date:new Date()}):[],[config]);
  const timeMap=useMemo(()=>new Map(times.map(item=>[item.name,item.time])),[times]);

  async function mark(name:PrayerName){
    if(!user||!day||savingPrayer)return;
    setSavingPrayer(name);
    setError(null);
    try{setDay(await togglePrayer(user.uid,day,name));}
    catch(cause){setError(cause instanceof Error?cause.message:'Could not update Salah.');}
    finally{setSavingPrayer(null);}
  }

  async function save(value:PrayerConfig){
    if(!user)return;
    try{
      await savePrayerSettings(user.uid,{prayerLocation:{latitude:value.latitude,longitude:value.longitude},prayerCalculationMethod:value.method,prayerMadhab:value.madhab});
      setConfig(value);
      setShowSetup(false);
    }catch(cause){setError(cause instanceof Error?cause.message:'Could not save prayer settings.');}
  }

  return <main className="page"><div className="page-heading"><div><span className="eyebrow">Manual completion</span><h1>Salah</h1><p>Prayer times are guidance; a prayer is marked complete only when you choose it.</p></div><Button variant="secondary" onClick={()=>setShowSetup(v=>!v)}>{showSetup?'Close setup':'Prayer settings'}</Button></div>
    {error&&<StatusBanner tone="danger">{error}</StatusBanner>}
    {!config && <StatusBanner tone="info">Set a location only if you want prayer times. You can still track completed prayers without sharing location.</StatusBanner>}
    {showSetup&&<Card><h2>Prayer time setup</h2><p className="muted">No location is assumed. Use device location only by pressing the button, or enter coordinates manually.</p><PrayerSetup value={config??blankConfig} onSave={save}/></Card>}
    {loading&&<p role="status">Loading today’s Salah…</p>}
    <div className="prayer-grid">{prayerOrder.map(name=>{const time=timeMap.get(name);const completed=day?.completed[name]??false;return <Card key={name} className={`prayer-card ${completed?'is-complete':''}`}><span className="eyebrow">{labels[name]}</span><strong className="prayer-time">{time?format(time,'h:mm a'):'—'}</strong><small className="muted">{time?'Calculated for your saved location':'Time not configured'}</small><Button variant={completed?'secondary':'primary'} disabled={loading||!day||savingPrayer!==null} onClick={()=>void mark(name)}>{savingPrayer===name?'Saving…':completed?'Completed ✓':'Mark complete'}</Button></Card>})}</div>
  </main>;
}
