import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Header from './Header.svelte'; 

describe('Header component', () => {
  it('renders the title prop correctly', () => {
    const testTitle = 'Test Header Title';
    
    render(Header, { title: testTitle });
    
    const headerElement = screen.getByRole('heading', { level: 1 });
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveTextContent(testTitle);
  });
});