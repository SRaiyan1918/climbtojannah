import type { PrayerName } from '../data/schema';
export type CalculationMethodId='muslim-world-league'|'egyptian'|'karachi'|'umm-al-qura'|'north-america';
export interface PrayerTimeInput{latitude:number;longitude:number;date:Date;method:CalculationMethodId;madhab:'shafi'|'hanafi'}
export interface PrayerTimeItem{name:PrayerName;time:Date}
