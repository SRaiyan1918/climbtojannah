import { initializeApp } from 'firebase/app';
import { connectAuthEmulator,getAuth } from 'firebase/auth';
import { connectFirestoreEmulator,initializeFirestore,persistentLocalCache,persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig={
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY||'AIzaSyCh2NU6B9XgZe3wJ0nqRZpZlb-CqVBEcsQ',
  authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN||'climb-to-jannah.firebaseapp.com',
  projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID||'climb-to-jannah',
  storageBucket:import.meta.env.VITE_FIREBASE_STORAGE_BUCKET||'climb-to-jannah.firebasestorage.app',
  messagingSenderId:import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID||'1063545296291',
  appId:import.meta.env.VITE_FIREBASE_APP_ID||'1:1063545296291:web:9bb3204542dfa7ec8cb616',
  measurementId:import.meta.env.VITE_FIREBASE_MEASUREMENT_ID||'G-SP62WZCPXC'
};

export const firebaseApp=initializeApp(firebaseConfig);
export const auth=getAuth(firebaseApp);
export const db=initializeFirestore(firebaseApp,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})});
if(import.meta.env.VITE_USE_FIREBASE_EMULATORS==='true'){
  connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
  connectFirestoreEmulator(db,'127.0.0.1',8080);
}
