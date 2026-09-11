import type { PropsWithChildren } from 'react';
import './ui.css';
export function StatusBanner({ tone='info', children }: PropsWithChildren<{ tone?: 'info'|'warning'|'danger'|'success' }>) { return <div className={`status-banner status-banner--${tone}`} role="status">{children}</div>; }
