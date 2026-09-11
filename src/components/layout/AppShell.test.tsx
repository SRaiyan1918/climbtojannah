import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

test('shows core navigation',()=>{render(<MemoryRouter><AppShell /></MemoryRouter>);expect(screen.getByRole('link',{name:/dashboard/i})).toBeInTheDocument();expect(screen.getByRole('link',{name:/routine/i})).toBeInTheDocument();expect(screen.getByRole('link',{name:/progress/i})).toBeInTheDocument();});
