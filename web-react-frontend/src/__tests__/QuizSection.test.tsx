import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizzesSection } from '../components/QuizSection';
import { useQuizContext } from '../context/QuizContext';
import { useUserContext } from '../context/UserContext';
import { fetchCategories } from '../services/QuizCategoryService';
import type { Quiz } from '../models/QuizModel';

// MOCKS
vi.mock('../context/QuizContext', () => ({
  useQuizContext: vi.fn(),
}));

vi.mock('../context/UserContext', () => ({
  useUserContext: vi.fn(),
}));

vi.mock('../services/QuizCategoryService', () => ({
  fetchCategories: vi.fn(),
}));

vi.mock('../components/QuizCard', () => ({
  QuizCard: ({ quizId }: { quizId: number }) => (
    <div data-testid="quiz-card">Quiz {quizId}</div>
  ),
}));

vi.mock('../components/AddQuizModal', () => ({
  default: ({ onClose }: any) => (
    <div data-testid="add-quiz-modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// TEST DATA
const quizzes: Quiz[] = [
  {
    id: 1,
    title: 'Quiz One',
    description: '',
    quizDifficultyId: 1,
    timeLimitSeconds: 60,
    questions: [],
    allQuizCategories: [{ id: 1, name: 'Math', isUsed: true }],
    results: [] 
  },
  {
    id: 2,
    title: 'Quiz Two',
    description: '',
    quizDifficultyId: 2,
    timeLimitSeconds: 60,
    questions: [],
    allQuizCategories: [{ id: 2, name: 'Science', isUsed: true }],
    results: []
  },
];

// HELPERS
const renderComponent = ({
  user = { isAdmin: false },
  loadingQuizzes = false,
}: {
  user?: any;
  loadingQuizzes?: boolean;
} = {}) => {
  (useUserContext as any).mockReturnValue({
    user,
    handleLogout: vi.fn(),
  });

  (useQuizContext as any).mockReturnValue({
    quizzes,
    setQuizzes: vi.fn(),
    loadingQuizzes,
  });

  (fetchCategories as any).mockResolvedValue({
    categories: [
      { id: 1, name: 'Math' },
      { id: 2, name: 'Science' },
    ],
  });

  render(<QuizzesSection />);
};

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe('QuizzesSection', () => {

  it('renders loading state when quizzes or categories are loading', () => {
    renderComponent({ loadingQuizzes: true });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders quizzes after loading', async () => {
    renderComponent();

    expect(await screen.findAllByTestId('quiz-card')).toHaveLength(2);
  });

  it('renders Add Quiz button only for admin user', async () => {
    renderComponent({
      user: { isAdmin: true },
    });

    expect(await screen.findByText('Add quiz')).toBeInTheDocument();
  });

  it('does NOT render Add Quiz button for non-admin user', async () => {
    renderComponent({
      user: { isAdmin: false },
    });
    
    expect(screen.queryByText('Add quiz')).not.toBeInTheDocument();
  });

  it('opens and closes AddQuizModal', async () => {
    renderComponent({
      user: { isAdmin: true },
    });

    const addButton = await screen.findByText('Add quiz');
    fireEvent.click(addButton);

    expect(screen.getByTestId('add-quiz-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));

    expect(screen.queryByTestId('add-quiz-modal')).not.toBeInTheDocument();
  });

  it('filters quizzes by search input', async () => {
    renderComponent();

    const searchInput = await screen.findByPlaceholderText('Search...');

    fireEvent.change(searchInput, {
      target: { value: 'Two' },
    });

    const cards = screen.getAllByTestId('quiz-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('Quiz 2');
  });

  it('filters quizzes by category dropdown', async () => {
    renderComponent();

    const categorySelect = await screen.findByDisplayValue('All Categories');

    fireEvent.change(categorySelect, {
      target: { value: 'Math' },
    });

    const cards = screen.getAllByTestId('quiz-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('Quiz 1');
  });

});
