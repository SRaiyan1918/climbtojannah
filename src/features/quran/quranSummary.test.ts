import { expect,test } from 'vitest';import { summarizeQuranDay } from './quranSummary';
test('summarizes mixed activity',()=>{expect(summarizeQuranDay([{kind:'reading',pages:4,minutes:12},{kind:'revision',ayah:8,minutes:10}])).toMatchObject({sessions:2,pages:4,ayah:8,minutes:22})});
