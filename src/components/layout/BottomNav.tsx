import { NavLink } from 'react-router-dom';
import { primaryNav } from './navigation';
import './layout.css';
export function BottomNav(){const items=primaryNav.filter(item=>['/','/routine','/salah','/quran','/progress'].includes(item.to));return <nav className="bottom-nav" aria-label="Mobile primary">{items.map(({to,label,icon:Icon})=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`bottom-link${isActive?' is-active':''}`}><Icon size={19} aria-hidden="true"/><span>{label}</span></NavLink>)}</nav>}
