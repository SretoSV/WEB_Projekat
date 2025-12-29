import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FinishedQuizResult } from '../components/FinishedQuizResults';

// MOCKS
const navigateMock = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

vi.mock('../components/ButtonWithText', () => ({
  default: ({ text, ...props }: any) => (
    <button {...props}>{text}</button>
  ),
}));

vi.mock('../components/ButtonWithLongText', () => ({
  default: ({ text, ...props }: any) => (
    <button {...props}>{text}</button>
  ),
}));

vi.mock('../components/CompareQuestionsAndAnswer', () => ({
  CompareQuestionAndAnswer: () => (
    <div data-testid="compare-component">Compare Component</div>
  ),
}));

const setFinishedQuizResultMock = vi.fn();

vi.mock('../context/QuizContext', () => ({
  useQuizContext: () => ({
    finishedQuizResult: {
      scorePercentage: 80,
    },
    setFinishedQuizResult: setFinishedQuizResultMock,
  }),
}));

vi.mock('../context/UserContext', () => ({
  useUserContext: () => ({
    user: {
      isAdmin: false,
    },
  }),
}));

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe('FinishedQuizResult', () => {

  it('renders score percentage', () => {
    render(<FinishedQuizResult selectedQuizId={1} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('renders CompareQuestionAndAnswer when result exists', () => {
    render(<FinishedQuizResult selectedQuizId={1} />);

    expect(screen.getByTestId('compare-component')).toBeInTheDocument();
  });

  it('clears finishedQuizResult when clicking Try Again', () => {
    render(<FinishedQuizResult selectedQuizId={1} />);

    fireEvent.click(screen.getByText('Try Again'));

    expect(setFinishedQuizResultMock).toHaveBeenCalledWith(null);
  });

  it('clears result and navigates to user quizzes page', () => {
    render(<FinishedQuizResult selectedQuizId={1} />);

    fireEvent.click(screen.getByText('Quiz page'));

    expect(setFinishedQuizResultMock).toHaveBeenCalledWith(null);
    expect(navigateMock).toHaveBeenCalledWith('../UserAllQuizzesPage');
  });

});
