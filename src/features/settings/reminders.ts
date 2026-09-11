import type { QuietHours } from '../data/schema';
export function isWithinQuietHours(time:string,quiet:QuietHours){if(!quiet.enabled)return false;const{start,end}=quiet;if(start===end)return true;if(start<end)return time>=start&&time<end;return time>=start||time<end}
export function reminderEligible(input:{enabled:boolean;nowTime:string;quietHours:QuietHours;due:boolean;alreadyShown:boolean}){return input.enabled&&input.due&&!input.alreadyShown&&!isWithinQuietHours(input.nowTime,input.quietHours)}
