import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders product name', () => {
  render(<App />);
  expect(screen.getByText('Climb to Jannah')).toBeInTheDocument();
});
