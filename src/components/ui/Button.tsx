import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import './ui.css';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }>;
export function Button({ variant='primary', className='', children, ...props }: ButtonProps) { return <button className={`button button--${variant} ${className}`.trim()} {...props}>{children}</button>; }
