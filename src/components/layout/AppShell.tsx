import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import './layout.css';
export function AppShell(){return <div className="app-frame"><Sidebar/><div className="app-main"><TopBar/><Outlet/></div><BottomNav/></div>}
