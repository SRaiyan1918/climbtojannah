import type { HTMLAttributes, PropsWithChildren } from 'react';
import './ui.css';
export function Card({ className='', children, ...props }: PropsWithChildren<HTMLAttributes<HTMLElement>>) { return <section className={`card ${className}`.trim()} {...props}>{children}</section>; }
