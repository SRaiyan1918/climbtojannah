import { NavLink } from 'react-router-dom';
import { primaryNav } from './navigation';
import './layout.css';
export function Sidebar(){return <aside className="sidebar" aria-label="Primary"><div className="brand-lockup"><span className="brand-mark" aria-hidden="true">۞</span><div><strong>Climb to Jannah</strong><small>Grow with purpose.</small></div></div><nav className="sidebar-nav">{primaryNav.map(({to,label,icon:Icon})=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`nav-link${isActive?' is-active':''}`}><Icon size={18} aria-hidden="true"/><span>{label}</span></NavLink>)}</nav><div className="sidebar-note"><span className="eyebrow">Private by default</span><p>Your worship and reflections are yours.</p></div></aside>}
