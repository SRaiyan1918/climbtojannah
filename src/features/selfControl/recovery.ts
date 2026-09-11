import { differenceInCalendarDays } from 'date-fns';import { localDayStart } from '../../lib/dates';
export function cleanDaysSince(startedAt:string,lastSlipAt:string|undefined,now=new Date()){const start=localDayStart(lastSlipAt??startedAt);const end=localDayStart(now);return Math.max(0,differenceInCalendarDays(end,start))}
