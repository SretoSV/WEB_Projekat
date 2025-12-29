import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StartQuizInfo } from '../components/StartQuizInfo';
import type { Quiz } from '../models/QuizModel';

// MOCK framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// MOCK DATA
const mockQuiz: Quiz = {
  id: 1,
  title: 'Test Quiz',
  description: 'Test description',
  quizDifficultyId: 1,
  timeLimitSeconds: 125,
  questions: [
    { id: 1 } as any,
    { id: 2 } as any,
    { id: 3 } as any,
  ],
  allQuizCategories: [],
  results: [],
};

// TESTS
describe('StartQuizInfo', () => {

  it('renders quiz title', () => {
    render(<StartQuizInfo quiz={mockQuiz} onStartQuiz={vi.fn()} />);

    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
  });

  it('renders number of questions', () => {
    render(<StartQuizInfo quiz={mockQuiz} onStartQuiz={vi.fn()} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders formatted time limit', () => {
    render(<StartQuizInfo quiz={mockQuiz} onStartQuiz={vi.fn()} />);

    expect(screen.getByText(/125 sec/i)).toBeInTheDocument();
    expect(screen.getByText(/02:05 min/i)).toBeInTheDocument();
  });

  it('calls onStartQuiz when Start button is clicked', () => {
    const onStartQuizMock = vi.fn();

    render(<StartQuizInfo quiz={mockQuiz} onStartQuiz={onStartQuizMock} />);

    fireEvent.click(screen.getByText('Start'));

    expect(onStartQuizMock).toHaveBeenCalledTimes(1);
  });

});
