import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { test, vi } from 'vitest';

vi.mock('../lib/firebase', () => ({ auth: {}, db: {} }));
vi.mock('../features/auth/AuthProvider', async () => {
  const actual = await vi.importActual<typeof import('../features/auth/AuthProvider')>('../features/auth/AuthProvider');
  return {
    ...actual,
    AuthProvider: ({ children }: { children: ReactNode }) => children,
    useAuth: () => ({ user: null, loading: false }),
  };
});

import { App } from './App';

test('renders product name in the signed-out experience', async () => {
  render(<App />);
  expect(await screen.findByText('Climb to Jannah')).toBeInTheDocument();
});
