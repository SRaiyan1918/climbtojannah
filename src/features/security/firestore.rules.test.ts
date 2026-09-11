// @vitest-environment node
import { afterAll, beforeAll, describe, test } from 'vitest';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { cleanupRulesEnvironment, getRulesEnvironment } from '../../test/firebaseEmulator';

const validRoutine={id:'r1',title:'Fajr',category:'deen',enabled:true,order:0,scheduleDays:[0,1,2,3,4,5,6],createdAt:'2026-09-11T00:00:00.000Z',updatedAt:'2026-09-11T00:00:00.000Z'};
const describeRules = process.env.FIRESTORE_EMULATOR_HOST ? describe : describe.skip;
describeRules('Firestore privacy rules',()=>{
  beforeAll(async()=>{await getRulesEnvironment();}); afterAll(cleanupRulesEnvironment);
  test('owner can write own routine and another user cannot read/write it',async()=>{const env=await getRulesEnvironment();const owner=env.authenticatedContext('u1').firestore();const other=env.authenticatedContext('u2').firestore();await assertSucceeds(setDoc(doc(owner,'users/u1/routines/r1'),validRoutine));await assertFails(getDoc(doc(other,'users/u1/routines/r1')));await assertFails(setDoc(doc(other,'users/u1/routines/r2'),{...validRoutine,id:'r2'}));});
  test('unauthenticated access is denied',async()=>{const env=await getRulesEnvironment();const db=env.unauthenticatedContext().firestore();await assertFails(getDoc(doc(db,'users/u1/routines/r1')));});
  test('routine validation rejects empty titles',async()=>{const env=await getRulesEnvironment();const db=env.authenticatedContext('u1').firestore();await assertFails(setDoc(doc(db,'users/u1/routines/bad'),{...validRoutine,id:'bad',title:''}));});
});
