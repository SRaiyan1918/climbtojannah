import { render,screen } from '@testing-library/react';import { test,expect } from 'vitest';import { JournalPreview } from './JournalPreview';
test('does not execute journal HTML',()=>{render(<JournalPreview body={'<img src=x onerror="alert(1)">'}/>);expect(screen.getByText('<img src=x onerror="alert(1)">')).toBeInTheDocument();expect(document.querySelector('img')).toBeNull()});
