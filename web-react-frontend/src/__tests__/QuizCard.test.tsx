import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuizCard } from '../components/QuizCard';
import type { Quiz } from '../models/QuizModel';
import { useUserContext } from '../context/UserContext';
import { useQuizContext } from '../context/QuizContext';
import { deleteQuiz, editQuiz } from '../services/QuizService';

// MOCKS
vi.mock('../context/UserContext', () => ({
  useUserContext: vi.fn(),
}));

vi.mock('../context/QuizContext', () => ({
  useQuizContext: vi.fn(),
}));

vi.mock('../services/QuizService', () => ({
  deleteQuiz: vi.fn(),
  editQuiz: vi.fn(),
  setQuizDifficultyText: vi.fn((id: number) => `DIFFICULTY_${id}`),
}));

vi.mock('../components/ButtonWithImage', () => ({
  default: ({ onClick, alt }: any) => (
    <button onClick={onClick}>{alt}</button>
  ),
}));

vi.mock('../components/QuizInformationCard', () => ({
  QuizInformationCard: ({ quizId }: any) => (
    <div data-testid="quiz-info">Quiz {quizId}</div>
  ),
}));

vi.mock('../components/EditQuizModal', () => ({
  default: ({ onClose, onEditQuiz, quizId }: any) => (
    <div data-testid="edit-modal">
      <button onClick={onClose}>Close</button>
      <button
        onClick={() =>
          onEditQuiz({
            id: quizId,
            allQuizCategories: mockCategories,
          })
        }
      >
        Save
      </button>
    </div>
  ),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
  },
}));

vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

// TEST DATA
const quiz: Quiz = {
  id: 1,
  title: 'Test Quiz',
  description: 'Quiz used for unit testing',
  timeLimitSeconds: 60,
  quizDifficultyId: 1,
  allQuizCategories: [
    { id: 1, name: 'Math', isUsed: false },
  ],
  questions: [],
  results: [],
};

const quiz2: Quiz = {
  id: 2,
  title: 'Test Quiz 2',
  description: 'Quiz 2 used for unit testing ',
  timeLimitSeconds: 60,
  quizDifficultyId: 2,
  allQuizCategories: [],
  questions: [],
  results: [],
};

const quizzes: Quiz[] = [quiz];

// HELPERS
let mockCategories: any[] = [{ id: 1 }];
const mockSetQuizzes = vi.fn();
const mockLogout = vi.fn();

const renderComponent = (isAdmin = true) => {
  (useUserContext as any).mockReturnValue({
    user: isAdmin ? { isAdmin: true } : { isAdmin: false },
    handleLogout: mockLogout,
  });

  (useQuizContext as any).mockReturnValue({
    quizzes,
    setQuizzes: mockSetQuizzes,
  });

  render(<QuizCard quizId={1} />);
};

const renderComponent2 = (
  isAdmin = true,
  customQuizzes: Quiz[] = quizzes
) => {
  (useUserContext as any).mockReturnValue({
    user: isAdmin ? { isAdmin: true } : { isAdmin: false },
    handleLogout: mockLogout,
  });

  (useQuizContext as any).mockReturnValue({
    quizzes: customQuizzes,
    setQuizzes: mockSetQuizzes,
  });

  render(<QuizCard quizId={2} />);
};

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window, 'alert').mockImplementation(() => {});
  vi.spyOn(window, 'confirm').mockImplementation(() => true);
});

// TESTS
describe('QuizCard', () => {

  it('renders quiz information', () => {
    renderComponent();

    expect(screen.getByTestId('quiz-info')).toBeInTheDocument();
  });

  it('renders edit and delete buttons for admin', () => {
    renderComponent(true);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders start quiz link for regular user', () => {
    renderComponent(false);

    expect(screen.getByText('Start quiz')).toHaveAttribute(
      'href',
      '/StartQuizPage/1'
    );
  });

  it('opens edit modal when edit button is clicked', () => {
    renderComponent(true);

    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });

  it('calls editQuiz and updates quizzes on save', async () => {
    (editQuiz as any).mockResolvedValue({
      editedQuiz: { ...quiz, id: 1 },
    });

    renderComponent(true);

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(editQuiz).toHaveBeenCalled();
      expect(mockSetQuizzes).toHaveBeenCalled();
    });
  });

  it('opens edit modal on edit click', () => {
    renderComponent2(true, [quiz2]);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });

  it('shows alert when saving quiz without categories', async () => {
    mockCategories = [];
    
    renderComponent2(true, [quiz2]);
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("A quiz needs to have at least one category.");
    });
  });

  it('calls deleteQuiz and removes quiz when confirmed', async () => {
    (deleteQuiz as any).mockResolvedValue({
      deletedQuizId: 1,
    });

    renderComponent(true);

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(deleteQuiz).toHaveBeenCalledWith(1, mockLogout);
      expect(mockSetQuizzes).toHaveBeenCalled();
    });
  });

  it('does not delete quiz if confirm is cancelled', async () => {
    (window.confirm as any).mockReturnValue(false);

    renderComponent(true);

    fireEvent.click(screen.getByText('Delete'));

    expect(deleteQuiz).not.toHaveBeenCalled();
  });

  it('renders "Quiz not found" if quiz does not exist', () => {
    renderComponent2(true, []);

    expect(screen.getByText('Quiz not found')).toBeInTheDocument();
  });
});
