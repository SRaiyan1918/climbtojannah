import { Navigate,Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
export function RequireAuth(){const{user,loading}=useAuth();if(loading)return <main className="page" aria-busy="true"><p role="status">Loading account…</p></main>;if(!user)return <Navigate to="/login" replace/>;return <Outlet/>}
