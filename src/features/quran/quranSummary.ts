import type { QuranActivityKind } from '../data/schema';
type SummaryInput={kind:QuranActivityKind;pages?:number;ayah?:number;minutes?:number};
export function summarizeQuranDay(entries:SummaryInput[]){return entries.reduce((sum,item)=>({sessions:sum.sessions+1,pages:sum.pages+(item.pages??0),ayah:sum.ayah+(item.ayah??0),minutes:sum.minutes+(item.minutes??0)}),{sessions:0,pages:0,ayah:0,minutes:0})}
