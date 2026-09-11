import { beforeEach, expect, test, vi } from 'vitest';
const signInWithPopup=vi.fn();const signInWithEmailAndPassword=vi.fn();const createUserWithEmailAndPassword=vi.fn();const updateProfile=vi.fn();const sendEmailVerification=vi.fn();const sendPasswordResetEmail=vi.fn();const signOut=vi.fn();
vi.mock('../../lib/firebase',()=>({auth:{}}));
vi.mock('firebase/auth',()=>({GoogleAuthProvider:class{},signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile,sendEmailVerification,sendPasswordResetEmail,signOut}));
beforeEach(()=>vi.clearAllMocks());
test('Google sign-in returns user',async()=>{signInWithPopup.mockResolvedValue({user:{uid:'u1'}});const{signInWithGoogle}=await import('./authService');expect((await signInWithGoogle()).uid).toBe('u1');});
