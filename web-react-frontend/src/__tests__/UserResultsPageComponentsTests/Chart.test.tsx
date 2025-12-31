import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Chart } from '../../components/UserResultsPageComponents/Chart';

// MOCKS
const mockResults = [
  {
    id: 1,
    scorePercentage: 50
  },
  {
    id: 2,
    scorePercentage: 80
  },
  {
    id: 3,
    scorePercentage: 0
  }
] as any;

// TESTS
describe('Chart', () => {
  it('renders chart labels', () => {
    render(<Chart results={mockResults} />);

    expect(screen.getByText(/Percentage/i)).toBeInTheDocument();
    expect(screen.getByText(/Attempt/i)).toBeInTheDocument();
  });

  it('renders correct number of bars', () => {
    const { container } = render(<Chart results={mockResults} />);

    const bars = container.querySelectorAll('div[style*="height"]');
    expect(bars.length).toBe(mockResults.length);
  });

  it('displays score percentage text inside bars', () => {
    render(<Chart results={mockResults} />);

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('applies correct height based on scorePercentage', () => {
    const { container } = render(<Chart results={mockResults} />);

    const bars = container.querySelectorAll('div[style*="height"]');

    expect(bars[0]).toHaveStyle({ height: '250px' });
    expect(bars[1]).toHaveStyle({ height: '400px' });
    expect(bars[2]).toHaveStyle({ height: '0px' });
  });

  it('alternates bar colors based on index', () => {
    const { container } = render(<Chart results={mockResults} />);

    const bars = container.querySelectorAll('div[style*="background-color"]');

    expect(bars[0]).toHaveStyle({ backgroundColor: '#1D7496' });
    expect(bars[1]).toHaveStyle({ backgroundColor: '#125169' });
    expect(bars[2]).toHaveStyle({ backgroundColor: '#1D7496' });
  });

  it('renders empty chart when results array is empty', () => {
    const { container } = render(<Chart results={[]} />);

    const bars = container.querySelectorAll('div[style*="height"]');
    expect(bars.length).toBe(0);
  });
});
