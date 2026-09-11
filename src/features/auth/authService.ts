import { createUserWithEmailAndPassword,GoogleAuthProvider,sendEmailVerification,sendPasswordResetEmail,signInWithEmailAndPassword,signInWithPopup,signOut,updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
const provider=new GoogleAuthProvider();
export async function signInWithGoogle(){return(await signInWithPopup(auth,provider)).user}
export async function signInWithEmail(email:string,password:string){return(await signInWithEmailAndPassword(auth,email,password)).user}
export async function registerWithEmail(email:string,password:string,displayName:string){const credential=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(credential.user,{displayName:displayName.trim()});await sendEmailVerification(credential.user);return credential.user}
export async function sendPasswordReset(email:string){await sendPasswordResetEmail(auth,email)}
export async function logout(){await signOut(auth)}
export function readableAuthError(error:unknown){const code=typeof error==='object'&&error&&'code'in error?String((error as{code:string}).code):'';const messages:Record<string,string>={'auth/email-already-in-use':'An account already uses this email.','auth/invalid-credential':'Email or password is incorrect.','auth/invalid-email':'Enter a valid email address.','auth/popup-closed-by-user':'Google sign-in was closed before completion.','auth/too-many-requests':'Too many attempts. Please try again later.','auth/weak-password':'Choose a stronger password.'};return messages[code]??'Something went wrong. Please try again.'}
