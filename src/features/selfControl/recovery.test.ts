import { expect,test } from 'vitest';import { cleanDaysSince } from './recovery';
test('streak restarts after latest slip',()=>{expect(cleanDaysSince('2026-09-01','2026-09-08',new Date('2026-09-11T12:00:00Z'))).toBe(3)});
