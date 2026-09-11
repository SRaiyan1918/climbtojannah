import { Link } from 'react-router-dom';
import { CircleHelp } from 'lucide-react';
import './layout.css';
export function TopBar(){return <header className="topbar"><div className="mobile-brand"><span className="brand-mark" aria-hidden="true">۞</span><strong>Climb to Jannah</strong></div><div className="topbar-spacer"/><Link className="icon-link" to="/support" aria-label="Help and support"><CircleHelp size={20}/></Link></header>}
