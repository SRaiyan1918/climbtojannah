import { createContext,useContext,useEffect,useMemo,useState,type PropsWithChildren } from 'react';
import { onAuthStateChanged,type User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
type AuthState={user:User|null;loading:boolean};const AuthContext=createContext<AuthState|undefined>(undefined);
export function AuthProvider({children}:PropsWithChildren){const[user,setUser]=useState<User|null>(null);const[loading,setLoading]=useState(true);useEffect(()=>onAuthStateChanged(auth,next=>{setUser(next);setLoading(false)}),[]);const value=useMemo(()=>({user,loading}),[user,loading]);return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('useAuth must be used inside AuthProvider');return value}
